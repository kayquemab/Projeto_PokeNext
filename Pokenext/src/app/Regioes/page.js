"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const regioes = [
  {
    id: "kanto",
    ordem: 0,
    nome: "Kanto",
    descricao:
      "O berço de inúmeras jornadas: cidades clássicas, rotas lendárias e o início de tudo para muitos Treinadores.",
    imagem: "/regioes/kanto.jpeg",
    icone: "/pokedexicons/kanto.svg",
    imagensDetalhes: {
      imagem1: "/imagens_kanto/PalletTown.jpg",
      imagem2: "/imagens_kanto/banner_liga_kanto.jpg",
      imagem3: "/imagens_kanto/silhueta_kanto.jpeg",
    },
  },
  {
    id: "johto",
    ordem: 1,
    nome: "Johto",
    descricao:
      "Uma região onde tradição e natureza caminham juntas, marcada por templos antigos, lendas e uma cultura viva.",
    imagem: "/regioes/johto.jpeg",
    icone: "/pokedexicons/johto.svg",
    imagensDetalhes: {
      imagem1: "/imagens_johto/Cyndaquil.jpg",
      imagem2: "/imagens_johto/banner_liga_johto.jpg",
      imagem3: "/imagens_johto/silhueta_johto.jpeg",
    },
  },
  {
    id: "hoenn",
    ordem: 2,
    nome: "Hoenn",
    descricao:
      "Terras tropicais moldadas por mar e montanha, com paisagens vibrantes e uma energia natural impressionante.",
    imagem: "/regioes/hoenn.jpeg",
    icone: "/pokedexicons/hoenn.svg",
    imagensDetalhes: {
      imagem1: "/imagens_hoenn/banner_latiosElatias.jpg",
      imagem2: "/imagens_hoenn/banner_liga_hoenn.jpg",
      imagem3: "/imagens_hoenn/silhueta_hoenn.jpeg",
    },
  },
  {
    id: "sinnoh",
    ordem: 3,
    nome: "Sinnoh",
    descricao:
      "Região de clima intenso e mitologia profunda, onde o passado ecoa em montanhas e mistérios do tempo e do espaço.",
    imagem: "/regioes/sinnoh.jpeg",
    icone: "/pokedexicons/sinnoh.svg",
    imagensDetalhes: {
      imagem1: "/imagens_sinnoh/sinnoh.jpg",
      imagem2: "/imagens_sinnoh/Riolu_Wallpaper.jpg",
      imagem3: "/imagens_sinnoh/silhueta_sinnoh.jpeg",
    },
  },
  {
    id: "unova",
    ordem: 4,
    nome: "Unova",
    descricao:
      "Moderna e pulsante, reúne culturas, ideias e estilos em uma região dinâmica, perfeita para novas descobertas.",
    imagem: "/regioes/unova.jpeg",
    icone: "/pokedexicons/unova.svg",
    imagensDetalhes: {
      imagem1: "/imagens_unova/banner_liga_unova.jpg",
      imagem2: "/imagens_unova/unova.jpg",
      imagem3: "/imagens_unova/silhueta_unova.jpeg",
    },
  },
  {
    id: "kalos",
    ordem: 5,
    nome: "Kalos",
    descricao:
      "Elegância em cada detalhe: arte, moda e beleza se encontram em uma região que também revelou o poder da Mega Evolução.",
    imagem: "/regioes/kalos.jpeg",
    icone: "/pokedexicons/kalos.svg",
    imagensDetalhes: {
      imagem1: "/imagens_kalos/kalos.jpg",
      imagem2: "/imagens_kalos/Lumiose_City.jpg",
      imagem3: "/imagens_kalos/silhueta_kalos.jpeg",
    },
  },
  {
    id: "alola",
    ordem: 6,
    nome: "Alola",
    descricao:
      "Um arquipélago ensolarado guiado por tradições e laços comunitários, com formas regionais únicas e espírito acolhedor.",
    imagem: "/regioes/alola.jpeg",
    icone: "/pokedexicons/alola.svg",
    imagensDetalhes: {
      imagem1: "/imagens_alola/alola.jpg",
      imagem2: "/imagens_alola/anuncio_alola.jpg",
      imagem3: "/imagens_alola/silhueta_alola.jpeg",
    },
  },
  {
    id: "galar",
    ordem: 7,
    nome: "Galar",
    descricao:
      "Tradição e espetáculo se unem em batalhas grandiosas, com estádios imponentes e uma paixão nacional pelo desafio.",
    imagem: "/regioes/galar.jpeg",
    icone: "/pokedexicons/galar.svg",
    imagensDetalhes: {
      imagem1: "/imagens_galar/galar.jpg",
      imagem2: "/imagens_galar/Pokemon_League.jpg",
      imagem3: "/imagens_galar/silhueta_galar.jpeg",
    },
  },
  {
    id: "paldea",
    ordem: 8,
    nome: "Paldea",
    descricao:
      "Exploração em liberdade total: uma região aberta, diversa e cheia de surpresas, onde a Terastalização brilha.",
    imagem: "/regioes/paldea.png",
    icone: "/pokedexicons/paldea.svg",
    imagensDetalhes: {
      imagem1: "/imagens_paldea/paldea_region.jpg",
      imagem2: "/imagens_paldea/Miraidon.jpg",
      imagem3: "/imagens_paldea/Koraidon.jpg",
    },
  },
];


export default function Regioes() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-700 text-left ml-5 sm:ml-10 md:ml-10 lg:ml-16">
        Regiões
      </h1>

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
                    className="group relative rounded-md overflow-hidden bg-white/5 border border-white/20 shadow-lg transition-all hover:shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.45 }}
                    whileHover={{
                      scale: 1.03,
                      y: -4,
                      transition: { type: "spring", stiffness: 240, damping: 18 },
                    }}
                  >
                    <Image
                      src={regiao.imagem}
                      alt={regiao.nome}
                      width={900}
                      height={520}
                      className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition"
                    />

                    <div className="absolute inset-0 bg-linear-to-b from-black/25 via-black/55 to-black/80 pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none" />

                    <motion.div
                      className="absolute bottom-3 left-3 z-20"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        y: [0, -3, 0],
                        scale: [1, 1.06, 1],
                      }}
                      transition={{
                        opacity: { duration: 0.35 },
                        y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
                        scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={{
                          pathname: regiao.infoCaminho,
                          query: regiao.imagensDetalhes
                        }}
                        aria-label={`Ver mais informações sobre ${regiao.nome}`}
                        className="inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        style={{ width: 54, height: 54 }}
                      >
                        <Image
                          src={regiao.icone}
                          alt=""
                          width={54}
                          height={54}
                          className="opacity-90 group-hover:opacity-100 transition drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                        />
                      </Link>
                    </motion.div>

                    <motion.div
                      className="absolute top-0 left-0 right-0 p-4 pt-5 flex flex-col"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45 }}
                    >
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
                      <p className="mt-2 text-[11px] leading-relaxed text-neutral-200 font-light opacity-90">
                        {regiao.descricao}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </section>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
