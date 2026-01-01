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
  bug: "bg-[#A8B820] text-white dark:bg-[#A8B820] dark:text-white",
  dragon: "bg-[#7038F8] text-white dark:bg-[#7038F8] dark:text-white",
  fairy: "bg-[#EE99AC] text-white dark:bg-[#EE99AC] dark:text-white",
  fire: "bg-[#F08030] text-white dark:bg-[#F08030] dark:text-white",
  ghost: "bg-[#705898] text-white dark:bg-[#705898] dark:text-white",
  ground: "bg-[#E0C068] text-white dark:bg-[#E0C068] dark:text-white",
  normal: "bg-[#A8A878] text-white dark:bg-[#A8A878] dark:text-white",
  psychic: "bg-[#F85888] text-white dark:bg-[#F85888] dark:text-white",
  steel: "bg-[#B8B8D0] text-white dark:bg-[#B8B8D0] dark:text-white",
  dark: "bg-[#705848] text-white dark:bg-[#705848] dark:text-white",
  electric: "bg-[#F8D030] text-white dark:bg-[#F8D030] dark:text-white",
  fighting: "bg-[#C03028] text-white dark:bg-[#C03028] dark:text-white",
  flying: "bg-[#A890F0] text-white dark:bg-[#A890F0] dark:text-white",
  grass: "bg-[#78C850] text-white dark:bg-[#78C850] dark:text-white",
  ice: "bg-[#98D8D8] text-white dark:bg-[#98D8D8] dark:text-white",
  poison: "bg-[#A040A0] text-white dark:bg-[#A040A0] dark:text-white",
  rock: "bg-[#B8A038] text-white dark:bg-[#B8A038] dark:text-white",
  water: "bg-[#6890F0] text-white dark:bg-[#6890F0] dark:text-white",
  default: "bg-neutral-300 text-white dark:bg-neutral-700 dark:text-white",
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
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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
    const n = Number(q);
    return pokemon.id === n;
  }

  return pokemon.name.toLowerCase().includes(q);
}

