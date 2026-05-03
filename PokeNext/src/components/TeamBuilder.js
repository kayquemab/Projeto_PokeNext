"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
    Loader2,
    Plus,
    Search,
    Shield,
    Swords,
    Trash2,
    X,
    Zap,
} from "lucide-react";

const TYPE_STYLES = {
    bug: "bg-[#A8B820] text-white",
    dragon: "bg-[#7038F8] text-white",
    fairy: "bg-[#EE99AC] text-white",
    fire: "bg-[#F08030] text-white",
    ghost: "bg-[#705898] text-white",
    ground: "bg-[#E0C068] text-white",
    normal: "bg-[#A8A878] text-white",
    psychic: "bg-[#F85888] text-white",
    steel: "bg-[#B8B8D0] text-white",
    dark: "bg-[#705848] text-white",
    electric: "bg-[#F8D030] text-neutral-900",
    fighting: "bg-[#C03028] text-white",
    flying: "bg-[#A890F0] text-white",
    grass: "bg-[#78C850] text-white",
    ice: "bg-[#98D8D8] text-neutral-900",
    poison: "bg-[#A040A0] text-white",
    rock: "bg-[#B8A038] text-white",
    water: "bg-[#6890F0] text-white",
};

const STAT_LABELS = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    "special-attack": "Atq. Esp.",
    "special-defense": "Def. Esp.",
    speed: "Velocidade",
};

const QUICK_SEARCH = [
    "pikachu",
    "charizard",
    "gengar",
    "lucario",
    "dragonite",
    "greninja",
];

