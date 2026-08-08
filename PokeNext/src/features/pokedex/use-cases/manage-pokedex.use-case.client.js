import {
  listAbilitiesUseCase,
  listPokemonUseCase,
  loadAbilityUseCase,
  loadPokemonUseCase,
  loadTypeUseCase,
} from "./load-pokedex.use-case.client";
import { validatePokedexFilterUseCase } from "./validate-pokedex-filter.use-case.client";

export const POKEDEX_TYPE_CODES = [
  "bug",
  "dark",
  "dragon",
  "electric",
  "fairy",
  "fighting",
  "fire",
  "flying",
  "ghost",
  "grass",
  "ground",
  "ice",
  "normal",
  "poison",
  "psychic",
  "rock",
  "steel",
  "water",
];

const typeCache = new Map();
const abilityCache = new Map();

export function createInitialTypeModeUseCase() {
  return Object.fromEntries(POKEDEX_TYPE_CODES.map((type) => [type, null]));
}

function pokemonMatchesQuery(pokemon, rawQuery) {
  const query = String(rawQuery || "").trim().toLocaleLowerCase("pt-BR");

  if (!query) return true;
  if (/^\d+$/.test(query)) return pokemon.id === Number(query);

  return (
    pokemon.slug.toLowerCase().includes(query) ||
    pokemon.displayName.toLocaleLowerCase("pt-BR").includes(query)
  );
}

export function filterAndSortPokemonUseCase({
  pokemonList,
  filteredList,
  search,
  sortBy,
}) {
  const source = filteredList ?? pokemonList;
  const result = source.filter((pokemon) =>
    pokemonMatchesQuery(pokemon, search)
  );

  return result.sort((first, second) => {
    if (sortBy === "id-desc") return second.id - first.id;
    if (sortBy === "az") {
      return first.displayName.localeCompare(second.displayName, "pt-BR");
    }
    if (sortBy === "za") {
      return second.displayName.localeCompare(first.displayName, "pt-BR");
    }

    return first.id - second.id;
  });
}

export function findPokemonSuggestionsUseCase(pokemonList, rawQuery) {
  const query = String(rawQuery || "").trim().toLocaleLowerCase("pt-BR");
  if (!query) return [];

  const starts = [];
  const contains = [];

  for (const pokemon of pokemonList) {
    const slug = pokemon.slug.toLowerCase();
    const displayName = pokemon.displayName.toLocaleLowerCase("pt-BR");

    if (slug.startsWith(query) || displayName.startsWith(query)) {
      starts.push(pokemon);
    } else if (slug.includes(query) || displayName.includes(query)) {
      contains.push(pokemon);
    }

    if (starts.length + contains.length >= 40) break;
  }

  return [...starts, ...contains].slice(0, 8);
}

export function findPokemonBySearchUseCase(pokemonList, rawValue) {
  const value = String(rawValue || "").trim().toLocaleLowerCase("pt-BR");
  if (!value) return null;

  if (/^\d+$/.test(value)) {
    return pokemonList.find((pokemon) => pokemon.id === Number(value)) || null;
  }

  return (
    pokemonList.find(
      (pokemon) =>
        pokemon.slug === value ||
        pokemon.displayName.toLocaleLowerCase("pt-BR") === value
    ) || null
  );
}

export async function loadPokedexListUseCase(options) {
  const [pokemonData, abilityData] = await Promise.all([
    listPokemonUseCase(options),
    listAbilitiesUseCase(options),
  ]);

  return {
    pokemon: pokemonData.results,
    abilities: abilityData.results,
  };
}

export async function loadPokemonCardsUseCase(pokemonList, currentDetails = {}) {
  const missingPokemon = pokemonList.filter(
    (pokemon) => !currentDetails[pokemon.id]
  );

  if (!missingPokemon.length) return {};

  const responses = await Promise.all(
    missingPokemon.map((pokemon) => loadPokemonUseCase(pokemon.id))
  );

  return Object.fromEntries(
    responses.map((pokemon) => [
      pokemon.id,
      {
        types: pokemon.types,
        height: pokemon.heightDecimeters,
        weight: pokemon.weightHectograms,
      },
    ])
  );
}

function intersectSets(firstSet, secondSet) {
  if (!firstSet) return secondSet;
  if (!secondSet) return firstSet;

  const output = new Set();
  const smallSet = firstSet.size <= secondSet.size ? firstSet : secondSet;
  const bigSet = firstSet.size <= secondSet.size ? secondSet : firstSet;

  for (const value of smallSet) {
    if (bigSet.has(value)) output.add(value);
  }

  return output;
}

