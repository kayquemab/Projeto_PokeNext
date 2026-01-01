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
   HELPERS
========================= */
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
export default function HabilidadesPage() {
    const [search, setSearch] = useState("");
    const [allAbilities, setAllAbilities] = useState([]);
    const [abilityDetails, setAbilityDetails] = useState({});
    const [visibleCount, setVisibleCount] = useState(20);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [advancedOpen, setAdvancedOpen] = useState(false);

    // filtros
    const [generation, setGeneration] = useState("all");
    const [isMainSeries, setIsMainSeries] = useState("all"); // all | yes | no
    const [minPokemon, setMinPokemon] = useState("");

    const cacheRef = useRef(new Map());

    /* =========================
       LOAD LISTA BASE
    ========================= */
    useEffect(() => {
        let alive = true;

        async function loadAbilities() {
            try {
                setLoading(true);
                const res = await fetch("https://pokeapi.co/api/v2/ability?limit=500");
                const data = await res.json();
                if (!alive) return;

                setAllAbilities(
                    data.results.map((a) => ({
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
        return () => (alive = false);
    }, []);

    /* =========================
       LOAD DETALHES VISÍVEIS
    ========================= */
    useEffect(() => {
        const visible = filteredList.slice(0, visibleCount);
        const missing = visible.filter((a) => !abilityDetails[a.id]);

        if (!missing.length) return;

        async function loadDetails() {
            const responses = await Promise.all(
                missing.map((a) => fetch(a.url).then((r) => r.json()))
            );

            setAbilityDetails((prev) => {
                const next = { ...prev };
                responses.forEach((d) => {
                    next[d.id] = {
                        generation: d.generation?.name,
                        isMainSeries: d.is_main_series,
                        pokemonCount: d.pokemon?.length || 0,
                        effect:
                            d.effect_entries?.find((e) => e.language.name === "en")
                                ?.short_effect || "",
                    };
                });
                return next;
            });
        }

        loadDetails();
    }, [visibleCount, allAbilities]); // eslint-disable-line

    /* =========================
       FILTRAGEM
    ========================= */
    const filteredList = useMemo(() => {
        return allAbilities.filter((a) => {
            if (search && !a.name.includes(search.toLowerCase())) return false;

            const d = abilityDetails[a.id];
            if (!d) return true;

            if (generation !== "all" && d.generation !== generation) return false;

            if (isMainSeries !== "all") {
                if (isMainSeries === "yes" && !d.isMainSeries) return false;
                if (isMainSeries === "no" && d.isMainSeries) return false;
            }

            if (minPokemon && d.pokemonCount < Number(minPokemon)) return false;

            return true;
        });
    }, [allAbilities, abilityDetails, search, generation, isMainSeries, minPokemon]);

    function clearFilters() {
        setSearch("");
        setGeneration("all");
        setIsMainSeries("all");
        setMinPokemon("");
        setVisibleCount(20);
        setError("");
    }

    /* =========================
       RENDER
    ========================= */
    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-normal text-neutral-700 ml-5 sm:ml-10">
                Habilidades
            </h1>

            <section className="mt-6 px-4 max-w-6xl mx-auto">
                {/* CARD PRINCIPAL */}
                <motion.div
                    className="
            bg-[url('/wallpaper-preto.png')] bg-cover bg-center
            rounded-2xl shadow-md p-6
          "
                >
                    <label className="block text-white text-lg mb-2">
                        Buscar habilidade
                    </label>

                    <div className="flex gap-3 mb-3">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-white px-4 py-2 rounded-md"
                            placeholder="Ex: levitate"
                        />

                        <button
                            onClick={clearFilters}
                            className="px-4 rounded-md bg-white/15 text-white"
                            title="Limpar filtros"
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

                    {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
                </motion.div>

                {/* BUSCA AVANÇADA */}
                <AnimatePresence>
                    {advancedOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-[#616161] p-4 rounded-b-xl"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <select
                                    value={generation}
                                    onChange={(e) => setGeneration(e.target.value)}
                                    className="bg-neutral-700 text-white p-2 rounded"
                                >
                                    <option value="all">Todas as gerações</option>
                                    <option value="generation-i">Geração I</option>
                                    <option value="generation-ii">Geração II</option>
                                    <option value="generation-iii">Geração III</option>
                                    <option value="generation-iv">Geração IV</option>
                                    <option value="generation-v">Geração V</option>
                                    <option value="generation-vi">Geração VI</option>
                                    <option value="generation-vii">Geração VII</option>
                                    <option value="generation-viii">Geração VIII</option>
                                    <option value="generation-ix">Geração IX</option>
                                </select>

                                <select
                                    value={isMainSeries}
                                    onChange={(e) => setIsMainSeries(e.target.value)}
                                    className="bg-neutral-700 text-white p-2 rounded"
                                >
                                    <option value="all">Todas (série)</option>
                                    <option value="yes">Somente série principal</option>
                                    <option value="no">Fora da série principal</option>
                                </select>

                                <input
                                    type="number"
                                    placeholder="Pokémon mínimos"
                                    value={minPokemon}
                                    onChange={(e) => setMinPokemon(e.target.value)}
                                    className="bg-white p-2 rounded"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* GRID */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredList.slice(0, visibleCount).map((a) => {
                        const d = abilityDetails[a.id];

                        return (
                            <motion.div
                                key={a.id}
                                whileHover={{ scale: 1.03 }}
                                className="bg-white rounded-md p-4 shadow border"
                            >
                                <h3 className="font-semibold text-neutral-700 mb-2">
                                    {formatName(a.name)}
                                </h3>

                                {d ? (
                                    <div className="text-sm text-neutral-600 space-y-1">
                                        <div>
                                            <strong>Geração:</strong>{" "}
                                            {d.generation?.replace("generation-", "").toUpperCase()}
                                        </div>
                                        <div>
                                            <strong>Série principal:</strong>{" "}
                                            {d.isMainSeries ? "Sim" : "Não"}
                                        </div>
                                        <div>
                                            <strong>Pokémon:</strong> {d.pokemonCount}
                                        </div>

                                        {d.effect && (
                                            <p className="mt-2 text-xs text-neutral-500">
                                                {d.effect}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xs text-neutral-400">
                                        Carregando...
                                    </span>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* LOAD MORE */}
                {visibleCount < filteredList.length && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setVisibleCount((v) => v + 20)}
                            className="bg-[#E3350D] text-white px-6 py-2 rounded-md hover:bg-[#c52c0b]"
                        >
                            Carregar mais habilidades
                        </button>
                    </div>
                )}

                {loading && (
                    <p className="text-center text-neutral-500 mt-6">
                        Carregando habilidades...
                    </p>
                )}
            </section>
        </div>
    );
}
