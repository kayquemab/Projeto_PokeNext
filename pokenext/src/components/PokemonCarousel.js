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

// cores para cada tipo de Pokémon
const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
};

export default function PokemonCarousel({ spaceBetween = 1 }) {
    const [realIndex, setRealIndex] = useState(0);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        async function loadRandomPokemons() {
            const randomIds = Array.from({ length: 12 }, () =>
                Math.floor(Math.random() * 898) + 1
            );

            const promises = randomIds.map((id) =>
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
                    res.json()
                )
            );

            const data = await Promise.all(promises);

            const formatted = data.map((p) => ({
                id: p.id,
                name: p.name,
                types: p.types.map((t) => t.type.name),
                abilities: p.abilities.map((a) => a.ability.name),
                image: p.sprites.other["official-artwork"].front_default,
            }));

            setCards(formatted);
        }

        loadRandomPokemons();
    }, []);

    return (
        <div className="w-full py-10 select-none relative overflow-visible">
            <div className="relative w-full mx-auto">
                
                {/* TÍTULO */}
                <h3
                    className="
                        flex items-center gap-2 
                        bg-[#1b1b1b] text-[#919191] 
                        font-medium text-[20px] 
                        mt-[5px] ml-6 
                        py-[11px] px-5 pb-2 
                        w-fit
                    "
                >
                    <Image
                        src="/pokeball.png"
                        alt="Pokeball"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] opacity-30 brightness-0 invert object-contain"
                    />
                    Pokémon em Destaque
                </h3>

                {/* SWIPER */}
                <div className="relative w-full h-[350px]">

                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl: ".arrow-prev",
                            nextEl: ".arrow-next",
                        }}
                        slidesPerView={"auto"}
                        loop={true}
                        speed={600}
                        centeredSlides={true}
                        spaceBetween={spaceBetween}
                        onSlideChange={(swiper) => setRealIndex(swiper.realIndex)}
                        className="w-full"
                    >
                        {cards.map((p, index) => {
                            const offsetFromFirstVisible =
                                (index - realIndex + cards.length) % cards.length;

                            const isActive = offsetFromFirstVisible === 0;
                            const mainAbility = p.abilities?.[0];

                            return (
                                <SwiperSlide key={p.id} style={{ width: "400px" }}>
                                    <motion.div
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 22,
                                        }}
                                        className={`
                                            relative flex flex-col shadow-lg 
                                            overflow-visible transition-all duration-300
                                            ${isActive ? "h-[400px]" : "h-[360px]"}
                                        `}
                                    >
                                        {/* IMAGEM + NÚMERO DE FUNDO */}
                                        <div
                                            className={`
                                                relative bg-neutral-600 overflow-hidden
                                                transition-all duration-300
                                                ${isActive ? "h-[260px]" : "h-[230px]"}
                                            `}
                                        >
                                            <div className="absolute inset-0 flex pointer-events-none">
                                                <span
                                                    className={`
                                                        font-black leading-none select-none
                                                        ${
                                                            isActive
                                                                ? "mt-4 text-[140px] text-zinc-500/40"
                                                                : "mt-2 text-[120px] text-zinc-800/40"
                                                        }
                                                    `}
                                                >
                                                    {String(p.id).padStart(3, "0")}
                                                </span>
                                            </div>

                                            <Image
                                                src={p.image}
                                                alt={p.name}
                                                fill
                                                sizes="100%"
                                                className={`
                                                    absolute inset-0 object-contain 
                                                    opacity-100 brightness-110 z-10 
                                                    transition-all duration-300
                                                    ${isActive ? "scale-105" : "scale-90"}
                                                `}
                                            />
                                        </div>

                                        {/* DESCRIÇÃO */}
                                        <div
                                            className={`
                                                bg-neutral-800 p-3 flex flex-col 
                                                justify-start gap-1 overflow-visible
                                                transition-all duration-300
                                                ${isActive ? "h-[140px]" : "h-[130px]"}
                                            `}
                                        >
                                            {/* Nome + número */}
                                            <h4
                                                className={`
                                                    font-semibold 
                                                    flex items-center justify-between
                                                    text-white 
                                                    ${isActive ? "text-xl" : "text-lg"}
                                                `}
                                            >
                                                <span className="capitalize">{p.name}</span>

                                                <span
                                                    className={
                                                        isActive
                                                            ? "text-zinc-300 text-base"
                                                            : "text-zinc-400 text-sm"
                                                    }
                                                >
                                                    #{String(p.id).padStart(3, "0")}
                                                </span>
                                            </h4>

                                            {/* Tipo + Habilidade → apenas se ativo */}
                                            {isActive && (
                                                <div className="relative translate-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white text-sm font-medium">
                                                            Tipo:
                                                        </span>

                                                        {p.types.map((type) => (
                                                            <span
                                                                key={type}
                                                                className="text-white text-sm font-medium px-2 py-1 rounded-md capitalize"
                                                                style={{
                                                                    backgroundColor:
                                                                        typeColors[type],
                                                                }}
                                                            >
                                                                {type}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {mainAbility && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-zinc-300 text-sm font-medium">
                                                                Habilidade:
                                                            </span>

                                                            <span className="text-zinc-100 text-sm capitalize truncate">
                                                                {mainAbility.replace("-", " ")}
                                                            </span>
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
                    <div className="arrow-prev absolute left-2 top-1/2 -translate-y-1/2 z-50">
                        <ArrowPrev />
                    </div>

                    <div className="arrow-next absolute right-2 top-1/2 -translate-y-1/2 z-50">
                        <ArrowNext />
                    </div>
                </div>

            </div>
        </div>
    );
}
