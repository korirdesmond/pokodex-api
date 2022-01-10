// Initializes the `pokemons` service on path `/pokemons`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Pokemons } from './pokemons.class';
import hooks from './pokemons.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'pokemons': Pokemons & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/pokemons', new Pokemons(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('pokemons');

  service.hooks(hooks);
}
