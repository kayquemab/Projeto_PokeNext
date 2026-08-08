import {
  getMoveRepositoryClient,
  getMovesResourceRepositoryClient,
  getPokemonRepositoryClient,
  getTypeRepositoryClient,
  listMovesRepositoryClient,
  listTypesRepositoryClient,
  readMovesCacheRepositoryClient,
  saveMovesCacheRepositoryClient,
} from "../repositories/moves.repository.client";
import {
  mapMoveDto,
  mapMoveListDto,
  mapPokemonForMovesDto,
  mapTypeForMovesDto,
  mapTypeListDto,
} from "../mappers/moves.mapper";

export async function listMovesUseCase(options) {
  return mapMoveListDto(await listMovesRepositoryClient(options));
}

export async function listTypesUseCase(options) {
  return mapTypeListDto(await listTypesRepositoryClient(options));
}

export async function loadMoveUseCase(idOrName, options) {
  return mapMoveDto(await getMoveRepositoryClient(idOrName, options));
}

export async function loadMoveResourceUseCase(url, options) {
  return mapMoveDto(await getMovesResourceRepositoryClient(url, options));
}

export async function loadMoveTypeUseCase(idOrName, options) {
  return mapTypeForMovesDto(await getTypeRepositoryClient(idOrName, options));
}

export async function loadPokemonForMovesUseCase(idOrName, options) {
  return mapPokemonForMovesDto(await getPokemonRepositoryClient(idOrName, options));
}

export function loadMovesCacheUseCase(key) {
  const value = readMovesCacheRepositoryClient(key);
  return value ? JSON.parse(value) : null;
}

export function saveMovesCacheUseCase(key, value) {
  saveMovesCacheRepositoryClient(key, value);
}
