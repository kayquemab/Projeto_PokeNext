"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import RegionStarters from "./region-starters";
import RegionPokemonCarousel from "./region-pokemon-carousel";
import RegionLegendaries from "./region-legendaries";

import Lideres from "./lideres";
import { useRegionNavigation } from "../hooks/use-region-navigation";

export default function RegioesPage({ regionId }) {
    const router = useRouter();
    const regionNavigation = useRegionNavigation(regionId);

    /* 🛡️ Fallback de segurança */
    if (!regionNavigation) {
        return null;
    }

    const { regiaoAtual, prev, next } = regionNavigation;

    function goToRegion(regionId) {
        router.push(`/regioes/${regionId}`);
    }

    const { nome, imagensDetalhes } = regiaoAtual;

    return (
        <div>
            {/* 🔁 HEADER DE NAVEGAÇÃO */}
            <header className="relative w-full">
                <motion.div className="mx-auto w-full max-w-6xl">
                    <div className="grid grid-cols-2 gap-1">
                        <button
                            onClick={() => goToRegion(prev)}
                            className="group flex items-center justify-start gap-3 rounded-l-2xl px-4 py-3 text-white bg-[#616161] hover:bg-[#1B1B1B]"
                        >
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#616161] group-hover:text-[#1B1B1B]">
                                <ChevronLeft className="h-4 w-4" />
                            </span>

                            <div className="text-left">
                                <div className="text-xs">Região anterior</div>
                                <div className="text-sm font-semibold">
                                    {prev.charAt(0).toUpperCase() + prev.slice(1)}
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => goToRegion(next)}
                            className="group flex items-center justify-end gap-3 rounded-r-2xl px-4 py-3 text-white bg-[#616161] hover:bg-[#1B1B1B]"
                        >
                            <div className="text-right">
                                <div className="text-sm font-semibold">
                                    {next.charAt(0).toUpperCase() + next.slice(1)}
                                </div>
                                <div className="text-xs">Próxima região</div>
                            </div>
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#616161] group-hover:text-[#1B1B1B]">
                                <ChevronRight className="h-4 w-4" />
                            </span>
                        </button>
                    </div>
                </motion.div>
            </header>

            {/* 🗺️ CONTEÚDO PRINCIPAL */}
            <main className="relative w-full h-screen overflow-hidden">
                <div className="absolute left-[8%] top-[35%] z-10">
                    <p className="text-[#2B3A4A] text-lg">Região de:</p>
                    <p className="text-[#2B3A4A] text-5xl font-medium">
                        {nome}
                    </p>
                </div>

                <div className="relative mx-auto w-[92%] h-full overflow-hidden">
                    <Image
                        src="/mapa.jpg"
                        alt="Mapa do mundo Pokémon"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                {imagensDetalhes?.imagem1 && (
                    <motion.div className="hidden sm:block absolute left-[55%] top-[3%] w-[210px] h-[300px] z-10">
                        <Image
                            src={imagensDetalhes.imagem1}
                            fill
                            className="object-cover rounded-lg shadow-lg"
                            alt=""
                        />
                    </motion.div>
                )}

                {imagensDetalhes?.imagem2 && (
                    <motion.div className="hidden sm:block absolute left-[37%] top-[45%] w-50 h-[300px] z-10">
                        <Image
                            src={imagensDetalhes.imagem2}
                            fill
                            className="object-cover rounded-lg shadow-lg"
                            alt=""
                        />
                    </motion.div>
                )}

                {imagensDetalhes?.imagem3 && (
                    <motion.div className="hidden sm:block absolute left-[77%] top-[28%] w-50 h-[260px] z-10">
                        <Image
                            src={imagensDetalhes.imagem3}
                            fill
                            className="object-cover rounded-lg shadow-lg"
                            alt=""
                        />
                    </motion.div>
                )}
            </main>

            <RegionStarters region={regionId} />

            <div className="mt-6 py-10 w-full flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
                <RegionPokemonCarousel region={regionId} />
            </div>


            <Lideres region={regionId} />




            <RegionLegendaries region={regionId} />



            {/* Botão Voltar para as Regiões */}
            <div
                className="
    w-full max-w-6xl
    rounded-2xl
    mx-auto mt-6
    overflow-visible
  "
            >
                <div className="px-5 pb-4 flex justify-end">
                    <motion.button
                        onClick={() => router.push("/regioes")}
                        whileHover={{
                            scale: 1.08,
                            y: -2,
                            transition: { type: "spring", stiffness: 250, damping: 14 },
                        }}
                        className="
        relative z-10
        px-6 py-3
        rounded-xl
        bg-[#E3350D] hover:bg-[#C32B0B]
        text-white font-semibold text-sm
        transition
      "
                    >
                        Voltar para as Regiões
                    </motion.button>
                </div>
            </div>

        </div>
    );
}
