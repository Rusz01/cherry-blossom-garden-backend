import * as migration_20261106_205953_initial from './20261106_205953_initial';
import * as migration_20261113_192353 from './20261113_192353';

export const migrations = [
  {
    up: migration_20261106_205953_initial.up,
    down: migration_20261106_205953_initial.down,
    name: '20261106_205953_initial',
  },
  {
    up: migration_20261113_192353.up,
    down: migration_20261113_192353.down,
    name: '20261113_192353'
  },
];
