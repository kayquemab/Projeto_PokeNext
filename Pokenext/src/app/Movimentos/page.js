"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ChevronDown,
    ChevronUp,
    BrushCleaning,
} from "lucide-react";

/* =========================
   TIPOS (mesmo padrão)
========================= */
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

/* =========================
   COMPONENTE
========================= */
export default function MovimentosPage() {
    const [search, setSearch] = useState("");
    const [allMoves, setAllMoves] = useState([]);
    const [moveDetails, setMoveDetails] = useState({});
    const [visibleCount, setVisibleCount] = useState(20);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [advancedOpen, setAdvancedOpen] = useState(false);

    // filtros
    const [typeFilter, setTypeFilter] = useState("all");
    const [damageClass, setDamageClass] = useState("all");
    const [minPower, setMinPower] = useState("");
    const [minAccuracy, setMinAccuracy] = useState("");

    const detailsCache = useRef(new Map());

    /* =========================
       LOAD LISTA BASE
    ========================= */
    useEffect(() => {
        let alive = true;

        async function loadMoves() {
            try {
                setLoading(true);
                const res = await fetch("https://pokeapi.co/api/v2/move?limit=1000");
                const data = await res.json();
                if (!alive) return;

                setAllMoves(
                    data.results.map((m) => ({
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
        return () => (alive = false);
    }, []);

    /* =========================
       LOAD DETALHES VISÍVEIS
    ========================= */
    useEffect(() => {
        const visible = filteredList.slice(0, visibleCount);
        const missing = visible.filter((m) => !moveDetails[m.id]);

        if (!missing.length) return;

        async function loadDetails() {
            const responses = await Promise.all(
                missing.map((m) => fetch(m.url).then((r) => r.json()))
            );

            setMoveDetails((prev) => {
                const next = { ...prev };
                responses.forEach((d) => {
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
        }

        loadDetails();
    }, [visibleCount, allMoves]); // eslint-disable-line

    /* =========================
       FILTRAGEM
    ========================= */
    const filteredList = useMemo(() => {
        return allMoves.filter((m) => {
            if (search && !m.name.includes(search.toLowerCase())) return false;

            const d = moveDetails[m.id];
            if (!d) return true;

            if (typeFilter !== "all" && d.type !== typeFilter) return false;
            if (damageClass !== "all" && d.damageClass !== damageClass) return false;
            if (minPower && (d.power || 0) < Number(minPower)) return false;
            if (minAccuracy && (d.accuracy || 0) < Number(minAccuracy)) return false;

            return true;
        });
    }, [allMoves, moveDetails, search, typeFilter, damageClass, minPower, minAccuracy]);

    function clearFilters() {
        setSearch("");
        setTypeFilter("all");
        setDamageClass("all");
        setMinPower("");
        setMinAccuracy("");
        setVisibleCount(20);
    }

    /* =========================
       RENDER
    ========================= */
    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-neutral-700 ml-5 sm:ml-10">
                Movimentos
            </h1>

            <section className="mt-6 px-4 max-w-6xl mx-auto">
                {/* CARD PRINCIPAL */}
                <motion.div
                    className={`
            bg-[url('/wallpaper-preto.png')] bg-cover bg-center
            rounded-2xl shadow-md p-6
          `}
                >
                    <label className="block text-white text-lg mb-2">
                        Buscar movimento
                    </label>

                    <div className="flex gap-3 mb-3">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-white px-4 py-2 rounded-md"
                            placeholder="Ex: thunderbolt"
                        />

                        <button
                            onClick={clearFilters}
                            className="px-4 rounded-md bg-white/15 text-white"
                        >
                            <BrushCleaning />
                        </button>
                    </div>

                    <button
                        onClick={() => setAdvancedOpen((v) => !v)}
                        className="flex items-center gap-2 text-white/80 mt-2"
                    >
                        Busca avançada
                        {advancedOpen ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </motion.div>

                {/* ADVANCED */}
                <AnimatePresence>
                    {advancedOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-[#616161] p-4 rounded-b-xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="bg-neutral-700 text-white p-2 rounded"
                                >
                                    <option value="all">Todos os tipos</option>
                                    {Object.keys(TYPE_STYLES).map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>

                                <select
                                    value={damageClass}
                                    onChange={(e) => setDamageClass(e.target.value)}
                                    className="bg-neutral-700 text-white p-2 rounded"
                                >
                                    <option value="all">Todas classes</option>
                                    <option value="physical">Physical</option>
                                    <option value="special">Special</option>
                                    <option value="status">Status</option>
                                </select>

                                <input
                                    type="number"
                                    placeholder="Power mínimo"
                                    value={minPower}
                                    onChange={(e) => setMinPower(e.target.value)}
                                    className="bg-white p-2 rounded"
                                />

                                <input
                                    type="number"
                                    placeholder="Accuracy mínima"
                                    value={minAccuracy}
                                    onChange={(e) => setMinAccuracy(e.target.value)}
                                    className="bg-white p-2 rounded"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* GRID */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredList.slice(0, visibleCount).map((m) => {
                        const d = moveDetails[m.id];

                        return (
                            <motion.div
                                key={m.id}
                                whileHover={{ scale: 1.03 }}
                                className="bg-white rounded-md p-4 shadow border"
                            >
                                <h3 className="font-semibold text-neutral-700 mb-2">
                                    {formatName(m.name)}
                                </h3>

                                {d ? (
                                    <>
                                        <span className={`inline-block px-3 py-1 text-xs rounded ${getTypeClass(d.type)}`}>
                                            {d.type}
                                        </span>

                                        <div className="mt-2 text-sm text-neutral-600 space-y-1">
                                            <div>Classe: {d.damageClass}</div>
                                            <div>Power: {d.power ?? "-"}</div>
                                            <div>Accuracy: {d.accuracy ?? "-"}</div>
                                            <div>PP: {d.pp}</div>
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-xs text-neutral-400">
                                        Carregando...
                                    </span>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {visibleCount < filteredList.length && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setVisibleCount((v) => v + 20)}
                            className="bg-[#E3350D] text-white px-6 py-2 rounded-md"
                        >
                            Carregar mais movimentos
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