export default function Pokedex() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");

  const [allNames, setAllNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [allPokemonList, setAllPokemonList] = useState([]); // [{id,name,url,image}]
  const [visibleCount, setVisibleCount] = useState(15);

  const [pokemonDetails, setPokemonDetails] = useState({}); // { [id]: { types:[], height, weight } }

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedLoading, setAdvancedLoading] = useState(false);

  const [typeMode, setTypeMode] = useState(() => {
    const initial = {};
    ALL_TYPES.forEach((t) => (initial[t] = null));
    return initial;
  });

  const [abilities, setAbilities] = useState([]); // [{name}]
  const [ability, setAbility] = useState("all");

  const [heightGroup, setHeightGroup] = useState("all"); // all | short | medium | tall
  const [weightGroup, setWeightGroup] = useState("all"); // all | light | medium | heavy

  const [minId, setMinId] = useState(1);
  const [maxId, setMaxId] = useState(1025);

  const [filteredList, setFilteredList] = useState(null); // null | array

  const [sortBy, setSortBy] = useState("id-asc"); // id-asc | id-desc | az | za

  const typeCacheRef = useRef(new Map()); // typeName -> { ids:Set<number>, damageTo:string[] }
  const abilityCacheRef = useRef(new Map()); // abilityName -> Set<number>

  const pokemonById = useMemo(() => {
    const m = new Map();
    allPokemonList.forEach((p) => m.set(p.id, p));
    return m;
  }, [allPokemonList]);

  const baseList = filteredList ?? allPokemonList;

  const listForGrid = useMemo(() => {
    const q = String(search || "").trim();
    if (!q) return baseList;
    return baseList.filter((p) => simpleMatch(p, q));
  }, [baseList, search]);

  const sortedListForGrid = useMemo(() => {
    const arr = [...listForGrid];

    switch (sortBy) {
      case "id-desc":
        arr.sort((a, b) => b.id - a.id);
        break;
      case "az":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        arr.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "id-asc":
      default:
        arr.sort((a, b) => a.id - b.id);
        break;
    }

    return arr;
  }, [listForGrid, sortBy]);

  useEffect(() => {
    setVisibleCount(15);
  }, [search]);

  useEffect(() => {
    setVisibleCount(15);
  }, [sortBy]);

  // ---------- Load base list ----------
  useEffect(() => {
    let alive = true;

    async function loadNamesAndPokedex() {
      try {
        setLoadingList(true);
        setError("");

        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await res.json();
        if (!alive) return;

        setAllNames(data.results.map((p) => p.name));

        const formatted = data.results.map((p) => {
          const id = getIdFromUrl(p.url);
          return {
            name: p.name,
            id,
            url: p.url,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          };
        });

        setAllPokemonList(formatted);
      } catch (e) {
        console.error(e);
        if (alive) setError("Erro ao carregar a Pokédex.");
      } finally {
        if (alive) setLoadingList(false);
      }
    }

    loadNamesAndPokedex();
    return () => {
      alive = false;
    };
  }, []);

  // ---------- Load abilities list ----------
  useEffect(() => {
    let alive = true;

    async function loadAbilities() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/ability?limit=500");
        const data = await res.json();
        if (!alive) return;

        setAbilities(data.results || []);
      } catch (e) {
        console.error(e);
      }
    }

    loadAbilities();
    return () => {
      alive = false;
    };
  }, []);

  // ---------- Cache details para cards visíveis ----------
  useEffect(() => {
    if (!sortedListForGrid.length) return;

    const visible = sortedListForGrid.slice(0, visibleCount);
    const missing = visible.filter((p) => !pokemonDetails[p.id]);
    if (missing.length === 0) return;

    let alive = true;

    async function loadDetails() {
      try {
        const responses = await Promise.all(
          missing.map((p) => fetch(p.url).then((res) => res.json()))
        );

        if (!alive) return;

        setPokemonDetails((prev) => {
          const updated = { ...prev };
          responses.forEach((data) => {
            updated[data.id] = {
              types: data.types.map((t) => t.type.name),
              height: data.height,
              weight: data.weight,
            };
          });
          return updated;
        });
      } catch (e) {
        console.error(e);
      }
    }

    loadDetails();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedListForGrid, visibleCount]);

  // ---------- Suggestions ----------
  useEffect(() => {
    const q = search.toLowerCase().trim();

    if (!q) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(() => {
      const starts = [];
      const contains = [];

      for (const n of allNames) {
        if (n.startsWith(q)) starts.push(n);
        else if (n.includes(q)) contains.push(n);
        if (starts.length + contains.length >= 40) break;
      }

      setSuggestions([...starts, ...contains].slice(0, 8));
    }, 120);

    return () => clearTimeout(t);
  }, [search, allNames]);

  // ✅ Navega SEMPRE por número na URL
  function navigateToPokemon(value) {
    const raw = String(value || "").trim().toLowerCase();
    if (!raw) return;

    // se já é número, vai direto
    if (/^\d+$/.test(raw)) {
      router.push(`/Pokedex/${Number(raw)}`);
      return;
    }

    // se for nome, resolve nome -> id
    const found = allPokemonList.find((p) => p.name === raw);
    if (!found?.id) return;

    router.push(`/Pokedex/${found.id}`);
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

    const initial = {};
    ALL_TYPES.forEach((t) => (initial[t] = null));
    setTypeMode(initial);

    setAbility("all");
    setHeightGroup("all");
    setWeightGroup("all");
    setMinId(1);
    setMaxId(1025);
  }

  function intersectSets(a, b) {
    if (!a) return b;
    if (!b) return a;
    const out = new Set();
    const small = a.size <= b.size ? a : b;
    const big = a.size <= b.size ? b : a;
    for (const v of small) if (big.has(v)) out.add(v);
    return out;
  }

  async function getTypeData(typeName) {
    if (typeCacheRef.current.has(typeName))
      return typeCacheRef.current.get(typeName);

    const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
    const data = await res.json();

    const ids = new Set(
      (data.pokemon || [])
        .map((x) => getIdFromUrl(x.pokemon?.url))
        .filter((id) => Number.isFinite(id))
    );

    const damageTo = (data.damage_relations?.double_damage_to || []).map(
      (t) => t.name
    );

    const packed = { ids, damageTo };
    typeCacheRef.current.set(typeName, packed);
    return packed;
  }

  async function getAbilityIds(abilityName) {
    if (abilityCacheRef.current.has(abilityName))
      return abilityCacheRef.current.get(abilityName);

    const res = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
    const data = await res.json();

    const ids = new Set(
      (data.pokemon || [])
        .map((x) => getIdFromUrl(x.pokemon?.url))
        .filter((id) => Number.isFinite(id))
    );

    abilityCacheRef.current.set(abilityName, ids);
    return ids;
  }

  function heightPass(heightDm) {
    const m = (heightDm || 0) / 10;
    if (heightGroup === "all") return true;
    if (heightGroup === "short") return m <= 1.0;
    if (heightGroup === "medium") return m > 1.0 && m <= 2.0;
    if (heightGroup === "tall") return m > 2.0;
    return true;
  }

  function weightPass(weightHg) {
    const kg = (weightHg || 0) / 10;
    if (weightGroup === "all") return true;
    if (weightGroup === "light") return kg <= 20;
    if (weightGroup === "medium") return kg > 20 && kg <= 100;
    if (weightGroup === "heavy") return kg > 100;
    return true;
  }

  async function ensurePokemonDetails(idsArray) {
    const missing = idsArray.filter(
      (id) => !pokemonDetails[id] && pokemonById.get(id)?.url
    );
    if (missing.length === 0) return;

    const concurrency = 12;
    let idx = 0;

    while (idx < missing.length) {
      const chunk = missing.slice(idx, idx + concurrency);
      idx += concurrency;

      const responses = await Promise.all(
        chunk.map((id) => fetch(pokemonById.get(id).url).then((r) => r.json()))
      );

      setPokemonDetails((prev) => {
        const updated = { ...prev };
        responses.forEach((data) => {
          updated[data.id] = {
            types: data.types.map((t) => t.type.name),
            height: data.height,
            weight: data.weight,
          };
        });
        return updated;
      });
    }
  }

  async function applyAdvancedFilters() {
    try {
      setAdvancedLoading(true);
      setError("");

      const min = Math.max(1, Number(minId) || 1);
      const max = Math.min(1025, Number(maxId) || 1025);
      if (min > max) {
        setError("Intervalo inválido: o número inicial não pode ser maior que o final.");
        return;
      }

      let candidate = new Set();
      for (let i = min; i <= max; i++) candidate.add(i);

      const selectedTypes = ALL_TYPES.filter((t) => typeMode[t] === "type");
      for (const t of selectedTypes) {
        const tdata = await getTypeData(t);
        candidate = intersectSets(candidate, tdata.ids);
      }

      const selectedWeakness = ALL_TYPES.filter((t) => typeMode[t] === "weakness");
      for (const atkType of selectedWeakness) {
        const atkData = await getTypeData(atkType);
        const defTypes = atkData.damageTo || [];
        let union = new Set();

        for (const defType of defTypes) {
          const defData = await getTypeData(defType);
          for (const id of defData.ids) union.add(id);
        }

        candidate = intersectSets(candidate, union);
      }

      if (ability !== "all") {
        const abilIds = await getAbilityIds(ability);
        candidate = intersectSets(candidate, abilIds);
      }

      const needHW = heightGroup !== "all" || weightGroup !== "all";
      const candidateArrPre = Array.from(candidate);

      if (needHW) {
        await ensurePokemonDetails(candidateArrPre);
        await new Promise((r) => setTimeout(r, 0));

        const filteredHW = candidateArrPre.filter((id) => {
          const d = pokemonDetails[id];
          if (!d) return false;
          return heightPass(d.height) && weightPass(d.weight);
        });

        candidate = new Set(filteredHW);
      }

      const finalIds = Array.from(candidate).sort((a, b) => a - b);
      const finalList = finalIds.map((id) => pokemonById.get(id)).filter(Boolean);

      setFilteredList(finalList);
      setVisibleCount(15);
    } catch (e) {
      console.error(e);
      setError("Erro ao aplicar filtros avançados.");
    } finally {
      setAdvancedLoading(false);
    }
  }

  function resetAdvanced() {
    const initial = {};
    ALL_TYPES.forEach((t) => (initial[t] = null));
    setTypeMode(initial);

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
    setTypeMode((prev) => {
      const cur = prev[typeName];
      const nextVal = cur === mode ? null : mode;
      return { ...prev, [typeName]: nextVal };
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
        <section className="w-full mt-6 px-3 sm:px-6 lg:px-8 mb-10">
          <div className="w-full max-w-6xl mx-auto">

            {/* CARD PRINCIPAL */}
            <motion.div
              className={`
    relative z-20
    w-full mx-auto
    bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat
    shadow-md backdrop-blur-sm
    px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-5
    ${advancedOpen ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"}
  `}
            >

              {/* BUSCA SIMPLES */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <motion.div
                    className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                    initial={{ scaleY: 0.3, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                  />
                  <label className="block text-white text-lg font-medium">
                    Nome ou número
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 mb-2">

                  {/* INPUT */}
                  <div className="relative w-full sm:w-auto">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") applySimpleSearch();
                      }}
                      className="
        w-full
        sm:w-80
        md:w-96
        lg:w-md
        bg-neutral-50
        text-gray-900
        px-4 py-2
        rounded-md
        border border-neutral-200
        focus:outline-none
        focus:ring-2
        focus:ring-[#E3350D]/70
      "
                    />

                    {suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-neutral-200 z-50 overflow-hidden">
                        {suggestions.map((name) => (
                          <button
                            key={name}
                            onClick={() => pickSuggestion(name)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 capitalize"
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* BOTÕES */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={applySimpleSearch}
                      className="h-[42px] px-4 rounded-md bg-[#E3350D] text-white hover:bg-[#c52c0b] flex items-center justify-center"
                      aria-label="Buscar"
                      title="Buscar"
                    >
                      <Search className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="h-[42px] px-4 rounded-md bg-white/15 text-white hover:bg-white/20 border border-white/10 flex items-center justify-center"
                      aria-label="Limpar filtros"
                      title="Limpar filtros"
                    >
                      <BrushCleaning className="w-5 h-5" />
                    </button>
                  </div>

                </div>

                <p className="mt-3 text-sm sm:text-base text-white">
                  Use a busca avançada para explorar Pokémon por tipo, fraqueza,
                  habilidade e mais!
                </p>

              </div>


              {error && <p className="text-red-300 text-sm mt-3">{error}</p>}
            </motion.div>

            {/* ACCORDION */}
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
                    <div className="bg-[#616161] p-4 rounded-b-[3px]">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* ESQUERDA: Tipo e Fraqueza */}
                        <div className="lg:col-span-7">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="text-white text-lg font-semibold">
                              Tipo e Fraqueza
                            </h3>
                            <div className="text-white/70 text-xs">
                              <span className="font-semibold">T</span> = Tipo{" "}
                              <span className="font-semibold">F</span> = Fraqueza
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {ALL_TYPES.map((t) => {
                              const mode = typeMode[t];
                              const isT = mode === "type";
                              const isF = mode === "weakness";

                              return (
                                <div
                                  key={t}
                                  className="flex items-center justify-between gap-2"
                                >
                                  <span
                                    className={`min-w-[120px] px-3 py-1 rounded-md text-xs font-semibold text-center ${getTypeClass(
                                      t
                                    )}`}
                                  >
                                    {TYPE_LABELS_PT[t]}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => toggleTypeMode(t, "type")}
                                      className={`w-7 h-7 rounded-full border text-xs font-bold transition
                                        ${isT
                                          ? "bg-white text-neutral-900 border-white"
                                          : "bg-transparent text-white border-white/40 hover:border-white/80"
                                        }`}
                                      title="Filtrar por Tipo"
                                    >
                                      T
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => toggleTypeMode(t, "weakness")}
                                      className={`w-7 h-7 rounded-full border text-xs font-bold transition
                                        ${isF
                                          ? "bg-white text-neutral-900 border-white"
                                          : "bg-transparent text-white border-white/40 hover:border-white/80"
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

                        {/* DIREITA: Habilidade + Altura + Peso */}
                        <div className="lg:col-span-5">
                          <div className="mb-5">
                            <h3 className="text-white text-lg font-semibold mb-2">
                              Habilidade
                            </h3>

                            <div className="relative w-75">
                              <select
                                value={ability}
                                onChange={(e) => setAbility(e.target.value)}
                                className="w-full appearance-none bg-neutral-700 text-white px-3 py-2 pr-10 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#E3350D]/60"
                              >
                                <option value="all">Todas</option>
                                {abilities.map((a) => (
                                  <option key={a.name} value={a.name}>
                                    {formatPokemonName(a.name)}
                                  </option>
                                ))}
                              </select>

                              <svg
                                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70"
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

                          {/* Altura */}
                          <div className="mb-5">
                            <h3 className="text-white text-lg font-semibold mb-2">
                              Altura
                            </h3>

                            <div className="grid grid-cols-3 gap-3">
                              <button
                                type="button"
                                onClick={() => setHeightGroup("short")}
                                className={`rounded-lg border p-3 flex items-center justify-center transition
                                  ${heightGroup === "short"
                                    ? "bg-white text-neutral-900 border-white"
                                    : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                                  }`}
                                title="Baixa (≤ 1m)"
                              >
                                <Tally1 className="w-6 h-6" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setHeightGroup("medium")}
                                className={`rounded-lg border p-3 flex items-center justify-center transition
                                  ${heightGroup === "medium"
                                    ? "bg-white text-neutral-900 border-white"
                                    : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                                  }`}
                                title="Média (1m ~ 2m)"
                              >
                                <Tally2 className="w-6 h-6" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setHeightGroup("tall")}
                                className={`rounded-lg border p-3 flex items-center justify-center transition
                                  ${heightGroup === "tall"
                                    ? "bg-white text-neutral-900 border-white"
                                    : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                                  }`}
                                title="Alta (> 2m)"
                              >
                                <Tally3 className="w-6 h-6" />
                              </button>
                            </div>

                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => setHeightGroup("all")}
                                className="text-xs text-white/70 hover:text-white underline"
                              >
                                Limpar altura
                              </button>
                            </div>
                          </div>

                          {/* Peso */}
                          <div className="mb-1">
                            <h3 className="text-white text-lg font-semibold mb-2">
                              Peso
                            </h3>

                            <div className="grid grid-cols-3 gap-3">
                              <button
                                type="button"
                                onClick={() => setWeightGroup("light")}
                                className={`rounded-lg border p-3 flex items-center justify-center transition
                                  ${weightGroup === "light"
                                    ? "bg-white text-neutral-900 border-white"
                                    : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                                  }`}
                                title="Leve (≤ 20kg)"
                              >
                                <Tally1 className="w-6 h-6" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setWeightGroup("medium")}
                                className={`rounded-lg border p-3 flex items-center justify-center transition
                                  ${weightGroup === "medium"
                                    ? "bg-white text-neutral-900 border-white"
                                    : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                                  }`}
                                title="Médio (20kg ~ 100kg)"
                              >
                                <Tally2 className="w-6 h-6" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setWeightGroup("heavy")}
                                className={`rounded-lg border p-3 flex items-center justify-center transition
                                  ${weightGroup === "heavy"
                                    ? "bg-white text-neutral-900 border-white"
                                    : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                                  }`}
                                title="Pesado (> 100kg)"
                              >
                                <Tally3 className="w-6 h-6" />
                              </button>
                            </div>

                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => setWeightGroup("all")}
                                className="text-xs text-white/70 hover:text-white underline"
                              >
                                Limpar peso
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">

                        {/* INTERVALO */}
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
                          <span className="text-white text-lg font-semibold">
                            Intervalo de números
                          </span>

                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={minId}
                              onChange={(e) => setMinId(e.target.value)}
                              className="w-20 bg-white text-neutral-900 px-3 py-2 rounded-md border border-white/10 focus:outline-none no-spinner"
                              min={1}
                              max={1025}
                            />

                            <span className="text-white/70">-</span>

                            <input
                              type="number"
                              value={maxId}
                              onChange={(e) => setMaxId(e.target.value)}
                              className="w-24 bg-white text-neutral-900 px-3 py-2 rounded-md border border-white/10 focus:outline-none no-spinner"
                              min={1}
                              max={1025}
                            />
                          </div>
                        </div>

                        {/* BOTÕES */}
                        <div className="flex items-center gap-3 justify-start lg:justify-end">
                          <button
                            type="button"
                            onClick={resetAdvanced}
                            className="px-5 py-2 rounded-md bg-white/20 text-white hover:bg-white/25 border border-white/10"
                          >
                            Redefinir
                          </button>

                          <button
                            type="button"
                            onClick={applyAdvancedFilters}
                            disabled={advancedLoading}
                            className="px-5 py-2 rounded-md bg-[#E3350D] text-white hover:bg-[#c52c0b] flex items-center gap-2 disabled:opacity-70"
                          >
                            <Search className="w-4 h-4" />
                            {advancedLoading ? "Pesquisando..." : "Pesquisar"}
                          </button>
                        </div>

                        {/* REMOVE SPINNER */}
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

              <div className="w-60 mx-auto flex justify-center bg-[#616161] rounded-b-[5px] overflow-visible relative z-10">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="flex items-center justify-center gap-2 text-white/90 hover:text-white transition py-2 w-full"
                >
                  <span className="text-sm font-medium">
                    {advancedOpen ? "Esconder busca avançada" : "Mostrar busca avançada"}
                  </span>

                  <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm">
                    {advancedOpen ? (
                      <ChevronUp className="w-4 h-4 text-neutral-900" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-900" />
                    )}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-8" />



            {/* ORDENAR */}
            <div className="w-full px-4 sm:px-0 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-2">

              <label className="block text-black text-lg font-medium">
                Organizar por:
              </label>

              <div className="w-fit sm:w-72">
                <div className="relative">

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="
          appearance-none
          w-full
          bg-neutral-700
          text-white
          px-3 py-2 pr-10
          rounded-md
          border border-white/10
          focus:outline-none
          focus:ring-2 focus:ring-[#E3350D]/60
        "
                  >
                    <option value="id-asc">Menor número primeiro</option>
                    <option value="id-desc">Maior número primeiro</option>
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                  </select>

                  {/* SETA CUSTOM */}
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70"
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



            {/* GRID */}
            {sortedListForGrid.length > 0 ? (
              <div className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {sortedListForGrid.slice(0, visibleCount).map((p) => {
                    const details = pokemonDetails[p.id];

                    return (
                      <motion.button
                        key={p.id}
                        whileHover={{ scale: 1.03 }}
                        // ✅ agora SEMPRE vai por ID
                        onClick={() => navigateToPokemon(p.id)}
                        className="flex flex-col items-stretch justify-start rounded-md bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.1)] border border-neutral-200 transition-shadow duration-200 text-left"
                      >
                        <div className="relative aspect-square w-full rounded-md bg-gray-100 overflow-hidden">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
                            className="object-contain"
                          />
                        </div>




                        <div className="mt-3 flex items-center justify-between">
                          {/* Barra + Nome */}
                          <div className="flex items-center gap-2">
                            <motion.div
                              className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                              initial={{ scaleY: 0.3, opacity: 0 }}
                              animate={{ scaleY: 1, opacity: 1 }}
                              transition={{ delay: 0.2, duration: 0.35 }}
                            />

                            <span className="text-lg font-semibold text-neutral-600 capitalize">
                              {formatPokemonName(p.name)}
                            </span>
                          </div>

                          {/* Número */}
                          <span className="text-lg font-semibold text-neutral-600">
                            #{String(p.id).padStart(3, "0")}
                          </span>
                        </div>


                        {details?.types ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {details.types.map((typeName) => (
                              <span
                                key={typeName}
                                className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${getTypeClass(
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

                <div className="flex justify-center mt-6">
                  {visibleCount < sortedListForGrid.length && (
                    <button
                      onClick={() => setVisibleCount((v) => v + 15)}
                      className="bg-[#E3350D] text-white px-6 py-2 rounded-md hover:bg-[#c52c0b]"
                    >
                      Carregar mais Pokémon
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center text-white/80">
                Nenhum Pokémon encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
