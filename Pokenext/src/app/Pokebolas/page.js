"use client";

import { motion } from "framer-motion"
import Image from "next/image";
import { useEffect } from "react";

export default function Pokebolas() {

const pokebolas = []

    // useEffect(() => {
    //     async function buscarDados() {
    //         const resposta = await fetch("https://pokeapi.co/api/v2/item?limit=10");
    //         const dados = await resposta.json();
    //     }
    // })

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
                Pokébolas
            </h1>

            <div className="relative w-full">
                <section className="w-full mt-6 px-3 sm:px-6 lg:px-8 mb-10">
                    <div className="w-full max-w-6xl mx-auto">
                        <div className="mt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {pokebolas.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        className="flex flex-col rounded-md bg-neutral-600 border border-neutral-600 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-left"
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                        {/* IMAGEM + NÚMERO DE FUNDO */}
                                        <div className="relative h-[230px] overflow-hidden bg-neutral-600 transition-all duration-300">
                                            {/* Número de fundo */}
                                            <div className="absolute inset-0 flex pointer-events-none">
                                                <span className="mt-4 select-none text-[140px] leading-none font-black text-zinc-500/40">
                                                    {/* número */}
                                                </span>
                                            </div>

                                            {/* Imagem */}
                                            <Image
                                                alt=""
                                                className="absolute inset-0 z-10 object-containscale-105 opacity-100 brightness-110 transition-all duration-300" />
                                        </div>

                                        {/* DESCRIÇÃO */}
                                        <div
                                            className="h-[120px] p-3 flex flex-col gap-1 bg-[url('/wallpaper-preto.png')] bg-cover bg-center bg-no-repeat transition-all duration-300">
                                            {/* Nome + Número */}
                                            <h4 className="flex items-center justify-between text-xl font-semibold text-white">
                                                {/* Barra + Nome */}
                                                <div className="flex items-center gap-2">
                                                    <motion.div
                                                        className="w-1.5 h-4 rounded-sm bg-[#E3350D] shadow-[0_0_6px_#E3350D]"
                                                        initial={{ scaleY: 0.3, opacity: 0 }}
                                                        animate={{ scaleY: 1, opacity: 1 }}
                                                        transition={{ delay: 0.2, duration: 0.35 }}
                                                    />

                                                    <span className="capitalize">{item.nome}</span>
                                                </div>

                                                {/* Número */}
                                                <span className="text-base text-zinc-300">{item.numero}</span>
                                            </h4>

                                            {/* Tipo */}
                                            <div className="relative translate-y-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-white">
                                                        Tipo: {item.tipo}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div >
    );
}


