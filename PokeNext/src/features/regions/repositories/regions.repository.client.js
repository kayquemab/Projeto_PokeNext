import { fetchPokeApi } from "@/shared/poke-api/poke-api.client";

export function getRegionPokedexRepositoryClient(name, options) {
  return fetchPokeApi(`pokedex/${name}`, options);
}

export function getRegionPokemonRepositoryClient(idOrName, options) {
  return fetchPokeApi(`pokemon/${idOrName}`, options);
}
