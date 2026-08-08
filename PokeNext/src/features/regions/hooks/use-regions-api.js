import { useEffect, useMemo, useState } from "react";
import {
  loadPokemonFromRegionPokedexUseCase,
  loadRegionPokemonByIdsUseCase,
} from "../use-cases/load-region-pokemon.use-case.client";

export function useRegionsApi() {
  return useMemo(
    () => ({
      loadPokemonByIds: loadRegionPokemonByIdsUseCase,
      loadPokemonFromPokedex: loadPokemonFromRegionPokedexUseCase,
    }),
    []
  );
}

export function useRegionPokemon(ids) {
  const { loadPokemonByIds } = useRegionsApi();
  const requestKey = (ids || []).join(",");
  const [result, setResult] = useState({ requestKey: "", pokemon: [] });

  useEffect(() => {
    if (!requestKey) return undefined;

    const controller = new AbortController();

    loadPokemonByIds(requestKey.split(","), { signal: controller.signal })
      .then((pokemon) => setResult({ requestKey, pokemon }))
      .catch((error) => {
        if (error?.name !== "AbortError") {
          setResult({ requestKey, pokemon: [] });
        }
      });

    return () => controller.abort();
  }, [loadPokemonByIds, requestKey]);

  return {
    loading: Boolean(requestKey) && result.requestKey !== requestKey,
    pokemon: result.requestKey === requestKey ? result.pokemon : [],
  };
}

export function useRegionPokedexPokemon(pokedexName, count = 12) {
  const { loadPokemonFromPokedex } = useRegionsApi();
  const requestKey = pokedexName ? `${pokedexName}:${count}` : "";
  const [result, setResult] = useState({ requestKey: "", pokemon: [] });

  useEffect(() => {
    if (!pokedexName) return undefined;

    const controller = new AbortController();

    loadPokemonFromPokedex(pokedexName, {
      count,
      signal: controller.signal,
    })
      .then((pokemon) => setResult({ requestKey, pokemon }))
      .catch((error) => {
        if (error?.name !== "AbortError") {
          setResult({ requestKey, pokemon: [] });
        }
      });

    return () => controller.abort();
  }, [count, loadPokemonFromPokedex, pokedexName, requestKey]);

  return result.requestKey === requestKey ? result.pokemon : [];
}
