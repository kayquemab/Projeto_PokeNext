"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

// 🎨 Estilos por tipo no padrão clássico da Pokédex
const TYPE_STYLES = {
  grass: "bg-[#78C850] text-black dark:bg-[#78C850]",
  poison: "bg-[#A040A0] text-white dark:bg-[#A040A0]",
  fire: "bg-[#F08030] text-white dark:bg-[#F08030]",
  water: "bg-[#6890F0] text-white dark:bg-[#6890F0]",

  electric: "bg-[#F8D030] text-black dark:bg-[#F8D030]",
  flying: "bg-[#A890F0] text-black dark:bg-[#A890F0]",
  ice: "bg-[#98D8D8] text-black dark:bg-[#98D8D8]",

  bug: "bg-[#A8B820] text-black dark:bg-[#A8B820]",
  normal: "bg-[#A8A878] text-black dark:bg-[#A8A878]",
  fighting: "bg-[#C03028] text-white dark:bg-[#C03028]",
  psychic: "bg-[#F85888] text-white dark:bg-[#F85888]",

  rock: "bg-[#B8A038] text-black dark:bg-[#B8A038]",
  ground: "bg-[#E0C068] text-black dark:bg-[#E0C068]",

  ghost: "bg-[#705898] text-white dark:bg-[#705898]",
  dragon: "bg-[#7038F8] text-white dark:bg-[#7038F8]",
  dark: "bg-[#705848] text-white dark:bg-[#705848]",

  steel: "bg-[#B8B8D0] text-black dark:bg-[#B8B8D0]",
  fairy: "bg-[#EE99AC] text-black dark:bg-[#EE99AC]",

  default:
    "bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:text-white",
};

function getTypeClass(typeName) {
  return TYPE_STYLES[typeName] || TYPE_STYLES.default;
}

function formatPokemonName(name) {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

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

  // 🔥 Detalhes extras por Pokémon (tipos para a Pokédex completa)
  const [pokemonDetails, setPokemonDetails] = useState({}); // { [id]: { types: [...] } }

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
  // 🔥 Carrega tipos dos pokémon visíveis na grade
  // --------------------------------------------------------------------
  useEffect(() => {
    if (!allPokemonList.length) return;

    const visible = allPokemonList.slice(0, visibleCount);
    const missing = visible.filter((p) => !pokemonDetails[p.id]);

    if (missing.length === 0) return;

    async function loadDetails() {
      try {
        const responses = await Promise.all(
          missing.map((p) => fetch(p.url).then((res) => res.json()))
        );

        setPokemonDetails((prev) => {
          const updated = { ...prev };
          responses.forEach((data) => {
            updated[data.id] = {
              types: data.types.map((t) => t.type.name),
            };
          });
          return updated;
        });
      } catch (e) {
        console.error("Erro ao carregar detalhes da Pokédex completa", e);
      }
    }

    loadDetails();
  }, [allPokemonList, visibleCount, pokemonDetails]);

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

          {/* ========================================================= */}
          {/* 🔎 CARD DE BUSCA (ocupa 100% da largura disponível)       */}
          {/* ========================================================= */}
          <motion.div
            className="w-full mx-auto rounded-2xl border border-neutral-200 bg-white/95 shadow-md backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Título */}
            <div className="flex flex-col gap-1.5 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Pokédex
              </h1>
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
            <div className="flex items-center gap-3 mb-2">
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

            {loading && (
              <p className="text-sm text-slate-500 mt-2">Carregando...</p>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </motion.div>

          {/* Espaço entre o card de busca e os cards individuais */}
          <div className="mt-8" />

          {/* ========================================================= */}
          {/* 🔥 POKÉDEX COMPLETA → aparece apenas quando NÃO está buscando */}
          {/* ========================================================= */}
          {!pokemon && allPokemonList.length > 0 && (
            <div className="mt-4">

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {allPokemonList.slice(0, visibleCount).map((p) => {
                  const details = pokemonDetails[p.id]; // { types: [...] } ou undefined

                  return (
                    <motion.button
                      key={p.id}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => handleSearchClick(p.name)}
                      className="flex flex-col items-stretch justify-start rounded-md bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.1)] border border-neutral-200 transition-shadow duration-200 text-left"
                    >
                      {/* Moldura da imagem */}
                      <div className="aspect-square w-full rounded-md bg-gray-100 flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Nome / ID */}
                      <p className="mt-3 text-sm font-semibold text-slate-900 text-center">
                        #{String(p.id).padStart(3, "0")} —{" "}
                        <span className="capitalize">
                          {formatPokemonName(p.name)}
                        </span>
                      </p>

                      {/* Tipos (se já carregados) */}
                      {details && details.types && (
                        <div className="mt-2 flex flex-wrap justify-center gap-1">
                          {details.types.map((typeName) => (
                            <span
                              key={typeName}
                              className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${getTypeClass(
                                typeName
                              )}`}
                            >
                              {typeName}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Botão Carregar Mais */}
              <div className="flex justify-center mt-6">
                {visibleCount < allPokemonList.length && (
                  <button
                    onClick={() => setVisibleCount(visibleCount + 15)}
                    className="bg-[#E3350D] text-white px-6 py-2 rounded-md hover:bg-[#c52c0b]"
                  >
                    Carregar mais Pokémon
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 🔥 CARD COMPLETO DO POKÉMON INDIVIDUAL (MOLDURA ESTILO BULBASAUR) */}
          {/* ========================================================= */}
          {pokemon && (
            <div className="mt-8 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex w-full max-w-sm flex-col items-stretch justify-start rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:bg-[#1A2C20]"
              >
                {/* Área da imagem — moldura estilo Bulbasaur */}
                <div className="aspect-square w-full rounded-lg bg-gray-100 p-4 dark:bg-[#102216] flex items-center justify-center">
                  <img
                    src={pokemon.sprites.other["official-artwork"].front_default}
                    alt={formatPokemonName(pokemon.name)}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Infos centrais */}
                <div className="mt-6 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      #{String(pokemon.id).padStart(3, "0")}
                    </p>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                      {formatPokemonName(pokemon.name)}
                    </h2>
                  </div>

                  {/* Tipos com chips coloridos */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {pokemon.types.map((t) => (
                      <div
                        key={t.type.name}
                        className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-md px-4 ${getTypeClass(
                          t.type.name
                        )}`}
                      >
                        <p className="text-sm font-medium leading-normal capitalize">
                          {t.type.name}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Infos extras compactas */}
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <p>
                      <span className="font-semibold">Base XP:</span>{" "}
                      {pokemon.base_experience}
                    </p>
                    <p>
                      <span className="font-semibold">Altura:</span>{" "}
                      {pokemon.height / 10} m
                    </p>
                    <p>
                      <span className="font-semibold">Peso:</span>{" "}
                      {pokemon.weight / 10} kg
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
