"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swords, Trophy } from "lucide-react";

export default function EventCard() {
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
                className="w-full max-w-[565px] lg:max-w-none rounded-md overflow-hidden shadow-lg bg-white transition-shadow duration-300 hover:shadow-2xl"
            >

                {/* Papel de parede */}
                <div className="relative w-full h-[350px] sm:h-[450px] bg-white">
                    <Image
                        src="/wallpaper_pokebola.jpeg"
                        alt="Pokébolas"
                        fill
                        className="object-cover opacity-40"
                    />

                    {/* Conteúdo do card */}
                    <div className="absolute inset-0 flex justify-between items-center ">

                        {/* Banner à esquerda */}
                        <div className="w-1/2 flex items-center justify-center">
                            <Image
                                src="/banner.png"
                                alt="Banner"
                                width={140}
                                height={160}
                                className="
                                    h-88        /* padrão mobile */
                                    sm:h-113    /* small screens ≥640px */
                                    md:h-113    /* medium screens ≥768px */
                                    lg:h-113    /* large screens ≥1024px */
                                    xl:h-113    /* extra large ≥1280px */
                                    drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]
                                "
                            />
                        </div>

                        {/* Riolu à direita */}
                        <div className="w-1/2 flex items-center justify-center">
                            <Image
                                src="/Riolu.png"
                                alt="Riolu"
                                width={260}
                                height={260}
                                className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Conteúdo textual */}
                <div className="px-3 pt-2 bg-white text-[#222] font-sans">
                    <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-3 leading-snug">
                        Batalha online
                    </h3>

                    <p className="text-sm md:text-base leading-relaxed text-gray-700">
                        Escolha sua formação:{" "}
                        <span className="font-bold text-gray-900">
                            1x1, trio ou batalha total
                        </span>
                        . Teste sua estratégia, supere rivais do mundo inteiro
                        e conquiste a glória. Dois treinadores entram…{" "}
                        <span className="font-bold text-gray-900 flex items-center">
                            apenas um sairá vitorioso{" "}
                            <Trophy className="w-6 h-6 ml-2 text-yellow-500" />
                        </span>
                    </p>

                    {/* Botão de ação */}
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
                        className="py-3"
                    >
                        <Link
                            href="/Battle"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E3350D] text-white text-sm font-semibold shadow-sm hover:bg-red-600 transition-colors"
                        >
                            <Swords className="w-4 h-4 inline-block" />
                            Batalhe Agora!
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
