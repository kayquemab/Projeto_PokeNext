"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// ⚠️ Mantive igual seu projeto
import { regioes } from "@/app/Regioes/page";

function getTypeClass(type) {
    const map = {
        bug: "bg-[#A8B820] text-white dark:bg-[#A8B820] dark:text-white",
        dragon: "bg-[#7038F8] text-white dark:bg-[#7038F8] dark:text-white",
        fairy: "bg-[#EE99AC] text-white dark:bg-[#EE99AC] dark:text-white",
        fire: "bg-[#F08030] text-white dark:bg-[#F08030] dark:text-white",
        ghost: "bg-[#705898] text-white dark:bg-[#705898] dark:text-white",
        ground: "bg-[#E0C068] text-white dark:bg-[#E0C068] dark:text-white",
        normal: "bg-[#A8A878] text-white dark:bg-[#A8A878] dark:text-white",
        psychic: "bg-[#F85888] text-white dark:bg-[#F85888] dark:text-white",
        steel: "bg-[#B8B8D0] text-white dark:bg-[#B8B8D0] dark:text-white",
        dark: "bg-[#705848] text-white dark:bg-[#705848] dark:text-white",
        electric: "bg-[#F8D030] text-white dark:bg-[#F8D030] dark:text-white",
        fighting: "bg-[#C03028] text-white dark:bg-[#C03028] dark:text-white",
        flying: "bg-[#A890F0] text-white dark:bg-[#A890F0] dark:text-white",
        grass: "bg-[#78C850] text-white dark:bg-[#78C850] dark:text-white",
        ice: "bg-[#98D8D8] text-white dark:bg-[#98D8D8] dark:text-white",
        poison: "bg-[#A040A0] text-white dark:bg-[#A040A0] dark:text-white",
        rock: "bg-[#B8A038] text-white dark:bg-[#B8A038] dark:text-white",
        water: "bg-[#6890F0] text-white dark:bg-[#6890F0] dark:text-white",
        default: "bg-neutral-300 text-white dark:bg-neutral-700 dark:text-white",
    };

    return map[type] || "bg-zinc-600 text-white";
}

