"use client";

import { Earth } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image"; // Import do Next.js Image

const regioes = [
    {
        nome: "Kanto",
        descricao: "Região clássica, lar de Bulbasaur, Charmander e Squirtle.",
        imagem: "/regioes/kanto.jpeg",
    },
    {
        nome: "Johto",
        descricao: "Região antiga, conhecida por Ho-Oh, Lugia e suas torres.",
        imagem: "/regioes/johto.jpeg",
    },
    {
        nome: "Hoenn",
        descricao: "Região tropical com ilhas, lar de Groudon, Kyogre e Rayquaza.",
        imagem: "/regioes/hoenn.jpeg",
    },
    {
        nome: "Sinnoh",
        descricao: "Região montanhosa, ligada a Dialga, Palkia e Giratina.",
        imagem: "/regioes/sinnoh.jpeg",
    },
    {
        nome: "Unova",
        descricao: "Região urbana, cheia de diversidade cultural e de Pokémon.",
        imagem: "/regioes/unova.jpeg",
    },
    {
        nome: "Kalos",
        descricao: "Região elegante inspirada na França, famosa por Mega Evoluções.",
        imagem: "/regioes/kalos.jpeg",
    },
    {
        nome: "Alola",
        descricao: "Arquipélago tropical, com formas regionais únicas e clima leve.",
        imagem: "/regioes/alola.jpeg",
    },
    {
        nome: "Galar",
        descricao: "Região inspirada no Reino Unido, famosa por ligas e Dynamax.",
        imagem: "/regioes/galar.jpeg",
    },
    {
        nome: "Paldea",
        descricao: "Região de mundo aberto, com escolas de treino e Terastal.",
        imagem: "/regioes/paldea1.png",
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
                                        <div className="flex flex-col gap-3 p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-[#E3350D] min-h-[550px]">

                                            {/* IMAGEM MAIS ESTICADA COM NEXT IMAGE */}
                                            {regiao.imagem && (
                                                <Image
                                                    src={regiao.imagem}
                                                    alt={regiao.nome}
                                                    width={600}       // largura base
                                                    height={384}      // altura base, próxima de h-96
                                                    className="w-full h-96 object-cover"
                                                />
                                            )}

                                            {/* CONTEÚDO FLEXÍVEL */}
                                            <div className="flex flex-col flex-1 justify-between">
                                                {/* TÍTULO + ÍCONE */}
                                                <div className="flex w-full items-center justify-between gap-3 mt-3">
                                                    <h3 className="text-lg font-bold text-black">{regiao.nome}</h3>
                                                    <Earth className="w-8 h-8 text-red-600 shrink-0" />
                                                </div>

                                                {/* DESCRIÇÃO */}
                                                <p className="text-sm text-black opacity-90 mt-2">{regiao.descricao}</p>

                                                {/* BOTÕES */}
                                                <div className="mt-4 flex w-full justify-end gap-3">
                                                    <button className="px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded-xl border border-gray-300 text-black hover:bg-gray-100 hover:border-[#E3350D] hover:text-[#E3350D] transition">
                                                        Mais informações
                                                    </button>
                                                    <button className="px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded-xl bg-[#E3350D] text-white shadow-sm hover:bg-red-700 transition">
                                                        Pokedex
                                                    </button>
                                                </div>
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
