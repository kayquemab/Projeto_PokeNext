"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Mapa() {
  return (
    <div className="relative w-full">
      <section className="w-full mt-6 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-3xl mx-auto lg:ml-[6%] lg:mr-0">
          {/* CARD ANIMADO (entrada) */}
          <motion.div
            className="overflow-hidden rounded-2xl bg-white/95 shadow-lg ring-1 ring-black/5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            {/* MAPA (hover suave só no mapa) */}
            <motion.div
              className="relative w-full aspect-video"
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
              <Image
                src="/MAPAPOKEMON.jpeg"
                alt="Mapa do mundo Pokémon"
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* PARTE BRANCA EMBAIXO (o “card” propriamente dito) */}
            <div className="p-4 sm:p-5 md:p-6">
              <h1 className="text-base sm:text-lg font-semibold text-slate-900">
                Mapa do Mundo Pokémon
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Explore visualmente as regiões do universo Pokémon a partir
                deste mapa interativo.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
