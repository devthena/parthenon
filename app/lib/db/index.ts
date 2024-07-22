import { MongoClient, ServerApiVersion } from 'mongodb';

const mongodbURI = process.env.MONGODB_URI;

if (!mongodbURI) {
  throw new Error('Missing necessary environment variables');
}

const client = new MongoClient(mongodbURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const dbClientPromise: Promise<MongoClient> = client.connect();
