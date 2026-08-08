"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
    BrushCleaning,
    Loader2,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { useTeamsApi } from "../hooks/use-teams-api";

const STORAGE_KEY = "pokemon-team-builder";

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
    electric: "bg-[#F8D030] text-white",
    fighting: "bg-[#C03028] text-white",
    flying: "bg-[#A890F0] text-white",
    grass: "bg-[#78C850] text-white",
    ice: "bg-[#98D8D8] text-white",
    poison: "bg-[#A040A0] text-white",
    rock: "bg-[#B8A038] text-white",
    water: "bg-[#6890F0] text-white",
    default: "bg-neutral-400 text-white",
};

const STAT_CONFIG = [
    { code: "hp", label: "HP", shortLabel: "HP" },
    { code: "attack", label: "Ataque", shortLabel: "ATK" },
    { code: "defense", label: "Defesa", shortLabel: "DEF" },
    { code: "special-attack", label: "Atq. Esp.", shortLabel: "SPA" },
    { code: "special-defense", label: "Def. Esp.", shortLabel: "SPD" },
    { code: "speed", label: "Velocidade", shortLabel: "VEL" },
];

function getPokemonImage(pokemon) {
    return pokemon?.image || "/pokeball.png";
}

function getPokemonStat(pokemon, statName) {
    return pokemon.stats.find((item) => item.code === statName)?.value ?? 0;
}

function getPokemonTotalStats(pokemon) {
    return pokemon.stats.reduce((total, item) => total + item.value, 0);
}

function TypeBadge({ type }) {
    return (
        <span
            className={`
                rounded-full px-2.5 py-1
                text-[10px] font-semibold uppercase tracking-wide
                ${TYPE_STYLES[type.code] || TYPE_STYLES.default}
            `}
        >
            {type.label}
        </span>
    );
}

