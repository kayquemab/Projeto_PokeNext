"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  const menu = [
    { label: "Pokédex", href: "/Pokedex" },
    { label: "Movimentos", href: "/Movimentos" },
    { label: "Regiões", href: "/Regioes" },
  ];


  return (
    <header className="relative flex justify-center px-4 sm:px-6 lg:px-8 py-4 h-20">
      <motion.div
        className="flex w-full max-w-6xl items-center justify-between rounded-2xl border border-neutral-200 bg-white/95 shadow-md backdrop-blur-sm px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        {/* Logo + título */}
        <Link
          href="/"
          className="flex items-center gap-3 text-[#333333] cursor-pointer"
        >
          <div className="size-8 text-[#E3350D]">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4ZM24 38C16.268 38 10 31.732 10 24C10 16.268 16.268 10 24 10C31.732 10 38 16.268 38 24C38 31.732 31.732 38 24 38Z"
                fill="currentColor"
              />
              <path
                d="M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z"
                fill="currentColor"
              />
              <path
                d="M0 24H48"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          </div>

          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
            PokeNext
          </h2>
        </Link>

        {/* Menu + botão Battle */}
        <nav className="flex items-center gap-8">

          {/* 🔥 BOTÃO BATTLE */}
          <motion.div
            whileHover={{
              scale: 1.08,
              y: -2,
              transition: { type: "spring", stiffness: 250, damping: 14 },
            }}
          >
            <Link
              href="/Battle"
              className="px-4 py-2 rounded-xl bg-[#E3350D] text-white text-sm font-semibold shadow-sm hover:bg-red-600 transition-colors"
            >
              Batalha Online
            </Link>
          </motion.div>

          {/* Itens do menu */}
          {menu.map((item) => (
            <motion.div
              key={item.href}
              whileHover={{
                scale: 1.08,
                y: -2,
                transition: { type: "spring", stiffness: 250, damping: 14 },
              }}
            >
              <Link
                href={item.href}
                className="text-sm font-medium leading-normal text-[#333333] hover:text-[#E3350D] transition-colors"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.div>
    </header>
  );
}
