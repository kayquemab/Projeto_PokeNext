"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Pokedex() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Card fino full-width com animação */}
      <motion.div
        className="w-full bg-white shadow-md rounded-md p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <input
          type="text"
          placeholder="Pesquisar Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </motion.div>

      {/* Área para resultados */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <p className="text-gray-500 text-center">
          Resultados da pesquisa aparecerão aqui...
        </p>
      </motion.div>
    </div>
  );
}
