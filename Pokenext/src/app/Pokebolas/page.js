"use client";

import { motion } from "framer-motion"
import Image from "next/image";

export default function Pokebolas() {
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

            <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {/* CARD */}
                    <div className="flex flex-col rounded-md bg-neutral-600 border border-neutral-600 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-left">

                        {/* IMAGEM + NÚMERO DE FUNDO */}
                        <div
                            className="
          relative h-[230px] overflow-hidden
          bg-neutral-600
          transition-all duration-300
        "
                        >
                            {/* Número de fundo */}
                            <div className="absolute inset-0 flex pointer-events-none">
                                <span
                                    className="
              mt-4 select-none
              text-[140px] leading-none font-black
              text-zinc-500/40
            "
                                >
                                    {/* número */}
                                </span>
                            </div>

                            {/* Imagem */}
                            <Image
                                alt=""
                                className="
            absolute inset-0 z-10
            object-contain
            scale-105
            opacity-100 brightness-110
            transition-all duration-300
          "
                            />
                        </div>

                        {/* DESCRIÇÃO */}
                        <div
                            className="
          h-[140px] p-3
          flex flex-col gap-1
          bg-[url('/wallpaper-preto.png')]
          bg-cover bg-center bg-no-repeat
          transition-all duration-300
        "
                        >
                            {/* Nome + Número */}
                            <h4
                                className="
            flex items-center justify-between
            text-xl font-semibold text-white
          "
                            >
                                {/* Barra + Nome */}
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        className="w-1.5 h-4 rounded-sm bg-[#E3350D] shadow-[0_0_6px_#E3350D]"
                                        initial={{ scaleY: 0.3, opacity: 0 }}
                                        animate={{ scaleY: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.35 }}
                                    />

                                    <span className="capitalize">nome</span>
                                </div>

                                {/* Número */}
                                <span className="text-base text-zinc-300">#</span>
                            </h4>

                            {/* Tipo */}
                            <div className="relative translate-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-white">
                                        Tipo:
                                    </span>

                                    <span
                                        className="
                px-2 py-1 rounded-md
                text-sm font-medium text-white capitalize
              "
                                    >
                                        info
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>



        </div>

    );
}


