"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, BrushCleaning } from "lucide-react";
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

const ALL_TYPES = Object.keys(TYPE_STYLES).filter((t) => t !== "default");

function getTypeClass(type) {
    return TYPE_STYLES[type] || TYPE_STYLES.default;
}

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

function createEmptyTypeMode() {
    return Object.fromEntries(ALL_TYPES.map((t) => [t, null]));
}

export default function MovimentosPage() {
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
    const [allMoves, setAllMoves] = useState([]);
    const [moveDetails, setMoveDetails] = useState({}); // id -> detail simplificado
    const moveDetailsRef = useRef(moveDetails);

    useEffect(() => {
        moveDetailsRef.current = moveDetails;
    }, [moveDetails]);

    const [visibleCount, setVisibleCount] = useState(20);

    // =========================
    // UI
    // =========================
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [advancedLoading, setAdvancedLoading] = useState(false);

    // =========================
    // Filtros avançados
    // =========================
    const [damageClass, setDamageClass] = useState("all");
    const [minPower, setMinPower] = useState("");
    const [minAccuracy, setMinAccuracy] = useState("");
    const [minPP, setMinPP] = useState("");

    // Tipo/Fraqueza (T/F)
    const [typeMode, setTypeMode] = useState(() => createEmptyTypeMode());

    // =========================
    // Fraquezas via API
    // =========================
    const [typeWeaknesses, setTypeWeaknesses] = useState({});
    const [typeWeaknessesLoading, setTypeWeaknessesLoading] = useState(false);
    const typeWeaknessesPromiseRef = useRef(null);
    const TYPE_CACHE_KEY = "poke_type_weaknesses_v1";

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
    const detailsCache = useRef(new Map()); // id -> detail
    const inFlight = useRef(new Map()); // id -> Promise
    const runIdRef = useRef(0);

    // batching do setMoveDetails
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

                setMoveDetails((prev) => ({ ...prev, ...payload }));
            }, PREFETCH_FLUSH_MS);
        },
        [PREFETCH_FLUSH_MS]
    );

    const searchBoxRef = useRef(null);

    // ✅ agora navega por NOME (slug)
    function navigateToMove(slug) {
        router.push(`/Movimentos/${slug}`);
    }

    function prefetchMove(slug) {
        try {
            router.prefetch?.(`/Movimentos/${slug}`);
        } catch { }
    }

    function toggleTypeModeLocal(type, mode) {
        setTypeMode((prev) => {
            const current = prev[type];
            return { ...prev, [type]: current === mode ? null : mode };
        });
    }

    const selectedTypeIncludes = useMemo(
        () => Object.keys(typeMode).filter((t) => typeMode[t] === "type"),
        [typeMode]
    );

    const selectedWeaknessTargets = useMemo(
        () => Object.keys(typeMode).filter((t) => typeMode[t] === "weakness"),
        [typeMode]
    );

    const hasAnyAdvancedFilter = useMemo(() => {
        return (
            damageClass !== "all" ||
            !!minPower ||
            !!minAccuracy ||
            !!minPP ||
            selectedTypeIncludes.length > 0 ||
            selectedWeaknessTargets.length > 0
        );
    }, [
        damageClass,
        minPower,
        minAccuracy,
        minPP,
        selectedTypeIncludes.length,
        selectedWeaknessTargets.length,
    ]);

    // =========================
    // Fraquezas: load + ensure
    // =========================
    function isWeaknessMapReady(map) {
        return map && Object.keys(map).length > 0;
    }

    async function loadTypeWeaknessesFromApi() {
        // cache 24h
        try {
            const cachedRaw = localStorage.getItem(TYPE_CACHE_KEY);
            if (cachedRaw) {
                const parsed = JSON.parse(cachedRaw);
                const isFresh =
                    parsed?.ts && Date.now() - parsed.ts < 24 * 60 * 60 * 1000;
                if (isFresh && parsed?.data && isWeaknessMapReady(parsed.data)) {
                    setTypeWeaknesses(parsed.data);
                    return parsed.data;
                }
            }
        } catch { }

        const listRes = await fetch("https://pokeapi.co/api/v2/type?limit=1000");
        const listData = await listRes.json();

        const types = (listData.results || [])
            .map((t) => t.name)
            .filter((name) => name !== "unknown" && name !== "shadow");

        const CONCURRENCY = 6;
        const out = {};
        let idx = 0;

        async function worker() {
            while (idx < types.length) {
                const my = idx++;
                const typeName = types[my];

                try {
                    const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
                    const data = await res.json();

                    const weakFrom = (data.damage_relations?.double_damage_from || []).map(
                        (x) => x.name
                    );

                    out[typeName] = weakFrom;
                } catch {
                    out[typeName] = [];
                }
            }
        }

        await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

        try {
            localStorage.setItem(
                TYPE_CACHE_KEY,
                JSON.stringify({ ts: Date.now(), data: out })
            );
        } catch { }

        setTypeWeaknesses(out);
        return out;
    }

    async function ensureTypeWeaknesses() {
        if (isWeaknessMapReady(typeWeaknesses)) return typeWeaknesses;
        if (typeWeaknessesPromiseRef.current) return typeWeaknessesPromiseRef.current;

        setTypeWeaknessesLoading(true);

        const p = loadTypeWeaknessesFromApi()
            .catch(() => {
                setTypeWeaknesses({});
                return {};
            })
            .finally(() => {
                typeWeaknessesPromiseRef.current = null;
                setTypeWeaknessesLoading(false);
            });

        typeWeaknessesPromiseRef.current = p;
        return p;
    }

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                await ensureTypeWeaknesses();
            } catch { }
            if (!alive) return;
        })();

        return () => {
            alive = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const weaknessAllowedTypes = useMemo(() => {
        const s = new Set();
        selectedWeaknessTargets.forEach((target) => {
            const arr = typeWeaknesses[target] || [];
            arr.forEach((atk) => s.add(atk));
        });
        return s;
    }, [selectedWeaknessTargets, typeWeaknesses]);

    // =========================
    // Move details (estável)
    // =========================
    const getMoveDetail = useCallback(
        async (m) => {
            const id = m.id;
            const current = moveDetailsRef.current;

            if (current[id]) return current[id];
            if (detailsCache.current.has(id)) return detailsCache.current.get(id);
            if (inFlight.current.has(id)) return inFlight.current.get(id);

            const p = fetch(m.url)
                .then((r) => r.json())
                .then((d) => {
                    const simplified = {
                        type: d.type?.name,
                        power: d.power,
                        accuracy: d.accuracy,
                        pp: d.pp,
                        damageClass: d.damage_class?.name,
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

        if (selectedTypeIncludes.length > 0) {
            if (!detail.type || !selectedTypeIncludes.includes(detail.type)) return false;
        }

        if (selectedWeaknessTargets.length > 0) {
            if (!detail.type || !weaknessAllowedTypes.has(detail.type)) return false;
        }

        if (damageClass !== "all" && detail.damageClass !== damageClass) return false;

        if (minPower) {
            const p = detail.power ?? 0;
            if (p < Number(minPower)) return false;
        }

        if (minAccuracy) {
            const a = detail.accuracy ?? 0;
            if (a < Number(minAccuracy)) return false;
        }

        if (minPP) {
            const pp = detail.pp ?? 0;
            if (pp < Number(minPP)) return false;
        }

        return true;
    }

    // =========================
    // Load moves list
    // =========================
    useEffect(() => {
        let alive = true;

        async function loadMoves() {
            try {
                setError("");
                setLoading(true);

                const res = await fetch("https://pokeapi.co/api/v2/move?limit=1000");
                const data = await res.json();
                if (!alive) return;

                setAllMoves(
                    (data.results || []).map((m) => ({
                        name: m.name,
                        id: getIdFromUrl(m.url),
                        url: m.url,
                    }))
                );
            } catch (e) {
                console.error(e);
                setError("Erro ao carregar movimentos.");
            } finally {
                setLoading(false);
            }
        }

        loadMoves();
        return () => {
            alive = false;
        };
    }, []);

    // =========================
    // Prefetch moves details
    // =========================
    const prefetchStartedRef = useRef(false);

    useEffect(() => {
        if (!allMoves.length) return;
        if (prefetchStartedRef.current) return;

        prefetchStartedRef.current = true;

        function idle(cb) {
            if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                return window.requestIdleCallback(cb, { timeout: 800 });
            }
            return setTimeout(cb, 200);
        }

        const queue = allMoves.slice(0, PREFETCH_INITIAL);
        let index = 0;
        let stopped = false;

        async function worker() {
            while (!stopped) {
                const i = index++;
                if (i >= queue.length) return;

                const m = queue[i];
                const current = moveDetailsRef.current;

                if (detailsCache.current.has(m.id) || current[m.id]) continue;
                await getMoveDetail(m);
            }
        }

        idle(() => {
            const workers = Array.from({ length: PREFETCH_CONCURRENCY }, () => worker());
            Promise.allSettled(workers).catch(() => { });
        });

        return () => {
            stopped = true;
        };
    }, [allMoves, getMoveDetail, PREFETCH_INITIAL, PREFETCH_CONCURRENCY]);

    // =========================
    // Suggestions
    // =========================
    const suggestions = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return [];

        const isNumeric = /^\d+$/.test(q);

        const byName = allMoves
            .filter((m) => m.name.includes(q))
            .slice(0, 8)
            .map((m) => m.name);

        if (!isNumeric) return byName;

        const byId = allMoves
            .filter((m) => String(m.id).includes(q))
            .slice(0, 8)
            .map((m) => m.name);

        return Array.from(new Set([...byId, ...byName])).slice(0, 8);
    }, [search, allMoves]);

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
            if (!searchBoxRef.current.contains(e.target)) setShowSuggestions(false);
        }

        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, []);

    // =========================
    // Basic filter (name/id)
    // =========================
    const basicFiltered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return allMoves.filter((m) => {
            if (!q) return true;
            const byName = m.name.includes(q);
            const byId = String(m.id).includes(q);
            return byName || byId;
        });
    }, [allMoves, search]);

    const baseList = useMemo(() => {
        if (advancedApplied && hasAnyAdvancedFilter) return advancedMatches;
        return basicFiltered;
    }, [advancedApplied, hasAnyAdvancedFilter, advancedMatches, basicFiltered]);

    const visibleMoves = useMemo(() => baseList.slice(0, visibleCount), [baseList, visibleCount]);

    // preload details visíveis
    useEffect(() => {
        let alive = true;

        async function preloadVisibleDetails() {
            const toLoad = visibleMoves.filter(
                (m) => !moveDetailsRef.current[m.id] && !detailsCache.current.has(m.id)
            );
            if (!toLoad.length) return;

            const slice = toLoad.slice(0, 24);
            await Promise.all(slice.map((m) => getMoveDetail(m)));

            if (!alive) return;
        }

        preloadVisibleDetails();
        return () => {
            alive = false;
        };
    }, [visibleMoves, getMoveDetail]);

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
        setDamageClass("all");
        setMinPower("");
        setMinAccuracy("");
        setMinPP("");
        setTypeMode(createEmptyTypeMode());
        setVisibleCount(20);
        setShowSuggestions(false);

        setAdvancedApplied(false);
        setAdvancedMatches([]);
        setAdvancedCursor(0);
        setAdvancedHasMore(false);
    }

    function resetAdvanced() {
        setDamageClass("all");
        setMinPower("");
        setMinAccuracy("");
        setMinPP("");
        setTypeMode(createEmptyTypeMode());
        setVisibleCount(20);

        setAdvancedApplied(false);
        setAdvancedMatches([]);
        setAdvancedCursor(0);
        setAdvancedHasMore(false);
    }

    function fastScanFromCache(list, needCount) {
        const matches = [];
        let cursor = 0;

        while (matches.length < needCount && cursor < list.length) {
            const m = list[cursor];
            cursor++;

            const d = detailsCache.current.get(m.id) || moveDetailsRef.current[m.id];
            if (!d) continue;

            if (matchesAdvanced(d)) matches.push(m);
        }

        return { matches, cursor };
    }

    async function scanAdvancedToTarget({ targetCount, runId, startCursor, startMatches }) {
        const list = basicFiltered;
        let cursor = startCursor;
        let matches = [...startMatches];

        if (cursor >= list.length) {
            setAdvancedHasMore(false);
            return;
        }

        while (matches.length < targetCount && cursor < list.length) {
            if (runIdRef.current !== runId) return;

            const batch = list.slice(cursor, cursor + SCAN_BATCH);
            cursor += batch.length;

            const needFetch = [];
            const details = new Array(batch.length).fill(null);

            for (let i = 0; i < batch.length; i++) {
                const m = batch[i];
                const cached = detailsCache.current.get(m.id) || moveDetailsRef.current[m.id];
                if (cached) details[i] = cached;
                else needFetch.push({ m, i });
            }

            if (needFetch.length) {
                for (let i = 0; i < needFetch.length; i += SCAN_PARALLEL_FETCH) {
                    if (runIdRef.current !== runId) return;

                    const group = needFetch.slice(i, i + SCAN_PARALLEL_FETCH);
                    const fetched = await Promise.all(group.map((x) => getMoveDetail(x.m)));
                    for (let k = 0; k < group.length; k++) {
                        details[group[k].i] = fetched[k];
                    }
                }
            }

            for (let i = 0; i < batch.length; i++) {
                if (matchesAdvanced(details[i])) matches.push(batch[i]);
            }

            setAdvancedMatches([...matches]);
            setAdvancedCursor(cursor);
            setAdvancedHasMore(cursor < list.length);
        }

        setAdvancedHasMore(cursor < list.length);
    }

    async function applyAdvancedFilters() {
        setShowSuggestions(false);
        setVisibleCount(20);

        if (!hasAnyAdvancedFilter) {
            setAdvancedApplied(false);
            setAdvancedMatches([]);
            setAdvancedCursor(0);
            setAdvancedHasMore(false);
            return;
        }

        if (selectedWeaknessTargets.length > 0) {
            await ensureTypeWeaknesses();
        }

        const runId = runIdRef.current + 1;
        runIdRef.current = runId;

        setAdvancedLoading(true);

        setAdvancedApplied(true);
        setAdvancedMatches([]);
        setAdvancedCursor(0);
        setAdvancedHasMore(true);

        try {
            const { matches, cursor } = fastScanFromCache(basicFiltered, 20);

            if (runIdRef.current !== runId) return;

            if (matches.length > 0) {
                setAdvancedMatches(matches);
                setAdvancedCursor(cursor);
                setAdvancedHasMore(cursor < basicFiltered.length);
            }

            if (matches.length < 20) {
                await scanAdvancedToTarget({
                    targetCount: 20,
                    runId,
                    startCursor: cursor,
                    startMatches: matches,
                });
            }
        } finally {
            if (runIdRef.current === runId) setAdvancedLoading(false);
        }
    }

    async function handleLoadMore() {
        const next = visibleCount + 15;
        setVisibleCount(next);

        if (advancedAppliedRef.current && hasAnyAdvancedFilter) {
            if (!advancedHasMore && advancedMatchesRef.current.length >= next) return;

            if (selectedWeaknessTargets.length > 0 && !isWeaknessMapReady(typeWeaknesses)) {
                await ensureTypeWeaknesses();
            }

            const runId = runIdRef.current;
            setAdvancedLoading(true);

            try {
                await scanAdvancedToTarget({
                    targetCount: next,
                    runId,
                    startCursor: advancedCursorRef.current,
                    startMatches: advancedMatchesRef.current,
                });
            } finally {
                if (runIdRef.current === runId) setAdvancedLoading(false);
            }
        }
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
                Movimentos
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
                            <div className="mb-3">
                                <div className="flex items-center gap-2 mb-3">
                                    <motion.div
                                        className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                                        initial={{ scaleY: 0.3, opacity: 0 }}
                                        animate={{ scaleY: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.35 }}
                                    />
                                    <label className="block text-white text-lg font-medium">
                                        Buscar Movimento
                                    </label>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 mb-2">
                                    {/* INPUT */}
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
                                    Use a busca avançada para filtrar movimentos por tipo, classe de dano e valores mínimos!
                                </p>

                                {loading && (
                                    <p className="mt-2 text-white/80 text-sm">
                                        Carregando lista de movimentos...
                                    </p>
                                )}
                                {error && <p className="mt-2 text-red-200 text-sm">{error}</p>}
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
                                                    <div className="flex items-start justify-between gap-4 mb-3">
                                                        <div>
                                                            <h3 className="text-white text-lg font-semibold">
                                                                Tipo e Fraqueza
                                                            </h3>
                                                            {typeWeaknessesLoading && (
                                                                <p className="text-white/70 text-xs mt-1">
                                                                    Carregando relações de fraqueza da PokéAPI...
                                                                </p>
                                                            )}
                                                        </div>

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
                                                                <div key={t} className="flex items-center justify-between gap-2">
                                                                    <span
                                                                        className={`min-w-[120px] px-3 py-1 rounded-md text-xs font-semibold text-center ${getTypeClass(
                                                                            t
                                                                        )}`}
                                                                    >
                                                                        {TYPE_LABELS_PT[t] || formatName(t)}
                                                                    </span>

                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => toggleTypeModeLocal(t, "type")}
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
                                                                            disabled={typeWeaknessesLoading}
                                                                            onClick={() => toggleTypeModeLocal(t, "weakness")}
                                                                            className={`w-7 h-7 rounded-full border text-xs font-bold transition
                                        ${typeWeaknessesLoading ? "opacity-50 cursor-not-allowed" : ""}
                                        ${isF
                                                                                    ? "bg-white text-neutral-900 border-white"
                                                                                    : "bg-transparent text-white border-white/40 hover:border-white/80"
                                                                                }`}
                                                                            title={
                                                                                typeWeaknessesLoading
                                                                                    ? "Carregando relações..."
                                                                                    : "Filtrar por Fraqueza"
                                                                            }
                                                                        >
                                                                            F
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* DIREITA */}
                                                <div className="lg:col-span-5">
                                                    <div className="mb-5">
                                                        <h3 className="text-white text-lg font-semibold mb-2">
                                                            Classe de dano
                                                        </h3>

                                                        <div className="relative w-75">
                                                            <select
                                                                value={damageClass}
                                                                onChange={(e) => setDamageClass(e.target.value)}
                                                                className="w-full appearance-none bg-neutral-700 text-white px-3 py-2 pr-10 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#E3350D]/60"
                                                            >
                                                                <option value="all">Todas</option>
                                                                <option value="physical">Physical</option>
                                                                <option value="special">Special</option>
                                                                <option value="status">Status</option>
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

                                                    <div className="mb-5">
                                                        <h3 className="text-white text-lg font-semibold mb-2">Power</h3>
                                                        <input
                                                            type="number"
                                                            value={minPower}
                                                            onChange={(e) => setMinPower(e.target.value)}
                                                            className="w-40 bg-white text-neutral-900 px-3 py-2 rounded-md border border-white/10 focus:outline-none no-spinner"
                                                        />
                                                        <div className="mt-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => setMinPower("")}
                                                                className="text-xs text-white/70 hover:text-white underline"
                                                            >
                                                                Limpar Power
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mb-5">
                                                        <h3 className="text-white text-lg font-semibold mb-2">Accuracy</h3>
                                                        <input
                                                            type="number"
                                                            value={minAccuracy}
                                                            onChange={(e) => setMinAccuracy(e.target.value)}
                                                            className="w-40 bg-white text-neutral-900 px-3 py-2 rounded-md border border-white/10 focus:outline-none no-spinner"
                                                        />
                                                        <div className="mt-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => setMinAccuracy("")}
                                                                className="text-xs text-white/70 hover:text-white underline"
                                                            >
                                                                Limpar Accuracy
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mb-5">
                                                        <h3 className="text-white text-lg font-semibold mb-2">PP</h3>
                                                        <input
                                                            type="number"
                                                            value={minPP}
                                                            onChange={(e) => setMinPP(e.target.value)}
                                                            className="w-40 bg-white text-neutral-900 px-3 py-2 rounded-md border border-white/10 focus:outline-none no-spinner"
                                                        />
                                                        <div className="mt-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => setMinPP("")}
                                                                className="text-xs text-white/70 hover:text-white underline"
                                                            >
                                                                Limpar PP
                                                            </button>
                                                        </div>
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

                        {/* GRID */}
                        {visibleMoves.length > 0 ? (
                            <div className="mt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {visibleMoves.map((m) => {
                                        const d = moveDetailsRef.current[m.id] || detailsCache.current.get(m.id);

                                        return (
                                            <motion.button
                                                key={m.id}
                                                type="button"
                                                whileHover={{ scale: 1.03 }}
                                                onClick={() => navigateToMove(m.name)}          // ✅ URL por nome
                                                onMouseEnter={() => prefetchMove(m.name)}       // ✅ prefetch por nome
                                                onFocus={() => prefetchMove(m.name)}            // ✅ acessibilidade
                                                className="flex flex-col items-stretch justify-start rounded-md bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.1)] border border-neutral-200 transition-shadow duration-200 text-left"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <motion.div
                                                        className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                                                        initial={{ scaleY: 0.3, opacity: 0 }}
                                                        animate={{ scaleY: 1, opacity: 1 }}
                                                        transition={{ delay: 0.2, duration: 0.35 }}
                                                    />
                                                    <h3 className="text-lg font-semibold text-neutral-600 capitalize">
                                                        {formatName(m.name)}
                                                    </h3>
                                                </div>

                                                {d?.type ? (
                                                    <span
                                                        className={`
                              self-start w-fit inline-flex
                              px-3 py-1 text-xs rounded-md font-medium capitalize
                              ${getTypeClass(d.type)}
                            `}
                                                    >
                                                        {TYPE_LABELS_PT[d.type] || d.type}
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-500">Carregando tipo...</span>
                                                )}

                                                {d ? (
                                                    <div className="mt-2 text-sm text-neutral-600 space-y-1">
                                                        <div>Classe: {d.damageClass || "—"}</div>
                                                        <div>Power: {d.power ?? "-"}</div>
                                                        <div>Accuracy: {d.accuracy ?? "-"}</div>
                                                        <div>PP: {d.pp ?? "-"}</div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 text-[11px] text-slate-500">Carregando detalhes...</div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-center mt-6">
                                    {(advancedApplied && hasAnyAdvancedFilter ? advancedHasMore : visibleCount < baseList.length) && (
                                        <button
                                            type="button"
                                            onClick={handleLoadMore}
                                            disabled={advancedLoading}
                                            className="bg-[#E3350D] text-white px-6 py-2 rounded-md hover:bg-[#c52c0b] disabled:opacity-70"
                                        >
                                            {advancedLoading ? "Carregando..." : "Carregar mais movimentos"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 text-center text-white/80">
                                Nenhuma move encontrada com os filtros atuais.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
