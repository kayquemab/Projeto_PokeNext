import {
  getRegionPokedexRepositoryClient,
  getRegionPokemonRepositoryClient,
} from "../repositories/regions.repository.client";
import {
  mapRegionPokedexDto,
  mapRegionPokemonDto,
} from "../mappers/regions.mapper";

export async function loadRegionPokemonByIdsUseCase(ids, options) {
  const pokemon = await Promise.all(
    (ids || []).map((id) => getRegionPokemonRepositoryClient(id, options))
  );
  return pokemon.map(mapRegionPokemonDto);
}

export async function loadPokemonFromRegionPokedexUseCase(
  pokedexName,
  { count = 12, ...options } = {}
) {
  const species = mapRegionPokedexDto(
    await getRegionPokedexRepositoryClient(pokedexName, options)
  );
  const shuffled = [...species].sort(() => Math.random() - 0.5).slice(0, count);

  return loadRegionPokemonByIdsUseCase(shuffled, options);
}
