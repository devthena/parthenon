import { GameCode } from '@/enums/games';
import { StatDocument } from '@/interfaces/stat';
import { StatModel } from '@/models/stat';

/**
 * createStats
 * This creates a new Game Document
 */
export const createStats = async (
  payload: Partial<StatDocument>
): Promise<StatDocument> => {
  return await StatModel.create(payload);
};

/**
 * getStats
 * This fetches Stat documents by Discord ID
 * @returns The Stat documents or NULL
 */
export const getStats = async (id: string): Promise<StatDocument[] | null> => {
  return await StatModel.findOne({ discord_id: id });
};

/**
 * updateStats
 * This updates a Stat Document
 */
export const updateStats = async (
  code: GameCode,
  payload: Partial<StatDocument>
): Promise<StatDocument | null> => {
  return await StatModel.findOneAndUpdate(
    { discord_id: payload.discord_id, code: code },
    { ...payload },
    { new: true }
  );
};
