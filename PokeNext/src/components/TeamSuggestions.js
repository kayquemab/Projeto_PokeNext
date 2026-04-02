"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Shield, Zap, Heart, Star } from "lucide-react";
import Image from "next/image";

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

const ROLE_ICONS = {
    sweeper: Zap,
    tank: Shield,
    wall: Heart,
    attacker: Star,
};

const SAMPLE_TEAMS = [
    {
        name: "Equipe Ofensiva",
        description: "Time focado em ataque rápido e cobertura de tipos variada.",
        roles: ["sweeper", "attacker", "attacker", "sweeper", "tank", "wall"],
        pokemon: [
            { id: 6, name: "charizard", types: [{ type: { name: "fire" } }, { type: { name: "flying" } }], role: "sweeper" },
            { id: 25, name: "pikachu", types: [{ type: { name: "electric" } }], role: "attacker" },
            { id: 9, name: "blastoise", types: [{ type: { name: "water" } }], role: "attacker" },
            { id: 150, name: "mewtwo", types: [{ type: { name: "psychic" } }], role: "sweeper" },
            { id: 144, name: "articuno", types: [{ type: { name: "ice" } }, { type: { name: "flying" } }], role: "tank" },
            { id: 145, name: "zapdos", types: [{ type: { name: "electric" } }, { type: { name: "flying" } }], role: "wall" },
        ],
    },
    {
        name: "Equipe Defensiva",
        description: "Time resistente com boa cobertura de tipos e habilidades defensivas.",
        roles: ["wall", "tank", "wall", "tank", "attacker", "sweeper"],
        pokemon: [
            { id: 3, name: "venusaur", types: [{ type: { name: "grass" } }, { type: { name: "poison" } }], role: "wall" },
            { id: 248, name: "tyranitar", types: [{ type: { name: "rock" } }, { type: { name: "dark" } }], role: "tank" },
            { id: 208, name: "steelix", types: [{ type: { name: "steel" } }, { type: { name: "ground" } }], role: "wall" },
            { id: 143, name: "snorlax", types: [{ type: { name: "normal" } }], role: "tank" },
            { id: 68, name: "machamp", types: [{ type: { name: "fighting" } }], role: "attacker" },
            { id: 130, name: "gyarados", types: [{ type: { name: "water" } }, { type: { name: "flying" } }], role: "sweeper" },
        ],
    },
    {
        name: "Equipe Balanceada",
        description: "Time equilibrado com mix de ofensivo e defensivo.",
        roles: ["sweeper", "attacker", "tank", "wall", "attacker", "sweeper"],
        pokemon: [
            { id: 65, name: "alakazam", types: [{ type: { name: "psychic" } }], role: "sweeper" },
            { id: 59, name: "arcanine", types: [{ type: { name: "fire" } }], role: "attacker" },
            { id: 112, name: "rhydon", types: [{ type: { name: "ground" } }, { type: { name: "rock" } }], role: "tank" },
            { id: 36, name: "clefable", types: [{ type: { name: "fairy" } }], role: "wall" },
            { id: 103, name: "exeggutor", types: [{ type: { name: "grass" } }, { type: { name: "psychic" } }], role: "attacker" },
            { id: 134, name: "vaporeon", types: [{ type: { name: "water" } }], role: "sweeper" },
        ],
    },
];

