"use client";

import React, { useState, useEffect } from "react";
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

  // Autocomplete
  const [allNames, setAllNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Pokédex Completa
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);

  // --------------------------------------------------------------------
  // 🔥 Carrega todos os nomes + pokedex completa ao abrir a página
  // --------------------------------------------------------------------
  useEffect(() => {
    async function loadNamesAndPokedex() {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
      const data = await res.json();

      // Apenas nomes para autocomplete
      setAllNames(data.results.map((p) => p.name));

      // Toda pokedex formatada
      const formatted = data.results.map((p) => {
        const id = Number(p.url.split("/")[6]);
        return {
          name: p.name,
          id,
          url: p.url,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      });

      setAllPokemonList(formatted);
    }

    loadNamesAndPokedex();
  }, []);

  // --------------------------------------------------------------------
  // 🔥 Autocomplete ao digitar 3 letras
  // --------------------------------------------------------------------
  useEffect(() => {
    if (search.length >= 3) {
      const query = search.toLowerCase();
      const match = allNames.filter((n) => n.startsWith(query));
      setSuggestions(match.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }, [search, allNames]);

  // --------------------------------------------------------------------
  // 🔥 Buscar 1 Pokémon
  // --------------------------------------------------------------------
  async function handleSearchClick(nameOverride) {
    const query = (nameOverride || search).trim().toLowerCase();
    if (!query) return;

    try {
      setLoading(true);
      setError("");
      setPokemon(null);

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

      if (!res.ok) throw new Error("Pokémon não encontrado.");

      const data = await res.json();
      setPokemon(data);
      setSuggestions([]);
    } catch (err) {
      setError(err.message || "Erro ao buscar Pokémon.");
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------------------------
  // Limpar filtros e resultados
  // --------------------------------------------------------------------
  function handleClearFilters() {
    setSearch("");
    setType("");
    setAbility("");
    setRegion("");
    setPokemon(null);
    setError("");
    setSuggestions([]);
  }

  // ====================================================================
  // COMPONENTE
  // ====================================================================
  return (
    <div className="relative w-full">
      <section className="w-full mt-6 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="w-full max-w-6xl mx-auto">

          <motion.div
            className="w-full rounded-2xl border border-neutral-200 bg-white/95 shadow-md backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >

            {/* Título */}
            <div className="flex flex-col gap-1.5 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Pokédex</h1>
              <p className="text-sm sm:text-base text-slate-600">
                Encontre informações completas sobre qualquer Pokémon.
              </p>
            </div>

            {/* Campo de busca */}
            <div className="relative mb-6">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>

              <input
                type="text"
                placeholder="Buscar por nome ou número..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-50 text-gray-900 pl-11 pr-4 py-2 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#E3350D]/70"
              />

              {/* 🔥 Dropdown de sugestões */}
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-neutral-200 z-20 overflow-hidden">
                  {suggestions.map((name) => (
                    <button
                      key={name}
                      onClick={() => handleSearchClick(name)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 capitalize"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => handleSearchClick()}
                className="bg-[#E3350D] text-white px-4 py-2 rounded-md hover:bg-[#c52c0b]"
              >
                Buscar
              </button>

              <button
                onClick={handleClearFilters}
                className="text-[#E3350D] hover:underline text-sm"
              >
                Limpar Filtros
              </button>
            </div>

            {/* Mensagens */}
            {loading && <p className="text-sm text-slate-500">Carregando...</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* ========================================================= */}
            {/* 🔥 POKÉDEX COMPLETA → aparece apenas quando NÃO está buscando */}
            {/* ========================================================= */}
            {!pokemon && allPokemonList.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Pokédex Completa
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {allPokemonList.slice(0, visibleCount).map((p) => (
                    <motion.div
                      key={p.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSearchClick(p.name)}
                      className="p-4 rounded-xl border bg-white shadow hover:shadow-lg cursor-pointer"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-32 object-contain"
                      />

                      <p className="text-center mt-2 font-semibold capitalize">
                        #{p.id} — {p.name}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Botão Carregar Mais */}
                <div className="flex justify-center mt-6">
                  {visibleCount < allPokemonList.length && (
                    <button
                      onClick={() => setVisibleCount(visibleCount + 15)}
                      className="bg-[#E3350D] text-white px-6 py-2 rounded-md hover:bg-[#c52c0b]"
                    >
                      Carregar mais
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 🔥 CARD COMPLETO DO POKÉMON INDIVIDUAL */}
            {/* ========================================================= */}
            {pokemon && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Card da Imagem */}
                <motion.div
                  className="p-5 rounded-xl border bg-white shadow-lg flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <img
                    src={pokemon.sprites.other["official-artwork"].front_default}
                    alt={pokemon.name}
                    className="w-48 h-48 object-contain"
                  />

                  <h2 className="text-xl font-bold mt-4">
                    #{pokemon.id} – {pokemon.name.toUpperCase()}
                  </h2>

                  <p className="text-sm text-slate-600 mt-1">
                    Base XP: {pokemon.base_experience}
                  </p>
                </motion.div>

                {/* Card de Atributos */}
                <motion.div
                  className="p-5 rounded-xl border bg-white shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-semibold mb-3">Atributos</h3>

                  <div className="space-y-2">
                    <p><b>Altura:</b> {pokemon.height / 10} m</p>
                    <p><b>Peso:</b> {pokemon.weight / 10} kg</p>

                    <p><b>Tipos:</b></p>
                    <div className="flex gap-2">
                      {pokemon.types.map((t) => (
                        <span
                          key={t.type.name}
                          className="px-3 py-1 bg-neutral-100 rounded-full text-sm capitalize"
                        >
                          {t.type.name}
                        </span>
                      ))}
                    </div>

                    <p className="mt-3"><b>Habilidades:</b></p>
                    <ul className="list-disc ml-5 text-sm">
                      {pokemon.abilities.map((a) => (
                        <li key={a.ability.name} className="capitalize">
                          {a.ability.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            )}

          </motion.div>
        </div>
      </section>
    </div>
  );
}
