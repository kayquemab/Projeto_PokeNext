"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, BrushCleaning } from "lucide-react";
import { useRouter } from "next/navigation";

function formatName(name) {
    return String(name || "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function getIdFromUrl(url) {
    try {
        return Number(String(url).split("/")[6]);
    } catch {
        return NaN;
    }
}

export default function HabilidadesPage() {
    const router = useRouter();

    // =========================
    // Performance knobs
    // =========================
    const PREFETCH_INITIAL = 250;
    const PREFETCH_CONCURRENCY = 10;
    const PREFETCH_FLUSH_MS = 120;

    const SCAN_BATCH = 60;
    const SCAN_PARALLEL_FETCH = 18;

    // =========================
    // Busca
    // =========================
    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);

    // =========================
    // Data
    // =========================
    const [allAbilities, setAllAbilities] = useState([]);
    const [abilityDetails, setAbilityDetails] = useState({});
    const abilityDetailsRef = useRef(abilityDetails);

    useEffect(() => {
        abilityDetailsRef.current = abilityDetails;
    }, [abilityDetails]);

    const [visibleCount, setVisibleCount] = useState(20);

    // =========================
    // UI
    // =========================
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [advancedLoading, setAdvancedLoading] = useState(false);

    // =========================
    // Advanced Filters (Abilities)
    // =========================
    const [generation, setGeneration] = useState("all");
    const [mainSeries, setMainSeries] = useState("all");
    const [minPokemon, setMinPokemon] = useState("");

    // =========================
    // Engine avançado
    // =========================
    const [advancedApplied, setAdvancedApplied] = useState(false);
    const [advancedMatches, setAdvancedMatches] = useState([]);
    const [advancedCursor, setAdvancedCursor] = useState(0);
    const [advancedHasMore, setAdvancedHasMore] = useState(false);

    const advancedAppliedRef = useRef(false);
    const advancedMatchesRef = useRef([]);
    const advancedCursorRef = useRef(0);

    useEffect(() => {
        advancedAppliedRef.current = advancedApplied;
    }, [advancedApplied]);

    useEffect(() => {
        advancedMatchesRef.current = advancedMatches;
    }, [advancedMatches]);

    useEffect(() => {
        advancedCursorRef.current = advancedCursor;
    }, [advancedCursor]);

    // caches
    const detailsCache = useRef(new Map());
    const inFlight = useRef(new Map());
    const runIdRef = useRef(0);

    // batching
    const pendingDetailsRef = useRef({});
    const flushTimerRef = useRef(null);

    const queueDetailToState = useCallback(
        (id, detail) => {
            pendingDetailsRef.current[id] = detail;

            if (flushTimerRef.current) return;
            flushTimerRef.current = setTimeout(() => {
                const payload = pendingDetailsRef.current;
                pendingDetailsRef.current = {};
                flushTimerRef.current = null;

                setAbilityDetails((prev) => ({ ...prev, ...payload }));
            }, PREFETCH_FLUSH_MS);
        },
        [PREFETCH_FLUSH_MS]
    );

    const searchBoxRef = useRef(null);

    function navigateToAbility(slug) {
        router.push(`/Habilidades/${slug}`);
    }

    function prefetchAbility(slug) {
        try {
            router.prefetch?.(`/Habilidades/${slug}`);
        } catch { }
    }

    const hasAnyAdvancedFilter = useMemo(() => {
        return (
            generation !== "all" ||
            mainSeries !== "all" ||
            !!minPokemon
        );
    }, [generation, mainSeries, minPokemon]);

    // =========================
    // Ability details
    // =========================
    const getAbilityDetail = useCallback(
        async (a) => {
            const id = a.id;
            const current = abilityDetailsRef.current;

            if (current[id]) return current[id];
            if (detailsCache.current.has(id)) return detailsCache.current.get(id);
            if (inFlight.current.has(id)) return inFlight.current.get(id);

            const p = fetch(a.url)
                .then((r) => r.json())
                .then((d) => {
                    const simplified = {
                        generation: d.generation?.name,
                        mainSeries: d.is_main_series,
                        pokemonCount: d.pokemon?.length || 0,
                        effect:
                            d.effect_entries?.find((e) => e.language.name === "en")
                                ?.short_effect || "—",
                    };

                    detailsCache.current.set(id, simplified);
                    queueDetailToState(id, simplified);

                    return simplified;
                })
                .catch(() => null)
                .finally(() => {
                    inFlight.current.delete(id);
                });

            inFlight.current.set(id, p);
            return p;
        },
        [queueDetailToState]
    );

    function matchesAdvanced(detail) {
        if (!detail) return false;

        if (generation !== "all" && detail.generation !== generation)
            return false;

        if (mainSeries !== "all") {
            if (mainSeries === "yes" && !detail.mainSeries) return false;
            if (mainSeries === "no" && detail.mainSeries) return false;
        }

        if (minPokemon) {
            if (detail.pokemonCount < Number(minPokemon)) return false;
        }

        return true;
    }

    // =========================
    // Load abilities list
    // =========================
    useEffect(() => {
        let alive = true;

        async function loadAbilities() {
            try {
                setError("");
                setLoading(true);

                const res = await fetch("https://pokeapi.co/api/v2/ability?limit=1000");
                const data = await res.json();
                if (!alive) return;

                setAllAbilities(
                    (data.results || []).map((a) => ({
                        name: a.name,
                        id: getIdFromUrl(a.url),
                        url: a.url,
                    }))
                );
            } catch (e) {
                console.error(e);
                setError("Erro ao carregar habilidades.");
            } finally {
                setLoading(false);
            }
        }

        loadAbilities();
        return () => {
            alive = false;
        };
    }, []);

    // =========================
    // Prefetch details
    // =========================
    const prefetchStartedRef = useRef(false);

    useEffect(() => {
        if (!allAbilities.length) return;
        if (prefetchStartedRef.current) return;

        prefetchStartedRef.current = true;

        const queue = allAbilities.slice(0, PREFETCH_INITIAL);
        let index = 0;
        let stopped = false;

        async function worker() {
            while (!stopped) {
                const i = index++;
                if (i >= queue.length) return;

                const a = queue[i];
                if (detailsCache.current.has(a.id)) continue;

                await getAbilityDetail(a);
            }
        }

        const workers = Array.from(
            { length: PREFETCH_CONCURRENCY },
            () => worker()
        );

        Promise.allSettled(workers).catch(() => { });

        return () => {
            stopped = true;
        };
    }, [allAbilities, getAbilityDetail]);

    // =========================
    // Suggestions
    // =========================
    const suggestions = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return [];

        const isNumeric = /^\d+$/.test(q);

        const byName = allAbilities
            .filter((a) => a.name.includes(q))
            .slice(0, 8)
            .map((a) => a.name);

        if (!isNumeric) return byName;

        const byId = allAbilities
            .filter((a) => String(a.id).includes(q))
            .slice(0, 8)
            .map((a) => a.name);

        return Array.from(new Set([...byId, ...byName])).slice(0, 8);
    }, [search, allAbilities]);

    function pickSuggestion(name) {
        setSearch(name);
        setVisibleCount(20);
        setShowSuggestions(false);

        setAdvancedApplied(false);
        setAdvancedMatches([]);
        setAdvancedCursor(0);
        setAdvancedHasMore(false);
    }

    useEffect(() => {
        function onDocMouseDown(e) {
            if (!searchBoxRef.current) return;
            if (!searchBoxRef.current.contains(e.target))
                setShowSuggestions(false);
        }

        document.addEventListener("mousedown", onDocMouseDown);
        return () =>
            document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    // =========================
    // Basic filter
    // =========================
    const basicFiltered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return allAbilities.filter((a) => {
            if (!q) return true;
            return (
                a.name.includes(q) ||
                String(a.id).includes(q)
            );
        });
    }, [allAbilities, search]);

    const baseList = useMemo(() => {
        if (advancedApplied && hasAnyAdvancedFilter)
            return advancedMatches;
        return basicFiltered;
    }, [advancedApplied, hasAnyAdvancedFilter, advancedMatches, basicFiltered]);

    const visibleAbilities = useMemo(
        () => baseList.slice(0, visibleCount),
        [baseList, visibleCount]
    );

    // preload details visíveis
    useEffect(() => {
        async function preloadVisibleDetails() {
            const toLoad = visibleAbilities.filter(
                (a) =>
                    !abilityDetailsRef.current[a.id] &&
                    !detailsCache.current.has(a.id)
            );

            if (!toLoad.length) return;

            await Promise.all(toLoad.slice(0, 24).map(getAbilityDetail));
        }

        preloadVisibleDetails();
    }, [visibleAbilities, getAbilityDetail]);

    // =========================
    // Actions
    // =========================
    function applySimpleSearch() {
        setVisibleCount(20);
        setShowSuggestions(false);

        setAdvancedApplied(false);
        setAdvancedMatches([]);
        setAdvancedCursor(0);
        setAdvancedHasMore(false);
    }

    function clearAllFilters() {
        setSearch("");
        setGeneration("all");
        setMainSeries("all");
        setMinPokemon("");
        setVisibleCount(20);
        setShowSuggestions(false);

        setAdvancedApplied(false);
        setAdvancedMatches([]);
        setAdvancedCursor(0);
        setAdvancedHasMore(false);
    }

    function resetAdvanced() {
        setGeneration("all");
        setMainSeries("all");
        setMinPokemon("");
        setVisibleCount(20);

        setAdvancedApplied(false);
        setAdvancedMatches([]);
        setAdvancedCursor(0);
        setAdvancedHasMore(false);
    }

    async function applyAdvancedFilters() {
        setShowSuggestions(false);
        setVisibleCount(20);

        if (!hasAnyAdvancedFilter) {
            setAdvancedApplied(false);
            setAdvancedMatches([]);
            return;
        }

        const runId = runIdRef.current + 1;
        runIdRef.current = runId;

        setAdvancedLoading(true);

        setAdvancedApplied(true);
        setAdvancedMatches([]);
        setAdvancedCursor(0);
        setAdvancedHasMore(true);

        try {
            const matches = [];

            for (let a of basicFiltered) {
                const d =
                    detailsCache.current.get(a.id) ||
                    (await getAbilityDetail(a));

                if (matchesAdvanced(d)) matches.push(a);

                if (matches.length >= 20) break;
            }

            setAdvancedMatches(matches);
            setAdvancedHasMore(matches.length < basicFiltered.length);
        } finally {
            setAdvancedLoading(false);
        }
    }

    async function handleLoadMore() {
        setVisibleCount((v) => v + 15);
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
                Habilidades
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
                ${advancedOpen
                                    ? "rounded-t-2xl rounded-b-none"
                                    : "rounded-2xl"
                                }
              `}
                        >
                            <div className="mb-3">
                                <div className="flex items-center gap-2 mb-3">
                                    <motion.div
                                        className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                                        initial={{ scaleY: 0.3, opacity: 0 }}
                                        animate={{ scaleY: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.35 }}
                                    />
                                    <label className="block text-white text-lg font-medium">
                                        Buscar Habilidade
                                    </label>
                                </div>

                                {/* INPUT + BOTÕES */}
                                <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 mb-2">
                                    <div className="relative w-full sm:w-auto" ref={searchBoxRef}>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                setShowSuggestions(true);

                                                setAdvancedApplied(false);
                                                setAdvancedMatches([]);
                                                setAdvancedCursor(0);
                                                setAdvancedHasMore(false);
                                            }}
                                            className="
                        w-full sm:w-80 md:w-96 lg:w-md
                        bg-neutral-50 text-gray-900
                        px-4 py-2 rounded-md
                        border border-neutral-200
                        focus:outline-none focus:ring-2
                        focus:ring-[#E3350D]/70
                      "
                                        />

                                        {showSuggestions && suggestions.length > 0 && (
                                            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-neutral-200 z-50 overflow-hidden">
                                                {suggestions.map((name) => (
                                                    <button
                                                        key={name}
                                                        type="button"
                                                        onClick={() => pickSuggestion(name)}
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 capitalize"
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
                                            className="h-[42px] px-4 rounded-md bg-[#E3350D] text-white hover:bg-[#c52c0b]"
                                        >
                                            <Search className="w-5 h-5" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={clearAllFilters}
                                            className="h-[42px] px-4 rounded-md bg-white/15 text-white hover:bg-white/20 border border-white/10"
                                        >
                                            <BrushCleaning className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <p className="mt-3 text-sm sm:text-base text-white">
                                    Use a busca avançada para filtrar habilidades por geração,
                                    main series e quantidade mínima de Pokémon!
                                </p>
                            </div>
                        </motion.div>

                        {/* ACCORDION */}
                        <div className="relative">
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

                                                {/* ESQUERDA */}
                                                <div className="lg:col-span-7">
                                                    <h3 className="text-white text-lg font-semibold mb-3">
                                                        Geração da habilidade
                                                    </h3>

                                                    <select
                                                        value={generation}
                                                        onChange={(e) => setGeneration(e.target.value)}
                                                        className="w-full bg-neutral-700 text-white px-3 py-2 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#E3350D]/60"
                                                    >
                                                        <option value="all">Todas</option>
                                                        <option value="generation-i">Generation I</option>
                                                        <option value="generation-ii">Generation II</option>
                                                        <option value="generation-iii">Generation III</option>
                                                        <option value="generation-iv">Generation IV</option>
                                                        <option value="generation-v">Generation V</option>
                                                        <option value="generation-vi">Generation VI</option>
                                                        <option value="generation-vii">Generation VII</option>
                                                        <option value="generation-viii">Generation VIII</option>
                                                        <option value="generation-ix">Generation IX</option>
                                                    </select>

                                                    {/* MAIN SERIES */}
                                                    <div className="mt-6">
                                                        <h3 className="text-white text-lg font-semibold mb-2">
                                                            Apenas Main Series?
                                                        </h3>

                                                        <select
                                                            value={mainSeries}
                                                            onChange={(e) => setMainSeries(e.target.value)}
                                                            className="w-full bg-neutral-700 text-white px-3 py-2 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#E3350D]/60"
                                                        >
                                                            <option value="all">Todas</option>
                                                            <option value="yes">Sim</option>
                                                            <option value="no">Não</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* DIREITA */}
                                                <div className="lg:col-span-5">
                                                    <h3 className="text-white text-lg font-semibold mb-2">
                                                        Mínimo de Pokémon com essa habilidade
                                                    </h3>

                                                    <input
                                                        type="number"
                                                        value={minPokemon}
                                                        onChange={(e) => setMinPokemon(e.target.value)}
                                                        className="w-40 bg-white text-neutral-900 px-3 py-2 rounded-md border border-white/10 focus:outline-none no-spinner"
                                                    />

                                                    <div className="mt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setMinPokemon("")}
                                                            className="text-xs text-white/70 hover:text-white underline"
                                                        >
                                                            Limpar valor
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

                                            {/* BOTÕES */}
                                            <div className="flex items-center gap-3 justify-start lg:justify-end mt-6">
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
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* BOTÃO DE ABRIR */}
                            <div className="w-60 mx-auto flex justify-center bg-[#616161] rounded-b-[5px] overflow-visible relative z-10">
                                <button
                                    type="button"
                                    onClick={() => setAdvancedOpen((v) => !v)}
                                    className="flex items-center justify-center gap-2 text-white/90 hover:text-white transition py-2 w-full"
                                >
                                    <span className="text-sm font-medium">
                                        {advancedOpen
                                            ? "Esconder busca avançada"
                                            : "Mostrar busca avançada"}
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

                        {/* GRID */}
                        {visibleAbilities.length > 0 ? (
                            <div className="mt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {visibleAbilities.map((a) => {
                                        const d =
                                            abilityDetailsRef.current[a.id] ||
                                            detailsCache.current.get(a.id);

                                        return (
                                            <motion.button
                                                key={a.id}
                                                type="button"
                                                whileHover={{ scale: 1.03 }}
                                                onClick={() => navigateToAbility(a.name)}
                                                onMouseEnter={() => prefetchAbility(a.name)}
                                                onFocus={() => prefetchAbility(a.name)}
                                                className="
              flex flex-col items-stretch justify-start
              rounded-md bg-white p-4
              shadow-[0_4px_10px_rgba(0,0,0,0.06)]
              hover:shadow-[0_8px_18px_rgba(0,0,0,0.1)]
              border border-neutral-200
              transition-shadow duration-200
              text-left
            "
                                            >
                                                {/* HEADER */}
                                                <div className="flex items-center gap-2 mb-2">
                                                    <motion.div
                                                        className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                                                        initial={{ scaleY: 0.3, opacity: 0 }}
                                                        animate={{ scaleY: 1, opacity: 1 }}
                                                        transition={{ delay: 0.15, duration: 0.35 }}
                                                    />

                                                    <h3 className="text-lg font-semibold text-neutral-600 capitalize">
                                                        {formatName(a.name)}
                                                    </h3>
                                                </div>

                                                {/* BADGE GERAÇÃO */}
                                                {d?.generation ? (
                                                    <span
                                                        className="
                  self-start w-fit inline-flex
                  px-3 py-1 text-xs rounded-md font-medium
                  bg-neutral-200 text-neutral-700
                "
                                                    >
                                                        {d.generation
                                                            .replace("generation-", "Gen ")
                                                            .toUpperCase()}
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-500">
                                                        Carregando geração...
                                                    </span>
                                                )}

                                                {/* DETALHES */}
                                                {d ? (
                                                    <div className="mt-2 text-sm text-neutral-600 space-y-1">
                                                        <div>
                                                            Série principal:{" "}
                                                            {d.mainSeries ? "Sim" : "Não"}
                                                        </div>

                                                        <div>Pokémon: {d.pokemonCount}</div>

                                                        {d.effect && (
                                                            <p className="mt-2 text-[11px] text-neutral-500 leading-snug">
                                                                {d.effect}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 text-[11px] text-slate-500">
                                                        Carregando detalhes...
                                                    </div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* LOAD MORE */}
                                <div className="flex justify-center mt-6">
                                    {visibleCount < baseList.length && (
                                        <button
                                            type="button"
                                            onClick={handleLoadMore}
                                            className="bg-[#E3350D] text-white px-6 py-2 rounded-md hover:bg-[#c52c0b]"
                                        >
                                            Carregar mais habilidades
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 text-center text-white/80">
                                Nenhuma habilidade encontrada com os filtros atuais.
                            </div>
                        )}

                        {/* LOAD MORE */}
                        <div className="flex justify-center mt-6">
                            {visibleCount < baseList.length && (
                                <button
                                    type="button"
                                    onClick={handleLoadMore}
                                    className="bg-[#E3350D] text-white px-6 py-2 rounded-md hover:bg-[#c52c0b]"
                                >
                                    Carregar mais habilidades
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
