"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

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

// stages por profundidade (suporta ramificações)
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

// Classifica “varieties” (formas) em grupos — você pode adicionar mais padrões aqui
function classifyVariety(varietyName) {
  const n = String(varietyName || "").toLowerCase();

  // Mecânicas
  if (n.endsWith("-gmax")) return { group: "Mecânica", label: "Gigantamax" };
  if (n.includes("-mega-x")) return { group: "Mecânica", label: "Mega X" };
  if (n.includes("-mega-y")) return { group: "Mecânica", label: "Mega Y" };
  if (n.includes("-mega")) return { group: "Mecânica", label: "Mega" };
  if (n.includes("-primal")) return { group: "Mecânica", label: "Primal" };

  // Regionais / variações de região
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

  // fallback
  return { group: "Outras", label: "Forma" };
}

export default function PokemonId() {
  const router = useRouter();
  const params = useParams();

  // mais resistente caso seu segmento não se chame [pokemonId]
  const pokemonId =
    params?.pokemonId ?? params?.id ?? params?.slug ?? params?.name;

  const idOrName = useMemo(
    () => String(pokemonId || "").trim().toLowerCase(),
    [pokemonId]
  );

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // evolução + varieties
  const [evoStages, setEvoStages] = useState([]); // [[{base...}], [...]]
  const [evoLoading, setEvoLoading] = useState(false);
  const [evoError, setEvoError] = useState("");

  // expand por pokémon (pra não ficar gigante)
  const [expanded, setExpanded] = useState({}); // { [name]: true/false }

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

        // 1) species -> evolution_chain.url
        const speciesRes = await fetch(pokemon.species.url);
        if (!speciesRes.ok) throw new Error("Falha ao carregar species.");
        const speciesData = await speciesRes.json();

        const chainUrl = speciesData?.evolution_chain?.url;
        if (!chainUrl) throw new Error("Cadeia evolutiva não encontrada.");

        // 2) evolution_chain
        const chainRes = await fetch(chainUrl);
        if (!chainRes.ok) throw new Error("Falha ao carregar evolution chain.");
        const chainData = await chainRes.json();

        const stagesByName = extractEvolutionStages(chainData.chain);
        const uniqueNames = Array.from(new Set(stagesByName.flat()));

        // 3) busca dados base dos pokémons do chain
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
              varieties: [], // tudo que existir no species.varieties (menos o default)
            };
          })
        );

        const mapByName = {};
        for (const p of basePokemons) if (p?.name) mapByName[p.name] = p;

        // 4) Para cada base do chain: busca species e pega TODAS as varieties
        //    (sem chamar /pokemon de cada variedade pra não explodir requisições)
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
                .map((v) => ({
                  name: v?.pokemon?.name,
                  url: v?.pokemon?.url,
                }))
                .filter((v) => Boolean(v.name && v.url))
                // remove o “default” (o próprio base)
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

              // ordena: mecânicas primeiro, depois regionais, depois formas/outros
              const groupOrder = {
                "Mecânica": 0,
                "Regional": 1,
                "Forma": 2,
                "Outras": 3,
              };

              varieties.sort((a, b) => {
                const ga = groupOrder[a.group] ?? 99;
                const gb = groupOrder[b.group] ?? 99;
                if (ga !== gb) return ga - gb;
                return a.name.localeCompare(b.name);
              });

              base.varieties = varieties;
            } catch {
              // se falhar, só não mostra varieties desse
            }
          })
        );

        // 5) remonta em estágios com os objetos completos
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

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-10">
        <p className="text-sm text-slate-500">Carregando...</p>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="w-full max-w-xl mx-auto mt-10 px-4">
        <p className="text-red-500 text-sm">{error || "Erro desconhecido."}</p>
        <button
          onClick={() => router.push("/pokedex")}
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
    <div className="mt-8 w-full px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-5xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-6 items-start">
          {/* ESQUERDA: CARD ORIGINAL */}
          <div className="w-full max-w-[420px]">
            <div className="relative w-full aspect-736/1104">
              <div className="absolute z-10 left-[14%] right-[14%] top-[20%] h-[48%] overflow-hidden rounded-md">
                <div className="relative w-full h-full">
                  <Image
                    src={artwork}
                    alt={formatPokemonName(pokemon.name)}
                    fill
                    unoptimized
                    sizes="420px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/*
              <Image
                src="/pokedexcard.png"
                alt="Moldura Pokédex"
                fill
                priority
                className="z-20 object-contain pointer-events-none select-none"
              />
              */}
            </div>
          </div>

          {/* DIREITA: infos + linha evolutiva */}
          <div className="flex flex-col gap-4">
            {/* CARD CINZA */}
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 p-5">
              <div className="flex items-center gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-black/70 dark:text-white/70">
                    #{String(pokemon.id).padStart(3, "0")}
                  </p>

                  <h2 className="text-2xl font-extrabold text-black dark:text-white leading-tight truncate">
                    {formatPokemonName(pokemon.name)}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {pokemon.types.map((t) => (
                      <span
                        key={t.type.name}
                        className={`px-3 py-1 rounded-md text-xs font-bold capitalize ${getTypeClass(
                          t.type.name
                        )}`}
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-black/80 dark:text-white/80">
                <span className="font-extrabold">Base XP:</span>{" "}
                {pokemon.base_experience}
                <span className="mx-2 opacity-50">•</span>
                <span className="font-extrabold">Alt:</span> {pokemon.height / 10}m
                <span className="mx-2 opacity-50">•</span>
                <span className="font-extrabold">Peso:</span> {pokemon.weight / 10}kg
              </div>

              <div className="mt-4">
                <button
                  onClick={() => router.push("/pokedex")}
                  className="text-[#E3350D] hover:underline text-sm font-semibold"
                >
                  Voltar para a Pokédex
                </button>
              </div>
            </div>

            {/* LINHA EVOLUTIVA + VARIETIES */}
            <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
              <div className="relative w-full h-[280px] md:h-[360px] bg-black">
                <Image
                  src="/wallpaper-preto.png"
                  alt="Área da linha evolutiva"
                  fill
                  sizes="(min-width: 768px) 600px, 100vw"
                  className="object-cover"
                />

                <div className="absolute inset-0">
                  <div className="relative z-10 h-full w-full p-4 md:p-6 flex items-center">
                    <div className="w-full rounded-xl bg-black/60 border border-white/10 backdrop-blur-sm p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-zinc-100 font-extrabold text-sm md:text-base">
                          Linha evolutiva e variações
                        </h3>

                        {evoLoading && (
                          <span className="text-xs text-zinc-300">Carregando...</span>
                        )}
                      </div>

                      {evoError && (
                        <p className="mt-2 text-xs text-red-300">{evoError}</p>
                      )}

                      {!evoLoading && !evoError && evoStages?.length > 0 && (
                        <div className="mt-3 overflow-x-auto">
                          <div className="flex items-start gap-3 min-w-max">
                            {evoStages.map((stage, stageIdx) => (
                              <div
                                key={`stage-${stageIdx}`}
                                className="flex items-start gap-3"
                              >
                                <div className="flex items-start gap-3">
                                  {stage.map((evo) => {
                                    const isCurrent =
                                      String(evo.id) === String(pokemon.id) ||
                                      evo.name === pokemon.name;

                                    const groups = evo.varieties.reduce((acc, v) => {
                                      acc[v.group] = acc[v.group] || [];
                                      acc[v.group].push(v);
                                      return acc;
                                    }, {});

                                    const allVarieties = evo.varieties;
                                    const isExpanded = Boolean(expanded[evo.name]);
                                    const LIMIT = 10;

                                    const shown = isExpanded
                                      ? allVarieties
                                      : allVarieties.slice(0, LIMIT);

                                    const remaining = Math.max(
                                      0,
                                      allVarieties.length - LIMIT
                                    );

                                    return (
                                      <div key={evo.name} className="flex flex-col gap-2">
                                        {/* card base */}
                                        <button
                                          onClick={() => router.push(`/pokedex/${evo.id}`)}
                                          className={`group flex items-center gap-3 rounded-lg border px-3 py-2 transition
                                            ${isCurrent
                                              ? "border-[#E3350D] bg-white/10"
                                              : "border-white/10 bg-white/5 hover:bg-white/10"
                                            }`}
                                          title={formatPokemonName(evo.name)}
                                        >
                                          <div className="relative w-12 h-12 shrink-0">
                                            <Image
                                              src={evo.artwork}
                                              alt={formatPokemonName(evo.name)}
                                              fill
                                              unoptimized
                                              className="object-contain"
                                            />
                                          </div>

                                          <div className="min-w-0 text-left">
                                            <p className="text-[10px] text-zinc-300 font-semibold">
                                              #{String(evo.id).padStart(3, "0")}
                                            </p>

                                            <p className="text-sm font-extrabold text-zinc-100 truncate max-w-[170px]">
                                              {formatPokemonName(evo.name)}
                                            </p>

                                            <div className="mt-1 flex flex-wrap gap-1">
                                              {evo.types.slice(0, 2).map((tp) => (
                                                <span
                                                  key={tp}
                                                  className={`px-2 py-1 rounded text-[10px] font-extrabold capitalize ${getTypeClass(
                                                    tp
                                                  )}`}
                                                >
                                                  {tp}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        </button>

                                        {/* VARIETIES (tudo) */}
                                        {allVarieties.length > 0 && (
                                          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                                            {/* resumo por grupo */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                              {Object.keys(groups).map((g) => (
                                                <span
                                                  key={`${evo.name}-g-${g}`}
                                                  className="text-[10px] font-extrabold text-zinc-200/90 bg-black/40 border border-white/10 rounded px-2 py-1"
                                                >
                                                  {g}: {groups[g].length}
                                                </span>
                                              ))}
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                              {shown.map((v) => (
                                                <button
                                                  key={`${evo.name}-${v.name}`}
                                                  onClick={() => router.push(`/pokedex/${v.name}`)}
                                                  className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 px-2 py-1 transition"
                                                  title={formatPokemonName(v.name)}
                                                >
                                                  <span className="text-[10px] font-extrabold text-zinc-100">
                                                    {v.label}
                                                  </span>
                                                  <span className="text-[10px] text-zinc-300 font-semibold truncate max-w-[180px]">
                                                    {formatPokemonName(v.name)}
                                                  </span>
                                                  {v.id ? (
                                                    <span className="text-[10px] text-zinc-400 font-semibold">
                                                      #{String(v.id).padStart(3, "0")}
                                                    </span>
                                                  ) : null}
                                                </button>
                                              ))}

                                              {remaining > 0 && (
                                                <button
                                                  onClick={() =>
                                                    setExpanded((prev) => ({
                                                      ...prev,
                                                      [evo.name]: true,
                                                    }))
                                                  }
                                                  className="inline-flex items-center rounded-md border border-white/10 bg-black/30 hover:bg-black/40 px-2 py-1 transition"
                                                >
                                                  <span className="text-[10px] font-extrabold text-zinc-100">
                                                    Ver mais (+{remaining})
                                                  </span>
                                                </button>
                                              )}

                                              {isExpanded && allVarieties.length > LIMIT && (
                                                <button
                                                  onClick={() =>
                                                    setExpanded((prev) => ({
                                                      ...prev,
                                                      [evo.name]: false,
                                                    }))
                                                  }
                                                  className="inline-flex items-center rounded-md border border-white/10 bg-black/30 hover:bg-black/40 px-2 py-1 transition"
                                                >
                                                  <span className="text-[10px] font-extrabold text-zinc-100">
                                                    Ver menos
                                                  </span>
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* seta entre estágios */}
                                {stageIdx < evoStages.length - 1 && (
                                  <span className="text-zinc-200/80 font-extrabold px-1 mt-4">
                                    →
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!evoLoading && !evoError && evoStages?.length === 0 && (
                        <p className="mt-2 text-xs text-zinc-300">
                          Este Pokémon não possui cadeia evolutiva disponível.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/25 z-0" />
                </div>
              </div>
            </div>
            {/* fim */}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
