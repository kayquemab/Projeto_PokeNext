import {
  getLocalizedEntry,
  translatePokeApiResourceName,
  translateStatName,
  translateTypeName,
} from "@/shared/poke-api";
import speciesTextsPtBr from "@/shared/poke-api/locales/pt-br/species-texts.json";

const POKEMON_NAME_OVERRIDES = {
  "farfetchd": "Farfetch'd",
  "flabebe": "Flabébé",
  "hakamo-o": "Hakamo-o",
  "ho-oh": "Ho-Oh",
  "jangmo-o": "Jangmo-o",
  "kommo-o": "Kommo-o",
  "mime-jr": "Mime Jr.",
  "mr-mime": "Mr. Mime",
  "mr-rime": "Mr. Rime",
  "nidoran-f": "Nidoran♀",
  "nidoran-m": "Nidoran♂",
  "porygon-z": "Porygon-Z",
  "sirfetchd": "Sirfetch'd",
  "type-null": "Type: Null",
};

const FORM_LABELS_PT_BR = {
  "alola": "Alola",
  "ash": "Ash",
  "attack": "Ataque",
  "average": "Média",
  "baile": "Baile",
  "battle-bond": "Vínculo de Batalha",
  "blade": "Lâmina",
  "blue-striped": "Listras Azuis",
  "crowned": "Coroada",
  "dawn": "Alvorada",
  "defense": "Defesa",
  "dusk": "Crepúsculo",
  "east": "Leste",
  "eternamax": "Eterna Máxima",
  "fan": "Ventilador",
  "female": "Fêmea",
  "frost": "Gelo",
  "galar": "Galar",
  "galar-standard": "Galar — Padrão",
  "galar-zen": "Galar — Zen",
  "gmax": "Gigantamax",
  "heat": "Calor",
  "hisui": "Hisui",
  "incarnate": "Encarnação",
  "land": "Terrestre",
  "large": "Grande",
  "male": "Macho",
  "mega": "Mega",
  "mega-x": "Mega X",
  "mega-y": "Mega Y",
  "midday": "Meio-dia",
  "midnight": "Meia-noite",
  "mow": "Cortador de Grama",
  "origin": "Origem",
  "paldea": "Paldea",
  "pirouette": "Pirueta",
  "plant": "Planta",
  "pom-pom": "Pom-Pom",
  "primal": "Primitiva",
  "rainy": "Chuvosa",
  "red-striped": "Listras Vermelhas",
  "resolute": "Resoluta",
  "sandy": "Areia",
  "school": "Cardume",
  "sensu": "Sensu",
  "shield": "Escudo",
  "sky": "Celeste",
  "small": "Pequena",
  "snowy": "Nevosa",
  "solo": "Solo",
  "speed": "Velocidade",
  "standard": "Padrão",
  "sunny": "Ensolarada",
  "super": "Super",
  "therian": "Teriantrópica",
  "totem": "Totêmica",
  "trash": "Lixo",
  "ultra": "Ultratransformada",
  "wash": "Lavagem",
  "west": "Oeste",
  "white-striped": "Listras Brancas",
  "zen": "Zen",
};

const FORM_GROUPS = {
  alola: "Regional",
  galar: "Regional",
  hisui: "Regional",
  paldea: "Regional",
  gmax: "Mecânica",
  mega: "Mecânica",
  "mega-x": "Mecânica",
  "mega-y": "Mecânica",
  primal: "Mecânica",
};

