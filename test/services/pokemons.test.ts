import assert from 'assert';
import app from '../../src/app';

describe('\'pokemons\' service', () => {
  it('registered the service', () => {
    const service = app.service('pokemons');

    assert.ok(service, 'Registered the service');
  });
});
