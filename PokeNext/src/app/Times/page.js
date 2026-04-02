"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import TeamBuilder from "../../components/TeamBuilder";
import TeamAnalysis from "../../components/TeamAnalysis";
import TeamSuggestions from "../../components/TeamSuggestions";

export default function Times() {
    const [activeTab, setActiveTab] = useState("builder");
    const [currentTeam, setCurrentTeam] = useState([]);

    const tabs = [
        { id: "builder", label: "Construtor de Times", icon: "⚙️" },
        { id: "analysis", label: "Análise de Time", icon: "📊" },
        { id: "suggestions", label: "Sugestão de Times", icon: "💡" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-neutral-700 text-left mb-8">
                        🎨 Times
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-3xl">
                        Monte e gerencie seu time de Pokémon com facilidade, visualizando stats, tipos e sprites.
                        Salve, carregue, exporte ou importe times e organize-os com drag-and-drop.
                    </p>
                </motion.div>

                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-sm border p-6"
                >
                    {activeTab === "builder" && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Construtor de Times</h2>
                            <p className="text-gray-600 mb-6">
                                Monte times de 6 Pokémon com busca automática, detalhes completos de cada Pokémon e funcionalidades de salvar, carregar, exportar, importar e organizar com drag-and-drop.
                            </p>
                            <TeamBuilder onTeamChange={setCurrentTeam} />
                        </div>
                    )}

                    {activeTab === "analysis" && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Análise de Time</h2>
                            <p className="text-gray-600 mb-6">
                                Avalie a sinergia do seu time com gráficos de stats, matriz de cobertura de tipos, análise de fraquezas e recomendações para melhorar a equipe.
                            </p>
                            <TeamAnalysis team={currentTeam} />
                        </div>
                    )}

                    {activeTab === "suggestions" && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Sugestão de Times</h2>
                            <p className="text-gray-600 mb-6">
                                Identifique funções (sweeper, atacante, tank, wall…), analise cobertura de tipos e receba sugestões de Pokémon para balancear seu time, incluindo explicações de tipo e função. Considera Pokémon raros e lendários.
                            </p>
                            <TeamSuggestions team={currentTeam} />
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}


