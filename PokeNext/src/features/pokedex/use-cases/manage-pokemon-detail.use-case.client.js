import {
  listPokemonSpeciesUseCase,
  loadPokedexResourceUseCase,
  loadPokemonUseCase,
} from "./load-pokedex.use-case.client";

const NATIONAL_DEX_FALLBACK = 1025;
const GROUP_ORDER = {
  Mecânica: 0,
  Regional: 1,
  Forma: 2,
  Outras: 3,
};

export async function loadNationalDexCountUseCase(options) {
  const result = await listPokemonSpeciesUseCase(options);
  return result.count > 0 ? result.count : NATIONAL_DEX_FALLBACK;
}

export function loadPokemonDetailUseCase(idOrName, options) {
  return loadPokemonUseCase(idOrName, options);
}

export async function loadPokemonEvolutionUseCase(pokemon, options) {
  if (!pokemon?.speciesUrl) return [];

  const species = await loadPokedexResourceUseCase(
    pokemon.speciesUrl,
    "species",
    options
  );

  if (!species.evolutionChainUrl) {
    throw new Error("Cadeia evolutiva não encontrada.");
  }

  const evolution = await loadPokedexResourceUseCase(
    species.evolutionChainUrl,
    "evolution",
    options
  );
  const uniqueSlugs = Array.from(new Set(evolution.stages.flat()));
  const basePokemon = await Promise.all(
    uniqueSlugs.map((slug) => loadPokemonUseCase(slug, options))
  );
  const enrichedPokemon = await Promise.all(
    basePokemon.map(async (currentPokemon) => {
      if (!currentPokemon.speciesUrl) {
        return { ...currentPokemon, varieties: [] };
      }

      const currentSpecies = await loadPokedexResourceUseCase(
        currentPokemon.speciesUrl,
        "species",
        options
      );
      const varieties = currentSpecies.varieties
        .filter((variety) => variety.slug !== currentPokemon.slug)
        .map((variety) => ({
          id: variety.id,
          slug: variety.slug,
          displayName: variety.displayName,
          group: variety.formGroup,
          label: variety.formLabel,
        }))
        .sort((first, second) => {
          const groupDifference =
            (GROUP_ORDER[first.group] ?? 99) -
            (GROUP_ORDER[second.group] ?? 99);

          return (
            groupDifference ||
            first.displayName.localeCompare(second.displayName, "pt-BR")
          );
        });

      return {
        id: currentPokemon.id,
        slug: currentPokemon.slug,
        displayName: currentPokemon.displayName,
        artwork: currentPokemon.artworkUrl,
        types: currentPokemon.types,
        speciesUrl: currentPokemon.speciesUrl,
        varieties,
      };
    })
  );
  const bySlug = new Map(
    enrichedPokemon.map((currentPokemon) => [
      currentPokemon.slug,
      currentPokemon,
    ])
  );

  return evolution.stages
    .map((stage) => stage.map((slug) => bySlug.get(slug)).filter(Boolean))
    .filter((stage) => stage.length > 0);
}

export function getPokemonFormsUseCase(evolutionStages, pokemonId) {
  const flattened = evolutionStages.flat();
  const currentEvolution = flattened.find(
    (pokemon) => String(pokemon.id) === String(pokemonId)
  );
  const baseWithVarieties =
    flattened.find(
      (pokemon) =>
        pokemon.varieties?.some(
          (variety) => String(variety.id) === String(pokemonId)
        )
    ) || currentEvolution;

  if (!baseWithVarieties) return [];

  return [
    {
      id: baseWithVarieties.id,
      slug: baseWithVarieties.slug,
      displayName: baseWithVarieties.displayName,
      label: "Forma padrão",
    },
    ...(baseWithVarieties.varieties || []),
  ];
}

export function getAdjacentPokemonIdsUseCase(currentId, maxId) {
  const safeMax = Number(maxId) > 0 ? Number(maxId) : NATIONAL_DEX_FALLBACK;

  return {
    previousId: currentId > 1 ? currentId - 1 : safeMax,
    nextId: currentId < safeMax ? currentId + 1 : 1,
  };
}

export async function loadAdjacentPokemonUseCase(
  previousId,
  nextId,
  options
) {
  const [previous, next] = await Promise.all([
    loadPokemonUseCase(previousId, options),
    loadPokemonUseCase(nextId, options),
  ]);

  return {
    previous: { id: previousId, displayName: previous.displayName },
    next: { id: nextId, displayName: next.displayName },
  };
}

export async function loadPokemonSpeciesTextUseCase(speciesUrl, options) {
  const species = await loadPokedexResourceUseCase(
    speciesUrl,
    "species",
    options
  );

  return {
    description:
      species.description || "Descrição não disponível em português.",
    category:
      species.category || "Categoria não disponível em português.",
  };
}

export async function calculatePokemonWeaknessesUseCase(types, options) {
  const typeData = await Promise.all(
    (types || []).map((type) =>
      loadPokedexResourceUseCase(type.url, "type", options)
    )
  );
  const multipliers = new Map();
  const labels = new Map();

  function multiply(relations, factor) {
    for (const relation of relations || []) {
      labels.set(relation.code, relation.label);
      multipliers.set(
        relation.code,
        (multipliers.get(relation.code) || 1) * factor
      );
    }
  }

  for (const currentType of typeData) {
    multiply(currentType.doubleDamageFrom, 2);
    multiply(currentType.halfDamageFrom, 0.5);
    multiply(currentType.noDamageFrom, 0);
  }

  return Array.from(multipliers.entries())
    .filter(([, multiplier]) => multiplier > 1)
    .map(([code]) => ({
      code,
      label: labels.get(code) || "Tipo desconhecido",
    }))
    .sort((first, second) =>
      first.label.localeCompare(second.label, "pt-BR")
    );
}
