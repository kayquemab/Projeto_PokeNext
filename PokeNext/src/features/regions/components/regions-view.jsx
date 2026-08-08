"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { regioes } from "../regions.constants";

export default function Regioes() {
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
                        href={`/regioes/${regiao.id}`}
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
