"use client";

import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { motion } from "framer-motion";

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

const TYPE_EFFECTIVENESS = {
    normal: { weak: ['fighting'], resist: [], immune: ['ghost'] },
    fighting: { weak: ['flying', 'psychic', 'fairy'], resist: ['rock', 'bug', 'dark'], immune: [] },
    flying: { weak: ['rock', 'electric', 'ice'], resist: ['fighting', 'bug', 'grass'], immune: ['ground'] },
    poison: { weak: ['ground', 'psychic'], resist: ['fighting', 'poison', 'bug', 'grass', 'fairy'], immune: [] },
    ground: { weak: ['water', 'grass', 'ice'], resist: ['poison', 'rock'], immune: ['electric'] },
    rock: { weak: ['fighting', 'ground', 'steel', 'water', 'grass'], resist: ['normal', 'flying', 'poison', 'fire'], immune: [] },
    bug: { weak: ['flying', 'rock', 'fire'], resist: ['fighting', 'ground', 'grass'], immune: [] },
    ghost: { weak: ['ghost', 'dark'], resist: ['poison', 'bug'], immune: ['normal', 'fighting'] },
    steel: { weak: ['fighting', 'ground', 'fire'], resist: ['normal', 'flying', 'rock', 'bug', 'steel', 'grass', 'psychic', 'ice', 'dragon', 'fairy'], immune: ['poison'] },
    fire: { weak: ['ground', 'rock', 'water'], resist: ['bug', 'steel', 'fire', 'grass', 'ice', 'fairy'], immune: [] },
    water: { weak: ['grass', 'electric'], resist: ['steel', 'fire', 'water', 'ice'], immune: [] },
    grass: { weak: ['flying', 'poison', 'bug', 'fire', 'ice'], resist: ['ground', 'water', 'grass', 'electric'], immune: [] },
    electric: { weak: ['ground'], resist: ['flying', 'steel', 'electric'], immune: [] },
    psychic: { weak: ['bug', 'ghost', 'dark'], resist: ['fighting', 'psychic'], immune: [] },
    ice: { weak: ['fighting', 'rock', 'steel', 'fire'], resist: ['ice'], immune: [] },
    dragon: { weak: ['ice', 'dragon', 'fairy'], resist: ['fire', 'water', 'grass', 'electric'], immune: [] },
    dark: { weak: ['fighting', 'bug', 'fairy'], resist: ['ghost', 'dark'], immune: ['psychic'] },
    fairy: { weak: ['poison', 'steel'], resist: ['fighting', 'bug', 'dark'], immune: ['dragon'] },
};

export default function TeamAnalysis({ team }) {
    const statsData = useMemo(() => {
        if (!team.length) return [];

        const stats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
        return stats.map(stat => ({
            stat: stat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            average: Math.round(team.reduce((sum, p) => sum + (p.stats?.find(s => s.stat.name === stat)?.base_stat || 0), 0) / team.length),
        }));
    }, [team]);

    const typeCoverage = useMemo(() => {
        if (!team.length) return { coverage: {}, weaknesses: {} };

        const coverage = {};
        const weaknesses = {};

        team.forEach(pokemon => {
            pokemon.types?.forEach(typeInfo => {
                const type = typeInfo.type.name;
                if (!coverage[type]) coverage[type] = 0;
                coverage[type]++;

                const typeData = TYPE_EFFECTIVENESS[type];
                if (typeData) {
                    typeData.weak.forEach(weakType => {
                        if (!weaknesses[weakType]) weaknesses[weakType] = 0;
                        weaknesses[weakType]++;
                    });
                }
            });
        });

        return { coverage, weaknesses };
    }, [team]);

    const typeChartData = useMemo(() => {
        const allTypes = Object.keys(TYPE_COLORS);
        return allTypes.map(type => ({
            type: type.charAt(0).toUpperCase() + type.slice(1),
            coverage: typeCoverage.coverage[type] || 0,
            weaknesses: typeCoverage.weaknesses[type] || 0,
        }));
    }, [typeCoverage]);

    const radarData = useMemo(() => {
        if (!team.length) return [];

        const stats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
        return stats.map(stat => {
            const value = team.reduce((sum, p) => sum + (p.stats?.find(s => s.stat.name === stat)?.base_stat || 0), 0) / team.length;
            return {
                stat: stat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value: Math.round(value),
                fullMark: 150,
            };
        });
    }, [team]);

    if (!team.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                Adicione Pokémon ao seu time para ver a análise.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div>
                <h3 className="text-xl font-semibold mb-4">Estatísticas Médias do Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stat" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="average" fill="#3B82F6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Radar de Estatísticas</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="stat" />
                        <PolarRadiusAxis angle={90} domain={[0, 150]} />
                        <Radar name="Time" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Cobertura de Tipos</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={typeChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="coverage" fill="#10B981" name="Cobertura" />
                        <Bar dataKey="weaknesses" fill="#EF4444" name="Fraquezas" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Recomendações</h3>
                <div className="space-y-2">
                    {Object.entries(typeCoverage.weaknesses).filter(([_, count]) => count > 1).length > 0 && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded">
                            <h4 className="font-semibold text-red-800">Fraquezas Críticas</h4>
                            <p className="text-red-700">
                                Seu time é vulnerável a: {Object.entries(typeCoverage.weaknesses).filter(([_, count]) => count > 1).map(([type]) => type).join(', ')}
                            </p>
                        </div>
                    )}
                    {Object.keys(typeCoverage.coverage).length < 6 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                            <h4 className="font-semibold text-yellow-800">Diversidade de Tipos</h4>
                            <p className="text-yellow-700">
                                Considere adicionar mais variedade de tipos para melhor cobertura.
                            </p>
                        </div>
                    )}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                        <h4 className="font-semibold text-blue-800">Equilíbrio</h4>
                        <p className="text-blue-700">
                            Mantenha um equilíbrio entre ataque físico, especial e defesa.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}