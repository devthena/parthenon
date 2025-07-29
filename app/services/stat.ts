import { GameCode } from '@/enums/games';
import { LeanStatDocument, StatObject } from '@/interfaces/stat';
import { StatModel } from '@/models/stat';

/**
 * createStats
 * This creates a new Game Document
 */
export const createStats = async (payload: StatObject): Promise<StatObject> => {
  const stats = (await StatModel.create(payload)).toObject();
  const { _id, ...rest } = stats as LeanStatDocument;

  return rest;
};

/**
 * getStats
 * This fetches Stat documents by Discord ID
 * @returns The Stat documents or NULL
 */
export const getStats = async (id: string): Promise<StatObject | null> => {
  const stats = await StatModel.findOne({
    discord_id: id,
  }).lean<LeanStatDocument>();

  if (!stats) return null;

  const { _id, ...rest } = stats as LeanStatDocument;
  return rest;
};

/**
 * updateStats
 * This updates a Stat Document
 */
export const updateStats = async (
  code: GameCode,
  payload: StatObject
): Promise<StatObject | null> => {
  const stats = await StatModel.findOneAndUpdate(
    { discord_id: payload.discord_id, code: code },
    { ...payload },
    { new: true }
  ).lean<LeanStatDocument>();

  if (!stats) return null;

  const { _id, ...rest } = stats as LeanStatDocument;
  return rest;
};
