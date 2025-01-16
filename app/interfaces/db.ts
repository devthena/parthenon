import { Collection } from 'mongodb';

import { GameDocument } from './games';
import { StatsDocument } from './statistics';
import { UserDocument } from './user';

export interface DatabaseCollections {
  games: Collection<GameDocument>;
  stats: Collection<StatsDocument>;
  users: Collection<UserDocument>;
}
