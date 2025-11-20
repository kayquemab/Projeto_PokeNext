"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";

export default function PokedexInfo() {
    return (
        <div className="relative font-sans w-full h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[300px] rounded-2xl overflow-hidden bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            >
                {/* TOPO */}
                <div className="relative w-full h-[255px] bg-white">
                    {/* Fundo */}
                    <Image
                        src="/wallpaper_pokebola_branco.png"
                        alt="Fundo Pokémon"
                        fill
                        className="object-cover opacity-30"
                    />

                    {/* Pokémon sobreposto */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src="/pikachu.png"
                            alt="pikachu"
                            width={150}          // diminui aqui
                            height={150}         // e aqui
                            className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
                        />
                    </div>

                </div>

                {/* CORPO */}
                <div>
                    {/* TEXTO */}
                    <div className="px-4 pt-3 pb-2 bg-white text-[#222]">

                        <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-3 leading-snug">
                            Pokédex
                        </h3>
                        <p className="text-sm md:text-base leading-relaxed text-gray-700">
                            Conheça o mundo Pokémon, onde lendas despertam e poderes.
                        </p>
                    </div>

                    {/* BOTÃO */}
                    <motion.div
                        whileHover={{
                            scale: 1.03,
                            y: -1,
                            transition: {
                                type: "spring",
                                stiffness: 120,
                                damping: 10,
                            },
                        }}
                        className="px-4 pb-4 pt-1"
                    >
                        <Link
                            href="/Battle"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E3350D] text-white text-xs font-semibold shadow-sm hover:bg-red-600 transition-colors"
                        >
                            <InfoIcon className="w-3.5 h-3.5 inline-block" />
                            Mais Informações
                        </Link>
                    </motion.div>
                </div>

            </motion.div>
        </div>
    );
}
