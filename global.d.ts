import { DatabaseCollections } from '@/interfaces/db';

declare global {
  var _collectionsMongoDB: DatabaseCollections | undefined;
}
