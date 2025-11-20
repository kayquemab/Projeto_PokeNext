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
                className="w-full rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-all"
            >
                {/* TOPO REDUZIDO */}
                <div className="relative w-full h-70 bg-white">
                    <Image
                        src="/wallpaper_pokebola_branco.png"
                        alt="Fundo Pokémon"
                        fill
                        className="object-cover opacity-30"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src="/pokedex.png"
                            alt="pokedex"
                            width={150}
                            height={150}
                            className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
                        />
                    </div>
                </div>

                {/* TEXTO REDUZIDO */}
                <div className="px-2 pt-2 pb-1">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                        Pokédex
                    </h3>
                    <p className="text-xs text-gray-700 leading-snug">
                        Conheça o mundo Pokémon, onde lendas despertam e poderes surgem.
                    </p>
                </div>

                {/* BOTÃO MENOR */}
                <motion.div
                    whileHover={{
                        scale: 1.03,
                        y: -1,
                        transition: { type: "spring", stiffness: 120, damping: 10 },
                    }}
                    className="px-2 pb-2 pt-2"
                >
                    <Link
                        href="/Battle"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#E3350D] text-white text-[10px] font-semibold"
                    >
                        <InfoIcon className="w-3 h-3" />
                        Mais Informações
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
