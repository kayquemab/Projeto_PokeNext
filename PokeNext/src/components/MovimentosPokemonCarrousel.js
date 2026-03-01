"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";

import ArrowPrev from "./ArrowPrev";
import ArrowNext from "./ArrowNext";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* =========================
   Cores por tipo (mesmo padrão)
========================= */
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

const METHOD_RANK = {
    "level-up": 0,
    machine: 1,
    tutor: 2,
    egg: 3,
};

function formatName(name) {
    return String(name || "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function pickBestLearnDetail(versionDetails = []) {
    if (!Array.isArray(versionDetails) || versionDetails.length === 0) return null;

    const normalized = versionDetails
        .map((d) => ({
            method: d.move_learn_method?.name || "other",
            level: Number.isFinite(d.level_learned_at) ? d.level_learned_at : 999,
        }))
        .map((x) => ({ ...x, rank: METHOD_RANK[x.method] ?? 9 }));

    normalized.sort((a, b) => a.rank - b.rank || a.level - b.level);
    return normalized[0];
}

function labelLearnMethod(method) {
    if (method === "level-up") return "Level Up";
    if (method === "machine") return "TM/HM";
    if (method === "tutor") return "Tutor";
    if (method === "egg") return "Egg";
    return "Outro";
}

/* =========================
   Shuffle (aleatório)
========================= */
function shuffleCopy(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* =========================
   Cache simples (sessão)
========================= */
const moveDetailCache = new Map(); // moveName -> detail

export default function MovimentosPokemonCarrousel({
    pokemonId,
    count = 12,
    spaceBetween = 1,
    titulo = "Movimentos em Destaque",
}) {
    const router = useRouter();

    const [realIndex, setRealIndex] = useState(0);
    const [cards, setCards] = useState([]); // moves escolhidos
    const [detailsByMove, setDetailsByMove] = useState({}); // name -> detail

    // 1) pega lista de moves do pokémon e escolhe "count" aleatórios
    useEffect(() => {
        if (!pokemonId) return;

        let alive = true;
        const ac = new AbortController();

        async function loadRandomMoves() {
            try {
                setCards([]);
                setDetailsByMove({});

                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, {
                    signal: ac.signal,
                });
                if (!res.ok) return;

                const data = await res.json();
                if (!alive) return;

                const full = (data.moves || [])
                    .map((m) => {
                        const best = pickBestLearnDetail(m.version_group_details);
                        return {
                            name: m.move?.name,
                            url: m.move?.url,
                            learnMethod: best?.method || "other",
                            learnLevel: best?.level ?? null,
                        };
                    })
                    .filter((x) => x.name && x.url);

                // remove duplicados
                const seen = new Set();
                const uniq = [];
                for (const item of full) {
                    if (seen.has(item.name)) continue;
                    seen.add(item.name);
                    uniq.push(item);
                }

                const picked = shuffleCopy(uniq).slice(0, Math.min(count, uniq.length));
                setCards(picked);
            } catch {
                // silencioso
            }
        }

        loadRandomMoves();

        return () => {
            alive = false;
            ac.abort();
        };
    }, [pokemonId, count]);

    // 2) carrega detalhes dos moves (tipo, power, etc.)
    useEffect(() => {
        if (!cards.length) return;

        let alive = true;
        const ac = new AbortController();

        async function loadDetails() {
            const entries = await Promise.all(
                cards.map(async (m) => {
                    if (moveDetailCache.has(m.name)) return [m.name, moveDetailCache.get(m.name)];

                    try {
                        const res = await fetch(m.url, { signal: ac.signal });
                        if (!res.ok) return [m.name, null];

                        const d = await res.json();

                        // ✅ sempre array: se vier types[] usa; senão usa type.name; e limita em 2
                        const rawTypes = Array.isArray(d.types)
                            ? d.types
                            : d.type?.name
                                ? [d.type.name]
                                : [];
                        const types = rawTypes.filter(Boolean).slice(0, 2);

                        const simplified = {
                            types, // <- 0..2 tipos
                            power: d.power,
                            accuracy: d.accuracy,
                            pp: d.pp,
                            damageClass: d.damage_class?.name,
                        };

                        moveDetailCache.set(m.name, simplified);
                        return [m.name, simplified];
                    } catch {
                        return [m.name, null];
                    }
                })
            );

            if (!alive) return;

            const obj = {};
            for (const [name, detail] of entries) obj[name] = detail;
            setDetailsByMove(obj);
        }

        loadDetails();

        return () => {
            alive = false;
            ac.abort();
        };
    }, [cards]);

    function goToMove(slug) {
        router.push(`/Movimentos/${slug}`);
    }

    return (
        <div className="w-full pb-10 pt-8 lg:pt-0 select-none relative overflow-visible">
            <div className="relative w-full mx-auto">
                {/* TÍTULO (mesmo estilo do seu sistema) */}
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
                    {titulo}
                </h3>

                {/* SWIPER (mesmo padrão do seu carousel) */}
                <div className="relative w-full h-[350px]">
                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl: ".arrow-prev",
                            nextEl: ".arrow-next",
                        }}
                        slidesPerView={"auto"}
                        loop={true}
                        speed={600}
                        centeredSlides={true}
                        spaceBetween={spaceBetween}
                        onSlideChange={(swiper) => setRealIndex(swiper.realIndex)}
                        className="w-full"
                    >
                        {cards.map((m, index) => {
                            const offsetFromFirstVisible =
                                (index - realIndex + cards.length) % cards.length;

                            const isActive = offsetFromFirstVisible === 0;

                            const d = detailsByMove[m.name];
                            const types = Array.isArray(d?.types) ? d.types.slice(0, 2) : [];

                            return (
                                <SwiperSlide key={m.name} style={{ width: "330px" }}>
                                    <motion.div
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        transition={{ type: "spring", stiffness: 120, damping: 22 }}
                                        className={`
                      relative flex flex-col shadow-lg
                      overflow-visible transition-all duration-300
                      ${isActive ? "h-[400px]" : "h-[330px]"}
                      cursor-pointer
                    `}
                                        onClick={() => goToMove(m.name)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") goToMove(m.name);
                                        }}
                                    >
                                        {/* TOPO (área cinza, mesmo padrão) */}
                                        <div
                                            className={`
                        relative bg-neutral-600 overflow-hidden
                        transition-all duration-300
                        ${isActive ? "h-[260px]" : "h-[230px]"}
                      `}
                                        >
                                            {/* texto gigante no fundo (substitui o número) */}
                                            <div className="absolute inset-0 flex pointer-events-none items-start">
                                                <span
                                                    className={`
                            font-black leading-none select-none
                            uppercase
                            ${isActive
                                                            ? "mt-6 text-[56px] text-zinc-500/25"
                                                            : "mt-5 text-[48px] text-zinc-800/25"
                                                        }
                          `}
                                                    style={{
                                                        lineHeight: 0.9,
                                                        wordBreak: "break-word",
                                                        paddingLeft: 16,
                                                        paddingRight: 16,
                                                    }}
                                                >
                                                    {formatName(m.name)}
                                                </span>
                                            </div>

                                            {/* conteúdo central */}
                                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
                                                <p className={`font-extrabold text-white ${isActive ? "text-2xl" : "text-xl"}`}>
                                                    {formatName(m.name)}
                                                </p>

                                                {d ? (
                                                    <div className="mt-2 text-sm text-white/90 space-y-1">
                                                        <div className="capitalize">
                                                            Classe: <span className="font-semibold">{d.damageClass || "—"}</span>
                                                        </div>
                                                        <div className="flex items-center justify-center gap-4 flex-wrap">
                                                            <span>
                                                                Power: <span className="font-semibold">{d.power ?? "-"}</span>
                                                            </span>
                                                            <span>
                                                                Acc: <span className="font-semibold">{d.accuracy ?? "-"}</span>
                                                            </span>
                                                            <span>
                                                                PP: <span className="font-semibold">{d.pp ?? "-"}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 text-xs text-white/70">Carregando detalhes...</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* DESCRIÇÃO (wallpaper preto, mesmo padrão) */}
                                        <div
                                            className={`
                        p-3 flex flex-col
                        justify-start gap-1 overflow-visible
                        transition-all duration-300
                        bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat
                        ${isActive ? "h-[140px]" : "h-[100px]"}
                      `}
                                        >
                                            {/* Nome */}
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
                                                    <span className="capitalize">{m.name}</span>
                                                </div>
                                            </h4>

                                            {/* TIPOS (1 ou 2) + aprendizagem (apenas se ativo) */}
                                            {isActive && (
                                                <div className="relative translate-y-4">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-white text-sm font-medium">
                                                            Tipo:
                                                        </span>

                                                        {types.length ? (
                                                            types.map((tp) => (
                                                                <span
                                                                    key={tp}
                                                                    className="text-white text-sm font-medium px-2 py-1 rounded-md capitalize"
                                                                    style={{ backgroundColor: typeColors[tp] || typeColors.default }}
                                                                >
                                                                    {tp}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span
                                                                className="text-white text-sm font-medium px-2 py-1 rounded-md"
                                                                style={{ backgroundColor: typeColors.default }}
                                                            >
                                                                —
                                                            </span>
                                                        )}
                                                    </div>

                                                    
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* SETAS (seu padrão) */}
                    <div className="arrow-prev absolute left-2 top-1/2 -translate-y-1/2 z-50">
                        <ArrowPrev />
                    </div>

                    <div className="arrow-next absolute right-2 top-1/2 -translate-y-1/2 z-50">
                        <ArrowNext />
                    </div>
                </div>
            </div>
        </div>
    );
}