function StatsPanel({ pokemon }) {
    const totalStats = getPokemonTotalStats(pokemon);

    return (
        <div className="mt-4 border-t border-neutral-100 pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        Status base
                    </p>

                    <p className="mt-0.5 text-[11px] text-neutral-400">
                        Atributos principais.
                    </p>
                </div>

                <div className="shrink-0 rounded-xl bg-neutral-100 px-2.5 py-1.5 text-right">
                    <p className="text-[9px] font-semibold uppercase text-neutral-400">
                        Total
                    </p>

                    <p className="text-xs font-bold tabular-nums text-neutral-800">
                        {totalStats}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
                {STAT_CONFIG.map((stat) => {
                    const value = getPokemonStat(pokemon, stat.code);
                    const percent = Math.min(
                        100,
                        Math.round((value / 150) * 100)
                    );

                    return (
                        <div
                            key={stat.code}
                            className="
                                cursor-pointer rounded-xl border border-neutral-100
                                bg-neutral-50 px-2 py-2 transition
                                hover:border-neutral-200 hover:bg-white hover:shadow-sm
                            "
                        >
                            <div className="mb-1 flex items-center justify-between gap-2">
                                <span className="truncate text-[9px] font-bold uppercase tracking-wide text-neutral-400">
                                    {stat.shortLabel}
                                </span>

                                <span className="shrink-0 text-sm font-bold leading-none tabular-nums text-neutral-800">
                                    {value}
                                </span>
                            </div>

                            <p className="mb-1.5 truncate text-[10px] font-medium text-neutral-500">
                                {stat.label}
                            </p>

                            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
                                <div
                                    className="h-full rounded-full bg-[#E3350D] transition-all"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function EmptySlot({ index }) {
    return (
        <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[28px] border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <Image
                    src="/pokeball.png"
                    alt=""
                    width={36}
                    height={36}
                    className="opacity-35"
                />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                Espaço {index}
            </p>

            <p className="mt-1 text-sm text-neutral-500">
                Adicione um Pokémon
            </p>
        </div>
    );
}

function PokemonTeamCard({ pokemon, onRemove }) {
    return (
        <article className="group relative min-h-[380px] overflow-hidden rounded-[28px] border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <button
                type="button"
                onClick={() => onRemove(pokemon.id)}
                className="absolute right-3 top-3 z-10 cursor-pointer rounded-full bg-white/90 p-1.5 text-neutral-400 shadow-sm transition hover:bg-red-50 hover:text-[#E3350D]"
                title="Remover Pokémon"
            >
                <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-28 w-28 items-center justify-center rounded-full bg-neutral-50">
                    <Image
                        src={getPokemonImage(pokemon)}
                        alt={pokemon.displayName || "Pokémon"}
                        width={112}
                        height={112}
                        className="h-28 w-28 object-contain transition group-hover:scale-105"
                    />
                </div>

                <p className="font-mono text-xs font-semibold text-neutral-400">
                    #{String(pokemon.id).padStart(3, "0")}
                </p>

                <h3 className="mt-1 text-base font-semibold text-neutral-800">
                    {pokemon.displayName || "Pokémon"}
                </h3>

                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {pokemon.types.map((item) => (
                        <TypeBadge
                            key={item.code}
                            type={item}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-2xl bg-neutral-50 p-2">
                    <p className="text-[10px] font-semibold uppercase text-neutral-400">
                        Altura
                    </p>

                    <p className="text-sm font-semibold text-neutral-700">
                        {(pokemon.height / 10).toFixed(1)}m
                    </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-2">
                    <p className="text-[10px] font-semibold uppercase text-neutral-400">
                        Peso
                    </p>

                    <p className="text-sm font-semibold text-neutral-700">
                        {(pokemon.weight / 10).toFixed(1)}kg
                    </p>
                </div>
            </div>

            <StatsPanel pokemon={pokemon} />
        </article>
    );
}

function SearchCard({
    search,
    suggestions,
    loading,
    error,
    onSearchChange,
    onSearch,
    onSuggestionClick,
    onClearSearch,
}) {
    return (
        <div className="relative z-20 w-full rounded-2xl bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat px-5 py-5 shadow-md backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
                <div className="h-4 w-1.5 rounded-sm bg-[#E3350D] shadow-[0_0_6px_#E3350D]" />

                <label className="block text-lg font-medium text-white">
                    Nome ou número
                </label>
            </div>

            <div className="space-y-3">
                <div className="relative w-full">
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                onSearch();
                            }
                        }}
                        placeholder="Ex: pikachu ou 25"
                        className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-[#E3350D]/70"
                    />

                    {suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
                            {suggestions.map((pokemonName) => (
                                <button
                                    key={pokemonName.apiName}
                                    type="button"
                                    onClick={() =>
                                        onSuggestionClick(pokemonName.apiName)
                                    }
                                    className="w-full cursor-pointer px-4 py-2 text-left text-sm capitalize text-neutral-700 transition hover:bg-neutral-100"
                                >
                                    {pokemonName.displayName}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onSearch}
                        disabled={loading}
                        className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-md bg-[#E3350D] text-white transition hover:bg-[#c52c0b] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Buscar"
                        title="Buscar"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Search className="h-5 w-5" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onClearSearch}

                        className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/15 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Limpar busca"
                        title="Limpar busca"
                    >
                        <BrushCleaning className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <p className="mt-3 text-sm text-white">
                Use a busca avançada para explorar Pokémon por tipo, fraqueza,
                habilidade e mais!
            </p>

            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>
    );
}

function PreviewCard({ pokemonResult, team, onAddPokemon }) {
    const pokemonAlreadyInTeam = pokemonResult
        ? team.some((pokemon) => pokemon.id === pokemonResult.id)
        : false;

    const teamIsFull = team.length >= 6;

    function getButtonText() {
        if (teamIsFull) return "Time completo";
        if (pokemonAlreadyInTeam) return "Já está no time";

        return "Adicionar ao time";
    }

    return (
        <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
            {!pokemonResult ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[24px] border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                        <Image
                            src="/pokeball.png"
                            alt=""
                            width={34}
                            height={34}
                            className="opacity-35"
                        />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        Aguardando busca
                    </p>

                    <p className="mt-1 text-sm text-neutral-500">
                        O Pokémon encontrado aparecerá aqui.
                    </p>
                </div>
            ) : (
                <div>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-3 flex h-32 w-32 items-center justify-center rounded-full bg-neutral-50">
                            <Image
                                src={getPokemonImage(pokemonResult)}
                                alt={pokemonResult.displayName || "Pokémon"}
                                width={128}
                                height={128}
                                className="h-32 w-32 object-contain"
                            />
                        </div>

                        <p className="font-mono text-xs font-semibold text-neutral-400">
                            #{String(pokemonResult.id).padStart(3, "0")}
                        </p>

                        <h4 className="mt-1 text-lg font-semibold text-neutral-800">
                            {pokemonResult.displayName || "Pokémon"}
                        </h4>

                        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                            {pokemonResult.types.map((item) => (
                                <TypeBadge
                                    key={item.code}
                                    type={item}
                                />
                            ))}
                        </div>
                    </div>

                    <StatsPanel pokemon={pokemonResult} />

                    <button
                        type="button"
                        onClick={() => onAddPokemon(pokemonResult)}
                        disabled={teamIsFull || pokemonAlreadyInTeam}
                        className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#E3350D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c92d0b] disabled:cursor-not-allowed disabled:bg-neutral-300"
                    >
                        <Plus className="h-4 w-4" />
                        {getButtonText()}
                    </button>
                </div>
            )}
        </div>
    );
}

function SearchPanel({
    search,
    pokemonResult,
    suggestions,
    loading,
    error,
    team,
    onSearchChange,
    onSearch,
    onSuggestionClick,
    onAddPokemon,
    onClearSearch,
    onClearTeam,
}) {
    return (
        <aside className="space-y-4">
            <SearchCard
                search={search}
                suggestions={suggestions}
                loading={loading}
                error={error}
                onSearchChange={onSearchChange}
                onSearch={onSearch}
                onSuggestionClick={onSuggestionClick}
                onClearSearch={onClearSearch}
            />

            <PreviewCard
                pokemonResult={pokemonResult}
                team={team}
                onAddPokemon={onAddPokemon}
            />

            <button
                type="button"
                onClick={onClearTeam}
                disabled={team.length === 0}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[20px] border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-600 shadow-sm transition hover:border-[#E3350D] hover:text-[#E3350D] disabled:cursor-not-allowed disabled:opacity-40"
            >
                <Trash2 className="h-4 w-4" />
                Limpar time
            </button>
        </aside>
    );
}

export default function TeamBuilder({ onTeamChange }) {
    const {
        addPokemonToTeam,
        clearStoredTeam,
        findExactPokemon,
        listPokemon,
        loadPokemon,
        loadStoredTeam,
        normalizeSearchValue,
        rankPokemonSuggestions,
        removePokemonFromTeam,
        saveStoredTeam,
    } = useTeamsApi();
    const [team, setTeam] = useState([]);
    const [search, setSearch] = useState("");
    const [pokemonResult, setPokemonResult] = useState(null);
    const [pokemonNames, setPokemonNames] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasHydrated, setHasHydrated] = useState(false);

    const requestIdRef = useRef(0);
    const lastAutoSearchRef = useRef("");

    const fetchPokemon = useCallback(async (searchValue) => {
        const value = normalizeSearchValue(searchValue);

        if (!value) return;

        const currentRequestId = requestIdRef.current + 1;
        requestIdRef.current = currentRequestId;

        try {
            setLoading(true);
            setError("");

            const data = await loadPokemon(value);

            if (requestIdRef.current !== currentRequestId) return;

            setPokemonResult(data);
            setSuggestions([]);
        } catch {
            if (requestIdRef.current !== currentRequestId) return;

            setPokemonResult(null);
            setError(
                "Pokémon não encontrado. Tente buscar pelo nome ou pelo número da Pokédex."
            );
        } finally {
            if (requestIdRef.current === currentRequestId) {
                setLoading(false);
            }
        }
    }, [loadPokemon, normalizeSearchValue]);

    useEffect(() => {
        let alive = true;

        async function loadPokemonNames() {
            try {
                const data = await listPokemon();

                if (!alive) return;

                setPokemonNames(Array.isArray(data) ? data : []);
            } catch {
                setPokemonNames([]);
            }
        }

        loadPokemonNames();

        return () => {
            alive = false;
        };
    }, [listPokemon]);

    useEffect(() => {
        try {
            setTeam(loadStoredTeam(STORAGE_KEY));
        } catch {
            clearStoredTeam(STORAGE_KEY);
        } finally {
            setHasHydrated(true);
        }
    }, [clearStoredTeam, loadStoredTeam]);

    useEffect(() => {
        onTeamChange?.(team);
    }, [team, onTeamChange]);

    useEffect(() => {
        if (!hasHydrated) return;

        if (team.length === 0) {
            clearStoredTeam(STORAGE_KEY);
            return;
        }

        saveStoredTeam(STORAGE_KEY, team);
    }, [team, hasHydrated, clearStoredTeam, saveStoredTeam]);

    useEffect(() => {
        const value = normalizeSearchValue(search);

        setError("");
        setPokemonResult(null);

        if (!value) {
            setSuggestions([]);
            lastAutoSearchRef.current = "";
            return;
        }

        const timer = window.setTimeout(() => {
            const isNumberSearch = /^\d+$/.test(value);

            if (isNumberSearch) {
                setSuggestions([]);

                if (lastAutoSearchRef.current !== value) {
                    lastAutoSearchRef.current = value;
                    fetchPokemon(value);
                }

                return;
            }

            setSuggestions(rankPokemonSuggestions(pokemonNames, value));

            const exactPokemon = findExactPokemon(pokemonNames, value);

            if (exactPokemon && lastAutoSearchRef.current !== exactPokemon.apiName) {
                lastAutoSearchRef.current = exactPokemon.apiName;
                fetchPokemon(exactPokemon.apiName);
            }
        }, 120);

        return () => {
            window.clearTimeout(timer);
        };
    }, [
        search,
        pokemonNames,
        fetchPokemon,
        findExactPokemon,
        normalizeSearchValue,
        rankPokemonSuggestions,
    ]);

    const emptySlots = useMemo(() => {
        return Array.from({ length: 6 - team.length });
    }, [team.length]);

    function handleManualSearch() {
        const value = normalizeSearchValue(search);

        if (!value) return;

        lastAutoSearchRef.current = value;
        fetchPokemon(value);
    }

    function handleSuggestionClick(pokemonName) {
        setSearch(pokemonName);
        setSuggestions([]);
        setError("");
        lastAutoSearchRef.current = pokemonName;
        fetchPokemon(pokemonName);
    }

    function handleAddPokemon(pokemon) {
        const nextTeam = addPokemonToTeam(team, pokemon);
        if (nextTeam === team) return;

        setTeam(nextTeam);
        setPokemonResult(null);
        setSuggestions([]);
        setSearch("");
        setError("");
        lastAutoSearchRef.current = "";
    }

    function handleRemovePokemon(id) {
        setTeam((currentTeam) =>
            removePokemonFromTeam(currentTeam, id)
        );
    }

    function handleClearSearch() {
        setSearch("");
        setPokemonResult(null);
        setSuggestions([]);
        setError("");
        lastAutoSearchRef.current = "";
    }

    function handleClearTeam() {
        setTeam([]);
        setSearch("");
        setPokemonResult(null);
        setSuggestions([]);
        setError("");
        lastAutoSearchRef.current = "";
        clearStoredTeam(STORAGE_KEY);
    }

    return (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((pokemon) => (
                    <PokemonTeamCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        onRemove={handleRemovePokemon}
                    />
                ))}

                {emptySlots.map((_, index) => (
                    <EmptySlot
                        key={`empty-slot-${index}`}
                        index={team.length + index + 1}
                    />
                ))}
            </div>

            <SearchPanel
                search={search}
                pokemonResult={pokemonResult}
                suggestions={suggestions}
                loading={loading}
                error={error}
                team={team}
                onSearchChange={setSearch}
                onSearch={handleManualSearch}
                onSuggestionClick={handleSuggestionClick}
                onAddPokemon={handleAddPokemon}
                onClearSearch={handleClearSearch}
                onClearTeam={handleClearTeam}
            />
        </section>
    );
}
