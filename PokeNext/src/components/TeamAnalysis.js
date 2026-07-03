"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
    AlertTriangle,
    BarChart3,
    ShieldCheck,
    Sparkles,
    UsersRound,
} from "lucide-react";

const STORAGE_KEY = "pokemon-team-builder";

const TYPE_LABELS = {
    bug: "Inseto",
    dragon: "Dragão",
    fairy: "Fada",
    fire: "Fogo",
    ghost: "Fantasma",
    ground: "Terra",
    normal: "Normal",
    psychic: "Psíquico",
    steel: "Aço",
    dark: "Sombrio",
    electric: "Elétrico",
    fighting: "Lutador",
    flying: "Voador",
    grass: "Planta",
    ice: "Gelo",
    poison: "Veneno",
    rock: "Pedra",
    water: "Água",
};

const TYPE_COLORS = {
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
};

const TYPE_WEAKNESSES = {
    normal: ["fighting"],
    fire: ["water", "ground", "rock"],
    water: ["electric", "grass"],
    electric: ["ground"],
    grass: ["fire", "ice", "poison", "flying", "bug"],
    ice: ["fire", "fighting", "rock", "steel"],
    fighting: ["flying", "psychic", "fairy"],
    poison: ["ground", "psychic"],
    ground: ["water", "grass", "ice"],
    flying: ["electric", "ice", "rock"],
    psychic: ["bug", "ghost", "dark"],
    bug: ["fire", "flying", "rock"],
    rock: ["water", "grass", "fighting", "ground", "steel"],
    ghost: ["ghost", "dark"],
    dragon: ["ice", "dragon", "fairy"],
    dark: ["fighting", "bug", "fairy"],
    steel: ["fire", "fighting", "ground"],
    fairy: ["poison", "steel"],
};

const STAT_CONFIG = [
    { name: "hp", label: "HP", shortLabel: "HP" },
    { name: "attack", label: "Ataque", shortLabel: "ATK" },
    { name: "defense", label: "Defesa", shortLabel: "DEF" },
    { name: "special-attack", label: "Atq. Esp.", shortLabel: "SPA" },
    { name: "special-defense", label: "Def. Esp.", shortLabel: "SPD" },
    { name: "speed", label: "Velocidade", shortLabel: "VEL" },
];

function subscribeToStoredTeam(callback) {
    if (typeof window === "undefined") {
        return () => {};
    }

    window.addEventListener("storage", callback);

    return () => {
        window.removeEventListener("storage", callback);
    };
}

function getStoredTeamSnapshot() {
    if (typeof window === "undefined") {
        return "[]";
    }

    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerStoredTeamSnapshot() {
    return "[]";
}

function parseStoredTeam(value) {
    try {
        const parsedTeam = JSON.parse(value);

        if (Array.isArray(parsedTeam)) {
            return parsedTeam.slice(0, 6);
        }

        return [];
    } catch {
        return [];
    }
}

function formatName(name) {
    return String(name || "")
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function getTotalStats(pokemon) {
    return pokemon.stats.reduce((total, item) => total + item.base_stat, 0);
}

function getStat(pokemon, statName) {
    return (
        pokemon.stats.find((item) => item.stat.name === statName)?.base_stat ?? 0
    );
}

function TypeBadge({ type }) {
    return (
        <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: TYPE_COLORS[type] ?? "#737373" }}
        >
            {TYPE_LABELS[type] ?? type}
        </span>
    );
}

function SectionCard({ children, className = "" }) {
    return (
        <div
            className={`
                rounded-[28px] border border-neutral-200 bg-white
                p-5 shadow-sm
                ${className}
            `}
        >
            {children}
        </div>
    );
}

