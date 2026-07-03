"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronUp,
  BrushCleaning,
  Tally1,
  Tally2,
  Tally3,
} from "lucide-react";
import { useRouter } from "next/navigation";

const TYPE_STYLES = {
  bug: "bg-[#A8B820] text-white",
  dragon: "bg-[#7038F8] text-white",
  fairy: "bg-[#EE99AC] text-white",
  fire: "bg-[#F08030] text-white",
  ghost: "bg-[#705898] text-white",
  ground: "bg-[#E0C068] text-white",
  normal: "bg-[#A8A878] text-white",
  psychic: "bg-[#F85888] text-white",
  steel: "bg-[#B8B8D0] text-white",
  dark: "bg-[#705848] text-white",
  electric: "bg-[#F8D030] text-white",
  fighting: "bg-[#C03028] text-white",
  flying: "bg-[#A890F0] text-white",
  grass: "bg-[#78C850] text-white",
  ice: "bg-[#98D8D8] text-white",
  poison: "bg-[#A040A0] text-white",
  rock: "bg-[#B8A038] text-white",
  water: "bg-[#6890F0] text-white",
  default: "bg-neutral-400 text-white",
};

const TYPE_LABELS_PT = {
  bug: "Bug",
  dragon: "Dragon",
  fairy: "Fairy",
  fire: "Fire",
  ghost: "Ghost",
  ground: "Ground",
  normal: "Normal",
  psychic: "Psychic",
  steel: "Steel",
  dark: "Dark",
  electric: "Electric",
  fighting: "Fighting",
  flying: "Flying",
  grass: "Grass",
  ice: "Ice",
  poison: "Poison",
  rock: "Rock",
  water: "Water",
};

const ALL_TYPES = Object.keys(TYPE_LABELS_PT);

function getTypeClass(typeName) {
  return TYPE_STYLES[typeName] || TYPE_STYLES.default;
}