function getResourceId(resource) {
  const match = String(resource?.url || resource || "").match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

function capitalizeWords(value) {
  return String(value || "")
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatBasePokemonName(identifier) {
  const slug = String(identifier || "").trim().toLowerCase();
  if (!slug) return "Pokémon desconhecido";

  return POKEMON_NAME_OVERRIDES[slug] || capitalizeWords(slug);
}

function getFormMetadata(formIdentifier) {
  const identifier = String(formIdentifier || "").trim().toLowerCase();
  const exactLabel = FORM_LABELS_PT_BR[identifier];

  if (exactLabel) {
    const groupKey = Object.keys(FORM_GROUPS).find(
      (key) => identifier === key || identifier.startsWith(`${key}-`)
    );

    return {
      group: groupKey ? FORM_GROUPS[groupKey] : "Forma",
      label: exactLabel,
    };
  }

  const translatedParts = identifier
    .split("-")
    .filter(Boolean)
    .map((part) => FORM_LABELS_PT_BR[part]);

  if (translatedParts.length && translatedParts.every(Boolean)) {
    return {
      group: "Forma",
      label: translatedParts.join(" — "),
    };
  }

  return { group: "Outras", label: "Forma alternativa" };
}

function formatPokemonDisplayName(identifier, speciesIdentifier = identifier) {
  const pokemonSlug = String(identifier || "").trim().toLowerCase();
  const speciesSlug = String(speciesIdentifier || pokemonSlug).trim().toLowerCase();
  const baseName = formatBasePokemonName(speciesSlug);

  if (!pokemonSlug || pokemonSlug === speciesSlug) return baseName;

  const prefix = `${speciesSlug}-`;
  const formIdentifier = pokemonSlug.startsWith(prefix)
    ? pokemonSlug.slice(prefix.length)
    : "";
  const form = getFormMetadata(formIdentifier);

  return `${baseName} — ${form.label}`;
}

function mapNamedResource(resource, kind) {
  if (!resource) return null;

  const slug = String(resource?.name || "");

  return {
    id: getResourceId(resource),
    slug,
    url: resource?.url || "",
    displayName:
      kind === "pokemon"
        ? formatBasePokemonName(slug)
        : translatePokeApiResourceName(resource, kind),
  };
}

function getOfficialArtworkUrl(id) {
  return id
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    : "";
}

function mapTypeResource(resource) {
  const mapped = mapNamedResource(resource, "type");
  if (!mapped) return null;

  return {
    code: mapped.slug,
    label: mapped.displayName,
    url: mapped.url,
  };
}

function mapTypeRelations(relations) {
  return (relations || []).map(mapTypeResource).filter(Boolean);
}

function extractEvolutionStages(chainRoot) {
  const stages = [];
  const queue = [{ node: chainRoot, depth: 0 }];

  while (queue.length) {
    const { node, depth } = queue.shift();
    const slug = node?.species?.name;

    if (slug) {
      if (!stages[depth]) stages[depth] = [];
      if (!stages[depth].includes(slug)) stages[depth].push(slug);
    }

    for (const child of node?.evolves_to || []) {
      queue.push({ node: child, depth: depth + 1 });
    }
  }

  return stages.filter(Boolean);
}

export function mapPokemonListDto(dto) {
  return {
    count: Number(dto?.count || 0),
    results: (dto?.results || [])
      .map((resource) => {
        const mapped = mapNamedResource(resource, "pokemon");

        return mapped
          ? { ...mapped, artworkUrl: getOfficialArtworkUrl(mapped.id) }
          : null;
      })
      .filter(Boolean),
  };
}

export function mapPokemonSpeciesListDto(dto) {
  return { count: Number(dto?.count || 0) };
}

export function mapAbilityListDto(dto) {
  return {
    count: Number(dto?.count || 0),
    results: (dto?.results || []).map((resource) => {
      const mapped = mapNamedResource(resource, "ability");

      return {
        id: mapped.id,
        code: mapped.slug,
        label: mapped.displayName,
      };
    }),
  };
}

export function mapPokemonDto(dto) {
  const speciesSlug = String(dto?.species?.name || dto?.name || "");

  return {
    id: Number(dto?.id || 0),
    slug: String(dto?.name || ""),
    displayName: formatPokemonDisplayName(dto?.name, speciesSlug),
    artworkUrl:
      dto?.sprites?.other?.["official-artwork"]?.front_default ||
      dto?.sprites?.front_default ||
      "",
    heightDecimeters: Number(dto?.height || 0),
    weightHectograms: Number(dto?.weight || 0),
    speciesUrl: dto?.species?.url || "",
    types: (dto?.types || [])
      .map((item) => mapTypeResource(item?.type))
      .filter(Boolean),
    abilities: (dto?.abilities || []).map((item) => ({
      code: String(item?.ability?.name || ""),
      label: translatePokeApiResourceName(item?.ability, "ability"),
    })),
    stats: (dto?.stats || []).map((item) => ({
      code: String(item?.stat?.name || ""),
      label: translateStatName(item?.stat?.name),
      value: Number(item?.base_stat || 0),
    })),
    moves: (dto?.moves || []).map((item) => ({
      code: String(item?.move?.name || ""),
      label: translatePokeApiResourceName(item?.move, "move"),
      url: item?.move?.url || "",
    })),
  };
}

export function mapTypeDto(dto) {
  return {
    id: Number(dto?.id || 0),
    code: String(dto?.name || ""),
    label: translateTypeName(dto?.name),
    doubleDamageFrom: mapTypeRelations(
      dto?.damage_relations?.double_damage_from
    ),
    doubleDamageTo: mapTypeRelations(dto?.damage_relations?.double_damage_to),
    halfDamageFrom: mapTypeRelations(dto?.damage_relations?.half_damage_from),
    noDamageFrom: mapTypeRelations(dto?.damage_relations?.no_damage_from),
    pokemonIds: (dto?.pokemon || [])
      .map((item) => getResourceId(item?.pokemon))
      .filter(Number.isFinite),
  };
}

export function mapAbilityDto(dto) {
  return {
    id: Number(dto?.id || 0),
    code: String(dto?.name || ""),
    label: translatePokeApiResourceName(dto, "ability"),
    pokemonIds: (dto?.pokemon || [])
      .map((item) => getResourceId(item?.pokemon))
      .filter(Number.isFinite),
  };
}

export function mapSpeciesDto(dto) {
  const speciesSlug = String(dto?.name || "");
  const catalogTexts = speciesTextsPtBr[speciesSlug] || {};

  return {
    id: Number(dto?.id || 0),
    slug: speciesSlug,
    displayName: formatBasePokemonName(speciesSlug),
    description:
      getLocalizedEntry(dto?.flavor_text_entries, "flavor_text") ||
      catalogTexts.description ||
      "Descri\u00e7\u00e3o indispon\u00edvel em portugu\u00eas.",
    category:
      getLocalizedEntry(dto?.genera, "genus") ||
      catalogTexts.category ||
      "Categoria indispon\u00edvel em portugu\u00eas",
    evolutionChainUrl: dto?.evolution_chain?.url || "",
    varieties: (dto?.varieties || []).map((item) => {
      const slug = String(item?.pokemon?.name || "");
      const prefix = `${speciesSlug}-`;
      const formIdentifier = slug.startsWith(prefix)
        ? slug.slice(prefix.length)
        : "";
      const form = getFormMetadata(formIdentifier);

      return {
        id: getResourceId(item?.pokemon),
        slug,
        url: item?.pokemon?.url || "",
        displayName: formatPokemonDisplayName(slug, speciesSlug),
        isDefault: Boolean(item?.is_default),
        formGroup: form.group,
        formLabel: slug === speciesSlug ? "Forma padrão" : form.label,
      };
    }),
  };
}

export function mapEvolutionChainDto(dto) {
  return { stages: extractEvolutionStages(dto?.chain) };
}

export function mapPokedexResourceDto(dto, kind) {
  if (kind === "pokemon") return mapPokemonDto(dto);
  if (kind === "species") return mapSpeciesDto(dto);
  if (kind === "type") return mapTypeDto(dto);
  if (kind === "ability") return mapAbilityDto(dto);
  if (kind === "evolution") return mapEvolutionChainDto(dto);

  throw new Error("Tipo de recurso da PokéAPI não suportado pela Pokédex.");
}
