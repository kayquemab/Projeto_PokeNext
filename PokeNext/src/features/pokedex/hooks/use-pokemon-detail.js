import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  calculatePokemonWeaknessesUseCase,
  getAdjacentPokemonIdsUseCase,
  getPokemonFormsUseCase,
  loadAdjacentPokemonUseCase,
  loadNationalDexCountUseCase,
  loadPokemonDetailUseCase,
  loadPokemonEvolutionUseCase,
  loadPokemonSpeciesTextUseCase,
} from "../use-cases/manage-pokemon-detail.use-case.client";

const NATIONAL_DEX_FALLBACK = 1025;

export function usePokemonDetail(pokemonId) {
  const router = useRouter();
  const idOrName = useMemo(
    () => String(pokemonId || "").trim().toLowerCase(),
    [pokemonId]
  );
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [maxId, setMaxId] = useState(NATIONAL_DEX_FALLBACK);
  const [evoStages, setEvoStages] = useState([]);
  const [evoLoading, setEvoLoading] = useState(false);
  const [evoError, setEvoError] = useState("");
  const [prevPokemon, setPrevPokemon] = useState(null);
  const [nextPokemon, setNextPokemon] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [weaknesses, setWeaknesses] = useState([]);
  const [weakLoading, setWeakLoading] = useState(false);

  const currentId = Number(pokemon?.id || 0);
  const nationalDexId = Number(pokemon?.speciesId || currentId);
  const { previousId: prevId, nextId } = useMemo(
    () => getAdjacentPokemonIdsUseCase(nationalDexId, maxId),
    [nationalDexId, maxId]
  );
  const allForms = useMemo(
    () => getPokemonFormsUseCase(evoStages, pokemon?.id),
    [evoStages, pokemon?.id]
  );

  function navigateToPokemon(id) {
    if (!id || isNavigating) return;
    setIsNavigating(true);
    router.push(`/pokedex/${id}`);
  }

  function prefetch(id) {
    try {
      router.prefetch?.(`/pokedex/${id}`);
    } catch {
      // Prefetch é apenas uma otimização.
    }
  }

  function navigateToPokedex() {
    router.push("/pokedex");
  }

  useEffect(() => {
    setIsNavigating(false);
  }, [idOrName]);

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    loadNationalDexCountUseCase({ signal: controller.signal })
      .then((count) => {
        if (alive) setMaxId(count);
      })
      .catch((loadError) => {
        if (loadError?.name !== "AbortError") console.error(loadError);
      });

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!idOrName) return;

    const controller = new AbortController();
    let alive = true;

    async function loadPokemon() {
      try {
        setLoading(true);
        setError("");
        const data = await loadPokemonDetailUseCase(idOrName, {
          signal: controller.signal,
        });

        if (alive) setPokemon(data);
      } catch (loadError) {
        if (!alive || loadError?.name === "AbortError") return;
        console.error(loadError);
        setError("Não foi possível carregar os dados deste Pokémon.");
        setPokemon(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadPokemon();
    return () => {
      alive = false;
      controller.abort();
    };
  }, [idOrName]);

  useEffect(() => {
    if (!pokemon?.speciesUrl) return;

    const controller = new AbortController();
    let alive = true;

    async function loadEvolution() {
      try {
        setEvoLoading(true);
        setEvoError("");
        setEvoStages([]);
        const stages = await loadPokemonEvolutionUseCase(pokemon, {
          signal: controller.signal,
        });

        if (alive) setEvoStages(stages);
      } catch (loadError) {
        if (!alive || loadError?.name === "AbortError") return;
        console.error(loadError);
        setEvoError("Não foi possível carregar a linha evolutiva.");
      } finally {
        if (alive) setEvoLoading(false);
      }
    }

    loadEvolution();
    return () => {
      alive = false;
      controller.abort();
    };
  }, [pokemon]);

  useEffect(() => {
    if (!nationalDexId) return;

    const controller = new AbortController();
    let alive = true;

    loadAdjacentPokemonUseCase(prevId, nextId, {
      signal: controller.signal,
    })
      .then(({ previous, next }) => {
        if (!alive) return;
        setPrevPokemon(previous);
        setNextPokemon(next);
      })
      .catch((loadError) => {
        if (!alive || loadError?.name === "AbortError") return;
        console.error(loadError);
        setPrevPokemon({ id: prevId, displayName: "" });
        setNextPokemon({ id: nextId, displayName: "" });
      });

    return () => {
      alive = false;
      controller.abort();
    };
  }, [nationalDexId, nextId, prevId]);

  useEffect(() => {
    if (!pokemon?.speciesUrl) return;

    const controller = new AbortController();
    let alive = true;
    setDescription("");
    setCategory("");

    loadPokemonSpeciesTextUseCase(pokemon.speciesUrl, {
      signal: controller.signal,
    })
      .then((texts) => {
        if (!alive) return;
        setDescription(texts.description);
        setCategory(texts.category);
      })
      .catch((loadError) => {
        if (!alive || loadError?.name === "AbortError") return;
        console.error(loadError);
        setDescription("Descrição não disponível em português.");
        setCategory("Categoria não disponível em português.");
      });

    return () => {
      alive = false;
      controller.abort();
    };
  }, [pokemon?.speciesUrl]);

  useEffect(() => {
    if (!pokemon?.types?.length) return;

    const controller = new AbortController();
    let alive = true;

    async function loadWeaknesses() {
      try {
        setWeakLoading(true);
        setWeaknesses([]);
        const result = await calculatePokemonWeaknessesUseCase(
          pokemon.types,
          { signal: controller.signal }
        );

        if (alive) setWeaknesses(result);
      } catch (loadError) {
        if (!alive || loadError?.name === "AbortError") return;
        console.error(loadError);
        setWeaknesses([]);
      } finally {
        if (alive) setWeakLoading(false);
      }
    }

    loadWeaknesses();
    return () => {
      alive = false;
      controller.abort();
    };
  }, [pokemon?.types]);

  return {
    allForms,
    category,
    description,
    error,
    evoError,
    evoLoading,
    evoStages,
    isNavigating,
    loading,
    navigateToPokedex,
    navigateToPokemon,
    nextId,
    nextPokemon,
    pokemon,
    prefetch,
    prevId,
    prevPokemon,
    weaknesses,
    weakLoading,
  };
}
