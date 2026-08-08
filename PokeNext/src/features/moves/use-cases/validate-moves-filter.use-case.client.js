import { movesFilterSchema } from "../schemas/moves-filter.schema";

export function validateMovesFilterUseCase(filter) {
  return movesFilterSchema.safeParse(filter);
}
