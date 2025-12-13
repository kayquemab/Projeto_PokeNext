"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

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
    default: "bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:text-white",
};

function getTypeClass(typeName) {
    return TYPE_STYLES[typeName] || TYPE_STYLES.default;
}

function formatPokemonName(name) {
    return name
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export default function PokedexPage() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [loadingList, setLoadingList] = useState(false);
    const [error, setError] = useState("");

    const [allNames, setAllNames] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const [allPokemonList, setAllPokemonList] = useState([]);
    const [visibleCount, setVisibleCount] = useState(15);

    // cache de tipos para os cards do grid
    const [pokemonDetails, setPokemonDetails] = useState({}); // { [id]: { types: [] } }

    useEffect(() => {
        let alive = true;

        async function loadNamesAndPokedex() {
            try {
                setLoadingList(true);
                setError("");

                const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
                const data = await res.json();

                if (!alive) return;

                setAllNames(data.results.map((p) => p.name));

                const formatted = data.results.map((p) => {
                    const id = Number(p.url.split("/")[6]);
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

    // carrega tipos apenas dos cards visíveis (cache)
    useEffect(() => {
        if (!allPokemonList.length) return;

        const visible = allPokemonList.slice(0, visibleCount);
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
    }, [allPokemonList, visibleCount]);

    // sugestões
    useEffect(() => {
        if (search.length >= 3) {
            const query = search.toLowerCase().trim();
            const match = allNames.filter((n) => n.startsWith(query));
            setSuggestions(match.slice(0, 8));
        } else {
            setSuggestions([]);
        }
    }, [search, allNames]);

    function goToPokemon(value) {
        const query = String(value || "").trim().toLowerCase();
        if (!query) return;

        setError("");
        setSuggestions([]);

        // rota: /pokedex/[...]
        router.push(`/pokedex/${query}`);
    }

    function clear() {
        setSearch("");
        setError("");
        setSuggestions([]);
    }

    return (
        <div className="relative w-full">
            <section className="w-full mt-6 px-4 sm:px-6 lg:px-8 mb-10">
                <div className="w-full max-w-6xl mx-auto">
                    <motion.div
                        className="w-full mx-auto rounded-2xl border border-neutral-200 bg-white/95 shadow-md backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-5"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="flex flex-col gap-1.5 mb-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Pokédex
                            </h1>
                            <p className="text-sm sm:text-base text-slate-600">
                                Encontre informações completas sobre qualquer Pokémon.
                            </p>
                        </div>

                        <div className="relative mb-6">
                            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                                <Search className="w-4 h-4" />
                            </span>

                            <input
                                type="text"
                                placeholder="Buscar por nome ou número..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") goToPokemon(search);
                                }}
                                className="w-full bg-neutral-50 text-gray-900 pl-11 pr-4 py-2 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E3350D]/70"
                            />

                            {suggestions.length > 0 && (
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-neutral-200 z-20 overflow-hidden">
                                    {suggestions.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => goToPokemon(name)}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 capitalize"
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                            <button
                                onClick={() => goToPokemon(search)}
                                className="bg-[#E3350D] text-white px-4 py-2 rounded-md hover:bg-[#c52c0b]"
                            >
                                Buscar
                            </button>

                            <button
                                onClick={clear}
                                className="text-[#E3350D] hover:underline text-sm"
                            >
                                Limpar Filtros
                            </button>
                        </div>

                        {loadingList && (
                            <p className="text-sm text-slate-500 mt-2">Carregando...</p>
                        )}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </motion.div>

                    <div className="mt-8" />

                    {allPokemonList.length > 0 && (
                        <div className="mt-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                {allPokemonList.slice(0, visibleCount).map((p) => {
                                    const details = pokemonDetails[p.id];

                                    return (
                                        <motion.button
                                            key={p.id}
                                            whileHover={{ scale: 1.03 }}
                                            onClick={() => goToPokemon(p.name)}
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

                                            <p className="mt-3 text-sm font-semibold text-slate-900 text-center">
                                                #{String(p.id).padStart(3, "0")} —{" "}
                                                <span className="capitalize">
                                                    {formatPokemonName(p.name)}
                                                </span>
                                            </p>

                                            {details?.types ? (
                                                <div className="mt-2 flex flex-wrap justify-center gap-1">
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
                                {visibleCount < allPokemonList.length && (
                                    <button
                                        onClick={() => setVisibleCount((v) => v + 15)}
                                        className="bg-[#E3350D] text-white px-6 py-2 rounded-md hover:bg-[#c52c0b]"
                                    >
                                        Carregar mais Pokémon
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
