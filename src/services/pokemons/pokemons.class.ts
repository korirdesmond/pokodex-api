import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { BadRequest, MethodNotAllowed } from '@feathersjs/errors';
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
  species: Array<any>;
  stats: Array<any>;
  favourite?: boolean;
  description: string;
}

interface Pokedex {
  pokemonId?: number;
  id?: number;
  favourite?: boolean;
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
    const limit: string = params?.query?.limit ? params?.query?.limit : `50`;
    let res:any = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    res = await res.json();
    const allPokemons = res.results;

    for (const pokemon of allPokemons) {
      let pokemonDetail: any = await fetch(pokemon.url);
      pokemonDetail = await pokemonDetail.json();
      let speciesDetail: any = await fetch(pokemonDetail.species.url);
      speciesDetail = await speciesDetail.json();
      const diamondGame = speciesDetail['flavor_text_entries'].find((item: any) => item.version.name === "diamond");
      const pokedexService: any = this.app.service('pokedex');
      const pokedex = await pokedexService.find({ query: { pokemonId: pokemonDetail.id, favourite: true } });

      const item: Pokomon = {
        name: pokemonDetail.name,
        id: pokemonDetail.id,
        abilities: pokemonDetail.abilities,
        types: pokemonDetail.types,
        sprite: pokemonDetail.sprites.front_default,
        species: pokemonDetail.species,
        stats: pokemonDetail.stats,
        favourite: pokedex.total === 0 ? false : true,
        description: diamondGame['flavor_text'] || '',
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
      const pokedexService: any = this.app.service('pokedex');
      const pokedex = await pokedexService.find({ query: { pokemonId: id, favourite: true, user: params?.user?.email } });
      return { ...pokemons[0], ...(pokedex.total > 0 && { favourite: pokedex.data[0].favourite })}
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
  async patch(id: NullableId, data: Pokedex, params?: Params): Promise<Data> {

    if (!id && !data.id && data.pokemonId) throw new BadRequest('pokemonId is required');

    const itemId: number = Number(id) || Number(data.id) || Number(data.pokemonId);
    const pokedexService: any = this.app.service('pokedex');
    const pokedex = await pokedexService.find({ query: { pokemonId: itemId, user: params?.user?.email, $limit: 1 } });

    if (pokedex.total === 1) {
      const dataObj = {
        favourite: !pokedex.data[0].favourite,
      }
      return await pokedexService.patch(pokedex.data[0]._id, dataObj, params)
    } else {

      const dataObj = {
        pokemonId: itemId,
        favourite: true,
        user: params?.user?.email,
      }
     return await pokedexService.create(dataObj, params)
    }

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<Data> {
    throw new MethodNotAllowed();
  }
}
