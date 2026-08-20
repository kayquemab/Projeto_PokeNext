import { connection } from "next/server";
import { loadFeaturedPokemonUseCase } from "../use-cases/load-featured-pokemon.use-case.client";
import PokemonCarousel from "./pokemon-carousel";

const FEATURED_POKEMON_COUNT = 12;
const MAXIMUM_POKEMON_ID = 898;

function getRandomPokemonIds() {
  const ids = new Set();

  while (ids.size < FEATURED_POKEMON_COUNT) {
    ids.add(Math.floor(Math.random() * MAXIMUM_POKEMON_ID) + 1);
  }

  return [...ids];
}

export default async function FeaturedPokemonCarousel() {
  await connection();

  let cards;

  try {
    cards = await loadFeaturedPokemonUseCase(getRandomPokemonIds(), {
      next: { revalidate: 86400 },
    });
  } catch {
    return (
      <p className="py-12 text-center text-sm text-neutral-600">
        Não foi possível carregar os Pokémon em destaque agora.
      </p>
    );
  }

  return <PokemonCarousel cards={cards} />;
}
