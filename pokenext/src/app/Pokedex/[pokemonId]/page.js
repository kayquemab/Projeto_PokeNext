"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";


import { ChevronLeft, ChevronRight } from "lucide-react";

const TYPE_STYLES = {
  grass: "bg-[#78C850] text-black dark:bg-[#78C850]",
  poison: "bg-[#A040A0] text-white dark:bg-[#A040A0]",
  fire: "bg-[#F08030] text-white dark:bg-[#F08030]",
  water: "bg-[#6890F0] text-white dark:bg-[#6890F0]",
  electric: "bg-[#F8D030] text-black dark:bg-[#F8D030]",
  flying: "bg-[#A890F0] text-black dark:bg-[#A890F0]",
  ice: "bg-[#98D8D8] text-black dark:bg-[#98D8D8]",
  bug: "bg-[#A8B820] text-black dark:bg-[#A8B820]",
  normal: "bg-[#A8A878] text-black dark:bg-[#A8A878]",
  fighting: "bg-[#C03028] text-white dark:bg-[#C03028]",
  psychic: "bg-[#F85888] text-white dark:bg-[#F85888]",
  rock: "bg-[#B8A038] text-black dark:bg-[#B8A038]",
  ground: "bg-[#E0C068] text-black dark:bg-[#E0C068]",
  ghost: "bg-[#705898] text-white dark:bg-[#705898]",
  dragon: "bg-[#7038F8] text-white dark:bg-[#7038F8]",
  dark: "bg-[#705848] text-white dark:bg-[#705848]",
  steel: "bg-[#B8B8D0] text-black dark:bg-[#B8B8D0]",
  fairy: "bg-[#EE99AC] text-black dark:bg-[#EE99AC]",
  default:
    "bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:text-white",
};

function getTypeClass(typeName) {
  return TYPE_STYLES[typeName] || TYPE_STYLES.default;
}

