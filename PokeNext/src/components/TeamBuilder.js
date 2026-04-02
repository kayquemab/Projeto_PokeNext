"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus, ChevronDown, ChevronUp, Loader2, Shield, Zap, Heart, Swords, Wind, Star } from "lucide-react";
import Image from "next/image";

const TYPE_COLORS = {
    bug: "#6D9B1A", dragon: "#5B2FD6", fairy: "#D4607A", fire: "#D4621A",
    ghost: "#4E3A7A", ground: "#BF9A30", normal: "#7A7A5A", psychic: "#D4306A",
    steel: "#7A7A9A", dark: "#4A3A2A", electric: "#D4AA10", fighting: "#9A1A1A",
    flying: "#7A6AC0", grass: "#3A8A30", ice: "#5AACAC", poison: "#7A1A7A",
    rock: "#8A7020", water: "#3A6AD4",
};

const TYPE_LABELS = {
    bug: "Bug", dragon: "Dragão", fairy: "Fada", fire: "Fogo",
    ghost: "Fantasma", ground: "Terra", normal: "Normal", psychic: "Psíquico",
    steel: "Aço", dark: "Sombrio", electric: "Elétrico", fighting: "Lutador",
    flying: "Voador", grass: "Planta", ice: "Gelo", poison: "Veneno",
    rock: "Pedra", water: "Água",
};

const STAT_CONFIG = {
    hp: { label: "HP", icon: Heart, color: "#E85D75", max: 255 },
    attack: { label: "ATK", icon: Swords, color: "#E88D3D", max: 190 },
    defense: { label: "DEF", icon: Shield, color: "#5B9BD6", max: 230 },
    "special-attack": { label: "S.ATK", icon: Star, color: "#9B6ED6", max: 194 },
    "special-defense": { label: "S.DEF", icon: Wind, color: "#4BC48A", max: 230 },
    speed: { label: "VEL", icon: Zap, color: "#F0C040", max: 200 },
};

function TypeBadge({ type }) {
    return (
        <span
            className="px-2 py-0.5 rounded text-white text-xs font-semibold tracking-wide uppercase"
            style={{ backgroundColor: TYPE_COLORS[type] ?? "#888", fontSize: "0.65rem" }}
        >
            {TYPE_LABELS[type] ?? type}
        </span>
    );
}

function StatBar({ statName, value }) {
    const cfg = STAT_CONFIG[statName];
    if (!cfg) return null;
    const pct = Math.round((value / cfg.max) * 100);
    const Icon = cfg.icon;
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 w-14 shrink-0">
                <Icon size={11} style={{ color: cfg.color }} />
                <span className="text-[10px] font-bold tracking-wider" style={{ color: cfg.color }}>
                    {cfg.label}
                </span>
            </div>
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cfg.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            </div>
            <span className="text-[10px] font-mono text-white/60 w-7 text-right shrink-0">{value}</span>
        </div>
    );
}

