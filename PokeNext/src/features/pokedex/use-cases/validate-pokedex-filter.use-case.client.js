import { pokedexFilterSchema } from "../schemas/pokedex-filter.schema";

export function validatePokedexFilterUseCase(filter) {
  return pokedexFilterSchema.safeParse(filter);
}
