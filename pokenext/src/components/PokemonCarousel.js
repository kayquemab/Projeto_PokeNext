"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { motion } from "framer-motion";

import ArrowPrev from "./ArrowPrev";
import ArrowNext from "./ArrowNext";

export default function PokemonCarousel() {
    const [realIndex, setRealIndex] = useState(0);

    const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const middleOffset = 2; // slide central no caso de 5 por view

    return (
        <div className="w-full py-10 select-none relative overflow-hidden">

            <div className="relative w-full mx-auto">

                {/* Título */}
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
                        alt=""
                        width={22}
                        height={22}
                        className="
                            w-[22px] h-[22px] 
                            opacity-30 
                            brightness-0 invert
                            object-contain
                        "
                    />

                    Pokémon em Destaque
                </h3>

                {/* Wrapper */}
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
                        {cards.map((n, index) => {

                            // índice real do card visível no meio
                            const middle = (realIndex + middleOffset) % cards.length;

                            const isMiddle = index === middle;

                            return (
                                <SwiperSlide key={n}>
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
                                        className="relative h-[350px] w-61 bg-[#2d2d2d] overflow-hidden shadow-lg flex flex-col justify-end">

                                        {/* Placeholder */}
                                        <div className="absolute inset-0 flex items-center justify-center text-[250px] font-bold text-white/10">
                                            {n}
                                        </div>

                                        {/* Bottom */}
                                        <div className="relative z-10 bg-black/80 text-white px-3 py-2 text-sm h-24">
                                            <h3 className="font-semibold text-base mb-1">Card {n}</h3>

                                            <div className="flex items-center gap-2 text-xs mb-1">
                                                <span className="opacity-70">Tipo</span>

                                                <span className="bg-purple-700 px-2 py-1 rounded text-[10px] uppercase tracking-wide">
                                                    Poison
                                                </span>

                                                <span className="bg-pink-600 px-2 py-1 rounded text-[10px] uppercase tracking-wide">
                                                    Fada
                                                </span>
                                            </div>

                                            <div className="text-xs opacity-80">
                                                Habilidades: Toxic Chain
                                            </div>
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
