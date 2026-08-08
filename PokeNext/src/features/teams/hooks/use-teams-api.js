import { useMemo } from "react";
import { analyzeTeamUseCase } from "../use-cases/analyze-team.use-case.client";
import {
  addTeamPokemonUseCase,
  clearStoredTeamUseCase,
  findExactTeamPokemonUseCase,
  listTeamPokemonUseCase,
  loadStoredTeamUseCase,
  loadTeamPokemonUseCase,
  normalizePokemonSearchValueUseCase,
  rankTeamPokemonSuggestionsUseCase,
  removeTeamPokemonUseCase,
  saveStoredTeamUseCase,
} from "../use-cases/manage-team.use-case.client";

export function useTeamsApi() {
  return useMemo(
    () => ({
      addPokemonToTeam: addTeamPokemonUseCase,
      analyzeTeam: analyzeTeamUseCase,
      clearStoredTeam: clearStoredTeamUseCase,
      findExactPokemon: findExactTeamPokemonUseCase,
      listPokemon: listTeamPokemonUseCase,
      loadPokemon: loadTeamPokemonUseCase,
      loadStoredTeam: loadStoredTeamUseCase,
      normalizeSearchValue: normalizePokemonSearchValueUseCase,
      rankPokemonSuggestions: rankTeamPokemonSuggestionsUseCase,
      removePokemonFromTeam: removeTeamPokemonUseCase,
      saveStoredTeam: saveStoredTeamUseCase,
    }),
    []
  );
}
