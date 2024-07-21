import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

import { INITIAL_STATS } from '@/constants/stats';
import { MAX_ATTEMPTS, WORDLE_REWARDS } from '@/constants/wordle';

import { GameCode } from '@/enums/games';
import { UserAuthMethod, UserDocument } from '@/interfaces/user';

import { GameObject, GamePayload } from '@/types/games';
import { StatsObject } from '@/types/db';

import { decrypt } from '@/utils';

const mongodbURI = process.env.MONGODB_URI;
const mongodbName = process.env.MONGODB_NAME;

const gamesCollectionName = process.env.MONGODB_COLLECTION_GAMES;
const statsCollectionName = process.env.MONGODB_COLLECTION_STATS;
const usersCollectionName = process.env.MONGODB_COLLECTION_USERS;

if (
  !mongodbURI ||
  !mongodbName ||
  !gamesCollectionName ||
  !statsCollectionName ||
  !usersCollectionName
) {
  throw new Error('Missing necessary environment variables');
}

const client = new MongoClient(mongodbURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const updateGame = async (
  method: UserAuthMethod,
  id: string,
  payload: GamePayload
) => {
  await client.connect();

  const botDB = await client.db(mongodbName);
  const gamesCollection = botDB.collection<GameObject>(gamesCollectionName);
  const statsCollection = botDB.collection<StatsObject>(statsCollectionName);
  const usersCollection = botDB.collection<UserDocument>(usersCollectionName);

  let discordId = null;

  if (method !== 'discord') {
    const user = await usersCollection.findOne({ [`${method}_id`]: id });

    if (user?.discord_id) discordId = user.discord_id;
  } else {
    discordId = id;
  }

  let data = null;

  if (discordId) {
    const deleteGame = async (key: string) => {
      await gamesCollection.deleteOne({
        discord_id: discordId,
        key: key,
      });
    };

    const createGame = async () => {
      let gameData;
      const newKey = uuidv4();

      if (payload.code === GameCode.Wordle) {
        gameData = {
          answer: decrypt(payload.data.sessionKey),
          guesses: [],
        };
      }

      // @todo: add conditions for other games later
      // } else if (payload.code === GameCode.Blackjack) {
      // }

      await gamesCollection.insertOne({
        discord_id: discordId,
        key: newKey,
        code: payload.code,
        data: { ...gameData },
      });

      return {
        key: newKey,
      };
    };

    const game = await gamesCollection.findOne({
      discord_id: discordId,
      code: payload.code,
    });

    if (game) {
      if (!payload.key) {
        await deleteGame(game.key);
        data = await createGame();

        await client.close();
        return data;
      }

      // make sure that the game key and payload key matches
      if (game.key !== payload.key) {
        await client.close();
        return null;
      }

      // handle submission for Wordle game
      if (payload.code === GameCode.Wordle) {
        const guess = decrypt(payload.data.sessionCode);

        const newGuesses: string[] = [
          ...(game.data.guesses as string[]),
          guess,
        ];

        const isWin = guess === game.data.answer;
        const isAttempt = newGuesses.length < MAX_ATTEMPTS;

        if (isWin) {
          const stats =
            (await statsCollection.findOne({
              discord_id: discordId,
            })) ?? INITIAL_STATS;

          // add the user rewards
          await usersCollection.updateOne(
            { discord_id: discordId },
            { $inc: { cash: WORDLE_REWARDS[newGuesses.length - 1] } }
          );

          // update the user game stats
          const newDistribution = [...stats[GameCode.Wordle].distribution];
          newDistribution[newGuesses.length - 1] += 1;

          await statsCollection.updateOne(
            { discord_id: discordId },
            {
              $set: {
                [GameCode.Wordle]: {
                  currentStreak: stats[GameCode.Wordle].currentStreak + 1,
                  distribution: newDistribution,
                  maxStreak: Math.max(
                    stats[GameCode.Wordle].maxStreak,
                    stats[GameCode.Wordle].currentStreak + 1
                  ),
                  totalPlayed: stats[GameCode.Wordle].totalPlayed + 1,
                  totalWon: stats[GameCode.Wordle].totalWon + 1,
                },
              },
            },
            { upsert: true }
          );

          data = { key: uuidv4() };
          await deleteGame(game.key);
        } else if (isAttempt) {
          data = { key: uuidv4() };
          await gamesCollection.updateOne(
            { discord_id: discordId, key: game.key },
            {
              $set: {
                key: data.key,
                data: {
                  ...game.data,
                  guesses: newGuesses,
                },
              },
            }
          );
        } else {
          // add to total times played for a loss
          const stats =
            (await statsCollection.findOne({
              discord_id: discordId,
            })) ?? INITIAL_STATS;

          await statsCollection.updateOne(
            { discord_id: discordId },
            {
              $set: {
                [GameCode.Wordle]: {
                  ...stats[GameCode.Wordle],
                  currentStreak: 0,
                  totalPlayed: stats[GameCode.Wordle].totalPlayed + 1,
                },
              },
            }
          );

          data = { key: uuidv4() };
          await deleteGame(game.key);
        }
      }

      // @todo: add conditions for other games later
      // } else if (payload.code === GameCode.Blackjack) {
      // }
    } else {
      data = await createGame();
    }
  }

  await client.close();
  return data;
};

export const POST = withApiAuthRequired(async (request: NextRequest) => {
  const res = new NextResponse();
  const session = await getSession(request, res);

  if (!session) {
    return NextResponse.json({ data: null, error: 'Unauthorized' });
  }

  const userSub = session.user.sub.split('|');
  const method = userSub[1];
  const id = userSub[2];

  let responseData = null;
  let responseError = null;

  const payload = await request.json();

  try {
    responseData = await updateGame(method, id, payload);
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({
      data: responseData,
      error: responseError,
    });
  }
});
