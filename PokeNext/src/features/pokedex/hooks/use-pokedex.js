import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  applyPokedexFiltersUseCase,
  createInitialTypeModeUseCase,
  filterAndSortPokemonUseCase,
  findPokemonBySearchUseCase,
  findPokemonSuggestionsUseCase,
  loadPokedexListUseCase,
  loadPokemonCardsUseCase,
} from "../use-cases/manage-pokedex.use-case.client";

export function usePokedex() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");
  const [allNames, setAllNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedLoading, setAdvancedLoading] = useState(false);
  const [typeMode, setTypeMode] = useState(createInitialTypeModeUseCase);
  const [abilities, setAbilities] = useState([]);
  const [ability, setAbility] = useState("all");
  const [heightGroup, setHeightGroup] = useState("all");
  const [weightGroup, setWeightGroup] = useState("all");
  const [minId, setMinId] = useState(1);
  const [maxId, setMaxId] = useState(1025);
  const [filteredList, setFilteredList] = useState(null);
  const [sortBy, setSortBy] = useState("id-asc");

  const sortedListForGrid = useMemo(
    () =>
      filterAndSortPokemonUseCase({
        pokemonList: allPokemonList,
        filteredList,
        search,
        sortBy,
      }),
    [allPokemonList, filteredList, search, sortBy]
  );

  useEffect(() => {
    setVisibleCount(15);
  }, [search, sortBy]);

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    async function loadPokedex() {
      try {
        setLoadingList(true);
        setError("");

        const data = await loadPokedexListUseCase({
          signal: controller.signal,
        });

        if (!alive) return;
        setAllNames(data.pokemon);
        setAllPokemonList(data.pokemon);
        setAbilities(data.abilities);
      } catch (loadError) {
        if (!alive || loadError?.name === "AbortError") return;
        console.error(loadError);
        setError("Erro ao carregar a Pokédex. Tente novamente.");
      } finally {
        if (alive) setLoadingList(false);
      }
    }

    loadPokedex();
    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const visiblePokemon = sortedListForGrid.slice(0, visibleCount);
    if (!visiblePokemon.length) return;

    let alive = true;

    async function loadVisibleDetails() {
      try {
        const details = await loadPokemonCardsUseCase(
          visiblePokemon,
          pokemonDetails
        );

        if (!alive || !Object.keys(details).length) return;
        setPokemonDetails((current) => ({ ...current, ...details }));
      } catch (loadError) {
        if (!alive) return;
        console.error(loadError);
      }
    }

    loadVisibleDetails();
    return () => {
      alive = false;
    };
  }, [pokemonDetails, sortedListForGrid, visibleCount]);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setSuggestions(findPokemonSuggestionsUseCase(allNames, search));
    }, 120);

    return () => clearTimeout(timeoutId);
  }, [allNames, search]);

  function navigateToPokemon(value) {
    const rawValue = String(value || "").trim();
    if (!rawValue) return;

    const pokemon = findPokemonBySearchUseCase(allPokemonList, rawValue);
    const id = pokemon?.id || (/^\d+$/.test(rawValue) ? Number(rawValue) : null);
    if (id) router.push(`/pokedex/${id}`);
  }

  function pickSuggestion(pokemon) {
    setSearch(pokemon.displayName);
    setSuggestions([]);
    setError("");
  }

  function applySimpleSearch() {
    setSuggestions([]);
    setError("");
  }

  function resetFilterState() {
    setTypeMode(createInitialTypeModeUseCase());
    setAbility("all");
    setHeightGroup("all");
    setWeightGroup("all");
    setMinId(1);
    setMaxId(1025);
    setFilteredList(null);
    setVisibleCount(15);
    setError("");
  }

  function clearAllFilters() {
    setSearch("");
    setSuggestions([]);
    resetFilterState();
  }

  function resetAdvanced() {
    resetFilterState();
  }

  function toggleTypeMode(typeName, mode) {
    setTypeMode((current) => ({
      ...current,
      [typeName]: current[typeName] === mode ? null : mode,
    }));
  }

  async function applyAdvancedFilters() {
    try {
      setAdvancedLoading(true);
      setError("");

      const result = await applyPokedexFiltersUseCase({
        filter: { minId, maxId, heightGroup, weightGroup, ability },
        typeMode,
        pokemonList: allPokemonList,
        currentDetails: pokemonDetails,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setPokemonDetails((current) => ({
        ...current,
        ...result.details,
      }));
      setFilteredList(result.pokemon);
      setVisibleCount(15);
    } catch (filterError) {
      console.error(filterError);
      setError("Erro ao aplicar filtros avançados. Tente novamente.");
    } finally {
      setAdvancedLoading(false);
    }
  }

  return {
    abilities,
    ability,
    advancedLoading,
    advancedOpen,
    applyAdvancedFilters,
    applySimpleSearch,
    clearAllFilters,
    error,
    heightGroup,
    loadingList,
    maxId,
    minId,
    navigateToPokemon,
    pickSuggestion,
    pokemonDetails,
    resetAdvanced,
    search,
    setAbility,
    setAdvancedOpen,
    setHeightGroup,
    setMaxId,
    setMinId,
    setSearch,
    setSortBy,
    setVisibleCount,
    setWeightGroup,
    sortBy,
    sortedListForGrid,
    suggestions,
    toggleTypeMode,
    typeMode,
    visibleCount,
    weightGroup,
  };
}
