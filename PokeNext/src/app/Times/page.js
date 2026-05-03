"use client";

import { useState } from "react";
import { BarChart3, UsersRound } from "lucide-react";

import TeamBuilder from "../../components/TeamBuilder";
import TeamAnalysis from "@/components/TeamAnalysis";


export default function Times() {
    const [activeTab, setActiveTab] = useState("builder");
    const [currentTeam, setCurrentTeam] = useState([]);

    const isBuilderActive = activeTab === "builder";
    const isAnalysisActive = activeTab === "analysis";

    function tabBackground(isActive) {
        return {
            backgroundImage: `url(${isActive ? "/wallpaper-preto.png" : "/wallpaper-cinza.png"
                })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        };
    }

    const baseButtonClass = `
        group relative overflow-hidden
        flex items-center gap-3
        px-4 py-3 text-white
        transition-all duration-200
    `;

    return (
        <div>
            <h1
                className="
                    text-2xl sm:text-3xl
                    font-normal tracking-tight text-neutral-700
                    text-left
                    ml-5 sm:ml-10 md:ml-10 lg:ml-16
                "
            >
                Times
            </h1>

            <header className="relative mt-6 w-full px-5 sm:px-10 md:px-10 lg:px-16">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab("builder")}
                            style={tabBackground(isBuilderActive)}
                            className={`
                                ${baseButtonClass}
                                justify-start rounded-2xl sm:rounded-r-none
                            `}
                        >
                            {!isBuilderActive && (
                                <div
                                    className="
                                        absolute inset-0
                                        opacity-0 transition-opacity duration-200
                                        group-hover:opacity-100
                                    "
                                    style={{
                                        backgroundImage: "url(/wallpaper-preto.png)",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                            )}

                            <span
                                className={`
                                    relative z-10 grid h-7 w-7 place-items-center rounded-full bg-white
                                    transition-colors duration-200
                                    ${isBuilderActive
                                        ? "text-[#1B1B1B]"
                                        : "text-[#616161] group-hover:text-[#1B1B1B]"
                                    }
                                `}
                            >
                                <UsersRound className="h-4 w-4" />
                            </span>

                            <div className="relative z-10 text-left">
                                <div className="text-xs opacity-90">
                                    Monte sua equipe
                                </div>

                                <div className="text-sm font-semibold">
                                    Construtor de times
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("analysis")}
                            style={tabBackground(isAnalysisActive)}
                            className={`
                                ${baseButtonClass}
                                justify-end rounded-2xl sm:rounded-l-none
                            `}
                        >
                            {!isAnalysisActive && (
                                <div
                                    className="
                                        absolute inset-0
                                        opacity-0 transition-opacity duration-200
                                        group-hover:opacity-100
                                    "
                                    style={{
                                        backgroundImage: "url(/wallpaper-preto.png)",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                            )}

                            <div className="relative z-10 text-right">
                                <div className="text-sm font-semibold">
                                    Análise de times
                                </div>

                                <div className="text-xs opacity-90">
                                    Forças, fraquezas e equilíbrio
                                </div>
                            </div>

                            <span
                                className={`
                                    relative z-10 grid h-7 w-7 place-items-center rounded-full bg-white
                                    transition-colors duration-200
                                    ${isAnalysisActive
                                        ? "text-[#1B1B1B]"
                                        : "text-[#616161] group-hover:text-[#1B1B1B]"
                                    }
                                `}
                            >
                                <BarChart3 className="h-4 w-4" />
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="mt-6 w-full px-5 sm:px-10 md:px-10 lg:px-16">
                <div className="mx-auto w-full max-w-6xl">
                    {activeTab === "builder" && (
                        <TeamBuilder onTeamChange={setCurrentTeam} />
                    )}

                    {activeTab === "analysis" && (
                        <TeamAnalysis team={currentTeam} />
                    )}
                </div>
            </main>
        </div>
    );
}