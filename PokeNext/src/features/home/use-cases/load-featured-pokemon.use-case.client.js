import { mapHomePokemonDto } from "../mappers/home.mapper";
import { getHomePokemonRepositoryClient } from "../repositories/home.repository.client";

export async function loadFeaturedPokemonUseCase(ids, options) {
  const pokemon = await Promise.all(
    (ids || []).map((id) => getHomePokemonRepositoryClient(id, options))
  );

  return pokemon.map(mapHomePokemonDto);
}
