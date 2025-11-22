"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { InfoIcon, Swords } from "lucide-react";

export default function PokebolaInfo() {
    return (
        <div className="relative font-sans w-full h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                    scale: 1.02,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                }}
                className="w-full max-w-[565px] rounded-md overflow-hidden shadow-lg bg-white transition-shadow duration-300 hover:shadow-2xl"
            >
                <div className="relative w-full h-36 bg-white">

                    <Image
                        src="/pokelogo.jpeg"
                        alt="pokelogo"
                        fill
                        className="object-cover opacity-80"
                    />

                </div>

                <div className="px-2 pt-2 pb-1">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Pokébolas</h3>
                    <p className="text-xs text-gray-700 leading-snug">
                        Ferramentas essenciais que conectam treinadores e Pokémon.
                    </p>
                </div>

                <motion.div
                    whileHover={{
                        scale: 1.01,
                        y: -0.5,
                        transition: {
                            type: "spring",
                            stiffness: 80,
                            damping: 12,
                        },
                    }}
                    className="p-3"
                >
                    <Link
                        href="/Battle"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E3350D] text-white text-xs font-semibold shadow-sm hover:bg-red-600 transition-colors"
                    >
                        <InfoIcon className="w-3.5 h-3.5 inline-block" />
                        Mais informações
                    </Link>

                </motion.div>

            </motion.div>
        </div>
    );
}