export default function TeamSuggestions({ team }) {
    const [selectedTeam, setSelectedTeam] = useState(null);

    const suggestions = useMemo(() => {
        if (!team.length) return SAMPLE_TEAMS;

        // Análise básica do time atual
        const currentTypes = new Set();
        const currentRoles = { sweeper: 0, attacker: 0, tank: 0, wall: 0 };

        team.forEach(pokemon => {
            pokemon.types?.forEach(type => currentTypes.add(type.type.name));
            // Simulação de roles baseada em stats (simplificada)
            const stats = pokemon.stats || [];
            const attack = stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
            const spAttack = stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0;
            const defense = stats.find(s => s.stat.name === 'defense')?.base_stat || 0;
            const spDefense = stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0;
            const speed = stats.find(s => s.stat.name === 'speed')?.base_stat || 0;

            if (speed > 80) currentRoles.sweeper++;
            else if (attack > 80 || spAttack > 80) currentRoles.attacker++;
            else if (defense > 80 || spDefense > 80) currentRoles.tank++;
            else currentRoles.wall++;
        });

        // Sugestões baseadas na análise
        const suggestions = [];

        if (currentTypes.size < 4) {
            suggestions.push({
                type: "diversity",
                title: "Aumente a Diversidade de Tipos",
                description: "Seu time tem poucos tipos. Adicione Pokémon de tipos diferentes para melhor cobertura.",
                pokemon: ["dragonite", "salamence", "metagross", "slaking"],
            });
        }

        if (currentRoles.sweeper < 2) {
            suggestions.push({
                type: "speed",
                title: "Adicione Velocidade",
                description: "Pokémon rápidos podem atacar primeiro e causar dano significativo.",
                pokemon: ["aerodactyl", "electrode", "jolteon", "ninjask"],
            });
        }

        if (currentRoles.tank < 2) {
            suggestions.push({
                type: "defense",
                title: "Fortaleça a Defesa",
                description: "Pokémon resistentes podem aguentar ataques e proteger o time.",
                pokemon: ["aggron", "blissey", "forretress", "umbreon"],
            });
        }

        return suggestions.length ? suggestions : SAMPLE_TEAMS.slice(0, 2);
    }, [team]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="text-yellow-500" />
                    Sugestões para seu Time
                </h3>
                <div className="grid gap-4">
                    {suggestions.map((suggestion, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                            <h4 className="font-semibold text-lg mb-2">{suggestion.title || suggestion.name}</h4>
                            <p className="text-gray-600 mb-3">{suggestion.description}</p>
                            {suggestion.pokemon && (
                                <div className="flex flex-wrap gap-2">
                                    {suggestion.pokemon.map((name) => (
                                        <span
                                            key={name}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize"
                                        >
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {suggestion.roles && (
                                <div className="flex gap-2 mt-3">
                                    {suggestion.roles.map((role, i) => {
                                        const Icon = ROLE_ICONS[role];
                                        return (
                                            <div key={i} className="flex items-center gap-1 text-sm">
                                                <Icon size={16} />
                                                <span className="capitalize">{role}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Times de Exemplo</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {SAMPLE_TEAMS.map((sampleTeam, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedTeam(sampleTeam)}
                        >
                            <h4 className="font-semibold text-lg mb-2">{sampleTeam.name}</h4>
                            <p className="text-gray-600 text-sm mb-3">{sampleTeam.description}</p>
                            <div className="grid grid-cols-2 gap-2">
                                {sampleTeam.pokemon.slice(0, 4).map((pokemon) => (
                                    <div key={pokemon.id} className="text-center">
                                        <div className="w-12 h-12 mx-auto mb-1 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-semibold capitalize">{pokemon.name.slice(0, 3)}</span>
                                        </div>
                                        <div className="flex justify-center gap-1">
                                            {pokemon.types?.map((type) => (
                                                <div
                                                    key={type.type.name}
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: TYPE_COLORS[type.type.name] }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {selectedTeam && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedTeam(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold mb-4">{selectedTeam.name}</h3>
                        <p className="text-gray-600 mb-4">{selectedTeam.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedTeam.pokemon.map((pokemon) => (
                                <div key={pokemon.id} className="text-center p-3 border rounded">
                                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold capitalize">{pokemon.name}</span>
                                    </div>
                                    <div className="flex justify-center gap-1 mb-2">
                                        {pokemon.types?.map((type) => (
                                            <span
                                                key={type.type.name}
                                                className="px-2 py-1 text-xs rounded text-white"
                                                style={{ backgroundColor: TYPE_COLORS[type.type.name] }}
                                            >
                                                {type.type.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-center gap-1">
                                        {React.createElement(ROLE_ICONS[pokemon.role], { size: 14 })}
                                        <span className="text-xs capitalize">{pokemon.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setSelectedTeam(null)}
                            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Fechar
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
}