function formatName(name) {
    return String(name || "")
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function getPokemonImage(pokemon) {
    return (
        pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
        pokemon?.sprites?.front_default ||
        "/pokeball.png"
    );
}

function getPokemonTotalStats(pokemon) {
    return pokemon.stats.reduce((total, item) => total + item.base_stat, 0);
}

function getPokemonStat(pokemon, statName) {
    return (
        pokemon.stats.find((item) => item.stat.name === statName)?.base_stat ?? 0
    );
}

function TypeBadge({ type }) {
    return (
        <span
            className={`
                rounded-full px-2 py-0.5
                text-[10px] font-semibold uppercase tracking-wide
                ${TYPE_STYLES[type] || "bg-neutral-400 text-white"}
            `}
        >
            {type}
        </span>
    );
}

function StatBar({ label, value }) {
    const percent = Math.min(100, Math.round((value / 150) * 100));

    return (
        <div>
            <div className="mb-1 flex items-center justify-between text-[11px] text-neutral-600">
                <span>{label}</span>
                <span className="font-semibold text-neutral-700">{value}</span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
                <div
                    className="h-full rounded-full bg-[#E3350D]"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

function EmptySlot({ index }) {
    return (
        <div className="flex min-h-[230px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Image
                    src="/pokeball.png"
                    alt=""
                    width={34}
                    height={34}
                    className="opacity-40"
                />
            </div>

            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Espaço {index + 1}
            </p>

            <p className="mt-1 text-xs text-neutral-400">
                Adicione um Pokémon
            </p>
        </div>
    );
}

function PokemonCard({ pokemon, onRemove }) {
    const totalStats = getPokemonTotalStats(pokemon);

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="font-mono text-xs font-semibold text-neutral-400">
                            #{String(pokemon.id).padStart(3, "0")}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-neutral-800">
                            {formatName(pokemon.name)}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {pokemon.types.map((item) => (
                                <TypeBadge
                                    key={item.type.name}
                                    type={item.type.name}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onRemove(pokemon.id)}
                        className="rounded-full p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-[#E3350D]"
                        title="Remover Pokémon"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="my-4 flex justify-center rounded-2xl bg-neutral-50 p-3">
                    <Image
                        src={getPokemonImage(pokemon)}
                        alt={pokemon.name}
                        width={130}
                        height={130}
                        className="h-[130px] w-[130px] object-contain"
                    />
                </div>

                <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-neutral-50 p-2">
                        <p className="text-[10px] font-semibold uppercase text-neutral-400">
                            Altura
                        </p>
                        <p className="text-sm font-semibold text-neutral-700">
                            {(pokemon.height / 10).toFixed(1)}m
                        </p>
                    </div>

                    <div className="rounded-xl bg-neutral-50 p-2">
                        <p className="text-[10px] font-semibold uppercase text-neutral-400">
                            Peso
                        </p>
                        <p className="text-sm font-semibold text-neutral-700">
                            {(pokemon.weight / 10).toFixed(1)}kg
                        </p>
                    </div>

                    <div className="rounded-xl bg-neutral-50 p-2">
                        <p className="text-[10px] font-semibold uppercase text-neutral-400">
                            Total
                        </p>
                        <p className="text-sm font-semibold text-neutral-700">
                            {totalStats}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    {Object.keys(STAT_LABELS).map((statName) => (
                        <StatBar
                            key={statName}
                            label={STAT_LABELS[statName]}
                            value={getPokemonStat(pokemon, statName)}
                        />
                    ))}
                </div>
            </div>
        </motion.article>
    );
}

export default function TeamBuilder({ onTeamChange }) {
    const [team, setTeam] = useState([]);
    const [search, setSearch] = useState("");
    const [pokemonResult, setPokemonResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        onTeamChange?.(team);
    }, [team, onTeamChange]);

    const teamTotalStats = useMemo(() => {
        return team.reduce((total, pokemon) => {
            return total + getPokemonTotalStats(pokemon);
        }, 0);
    }, [team]);

    async function handleSearchPokemon() {
        const value = search.trim().toLowerCase();

        if (!value) return;

        try {
            setLoading(true);
            setError("");
            setPokemonResult(null);

            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${value}`
            );

            if (!response.ok) {
                throw new Error("Pokémon não encontrado.");
            }

            const data = await response.json();
            setPokemonResult(data);
        } catch {
            setError(
                "Pokémon não encontrado. Tente buscar pelo nome em inglês ou pelo número da Pokédex."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleAddPokemon(pokemon) {
        const alreadyExists = team.some((item) => item.id === pokemon.id);

        if (alreadyExists || team.length >= 6) return;

        setTeam((currentTeam) => [...currentTeam, pokemon]);
        setPokemonResult(null);
        setSearch("");
    }

    function handleRemovePokemon(id) {
        setTeam((currentTeam) =>
            currentTeam.filter((pokemon) => pokemon.id !== id)
        );
    }

    function handleClearTeam() {
        setTeam([]);
        setPokemonResult(null);
        setSearch("");
        setError("");
    }

    return (
        <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-neutral-800">
                            Construtor de times
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                            Monte seu time com até 6 Pokémon.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#E3350D]/10 px-3 py-1 text-sm font-semibold text-[#E3350D]">
                            {team.length}/6
                        </span>

                        <button
                            type="button"
                            onClick={handleClearTeam}
                            disabled={team.length === 0}
                            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-600 transition hover:border-[#E3350D] hover:text-[#E3350D] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Trash2 className="h-4 w-4" />
                            Limpar
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-[1fr_330px]">
                <div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {team.map((pokemon) => (
                                <PokemonCard
                                    key={pokemon.id}
                                    pokemon={pokemon}
                                    onRemove={handleRemovePokemon}
                                />
                            ))}

                            {Array.from({ length: 6 - team.length }).map(
                                (_, index) => (
                                    <EmptySlot
                                        key={`empty-${index}`}
                                        index={team.length + index}
                                    />
                                )
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                        <h3 className="text-base font-semibold text-neutral-800">
                            Buscar Pokémon
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500">
                            Digite o nome em inglês ou número da Pokédex.
                        </p>

                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSearchPokemon();
                                    }
                                }}
                                placeholder="Ex: pikachu ou 25"
                                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-10 text-sm text-neutral-700 outline-none transition focus:border-[#E3350D] focus:ring-2 focus:ring-[#E3350D]/20"
                            />

                            <button
                                type="button"
                                onClick={handleSearchPokemon}
                                disabled={loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-[#E3350D]"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {QUICK_SEARCH.map((pokemonName) => (
                                <button
                                    key={pokemonName}
                                    type="button"
                                    onClick={() => setSearch(pokemonName)}
                                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-600 transition hover:bg-[#E3350D]/10 hover:text-[#E3350D]"
                                >
                                    {pokemonName}
                                </button>
                            ))}
                        </div>

                        {error && (
                            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        {pokemonResult && (
                            <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-white p-2 shadow-sm">
                                        <Image
                                            src={getPokemonImage(pokemonResult)}
                                            alt={pokemonResult.name}
                                            width={72}
                                            height={72}
                                            className="h-[72px] w-[72px] object-contain"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-mono text-xs font-semibold text-neutral-400">
                                            #
                                            {String(
                                                pokemonResult.id
                                            ).padStart(3, "0")}
                                        </p>

                                        <h4 className="truncate font-semibold text-neutral-800">
                                            {formatName(pokemonResult.name)}
                                        </h4>

                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {pokemonResult.types.map((item) => (
                                                <TypeBadge
                                                    key={item.type.name}
                                                    type={item.type.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddPokemon(pokemonResult)
                                    }
                                    disabled={
                                        team.length >= 6 ||
                                        team.some(
                                            (item) =>
                                                item.id === pokemonResult.id
                                        )
                                    }
                                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E3350D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c92d0b] disabled:cursor-not-allowed disabled:bg-neutral-300"
                                >
                                    <Plus className="h-4 w-4" />
                                    Adicionar ao time
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                        <h3 className="text-base font-semibold text-neutral-800">
                            Resumo do time
                        </h3>

                        {team.length === 0 ? (
                            <p className="mt-2 text-sm text-neutral-500">
                                Adicione Pokémon para visualizar o resumo.
                            </p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                <div className="rounded-2xl bg-[#E3350D]/10 p-4">
                                    <p className="text-xs font-semibold uppercase text-[#E3350D]">
                                        Poder total
                                    </p>

                                    <p className="mt-1 text-3xl font-bold text-neutral-800">
                                        {teamTotalStats}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="rounded-xl bg-neutral-50 p-3 text-center">
                                        <Swords className="mx-auto h-4 w-4 text-[#E3350D]" />
                                        <p className="mt-1 text-xs text-neutral-500">
                                            Ataque
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-neutral-50 p-3 text-center">
                                        <Shield className="mx-auto h-4 w-4 text-[#E3350D]" />
                                        <p className="mt-1 text-xs text-neutral-500">
                                            Defesa
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-neutral-50 p-3 text-center">
                                        <Zap className="mx-auto h-4 w-4 text-[#E3350D]" />
                                        <p className="mt-1 text-xs text-neutral-500">
                                            Velocidade
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </section>
    );
}