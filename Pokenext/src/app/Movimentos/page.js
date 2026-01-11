"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ChevronDown,
    ChevronUp,
    BrushCleaning,
    Check,
} from "lucide-react";

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

export default function MovimentosPage() {
    const [search, setSearch] = useState("");
    const [allMoves, setAllMoves] = useState([]);
    const [moveDetails, setMoveDetails] = useState({});
    const [visibleCount, setVisibleCount] = useState(20);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [advancedLoading, setAdvancedLoading] = useState(false);
    const [advancedOpen, setAdvancedOpen] = useState(false);

    // filtros
    const [typeFilter, setTypeFilter] = useState("all");
    const [damageClass, setDamageClass] = useState("all");
    const [minPower, setMinPower] = useState("");
    const [minPP, setMinPP] = useState("");

    const [minAccuracy, setMinAccuracy] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);

    const [typeMode, setTypeMode] = useState(() =>
        Object.fromEntries(ALL_TYPES.map(t => [t, null]))
    );

    const detailsCache = useRef(new Map());

    function toggleTypeMode(type, mode) {
        setTypeMode(prev => {
            const current = prev[type];
            return {
                ...prev,
                [type]: current === mode ? null : mode,
            };
        });
    }

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
    }


    const filteredList = useMemo(() => {
        const q = search.trim().toLowerCase();

        return allMoves.filter((m) => {
            // busca por nome ou número
            if (q) {
                const byName = m.name.includes(q);
                const byId = String(m.id).includes(q);
                if (!byName && !byId) return false;
            }

            const d = moveDetails[m.id];
            if (!d) return true;

            if (typeFilter !== "all" && d.type !== typeFilter) return false;
            if (damageClass !== "all" && d.damageClass !== damageClass) return false;
            if (minPower && (d.power || 0) < Number(minPower)) return false;
            if (minAccuracy && (d.accuracy || 0) < Number(minAccuracy)) return false;

            return true;
        });
    }, [allMoves, moveDetails, search, typeFilter, damageClass, minPower, minAccuracy]);

    const visibleMoves = useMemo(
        () => filteredList.slice(0, visibleCount),
        [filteredList, visibleCount]
    );

    useEffect(() => {
        const missing = visibleMoves.filter(
            (m) => !moveDetails[m.id] && !detailsCache.current.has(m.id)
        );
        if (!missing.length) return;

        let alive = true;

        async function loadDetails() {
            try {
                const responses = await Promise.all(
                    missing.map((m) => fetch(m.url).then((r) => r.json()))
                );
                if (!alive) return;

                setMoveDetails((prev) => {
                    const next = { ...prev };
                    responses.forEach((d) => {
                        detailsCache.current.set(d.id, d);
                        next[d.id] = {
                            type: d.type?.name,
                            power: d.power,
                            accuracy: d.accuracy,
                            pp: d.pp,
                            damageClass: d.damage_class?.name,
                        };
                    });
                    return next;
                });
            } catch (e) {
                console.error(e);
            }
        }

        loadDetails();
        return () => {
            alive = false;
        };
    }, [visibleMoves, moveDetails]);

    function applySimpleSearch() {
        setVisibleCount(20);
        setShowSuggestions(false);
    }

    function clearAllFilters() {
        setSearch("");
        setTypeFilter("all");
        setDamageClass("all");
        setMinPower("");
        setMinAccuracy("");
        setVisibleCount(20);
    }

    function resetAdvanced() {
        setTypeFilter("all");
        setDamageClass("all");
        setMinPower("");
        setMinAccuracy("");
        setVisibleCount(20);
    }

    function applyAdvancedFilters() {
        setVisibleCount(20);
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
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                setShowSuggestions(true);
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
                                    Use a busca avançada para filtrar movimentos por tipo, classe de dano e
                                    valores mínimos!
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

                                                {/* ESQUERDA: Tipo / Fraqueza */}
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
                                                                        {TYPE_LABELS_PT[t] || formatName(t)}
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

                                                    <div className="mt-2">

                                                    </div>
                                                </div>

                                                {/* DIREITA: Classe + Power + Accuracy */}
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

                                                    <div >
                                                        <div>
                                                            <div className="mb-5">
                                                                <h3 className="text-white text-lg font-semibold mb-2">
                                                                    Power
                                                                </h3>

                                                                <input
                                                                    type="number"
                                                                    value={minPower}
                                                                    onChange={(e) => setMinPower(e.target.value)}
                                                                    className="w-40 bg-white text-neutral-900 px-3 py-2 rounded-md border border-white/10 focus:outline-none"
                                                                />

                                                                <div className="mt-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setHeightGroup("all")}
                                                                        className="text-xs text-white/70 hover:text-white underline"
                                                                    >
                                                                        Limpar Power
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="mb-5">
                                                                <h3 className="text-white text-lg font-semibold mb-2">
                                                                    Accuracy
                                                                </h3>

                                                                <input
                                                                    type="number"
                                                                    value={minPower}
                                                                    onChange={(e) => setMinPower(e.target.value)}
                                                                    className="w-40 bg-white text-neutral-900 px-3 py-2 rounded-md border border-white/10 focus:outline-none"
                                                                />

                                                                <div className="mt-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setHeightGroup("all")}
                                                                        className="text-xs text-white/70 hover:text-white underline"
                                                                    >
                                                                        Limpar Accuracy
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="mb-5">
                                                                <h3 className="text-white text-lg font-semibold mb-2">
                                                                    PP
                                                                </h3>

                                                                <input
                                                                    type="number"
                                                                    value={minPower}
                                                                    onChange={(e) => setMinPower(e.target.value)}
                                                                    className="w-40 bg-white text-neutral-900 px-3 py-2 rounded-md border border-white/10 focus:outline-none"
                                                                />

                                                                <div className="mt-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setHeightGroup("all")}
                                                                        className="text-xs text-white/70 hover:text-white underline"
                                                                    >
                                                                        Limpar PP
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>


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


                        {/* GRID DE MOVES */}
                        {visibleMoves.length > 0 ? (
                            <div className="mt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {visibleMoves.map((m) => {
                                        const d = moveDetails[m.id];

                                        return (
                                            <motion.button
                                                key={m.id}
                                                whileHover={{ scale: 1.03 }}
                                                onClick={() => navigateToMove(m.id)}
                                                className="flex flex-col items-stretch justify-start rounded-md bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.1)] border border-neutral-200 transition-shadow duration-200 text-left"
                                            >
                                                {/* Nome + Número */}
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


                                                {/* Tipo */}
                                                {d?.type ? (
                                                    <span
                                                        className={`inline-block px-3 py-1 text-xs rounded-md font-medium capitalize ${getTypeClass(
                                                            d.type
                                                        )}`}
                                                    >
                                                        {TYPE_LABELS_PT[d.type] || d.type}
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-500">Carregando tipo...</span>
                                                )}

                                                {/* Detalhes da move */}
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

                                {/* Botão carregar mais */}
                                <div className="flex justify-center mt-6">
                                    {visibleCount < allMoves.length && (
                                        <button
                                            onClick={() => setVisibleCount((v) => v + 15)}
                                            className="bg-[#E3350D] text-white px-6 py-2 rounded-md hover:bg-[#c52c0b]"
                                        >
                                            Carregar mais movimentos
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
