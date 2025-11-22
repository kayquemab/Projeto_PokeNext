"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swords, Trophy } from "lucide-react";

export default function EventCard() {
    return (
        <div className="relative ml-[70px]">
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
                <div className="relative w-full h-[350px] sm:h-[450px] bg-white">
                    <Image
                        src="/wallpaper_pokebola.jpeg"
                        alt="Pokébolas"
                        fill
                        className="object-cover opacity-40"
                    />

                    <div className="absolute inset-0 flex">
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

                <div className="px-3 pt-2 bg-white text-[#222] font-sans">
                    <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-3 leading-snug">
                        Batalha online
                    </h3>

                    <p className="text-sm md:text-base leading-relaxed text-gray-700">
                        Escolha sua formação:{" "}
                        <span className="font-bold text-gray-900">1x1, trio ou batalha total</span>.
                        Teste sua estratégia, supere rivais do mundo inteiro e conquiste a glória.
                        Dois treinadores entram…{" "}
                        <span className="font-bold text-gray-900 flex items-center">
                            apenas um sairá vitorioso{" "}
                            <Trophy className="w-6 h-6 ml-2 text-yellow-500" />
                        </span>
                    </p>

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
