import * as migration_20261106_205953_initial from './20261106_205953_initial';
import * as migration_20261113_192353 from './20261113_192353';
import * as migration_20261114_193640 from './20261114_193640';
import * as migration_20261114_195155 from './20261114_195155';
import * as migration_20261114_195422 from './20261114_195422';

export const migrations = [
  {
    up: migration_20261106_205953_initial.up,
    down: migration_20261106_205953_initial.down,
    name: '20261106_205953_initial',
  },
  {
    up: migration_20261113_192353.up,
    down: migration_20261113_192353.down,
    name: '20261113_192353',
  },
  {
    up: migration_20261114_193640.up,
    down: migration_20261114_193640.down,
    name: '20261114_193640',
  },
  {
    up: migration_20261114_195155.up,
    down: migration_20261114_195155.down,
    name: '20261114_195155',
  },
  {
    up: migration_20261114_195422.up,
    down: migration_20261114_195422.down,
    name: '20261114_195422'
  },
];
