"use client";

import { AlertTriangle, BarChart3, ShieldCheck, Sparkles } from "lucide-react";

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

const STAT_LABELS = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    "special-attack": "Atq. Esp.",
    "special-defense": "Def. Esp.",
    speed: "Velocidade",
};

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
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase text-white"
            style={{ backgroundColor: TYPE_COLORS[type] ?? "#737373" }}
        >
            {TYPE_LABELS[type] ?? type}
        </span>
    );
}

function SimpleCard({ icon: Icon, title, value, description }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#E3350D]/10 p-2 text-[#E3350D]">
                    <Icon className="h-5 w-5" />
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase text-neutral-400">
                        {title}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-neutral-800">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

function StatLine({ label, value }) {
    const width = Math.min(100, Math.round((value / 150) * 100));

    return (
        <div>
            <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-neutral-600">{label}</span>
                <span className="font-semibold text-neutral-700">{value}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                <div
                    className="h-full rounded-full bg-[#E3350D]"
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}

export default function TeamAnalysis({ team = [] }) {
    if (team.length === 0) {
        return (
            <section className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#E3350D] shadow-sm">
                    <BarChart3 className="h-7 w-7" />
                </div>

                <h2 className="text-lg font-semibold text-neutral-800">
                    Nenhum time para analisar
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-500">
                    Adicione Pokémon no Construtor de times para visualizar a análise.
                </p>
            </section>
        );
    }

    const totalPower = team.reduce((total, pokemon) => {
        return total + getTotalStats(pokemon);
    }, 0);

    const allTypes = team.flatMap((pokemon) =>
        pokemon.types.map((item) => item.type.name)
    );

    const uniqueTypes = [...new Set(allTypes)];

    const averageStats = Object.keys(STAT_LABELS).map((statName) => {
        const average = Math.round(
            team.reduce((sum, pokemon) => sum + getStat(pokemon, statName), 0) /
            team.length
        );

        return {
            statName,
            label: STAT_LABELS[statName],
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
        Math.round(uniqueTypes.length * 10 + team.length * 8)
    );

    return (
        <section className="space-y-5">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-4">
                    <h2 className="text-xl font-semibold text-neutral-800">
                        Análise de times
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                        Uma visão simples do equilíbrio, força e fraquezas do seu time.
                    </p>
                </div>

                <div className="p-5">
                    <div className="grid gap-4 md:grid-cols-3">
                        <SimpleCard
                            icon={Sparkles}
                            title="Equilíbrio"
                            value={`${balanceScore}%`}
                            description="Estimativa geral do time."
                        />

                        <SimpleCard
                            icon={ShieldCheck}
                            title="Tipos únicos"
                            value={uniqueTypes.length}
                            description="Variedade de tipos no time."
                        />

                        <SimpleCard
                            icon={AlertTriangle}
                            title="Fraquezas"
                            value={mainWeaknesses.length}
                            description="Principais riscos encontrados."
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-neutral-800">
                        Médias do time
                    </h3>

                    <p className="mt-1 text-sm text-neutral-500">
                        Média dos principais atributos dos Pokémon escolhidos.
                    </p>

                    <div className="mt-5 space-y-3">
                        {averageStats.map((item) => (
                            <StatLine
                                key={item.statName}
                                label={item.label}
                                value={item.value}
                            />
                        ))}
                    </div>
                </div>

                <aside className="space-y-5">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-neutral-800">
                            Resumo
                        </h3>

                        <div className="mt-4 rounded-2xl bg-[#E3350D]/10 p-4">
                            <p className="text-xs font-semibold uppercase text-[#E3350D]">
                                Poder total
                            </p>

                            <p className="mt-1 text-3xl font-bold text-neutral-800">
                                {totalPower}
                            </p>
                        </div>

                        <div className="mt-4">
                            <p className="mb-2 text-sm font-semibold text-neutral-700">
                                Tipos usados
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {uniqueTypes.map((type) => (
                                    <TypeBadge key={type} type={type} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-neutral-800">
                            Fraquezas principais
                        </h3>

                        {mainWeaknesses.length === 0 ? (
                            <p className="mt-2 text-sm text-neutral-500">
                                Nenhuma fraqueza encontrada.
                            </p>
                        ) : (
                            <div className="mt-4 space-y-2">
                                {mainWeaknesses.map(([type, count]) => (
                                    <div
                                        key={type}
                                        className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2"
                                    >
                                        <TypeBadge type={type} />

                                        <span className="text-sm font-semibold text-neutral-600">
                                            {count}x
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-800">
                    Pokémon analisados
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {team.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3"
                        >
                            <p className="font-mono text-xs font-semibold text-neutral-400">
                                #{String(pokemon.id).padStart(3, "0")}
                            </p>

                            <h4 className="mt-1 font-semibold text-neutral-800">
                                {formatName(pokemon.name)}
                            </h4>

                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {pokemon.types.map((item) => (
                                    <TypeBadge
                                        key={item.type.name}
                                        type={item.type.name}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}