import { NextRequest, NextResponse } from 'next/server';
import { User } from '@clerk/nextjs/server';

import { DatabaseCollections } from '@/interfaces/db';
import { GamePayload } from '@/interfaces/games';
import { UserAuthMethod } from '@/interfaces/user-old';

import { GameCode, GameRequestType } from '@/enums/games';
import { initDatabase } from '@/lib/db';
import { withApiAuth } from '@/lib/utils';

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

export const POST = withApiAuth(async (request: NextRequest, user: User) => {
  const method = user.externalAccounts[0].provider.replace(
    'oauth_',
    ''
  ) as UserAuthMethod;

  const id = user.externalAccounts[0].externalId;

  let responseData = null;
  let responseError = null;

  const payload = await request.json();

  try {
    const collections = await initDatabase();

    if (!collections) {
      responseError = 'No database collections found.';
    } else if (payload.type === GameRequestType.Create) {
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
