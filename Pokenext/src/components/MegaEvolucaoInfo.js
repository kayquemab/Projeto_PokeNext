"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";

export default function MegaEvolucaoInfo() {
    return (
        <div className="w-full flex justify-center  lg:px-0 ">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                    scale: 1.02,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                }}
                className="w-full max-w-[565px] rounded-md overflow-hidden shadow-lg bg-red-900 transition-shadow duration-300 hover:shadow-2xl"
            >
                {/* Banner responsivo */}
                <div className="relative w-full h-[200px] sm:h-[260px] md:h-[280px] lg:h-[300px] bg-red-200">
                    <Image
                        src="/megaevolucaoinfo.jpg"
                        alt="Fundo Pokémon"
                        fill
                        className="object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src="/hawluchanite.png"
                            alt="Hawlucha"
                            width={110}
                            height={110}
                            className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] w-20 sm:w-[95px] md:w-[105px] lg:w-[110px] h-auto"
                        />
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="px-3 pt-2 pb-1">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                        Mega Evolução
                    </h3>
                    <p className="text-xs sm:text-sm text-white leading-snug">
                        Quando o vínculo atinge o auge e o poder rompe todos os limites.
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
                        href="https://mega.pokemon.com/pt-br/"
                        target="_blank"
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
