


"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";

export default function PokebolaInfo() {
    return (
        <div className="relative w-full flex justify-center lg:px-0">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                    scale: 1.02,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                }}
                className="w-full max-w-[565px] sm:max-w-[565px] md:max-w-[565px] lg:max-w-[565px] rounded-md overflow-hidden shadow-lg bg-white transition-shadow duration-300 hover:shadow-2xl"
            >
                {/* Imagem de fundo */}
                <div className="relative w-full h-39 md:h-60 lg:h-28 sm:h-60 bg-white">

                    <Image
                        src="/pokelogo.jpeg"
                        alt="pokelogo"
                        fill
                        className="object-cover opacity-80"
                    />
                </div>

                {/* Texto */}
                <div className="px-2 pt-2 pb-1">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1">
                        Pokébolas
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-700 leading-snug">
                        Ferramentas essenciais que conectam treinadores e Pokémon.
                    </p>
                </div>

                {/* Botão */}
                <motion.div
                    whileHover={{
                        scale: 1.03,
                        transition: {
                            type: "spring",
                            stiffness: 80,
                            damping: 12,
                        },
                    }}
                    className="px-2 py-2"
                >
                    <Link
                        href="https://www.legiaodosherois.com.br/lista/pokemon-iniciais-cada-geracao.html"
                        target="blank"
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
