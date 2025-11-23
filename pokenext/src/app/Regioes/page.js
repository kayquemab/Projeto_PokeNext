"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const regioes = [
  {
    nome: "Kanto",
    descricao: "Zona-001. Habitat original das espécies iniciais clássicas.",
    imagem: "/regioes/kanto.jpeg",
    caminho: "/Regioes/kanto",
  },
  {
    nome: "Johto",
    descricao: "Zona-102. Região histórica com lendas de longa data.",
    imagem: "/regioes/johto.jpeg",
    caminho: "/Regioes/johto",
  },
  {
    nome: "Hoenn",
    descricao: "Zona-203. Área tropical com energia elemental intensa.",
    imagem: "/regioes/hoenn.jpeg",
    caminho: "/Regioes/hoenn",
  },
  {
    nome: "Sinnoh",
    descricao: "Zona-404. Território com instabilidade espaço-temporal.",
    imagem: "/regioes/sinnoh.jpeg",
    caminho: "/Regioes/sinnoh",
  },
  {
    nome: "Unova",
    descricao: "Zona-507. Região urbana de diversidade elevada.",
    imagem: "/regioes/unova.jpeg",
    caminho: "/Regioes/unova",
  },
  {
    nome: "Kalos",
    descricao: "Zona-611. Área elegante e moderna, fonte de Mega Energia.",
    imagem: "/regioes/kalos.jpeg",
    caminho: "/Regioes/kalos",
  },
  {
    nome: "Alola",
    descricao: "Zona-718. Arquipélago tropical com variações regionais.",
    imagem: "/regioes/alola.jpeg",
    caminho: "/Regioes/alola",
  },
  {
    nome: "Galar",
    descricao: "Zona-820. Região inspirada em tradições de batalha.",
    imagem: "/regioes/galar.jpeg",
    caminho: "/Regioes/galar",
  },
  {
    nome: "Paldea",
    descricao: "Zona-901. Mundo aberto com índice de Terastal elevado.",
    imagem: "/regioes/paldea.png",
    caminho: "/Regioes/paldea",
  },
];

export default function Regioes() {
  return (
    <div className="relative w-full">
      <section className="w-full mt-6 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            className="w-full rounded-2xl px-4 sm:px-6 lg:px-8 py-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regioes.map((regiao, index) => (
                <motion.div
                  key={regiao.nome}
                  className="
                    group 
                    relative 
                    rounded-md 
                    overflow-hidden 
                    bg-white/5
                    border border-white/20
                    shadow-lg 
                    transition-all
                    hover:shadow-2xl
                  "
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                  whileHover={{
                    scale: 1.03,
                    y: -4,
                    transition: {
                      type: "spring",
                      stiffness: 240,
                      damping: 18,
                    },
                  }}
                >
                  {/* Imagem */}
                  <Image
                    src={regiao.imagem}
                    alt={regiao.nome}
                    width={900}
                    height={520}
                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition"
                  />

                  {/* Overlay escuro hi-tech */}
                  <div className="absolute inset-0 bg-linear-to-b from-black/25 via-black/55 to-black/80 pointer-events-none" />

                  {/* Grid holográfico */}
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none" />

                  {/* Scan vermelho */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                    <div className="w-full h-1 bg-[#E3350D] animate-scan" />
                  </div>

                  {/* 🔥 TOPO — título e descrição */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 p-4 pt-5 flex flex-col"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    {/* Nome + barra */}
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                        initial={{ scaleY: 0.3, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.35 }}
                      />

                      <motion.h3
                        className="text-white font-bold tracking-wide text-[15px]"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                      >
                        {regiao.nome}
                      </motion.h3>
                    </div>

                    {/* Descrição */}
                    <p className="mt-2 text-[11px] leading-relaxed text-neutral-200 font-light opacity-90">
                      {regiao.descricao}
                    </p>
                  </motion.div>

                  {/* 🔥 BASE — botões */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 pb-3 flex gap-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.45 }}
                  >
                    <Link
                      href={regiao.caminho}
                      className="
                        px-2 py-1 
                        text-[10px] 
                        font-semibold 
                        uppercase 
                        tracking-wide
                        rounded-md
                        border border-[#E3350D]/60
                        text-white 
                        bg-black/30 
                        backdrop-blur-sm
                        hover:bg-[#E3350D] 
                        hover:text-white
                        transition
                      "
                    >
                      Detalhes
                    </Link>

                    <button
                      className="
                        px-2 py-1 
                        text-[10px] 
                        font-semibold 
                        uppercase 
                        tracking-wide 
                        rounded-md 
                        bg-[#E3350D]/90 
                        text-white
                        hover:bg-[#c5280c]
                        transition
                      "
                    >
                      Pokedex
                    </button>
                  </motion.div>
                </motion.div>
              ))}
            </section>
          </motion.div>
        </div>
      </section>

      {/* animação scan */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 1.4s linear infinite;
        }
      `}</style>
    </div>
  );
}
