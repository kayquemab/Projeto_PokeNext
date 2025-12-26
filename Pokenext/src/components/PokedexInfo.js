"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";

export default function PokedexInfo() {
    return (
        <div className="relative w-full flex justify-center   lg:px-0">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                    scale: 1.02,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                }}
                className="w-full max-w-[565px] rounded-md overflow-hidden shadow-lg bg-cyan-950 transition-shadow duration-300 hover:shadow-2xl"
            >
                {/* Banner responsivo */}
                <div className="relative w-full h-[200px] sm:h-[260px] md:h-[280px] lg:h-[300px] bg-cyan-800">
                    <Image
                        src="/wallpaper_pokebola_branco.jpeg"
                        alt="Fundo Pokémon"
                        fill
                        className="object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src="/pokedex.png"
                            alt="Pokedex"
                            width={150}
                            height={150}
                            className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] w-[100px] sm:w-[120px] md:w-[135px] lg:w-[150px] h-auto"
                        />
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="px-3 pt-2 pb-1">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                        Pokedex
                    </h3>
                    <p className="text-xs sm:text-sm text-white leading-snug">
                        Conheça o mundo Pokémon, onde lendas despertam e poderes surgem.
                    </p>
                </div>

                {/* Botão */}
                <motion.div
                    whileHover={{
                        scale: 1.01,
                        y: -0.5,
                        transition: { type: "spring", stiffness: 80, damping: 12 },
                    }}
                    className="p-3"
                >
                    <Link
                        href="/Pokedex"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E3350D] text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-red-600 transition-colors"
                    >
                        <InfoIcon className="w-3.5 h-3.5" />
                        Mais informações
                    </Link>
                </motion.div>
            </motion.div>

        </div>
    );
}
