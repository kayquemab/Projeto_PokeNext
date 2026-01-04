"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import RegionStarters from "@/components/RegionStarters";
import RegionPokemonCarousel from "@/components/RegionPokemonCarousel";
import RegionLegendaries from "@/components/RegionLegendaries";

const REGIOES = [
    "kanto",
    "johto",
    "hoenn",
    "sinnoh",
    "unova",
    "kalos",
    "alola",
    "galar",
    "paldea",
];

const IMAGENS_POR_REGIAO = {
    kanto: {
        imagem1: "/imagens_kanto/PalletTown.jpg",
        imagem2: "/imagens_kanto/banner_liga_kanto.jpg",
        imagem3: "/imagens_kanto/silhueta_kanto.jpeg",
    },
    johto: {
        imagem1: "/imagens_johto/Cyndaquil.jpg",
        imagem2: "/imagens_johto/banner_liga_johto.jpg",
        imagem3: "/imagens_johto/silhueta_johto.jpeg",
    },
    hoenn: {
        imagem1: "/imagens_hoenn/banner_latiosElatias.jpg",
        imagem2: "/imagens_hoenn/banner_liga_hoenn.jpg",
        imagem3: "/imagens_hoenn/silhueta_hoenn.jpeg",
    },
    sinnoh: {
        imagem1: "/imagens_sinnoh/sinnoh.jpg",
        imagem2: "/imagens_sinnoh/Riolu_Wallpaper.jpg",
        imagem3: "/imagens_sinnoh/silhueta_sinnoh.jpeg",
    },
    unova: {
        imagem1: "/imagens_unova/banner_liga_unova.jpg",
        imagem2: "/imagens_unova/unova.jpg",
        imagem3: "/imagens_unova/silhueta_unova.jpeg",
    },
    kalos: {
        imagem1: "/imagens_kalos/kalos.jpg",
        imagem2: "/imagens_kalos/Lumiose_City.jpg",
        imagem3: "/imagens_kalos/silhueta_kalos.jpeg",
    },
    alola: {
        imagem1: "/imagens_alola/alola.jpg",
        imagem2: "/imagens_alola/anuncio_alola.jpg",
        imagem3: "/imagens_alola/silhueta_alola.jpeg",
    },
    galar: {
        imagem1: "/imagens_galar/galar.jpg",
        imagem2: "/imagens_galar/Pokemon_League.jpg",
        imagem3: "/imagens_galar/silhueta_galar.jpeg",
    },
    paldea: {
        imagem1: "/imagens_paldea/paldea_region.jpg",
        imagem2: "/imagens_paldea/Miraidon.jpg",
        imagem3: "/imagens_paldea/Koraidon.jpg",
    },
};

export default function RegioesPage() {
    const { regioesId } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const nomeRegiao =
        regioesId.charAt(0).toUpperCase() + regioesId.slice(1);

    /* 🔁 QUERY TEM PRIORIDADE, FALLBACK GARANTE FUNCIONAMENTO */
    const imagens = searchParams.get("imagem1")
        ? {
            imagem1: searchParams.get("imagem1"),
            imagem2: searchParams.get("imagem2"),
            imagem3: searchParams.get("imagem3"),
        }
        : IMAGENS_POR_REGIAO[regioesId];

    const index = REGIOES.indexOf(regioesId);
    const prev = REGIOES[(index - 1 + REGIOES.length) % REGIOES.length];
    const next = REGIOES[(index + 1) % REGIOES.length];

    function goToRegion(regionId) {
        const imgs = IMAGENS_POR_REGIAO[regionId];
        const query = new URLSearchParams(imgs).toString();
        router.push(`/Regioes/${regionId}?${query}`);
    }

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

            {/* 🗺️ CONTEÚDO ORIGINAL (100% PRESERVADO) */}
            <main className="relative w-full h-screen overflow-hidden">

                <div className="absolute left-[8%] top-[35%] z-10">
                    <p className="text-[#2B3A4A] text-lg">Região de:</p>
                    <p className="text-[#2B3A4A] text-5xl font-medium">
                        {nomeRegiao}
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

                {imagens?.imagem1 && (
                    <motion.div className="hidden sm:block absolute left-[55%] top-[3%] w-[210px] h-[300px] z-10">
                        <Image
                            src={imagens.imagem1}
                            fill
                            className="object-cover rounded-lg shadow-lg"
                            alt=""
                        />
                    </motion.div>
                )}

                {imagens?.imagem2 && (
                    <motion.div className="hidden sm:block absolute left-[37%] top-[45%] w-50 h-[300px] z-10">
                        <Image
                            src={imagens.imagem2}
                            fill
                            className="object-cover rounded-lg shadow-lg"
                            alt=""
                        />
                    </motion.div>
                )}

                {imagens?.imagem3 && (
                    <motion.div className="hidden sm:block absolute left-[77%] top-[28%] w-50 h-[260px] z-10">
                        <Image
                            src={imagens.imagem3}
                            fill
                            className="object-cover rounded-lg shadow-lg"
                            alt=""
                        />
                    </motion.div>
                )}
            </main>

            <RegionStarters region={regioesId} />

            <div className="w-full flex flex-col items-center px-4 mt-6 py-10">
                <RegionPokemonCarousel region={regioesId} />
            </div>

            <RegionLegendaries region={regioesId} />
        </div>
    );
}