export default function Lideres({ region = "kanto" }) {
    const router = useRouter();

    const safeRegion =
        typeof region === "string" && region.trim().length > 0
            ? region.trim().toLowerCase()
            : "kanto";

    // ✅ leaders por região vindos do JSON "regioes"
    const leadersByRegion = useMemo(() => {
        const map = {};
        for (const r of regioes) {
            map[r.id] = Array.isArray(r.leaders) ? r.leaders : [];
        }
        return map;
    }, []);

    const leaders = useMemo(() => {
        return leadersByRegion[safeRegion] || [];
    }, [leadersByRegion, safeRegion]);

    const regionName = useMemo(() => {
        const found = regioes.find((r) => r.id === safeRegion);
        if (found?.nome) return found.nome;
        return safeRegion.charAt(0).toUpperCase() + safeRegion.slice(1);
    }, [safeRegion]);

    const [pokeCache, setPokeCache] = useState({});
    const [loading, setLoading] = useState(true);

    const allIds = useMemo(() => {
        const ids = leaders.flatMap((l) => l.teamIds || []);
        return Array.from(new Set(ids));
    }, [leaders]);

    useEffect(() => {
        let cancelled = false;

        async function loadAllPokemon() {
            setLoading(true);

            try {
                const results = await Promise.all(
                    allIds.map(async (id) => {
                        const p = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) =>
                            r.json()
                        );

                        const artwork =
                            p?.sprites?.other?.["official-artwork"]?.front_default ||
                            p?.sprites?.front_default ||
                            "/placeholder.png";

                        const types = Array.isArray(p?.types)
                            ? p.types.map((t) => t?.type?.name).filter(Boolean)
                            : [];

                        return { id: p.id, name: p.name, artwork, types };
                    })
                );

                if (cancelled) return;

                const next = {};
                results.forEach((pk) => {
                    next[pk.id] = pk;
                });

                setPokeCache(next);
            } catch {
                // silencioso, igual seu padrão
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        if (allIds.length) loadAllPokemon();
        else setLoading(false);

        return () => {
            cancelled = true;
        };
    }, [allIds]);

    // ✅ fallback
    if (!leaders.length) {
        return (
            <div className="mt-6 px-4 sm:px-6 md:px-8 lg:px-0">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat shadow-lg p-6">
                        <div className="flex items-center gap-2">
                            <motion.div
                                className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                                initial={{ scaleY: 0.3, opacity: 0 }}
                                animate={{ scaleY: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.35 }}
                            />
                            <h3 className="text-xl font-extrabold text-zinc-100">
                                Líderes de Ginásio — {regionName}
                            </h3>
                        </div>

                        <p className="mt-3 text-zinc-400">
                            Nenhum líder encontrado para essa região.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ DESIGN ANTIGO (grid de cards, cada card tem o header "Líderes — região")
    return (
        <div className="mt-6 px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="mx-auto w-full max-w-6xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {leaders.map((leader, idx) => (
                        <motion.div
                            key={leader.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: idx * 0.03 }}
                            className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat shadow-lg"
                        >
                            <div className="p-5 space-y-4">
                                {/* Cabeçalho do card: marcador + título contextual da região */}
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                                        initial={{ scaleY: 0.3, opacity: 0 }}
                                        animate={{ scaleY: 1, opacity: 1 }}
                                        transition={{ delay: 0.15, duration: 0.35 }}
                                    />
                                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-100">
                                        Líderes de Ginásio — {regionName}
                                    </h3>
                                </div>

                                {/* Metadados do líder: nome, tipo principal e cidade */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-base font-extrabold text-zinc-100">{leader.nome}</p>

                                        <span
                                            className={`px-2 py-1 rounded-md text-[11px] font-extrabold capitalize ${getTypeClass(
                                                leader.tipo
                                            )}`}
                                        >
                                            {leader.tipo}
                                        </span>
                                    </div>

                                    <p className="text-xs text-zinc-300">Cidade: {leader.cidade}</p>
                                </div>

                                {/* Lista de pokémons do time (clicáveis para a Pokédex) */}
                                {loading ? (
                                    <p className="text-center text-zinc-400 text-sm">Carregando pokémons...</p>
                                ) : (
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {(leader.teamIds || []).map((pid) => {
                                            const pokemon = pokeCache[pid];

                                            const artwork =
                                                pokemon?.artwork && String(pokemon.artwork).trim()
                                                    ? pokemon.artwork
                                                    : "/placeholder.png";

                                            const name = pokemon?.name || "pokemon";
                                            const types = pokemon?.types || [];

                                            return (
                                                <motion.button
                                                    key={pid}
                                                    type="button"
                                                    onClick={() => router.push(`/Pokedex/${pid}`)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="flex flex-col items-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 px-5 py-4 transition cursor-pointer"
                                                    title={`Ver ${name}`}
                                                >
                                                    <div className="relative w-24 h-24">
                                                        <Image
                                                            src={artwork}
                                                            alt={name}
                                                            fill
                                                            unoptimized
                                                            className="object-contain"
                                                        />
                                                    </div>

                                                    <p className="text-sm font-extrabold text-zinc-100 capitalize">{name}</p>

                                                    <span className="text-[11px] font-bold text-zinc-300">
                                                        #{String(pid).padStart(3, "0")}
                                                    </span>

                                                    <div className="flex gap-1">
                                                        {types.slice(0, 2).map((tp) => (
                                                            <span
                                                                key={tp}
                                                                className={`px-2 py-1 rounded text-[10px] font-extrabold capitalize text-white ${getTypeClass(
                                                                    tp
                                                                )}`}
                                                            >
                                                                {tp}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
