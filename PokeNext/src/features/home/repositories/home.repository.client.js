import { fetchPokeApi } from "@/shared/poke-api/poke-api.client";

export function getHomePokemonRepositoryClient(id, options) {
  return fetchPokeApi(`pokemon/${id}`, options);
}
