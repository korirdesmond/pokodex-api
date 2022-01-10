import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { hooks as redisCache } from 'feathers-redis-cache';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [redisCache.before()],
    get: [redisCache.before()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [redisCache.after({expiration: 3600})],
    get: [redisCache.after({expiration: 3600})],
    create: [],
    update: [],
    patch: [],
    remove: [redisCache.purge()]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
