import { PokemonDetailPage } from "@/features/pokedex";

export default async function Page({ params }) {
  const { "pokemon-id": pokemonId } = await params;

  return <PokemonDetailPage pokemonId={pokemonId} />;
}
