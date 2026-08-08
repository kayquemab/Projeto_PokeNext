"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMovesApi } from "./use-moves-api";
import { selectPokemonSlugsForMoveUseCase } from "../use-cases/build-move-carousels.use-case.client";

export function usePokemonByMoveCarousel({
  learnedByPokemon = [],
  pool = 200,
  take = 12,
}) {
  const router = useRouter();
  const { loadPokemon } = useMovesApi();
  const [realIndex, setRealIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const learnedSlugs = useMemo(
    () => (learnedByPokemon || []).map((pokemon) => pokemon?.slug).filter(Boolean),
    [learnedByPokemon]
  );

  useEffect(() => {
    if (!learnedSlugs.length) {
      setCards([]);
      return;
    }

    let alive = true;
    const controller = new AbortController();

    async function loadCards() {
      try {
        setLoading(true);

        const selectedSlugs = selectPokemonSlugsForMoveUseCase(learnedSlugs, {
          pool,
          take,
        });
        const pokemon = await Promise.all(
          selectedSlugs.map((slug) =>
            loadPokemon(slug, { signal: controller.signal }).catch(() => null)
          )
        );

        if (!alive) return;

        setCards(
          pokemon
            .filter(Boolean)
            .sort((left, right) => left.id - right.id)
        );
        setRealIndex(0);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadCards();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [learnedSlugs, loadPokemon, pool, take]);

  const goToDetail = useCallback(
    (pokemon) => {
      router.push(`/pokedex/${pokemon.id}`);
    },
    [router]
  );

  return { cards, goToDetail, loading, realIndex, setRealIndex };
}
