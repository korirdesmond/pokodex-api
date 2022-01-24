import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const validateUserData = async (
  context: HookContext,
): Promise<HookContext> => {
  const { data } = context;
  const passwordRegex = /^(?!.*\s)(?=.*[a-zA-Z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{14,}$/;
  const usernameReqex = /(?=^.{4,8}$)^[A-Za-z]+[0-9_@./#&+-]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.email) throw new BadRequest('Email is required');
  if (!emailRegex.test(data.email)) throw new BadRequest('Email is not valid');
  if (!data.username) throw new BadRequest('username is required');
  if (!usernameReqex.test(data.username) ) throw new BadRequest('username should be between 4 - 8 characters and only allows latin letters and optional digits or special characters (-, ., _)');
  if (!data.password) throw new BadRequest('password is required');
  if (!passwordRegex.test(data.password)) throw new BadRequest('password should contain at least 8 characters and at least on special characters');

  return context;
};

export default {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [validateUserData, hashPassword('password') ],
    update: [ hashPassword('password'),  authenticate('jwt') ],
    patch: [ hashPassword('password'),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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
