"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative  flex justify-center px-4 sm:px-6 lg:px-8 pb-6">
      {/* Painel branco centralizado, agora com animação de entrada */}
      <motion.div
        className="w-full max-w-6xl rounded-2xl border border-neutral-200 bg-white/95 shadow-md backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo + texto principal */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-[#666666]">
            {/* Ícone (mesmo do Navbar) */}
            <div className="size-6 text-[#E3350D]">
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

            <div>
              <p className="font-semibold text-[#333333]">PokeNext</p>
              <p>
                &copy; {new Date().getFullYear()} – Todos os direitos
                reservados.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#666666]">
            <a href="#" className="hover:text-[#E3350D] transition-colors">
              Termos de uso
            </a>
            <span className="hidden sm:inline-block text-[#CCCCCC]">•</span>
            <a href="#" className="hover:text-[#E3350D] transition-colors">
              Política de privacidade
            </a>
            <span className="hidden sm:inline-block text-[#CCCCCC]">•</span>
            <a href="#" className="hover:text-[#E3350D] transition-colors">
              Contato
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
