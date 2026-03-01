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

export default function RegionLegendaries({ region }) {
    const router = useRouter();
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    const legendariesByRegion = {
        // KANTO
        kanto: [
            144, // Articuno
            145, // Zapdos
            146, // Moltres
            150, // Mewtwo
            151, // Mew (mítico)
        ],

        // JOHTO
        johto: [
            243, // Raikou
            244, // Entei
            245, // Suicune
            249, // Lugia
            250, // Ho-Oh
            251, // Celebi (mítico)
        ],

        // HOENN
        hoenn: [
            377, // Regirock
            378, // Regice
            379, // Registeel
            380, // Latias
            381, // Latios
            382, // Kyogre
            383, // Groudon
            384, // Rayquaza
            385, // Jirachi (mítico)
            386, // Deoxys (mítico)
        ],

        // SINNOH
        sinnoh: [
            480, // Uxie
            481, // Mesprit
            482, // Azelf
            483, // Dialga
            484, // Palkia
            485, // Heatran
            486, // Regigigas
            487, // Giratina
            488, // Cresselia (alguns consideram semi-lendário)
            489, // Phione (mítico)
            490, // Manaphy (mítico)
            491, // Darkrai (mítico)
            492, // Shaymin (mítico)
            493, // Arceus (mítico)
        ],

        // UNOVA
        unova: [
            638, // Cobalion
            639, // Terrakion
            640, // Virizion
            641, // Tornadus
            642, // Thundurus
            643, // Reshiram
            644, // Zekrom
            645, // Landorus
            646, // Kyurem
            647, // Keldeo (mítico)
            648, // Meloetta (mítico)
            649, // Genesect (mítico)
        ],

        // KALOS
        kalos: [
            716, // Xerneas
            717, // Yveltal
            718, // Zygarde
            719, // Diancie (mítico)
            720, // Hoopa (mítico)
            721, // Volcanion (mítico)
        ],

        // ALOLA
        alola: [
            785, // Tapu Koko
            786, // Tapu Lele
            787, // Tapu Bulu
            788, // Tapu Fini
            789, // Cosmog
            790, // Cosmoem
            791, // Solgaleo
            792, // Lunala
            793, // Nihilego (Ultra Beast)
            794, // Ultra Beasts (opcional)
            800, // Necrozma (alguns consideram lendário)
        ],

        // GALAR
        galar: [
            888, // Zacian
            889, // Zamazenta
            890, // Eternatus
            891, // Kubfu
            892, // Urshifu
            894, // Regieleki
            895, // Regidrago
            896, // Glastrier
            897, // Spectrier
            898, // Calyrex
        ],

        // PALDEA (SV + DLCs)
        paldea: [
            1001, // Wo-Chien
            1002, // Chien-Pao
            1003, // Ting-Lu
            1004, // Chi-Yu
            1007, // Koraidon
            1008, // Miraidon
            1014, // Okidogi
            1015, // Munkidori
            1016, // Fezandipiti
            1017, // Ogerpon
            1024, // Terapagos
        ],
    };

    useEffect(() => {
        async function loadLegendaries() {
            setLoading(true);

            const ids = legendariesByRegion[region] || [];

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

        loadLegendaries();
    }, [region]);

    if (loading) {
        return (
            <p className="mt-10 text-center text-zinc-400">
                Carregando lendários...
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
                                Pokémon Lendários de: {regionName}
                            </h3>
                        </div>

                        <p className="text-zinc-400 max-w-3xl">
                            Pokémon lendários associados à história, mitos e equilíbrio da
                            região de {regionName}.
                        </p>
                    </div>

                    {/* CARDS */}
                    <div className="flex flex-wrap gap-6 justify-center">
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
                                            className={`px-2 py-1 rounded text-[10px] font-extrabold capitalize text-white ${getTypeClass(tp)}`}
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
