import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { MethodNotAllowed } from '@feathersjs/errors';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fetch from 'node-fetch';

interface Data { }

interface Pokomon {
  name: string;
  id: number;
  abilities: Array<any>;
  types: Array<any>;
  sprite: string;
  stats: Array<any>;
}

interface ServiceOptions {}

export class Pokemons implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Array<Pokomon>> {
    const results: Array<Pokomon> = [];
    const limit: string = params?.query?.limit ? params?.query?.limit : `150`;
    let res:any = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    res = await res.json();
    const allPokemons = res.results;

    for (const pokemon of allPokemons) {
      let pokemonDetail:any = await fetch(pokemon.url);
      pokemonDetail = await pokemonDetail.json();

      const item: Pokomon = {
        name: pokemonDetail.name,
        id: pokemonDetail.id,
        abilities: pokemonDetail.abilities,
        types: pokemonDetail.types,
        sprite: pokemonDetail.sprites.front_default,
        stats: pokemonDetail.stats,
      };
      results.push(item);
    }
    return results;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<Data> {
    const pokemonService = this.app.service('pokemons');
    const res: Array<Pokomon> = await pokemonService.find();
    const pokemons = res.filter(item => item.id === Number(id));
    if (pokemons.length > 0) {
      return pokemons[0]
    } else {
      return {};
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (data: Data, params?: Params): Promise<Data> {

    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<Data> {
    throw new MethodNotAllowed();
  }
}
