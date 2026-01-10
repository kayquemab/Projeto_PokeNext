"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export const regioes = [
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
    leaders: [
      { id: "brock", nome: "Brock", tipo: "rock", cidade: "Pewter", teamIds: [74, 95] },
      { id: "misty", nome: "Misty", tipo: "water", cidade: "Cerulean", teamIds: [120, 121] },
      { id: "surge", nome: "Lt. Surge", tipo: "electric", cidade: "Vermilion", teamIds: [25, 26] },
      { id: "erika", nome: "Erika", tipo: "grass", cidade: "Celadon", teamIds: [44, 71] },
      { id: "koga", nome: "Koga", tipo: "poison", cidade: "Fuchsia", teamIds: [109, 110] },
      { id: "sabrina", nome: "Sabrina", tipo: "psychic", cidade: "Saffron", teamIds: [64, 65] },
      { id: "blaine", nome: "Blaine", tipo: "fire", cidade: "Cinnabar", teamIds: [58, 78] },
      { id: "giovanni", nome: "Giovanni", tipo: "ground", cidade: "Viridian", teamIds: [111, 112] },
    ],
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
    leaders: [
      { id: "falkner", nome: "Falkner", tipo: "flying", cidade: "Violet", teamIds: [16, 17] },
      { id: "bugsy", nome: "Bugsy", tipo: "bug", cidade: "Azalea", teamIds: [11, 123] },
      { id: "whitney", nome: "Whitney", tipo: "normal", cidade: "Goldenrod", teamIds: [35, 241] },
      { id: "morty", nome: "Morty", tipo: "ghost", cidade: "Ecruteak", teamIds: [93, 94] },
      { id: "chuck", nome: "Chuck", tipo: "fighting", cidade: "Cianwood", teamIds: [57, 62] },
      { id: "jasmine", nome: "Jasmine", tipo: "steel", cidade: "Olivine", teamIds: [81, 208] },
      { id: "pryce", nome: "Pryce", tipo: "ice", cidade: "Mahogany", teamIds: [86, 221] },
      { id: "clair", nome: "Clair", tipo: "dragon", cidade: "Blackthorn", teamIds: [148, 230] },
    ],
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
    leaders: [
      { id: "roxanne", nome: "Roxanne", tipo: "rock", cidade: "Rustboro", teamIds: [74, 299] },
      { id: "brawly", nome: "Brawly", tipo: "fighting", cidade: "Dewford", teamIds: [66, 296] },
      { id: "wattson", nome: "Wattson", tipo: "electric", cidade: "Mauville", teamIds: [100, 310] },
      { id: "flannery", nome: "Flannery", tipo: "fire", cidade: "Lavaridge", teamIds: [218, 324] },
      { id: "norman", nome: "Norman", tipo: "normal", cidade: "Petalburg", teamIds: [288, 289] },
      { id: "winona", nome: "Winona", tipo: "flying", cidade: "Fortree", teamIds: [277, 334] },
      { id: "tate_liza", nome: "Tate & Liza", tipo: "psychic", cidade: "Mossdeep", teamIds: [337, 338] },
      { id: "wallace", nome: "Wallace", tipo: "water", cidade: "Sootopolis", teamIds: [340, 350] },
    ],
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
    leaders: [
      { id: "roark", nome: "Roark", tipo: "rock", cidade: "Oreburgh", teamIds: [74, 408] },
      { id: "gardenia", nome: "Gardenia", tipo: "grass", cidade: "Eterna", teamIds: [420, 407] },
      { id: "fantina", nome: "Fantina", tipo: "ghost", cidade: "Hearthome", teamIds: [426, 429] },
      { id: "maylene", nome: "Maylene", tipo: "fighting", cidade: "Veilstone", teamIds: [307, 448] },
      { id: "wake", nome: "Crasher Wake", tipo: "water", cidade: "Pastoria", teamIds: [130, 419] },
      { id: "byron", nome: "Byron", tipo: "steel", cidade: "Canalave", teamIds: [208, 411] },
      { id: "candice", nome: "Candice", tipo: "ice", cidade: "Snowpoint", teamIds: [478, 460] },
      { id: "volkner", nome: "Volkner", tipo: "electric", cidade: "Sunyshore", teamIds: [405, 466] },
    ],
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
    leaders: [
      { id: "cress", nome: "Cress", tipo: "water", cidade: "Striaton", teamIds: [506, 515] },
      { id: "chili", nome: "Chili", tipo: "fire", cidade: "Striaton", teamIds: [506, 513] },
      { id: "cilan", nome: "Cilan", tipo: "grass", cidade: "Striaton", teamIds: [506, 511] },

      { id: "lenora", nome: "Lenora", tipo: "normal", cidade: "Nacrene", teamIds: [507, 505] },
      { id: "burgh", nome: "Burgh", tipo: "bug", cidade: "Castelia", teamIds: [557, 542] },
      { id: "elesa", nome: "Elesa", tipo: "electric", cidade: "Nimbasa", teamIds: [587, 523] },
      { id: "clay", nome: "Clay", tipo: "ground", cidade: "Driftveil", teamIds: [552, 530] },
      { id: "skyla", nome: "Skyla", tipo: "flying", cidade: "Mistralton", teamIds: [528, 581] },
      { id: "brycen", nome: "Brycen", tipo: "ice", cidade: "Icirrus", teamIds: [614, 615] },

      // 8º ginásio varia por versão (BW)
      { id: "drayden", nome: "Drayden", tipo: "dragon", cidade: "Opelucid", teamIds: [621, 612] },
      { id: "iris", nome: "Iris", tipo: "dragon", cidade: "Opelucid", teamIds: [621, 612] },
    ],
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
    leaders: [
      { id: "viola", nome: "Viola", tipo: "bug", cidade: "Santalune", teamIds: [283, 666] },
      { id: "grant", nome: "Grant", tipo: "rock", cidade: "Cyllage", teamIds: [698, 696] },
      { id: "korrina", nome: "Korrina", tipo: "fighting", cidade: "Shalour", teamIds: [619, 448] },
      { id: "ramos", nome: "Ramos", tipo: "grass", cidade: "Coumarine", teamIds: [189, 673] },
      { id: "clemont", nome: "Clemont", tipo: "electric", cidade: "Lumiose", teamIds: [587, 695] },
      { id: "valerie", nome: "Valerie", tipo: "fairy", cidade: "Laverre", teamIds: [303, 700] },
      { id: "olympia", nome: "Olympia", tipo: "psychic", cidade: "Anistar", teamIds: [561, 678] },
      { id: "wulfric", nome: "Wulfric", tipo: "ice", cidade: "Snowbelle", teamIds: [460, 713] },
    ],
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
    // Alola não tem ginásios clássicos: aqui estão os Kahunas (Grand Trials)
    leaders: [
      { id: "hala", nome: "Hala", tipo: "fighting", cidade: "Melemele", teamIds: [296, 739] },
      { id: "olivia", nome: "Olivia", tipo: "rock", cidade: "Akala", teamIds: [744, 745] },
      { id: "nanu", nome: "Nanu", tipo: "dark", cidade: "Ula'ula", teamIds: [302, 53] },
      { id: "hapu", nome: "Hapu", tipo: "ground", cidade: "Poni", teamIds: [750, 330] },
    ],
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
    leaders: [
      { id: "milo", nome: "Milo", tipo: "grass", cidade: "Turffield", teamIds: [829, 830] },
      { id: "nessa", nome: "Nessa", tipo: "water", cidade: "Hulbury", teamIds: [846, 834] },
      { id: "kabu", nome: "Kabu", tipo: "fire", cidade: "Motostoke", teamIds: [59, 851] },

      // 4º ginásio varia por versão (SwSh)
      { id: "bea", nome: "Bea", tipo: "fighting", cidade: "Stow-on-Side", teamIds: [865, 68] },
      { id: "allister", nome: "Allister", tipo: "ghost", cidade: "Stow-on-Side", teamIds: [778, 94] },

      { id: "opal", nome: "Opal", tipo: "fairy", cidade: "Ballonlea", teamIds: [468, 869] },

      // 6º ginásio varia por versão (SwSh)
      { id: "gordie", nome: "Gordie", tipo: "rock", cidade: "Circhester", teamIds: [874, 839] },
      { id: "melony", nome: "Melony", tipo: "ice", cidade: "Circhester", teamIds: [875, 131] },

      { id: "piers", nome: "Piers", tipo: "dark", cidade: "Spikemuth", teamIds: [862, 560] },
      { id: "raihan", nome: "Raihan", tipo: "dragon", cidade: "Hammerlocke", teamIds: [843, 884] },
    ],
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
    leaders: [
      { id: "katy", nome: "Katy", tipo: "bug", cidade: "Cortondo", teamIds: [917, 216] },
      { id: "brassius", nome: "Brassius", tipo: "grass", cidade: "Artazon", teamIds: [928, 185] },
      { id: "iono", nome: "Iono", tipo: "electric", cidade: "Levincia", teamIds: [940, 939] },
      { id: "kofu", nome: "Kofu", tipo: "water", cidade: "Cascarrafa", teamIds: [961, 976] },
      { id: "larry", nome: "Larry", tipo: "normal", cidade: "Medali", teamIds: [775, 982] },
      { id: "ryme", nome: "Ryme", tipo: "ghost", cidade: "Montenevera", teamIds: [972, 778] },
      { id: "tulip", nome: "Tulip", tipo: "psychic", cidade: "Alfornada", teamIds: [981, 282] },
      { id: "grusha", nome: "Grusha", tipo: "ice", cidade: "Glaseado", teamIds: [975, 873] },
    ],
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
                        href={`/Regioes/${regiao.id}`}
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
