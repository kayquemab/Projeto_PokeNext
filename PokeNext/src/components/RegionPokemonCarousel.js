"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";

import ArrowPrev from "./ArrowPrev";
import ArrowNext from "./ArrowNext";
import Image from "next/image";
import { useRouter } from "next/navigation";

// cores para cada tipo de Pokémon
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

// Mapear regiões para a Pokédex
const regionToPokedex = {
    kanto: "kanto",
    johto: "original-johto",
    hoenn: "hoenn",
    sinnoh: "original-sinnoh",
    unova: "original-unova",
    kalos: "kalos-central",
    alola: "original-alola",
    galar: "galar",
    paldea: "paldea",
};

export default function RegionPokemonCarousel({ region, spaceBetween = 1 }) {
    const router = useRouter();
    const [realIndex, setRealIndex] = useState(0);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        let alive = true;

        async function loadRegionPokemons() {
            const pokedexName = regionToPokedex[region];
            if (!pokedexName) return;

            try {
                // 1️⃣ Buscar Pokémon da Pokédex da região
                const dexRes = await fetch(`https://pokeapi.co/api/v2/pokedex/${pokedexName}`);
                const dexData = await dexRes.json();

                // Extrair nomes dos Pokémon
                let speciesList = dexData.pokemon_entries.map((e) => e.pokemon_species.name);

                if (!alive || speciesList.length === 0) return;

                // 2️⃣ Sortear até 12 Pokémon
                if (speciesList.length > 12) {
                    speciesList = speciesList.sort(() => 0.5 - Math.random()).slice(0, 12);
                }

                // 3️⃣ Buscar dados completos
                const promises = speciesList.map(async (name) => {
                    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                    const p = await res.json();
                    return {
                        id: p.id,
                        name: p.name,
                        types: p.types.map((t) => t.type.name),
                        abilities: p.abilities.map((a) => a.ability.name),
                        image: p.sprites.other?.["official-artwork"]?.front_default,
                    };
                });

                const data = await Promise.all(promises);
                if (alive) setCards(data);
            } catch (err) {
                console.error("Erro ao carregar Pokémon da região:", err);
            }
        }

        loadRegionPokemons();

        return () => {
            alive = false;
        };
    }, [region]);

    function goToDetail(p) {
        if (p) router.push(`/Pokedex/${p.id}`);
    }

    return (
        <div className="w-full pb-10 pt-8 lg:pt-0 select-none relative overflow-visible">
            <div className="relative w-full mx-auto">

                {/* TÍTULO */}
                <h3 className="flex items-center gap-2 bg-[#1b1b1b] text-[#919191] font-medium text-[20px] mt-[5px] mx-auto sm:ml-16 py-[11px] px-5 pb-2 w-fit">
                    <Image src="/pokeball.png" alt="Pokeball" width={22} height={22} className="w-[22px] h-[22px] opacity-30 brightness-0 invert object-contain" />
                    Pokémons da Região
                </h3>

                {/* SWIPER */}
                <div className="relative w-full h-[350px]">
                    <Swiper
                        modules={[Navigation]}
                        navigation={{ prevEl: ".arrow-prev", nextEl: ".arrow-next" }}
                        slidesPerView={"auto"}
                        loop={true}
                        speed={600}
                        centeredSlides={true}
                        spaceBetween={spaceBetween}
                        onSlideChange={(swiper) => setRealIndex(swiper.realIndex)}
                        className="w-full"
                    >
                        {cards.map((p, index) => {
                            const offsetFromFirstVisible = (index - realIndex + cards.length) % cards.length;
                            const isActive = offsetFromFirstVisible === 0;
                            const mainAbility = p.abilities?.[0];

                            return (
                                <SwiperSlide key={p.id} style={{ width: "330px" }}>
                                    <motion.div
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        transition={{ type: "spring", stiffness: 120, damping: 22 }}
                                        className={`relative flex flex-col shadow-lg overflow-visible transition-all duration-300 ${isActive ? "h-[400px]" : "h-[330px]"} cursor-pointer`}
                                        onClick={() => goToDetail(p)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === "Enter") goToDetail(p); }}
                                    >
                                        {/* IMAGEM + NÚMERO DE FUNDO */}
                                        <div className={`relative bg-neutral-600 overflow-hidden transition-all duration-300 ${isActive ? "h-[260px]" : "h-[230px]"}`}>
                                            <div className="absolute inset-0 flex pointer-events-none">
                                                <span className={`font-black leading-none select-none ${isActive ? "mt-4 text-[140px] text-zinc-500/40" : "mt-2 text-[120px] text-zinc-800/40"}`}>
                                                    {String(p.id).padStart(3, "0")}
                                                </span>
                                            </div>

                                            <Image src={p.image} alt={p.name} fill sizes="100%" className={`absolute inset-0 object-contain opacity-100 brightness-110 z-10 transition-all duration-300 ${isActive ? "scale-105" : "scale-90"}`} />
                                        </div>

                                        {/* DESCRIÇÃO */}
                                        <div className={`p-3 flex flex-col justify-start gap-1 overflow-visible transition-all duration-300 bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat ${isActive ? "h-[140px]" : "h-[100px]"}`}>
                                            <h4 className={`font-semibold flex items-center justify-between text-white ${isActive ? "text-xl" : "text-lg"}`}>
                                                <div className="flex items-center gap-2">
                                                    <motion.div className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]" initial={{ scaleY: 0.3, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.35 }} />
                                                    <span className="capitalize">{p.name}</span>
                                                </div>
                                                <span className={isActive ? "text-zinc-300 text-base" : "text-zinc-400 text-sm"}>#{String(p.id).padStart(3, "0")}</span>
                                            </h4>

                                            {/* Tipo + Habilidade → apenas se ativo */}
                                            {isActive && (
                                                <div className="relative translate-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white text-sm font-medium">Tipo:</span>
                                                        {p.types.map((type) => (
                                                            <span key={type} className="text-white text-sm font-medium px-2 py-1 rounded-md capitalize" style={{ backgroundColor: typeColors[type] }}>
                                                                {type}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {mainAbility && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-zinc-300 text-sm font-medium">Habilidade:</span>
                                                            <span className="text-zinc-100 text-sm capitalize truncate">{mainAbility.replace("-", " ")}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* SETAS */}
                    <div className="arrow-prev absolute left-2 top-1/2 -translate-y-1/2 z-50"><ArrowPrev /></div>
                    <div className="arrow-next absolute right-2 top-1/2 -translate-y-1/2 z-50"><ArrowNext /></div>

                </div>
            </div>
        </div>
    );
}
