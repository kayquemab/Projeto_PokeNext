import { useEffect, useState } from "react";
import { loadFeaturedPokemonUseCase } from "../use-cases/load-featured-pokemon.use-case.client";

export function useFeaturedPokemon({ count = 12, maximumId = 898 } = {}) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const randomIds = Array.from({ length: count }, () =>
      Math.floor(Math.random() * maximumId) + 1
    );

    loadFeaturedPokemonUseCase(randomIds, { signal: controller.signal })
      .then(setCards)
      .catch((error) => {
        if (error?.name !== "AbortError") setCards([]);
      });

    return () => controller.abort();
  }, [count, maximumId]);

  return cards;
}
