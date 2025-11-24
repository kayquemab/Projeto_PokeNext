"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";

import ArrowPrev from "./ArrowPrev";
import ArrowNext from "./ArrowNext";

export default function PokemonCarousel() {
    const [realIndex, setRealIndex] = useState(0);
    const [cards, setCards] = useState([]);

    const middleOffset = 2; // para 5 slides

    // ----------------------------------------------------
    // 🔥 Carregar 10 pokemons aleatórios ao abrir
    // ----------------------------------------------------
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
        <div className="w-full py-10 select-none relative overflow-hidden">
            <div className="relative w-full mx-auto">

                {/* -------------------- TÍTULO -------------------- */}
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
                    <img
                        src="/pokeball.png"
                        alt=""
                        className="
                            w-[22px] h-[22px] 
                            opacity-30 
                            brightness-0 invert
                            object-contain
                        "
                    />

                    Pokémon em Destaque
                </h3>

                {/* -------------------- SWIPER WRAPPER -------------------- */}
                <div className="px-1 pt-1 bg-[#1b1b1b]">

                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl: ".arrow-prev",
                            nextEl: ".arrow-next",
                        }}
                        spaceBetween={4}
                        slidesPerView={5}
                        loop={true}
                        onSlideChange={(swiper) => {
                            setRealIndex(swiper.realIndex);
                        }}
                        className="w-full"
                    >
                        {cards.map((p, index) => {
                            const middle = (realIndex + middleOffset) % cards.length;
                            const isMiddle = index === middle;

                            return (
                                <SwiperSlide key={p.id}>
                                    <motion.div
                                        animate={{
                                            scale: isMiddle ? 1.05 : 1,
                                            opacity: isMiddle ? 1 : 0.5,
                                            y: isMiddle ? -10 : 0
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 220,
                                            damping: 18
                                        }}
                                        className="relative h-[350px] w-61 bg-[#2d2d2d] overflow-hidden shadow-lg flex flex-col justify-end"
                                    >
                                        {/* -------------------- NÚMERO AO FUNDO -------------------- */}
                                        <div className="absolute inset-0 flex items-center justify-center text-[250px] font-bold text-white/10 select-none">
                                            {p.id}
                                        </div>

                                        {/* -------------------- IMAGEM DO POKEMON -------------------- */}
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="absolute inset-0 w-full h-full object-contain opacity-60"
                                        />

                                        {/* -------------------- CARD INFERIOR -------------------- */}
                                        <div className="relative z-10 bg-black/80 text-white px-3 py-2 text-sm h-24">
                                            <h3 className="font-semibold text-base mb-1 capitalize">
                                                {p.name}
                                            </h3>

                                            {/* Tipos */}
                                            <div className="flex items-center gap-2 text-xs mb-1">
                                                <span className="opacity-70">Tipos</span>

                                                {p.types.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="bg-purple-700 px-2 py-1 rounded text-[10px] uppercase tracking-wide"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Habilidades */}
                                            <div className="text-xs opacity-80">
                                                Habilidades: {p.abilities.join(", ")}
                                            </div>
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* -------------------- SETAS -------------------- */}
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
