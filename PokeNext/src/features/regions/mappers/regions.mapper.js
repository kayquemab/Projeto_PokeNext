import {
  formatPokemonName,
  translatePokeApiResourceName,
  translateTypeName,
} from "@/shared/poke-api";

export function mapRegionPokemonDto(dto) {
  return {
    id: dto.id,
    name: dto.name,
    displayName: formatPokemonName(dto.name),
    artwork:
      dto?.sprites?.other?.["official-artwork"]?.front_default ||
      dto?.sprites?.front_default ||
      "/pokeball.png",
    image:
      dto?.sprites?.other?.["official-artwork"]?.front_default ||
      dto?.sprites?.front_default ||
      "/pokeball.png",
    types: (dto?.types || []).map((item) => ({
      code: item?.type?.name,
      label: translateTypeName(item?.type?.name),
    })),
    abilities: (dto?.abilities || []).map((item) => ({
      code: item?.ability?.name,
      label: translatePokeApiResourceName(item?.ability, "ability"),
    })),
  };
}

export function mapRegionPokedexDto(dto) {
  return (dto?.pokemon_entries || [])
    .map((entry) => entry?.pokemon_species?.name)
    .filter(Boolean);
}
