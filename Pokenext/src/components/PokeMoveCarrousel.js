"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";

import ArrowPrev from "./ArrowPrev";
import ArrowNext from "./ArrowNext";
import Image from "next/image";
import { useRouter } from "next/navigation";

// cores para cada tipo de Pokémon
const typeColors = {
    bug: "#A8B820",
    dragon: "#7038F8",
    fairy: "#EE99AC",
    fire: "#F08030",
    ghost: "#705898",
    ground: "#E0C068",
    normal: "#A8A878",
    psychic: "#F85888",
    steel: "#B8B8D0",
    dark: "#705848",
    electric: "#F8D030",
    fighting: "#C03028",
    flying: "#A890F0",
    grass: "#78C850",
    ice: "#98D8D8",
    poison: "#A040A0",
    rock: "#B8A038",
    water: "#6890F0",
    default: "#D3D3D3",
};

function sampleUnique(arr, count) {
    const a = Array.from(new Set(arr || [])).filter(Boolean);
    if (a.length <= count) return a;

    // Fisher-Yates parcial
    for (let i = a.length - 1; i > a.length - 1 - count; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(a.length - count);
}

export default function PokeMoveCarrousel({
    spaceBetween = 1,

    // ✅ passe isso do move: move.learned_by_pokemon
    learnedByPokemon = [],

    // quantos cards mostrar
    take = 12,

    // sorteia a partir de um “pool” inicial (pra listas gigantes)
    pool = 200,
}) {
    const router = useRouter();

    const [realIndex, setRealIndex] = useState(0);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    // nomes que aprendem o movimento
    const learnedNames = useMemo(() => {
        return (learnedByPokemon || []).map((p) => p?.name).filter(Boolean);
    }, [learnedByPokemon]);

    // seed pra “sortear novamente”
    const [seed, setSeed] = useState(0);

    useEffect(() => {
        if (!learnedNames.length) {
            setCards([]);
            return;
        }

        let alive = true;
        const controller = new AbortController();

        async function loadRandomPokemonsFromLearners() {
            try {
                setLoading(true);

                // 1) reduz universo e sorteia
                const universe = learnedNames.slice(0, Math.min(pool, learnedNames.length));
                const picked = sampleUnique(universe, Math.min(take, universe.length));

                // 2) busca os pokémon sorteados
                const promises = picked.map((name) =>
                    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, { signal: controller.signal })
                        .then((res) => (res.ok ? res.json() : null))
                        .catch(() => null)
                );

                const data = await Promise.all(promises);
                if (!alive) return;

                const formatted = data
                    .filter(Boolean)
                    .map((p) => ({
                        id: p.id,
                        name: p.name,
                        types: (p.types || []).map((t) => t.type.name),
                        abilities: (p.abilities || []).map((a) => a.ability.name),
                        image:
                            p.sprites.other?.["official-artwork"]?.front_default ||
                            p.sprites.front_default ||
                            null,
                    }))
                    // deixa a ordem mais “bonita” (remove se quiser manter 100% aleatório)
                    .sort((a, b) => a.id - b.id);

                setCards(formatted);
                setRealIndex(0);
            } finally {
                if (alive) setLoading(false);
            }
        }

        loadRandomPokemonsFromLearners();

        return () => {
            alive = false;
            controller.abort();
        };
    }, [learnedNames, take, pool, seed]);

    function goToDetail(p) {
        router.push(`/Pokedex/${p.id}`);
    }

    return (
        <div className="w-full pb-10 pt-8 lg:pt-0 select-none relative overflow-visible">
            <div className="relative w-full mx-auto">
                {/* TÍTULO */}
                <h3
                    className="
            flex items-center gap-2
            bg-[#1b1b1b] text-[#919191]
            font-medium text-[20px]
            mt-[5px] mx-auto sm:ml-16
            py-[11px] px-5 pb-2
            w-fit
          "
                >
                    <Image
                        src="/pokeball.png"
                        alt="Pokeball"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] opacity-30 brightness-0 invert object-contain"
                    />
                    Movimento usado por:
                </h3>

                

                {/* SWIPER */}
                <div className="relative w-full h-[350px]">
                    {loading && cards.length === 0 ? (
                        <div className="mt-8 text-center text-white/70 text-sm">
                            Carregando Pokémon aleatórios que usam este movimento...
                        </div>
                    ) : cards.length === 0 ? (
                        <div className="mt-8 text-center text-white/70 text-sm">
                            Nenhum Pokémon encontrado para este movimento.
                        </div>
                    ) : (
                        <>
                            <Swiper
                                modules={[Navigation]}
                                navigation={{
                                    prevEl: ".arrow-prev",
                                    nextEl: ".arrow-next",
                                }}
                                slidesPerView={"auto"}
                                loop={cards.length > 1}
                                speed={600}
                                centeredSlides={true}
                                spaceBetween={spaceBetween}
                                onSlideChange={(swiper) => setRealIndex(swiper.realIndex)}
                                className="w-full"
                            >
                                {cards.map((p, index) => {
                                    const offsetFromFirstVisible =
                                        (index - realIndex + cards.length) % cards.length;

                                    const isActive = offsetFromFirstVisible === 0;
                                    const mainAbility = p.abilities?.[0];

                                    return (
                                        <SwiperSlide key={p.id} style={{ width: "330px" }}>
                                            <motion.div
                                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                                transition={{ type: "spring", stiffness: 120, damping: 22 }}
                                                className={`
                          relative flex flex-col shadow-lg
                          overflow-visible transition-all duration-300
                          ${isActive ? "h-[400px]" : "h-[330px]"}
                          cursor-pointer
                        `}
                                                onClick={() => goToDetail(p)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") goToDetail(p);
                                                }}
                                            >
                                                {/* IMAGEM + NÚMERO DE FUNDO */}
                                                <div
                                                    className={`
                            relative bg-neutral-600 overflow-hidden
                            transition-all duration-300
                            ${isActive ? "h-[260px]" : "h-[230px]"}
                          `}
                                                >
                                                    <div className="absolute inset-0 flex pointer-events-none">
                                                        <span
                                                            className={`
                                font-black leading-none select-none
                                ${isActive
                                                                    ? "mt-4 text-[140px] text-zinc-500/40"
                                                                    : "mt-2 text-[120px] text-zinc-800/40"
                                                                }
                              `}
                                                        >
                                                            {String(p.id).padStart(3, "0")}
                                                        </span>
                                                    </div>

                                                    {p.image ? (
                                                        <Image
                                                            src={p.image}
                                                            alt={p.name}
                                                            fill
                                                            sizes="100%"
                                                            unoptimized
                                                            className={`
                                absolute inset-0 object-contain
                                opacity-100 brightness-110 z-10
                                transition-all duration-300
                                ${isActive ? "scale-105" : "scale-90"}
                              `}
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 grid place-items-center text-white/70 z-10">
                                                            Sem imagem
                                                        </div>
                                                    )}
                                                </div>

                                                {/* DESCRIÇÃO */}
                                                <div
                                                    className={`
                            p-3 flex flex-col
                            justify-start gap-1 overflow-visible
                            transition-all duration-300
                            bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat
                            ${isActive ? "h-[140px]" : "h-[100px]"}
                          `}
                                                >
                                                    {/* Nome + número */}
                                                    <h4
                                                        className={`
                              font-semibold
                              flex items-center justify-between
                              text-white
                              ${isActive ? "text-xl" : "text-lg"}
                            `}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <motion.div
                                                                className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                                                                initial={{ scaleY: 0.3, opacity: 0 }}
                                                                animate={{ scaleY: 1, opacity: 1 }}
                                                                transition={{ delay: 0.2, duration: 0.35 }}
                                                            />
                                                            <span className="capitalize">{p.name}</span>
                                                        </div>

                                                        <span
                                                            className={
                                                                isActive
                                                                    ? "text-zinc-300 text-base"
                                                                    : "text-zinc-400 text-sm"
                                                            }
                                                        >
                                                            #{String(p.id).padStart(3, "0")}
                                                        </span>
                                                    </h4>

                                                    {/* Tipo + Habilidade → apenas se ativo */}
                                                    {isActive && (
                                                        <div className="relative translate-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-white text-sm font-medium">
                                                                    Tipo:
                                                                </span>

                                                                {p.types.map((type) => (
                                                                    <span
                                                                        key={type}
                                                                        className="text-white text-sm font-medium px-2 py-1 rounded-md capitalize"
                                                                        style={{
                                                                            backgroundColor:
                                                                                typeColors[type] || typeColors.default,
                                                                        }}
                                                                    >
                                                                        {type}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            {mainAbility && (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-zinc-300 text-sm font-medium">
                                                                        Habilidade:
                                                                    </span>

                                                                    <span className="text-zinc-100 text-sm capitalize truncate">
                                                                        {mainAbility.replace("-", " ")}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>

                            {/* SETAS */}
                            {cards.length > 1 && (
                                <>
                                    <div className="arrow-prev absolute left-2 top-1/2 -translate-y-1/2 z-50">
                                        <ArrowPrev />
                                    </div>

                                    <div className="arrow-next absolute right-2 top-1/2 -translate-y-1/2 z-50">
                                        <ArrowNext />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
