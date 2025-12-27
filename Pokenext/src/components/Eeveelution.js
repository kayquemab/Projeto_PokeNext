"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";

export default function Eeveelution() {
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
                className="w-full max-w-[565px] sm:max-w-[565px] md:max-w-[565px] lg:max-w-[565px] rounded-md overflow-hidden shadow-lg bg-yellow-600 transition-shadow duration-300 hover:shadow-2xl"
            >
                {/* Imagem de fundo + Eevee na frente */}
                <div className="relative w-full h-[200px] sm:h-[250px] md:h-[310px] lg:h-[375px] bg-white">

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
                            width={120}
                            height={120}
                            className="sm:w-[140px] sm:h-[140px] md:w-[150px] md:h-[150px] lg:w-[170px] lg:h-[170px] drop-shadow-xl"
                        />
                    </div>
                </div>

                {/* Texto */}
                <div className="px-3 pt-3 pb-2">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2">
                        Eevee Evoluções
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-white leading-snug">
                        Seu potencial é ilimitado — cada escolha, cada ambiente e cada laço despertam uma forma diferente de poder.
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
