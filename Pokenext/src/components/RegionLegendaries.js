"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function getTypeClass(type) {
    const map = {
        grass: "bg-green-600",
        fire: "bg-red-600",
        water: "bg-blue-600",
        electric: "bg-yellow-500 text-black",
        poison: "bg-purple-600",
        flying: "bg-sky-500",
        bug: "bg-lime-600",
        normal: "bg-zinc-500",
        ground: "bg-amber-700",
        fairy: "bg-pink-500",
        fighting: "bg-orange-700",
        psychic: "bg-pink-600",
        rock: "bg-stone-600",
        ghost: "bg-indigo-700",
        ice: "bg-cyan-400 text-black",
        dragon: "bg-indigo-800",
        dark: "bg-zinc-800",
        steel: "bg-slate-500",
    };

    return map[type] || "bg-zinc-600";
}

export default function RegionLegendaries({ region }) {
    const router = useRouter();
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= LENDÁRIOS POR REGIÃO ================= */
    const legendariesByRegion = {
        kanto: [144, 145, 146, 150],
        johto: [243, 244, 245, 249, 250],
        hoenn: [377, 378, 379, 380, 381, 382, 383, 384],
        sinnoh: [480, 481, 482, 483, 484, 485, 486, 487],
        unova: [638, 639, 640, 641, 642, 643, 644, 645, 646],
        kalos: [716, 717, 718],
        alola: [785, 786, 787, 788, 789, 790, 791, 792],
        galar: [888, 889, 890],
        paldea: [1001, 1002, 1003, 1004],
    };

    useEffect(() => {
        async function loadLegendaries() {
            setLoading(true);

            const ids = legendariesByRegion[region] || [];

            const results = await Promise.all(
                ids.map((id) =>
                    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                        .then((r) => r.json())
                        .then((p) => ({
                            id: p.id,
                            name: p.name,
                            artwork:
                                p.sprites.other["official-artwork"].front_default,
                            types: p.types.map((t) => t.type.name),
                        }))
                )
            );

            setPokemons(results);
            setLoading(false);
        }

        loadLegendaries();
    }, [region]);

    if (loading) {
        return (
            <p className="mt-10 text-center text-zinc-400">
                Carregando lendários...
            </p>
        );
    }

    return (
        <div
            className="
        mt-6
        px-4
        sm:px-6
        md:px-8
        lg:px-0
      "
        >
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
                    <div className="flex flex-col gap-2 mb-6">
                        <div className="flex items-center gap-2">
                            <motion.div
                                className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                                initial={{ scaleY: 0.3, opacity: 0 }}
                                animate={{ scaleY: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.35 }}
                            />

                            <h3 className="text-xl font-extrabold text-black dark:text-white">
                                Pokémon Lendários de{" "}
                                {region.charAt(0).toUpperCase() + region.slice(1)}
                            </h3>
                        </div>

                        <p className="text-zinc-400 max-w-3xl">
                            Pokémon lendários associados à história, mitos e equilíbrio da
                            região de{" "}
                            {region.charAt(0).toUpperCase() + region.slice(1)}.
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="flex flex-wrap gap-6 justify-center">
                        {pokemons.map((pokemon) => (
                            <motion.button
                                key={pokemon.id}
                                onClick={() => router.push(`/Pokedex/${pokemon.id}`)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="
                  flex flex-col items-center gap-2
                  rounded-xl border border-white/15
                  bg-white/10 hover:bg-white/20
                  px-6 py-4 transition
                "
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
                                    {pokemon.types.slice(0, 2).map((tp) => (
                                        <span
                                            key={tp}
                                            className={`px-2 py-1 rounded text-[10px] font-extrabold capitalize text-white ${getTypeClass(
                                                tp
                                            )}`}
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
