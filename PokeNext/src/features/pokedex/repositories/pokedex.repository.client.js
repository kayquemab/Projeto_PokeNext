import { fetchPokeApi } from "@/shared/poke-api/poke-api.client";

export function listPokemonRepositoryClient(options) {
  return fetchPokeApi("pokemon?limit=1025", options);
}

export function listPokemonSpeciesRepositoryClient(options) {
  return fetchPokeApi("pokemon-species?limit=1", options);
}

export function listAbilitiesRepositoryClient(options) {
  return fetchPokeApi("ability?limit=500", options);
}

export function getPokemonRepositoryClient(idOrName, options) {
  return fetchPokeApi(`pokemon/${idOrName}`, options);
}

export function getTypeRepositoryClient(idOrName, options) {
  return fetchPokeApi(`type/${idOrName}`, options);
}

export function getAbilityRepositoryClient(idOrName, options) {
  return fetchPokeApi(`ability/${idOrName}`, options);
}

export function getPokedexResourceRepositoryClient(url, options) {
  return fetchPokeApi(url, options);
}
