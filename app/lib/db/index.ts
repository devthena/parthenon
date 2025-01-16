import { MongoClient, ServerApiVersion } from 'mongodb';

import { GameDocument } from '@/interfaces/games';
import { StatsDocument } from '@/interfaces/statistics';
import { UserDocument } from '@/interfaces/user';
import { DatabaseCollections } from '@/interfaces/db';

const mongodbName = process.env.MONGODB_NAME;
const mongodbURI = process.env.MONGODB_URI;

const gamesCollectionName = process.env.MONGODB_COLLECTION_GAMES;
const statsCollectionName = process.env.MONGODB_COLLECTION_STATS;
const usersCollectionName = process.env.MONGODB_COLLECTION_USERS;

if (
  !mongodbName ||
  !mongodbURI ||
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

export const initDatabase = async () => {
  let collections: DatabaseCollections | null = null;

  if (!globalThis._collectionsMongoDB) {
    await client.connect();

    const db = await client.db(mongodbName);
    const gamesCollection = db.collection<GameDocument>(gamesCollectionName);
    const statsCollection = db.collection<StatsDocument>(statsCollectionName);
    const usersCollection = db.collection<UserDocument>(usersCollectionName);

    collections = {
      games: gamesCollection,
      stats: statsCollection,
      users: usersCollection,
    };

    globalThis._collectionsMongoDB = collections;
  } else {
    collections = globalThis._collectionsMongoDB;
  }

  return collections;
};
