import { HookContext, HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const getPokemon = async (
  context: HookContext,
): Promise<HookContext> => {
  const { app, id } = context;
  const pokemonService = app.service('pokemons');
  const pokemon = await pokemonService.get(id)
  context.result = { ...pokemon };

  return context;
};

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [getPokemon],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
