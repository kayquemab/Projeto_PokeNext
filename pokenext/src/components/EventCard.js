"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export default function EventCard() {
    return (
        <div className="relative ml-[110px] mt-[50px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[650px] rounded-xl overflow-hidden shadow-lg bg-white"
            >
                {/* Topo do Card — altura controlada pela imagem */}
                <div className="relative w-full h-[350px] sm:h-[450px] bg-white">
                    {/* Fundo com pokébolas */}
                    <Image
                        src="/wallpaper_pokebola.jpeg"
                        alt="Pokébolas"
                        fill
                        className="object-cover opacity-30"
                    />

                    {/* Conteúdo sobreposto */}
                    <div className="absolute inset-0 flex">

                        {/* Banner */}
                        <div className="flex items-center justify-center w-1/2 p-4">
                            <Image
                                src="/banner.png"
                                alt="Banner"
                                width={200}
                                height={50}
                                style={{ height: "450px" }}
                                className="drop-shadow-xl object-contain"
                            />
                        </div>

                        {/* Pokémon direita */}
                        <div className="flex items-center justify-center w-1/2 p-4">
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

                <div className="p-6 bg-white text-[#222] rounded-2xl shadow-xl font-sans hover:shadow-2xl transition-shadow duration-300">
                    {/* Subtítulo elegante */}
                    <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-3 leading-snug font-sans">
                        Batalha online
                    </h3>

                    {/* Descrição limpa */}
                    <p className="text-sm md:text-base leading-relaxed text-gray-700 font-sans">
                        Escolha sua formação:{" "}
                        <span className="font-bold text-gray-900">1x1, trio ou batalha total</span>.
                        Teste sua estratégia, supere rivais do mundo inteiro e conquiste a glória.
                        Dois treinadores entram…{" "}
                        <span className="font-bold text-gray-900 flex items-center">
                            apenas um sairá vitorioso{" "}
                            <Trophy className="w-6 h-6 ml-2 text-yellow-500" />
                        </span>

                    </p>

                    {/* 🔥 BOTÃO BATTLE */}
                    <motion.div
                        whileHover={{
                            scale: 1.03,      // menor aumento de tamanho
                            y: -1,             // menor deslocamento vertical
                            transition: {
                                type: "spring",
                                stiffness: 120,   // menos “rígido”
                                damping: 10       // mais suave
                            },
                        }}
                        className="mt-6"
                    >
                        <Link
                            href="/Battle"
                            className="px-4 py-2 rounded-xl bg-[#E3350D] text-white text-sm font-semibold shadow-sm hover:bg-red-600 transition-colors"
                        >
                            Battle
                        </Link>
                    </motion.div>



                </div>
            </motion.div>
        </div>
    );
}
