import { v4 as uuidv4 } from 'uuid';

import { GameCode } from '@/enums/games';
import { GameObject, LeanGameDocument } from '@/interfaces/games';
import { decrypt } from '@/lib/utils';
import { GameModel } from '@/models/game';

import { updateBlackjackGame } from './blackjack';
import { updateWordleGame } from './wordle';

/**
 * createActiveGame
 * This creates a new Game Document
 */
export const createActiveGame = async (
  payload: GameObject
): Promise<GameObject> => {
  const updatedKey = uuidv4();
  const sessionKey = payload.data!.sessionKey as string;

  let updatedPayload: GameObject = {
    ...payload,
    key: updatedKey,
  };

  if (payload.code === GameCode.Blackjack) {
    const betString = decrypt(sessionKey);
    const bet = parseInt(betString, 10);

    updatedPayload = {
      ...updatedPayload,
      data: {
        bet,
      },
    };
  } else if (payload.code === GameCode.Wordle) {
    updatedPayload = {
      ...updatedPayload,
      data: {
        answer: decrypt(sessionKey),
        guesses: [],
      },
    };
  }

  const game = (await GameModel.create(updatedPayload)).toObject();
  const { _id, ...rest } = game as LeanGameDocument;

  return rest;
};

/**
 * deleteActiveGame
 * This deletes Game document by Discord ID
 * @returns The deleted Game document or NULL
 */
export const deleteActiveGame = async (
  id: string,
  code: GameCode
): Promise<GameObject | null> => {
  const game = await GameModel.findOneAndDelete({
    discord_id: id,
    code,
  }).lean<LeanGameDocument>();

  const { _id, ...rest } = game as LeanGameDocument;
  return rest;
};

/**
 * getActiveGames
 * This fetches Game documents by Discord ID
 * @returns The Game documents or NULL
 */
export const getActiveGames = async (
  id: string
): Promise<GameObject[] | null> => {
  const games = await GameModel.find({
    discord_id: id,
  }).lean<LeanGameDocument[]>();

  const activeGames = games.map((game: GameObject) => {
    const { _id, ...rest } = game as LeanGameDocument;
    return rest;
  });

  return activeGames;
};

/**
 * updateActiveGame
 * This updates a Game Document
 */
export const updateActiveGame = async (
  payload: GameObject
): Promise<Partial<GameObject> | null> => {
  const game = await GameModel.findOne({
    discord_id: payload.discord_id,
    code: payload.code,
  }).lean<LeanGameDocument>();

  if (!game) return null;
  if (game.key !== payload.key) return null;

  const { _id, ...rest } = game as LeanGameDocument;

  if (payload.code === GameCode.Blackjack) {
    return updateBlackjackGame(rest, payload);
  } else if (payload.code === GameCode.Wordle) {
    return updateWordleGame(rest, payload);
  } else {
    return null;
  }
};