function TacticalMetric({ icon: Icon, label, value, description }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-bold tabular-nums">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-white/55">
                        {description}
                    </p>
                </div>

                <div className="shrink-0 rounded-xl bg-white/10 p-2 text-white">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function StatLine({ shortLabel, label, value }) {
    const width = Math.min(100, Math.round((value / 150) * 100));

    return (
        <div className="cursor-pointer rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2.5 transition hover:border-neutral-200 hover:bg-white hover:shadow-sm">
            <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                        {shortLabel}
                    </p>

                    <p className="truncate text-xs font-medium text-neutral-500">
                        {label}
                    </p>
                </div>

                <span className="shrink-0 text-sm font-bold tabular-nums text-neutral-800">
                    {value}
                </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
                <div
                    className="h-full rounded-full bg-[#E3350D] transition-all"
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}

function EmptyAnalysis() {
    return (
        <section className="rounded-[28px] border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#E3350D] shadow-sm">
                <BarChart3 className="h-7 w-7" />
            </div>

            <h2 className="text-lg font-semibold text-neutral-800">
                Nenhum time para analisar
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-500">
                Adicione Pokémon no Construtor de times para visualizar a
                análise.
            </p>
        </section>
    );
}

function TacticalHeader({ analysisData, teamLength }) {
    return (
        <section className="overflow-hidden rounded-[28px] bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat p-5 shadow-md">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <div className="h-4 w-1.5 rounded-sm bg-[#E3350D] shadow-[0_0_6px_#E3350D]" />

                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                            Painel tático
                        </p>
                    </div>

                    <h2 className="text-2xl font-semibold text-white">
                        Análise de batalha
                    </h2>

                    <p className="mt-1 max-w-2xl text-sm text-white/60">
                        Resumo estratégico do time atual para preparação antes
                        da batalha.
                    </p>
                </div>

                <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-800">
                    {teamLength}/6 Pokémon
                </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <TacticalMetric
                    icon={Sparkles}
                    label="Poder total"
                    value={analysisData.totalPower}
                    description="Soma dos atributos."
                />

                <TacticalMetric
                    icon={ShieldCheck}
                    label="Equilíbrio"
                    value={`${analysisData.balanceScore}%`}
                    description="Distribuição geral."
                />

                <TacticalMetric
                    icon={UsersRound}
                    label="Tipos únicos"
                    value={analysisData.uniqueTypes.length}
                    description="Variedade do time."
                />

                <TacticalMetric
                    icon={AlertTriangle}
                    label="Riscos"
                    value={analysisData.mainWeaknesses.length}
                    description="Fraquezas principais."
                />
            </div>
        </section>
    );
}

function TypeSummary({ uniqueTypes }) {
    return (
        <SectionCard>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                Tipos usados
            </p>

            <p className="mt-1 text-sm text-neutral-500">
                Cobertura principal do time.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {uniqueTypes.map((type) => (
                    <TypeBadge key={type} type={type} />
                ))}
            </div>
        </SectionCard>
    );
}

function WeaknessSummary({ mainWeaknesses }) {
    return (
        <SectionCard>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                Fraquezas principais
            </p>

            {mainWeaknesses.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-500">
                    Nenhuma fraqueza encontrada.
                </p>
            ) : (
                <div className="mt-4 space-y-2">
                    {mainWeaknesses.map(([type, count]) => (
                        <div
                            key={type}
                            className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 transition hover:border-neutral-200 hover:bg-white hover:shadow-sm"
                        >
                            <TypeBadge type={type} />

                            <span className="text-sm font-semibold tabular-nums text-neutral-600">
                                {count}x
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}

function AnalyzedPokemonCard({ pokemon }) {
    const totalStats = getTotalStats(pokemon);

    return (
        <div className="cursor-pointer rounded-2xl border border-neutral-100 bg-neutral-50 p-3 transition hover:border-neutral-200 hover:bg-white hover:shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-mono text-xs font-semibold text-neutral-400">
                        #{String(pokemon.id).padStart(3, "0")}
                    </p>

                    <h4 className="mt-1 font-semibold text-neutral-800">
                        {formatName(pokemon.name)}
                    </h4>
                </div>

                <div className="rounded-xl bg-white px-2.5 py-1.5 text-right shadow-sm">
                    <p className="text-[9px] font-semibold uppercase text-neutral-400">
                        Total
                    </p>

                    <p className="text-xs font-bold tabular-nums text-neutral-800">
                        {totalStats}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
                {pokemon.types.map((item) => (
                    <TypeBadge key={item.type.name} type={item.type.name} />
                ))}
            </div>
        </div>
    );
}

export default function TeamAnalysis({ team = [] }) {
    const storedTeamSnapshot = useSyncExternalStore(
        subscribeToStoredTeam,
        getStoredTeamSnapshot,
        getServerStoredTeamSnapshot
    );

    const savedTeam = useMemo(() => {
        return parseStoredTeam(storedTeamSnapshot);
    }, [storedTeamSnapshot]);

    const analysisTeam = team.length > 0 ? team : savedTeam;

    const analysisData = useMemo(() => {
        if (analysisTeam.length === 0) return null;

        const totalPower = analysisTeam.reduce((total, pokemon) => {
            return total + getTotalStats(pokemon);
        }, 0);

        const allTypes = analysisTeam.flatMap((pokemon) =>
            pokemon.types.map((item) => item.type.name)
        );

        const uniqueTypes = [...new Set(allTypes)];

        const averageStats = STAT_CONFIG.map((stat) => {
            const average = Math.round(
                analysisTeam.reduce((sum, pokemon) => {
                    return sum + getStat(pokemon, stat.name);
                }, 0) / analysisTeam.length
            );

            return {
                ...stat,
                value: average,
            };
        });

        const weaknessCount = {};

        allTypes.forEach((type) => {
            const weaknesses = TYPE_WEAKNESSES[type] ?? [];

            weaknesses.forEach((weakness) => {
                weaknessCount[weakness] = (weaknessCount[weakness] ?? 0) + 1;
            });
        });

        const mainWeaknesses = Object.entries(weaknessCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const balanceScore = Math.min(
            100,
            Math.round(uniqueTypes.length * 10 + analysisTeam.length * 8)
        );

        return {
            totalPower,
            uniqueTypes,
            averageStats,
            mainWeaknesses,
            balanceScore,
        };
    }, [analysisTeam]);

    if (!analysisData) {
        return <EmptyAnalysis />;
    }

    return (
        <section className="space-y-5">
            <TacticalHeader
                analysisData={analysisData}
                teamLength={analysisTeam.length}
            />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
                <SectionCard>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                                Médias do time
                            </p>

                            <h3 className="mt-1 text-lg font-semibold text-neutral-800">
                                Atributos médios
                            </h3>
                        </div>

                        <div className="shrink-0 rounded-xl bg-neutral-100 px-3 py-2 text-right">
                            <p className="text-[10px] font-semibold uppercase text-neutral-400">
                                Pokémon
                            </p>

                            <p className="text-sm font-bold tabular-nums text-neutral-800">
                                {analysisTeam.length}/6
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {analysisData.averageStats.map((item) => (
                            <StatLine
                                key={item.name}
                                shortLabel={item.shortLabel}
                                label={item.label}
                                value={item.value}
                            />
                        ))}
                    </div>
                </SectionCard>

                <aside className="space-y-5">
                    <TypeSummary uniqueTypes={analysisData.uniqueTypes} />

                    <WeaknessSummary
                        mainWeaknesses={analysisData.mainWeaknesses}
                    />
                </aside>
            </div>

            <SectionCard>
                <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        Pokémon analisados
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-neutral-800">
                        Time atual
                    </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {analysisTeam.map((pokemon) => (
                        <AnalyzedPokemonCard
                            key={pokemon.id}
                            pokemon={pokemon}
                        />
                    ))}
                </div>
            </SectionCard>
        </section>
    );
}