import assert from 'assert';
import app from '../../src/app';

describe('\'pokedex\' service', () => {
  it('registered the service', () => {
    const service = app.service('pokedex');

    assert.ok(service, 'Registered the service');
  });
});
