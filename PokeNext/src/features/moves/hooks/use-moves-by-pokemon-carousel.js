"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMovesApi } from "./use-moves-api";
import { selectFeaturedMovesUseCase } from "../use-cases/build-move-carousels.use-case.client";

const moveDetailCache = new Map();

export function useMovesByPokemonCarousel({ count = 12, pokemonId }) {
  const router = useRouter();
  const { loadMoveResource, loadPokemon } = useMovesApi();
  const [realIndex, setRealIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [detailsByMove, setDetailsByMove] = useState({});

  useEffect(() => {
    if (!pokemonId) return;

    let alive = true;
    const controller = new AbortController();

    async function loadCards() {
      try {
        setCards([]);
        setDetailsByMove({});

        const pokemon = await loadPokemon(pokemonId, {
          signal: controller.signal,
        });

        if (!alive) return;
        setCards(selectFeaturedMovesUseCase(pokemon.moves, count));
      } catch {
        if (alive) setCards([]);
      }
    }

    loadCards();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [count, loadPokemon, pokemonId]);

  useEffect(() => {
    if (!cards.length) return;

    let alive = true;
    const controller = new AbortController();

    async function loadDetails() {
      const entries = await Promise.all(
        cards.map(async (move) => {
          if (moveDetailCache.has(move.slug)) {
            return [move.slug, moveDetailCache.get(move.slug)];
          }

          try {
            const detail = await loadMoveResource(move.url, {
              signal: controller.signal,
            });
            const simplified = {
              types: detail.type
                ? [{ code: detail.type.code, label: detail.type.label }]
                : [],
              power: detail.power,
              accuracy: detail.accuracy,
              pp: detail.pp,
              damageClass: detail.damageClass?.label,
            };

            moveDetailCache.set(move.slug, simplified);
            return [move.slug, simplified];
          } catch {
            return [move.slug, null];
          }
        })
      );

      if (!alive) return;
      setDetailsByMove(Object.fromEntries(entries));
    }

    loadDetails();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [cards, loadMoveResource]);

  const goToMove = useCallback(
    (slug) => {
      router.push(`/movimentos/${slug}`);
    },
    [router]
  );

  return {
    cards,
    detailsByMove,
    goToMove,
    realIndex,
    setRealIndex,
  };
}
