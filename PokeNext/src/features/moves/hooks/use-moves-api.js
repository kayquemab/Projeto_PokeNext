import { useMemo } from "react";
import {
  listMovesUseCase,
  listTypesUseCase,
  loadMovesCacheUseCase,
  loadMoveResourceUseCase,
  loadMoveTypeUseCase,
  loadMoveUseCase,
  loadPokemonForMovesUseCase,
  saveMovesCacheUseCase,
} from "../use-cases/load-moves.use-case.client";
import { validateMovesFilterUseCase } from "../use-cases/validate-moves-filter.use-case.client";
import {
  buildMoveWeaknessAllowedTypesUseCase,
  createEmptyMoveTypeModeUseCase,
  filterMovesBySearchUseCase,
  isMoveWeaknessMapReadyUseCase,
  matchesMoveFiltersUseCase,
  rankMoveSuggestionsUseCase,
} from "../use-cases/filter-moves.use-case.client";

export function useMovesApi() {
  return useMemo(
    () => ({
      listMoves: listMovesUseCase,
      listTypes: listTypesUseCase,
      buildWeaknessAllowedTypes: buildMoveWeaknessAllowedTypesUseCase,
      createEmptyTypeMode: createEmptyMoveTypeModeUseCase,
      filterMovesBySearch: filterMovesBySearchUseCase,
      isWeaknessMapReady: isMoveWeaknessMapReadyUseCase,
      loadMove: loadMoveUseCase,
      loadMoveResource: loadMoveResourceUseCase,
      loadPokemon: loadPokemonForMovesUseCase,
      loadType: loadMoveTypeUseCase,
      loadCache: loadMovesCacheUseCase,
      saveCache: saveMovesCacheUseCase,
      matchesMoveFilters: matchesMoveFiltersUseCase,
      rankMoveSuggestions: rankMoveSuggestionsUseCase,
      validateFilter: validateMovesFilterUseCase,
    }),
    []
  );
}
