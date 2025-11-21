"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";

export default function NovoJogoInfo() {
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
                className="w-full max-w-[580px] rounded-md overflow-hidden shadow-lg bg-white transition-shadow duration-300 hover:shadow-2xl"
            >
                <div className="relative w-full h-75 bg-white">

                    <Image
                        src="/imagemJogoBanner.png"
                        alt="Fundo Pokémon"
                        fill
                        className="object-cover opacity-90"
                    />

                    {/* Texto acima do botão */}
                    <p className="absolute bottom-10 left-2 right-2 text-white text-xs font-medium drop-shadow-lg leading-tight">
                        Veja todos os detalhes do próximo lançamento e prepare-se para uma nova aventura.
                    </p>

                    {/* Botão posicionado dentro da imagem */}
                    <motion.div
                        whileHover={{
                            scale: 1.03,
                            transition: {
                                type: "spring",
                                stiffness: 80,
                                damping: 12,
                            },
                        }}
                        className="absolute bottom-2 left-2"
                    >
                        <Link
                            href="/Battle"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E3350D] text-white text-xs font-semibold shadow-sm hover:bg-red-600 transition-colors"
                        >
                            <InfoIcon className="w-3.5 h-3.5 inline-block" />
                            Mais informações
                        </Link>
                    </motion.div>

                </div>

            </motion.div>
        </div>
    );
}