function PokemonCard({ pokemon, onRemove, index }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
            }}
        >
            <button
                onClick={() => onRemove(pokemon.id)}
                className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/80 transition-colors"
            >
                <X size={12} className="text-white" />
            </button>

            <div
                className="absolute top-0 left-0 right-0 h-1 opacity-80"
                style={{
                    background: pokemon.types?.length > 1
                        ? `linear-gradient(to right, ${TYPE_COLORS[pokemon.types[0].type.name]}, ${TYPE_COLORS[pokemon.types[1].type.name]})`
                        : TYPE_COLORS[pokemon.types?.[0]?.type?.name] ?? "#888",
                }}
            />

            <div className="p-3 pt-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 shrink-0">
                        <div
                            className="absolute inset-0 rounded-full opacity-20"
                            style={{ backgroundColor: TYPE_COLORS[pokemon.types?.[0]?.type?.name] ?? "#888" }}
                        />
                        <Image
                            src={pokemon.sprites?.front_default ?? "/placeholder.png"}
                            alt={pokemon.name}
                            width={56}
                            height={56}
                            className="relative z-10 drop-shadow-lg"
                            style={{ imageRendering: "pixelated" }}
                        />
                    </div>
                    <div className="min-w-0">
                        <span className="text-white/40 text-[10px] font-mono block mb-1">
                            #{String(pokemon.id).padStart(3, "0")}
                        </span>
                        <h3 className="text-white font-bold capitalize leading-tight text-sm truncate">
                            {pokemon.name}
                        </h3>
                        <div className="flex gap-1 mt-1 flex-wrap">
                            {pokemon.types?.map((t) => (
                                <TypeBadge key={t.type.name} type={t.type.name} />
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="w-full mt-3 flex items-center justify-center gap-1 text-white/40 hover:text-white/70 transition-colors text-[10px] font-semibold tracking-widest uppercase"
                >
                    {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {expanded ? "Ocultar" : "Stats"}
                </button>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-3 space-y-1.5">
                                {pokemon.stats?.map((s) => (
                                    <StatBar key={s.stat.name} statName={s.stat.name} value={s.base_stat} />
                                ))}
                                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-white/40 text-[10px] uppercase tracking-widest">Total</span>
                                    <span className="text-white font-bold font-mono text-xs">
                                        {pokemon.stats?.reduce((sum, s) => sum + s.base_stat, 0)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function EmptySlot({ index }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl flex flex-col items-center justify-center gap-2 min-h-[110px]"
            style={{
                border: "1.5px dashed rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.02)",
            }}
        >
            <Plus size={18} className="text-white/20" />
            <span className="text-white/20 text-[10px] uppercase tracking-widest font-semibold">Vazio</span>
        </motion.div>
    );
}

function SearchResultItem({ pokemon, onAdd, isOnTeam }) {
    return (
        <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => !isOnTeam && onAdd(pokemon)}
            disabled={isOnTeam}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            whileHover={!isOnTeam ? { backgroundColor: "rgba(255,255,255,0.05)" } : {}}
        >
            <div className="relative w-10 h-10 shrink-0">
                <div
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{ backgroundColor: TYPE_COLORS[pokemon.types?.[0]?.type?.name] ?? "#888" }}
                />
                <Image
                    src={pokemon.sprites?.front_default ?? "/placeholder.png"}
                    alt={pokemon.name}
                    width={40}
                    height={40}
                    style={{ imageRendering: "pixelated" }}
                    className="relative z-10"
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-white font-semibold capitalize text-sm">{pokemon.name}</span>
                    <span className="text-white/30 text-xs font-mono">#{String(pokemon.id).padStart(3, "0")}</span>
                </div>
                <div className="flex gap-1 mt-0.5">
                    {pokemon.types?.map((t) => <TypeBadge key={t.type.name} type={t.type.name} />)}
                </div>
            </div>
            {isOnTeam
                ? <span className="text-white/30 text-[10px] uppercase tracking-wider">No time</span>
                : <Plus size={16} className="text-white/40 shrink-0" />
            }
        </motion.button>
    );
}

export default function TeamBuilder({ onTeamChange }) {
    const [team, setTeam] = useState([]);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => { onTeamChange?.(team); }, [team, onTeamChange]);

    const handleSearch = useCallback(async () => {
        const q = query.trim().toLowerCase();
        if (!q) { setResults([]); return; }
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${q}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setResults([data]);
        } catch {
            setError("Pokémon não encontrado. Tente outro nome ou ID.");
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        const timer = setTimeout(() => { if (query.trim()) handleSearch(); else setResults([]); }, 400);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    const addToTeam = (pokemon) => {
        if (team.length >= 6 || team.find((p) => p.id === pokemon.id)) return;
        setTeam((t) => [...t, pokemon]);
    };

    const removeFromTeam = (id) => setTeam((t) => t.filter((p) => p.id !== id));

    const totalStats = team.reduce((acc, p) => {
        p.stats?.forEach((s) => { acc[s.stat.name] = (acc[s.stat.name] ?? 0) + s.base_stat; });
        return acc;
    }, {});

    return (
        <div
            className="min-h-screen p-6 md:p-8"
            style={{
                background: "linear-gradient(135deg, #0D0D1A 0%, #111827 50%, #0D1020 100%)",
                fontFamily: "'DM Sans', 'Inter', sans-serif",
            }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 rounded-full" style={{ background: "linear-gradient(to bottom, #E85D75, #9B6ED6)" }} />
                        <h1 className="text-2xl font-bold text-white tracking-tight">Team Builder</h1>
                    </div>
                    <p className="text-white/40 text-sm ml-5">Monte seu time com até 6 Pokémon · Busque por nome ou ID</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Seu Time</span>
                            <span
                                className="text-xs font-mono px-2 py-0.5 rounded-full"
                                style={{
                                    background: team.length === 6 ? "rgba(232,93,117,0.2)" : "rgba(255,255,255,0.07)",
                                    color: team.length === 6 ? "#E85D75" : "rgba(255,255,255,0.4)",
                                }}
                            >
                                {team.length} / 6
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <AnimatePresence mode="popLayout">
                                {team.map((p, i) => (
                                    <PokemonCard key={p.id} pokemon={p} onRemove={removeFromTeam} index={i} />
                                ))}
                                {Array.from({ length: 6 - team.length }).map((_, i) => (
                                    <EmptySlot key={`empty-${i}`} index={team.length + i} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {team.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl p-4"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <span className="text-white/40 text-[10px] font-semibold uppercase tracking-widest block mb-3">
                                    Média do Time
                                </span>
                                <div className="space-y-1.5">
                                    {Object.keys(STAT_CONFIG).map((key) => {
                                        const avg = team.length ? Math.round((totalStats[key] ?? 0) / team.length) : 0;
                                        return <StatBar key={key} statName={key} value={avg} />;
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <span className="text-white/60 text-xs font-semibold uppercase tracking-widest block">
                            Buscar Pokémon
                        </span>

                        <div
                            className="relative flex items-center rounded-xl overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                        >
                            <Search size={16} className="absolute left-4 text-white/40 shrink-0" />
                            <input
                                type="text"
                                placeholder="Nome ou número..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="w-full bg-transparent pl-10 pr-10 py-3 text-white placeholder-white/25 text-sm outline-none"
                            />
                            {loading && <Loader2 size={16} className="absolute right-4 text-white/40 animate-spin" />}
                            {!loading && query && (
                                <button onClick={() => { setQuery(""); setResults([]); setError(""); }} className="absolute right-4 text-white/30 hover:text-white/60 transition-colors">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {error && <p className="text-red-400/80 text-xs px-1">{error}</p>}

                        {results.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl overflow-hidden"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}
                            >
                                {results.map((p) => (
                                    <SearchResultItem key={p.id} pokemon={p} onAdd={addToTeam} isOnTeam={!!team.find((t) => t.id === p.id)} />
                                ))}
                            </motion.div>
                        )}

                        {!query && (
                            <div
                                className="rounded-xl p-4"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                            >
                                <p className="text-white/30 text-xs leading-relaxed">
                                    Digite o nome exato ou número do Pokémon. Exemplos:
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {["pikachu", "charizard", "mewtwo", "gengar", "25", "150"].map((hint) => (
                                        <button
                                            key={hint}
                                            onClick={() => setQuery(hint)}
                                            className="px-2.5 py-1 rounded-lg text-white/40 hover:text-white/70 text-xs transition-colors capitalize"
                                            style={{ background: "rgba(255,255,255,0.06)" }}
                                        >
                                            {hint}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {team.length === 6 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-xl p-3 text-center"
                                style={{ background: "rgba(232,93,117,0.1)", border: "1px solid rgba(232,93,117,0.25)" }}
                            >
                                <span className="text-red-400 text-xs font-semibold">
                                    Time completo! Remova um Pokémon para adicionar outro.
                                </span>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}