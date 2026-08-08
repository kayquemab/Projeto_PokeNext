"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative flex justify-center px-4 sm:px-6 lg:px-8 py-6">
      <motion.div
        className="
      grid grid-cols-1
      sm:grid-cols-[auto_1fr_auto]
      w-full max-w-6xl
      items-center
      rounded-2xl border border-neutral-200
      bg-white/95 shadow-md backdrop-blur-sm
      px-4 sm:px-6 lg:px-8
      py-4
    "
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Logo + texto (sempre visível) */}
        <div
          className="
        flex items-center gap-3
        justify-self-center
        sm:justify-self-start
        text-xs sm:text-sm text-[#666666]
      "
        >
          <div className="size-6 text-[#E3350D] shrink-0">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
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

          <div>
            <p className="font-semibold text-[#333333]">PokeNext
              © {new Date().getFullYear()}</p>
          </div>
        </div>

        {/* Espaço central (igual ao header) */}
        <div className="hidden sm:block" />

        {/* Links — só desktop */}
        <div className="hidden sm:flex items-center gap-4 justify-self-end text-sm text-[#666666]">
          <a
            href="https://www.pokemon.com/br/terms-of-use/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E3350D] transition-colors"
          >
            Termos de uso
          </a>

          <span className="text-[#CCCCCC]">•</span>

          <a
            href="https://www.pokemon.com/br/privacy-notice/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E3350D] transition-colors"
          >
            Privacidade
          </a>

          <span className="text-[#CCCCCC]">•</span>

          <a
            href="https://www.pokemon.com/br/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E3350D] transition-colors"
          >
            Pokémon Oficial
          </a>
        </div>
      </motion.div>
    </footer>
  );
}
