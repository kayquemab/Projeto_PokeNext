"use client";

import { Earth, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Principal() {
  const cards = [
    {
      icon: <Earth className="w-10 h-10 text-red-600" />,
      title: "Seleção de Região",
      description:
        "Navegue pelos Pokémon de Kanto, Johto, Hoenn e outras regiões.",
      href: "/Regioes",
    },
    {
      icon: <Search className="w-10 h-10 text-red-600" />,
      title: "Busca Global",
      description: "Encontre qualquer Pokémon pelo nome ou número na Pokedex.",
      href: "/Pokedex",
    },
  ];

  return (
    <div className="relative flex w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex grow flex-col">
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-1 items-center justify-center">
            <div className="layout-content-container flex flex-col max-w-3xl flex-1 gap-12 text-center">

              {/* HERO */}
              <section className="flex flex-col items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-black">
                  Sua Pokedex Online Completa
                </h1>

                <p className="max-w-md text-sm text-black opacity-90">
                  Veja detalhes de cada Pokémon e explore suas regiões e evoluções.
                </p>
              </section>


              {/* CARDS */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cards.map((card, index) => (
                  <motion.a
                    key={index}
                    href={card.href}
                    className="group"
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
                      delay: index * 0.15,
                      ease: "easeOut",
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-[#E3350D]">
                      {card.icon}
                      <h3 className="text-xl font-bold text-black">
                        {card.title}
                      </h3>
                      <p className="text-sm text-black">{card.description}</p>
                    </div>
                  </motion.a>
                ))}
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
