import { GameDocument } from '@/interfaces/games';
import { GameModel } from '@/models/game';

/**
 * createActiveGame
 * This creates a new Game Document
 */
export const createActiveGame = async (
  payload: Partial<GameDocument>
): Promise<GameDocument> => {
  return await GameModel.create(payload);
};

/**
 * getActiveGames
 * This fetches Game documents by Discord ID
 * @returns The Game documents or NULL
 */
export const getActiveGames = async (
  id: string
): Promise<GameDocument[] | null> => {
  return await GameModel.find({ discord_id: id });
};

/**
 * updateActiveGame
 * This updates a Game Document
 */
export const updateActiveGame = async (
  payload: Partial<GameDocument>
): Promise<GameDocument | null> => {
  return await GameModel.findOneAndUpdate(
    { discord_id: payload.discord_id, code: payload.code },
    {
      ...payload,
    },
    { new: true }
  );
};
