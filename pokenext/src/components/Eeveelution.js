"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";

export default function Eeveelution() {
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
                className="w-full max-w-[339px] rounded-md overflow-hidden shadow-lg bg-yellow-600 transition-shadow duration-300 hover:shadow-2xl"
            >
                {/* Imagem de fundo + Eevee na frente */}
                <div className="relative w-full h-107 bg-white">

                    {/* Imagem de fundo */}
                    <Image
                        src="/eeveelution.jpeg"
                        alt="Fundo Pokémon"
                        fill
                        className="object-cover opacity-40"
                    />

                    {/* Container flex SÓ para a imagem do Eevee */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Image
                            src="/eevee.png"
                            alt="Eevee"
                            width={170}
                            height={170}
                            className="drop-shadow-xl"
                        />
                    </div>
                </div>

                {/* Texto */}
                <div className="px-2 pt-2 pb-1">
                    <h3 className="text-base font-semibold text-white mb-2">
                        Eevee Evoluções
                    </h3>
                    <p className="text-xs text-white leading-snug">
                        Seu potencial é ilimitado — cada escolha, cada ambiente e cada laço despertam uma forma diferente de poder.
                    </p>
                </div>

                {/* Botão */}
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
                        href="https://pokemon.fandom.com/pt-br/wiki/Eeveelutions"
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
