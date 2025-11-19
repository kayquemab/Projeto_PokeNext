"use client";

import Link from "next/link";

import { Earth } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const regioes = [
  {
    nome: "Kanto",
    descricao: "Região clássica, lar de Bulbasaur, Charmander e Squirtle.",
    imagem: "/regioes/kanto.jpeg",
    caminho: "/Regioes/kanto",
  },
  {
    nome: "Johto",
    descricao: "Região antiga, conhecida por Ho-Oh, Lugia e suas torres.",
    imagem: "/regioes/johto.jpeg",
    caminho: "/Regioes/johto",
  },
  {
    nome: "Hoenn",
    descricao: "Região tropical com ilhas, lar de Groudon, Kyogre e Rayquaza.",
    imagem: "/regioes/hoenn.jpeg",
    caminho: "/Regioes/hoenn",
  },
  {
    nome: "Sinnoh",
    descricao: "Região montanhosa, ligada a Dialga, Palkia e Giratina.",
    imagem: "/regioes/sinnoh.jpeg",
    caminho: "/Regioes/sinnoh",
  },
  {
    nome: "Unova",
    descricao: "Região urbana, cheia de diversidade cultural e de Pokémon.",
    imagem: "/regioes/unova.jpeg",
    caminho: "/Regioes/unova",
  },
  {
    nome: "Kalos",
    descricao: "Região elegante inspirada na França, famosa por Mega Evoluções.",
    imagem: "/regioes/kalos.jpeg",
    caminho: "/Regioes/kalos",
  },
  {
    nome: "Alola",
    descricao: "Arquipélago tropical, com formas regionais únicas e clima leve.",
    imagem: "/regioes/alola.jpeg",
    caminho: "/Regioes/alola",
  },
  {
    nome: "Galar",
    descricao: "Região inspirada no Reino Unido, famosa por ligas e Dynamax.",
    imagem: "/regioes/galar.jpeg",
    caminho: "/Regioes/galar",
  },
  {
    nome: "Paldea",
    descricao: "Região de mundo aberto, com escolas de treino e Terastal.",
    imagem: "/regioes/paldea.png",
    caminho: "/Regioes/paldea",
  },
];


export default function Regioes() {
  return (
    <div className="relative w-full">
      {/* Wrapper centralizado, alinhado com o layout geral (Navbar / Pokédex / Mapa) */}
      <section className="w-full mt-6 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="w-full max-w-6xl mx-auto">
          {/* Painel principal apenas para organizar; sem fundo branco chapado */}
          <motion.div
            className="w-full rounded-2xl backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          >


            {/* GRID 3 / 3 / 3 */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
              {regioes.map((regiao, index) => (
                <motion.div
                  key={regiao.nome}
                  className="group h-full"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.02,
                    y: -4,
                    transition: {
                      type: "spring",
                      stiffness: 220,
                      damping: 16,
                    },
                  }}
                >
                  <div
                    className="
                      flex flex-col gap-3 rounded-xl
                      border border-neutral-200/60
                      bg-transparent hover:bg-white/5
                      transition-all overflow-hidden h-full
                    "
                  >
                    {/* IMAGEM – sem altura fixa, respeita o tamanho/ratio original */}
                    {regiao.imagem && (
                      <Image
                        src={regiao.imagem}
                        alt={regiao.nome}
                        width={900}      // base grande pra imagem “comprida”
                        height={520}     // proporção aproximada; ajusta se quiser
                        className="w-full h-auto object-cover"
                      />
                    )}

                    {/* CONTEÚDO */}
                    <div className="flex flex-col flex-1 justify-between px-4 pb-4 pt-1">
                      <div>
                        {/* TÍTULO + ÍCONE */}
                        <div className="flex w-full items-center justify-between gap-3 mt-2">
                          <h3 className="text-base font-semibold text-slate-900">
                            {regiao.nome}
                          </h3>
                          <Earth className="w-5 h-5 text-[#E3350D] shrink-0" />
                        </div>

                        {/* DESCRIÇÃO */}
                        <p className="mt-2 text-xs sm:text-sm text-slate-700">
                          {regiao.descricao}
                        </p>
                      </div>

                      {/* BOTÕES */}
                      <div className="mt-4 flex w-full justify-end gap-2">
                        <Link
                          href={regiao.caminho}
                          className="px-3 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide uppercase rounded-lg border border-neutral-300 text-slate-800 hover:bg-neutral-100 hover:border-[#E3350D] hover:text-[#E3350D] transition"
                        >
                          Mais informações
                        </Link>

                        <button className="px-3 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide uppercase rounded-lg bg-[#E3350D] text-white shadow-sm hover:bg-red-700 transition">
                          Pokedex
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </section>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
