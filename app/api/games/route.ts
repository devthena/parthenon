import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

import { DatabaseCollections } from '@/interfaces/db';
import { GamePayload } from '@/interfaces/games';
import { UserAuthMethod } from '@/interfaces/user';

import { GameCode, GameRequestType } from '@/enums/games';
import { initDatabase } from '@/lib/db';

import { handleCreateGame } from './handleCreate';
import { updateBlackjack } from './updateBlackjack';
import { updateWordle } from './updateWordle';

const handleUpdateGame = async (
  method: UserAuthMethod,
  id: string,
  payload: GamePayload,
  collections: DatabaseCollections
) => {
  let data = null;
  let discordId = null;

  let user = await collections.users.findOne({ [`${method}_id`]: id });
  if (!user) return null;

  if (method !== 'discord') {
    if (user.discord_id) discordId = user.discord_id;
  } else {
    discordId = id;
  }

  if (!discordId) return null;

  const game = await collections.games.findOne({
    discord_id: discordId,
    code: payload.code,
  });

  if (!game) return null;

  // make sure that the game key and payload key matches
  if (game.key !== payload.key) return null;

  const deleteGame = async (key: string) => {
    await collections.games.deleteOne({
      discord_id: discordId,
      key: key,
    });
  };

  // handle submission for Wordle game
  if (payload.code === GameCode.Wordle) {
    data = updateWordle(
      discordId,
      payload.data.sessionCode,
      game,
      collections,
      deleteGame
    );
  }

  // handle submission for Blackjack game
  else if (payload.code === GameCode.Blackjack) {
    data = updateBlackjack(
      discordId,
      payload.data.sessionCode,
      game,
      collections,
      deleteGame
    );
  }

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
    const collections = await initDatabase();

    if (payload.type === GameRequestType.Create) {
      responseData = await handleCreateGame(method, id, payload, collections);
    } else if (payload.type === GameRequestType.Update) {
      responseData = await handleUpdateGame(method, id, payload, collections);
    }
  } catch (error) {
    responseError = JSON.stringify(error);
  } finally {
    return NextResponse.json({
      data: responseData,
      error: responseError,
    });
  }
});
