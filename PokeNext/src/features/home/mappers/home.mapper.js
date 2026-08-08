import {
  formatPokemonName,
  translatePokeApiResourceName,
  translateTypeName,
} from "@/shared/poke-api";

export function mapHomePokemonDto(dto) {
  return {
    id: dto.id,
    name: dto.name,
    displayName: formatPokemonName(dto.name),
    types: (dto.types || []).map((item) => ({
      code: item?.type?.name,
      label: translateTypeName(item?.type?.name),
    })),
    abilities: (dto.abilities || []).map((item) => ({
      code: item?.ability?.name,
      label: translatePokeApiResourceName(item?.ability, "ability"),
    })),
    image:
      dto?.sprites?.other?.["official-artwork"]?.front_default ||
      dto?.sprites?.front_default ||
      null,
  };
}
