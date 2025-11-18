"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Star, Globe2, ChevronDown } from "lucide-react";

export default function Pokedex() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [ability, setAbility] = useState("");
  const [region, setRegion] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClearFilters() {
    setSearch("");
    setType("");
    setAbility("");
    setRegion("");
    setPokemon(null);
    setError("");
  }

  async function handleSearchClick() {
    if (!search.trim()) return;

    try {
      setLoading(true);
      setError("");
      setPokemon(null);

      const query = search.trim().toLowerCase();

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

      if (!res.ok) {
        throw new Error("Pokémon não encontrado.");
      }

      const data = await res.json();
      setPokemon(data);
    } catch (err) {
      setError(err.message || "Erro ao buscar Pokémon.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full">
      {/* Wrapper centralizado, mesma largura base do Navbar (max-w-6xl) */}
      <section className="w-full mt-6 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="w-full max-w-6xl mx-auto">
          {/* Painel branco animado */}
          <motion.div
            className="w-full rounded-2xl border border-neutral-200 bg-white/95 shadow-md backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between gap-3 mb-4">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.015em] text-slate-900">
                  Pokédex
                </h1>
                <p className="text-sm sm:text-base font-normal leading-normal text-slate-600">
                  Encontre informações detalhadas sobre qualquer Pokémon.
                </p>
              </div>
            </div>

            {/* Campo de busca */}
            <div className="mb-4">
              <div className="relative">
                {/* Ícone de busca */}
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <Search className="w-4 h-4" />
                </span>

                <input
                  type="text"
                  placeholder="Buscar por nome ou número..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-neutral-50 text-gray-900 pl-11 pr-4 py-2 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E3350D]/70 focus:border-[#E3350D]/70 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Linha de filtros (pills) – ainda só de UI, sem lógica real */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
              <span className="text-xs sm:text-sm font-medium text-slate-600">
                Filtros:
              </span>

              {/* Tipo */}
              <div className="relative inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 hover:bg-neutral-100">
                <Sparkles className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs sm:text-sm text-slate-700 pr-4"
                >
                  <option value="">Tipo</option>
                  <option value="fire">Fogo</option>
                  <option value="water">Água</option>
                  <option value="grass">Planta</option>
                  <option value="electric">Elétrico</option>
                  <option value="psychic">Psíquico</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 w-3.5 h-3.5 text-slate-500" />
              </div>

              {/* Habilidade */}
              <div className="relative inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 hover:bg-neutral-100">
                <Star className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                <select
                  value={ability}
                  onChange={(e) => setAbility(e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs sm:text-sm text-slate-700 pr-4"
                >
                  <option value="">Habilidade</option>
                  <option value="overgrow">Overgrow</option>
                  <option value="blaze">Blaze</option>
                  <option value="torrent">Torrent</option>
                  <option value="static">Static</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 w-3.5 h-3.5 text-slate-500" />
              </div>

              {/* Região */}
              <div className="relative inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 hover:bg-neutral-100">
                <Globe2 className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs sm:text-sm text-slate-700 pr-4"
                >
                  <option value="">Região</option>
                  <option value="kanto">Kanto</option>
                  <option value="johto">Johto</option>
                  <option value="hoenn">Hoenn</option>
                  <option value="sinnoh">Sinnoh</option>
                  <option value="unova">Unova</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button
                type="button"
                onClick={handleSearchClick}
                className="inline-flex items-center justify-center rounded-md bg-[#E3350D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c52c0b] transition-colors"
              >
                Buscar
              </button>

              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm font-medium text-[#E3350D] hover:underline"
              >
                Limpar Filtros
              </button>
            </div>

            {/* Resultado simples da API /pokemon/{id-ou-nome} */}
            <div className="mt-4">
              {loading && (
                <p className="text-sm text-slate-500">Buscando Pokémon...</p>
              )}

              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              {pokemon && (
                <div className="mt-3 flex items-center gap-4">
                  {pokemon.sprites?.front_default && (
                    <img
                      src={pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="h-16 w-16 object-contain"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      #{pokemon.id} - {pokemon.name.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-600">
                      Base experience: {pokemon.base_experience}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
