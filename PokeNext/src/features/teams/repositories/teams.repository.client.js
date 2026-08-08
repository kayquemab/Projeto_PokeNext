import { fetchPokeApi } from "@/shared/poke-api/poke-api.client";

export function getTeamPokemonRepositoryClient(idOrName, options) {
  return fetchPokeApi(`pokemon/${idOrName}`, options);
}

export function listTeamPokemonRepositoryClient(options) {
  return fetchPokeApi("pokemon?limit=1025", options);
}

export function readTeamRepositoryClient(storageKey) {
  return window.localStorage.getItem(storageKey);
}

export function saveTeamRepositoryClient(storageKey, team) {
  window.localStorage.setItem(storageKey, JSON.stringify(team));
}

export function clearTeamRepositoryClient(storageKey) {
  window.localStorage.removeItem(storageKey);
}

export function subscribeTeamRepositoryClient(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function getTeamSnapshotRepositoryClient(storageKey) {
  return window.localStorage.getItem(storageKey) ?? "[]";
}
