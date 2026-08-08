import {
  getAbilityRepositoryClient,
  getPokedexResourceRepositoryClient,
  getPokemonRepositoryClient,
  getTypeRepositoryClient,
  listAbilitiesRepositoryClient,
  listPokemonRepositoryClient,
  listPokemonSpeciesRepositoryClient,
} from "../repositories/pokedex.repository.client";
import {
  mapAbilityDto,
  mapAbilityListDto,
  mapPokedexResourceDto,
  mapPokemonDto,
  mapPokemonListDto,
  mapPokemonSpeciesListDto,
  mapTypeDto,
} from "../mappers/pokedex.mapper";

export async function listPokemonUseCase(options) {
  return mapPokemonListDto(await listPokemonRepositoryClient(options));
}

export async function listPokemonSpeciesUseCase(options) {
  return mapPokemonSpeciesListDto(
    await listPokemonSpeciesRepositoryClient(options)
  );
}

export async function listAbilitiesUseCase(options) {
  return mapAbilityListDto(await listAbilitiesRepositoryClient(options));
}

export async function loadPokemonUseCase(idOrName, options) {
  return mapPokemonDto(await getPokemonRepositoryClient(idOrName, options));
}

export async function loadTypeUseCase(idOrName, options) {
  return mapTypeDto(await getTypeRepositoryClient(idOrName, options));
}

export async function loadAbilityUseCase(idOrName, options) {
  return mapAbilityDto(await getAbilityRepositoryClient(idOrName, options));
}

export async function loadPokedexResourceUseCase(url, kind, options) {
  return mapPokedexResourceDto(
    await getPokedexResourceRepositoryClient(url, options),
    kind
  );
}
