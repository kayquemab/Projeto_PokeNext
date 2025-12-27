"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const menu = [
    { label: "Pokédex", href: "/Pokedex" },
    { label: "Regiões", href: "/Regioes" },
    { label: "Movimentos", href: "/Movimentos" },
    { label: "Times", href: "/Times" },
    { label: "Habilidades", href: "/Habilidades" },
    { label: "Evolução", href: "/Evolucao" },
    { label: "Exploração", href: "/Exploração" },
  ];

  return (
    <header className="relative z-50 flex justify-center px-4 sm:px-6 lg:px-8 py-4 h-20">
      <motion.div
        className="
          w-full max-w-6xl
          rounded-2xl border border-neutral-200
          bg-white/95 shadow-md backdrop-blur-sm
          px-4 sm:px-6 lg:px-8
        "
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* TOPO */}
        <div className="flex items-center justify-between h-12">
          {/* Logo + título */}
          <Link
            href="/"
            className="flex items-center gap-3 text-[#333333]"
          >
            <div className="size-8 text-[#E3350D]">
              <svg fill="none" viewBox="0 0 48 48">
                <path
                  d="M24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4ZM24 38C16.268 38 10 31.732 10 24C10 16.268 16.268 10 24 10C31.732 10 38 16.268 38 24C38 31.732 31.732 38 24 38Z"
                  fill="currentColor"
                />
                <path
                  d="M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z"
                  fill="currentColor"
                />
                <path d="M0 24H48" stroke="currentColor" strokeWidth="4" />
              </svg>
            </div>

            <h2 className="text-lg font-bold">PokeNext</h2>
          </Link>

          {/* HAMBURGUER (mobile + tablet) */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-2xl font-bold text-[#333333]"
          >
            {open ? "✕" : "☰"}
          </button>

          {/* MENU DESKTOP */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/Battle"
              className="px-4 py-2 rounded-xl bg-[#E3350D] text-white text-sm font-semibold hover:bg-red-600 transition"
            >
              Batalha Online
            </Link>

            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#333333] hover:text-[#E3350D]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* MENU MOBILE / TABLET */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="
                absolute left-0 right-0 top-full
                z-50 mt-4
                lg:hidden
                flex flex-col gap-4
                p-4
                bg-white
                border border-neutral-200
                rounded-2xl
                shadow-xl
              "
            >
              <Link
                href="/Battle"
                className="px-4 py-2 rounded-xl bg-[#E3350D] text-white text-sm font-semibold text-center"
                onClick={() => setOpen(false)}
              >
                Batalha Online
              </Link>

              {menu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-[#333333] hover:text-[#E3350D]"
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