function formatPokemonName(name) {
  return String(name || "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getIdFromUrl(url) {
  try {
    return Number(url.split("/")[6]);
  } catch {
    return NaN;
  }
}

function simpleMatch(pokemon, qRaw) {
  const q = String(qRaw || "").trim().toLowerCase();

  if (!q) return true;

  const isOnlyNumber = /^\d+$/.test(q);

  if (isOnlyNumber) {
    return pokemon.id === Number(q);
  }

  return pokemon.name.toLowerCase().includes(q);
}

function createInitialTypeMode() {
  const initial = {};

  ALL_TYPES.forEach((type) => {
    initial[type] = null;
  });

  return initial;
}

export default function Pokedex() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");

  const [allNames, setAllNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [allPokemonList, setAllPokemonList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);

  const [pokemonDetails, setPokemonDetails] = useState({});

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedLoading, setAdvancedLoading] = useState(false);

  const [typeMode, setTypeMode] = useState(createInitialTypeMode);

  const [abilities, setAbilities] = useState([]);
  const [ability, setAbility] = useState("all");

  const [heightGroup, setHeightGroup] = useState("all");
  const [weightGroup, setWeightGroup] = useState("all");

  const [minId, setMinId] = useState(1);
  const [maxId, setMaxId] = useState(1025);

  const [filteredList, setFilteredList] = useState(null);

  const [sortBy, setSortBy] = useState("id-asc");

  const typeCacheRef = useRef(new Map());
  const abilityCacheRef = useRef(new Map());

  const pokemonById = useMemo(() => {
    const pokemonMap = new Map();

    allPokemonList.forEach((pokemon) => {
      pokemonMap.set(pokemon.id, pokemon);
    });

    return pokemonMap;
  }, [allPokemonList]);

  const baseList = filteredList ?? allPokemonList;

  const listForGrid = useMemo(() => {
    const query = String(search || "").trim();

    if (!query) return baseList;

    return baseList.filter((pokemon) => simpleMatch(pokemon, query));
  }, [baseList, search]);

  const sortedListForGrid = useMemo(() => {
    const nextList = [...listForGrid];

    switch (sortBy) {
      case "id-desc":
        nextList.sort((a, b) => b.id - a.id);
        break;

      case "az":
        nextList.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "za":
        nextList.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "id-asc":
      default:
        nextList.sort((a, b) => a.id - b.id);
        break;
    }

    return nextList;
  }, [listForGrid, sortBy]);

  useEffect(() => {
    setVisibleCount(15);
  }, [search, sortBy]);

  useEffect(() => {
    let alive = true;

    async function loadNamesAndPokedex() {
      try {
        setLoadingList(true);
        setError("");

        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1025"
        );
        const data = await response.json();

        if (!alive) return;

        setAllNames(data.results.map((pokemon) => pokemon.name));

        const formattedList = data.results.map((pokemon) => {
          const id = getIdFromUrl(pokemon.url);

          return {
            name: pokemon.name,
            id,
            url: pokemon.url,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          };
        });

        setAllPokemonList(formattedList);
      } catch (loadError) {
        console.error(loadError);

        if (alive) {
          setError("Erro ao carregar a Pokédex.");
        }
      } finally {
        if (alive) {
          setLoadingList(false);
        }
      }
    }

    loadNamesAndPokedex();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadAbilities() {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/ability?limit=500"
        );
        const data = await response.json();

        if (!alive) return;

        setAbilities(data.results || []);
      } catch (loadError) {
        console.error(loadError);
      }
    }

    loadAbilities();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!sortedListForGrid.length) return;

    const visiblePokemon = sortedListForGrid.slice(0, visibleCount);
    const missingPokemon = visiblePokemon.filter(
      (pokemon) => !pokemonDetails[pokemon.id]
    );

    if (missingPokemon.length === 0) return;

    let alive = true;

    async function loadVisibleDetails() {
      try {
        const responses = await Promise.all(
          missingPokemon.map((pokemon) =>
            fetch(pokemon.url).then((response) => response.json())
          )
        );

        if (!alive) return;

        setPokemonDetails((currentDetails) => {
          const updatedDetails = { ...currentDetails };

          responses.forEach((data) => {
            updatedDetails[data.id] = {
              types: data.types.map((typeItem) => typeItem.type.name),
              height: data.height,
              weight: data.weight,
            };
          });

          return updatedDetails;
        });
      } catch (loadError) {
        console.error(loadError);
      }
    }

    loadVisibleDetails();

    return () => {
      alive = false;
    };
  }, [sortedListForGrid, visibleCount, pokemonDetails]);

  useEffect(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      const starts = [];
      const contains = [];

      for (const name of allNames) {
        if (name.startsWith(query)) {
          starts.push(name);
        } else if (name.includes(query)) {
          contains.push(name);
        }

        if (starts.length + contains.length >= 40) break;
      }

      setSuggestions([...starts, ...contains].slice(0, 8));
    }, 120);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search, allNames]);

  function navigateToPokemon(value) {
    const rawValue = String(value || "").trim().toLowerCase();

    if (!rawValue) return;

    if (/^\d+$/.test(rawValue)) {
      router.push(`/Pokedex/${Number(rawValue)}`);
      return;
    }

    const foundPokemon = allPokemonList.find(
      (pokemon) => pokemon.name === rawValue
    );

    if (!foundPokemon?.id) return;

    router.push(`/Pokedex/${foundPokemon.id}`);
  }

  function pickSuggestion(name) {
    setSearch(name);
    setSuggestions([]);
    setError("");
  }

  function applySimpleSearch() {
    setSuggestions([]);
    setError("");
  }

  function clearAllFilters() {
    setSearch("");
    setSuggestions([]);
    setError("");

    setFilteredList(null);
    setVisibleCount(15);

    setTypeMode(createInitialTypeMode);

    setAbility("all");
    setHeightGroup("all");
    setWeightGroup("all");
    setMinId(1);
    setMaxId(1025);
  }

  function intersectSets(firstSet, secondSet) {
    if (!firstSet) return secondSet;
    if (!secondSet) return firstSet;

    const output = new Set();
    const smallSet = firstSet.size <= secondSet.size ? firstSet : secondSet;
    const bigSet = firstSet.size <= secondSet.size ? secondSet : firstSet;

    for (const value of smallSet) {
      if (bigSet.has(value)) {
        output.add(value);
      }
    }

    return output;
  }

  async function getTypeData(typeName) {
    if (typeCacheRef.current.has(typeName)) {
      return typeCacheRef.current.get(typeName);
    }

    const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
    const data = await response.json();

    const ids = new Set(
      (data.pokemon || [])
        .map((item) => getIdFromUrl(item.pokemon?.url))
        .filter((id) => Number.isFinite(id))
    );

    const damageTo = (data.damage_relations?.double_damage_to || []).map(
      (type) => type.name
    );

    const packedData = { ids, damageTo };

    typeCacheRef.current.set(typeName, packedData);

    return packedData;
  }

  async function getAbilityIds(abilityName) {
    if (abilityCacheRef.current.has(abilityName)) {
      return abilityCacheRef.current.get(abilityName);
    }

    const response = await fetch(
      `https://pokeapi.co/api/v2/ability/${abilityName}`
    );
    const data = await response.json();

    const ids = new Set(
      (data.pokemon || [])
        .map((item) => getIdFromUrl(item.pokemon?.url))
        .filter((id) => Number.isFinite(id))
    );

    abilityCacheRef.current.set(abilityName, ids);

    return ids;
  }

  function heightPass(heightDm) {
    const heightInMeters = (heightDm || 0) / 10;

    if (heightGroup === "all") return true;
    if (heightGroup === "short") return heightInMeters <= 1;
    if (heightGroup === "medium") {
      return heightInMeters > 1 && heightInMeters <= 2;
    }
    if (heightGroup === "tall") return heightInMeters > 2;

    return true;
  }

  function weightPass(weightHg) {
    const weightInKg = (weightHg || 0) / 10;

    if (weightGroup === "all") return true;
    if (weightGroup === "light") return weightInKg <= 20;
    if (weightGroup === "medium") {
      return weightInKg > 20 && weightInKg <= 100;
    }
    if (weightGroup === "heavy") return weightInKg > 100;

    return true;
  }

  async function fetchPokemonDetailsByIds(idsArray) {
    const loadedDetails = {};
    const missingIds = idsArray.filter((id) => {
      return !pokemonDetails[id] && pokemonById.get(id)?.url;
    });

    if (missingIds.length === 0) {
      return pokemonDetails;
    }

    const concurrency = 12;
    let index = 0;

    while (index < missingIds.length) {
      const chunk = missingIds.slice(index, index + concurrency);
      index += concurrency;

      const responses = await Promise.all(
        chunk.map((id) => {
          const pokemon = pokemonById.get(id);
          return fetch(pokemon.url).then((response) => response.json());
        })
      );

      responses.forEach((data) => {
        loadedDetails[data.id] = {
          types: data.types.map((typeItem) => typeItem.type.name),
          height: data.height,
          weight: data.weight,
        };
      });
    }

    setPokemonDetails((currentDetails) => ({
      ...currentDetails,
      ...loadedDetails,
    }));

    return {
      ...pokemonDetails,
      ...loadedDetails,
    };
  }

  async function applyAdvancedFilters() {
    try {
      setAdvancedLoading(true);
      setError("");

      const min = Math.max(1, Number(minId) || 1);
      const max = Math.min(1025, Number(maxId) || 1025);

      if (min > max) {
        setError(
          "Intervalo inválido: o número inicial não pode ser maior que o final."
        );
        return;
      }

      let candidate = new Set();

      for (let id = min; id <= max; id++) {
        candidate.add(id);
      }

      const selectedTypes = ALL_TYPES.filter(
        (type) => typeMode[type] === "type"
      );

      for (const type of selectedTypes) {
        const typeData = await getTypeData(type);
        candidate = intersectSets(candidate, typeData.ids);
      }

      const selectedWeaknesses = ALL_TYPES.filter(
        (type) => typeMode[type] === "weakness"
      );

      for (const attackType of selectedWeaknesses) {
        const attackData = await getTypeData(attackType);
        const defenseTypes = attackData.damageTo || [];
        const union = new Set();

        for (const defenseType of defenseTypes) {
          const defenseData = await getTypeData(defenseType);

          for (const id of defenseData.ids) {
            union.add(id);
          }
        }

        candidate = intersectSets(candidate, union);
      }

      if (ability !== "all") {
        const abilityIds = await getAbilityIds(ability);
        candidate = intersectSets(candidate, abilityIds);
      }

      const needsHeightOrWeight =
        heightGroup !== "all" || weightGroup !== "all";

      const candidateIdsBeforePhysicalFilter = Array.from(candidate);

      if (needsHeightOrWeight) {
        const detailsMap = await fetchPokemonDetailsByIds(
          candidateIdsBeforePhysicalFilter
        );

        const filteredByPhysicalData = candidateIdsBeforePhysicalFilter.filter(
          (id) => {
            const details = detailsMap[id];

            if (!details) return false;

            return heightPass(details.height) && weightPass(details.weight);
          }
        );

        candidate = new Set(filteredByPhysicalData);
      }

      const finalIds = Array.from(candidate).sort((a, b) => a - b);

      const finalList = finalIds
        .map((id) => pokemonById.get(id))
        .filter(Boolean);

      setFilteredList(finalList);
      setVisibleCount(15);
    } catch (filterError) {
      console.error(filterError);
      setError("Erro ao aplicar filtros avançados.");
    } finally {
      setAdvancedLoading(false);
    }
  }

  function resetAdvanced() {
    setTypeMode(createInitialTypeMode);

    setAbility("all");
    setHeightGroup("all");
    setWeightGroup("all");
    setMinId(1);
    setMaxId(1025);

    setFilteredList(null);
    setVisibleCount(15);
    setError("");
  }

  function toggleTypeMode(typeName, mode) {
    setTypeMode((currentTypeMode) => {
      const currentMode = currentTypeMode[typeName];
      const nextMode = currentMode === mode ? null : mode;

      return {
        ...currentTypeMode,
        [typeName]: nextMode,
      };
    });
  }

  return (
    <div>
      <h1
        className="
          text-2xl sm:text-3xl
          font-normal tracking-tight text-neutral-700
          text-left
          ml-5 sm:ml-10 md:ml-10 lg:ml-16
        "
      >
        Pokedex
      </h1>

      <div className="relative w-full">
        <section className="mb-10 mt-6 w-full px-3 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <motion.div
              className={`
                relative z-20
                mx-auto w-full
                bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat
                px-5 py-5 shadow-md backdrop-blur-sm
                sm:px-8 md:px-10 lg:px-12 xl:px-16
                ${advancedOpen ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"}
              `}
            >
              <div className="mb-3">
                <div className="mb-3 flex items-center gap-2">
                  <motion.div
                    className="h-4 w-1.5 rounded-sm bg-[#E3350D] shadow-[0_0_6px_#E3350D]"
                    initial={{ scaleY: 0.3, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                  />

                  <label className="block text-lg font-medium text-white">
                    Nome ou número
                  </label>
                </div>

                <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <div className="relative w-full sm:w-auto">
                    <input
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          applySimpleSearch();
                        }
                      }}
                      className="
                        w-full rounded-md border border-neutral-200 bg-neutral-50
                        px-4 py-2 text-gray-900
                        focus:outline-none focus:ring-2 focus:ring-[#E3350D]/70
                        sm:w-80 md:w-96 lg:w-md
                      "
                    />

                    {suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
                        {suggestions.map((name) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => pickSuggestion(name)}
                            className="w-full cursor-pointer px-4 py-2 text-left text-sm capitalize transition hover:bg-neutral-100"
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={applySimpleSearch}
                      className="flex h-[42px] cursor-pointer items-center justify-center rounded-md bg-[#E3350D] px-4 text-white hover:bg-[#c52c0b]"
                      aria-label="Buscar"
                      title="Buscar"
                    >
                      <Search className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="flex h-[42px] cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/15 px-4 text-white hover:bg-white/20"
                      aria-label="Limpar filtros"
                      title="Limpar filtros"
                    >
                      <BrushCleaning className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm text-white sm:text-base">
                  Use a busca avançada para explorar Pokémon por tipo, fraqueza,
                  habilidade e mais!
                </p>
              </div>

              {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
            </motion.div>

            <div>
              <AnimatePresence initial={false}>
                {advancedOpen && (
                  <motion.div
                    key="advanced"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-b-[3px] bg-[#616161] p-4">
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                          <div className="mb-3 flex items-start justify-between gap-4">
                            <h3 className="text-lg font-semibold text-white">
                              Tipo e Fraqueza
                            </h3>

                            <div className="text-xs text-white/70">
                              <span className="font-semibold">T</span> = Tipo{" "}
                              <span className="font-semibold">F</span> = Fraqueza
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {ALL_TYPES.map((type) => {
                              const mode = typeMode[type];
                              const isType = mode === "type";
                              const isWeakness = mode === "weakness";

                              return (
                                <div
                                  key={type}
                                  className="flex items-center justify-between gap-2"
                                >
                                  <span
                                    className={`min-w-[120px] rounded-md px-3 py-1 text-center text-xs font-semibold ${getTypeClass(
                                      type
                                    )}`}
                                  >
                                    {TYPE_LABELS_PT[type]}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleTypeMode(type, "type")
                                      }
                                      className={`h-7 w-7 cursor-pointer rounded-full border text-xs font-bold transition
                                        ${
                                          isType
                                            ? "border-white bg-white text-neutral-900"
                                            : "border-white/40 bg-transparent text-white hover:border-white/80"
                                        }`}
                                      title="Filtrar por Tipo"
                                    >
                                      T
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleTypeMode(type, "weakness")
                                      }
                                      className={`h-7 w-7 cursor-pointer rounded-full border text-xs font-bold transition
                                        ${
                                          isWeakness
                                            ? "border-white bg-white text-neutral-900"
                                            : "border-white/40 bg-transparent text-white hover:border-white/80"
                                        }`}
                                      title="Filtrar por Fraqueza"
                                    >
                                      F
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="lg:col-span-5">
                          <div className="mb-5">
                            <h3 className="mb-2 text-lg font-semibold text-white">
                              Habilidade
                            </h3>

                            <div className="relative w-full max-w-[300px]">
                              <select
                                value={ability}
                                onChange={(event) =>
                                  setAbility(event.target.value)
                                }
                                className="w-full appearance-none rounded-md border border-white/10 bg-neutral-700 px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[#E3350D]/60"
                              >
                                <option value="all">Todas</option>

                                {abilities.map((currentAbility) => (
                                  <option
                                    key={currentAbility.name}
                                    value={currentAbility.name}
                                  >
                                    {formatPokemonName(currentAbility.name)}
                                  </option>
                                ))}
                              </select>

                              <svg
                                className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>

                          <div className="mb-5">
                            <h3 className="mb-2 text-lg font-semibold text-white">
                              Altura
                            </h3>

                            <div className="grid grid-cols-3 gap-3">
                              <button
                                type="button"
                                onClick={() => setHeightGroup("short")}
                                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 transition
                                  ${
                                    heightGroup === "short"
                                      ? "border-white bg-white text-neutral-900"
                                      : "border-white/10 bg-white/10 text-white hover:bg-white/15"
                                  }`}
                                title="Baixa (≤ 1m)"
                              >
                                <Tally1 className="h-6 w-6" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setHeightGroup("medium")}
                                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 transition
                                  ${
                                    heightGroup === "medium"
                                      ? "border-white bg-white text-neutral-900"
                                      : "border-white/10 bg-white/10 text-white hover:bg-white/15"
                                  }`}
                                title="Média (1m ~ 2m)"
                              >
                                <Tally2 className="h-6 w-6" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setHeightGroup("tall")}
                                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 transition
                                  ${
                                    heightGroup === "tall"
                                      ? "border-white bg-white text-neutral-900"
                                      : "border-white/10 bg-white/10 text-white hover:bg-white/15"
                                  }`}
                                title="Alta (> 2m)"
                              >
                                <Tally3 className="h-6 w-6" />
                              </button>
                            </div>

                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => setHeightGroup("all")}
                                className="cursor-pointer text-xs text-white/70 underline hover:text-white"
                              >
                                Limpar altura
                              </button>
                            </div>
                          </div>

                          <div className="mb-1">
                            <h3 className="mb-2 text-lg font-semibold text-white">
                              Peso
                            </h3>

                            <div className="grid grid-cols-3 gap-3">
                              <button
                                type="button"
                                onClick={() => setWeightGroup("light")}
                                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 transition
                                  ${
                                    weightGroup === "light"
                                      ? "border-white bg-white text-neutral-900"
                                      : "border-white/10 bg-white/10 text-white hover:bg-white/15"
                                  }`}
                                title="Leve (≤ 20kg)"
                              >
                                <Tally1 className="h-6 w-6" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setWeightGroup("medium")}
                                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 transition
                                  ${
                                    weightGroup === "medium"
                                      ? "border-white bg-white text-neutral-900"
                                      : "border-white/10 bg-white/10 text-white hover:bg-white/15"
                                  }`}
                                title="Médio (20kg ~ 100kg)"
                              >
                                <Tally2 className="h-6 w-6" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setWeightGroup("heavy")}
                                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 transition
                                  ${
                                    weightGroup === "heavy"
                                      ? "border-white bg-white text-neutral-900"
                                      : "border-white/10 bg-white/10 text-white hover:bg-white/15"
                                  }`}
                                title="Pesado (> 100kg)"
                              >
                                <Tally3 className="h-6 w-6" />
                              </button>
                            </div>

                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => setWeightGroup("all")}
                                className="cursor-pointer text-xs text-white/70 underline hover:text-white"
                              >
                                Limpar peso
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-5 mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
                          <span className="text-lg font-semibold text-white">
                            Intervalo de números
                          </span>

                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={minId}
                              onChange={(event) => setMinId(event.target.value)}
                              className="no-spinner w-20 rounded-md border border-white/10 bg-white px-3 py-2 text-neutral-900 focus:outline-none"
                              min={1}
                              max={1025}
                            />

                            <span className="text-white/70">-</span>

                            <input
                              type="number"
                              value={maxId}
                              onChange={(event) => setMaxId(event.target.value)}
                              className="no-spinner w-24 rounded-md border border-white/10 bg-white px-3 py-2 text-neutral-900 focus:outline-none"
                              min={1}
                              max={1025}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-start gap-3 lg:justify-end">
                          <button
                            type="button"
                            onClick={resetAdvanced}
                            className="cursor-pointer rounded-md border border-white/10 bg-white/20 px-5 py-2 text-white hover:bg-white/25"
                          >
                            Redefinir
                          </button>

                          <button
                            type="button"
                            onClick={applyAdvancedFilters}
                            disabled={advancedLoading}
                            className="flex cursor-pointer items-center gap-2 rounded-md bg-[#E3350D] px-5 py-2 text-white hover:bg-[#c52c0b] disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <Search className="h-4 w-4" />
                            {advancedLoading ? "Pesquisando..." : "Pesquisar"}
                          </button>
                        </div>

                        <style jsx>{`
                          .no-spinner::-webkit-outer-spin-button,
                          .no-spinner::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                          }

                          .no-spinner {
                            -moz-appearance: textfield;
                            appearance: textfield;
                          }
                        `}</style>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative z-10 mx-auto flex w-60 justify-center overflow-visible rounded-b-[5px] bg-[#616161]">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen((currentValue) => !currentValue)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 py-2 text-white/90 transition hover:text-white"
                >
                  <span className="text-sm font-medium">
                    {advancedOpen
                      ? "Esconder busca avançada"
                      : "Mostrar busca avançada"}
                  </span>

                  <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                    {advancedOpen ? (
                      <ChevronUp className="h-4 w-4 text-neutral-900" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-neutral-900" />
                    )}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-8" />

            <div className="mb-2 flex w-full flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-end sm:px-0">
              <label className="block text-lg font-medium text-black">
                Organizar por:
              </label>

              <div className="w-fit sm:w-72">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="
                      w-full appearance-none rounded-md border border-white/10
                      bg-neutral-700 px-3 py-2 pr-10 text-white
                      focus:outline-none focus:ring-2 focus:ring-[#E3350D]/60
                    "
                  >
                    <option value="id-asc">Menor número primeiro</option>
                    <option value="id-desc">Maior número primeiro</option>
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                  </select>

                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {loadingList ? (
              <div className="mt-6 text-center text-neutral-600">
                Carregando Pokédex...
              </div>
            ) : sortedListForGrid.length > 0 ? (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {sortedListForGrid.slice(0, visibleCount).map((pokemon) => {
                    const details = pokemonDetails[pokemon.id];

                    return (
                      <motion.button
                        key={pokemon.id}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => navigateToPokemon(pokemon.id)}
                        className="flex cursor-pointer flex-col items-stretch justify-start rounded-md border border-neutral-200 bg-white p-4 text-left shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition-shadow duration-200 hover:shadow-[0_8px_18px_rgba(0,0,0,0.1)]"
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100">
                          <Image
                            src={pokemon.image}
                            alt={pokemon.name}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
                            className="object-contain"
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <motion.div
                              className="h-4 w-1.5 shrink-0 rounded-sm bg-[#E3350D] shadow-[0_0_6px_#E3350D]"
                              initial={{ scaleY: 0.3, opacity: 0 }}
                              animate={{ scaleY: 1, opacity: 1 }}
                              transition={{ delay: 0.2, duration: 0.35 }}
                            />

                            <span className="truncate text-lg font-semibold capitalize text-neutral-600">
                              {formatPokemonName(pokemon.name)}
                            </span>
                          </div>

                          <span className="shrink-0 text-lg font-semibold text-neutral-600">
                            #{String(pokemon.id).padStart(3, "0")}
                          </span>
                        </div>

                        {details?.types ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {details.types.map((typeName) => (
                              <span
                                key={typeName}
                                className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${getTypeClass(
                                  typeName
                                )}`}
                              >
                                {typeName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-2 flex justify-center">
                            <span className="text-[11px] text-slate-500">
                              Carregando tipos...
                            </span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-center">
                  {visibleCount < sortedListForGrid.length && (
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((currentValue) => currentValue + 15)
                      }
                      className="cursor-pointer rounded-md bg-[#E3350D] px-6 py-2 text-white hover:bg-[#c52c0b]"
                    >
                      Carregar mais Pokémon
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center text-neutral-700">
                Nenhum Pokémon encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}