async function getTypeFilterData(typeCode) {
  if (typeCache.has(typeCode)) return typeCache.get(typeCode);

  const type = await loadTypeUseCase(typeCode);
  const packed = {
    ids: new Set(type.pokemonIds),
    damageTo: type.doubleDamageTo.map((relation) => relation.code),
  };

  typeCache.set(typeCode, packed);
  return packed;
}

async function getAbilityPokemonIds(abilityCode) {
  if (abilityCache.has(abilityCode)) return abilityCache.get(abilityCode);

  const ability = await loadAbilityUseCase(abilityCode);
  const ids = new Set(ability.pokemonIds);

  abilityCache.set(abilityCode, ids);
  return ids;
}

function passesPhysicalFilters(details, heightGroup, weightGroup) {
  const heightInMeters = Number(details?.height || 0) / 10;
  const weightInKilograms = Number(details?.weight || 0) / 10;

  const passesHeight =
    heightGroup === "all" ||
    (heightGroup === "short" && heightInMeters <= 1) ||
    (heightGroup === "medium" && heightInMeters > 1 && heightInMeters <= 2) ||
    (heightGroup === "tall" && heightInMeters > 2);

  const passesWeight =
    weightGroup === "all" ||
    (weightGroup === "light" && weightInKilograms <= 20) ||
    (weightGroup === "medium" &&
      weightInKilograms > 20 &&
      weightInKilograms <= 100) ||
    (weightGroup === "heavy" && weightInKilograms > 100);

  return passesHeight && passesWeight;
}

async function loadDetailsInChunks(ids, pokemonById, currentDetails) {
  const missingIds = ids.filter(
    (id) => !currentDetails[id] && pokemonById.has(id)
  );
  const loadedDetails = {};

  for (let index = 0; index < missingIds.length; index += 12) {
    const chunk = missingIds.slice(index, index + 12);
    const responses = await Promise.all(
      chunk.map((id) => loadPokemonUseCase(id))
    );

    for (const pokemon of responses) {
      loadedDetails[pokemon.id] = {
        types: pokemon.types,
        height: pokemon.heightDecimeters,
        weight: pokemon.weightHectograms,
      };
    }
  }

  return loadedDetails;
}

export async function applyPokedexFiltersUseCase({
  filter,
  typeMode,
  pokemonList,
  currentDetails,
}) {
  const validation = validatePokedexFilterUseCase(filter);

  if (!validation.success) {
    return {
      success: false,
      message: `Filtros inválidos: ${validation.error.issues[0].message}`,
    };
  }

  const { minId, maxId, ability, heightGroup, weightGroup } = validation.data;
  const pokemonById = new Map(pokemonList.map((pokemon) => [pokemon.id, pokemon]));
  let candidate = new Set();

  for (let id = minId; id <= maxId; id += 1) candidate.add(id);

  for (const typeCode of POKEDEX_TYPE_CODES.filter(
    (type) => typeMode[type] === "type"
  )) {
    const typeData = await getTypeFilterData(typeCode);
    candidate = intersectSets(candidate, typeData.ids);
  }

  for (const attackType of POKEDEX_TYPE_CODES.filter(
    (type) => typeMode[type] === "weakness"
  )) {
    const attackData = await getTypeFilterData(attackType);
    const union = new Set();

    for (const defenseType of attackData.damageTo) {
      const defenseData = await getTypeFilterData(defenseType);
      for (const id of defenseData.ids) union.add(id);
    }

    candidate = intersectSets(candidate, union);
  }

  if (ability !== "all") {
    candidate = intersectSets(
      candidate,
      await getAbilityPokemonIds(ability)
    );
  }

  const candidateIds = Array.from(candidate);
  const needsPhysicalDetails =
    heightGroup !== "all" || weightGroup !== "all";
  const loadedDetails = needsPhysicalDetails
    ? await loadDetailsInChunks(candidateIds, pokemonById, currentDetails)
    : {};
  const details = { ...currentDetails, ...loadedDetails };
  const finalIds = needsPhysicalDetails
    ? candidateIds.filter((id) =>
        passesPhysicalFilters(details[id], heightGroup, weightGroup)
      )
    : candidateIds;

  return {
    success: true,
    details: loadedDetails,
    pokemon: finalIds
      .sort((first, second) => first - second)
      .map((id) => pokemonById.get(id))
      .filter(Boolean),
  };
}
