"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

export default function MegaEvolucaoInfo() {
    return (
        <div className="relative mr-[100px] font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[420px] rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
                {/* TOPO */}
                <div className="relative w-full h-[300px] bg-white">
                    <Image
                        src="/wallpaper_pokebola_branco.png"
                        alt="Fundo Pokémon"
                        fill
                        className="object-cover opacity-30"
                    />

                    <div className="absolute inset-0 p-4 flex flex-col justify-center">
                    </div>
                </div>

                {/* TEXTO */}
                <div className="p-4 bg-white text-[#222]">
                    <p className="text-sm md:text-base leading-relaxed text-gray-700">
                        Kalos apresenta:{" "}
                        <span className="font-semibold text-gray-900">
                            Megaevolução
                        </span>{" "}
                        — transforme seus Pokémon no ápice da força!
                    </p>
                </div>

                {/* 🔥 BOTÃO — igual ao EventCard */}
                <div className="p-4">
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
                    >
                        <Link
                            href="/Battle"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E3350D] text-white text-sm font-semibold shadow-sm hover:bg-red-600 transition-colors"
                        >
                            <Info className="w-4 h-4 inline-block" />
                            Mais informações
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
