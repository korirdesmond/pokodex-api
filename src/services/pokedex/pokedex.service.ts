// Initializes the `pokedex` service on path `/pokedex`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Pokedex } from './pokedex.class';
import createModel from '../../models/pokedex.model';
import hooks from './pokedex.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'pokedex': Pokedex & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/pokedex', new Pokedex(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('pokedex');

  service.hooks(hooks);
}
