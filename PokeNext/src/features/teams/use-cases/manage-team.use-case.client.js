import {
  clearTeamRepositoryClient,
  getTeamSnapshotRepositoryClient,
  getTeamPokemonRepositoryClient,
  listTeamPokemonRepositoryClient,
  readTeamRepositoryClient,
  saveTeamRepositoryClient,
  subscribeTeamRepositoryClient,
} from "../repositories/teams.repository.client";
import {
  mapStoredTeam,
  mapTeamPokemonDto,
  mapTeamPokemonListDto,
} from "../mappers/teams.mapper";
import { validateTeam } from "../schemas/team.schema";

export function normalizePokemonSearchValueUseCase(value) {
  const normalizedValue = String(value || "").trim().toLowerCase();

  return /^\d+$/.test(normalizedValue)
    ? String(Number(normalizedValue))
    : normalizedValue;
}

export function rankTeamPokemonSuggestionsUseCase(
  pokemon,
  searchValue,
  limit = 8
) {
  const value = normalizePokemonSearchValueUseCase(searchValue);
  if (!value) return [];

  const starts = [];
  const contains = [];

  for (const item of pokemon || []) {
    const apiName = normalizePokemonSearchValueUseCase(item.apiName);
    const displayName = normalizePokemonSearchValueUseCase(item.displayName);

    if (apiName.startsWith(value) || displayName.startsWith(value)) {
      starts.push(item);
    } else if (apiName.includes(value) || displayName.includes(value)) {
      contains.push(item);
    }

    if (starts.length + contains.length >= limit) break;
  }

  return [...starts, ...contains].slice(0, limit);
}

export function findExactTeamPokemonUseCase(pokemon, searchValue) {
  const value = normalizePokemonSearchValueUseCase(searchValue);

  return (pokemon || []).find(
    (item) =>
      normalizePokemonSearchValueUseCase(item.apiName) === value ||
      normalizePokemonSearchValueUseCase(item.displayName) === value
  );
}

export function addTeamPokemonUseCase(team, pokemon, maximumSize = 6) {
  const currentTeam = Array.isArray(team) ? team : [];
  if (!pokemon || currentTeam.length >= maximumSize) return currentTeam;
  if (currentTeam.some((item) => item.id === pokemon.id)) return currentTeam;

  return [...currentTeam, pokemon];
}

export function removeTeamPokemonUseCase(team, pokemonId) {
  return (Array.isArray(team) ? team : []).filter(
    (pokemon) => pokemon.id !== pokemonId
  );
}

export async function loadTeamPokemonUseCase(idOrName, options) {
  return mapTeamPokemonDto(
    await getTeamPokemonRepositoryClient(idOrName, options)
  );
}

export async function listTeamPokemonUseCase(options) {
  return mapTeamPokemonListDto(await listTeamPokemonRepositoryClient(options));
}

export function loadStoredTeamUseCase(storageKey) {
  return mapStoredTeam(readTeamRepositoryClient(storageKey));
}

export function saveStoredTeamUseCase(storageKey, team) {
  if (!validateTeam(team)) {
    throw new Error("O time salvo é inválido.");
  }
  saveTeamRepositoryClient(storageKey, team);
}

export function clearStoredTeamUseCase(storageKey) {
  clearTeamRepositoryClient(storageKey);
}

export function subscribeStoredTeamUseCase(callback) {
  if (typeof window === "undefined") return () => {};
  return subscribeTeamRepositoryClient(callback);
}

export function getStoredTeamSnapshotUseCase(storageKey) {
  if (typeof window === "undefined") return "[]";
  return getTeamSnapshotRepositoryClient(storageKey);
}
