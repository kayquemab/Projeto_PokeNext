"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function getTypeClass(type) {
    const map = {
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

    return map[type] || "bg-zinc-600";
}

export default function RegionStarters({ region }) {
    const router = useRouter();
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    const startersByRegion = {
        kanto: [1, 4, 7],
        johto: [152, 155, 158],
        hoenn: [252, 255, 258],
        sinnoh: [387, 390, 393],
        unova: [495, 498, 501],
        kalos: [650, 653, 656],
        alola: [722, 725, 728],
        galar: [810, 813, 816],
        paldea: [906, 909, 912],
    };

    useEffect(() => {
        async function loadStarters() {
            setLoading(true);

            const ids = startersByRegion[region] || [];

            const results = await Promise.all(
                ids.map(id =>
                    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                        .then(r => r.json())
                        .then(p => ({
                            id: p.id,
                            name: p.name,
                            artwork:
                                p.sprites.other["official-artwork"].front_default,
                            types: p.types.map(t => t.type.name),
                        }))
                )
            );

            setPokemons(results);
            setLoading(false);
        }

        loadStarters();
    }, [region]);

    if (loading) {
        return (
            <p className="mt-10 text-center text-zinc-400">
                Carregando iniciais...
            </p>
        );
    }

    const regionName =
        region.charAt(0).toUpperCase() + region.slice(1);

    return (
        <div className="mt-6 px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="mx-auto w-full max-w-6xl rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat shadow-lg">
                <div className="p-6 space-y-6">

                    {/* TÍTULO + PARÁGRAFO (PADRONIZADO) */}
                    <div className="flex flex-col gap-3 mb-6">
                        <div className="flex items-center gap-2">
                            <motion.div
                                className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                                initial={{ scaleY: 0.3, opacity: 0 }}
                                animate={{ scaleY: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.35 }}
                            />

                            <h3 className="text-xl font-extrabold text-black dark:text-white">
                                Pokémons Iniciais de: {regionName}
                            </h3>
                        </div>

                        <p className="text-zinc-400 max-w-3xl">
                            Pokémons iniciais que jovens treinadores podem escolher
                            no começo de sua jornada na região de {regionName}.
                        </p>
                    </div>

                    {/* CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {pokemons.map(pokemon => (
                            <motion.button
                                key={pokemon.id}
                                onClick={() =>
                                    router.push(`/Pokedex/${pokemon.id}`)
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex flex-col items-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 px-6 py-4 transition"
                            >
                                <div className="relative w-32 h-32">
                                    <Image
                                        src={pokemon.artwork}
                                        alt={pokemon.name}
                                        fill
                                        unoptimized
                                        className="object-contain"
                                    />
                                </div>

                                <p className="text-sm font-extrabold text-zinc-100 capitalize">
                                    {pokemon.name}
                                </p>

                                <span className="text-[11px] font-bold text-zinc-300">
                                    #{String(pokemon.id).padStart(3, "0")}
                                </span>

                                <div className="flex gap-1">
                                    {pokemon.types.slice(0, 2).map(tp => (
                                        <span
                                            key={tp}
                                            className={`px-2 py-1 rounded text-[10px] font-extrabold capitalize ${getTypeClass(tp)}`}
                                        >
                                            {tp}
                                        </span>
                                    ))}
                                </div>
                            </motion.button>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
