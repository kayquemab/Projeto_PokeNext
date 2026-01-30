"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Pokebolas() {
    const [pokebolas, setPokebolas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function buscarPokebolas() {
            try {
                // Busca a categoria "pokeballs"
                const respostaCategoria = await fetch(
                    "https://pokeapi.co/api/v2/item-category/34/"
                );
                const categoria = await respostaCategoria.json();

                // URLs dos itens
                const urls = categoria.items.map(item => item.url);

                // Detalhes das pokébolas
                const detalhes = await Promise.all(
                    urls.map(async (url) => {
                        const resposta = await fetch(url);
                        const dados = await resposta.json();

                        return {
                            id: dados.id,
                            name: dados.name,
                            image: dados.sprites.default,
                        };
                    })
                );

                setPokebolas(detalhes);
            } catch (erro) {
                console.error("Erro ao buscar pokébolas:", erro);
            } finally {
                setLoading(false);
            }
        }

        buscarPokebolas();
    }, []);

    if (loading) {
        return (
            <p className="text-center mt-10 text-neutral-500">
                Carregando Pokébolas...
            </p>
        );
    }

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

            <section className="w-full mt-6 px-3 sm:px-6 lg:px-8 mb-10">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {pokebolas.map((item) => (
                            <motion.div
                                key={item.id}
                                className="
                                    flex flex-col rounded-md
                                    bg-neutral-600
                                    border border-neutral-600
                                    shadow-[0_4px_10px_rgba(0,0,0,0.06)]
                                    text-left
                                "
                                whileHover={{ y: -6, scale: 1.02 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                {/* IMAGEM */}
                                <div
                                    className="
                                        relative h-[230px]
                                        flex items-center justify-center
                                        overflow-hidden
                                        bg-neutral-600
                                    "
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.12, rotate: 6 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="
                                            relative z-10
                                            transform-gpu
                                            will-change-transform
                                        "
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={180}
                                            height={180}
                                            priority
                                            className="
                                                object-contain
                                                select-none
                                                image-render-auto
                                                drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)]
                                            "
                                        />
                                    </motion.div>
                                </div>

                                {/* DESCRIÇÃO */}
                                <div
                                    className="
                                        h-[120px]
                                        p-3
                                        flex flex-col gap-1
                                        bg-[url('/wallpaper-preto.png')]
                                        bg-cover bg-center bg-no-repeat
                                    "
                                >
                                    <h4 className="flex items-center justify-between text-xl font-semibold text-white">
                                        <div className="flex items-center gap-2">
                                            <motion.div
                                                className="w-1.5 h-4 rounded-sm bg-[#E3350D]"
                                                initial={{ scaleY: 0.3, opacity: 0 }}
                                                animate={{ scaleY: 1, opacity: 1 }}
                                                transition={{ delay: 0.2, duration: 0.35 }}
                                            />
                                            <span className="capitalize">
                                                {item.name}
                                            </span>
                                        </div>

                                        <span className="text-base text-zinc-300">
                                            {item.id}
                                        </span>
                                    </h4>

                                    <div className="mt-3">
                                        <span className="text-sm text-zinc-300">
                                            Categoria: Pokébola
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