function formatPokemonName(name) {
  return String(name || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function extractEvolutionStages(chainRoot) {
  const stages = [];
  const queue = [{ node: chainRoot, depth: 0 }];

  while (queue.length) {
    const { node, depth } = queue.shift();
    const name = node?.species?.name;
    if (!name) continue;

    if (!stages[depth]) stages[depth] = [];
    if (!stages[depth].includes(name)) stages[depth].push(name);

    const next = node?.evolves_to || [];
    for (const child of next) queue.push({ node: child, depth: depth + 1 });
  }

  return stages.filter(Boolean);
}

function extractIdFromUrl(url) {
  const m = String(url || "").match(/\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
}

function classifyVariety(varietyName) {
  const n = String(varietyName || "").toLowerCase();

  // Mecânicas
  if (n.endsWith("-gmax")) return { group: "Mecânica", label: "Gigantamax" };
  if (n.includes("-mega-x")) return { group: "Mecânica", label: "Mega X" };
  if (n.includes("-mega-y")) return { group: "Mecânica", label: "Mega Y" };
  if (n.includes("-mega")) return { group: "Mecânica", label: "Mega" };
  if (n.includes("-primal")) return { group: "Mecânica", label: "Primal" };

  // Regionais
  if (n.includes("-alola")) return { group: "Regional", label: "Alola" };
  if (n.includes("-galar")) return { group: "Regional", label: "Galar" };
  if (n.includes("-hisui")) return { group: "Regional", label: "Hisui" };
  if (n.includes("-paldea")) return { group: "Regional", label: "Paldea" };

  // Formas especiais comuns
  if (n.includes("-origin")) return { group: "Forma", label: "Origin" };
  if (n.includes("-therian")) return { group: "Forma", label: "Therian" };
  if (n.includes("-incarnate")) return { group: "Forma", label: "Incarnate" };
  if (n.includes("-totem")) return { group: "Forma", label: "Totem" };
  if (n.includes("-battle-bond")) return { group: "Forma", label: "Battle Bond" };
  if (n.includes("-ash")) return { group: "Forma", label: "Ash" };
  if (n.includes("-crowned")) return { group: "Forma", label: "Crowned" };
  if (n.includes("-eternamax")) return { group: "Forma", label: "Eternamax" };
  if (n.includes("-ultra")) return { group: "Forma", label: "Ultra" };
  if (n.includes("-dusk")) return { group: "Forma", label: "Dusk" };
  if (n.includes("-dawn")) return { group: "Forma", label: "Dawn" };
  if (n.includes("-midnight")) return { group: "Forma", label: "Midnight" };
  if (n.includes("-midday")) return { group: "Forma", label: "Midday" };
  if (n.includes("-school")) return { group: "Forma", label: "School" };

  return { group: "Outras", label: "Forma" };
}

const padId4 = (id) => String(id).padStart(4, "0");

export default function PokemonId() {
  const router = useRouter();
  const params = useParams();

  const pokemonId =
    params?.pokemonId ?? params?.id ?? params?.slug ?? params?.name;

  const idOrName = useMemo(
    () => String(pokemonId || "").trim().toLowerCase(),
    [pokemonId]
  );

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  const NATIONAL_DEX_FALLBACK = 1025;
  const [maxId, setMaxId] = useState(NATIONAL_DEX_FALLBACK);

  const [evoStages, setEvoStages] = useState([]);
  const [evoLoading, setEvoLoading] = useState(false);
  const [evoError, setEvoError] = useState("");

  const [expanded, setExpanded] = useState({});
  const namesCache = useRef(new Map());

  const [prevPokemon, setPrevPokemon] = useState(null);
  const [nextPokemon, setNextPokemon] = useState(null);

  const [descricaoDex, setDescricaoDex] = useState("");
  const [categoriaDex, setCategoriaDex] = useState("");
  const [weaknesses, setWeaknesses] = useState([]);
  const [weakLoading, setWeakLoading] = useState(false);

  const currentId = Number(pokemon?.id || 0);
  const safeMax = Number(maxId) > 0 ? Number(maxId) : NATIONAL_DEX_FALLBACK;

  const prevId = currentId > 1 ? currentId - 1 : safeMax; // #001 -> último (1025)
  const nextId = currentId < safeMax ? currentId + 1 : 1; // último -> #

  // Encontra o Pokémon atual
  const currentEvoData = evoStages
    .flat()
    .find(p => String(p.id) === String(pokemon.id));

  // Descobre o Pokémon que possui variedades (a base)
  const baseWithVarieties = evoStages.flat().find(p => Array.isArray(p.varieties) && p.varieties.length > 0 && p.varieties.some(v => String(v.id) === String(pokemon.id))) || currentEvoData;

  // Todas as formas (a base + variedades)
  const allForms = baseWithVarieties
    ? [{ id: baseWithVarieties.id, label: baseWithVarieties.name, name: baseWithVarieties.name }, ...(baseWithVarieties.varieties || [])]
    : [];

  const goTo = (id) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push(`/Pokedex/${id}`);
  };

  const prefetch = (id) => {
    try {
      router.prefetch?.(`/Pokedex/${id}`);
    } catch { }
  };

  useEffect(() => {
    setIsNavigating(false);
  }, [idOrName]);

  useEffect(() => {
    let alive = true;

    async function fetchNationalDexCount() {
      try {
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon-species?limit=1"
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!alive) return;

        if (typeof data?.count === "number" && data.count > 0) {
          setMaxId(data.count);
        }
      } catch {
        // mantém fallback 1025
      }
    }

    fetchNationalDexCount();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!idOrName) return;

    let alive = true;

    async function fetchPokemon() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
        if (!res.ok) throw new Error("Pokémon não encontrado.");

        const data = await res.json();
        if (!alive) return;

        setPokemon(data);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Erro ao carregar dados do Pokémon.");
        setPokemon(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchPokemon();
    return () => {
      alive = false;
    };
  }, [idOrName]);

  useEffect(() => {
    if (!pokemon?.species?.url) return;

    let alive = true;

    async function fetchEvolutionChainWithVarieties() {
      try {
        setEvoLoading(true);
        setEvoError("");
        setEvoStages([]);

        const speciesRes = await fetch(pokemon.species.url);
        if (!speciesRes.ok) throw new Error("Falha ao carregar species.");
        const speciesData = await speciesRes.json();

        const chainUrl = speciesData?.evolution_chain?.url;
        if (!chainUrl) throw new Error("Cadeia evolutiva não encontrada.");

        const chainRes = await fetch(chainUrl);
        if (!chainRes.ok) throw new Error("Falha ao carregar evolution chain.");
        const chainData = await chainRes.json();

        const stagesByName = extractEvolutionStages(chainData.chain);
        const uniqueNames = Array.from(new Set(stagesByName.flat()));

        const basePokemons = await Promise.all(
          uniqueNames.map(async (name) => {
            const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (!r.ok) return null;
            const p = await r.json();

            const art =
              p?.sprites?.other?.["official-artwork"]?.front_default ||
              p?.sprites?.front_default;

            return {
              name: p.name,
              id: p.id,
              artwork: art,
              types: p.types?.map((t) => t.type.name) || [],
              speciesUrl: p?.species?.url || null,
              varieties: [],
            };
          })
        );

        const mapByName = {};
        for (const p of basePokemons) if (p?.name) mapByName[p.name] = p;

        await Promise.all(
          Object.values(mapByName).map(async (base) => {
            if (!base?.speciesUrl) return;

            try {
              const sRes = await fetch(base.speciesUrl);
              if (!sRes.ok) return;
              const sData = await sRes.json();

              const varietiesRaw = Array.isArray(sData?.varieties)
                ? sData.varieties
                : [];

              const varieties = varietiesRaw
                .map((v) => ({ name: v?.pokemon?.name, url: v?.pokemon?.url }))
                .filter((v) => Boolean(v.name && v.url))
                .filter((v) => v.name !== base.name)
                .map((v) => {
                  const meta = classifyVariety(v.name);
                  return {
                    name: v.name,
                    id: extractIdFromUrl(v.url),
                    group: meta.group,
                    label: meta.label,
                  };
                });

              const groupOrder = {
                Mecânica: 0,
                Regional: 1,
                Forma: 2,
                Outras: 3,
              };

              varieties.sort((a, b) => {
                const ga = groupOrder[a.group] ?? 99;
                const gb = groupOrder[b.group] ?? 99;
                if (ga !== gb) return ga - gb;
                return a.name.localeCompare(b.name);
              });

              base.varieties = varieties;
            } catch { }
          })
        );

        const finalStages = stagesByName
          .map((stage) => stage.map((name) => mapByName[name]).filter(Boolean))
          .filter((stage) => stage.length > 0);

        if (!alive) return;
        setEvoStages(finalStages);
      } catch (err) {
        if (!alive) return;
        setEvoError(err?.message || "Erro ao carregar linha evolutiva.");
      } finally {
        if (alive) setEvoLoading(false);
      }
    }

    fetchEvolutionChainWithVarieties();
    return () => {
      alive = false;
    };
  }, [pokemon?.species?.url]);

  useEffect(() => {
    if (!currentId) return;

    const controller = new AbortController();
    let alive = true;

    const getName = async (id) => {
      const cached = namesCache.current.get(id);
      if (cached) return cached;

      const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
        signal: controller.signal,
      });

      if (!r.ok) return "";

      const data = await r.json();
      const name = data?.name || "";
      if (name) namesCache.current.set(id, name);

      return name;
    };

    (async () => {
      const [pName, nName] = await Promise.all([getName(prevId), getName(nextId)]);
      if (!alive) return;

      setPrevPokemon({ id: prevId, name: pName });
      setNextPokemon({ id: nextId, name: nName });
    })().catch(() => {
      if (!alive) return;
      setPrevPokemon({ id: prevId, name: "" });
      setNextPokemon({ id: nextId, name: "" });
    });

    return () => {
      alive = false;
      controller.abort();
    };
  }, [currentId, prevId, nextId]);

  useEffect(() => {
    if (!pokemon?.species?.url) return;

    let alive = true;

    (async () => {
      try {
        const r = await fetch(pokemon.species.url);
        if (!r.ok) return;
        const s = await r.json();
        if (!alive) return;

        // Descrição (PT-BR/pt). Fallback en.
        const pickFlavor = (lang) =>
          (s?.flavor_text_entries || []).find((f) => f?.language?.name === lang);

        const flavor =
          pickFlavor("pt")?.flavor_text ||
          pickFlavor("pt-br")?.flavor_text ||
          pickFlavor("en")?.flavor_text ||
          "";

        setDescricaoDex(String(flavor).replace(/\f|\n|\r/g, " ").trim());

        // Categoria (genus) em PT. Fallback en.
        const pickGenus = (lang) =>
          (s?.genera || []).find((g) => g?.language?.name === lang);

        const genus =
          pickGenus("pt")?.genus || pickGenus("en")?.genus || "";

        setCategoriaDex(genus);
      } catch {
        // silencioso
      }
    })();

    return () => {
      alive = false;
    };
  }, [pokemon?.species?.url]);

  useEffect(() => {
    if (!pokemon?.types?.length) return;

    let alive = true;
    const controller = new AbortController();

    (async () => {
      try {
        setWeakLoading(true);

        const typeUrls = pokemon.types
          .map((t) => t?.type?.url)
          .filter(Boolean);

        const datas = await Promise.all(
          typeUrls.map(async (url) => {
            const r = await fetch(url, { signal: controller.signal });
            if (!r.ok) return null;
            return r.json();
          })
        );

        const doubles = new Set();
        for (const d of datas) {
          const list = d?.damage_relations?.double_damage_from || [];
          for (const item of list) if (item?.name) doubles.add(item.name);
        }

        if (!alive) return;
        setWeaknesses(Array.from(doubles));
      } catch {
        if (!alive) return;
        setWeaknesses([]);
      } finally {
        if (alive) setWeakLoading(false);
      }
    })();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [pokemon?.types]);


  if (loading && !pokemon) {
    return (
      <div />
    );
  }

  if (error || !pokemon) {
    return (
      <div className="w-full max-w-xl mx-auto mt-10 px-4">
        <p className="text-red-500 text-sm">{error || "Erro desconhecido."}</p>
        <button
          onClick={() => router.push("/Pokedex")}
          className="mt-3 text-[#E3350D] hover:underline text-sm font-semibold"
        >
          Voltar para a Pokédex
        </button>
      </div>
    );
  }

  const artwork =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default;

  return (
    <div>

      {/* Avançar e retroceder */}
      <header className="relative w-full">
        <motion.div className="mx-auto w-full max-w-6xl pt-0 pb-0">
          <div className="w-full">
            <div className="grid grid-cols-2 gap-1">

              {/* Prev */}
              <button
                type="button"
                onClick={() => goTo(prevId)}
                onMouseEnter={() => prefetch(prevId)}
                onFocus={() => prefetch(prevId)}
                disabled={isNavigating}
                className={[
                  "group flex w-full items-center justify-start gap-3 rounded-l-2xl px-4 py-3 text-left text-white transition",
                  "bg-[#616161] hover:bg-[#1B1B1B]",
                  "disabled:opacity-70 disabled:pointer-events-none"
                ].join(" ")}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#616161] transition group-hover:text-[#1B1B1B]">
                  <ChevronLeft className="h-4 w-4" />
                </span>

                <div className="leading-tight">
                  <div className="text-xs font-semibold opacity-90">
                    N° {padId4(prevId)}
                  </div>

                  <div className="text-sm font-semibold truncate max-w-[180px] sm:max-w-none">
                    {prevPokemon?.name ? (
                      formatPokemonName(prevPokemon.name)
                    ) : (
                      <span className="inline-block h-4 w-28 rounded align-middle" />
                    )}
                  </div>
                </div>
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={() => goTo(nextId)}
                onMouseEnter={() => prefetch(nextId)}
                onFocus={() => prefetch(nextId)}
                disabled={isNavigating}
                className={[
                  "group flex w-full items-center justify-end gap-3 rounded-r-2xl px-4 py-3 text-right text-white transition",
                  "bg-[#616161] hover:bg-[#1B1B1B]",
                  "disabled:opacity-70 disabled:pointer-events-none"
                ].join(" ")}
              >
                <div className="leading-tight">
                  <div className="text-sm font-semibold truncate max-w-[180px] sm:max-w-none">
                    {nextPokemon?.name ? (
                      formatPokemonName(nextPokemon.name)
                    ) : (
                      <span className="inline-block h-4 w-28 rounded align-middle" />
                    )}
                  </div>

                  <div className="text-xs font-semibold opacity-90">
                    N° {padId4(nextId)}
                  </div>
                </div>

                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#616161] transition group-hover:text-[#1B1B1B]">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>

            </div>
          </div>
        </motion.div>
      </header>

      {/* Conteúdo principal */}
      <div className="mt-5 w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-6xl"
        >

          {/* ================= TOPO CENTRAL ================= */}
          <div className="mb-6 text-center">
            <h1 className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
              <span className="opacity-90">
                {formatPokemonName(pokemon.name)}
              </span>

              <span className="text-gray-600 font-medium">
                #{String(pokemon.id).padStart(4, "0")}
              </span>
            </h1>
          </div>

          {/* Mecanismo para formas */}
          {allForms.length > 1 && (
            <div className="w-full flex items-center justify-end mb-2">
              <div className="w-full sm:w-72">
                <div className="relative w-full">
                  <select
                    className="w-full appearance-none bg-neutral-700 text-white px-3 py-2 pr-10 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#E3350D]/60"
                    value={String(pokemon.id)}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId && selectedId !== String(pokemon.id)) {
                        router.push(`/Pokedex/${selectedId}`);
                      }
                    }}
                  >
                    {allForms.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.label} ({formatPokemonName(v.name)})
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
            </div>
          )}

          {/* ================= LINHA 1 ================= */}
          <div className="grid grid-cols-1 md:grid-cols-[520px_1fr] gap-6 items-start">

            {/* ===== CARD DA IMAGEM ===== */}
            <div className="w-full h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="
      relative
      h-full w-full
      rounded-2xl
      bg-[url('/wallpaper-preto.png')]
      bg-cover bg-center bg-no-repeat
      shadow-lg
      p-6
      flex items-center justify-center
    "
              >
                <div className="relative w-full max-w-[370px] aspect-square">
                  <Image
                    src={artwork}
                    alt={formatPokemonName(pokemon.name)}
                    fill
                    unoptimized
                    sizes="380px"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>


            {/* ===== DESCRIÇÃO + INFOS ===== */}
            <div className="flex flex-col gap-4">

              {/* Descrição */}
              <div
                className="
    rounded-xl
    border border-black/10 dark:border-white/10
    p-5
    bg-cover bg-center bg-no-repeat
  "
                style={{
                  backgroundImage: "url('/wallpaper-cinza.png')",
                }}
              >
                {/* overlay opcional para manter legibilidade */}
                <div className="bg-white/70 dark:bg-zinc-900/60 rounded-lg p-5 -m-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-xl font-extrabold text-black dark:text-white leading-tight">
                        Descrição
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-black/80 dark:text-white/80 leading-relaxed">
                    {descricaoDex || "Descrição indisponível para este Pokémon."}
                  </p>
                </div>
              </div>

              {/* Informações */}
              <div
                className="
    rounded-xl
    border border-black/10 dark:border-white/10
    p-5
    bg-cover bg-center bg-no-repeat
  "
                style={{
                  backgroundImage: "url('/wallpaper-cinza.png')",
                }}
              >
                {/* overlay para legibilidade */}
                <div className="bg-white/70 dark:bg-zinc-900/60 rounded-lg p-5 -m-5">
                  <h3 className="text-xl font-extrabold text-black dark:text-white">
                    Informações
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-black/80 dark:text-white/80">
                    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3">
                      <p className="text-xs font-semibold opacity-70">Altura</p>
                      <p className="font-extrabold">{pokemon.height / 10} m</p>
                    </div>

                    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3">
                      <p className="text-xs font-semibold opacity-70">Peso</p>
                      <p className="font-extrabold">{pokemon.weight / 10} kg</p>
                    </div>

                    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3 col-span-2">
                      <p className="text-xs font-semibold opacity-70">Categoria</p>
                      <p className="font-extrabold">
                        {categoriaDex || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3 col-span-2">
                      <p className="text-xs font-semibold opacity-70">Habilidades</p>
                      <p className="font-extrabold">
                        {pokemon.abilities
                          .map((a) => formatPokemonName(a.ability.name))
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ================= LINHA 2 ================= */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

            {/* ================= Estatísticas ================= */}
            <div
              className="
      rounded-xl
      border border-black/10 dark:border-white/10
      p-5
      bg-cover bg-center bg-no-repeat
    "
              style={{ backgroundImage: "url('/wallpaper-cinza.png')" }}
            >
              <div className="bg-white/70 dark:bg-zinc-900/60 rounded-lg p-5 -m-5">
                <h3 className="text-xl font-extrabold text-black dark:text-white">
                  Estatísticas
                </h3>

                <div className="mt-4 space-y-3">
                  {pokemon.stats.map((s) => {
                    const value = Number(s.base_stat || 0);
                    const pct = Math.min(100, Math.round((value / 255) * 100));
                    const label = formatPokemonName(
                      s.stat.name.replace("special-", "sp-")
                    );

                    return (
                      <div key={s.stat.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-black/70 dark:text-white/70">
                          <span>{label}</span>
                          <span>{value}</span>
                        </div>

                        <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-black/50 dark:bg-white/50"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ================= Tipo / Fraquezas ================= */}
            <div
              className="
      rounded-xl
      border border-black/10 dark:border-white/10
      p-5
      bg-cover bg-center bg-no-repeat
    "
              style={{ backgroundImage: "url('/wallpaper-cinza.png')" }}
            >
              <div className="bg-white/70 dark:bg-zinc-900/60 rounded-lg p-5 -m-5">
                <h3 className="text-xl font-extrabold text-black dark:text-white">
                  Tipo / Fraquezas
                </h3>

                {/* Tipos */}
                <div className="mt-5">
                  <p className="text-xs font-semibold text-black/70 dark:text-white/70">
                    Tipos
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {pokemon.types.map((t) => (
                      <span
                        key={t.type.name}
                        className={`
                px-4 py-2
                rounded-lg
                text-sm font-extrabold
                capitalize
                shadow-sm
                text-white
                ${getTypeClass(t.type.name)}
              `}
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fraquezas */}
                <div className="mt-6">
                  <p className="text-xs font-semibold text-black/70 dark:text-white/70">
                    Fraquezas {weakLoading ? "(calculando...)" : ""}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {weaknesses.length > 0 ? (
                      weaknesses.map((w) => (
                        <span
                          key={w}
                          className={`
                  px-4 py-2
                  rounded-lg
                  text-sm font-extrabold
                  capitalize
                  shadow-sm
                  text-white
                  ${getTypeClass(w)}
                `}
                        >
                          {w}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-black/60 dark:text-white/60">
                        —
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </motion.div>
      </div>

      {/* ================= LINHA 3: Linha evolutiva ================= */}
      <div className="mt-6">
        <div
          className="
      mx-auto w-full max-w-6xl
      rounded-2xl
      border border-black/10 dark:border-white/10
      overflow-hidden
      bg-[url('/wallpaper-preto.png')]
      bg-cover bg-center bg-no-repeat
      shadow-lg
    "
        >
          <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-zinc-100 font-extrabold text-base md:text-lg">
                Linha evolutiva
              </h3>
            </div>

            {!evoLoading && !evoError && evoStages?.length > 0 && (() => {
              const isBranched = evoStages.some(stage => stage.length > 2);

              /* ================= EVOLUÇÃO RAMIFICADA (EEVEE) ================= */
              if (isBranched) {
                const base = evoStages[0][0];
                const evolutions = evoStages.flat().slice(1);

                const isBaseCurrent =
                  String(base.id) === String(pokemon.id);

                return (
                  <div className="flex flex-col items-center gap-8">

                    {/* Pokémon base */}
                    <button
                      onClick={() => router.push(`/Pokedex/${base.id}`)}
                      className={`
                  flex flex-col items-center gap-2
                  rounded-xl border
                  px-6 py-4
                  transition
                  ${isBaseCurrent
                          ? "border-[#E3350D] bg-white/20"
                          : "border-white/15 bg-white/10 hover:bg-white/20"
                        }
                `}
                    >
                      <div className="relative w-32 h-32">
                        <Image
                          src={base.artwork}
                          alt={formatPokemonName(base.name)}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>

                      <p className="text-sm font-extrabold text-zinc-100">
                        {formatPokemonName(base.name)}
                      </p>

                      {/* Número */}
                      <span className="text-[11px] font-bold text-zinc-300">
                        #{String(base.id).padStart(3, "0")}
                      </span>

                      {/* Tipos */}
                      <div className="flex gap-1">
                        {base.types.slice(0, 2).map(tp => (
                          <span
                            key={tp}
                            className={`px-2 py-1 rounded text-[10px] font-extrabold capitalize text-white ${getTypeClass(tp)}`}
                          >
                            {tp}
                          </span>
                        ))}
                      </div>
                    </button>

                    {/* Linha divisória */}
                    <div className="w-32 h-px bg-white/30" />

                    {/* Evoluções */}
                    <div
                      className="
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  md:grid-cols-4
                  lg:grid-cols-5
                  gap-6
                "
                    >
                      {evolutions.map(evo => {
                        const isCurrent =
                          String(evo.id) === String(pokemon.id);

                        return (
                          <button
                            key={evo.name}
                            onClick={() => router.push(`/Pokedex/${evo.id}`)}
                            className={`
                        flex flex-col items-center gap-2
                        rounded-xl border
                        px-4 py-4
                        min-w-40
                        transition
                        ${isCurrent
                                ? "border-[#E3350D] bg-white/20"
                                : "border-white/15 bg-white/10 hover:bg-white/20"
                              }
                      `}
                          >
                            <div className="relative w-28 h-28">
                              <Image
                                src={evo.artwork}
                                alt={formatPokemonName(evo.name)}
                                fill
                                unoptimized
                                className="object-contain"
                              />
                            </div>

                            <p className="text-xs font-extrabold text-zinc-100">
                              {formatPokemonName(evo.name)}
                            </p>

                            {/* Número */}
                            <span className="text-[10px] font-bold text-zinc-300">
                              #{String(evo.id).padStart(3, "0")}
                            </span>

                            {/* Tipos */}
                            <div className="flex gap-1">
                              {evo.types.slice(0, 2).map(tp => (
                                <span
                                  key={tp}
                                  className={`px-2 py-1 rounded text-[10px] font-extrabold capitalize text-white ${getTypeClass(tp)}`}
                                >
                                  {tp}
                                </span>
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              /* ================= EVOLUÇÃO LINEAR (PADRÃO) ================= */
              return (
                <div className="flex justify-center overflow-x-auto pb-4">
                  <div className="flex items-center gap-6 min-w-max">
                    {evoStages.map((stage, stageIdx) => (
                      <div key={stageIdx} className="flex items-center gap-6">
                        {stage.map(evo => {
                          const isCurrent =
                            String(evo.id) === String(pokemon.id);

                          return (
                            <button
                              key={evo.name}
                              onClick={() => router.push(`/Pokedex/${evo.id}`)}
                              className={`
                          flex flex-col items-center gap-2
                          rounded-xl border
                          px-5 py-4
                          min-w-40
                          transition
                          ${isCurrent
                                  ? "border-[#E3350D] bg-white/20"
                                  : "border-white/15 bg-white/10 hover:bg-white/20"
                                }
                        `}
                            >
                              <div className="relative w-28 h-28">
                                <Image
                                  src={evo.artwork}
                                  alt={formatPokemonName(evo.name)}
                                  fill
                                  unoptimized
                                  className="object-contain"
                                />
                              </div>

                              <p className="text-sm font-extrabold text-zinc-100">
                                {formatPokemonName(evo.name)}
                              </p>

                              {/* Número */}
                              <span className="text-[11px] font-bold text-zinc-300">
                                #{String(evo.id).padStart(3, "0")}
                              </span>

                              {/* Tipos */}
                              <div className="flex gap-1">
                                {evo.types.slice(0, 2).map(tp => (
                                  <span
                                    key={tp}
                                    className={`px-2 py-1 rounded text-[10px] font-extrabold capitalize text-white ${getTypeClass(tp)}`}
                                  >
                                    {tp}
                                  </span>
                                ))}
                              </div>
                            </button>
                          );
                        })}

                        {stageIdx < evoStages.length - 1 && (
                          <span className="text-zinc-200/70 text-xl font-extrabold">
                            →
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      {/* Botão Voltar para a Pokédex */}
      <div
        className="
    w-full max-w-6xl
    rounded-2xl
    border border-black/10 dark:border-white/10
    mx-auto mt-6
    overflow-visible
  "
      >
        <div className="px-5 pb-4 flex justify-end">
          <motion.button
            onClick={() => router.push("/Pokedex")}
            whileHover={{
              scale: 1.08,
              y: -2,
              transition: { type: "spring", stiffness: 250, damping: 14 },
            }}
            className="
        relative z-10
        px-6 py-3
        rounded-xl
        bg-[#E3350D] hover:bg-[#C32B0B]
        text-white font-semibold text-sm
        transition
      "
          >
            Voltar para a Pokédex
          </motion.button>
        </div>
      </div>

    </div>
  );
}
