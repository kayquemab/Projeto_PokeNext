import { fetchPokeApi } from "@/shared/poke-api/poke-api.client";

export function listMovesRepositoryClient(options) {
  return fetchPokeApi("move?limit=1000", options);
}

export function listTypesRepositoryClient(options) {
  return fetchPokeApi("type?limit=1000", options);
}

export function getMoveRepositoryClient(idOrName, options) {
  return fetchPokeApi(`move/${idOrName}`, options);
}

export function getTypeRepositoryClient(idOrName, options) {
  return fetchPokeApi(`type/${idOrName}`, options);
}

export function getPokemonRepositoryClient(idOrName, options) {
  return fetchPokeApi(`pokemon/${idOrName}`, options);
}

export function getMovesResourceRepositoryClient(url, options) {
  return fetchPokeApi(url, options);
}

export function readMovesCacheRepositoryClient(key) {
  return window.localStorage.getItem(key);
}

export function saveMovesCacheRepositoryClient(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
