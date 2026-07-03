"use client";

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, BrushCleaning } from "lucide-react";
import { useRouter } from "next/navigation";

const TYPE_CACHE_KEY = "poke_type_weaknesses_v1";

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

const ALL_TYPES = Object.keys(TYPE_STYLES).filter((type) => type !== "default");

function getTypeClass(type) {
    return TYPE_STYLES[type] || TYPE_STYLES.default;
}

function formatName(name) {
    return String(name || "")
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
    return Object.fromEntries(ALL_TYPES.map((type) => [type, null]));
}

function isWeaknessMapReady(map) {
    return map && Object.keys(map).length > 0;
}

function buildWeaknessAllowedTypes(selectedWeaknessTargets, weaknessMap) {
    const allowedTypes = new Set();

    selectedWeaknessTargets.forEach((targetType) => {
        const weaknesses = weaknessMap[targetType] || [];

        weaknesses.forEach((attackType) => {
            allowedTypes.add(attackType);
        });
    });

    return allowedTypes;
}

export default function MovimentosPage() {
    const router = useRouter();

    const PREFETCH_INITIAL = 250;
    const PREFETCH_CONCURRENCY = 10;
    const PREFETCH_FLUSH_MS = 120;

    const SCAN_BATCH = 60;
    const SCAN_PARALLEL_FETCH = 18;

    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);

    const [allMoves, setAllMoves] = useState([]);
    const [moveDetails, setMoveDetails] = useState({});
    const moveDetailsRef = useRef(moveDetails);

    const [visibleCount, setVisibleCount] = useState(20);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [advancedLoading, setAdvancedLoading] = useState(false);

    const [damageClass, setDamageClass] = useState("all");
    const [minPower, setMinPower] = useState("");
    const [minAccuracy, setMinAccuracy] = useState("");
    const [minPP, setMinPP] = useState("");

    const [typeMode, setTypeMode] = useState(createEmptyTypeMode);

    const [typeWeaknesses, setTypeWeaknesses] = useState({});
    const [typeWeaknessesLoading, setTypeWeaknessesLoading] = useState(false);
    const typeWeaknessesPromiseRef = useRef(null);

    const [advancedApplied, setAdvancedApplied] = useState(false);
    const [advancedMatches, setAdvancedMatches] = useState([]);
    const [advancedCursor, setAdvancedCursor] = useState(0);
    const [advancedHasMore, setAdvancedHasMore] = useState(false);

    const advancedAppliedRef = useRef(false);
    const advancedMatchesRef = useRef([]);
    const advancedCursorRef = useRef(0);
    const advancedFilterSnapshotRef = useRef(null);

    const detailsCache = useRef(new Map());
    const inFlight = useRef(new Map());
    const runIdRef = useRef(0);

    const pendingDetailsRef = useRef({});
    const flushTimerRef = useRef(null);

    const searchBoxRef = useRef(null);

    useEffect(() => {
        moveDetailsRef.current = moveDetails;
    }, [moveDetails]);

    useEffect(() => {
        advancedAppliedRef.current = advancedApplied;
    }, [advancedApplied]);

    useEffect(() => {
        advancedMatchesRef.current = advancedMatches;
    }, [advancedMatches]);

    useEffect(() => {
        advancedCursorRef.current = advancedCursor;
    }, [advancedCursor]);

    useEffect(() => {
        return () => {
            if (flushTimerRef.current) {
                clearTimeout(flushTimerRef.current);
            }
        };
    }, []);

    const queueDetailToState = useCallback(
        (id, detail) => {
            pendingDetailsRef.current[id] = detail;

            if (flushTimerRef.current) return;

            flushTimerRef.current = setTimeout(() => {
                const payload = pendingDetailsRef.current;

                pendingDetailsRef.current = {};
                flushTimerRef.current = null;

                setMoveDetails((currentDetails) => ({
                    ...currentDetails,
                    ...payload,
                }));
            }, PREFETCH_FLUSH_MS);
        },
        [PREFETCH_FLUSH_MS]
    );

    function navigateToMove(slug) {
        router.push(`/Movimentos/${slug}`);
    }

    function prefetchMove(slug) {
        try {
            router.prefetch?.(`/Movimentos/${slug}`);
        } catch {}
    }

    function resetAdvancedResults() {
        setAdvancedApplied(false);
        setAdvancedMatches([]);
        setAdvancedCursor(0);
        setAdvancedHasMore(false);
        advancedFilterSnapshotRef.current = null;
    }

    function toggleTypeModeLocal(type, mode) {
        if (mode === "weakness" && !isWeaknessMapReady(typeWeaknesses)) {
            ensureTypeWeaknesses();
        }

        setTypeMode((currentTypeMode) => {
            const currentMode = currentTypeMode[type];
            const nextMode = currentMode === mode ? null : mode;

            return {
                ...currentTypeMode,
                [type]: nextMode,
            };
        });
    }

    const selectedTypeIncludes = useMemo(() => {
        return Object.keys(typeMode).filter((type) => typeMode[type] === "type");
    }, [typeMode]);

    const selectedWeaknessTargets = useMemo(() => {
        return Object.keys(typeMode).filter(
            (type) => typeMode[type] === "weakness"
        );
    }, [typeMode]);

    const hasAnyAdvancedFilter = useMemo(() => {
        return (
            damageClass !== "all" ||
            Boolean(minPower) ||
            Boolean(minAccuracy) ||
            Boolean(minPP) ||
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

    async function loadTypeWeaknessesFromApi() {
        try {
            const cachedRaw = window.localStorage.getItem(TYPE_CACHE_KEY);

            if (cachedRaw) {
                const parsedCache = JSON.parse(cachedRaw);
                const isFresh =
                    parsedCache?.ts &&
                    Date.now() - parsedCache.ts < 24 * 60 * 60 * 1000;

                if (
                    isFresh &&
                    parsedCache?.data &&
                    isWeaknessMapReady(parsedCache.data)
                ) {
                    setTypeWeaknesses(parsedCache.data);
                    return parsedCache.data;
                }
            }
        } catch {}

        const listResponse = await fetch(
            "https://pokeapi.co/api/v2/type?limit=1000"
        );
        const listData = await listResponse.json();

        const types = (listData.results || [])
            .map((type) => type.name)
            .filter((name) => name !== "unknown" && name !== "shadow");

        const concurrency = 6;
        const output = {};
        let index = 0;

        async function worker() {
            while (index < types.length) {
                const currentIndex = index;
                index += 1;

                const typeName = types[currentIndex];

                try {
                    const response = await fetch(
                        `https://pokeapi.co/api/v2/type/${typeName}`
                    );
                    const data = await response.json();

                    output[typeName] = (
                        data.damage_relations?.double_damage_from || []
                    ).map((type) => type.name);
                } catch {
                    output[typeName] = [];
                }
            }
        }

        await Promise.all(Array.from({ length: concurrency }, () => worker()));

        try {
            window.localStorage.setItem(
                TYPE_CACHE_KEY,
                JSON.stringify({ ts: Date.now(), data: output })
            );
        } catch {}

        setTypeWeaknesses(output);
        return output;
    }

    async function ensureTypeWeaknesses() {
        if (isWeaknessMapReady(typeWeaknesses)) {
            return typeWeaknesses;
        }

        if (typeWeaknessesPromiseRef.current) {
            return typeWeaknessesPromiseRef.current;
        }

        setTypeWeaknessesLoading(true);

        const promise = loadTypeWeaknessesFromApi()
            .catch(() => {
                setTypeWeaknesses([]);
                return {};
            })
            .finally(() => {
                typeWeaknessesPromiseRef.current = null;
                setTypeWeaknessesLoading(false);
            });

        typeWeaknessesPromiseRef.current = promise;

        return promise;
    }

    const getMoveDetail = useCallback(
        async (move) => {
            const id = move.id;
            const currentDetails = moveDetailsRef.current;

            if (currentDetails[id]) return currentDetails[id];
            if (detailsCache.current.has(id)) return detailsCache.current.get(id);
            if (inFlight.current.has(id)) return inFlight.current.get(id);

            const promise = fetch(move.url)
                .then((response) => response.json())
                .then((data) => {
                    const simplified = {
                        type: data.type?.name,
                        power: data.power,
                        accuracy: data.accuracy,
                        pp: data.pp,
                        damageClass: data.damage_class?.name,
                    };

                    detailsCache.current.set(id, simplified);
                    queueDetailToState(id, simplified);

                    return simplified;
                })
                .catch(() => null)
                .finally(() => {
                    inFlight.current.delete(id);
                });

            inFlight.current.set(id, promise);

            return promise;
        },
        [queueDetailToState]
    );

    function createFilterSnapshot(weaknessMap = typeWeaknesses) {
        return {
            selectedTypeIncludes,
            selectedWeaknessTargets,
            weaknessAllowedTypes: buildWeaknessAllowedTypes(
                selectedWeaknessTargets,
                weaknessMap
            ),
            damageClass,
            minPower,
            minAccuracy,
            minPP,
        };
    }

    function matchesAdvanced(detail, filterSnapshot) {
        if (!detail) return false;

        if (filterSnapshot.selectedTypeIncludes.length > 0) {
            if (
                !detail.type ||
                !filterSnapshot.selectedTypeIncludes.includes(detail.type)
            ) {
                return false;
            }
        }

        if (filterSnapshot.selectedWeaknessTargets.length > 0) {
            if (
                !detail.type ||
                !filterSnapshot.weaknessAllowedTypes.has(detail.type)
            ) {
                return false;
            }
        }

        if (
            filterSnapshot.damageClass !== "all" &&
            detail.damageClass !== filterSnapshot.damageClass
        ) {
            return false;
        }

        if (filterSnapshot.minPower) {
            const power = detail.power ?? 0;

            if (power < Number(filterSnapshot.minPower)) return false;
        }

        if (filterSnapshot.minAccuracy) {
            const accuracy = detail.accuracy ?? 0;

            if (accuracy < Number(filterSnapshot.minAccuracy)) return false;
        }

        if (filterSnapshot.minPP) {
            const pp = detail.pp ?? 0;

            if (pp < Number(filterSnapshot.minPP)) return false;
        }

        return true;
    }

    useEffect(() => {
        let alive = true;

        async function loadMoves() {
            try {
                setError("");
                setLoading(true);

                const response = await fetch(
                    "https://pokeapi.co/api/v2/move?limit=1000"
                );
                const data = await response.json();

                if (!alive) return;

                setAllMoves(
                    (data.results || []).map((move) => ({
                        name: move.name,
                        id: getIdFromUrl(move.url),
                        url: move.url,
                    }))
                );
            } catch (loadError) {
                console.error(loadError);

                if (alive) {
                    setError("Erro ao carregar movimentos.");
                }
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        }

        loadMoves();

        return () => {
            alive = false;
        };
    }, []);

    const prefetchStartedRef = useRef(false);

    useEffect(() => {
        if (!allMoves.length) return;
        if (prefetchStartedRef.current) return;

        prefetchStartedRef.current = true;

        function idle(callback) {
            if (
                typeof window !== "undefined" &&
                "requestIdleCallback" in window
            ) {
                return window.requestIdleCallback(callback, { timeout: 800 });
            }

            return setTimeout(callback, 200);
        }

        const queue = allMoves.slice(0, PREFETCH_INITIAL);
        let index = 0;
        let stopped = false;

        async function worker() {
            while (!stopped) {
                const currentIndex = index;
                index += 1;

                if (currentIndex >= queue.length) return;

                const move = queue[currentIndex];
                const currentDetails = moveDetailsRef.current;

                if (detailsCache.current.has(move.id) || currentDetails[move.id]) {
                    continue;
                }

                await getMoveDetail(move);
            }
        }

        idle(() => {
            const workers = Array.from(
                { length: PREFETCH_CONCURRENCY },
                () => worker()
            );

            Promise.allSettled(workers).catch(() => {});
        });

        return () => {
            stopped = true;
        };
    }, [allMoves, getMoveDetail, PREFETCH_INITIAL, PREFETCH_CONCURRENCY]);

    const suggestions = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return [];

        const isNumeric = /^\d+$/.test(query);

        const byName = allMoves
            .filter((move) => move.name.includes(query))
            .slice(0, 8)
            .map((move) => move.name);

        if (!isNumeric) return byName;

        const byId = allMoves
            .filter((move) => String(move.id).includes(query))
            .slice(0, 8)
            .map((move) => move.name);

        return Array.from(new Set([...byId, ...byName])).slice(0, 8);
    }, [search, allMoves]);

    function pickSuggestion(name) {
        setSearch(name);
        setVisibleCount(20);
        setShowSuggestions(false);
        resetAdvancedResults();
    }

    useEffect(() => {
        function handleDocumentMouseDown(event) {
            if (!searchBoxRef.current) return;

            if (!searchBoxRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener("mousedown", handleDocumentMouseDown);

        return () => {
            document.removeEventListener("mousedown", handleDocumentMouseDown);
        };
    }, []);

    const basicFiltered = useMemo(() => {
        const query = search.trim().toLowerCase();

        return allMoves.filter((move) => {
            if (!query) return true;

            const byName = move.name.includes(query);
            const byId = String(move.id).includes(query);

            return byName || byId;
        });
    }, [allMoves, search]);

    const baseList = useMemo(() => {
        if (advancedApplied && hasAnyAdvancedFilter) {
            return advancedMatches;
        }

        return basicFiltered;
    }, [advancedApplied, hasAnyAdvancedFilter, advancedMatches, basicFiltered]);

    const visibleMoves = useMemo(() => {
        return baseList.slice(0, visibleCount);
    }, [baseList, visibleCount]);

    useEffect(() => {
        let alive = true;

        async function preloadVisibleDetails() {
            const movesToLoad = visibleMoves.filter((move) => {
                return (
                    !moveDetailsRef.current[move.id] &&
                    !detailsCache.current.has(move.id)
                );
            });

            if (!movesToLoad.length) return;

            const slice = movesToLoad.slice(0, 24);

            await Promise.all(slice.map((move) => getMoveDetail(move)));

            if (!alive) return;
        }

        preloadVisibleDetails();

        return () => {
            alive = false;
        };
    }, [visibleMoves, getMoveDetail]);

    function applySimpleSearch() {
        setVisibleCount(20);
        setShowSuggestions(false);
        resetAdvancedResults();
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
        setError("");

        resetAdvancedResults();
    }

    function resetAdvanced() {
        setDamageClass("all");
        setMinPower("");
        setMinAccuracy("");
        setMinPP("");
        setTypeMode(createEmptyTypeMode());
        setVisibleCount(20);
        setError("");

        resetAdvancedResults();
    }

    function fastScanFromCache(list, needCount, filterSnapshot) {
        const matches = [];
        let cursor = 0;

        while (matches.length < needCount && cursor < list.length) {
            const move = list[cursor];
            cursor += 1;

            const detail =
                detailsCache.current.get(move.id) || moveDetailsRef.current[move.id];

            if (!detail) continue;

            if (matchesAdvanced(detail, filterSnapshot)) {
                matches.push(move);
            }
        }

        return { matches, cursor };
    }

    async function scanAdvancedToTarget({
        targetCount,
        runId,
        startCursor,
        startMatches,
        filterSnapshot,
    }) {
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

            for (let index = 0; index < batch.length; index += 1) {
                const move = batch[index];
                const cachedDetail =
                    detailsCache.current.get(move.id) ||
                    moveDetailsRef.current[move.id];

                if (cachedDetail) {
                    details[index] = cachedDetail;
                } else {
                    needFetch.push({ move, index });
                }
            }

            if (needFetch.length) {
                for (
                    let index = 0;
                    index < needFetch.length;
                    index += SCAN_PARALLEL_FETCH
                ) {
                    if (runIdRef.current !== runId) return;

                    const group = needFetch.slice(index, index + SCAN_PARALLEL_FETCH);
                    const fetched = await Promise.all(
                        group.map((item) => getMoveDetail(item.move))
                    );

                    for (let itemIndex = 0; itemIndex < group.length; itemIndex += 1) {
                        details[group[itemIndex].index] = fetched[itemIndex];
                    }
                }
            }

            for (let index = 0; index < batch.length; index += 1) {
                if (matchesAdvanced(details[index], filterSnapshot)) {
                    matches.push(batch[index]);
                }
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
            resetAdvancedResults();
            return;
        }

        let weaknessMap = typeWeaknesses;

        if (selectedWeaknessTargets.length > 0) {
            weaknessMap = await ensureTypeWeaknesses();
        }

        const filterSnapshot = createFilterSnapshot(weaknessMap);
        advancedFilterSnapshotRef.current = filterSnapshot;

        const runId = runIdRef.current + 1;
        runIdRef.current = runId;

        setAdvancedLoading(true);
        setAdvancedApplied(true);
        setAdvancedMatches([]);
        setAdvancedCursor(0);
        setAdvancedHasMore(true);

        try {
            const { matches, cursor } = fastScanFromCache(
                basicFiltered,
                20,
                filterSnapshot
            );

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
                    filterSnapshot,
                });
            }
        } finally {
            if (runIdRef.current === runId) {
                setAdvancedLoading(false);
            }
        }
    }

    async function handleLoadMore() {
        const nextVisibleCount = visibleCount + 15;

        setVisibleCount(nextVisibleCount);

        if (advancedAppliedRef.current && hasAnyAdvancedFilter) {
            if (
                !advancedHasMore &&
                advancedMatchesRef.current.length >= nextVisibleCount
            ) {
                return;
            }

            let filterSnapshot = advancedFilterSnapshotRef.current;

            if (!filterSnapshot) {
                let weaknessMap = typeWeaknesses;

                if (selectedWeaknessTargets.length > 0) {
                    weaknessMap = await ensureTypeWeaknesses();
                }

                filterSnapshot = createFilterSnapshot(weaknessMap);
                advancedFilterSnapshotRef.current = filterSnapshot;
            }

            const runId = runIdRef.current;

            setAdvancedLoading(true);

            try {
                await scanAdvancedToTarget({
                    targetCount: nextVisibleCount,
                    runId,
                    startCursor: advancedCursorRef.current,
                    startMatches: advancedMatchesRef.current,
                    filterSnapshot,
                });
            } finally {
                if (runIdRef.current === runId) {
                    setAdvancedLoading(false);
                }
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
                <section className="mb-10 mt-6 w-full px-3 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-6xl">
                        <motion.div
                            className={`
                                relative z-20
                                mx-auto w-full
                                bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat
                                px-5 py-5 shadow-md backdrop-blur-sm
                                sm:px-8 md:px-10 lg:px-12 xl:px-16
                                ${
                                    advancedOpen
                                        ? "rounded-t-2xl rounded-b-none"
                                        : "rounded-2xl"
                                }
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
                                        Buscar Movimento
                                    </label>
                                </div>

                                <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                                    <div
                                        className="relative w-full sm:w-auto"
                                        ref={searchBoxRef}
                                    >
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(event) => {
                                                setSearch(event.target.value);
                                                setVisibleCount(20);
                                                setShowSuggestions(true);
                                                resetAdvancedResults();
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    applySimpleSearch();
                                                }
                                            }}
                                            placeholder="Ex: thunderbolt ou 85"
                                            className="
                                                w-full rounded-md border border-neutral-200 bg-neutral-50
                                                px-4 py-2 text-gray-900
                                                outline-none transition
                                                placeholder:text-neutral-400
                                                focus:ring-2 focus:ring-[#E3350D]/70
                                                sm:w-80 md:w-96 lg:w-md
                                            "
                                        />

                                        {showSuggestions && suggestions.length > 0 && (
                                            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
                                                {suggestions.map((name) => (
                                                    <button
                                                        key={name}
                                                        type="button"
                                                        onClick={() => pickSuggestion(name)}
                                                        className="w-full cursor-pointer px-4 py-2 text-left text-sm capitalize transition hover:bg-neutral-100"
                                                    >
                                                        {formatName(name)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={applySimpleSearch}
                                            className="flex h-[42px] cursor-pointer items-center justify-center rounded-md bg-[#E3350D] px-4 text-white transition hover:bg-[#c52c0b]"
                                            aria-label="Buscar"
                                            title="Buscar"
                                        >
                                            <Search className="h-5 w-5" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={clearAllFilters}
                                            className="flex h-[42px] cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/15 px-4 text-white transition hover:bg-white/20"
                                            aria-label="Limpar filtros"
                                            title="Limpar filtros"
                                        >
                                            <BrushCleaning className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <p className="mt-3 text-sm text-white sm:text-base">
                                    Use a busca avançada para filtrar movimentos por
                                    tipo, classe de dano e valores mínimos.
                                </p>

                                {loading && (
                                    <p className="mt-2 text-sm text-white/80">
                                        Carregando lista de movimentos...
                                    </p>
                                )}

                                {error && (
                                    <p className="mt-2 text-sm text-red-200">
                                        {error}
                                    </p>
                                )}
                            </div>
                        </motion.div>

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
                                        <div className="rounded-b-[3px] bg-[#616161] p-4">
                                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                                                <div className="lg:col-span-7">
                                                    <div className="mb-3 flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-white">
                                                                Tipo e Fraqueza
                                                            </h3>

                                                            {typeWeaknessesLoading && (
                                                                <p className="mt-1 text-xs text-white/70">
                                                                    Carregando relações de
                                                                    fraqueza da PokéAPI...
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="text-xs text-white/70">
                                                            <span className="font-semibold">
                                                                T
                                                            </span>{" "}
                                                            = Tipo{" "}
                                                            <span className="font-semibold">
                                                                F
                                                            </span>{" "}
                                                            = Fraqueza
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        {ALL_TYPES.map((type) => {
                                                            const mode = typeMode[type];
                                                            const isType =
                                                                mode === "type";
                                                            const isWeakness =
                                                                mode === "weakness";

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
                                                                        {TYPE_LABELS_PT[type] ||
                                                                            formatName(type)}
                                                                    </span>

                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                toggleTypeModeLocal(
                                                                                    type,
                                                                                    "type"
                                                                                )
                                                                            }
                                                                            className={`h-7 w-7 cursor-pointer rounded-full border text-xs font-bold transition
                                                                                ${
                                                                                    isType
                                                                                        ? "border-white bg-white text-neutral-900"
                                                                                        : "border-white/40 bg-transparent text-white hover:border-white/80"
                                                                                }
                                                                            `}
                                                                            title="Filtrar por Tipo"
                                                                        >
                                                                            T
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                typeWeaknessesLoading
                                                                            }
                                                                            onClick={() =>
                                                                                toggleTypeModeLocal(
                                                                                    type,
                                                                                    "weakness"
                                                                                )
                                                                            }
                                                                            className={`h-7 w-7 rounded-full border text-xs font-bold transition
                                                                                ${
                                                                                    typeWeaknessesLoading
                                                                                        ? "cursor-not-allowed opacity-50"
                                                                                        : "cursor-pointer"
                                                                                }
                                                                                ${
                                                                                    isWeakness
                                                                                        ? "border-white bg-white text-neutral-900"
                                                                                        : "border-white/40 bg-transparent text-white hover:border-white/80"
                                                                                }
                                                                            `}
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

                                                <div className="lg:col-span-5">
                                                    <div className="mb-5">
                                                        <h3 className="mb-2 text-lg font-semibold text-white">
                                                            Classe de dano
                                                        </h3>

                                                        <div className="relative w-full max-w-[300px]">
                                                            <select
                                                                value={damageClass}
                                                                onChange={(event) =>
                                                                    setDamageClass(
                                                                        event.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full appearance-none rounded-md border border-white/10 bg-neutral-700 px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[#E3350D]/60"
                                                            >
                                                                <option value="all">
                                                                    Todas
                                                                </option>
                                                                <option value="physical">
                                                                    Physical
                                                                </option>
                                                                <option value="special">
                                                                    Special
                                                                </option>
                                                                <option value="status">
                                                                    Status
                                                                </option>
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
                                                            Power mínimo
                                                        </h3>

                                                        <input
                                                            type="number"
                                                            value={minPower}
                                                            onChange={(event) =>
                                                                setMinPower(
                                                                    event.target.value
                                                                )
                                                            }
                                                            className="no-spinner w-40 rounded-md border border-white/10 bg-white px-3 py-2 text-neutral-900 focus:outline-none"
                                                        />

                                                        <div className="mt-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setMinPower("")
                                                                }
                                                                className="cursor-pointer text-xs text-white/70 underline hover:text-white"
                                                            >
                                                                Limpar Power
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mb-5">
                                                        <h3 className="mb-2 text-lg font-semibold text-white">
                                                            Accuracy mínima
                                                        </h3>

                                                        <input
                                                            type="number"
                                                            value={minAccuracy}
                                                            onChange={(event) =>
                                                                setMinAccuracy(
                                                                    event.target.value
                                                                )
                                                            }
                                                            className="no-spinner w-40 rounded-md border border-white/10 bg-white px-3 py-2 text-neutral-900 focus:outline-none"
                                                        />

                                                        <div className="mt-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setMinAccuracy("")
                                                                }
                                                                className="cursor-pointer text-xs text-white/70 underline hover:text-white"
                                                            >
                                                                Limpar Accuracy
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mb-5">
                                                        <h3 className="mb-2 text-lg font-semibold text-white">
                                                            PP mínimo
                                                        </h3>

                                                        <input
                                                            type="number"
                                                            value={minPP}
                                                            onChange={(event) =>
                                                                setMinPP(
                                                                    event.target.value
                                                                )
                                                            }
                                                            className="no-spinner w-40 rounded-md border border-white/10 bg-white px-3 py-2 text-neutral-900 focus:outline-none"
                                                        />

                                                        <div className="mt-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setMinPP("")
                                                                }
                                                                className="cursor-pointer text-xs text-white/70 underline hover:text-white"
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

                                            <div className="mt-4 flex items-center justify-start gap-3 lg:justify-end">
                                                <button
                                                    type="button"
                                                    onClick={resetAdvanced}
                                                    className="cursor-pointer rounded-md border border-white/10 bg-white/20 px-5 py-2 text-white transition hover:bg-white/25"
                                                >
                                                    Redefinir
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={applyAdvancedFilters}
                                                    disabled={advancedLoading}
                                                    className="flex cursor-pointer items-center gap-2 rounded-md bg-[#E3350D] px-5 py-2 text-white transition hover:bg-[#c52c0b] disabled:cursor-not-allowed disabled:opacity-70"
                                                >
                                                    <Search className="h-4 w-4" />
                                                    {advancedLoading
                                                        ? "Pesquisando..."
                                                        : "Pesquisar"}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative z-10 mx-auto flex w-60 justify-center overflow-visible rounded-b-[5px] bg-[#616161]">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setAdvancedOpen((currentValue) => !currentValue)
                                    }
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

                        {visibleMoves.length > 0 ? (
                            <div className="mt-6">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {visibleMoves.map((move) => {
                                        const detail =
                                            moveDetailsRef.current[move.id] ||
                                            detailsCache.current.get(move.id);

                                        return (
                                            <motion.button
                                                key={move.id}
                                                type="button"
                                                whileHover={{ scale: 1.03 }}
                                                onClick={() => navigateToMove(move.name)}
                                                onMouseEnter={() =>
                                                    prefetchMove(move.name)
                                                }
                                                onFocus={() => prefetchMove(move.name)}
                                                className="flex cursor-pointer flex-col items-stretch justify-start rounded-md border border-neutral-200 bg-white p-4 text-left shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition-shadow duration-200 hover:shadow-[0_8px_18px_rgba(0,0,0,0.1)]"
                                            >
                                                <div className="mb-2 flex items-center gap-2">
                                                    <motion.div
                                                        className="h-4 w-1.5 rounded-sm bg-[#E3350D] shadow-[0_0_6px_#E3350D]"
                                                        initial={{
                                                            scaleY: 0.3,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            scaleY: 1,
                                                            opacity: 1,
                                                        }}
                                                        transition={{
                                                            delay: 0.2,
                                                            duration: 0.35,
                                                        }}
                                                    />

                                                    <h3 className="truncate text-lg font-semibold capitalize text-neutral-600">
                                                        {formatName(move.name)}
                                                    </h3>
                                                </div>

                                                {detail?.type ? (
                                                    <span
                                                        className={`
                                                            inline-flex w-fit self-start rounded-md
                                                            px-3 py-1 text-xs font-medium capitalize
                                                            ${getTypeClass(detail.type)}
                                                        `}
                                                    >
                                                        {TYPE_LABELS_PT[detail.type] ||
                                                            detail.type}
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-500">
                                                        Carregando tipo...
                                                    </span>
                                                )}

                                                {detail ? (
                                                    <div className="mt-2 space-y-1 text-sm text-neutral-600">
                                                        <div>
                                                            Classe:{" "}
                                                            {detail.damageClass || "—"}
                                                        </div>
                                                        <div>
                                                            Power: {detail.power ?? "-"}
                                                        </div>
                                                        <div>
                                                            Accuracy:{" "}
                                                            {detail.accuracy ?? "-"}
                                                        </div>
                                                        <div>PP: {detail.pp ?? "-"}</div>
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

                                <div className="mt-6 flex justify-center">
                                    {(advancedApplied && hasAnyAdvancedFilter
                                        ? advancedHasMore
                                        : visibleCount < baseList.length) && (
                                        <button
                                            type="button"
                                            onClick={handleLoadMore}
                                            disabled={advancedLoading}
                                            className="cursor-pointer rounded-md bg-[#E3350D] px-6 py-2 text-white transition hover:bg-[#c52c0b] disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {advancedLoading
                                                ? "Carregando..."
                                                : "Carregar mais movimentos"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : advancedLoading ? (
                            <div className="mt-6 text-center text-neutral-700">
                                Pesquisando movimentos...
                            </div>
                        ) : (
                            <div className="mt-6 text-center text-neutral-700">
                                Nenhum movimento encontrado com os filtros atuais.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}