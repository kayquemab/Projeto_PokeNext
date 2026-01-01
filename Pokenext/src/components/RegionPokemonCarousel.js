"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ArrowPrev from "./ArrowPrev";
import ArrowNext from "./ArrowNext";

/* ================= CORES DOS TIPOS ================= */
const typeColors = {
    bug: "#A8B820",
    dragon: "#7038F8",
    fairy: "#EE99AC",
    fire: "#F08030",
    ghost: "#705898",
    ground: "#E0C068",
    normal: "#A8A878",
    psychic: "#F85888",
    steel: "#B8B8D0",
    dark: "#705848",
    electric: "#F8D030",
    fighting: "#C03028",
    flying: "#A890F0",
    grass: "#78C850",
    ice: "#98D8D8",
    poison: "#A040A0",
    rock: "#B8A038",
    water: "#6890F0",
    default: "#D3D3D3",
};

/* ================= REGIÃO → POKEDEX ================= */
const regionToPokedex = {
    // Geração I
    kanto: "kanto",

    // Geração II
    johto: "original-johto",

    // Geração III
    hoenn: "hoenn",

    // Geração IV
    sinnoh: "sinnoh",

    // Geração V
    unova: "original-unova",

    // Geração VI
    kalos: "kalos-central",

    // Geração VII
    alola: "original-alola",

    // Geração VIII
    galar: "galar",

    // Geração IX
    paldea: "paldea",
};



export default function RegionPokemonCarousel({ region, spaceBetween = 1 }) {
    const router = useRouter();
    const [cards, setCards] = useState([]);
    const [realIndex, setRealIndex] = useState(0);

    useEffect(() => {
        let alive = true;

        async function loadRegionPokemons() {
            const pokedexName = regionToPokedex[region];
            if (!pokedexName) return;

            try {
                /* 1️⃣ Pokédex da região */
                const dexRes = await fetch(
                    `https://pokeapi.co/api/v2/pokedex/${pokedexName}`
                );
                const dexData = await dexRes.json();

                /* 2️⃣ Sorteio seguro */
                const shuffled = [...dexData.pokemon_entries].sort(
                    () => 0.5 - Math.random()
                );
                const selected = shuffled.slice(0, 12);

                /* 3️⃣ Dados completos */
                const pokemons = await Promise.all(
                    selected.map(entry =>
                        fetch(
                            `https://pokeapi.co/api/v2/pokemon/${entry.pokemon_species.name}`
                        )
                            .then(res => res.json())
                            .then(p => ({
                                id: p.id,
                                name: p.name,
                                types: p.types.map(t => t.type.name),
                                abilities: p.abilities.map(a => a.ability.name),
                                image:
                                    p.sprites.other["official-artwork"].front_default,
                            }))
                    )
                );

                if (alive) setCards(pokemons);
            } catch (err) {
                console.error("Erro ao carregar Pokémon da região:", err);
            }
        }

        loadRegionPokemons();
        return () => (alive = false);
    }, [region]);

    function goToDetail(pokemon) {
        router.push(`/Pokedex/${pokemon.id}`);
    }

    return (
        <div className="w-full pb-10 pt-10 select-none relative">
            <h3
                className="
          flex items-center gap-2
          bg-[#1b1b1b] text-[#919191]
          font-medium text-[20px]
          mt-[5px] mx-auto sm:ml-16
          py-[11px] px-5 pb-2
          w-fit
        "
            >
                <Image
                    src="/pokeball.png"
                    alt="Pokeball"
                    width={22}
                    height={22}
                    className="opacity-30 brightness-0 invert"
                />
                Pokémon da Região
            </h3>

            <div className="relative w-full h-[350px]">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: ".arrow-prev",
                        nextEl: ".arrow-next",
                    }}
                    slidesPerView="auto"
                    centeredSlides
                    loop
                    speed={600}
                    spaceBetween={spaceBetween}
                    onSlideChange={s => setRealIndex(s.realIndex)}
                >
                    {cards.map((p, index) => {
                        const isActive = index === realIndex;
                        const mainAbility = p.abilities[0];

                        return (
                            <SwiperSlide key={p.id} style={{ width: "330px" }}>
                                <motion.div
                                    className={`relative flex flex-col cursor-pointer ${isActive ? "h-[400px]" : "h-[330px]"
                                        }`}
                                    onClick={() => goToDetail(p)}
                                >
                                    {/* IMAGEM */}
                                    <div
                                        className={`relative bg-neutral-600 ${isActive ? "h-[260px]" : "h-[230px]"
                                            }`}
                                    >
                                        <Image
                                            src={p.image}
                                            alt={p.name}
                                            fill
                                            className={`object-contain transition-all ${isActive ? "scale-105" : "scale-90"
                                                }`}
                                        />
                                    </div>

                                    {/* INFO */}
                                    <div
                                        className="
                      bg-[url('/wallpaper-preto.png')]
                      bg-cover bg-center
                      p-3
                    "
                                    >
                                        <h4 className="text-white font-semibold capitalize">
                                            {p.name}
                                        </h4>

                                        {isActive && (
                                            <>
                                                <div className="flex gap-2 mt-2">
                                                    {p.types.map(t => (
                                                        <span
                                                            key={t}
                                                            className="px-2 py-1 rounded text-white text-sm capitalize"
                                                            style={{
                                                                backgroundColor:
                                                                    typeColors[t] || typeColors.default,
                                                            }}
                                                        >
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>

                                                {mainAbility && (
                                                    <p className="text-zinc-300 text-sm mt-1 capitalize">
                                                        {mainAbility.replace("-", " ")}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                <div className="arrow-prev absolute left-2 top-1/2 -translate-y-1/2 z-50">
                    <ArrowPrev />
                </div>

                <div className="arrow-next absolute right-2 top-1/2 -translate-y-1/2 z-50">
                    <ArrowNext />
                </div>
            </div>
        </div>
    );
}
