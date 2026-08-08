import {
  formatPokemonName,
  translatePokeApiResourceName,
  translateStatName,
  translateTypeName,
} from "@/shared/poke-api";

export function mapTeamPokemonDto(dto) {
  const name = dto?.name || dto?.apiName || "";

  return {
    id: dto?.id,
    apiName: name,
    displayName: dto?.displayName || formatPokemonName(name),
    image:
      dto?.image ||
      dto?.sprites?.other?.["official-artwork"]?.front_default ||
      dto?.sprites?.front_default ||
      "/pokeball.png",
    height: Number(dto?.height) || 0,
    weight: Number(dto?.weight) || 0,
    types: (dto?.types || []).map((item) => ({
      code: item?.code || item?.type?.name || item?.name,
      label:
        item?.label ||
        translateTypeName(item?.code || item?.type?.name || item?.name),
    })),
    abilities: (dto?.abilities || []).map((item) => ({
      code: item?.code || item?.ability?.name || item?.name,
      label:
        item?.label ||
        translatePokeApiResourceName(
          item?.ability || { name: item?.code || item?.name },
          "ability"
        ),
    })),
    stats: (dto?.stats || []).map((item) => ({
      code: item?.code || item?.stat?.name || item?.name,
      label:
        item?.label ||
        translateStatName(item?.code || item?.stat?.name || item?.name),
      value: Number(item?.value ?? item?.base_stat) || 0,
    })),
  };
}

export function mapTeamPokemonListDto(dto) {
  return (dto?.results || []).map((item) => ({
    apiName: item.name,
    displayName: formatPokemonName(item.name),
  }));
}

export function mapStoredTeam(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed
          .slice(0, 6)
          .map(mapTeamPokemonDto)
          .filter(
            (pokemon) =>
              Number.isInteger(pokemon.id) &&
              pokemon.id > 0 &&
              Boolean(pokemon.apiName)
          )
      : [];
  } catch {
    return [];
  }
}
