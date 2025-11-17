"use client";

import { Earth } from "lucide-react";
import { motion } from "framer-motion";

const regioes = [
    {
        nome: "Kanto",
        descricao:
            "Região clássica da série, lar dos primeiros iniciais: Bulbasaur, Charmander e Squirtle.",
    },
    {
        nome: "Johto",
        descricao:
            "Região de tradições antigas, marcada pelos lendários Ho-Oh e Lugia e suas torres históricas.",
    },
    {
        nome: "Hoenn",
        descricao:
            "Região tropical e cheia de ilhas, palco dos lendários Groudon, Kyogre e Rayquaza.",
    },
    {
        nome: "Sinnoh",
        descricao:
            "Região montanhosa e misteriosa, fortemente ligada aos lendários Dialga, Palkia e Giratina.",
    },
    {
        nome: "Unova",
        descricao:
            "Região inspirada em grandes metrópoles, com enorme diversidade cultural e de Pokémon.",
    },
    {
        nome: "Kalos",
        descricao:
            "Região elegante inspirada na França, conhecida pelas Mega Evoluções e cenários sofisticados.",
    },
    {
        nome: "Alola",
        descricao:
            "Região em forma de arquipélago tropical, famosa por suas formas regionais e clima descontraído.",
    },
    {
        nome: "Galar",
        descricao:
            "Região inspirada no Reino Unido, famosa por seus estádios, ligas competitivas e Batalhas Dynamax.",
    },
    {
        nome: "Paldea",
        descricao:
            "Região de mundo aberto, com escolas de treinamento e o fenômeno Terastal como grande destaque.",
    },
];

export default function Regioes() {
    return (
        <div className="relative flex w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex grow flex-col">
                <main className="flex-1">
                    <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-1 items-center justify-center">
                        <div className="layout-content-container flex flex-col max-w-5xl flex-1 gap-10 text-center">

                            {/* HERO */}
                            <section className="flex flex-col items-center gap-4">
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-black">
                                    Regiões Pokémon
                                </h1>

                                <p className="max-w-xl text-sm text-black opacity-90">
                                    Explore as principais regiões do mundo Pokémon e descubra onde vivem seus favoritos.
                                </p>
                            </section>

                            {/* GRID 3 / 3 / 3 */}
                            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                                {regioes.map((regiao, index) => (
                                    <motion.div
                                        key={regiao.nome}
                                        className="group h-full"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{
                                            scale: 1.03,
                                            y: -4,
                                            transition: {
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 12,
                                            },
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.08,
                                            ease: "easeOut",
                                        }}
                                    >
                                        <div className="flex h-full flex-col gap-3 p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-[#E3350D]">

                                            {/* TÍTULO + ÍCONE */}
                                            <div className="flex w-full items-center justify-between gap-3">
                                                <h3 className="text-lg font-bold text-black">
                                                    {regiao.nome}
                                                </h3>
                                                <Earth className="w-8 h-8 text-red-600 shrink-0" />
                                            </div>

                                            {/* DESCRIÇÃO */}
                                            <p className="text-sm text-black opacity-90">
                                                {regiao.descricao}
                                            </p>

                                            {/* BOTÕES ALINHADOS À DIREITA */}
                                            <div className="mt-2 flex w-full justify-end gap-3">

                                                <button
                                                    className="px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded-xl border border-gray-300 text-black hover:bg-gray-100 hover:border-[#E3350D] hover:text-[#E3350D] transition"
                                                >
                                                    Mais informações
                                                </button>

                                                <button
                                                    className="px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded-xl bg-[#E3350D] text-white shadow-sm hover:bg-red-700 transition"
                                                >
                                                    Pokedex
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </section>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
