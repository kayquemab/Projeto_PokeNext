"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

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

/** Moldura em código (substitui /pokedexcard.png) */
function PokedexCardFrame({ screen, footer }) {
  return (
    <div className="relative w-full aspect-736/1104">
      {/* Corpo externo */}
      <div className="absolute inset-0 rounded-[28px] bg-[#ff2a2a] border-[6px] border-black overflow-hidden">
        {/* Linha interna */}
        <div className="absolute inset-2.5 rounded-[22px] border-[3px] border-black/80 pointer-events-none" />

        {/* Curva/linha do topo */}
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 736 1104"
          preserveAspectRatio="none"
        >
          <path
            d="M0,190 H250
               C330,190 340,160 360,140
               C380,120 420,105 470,105
               H736"
            fill="none"
            stroke="black"
            strokeWidth="10"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>

        {/* Lente azul (topo esquerdo) */}
        <div className="absolute top-[5.5%] left-[7.5%] w-[18%] aspect-square rounded-full border-8 border-black bg-cyan-300">
          <div className="absolute inset-[14%] rounded-full bg-cyan-200/80" />
          <div className="absolute top-[18%] left-[18%] w-[22%] h-[22%] rounded-full bg-white/70" />
        </div>

        {/* Pokébola (topo direito) */}
        <div className="absolute top-[7%] right-[9%] w-[13%] aspect-square rounded-full border-[7px] border-black bg-white overflow-hidden">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[14%] bg-black" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[34%] aspect-square rounded-full bg-white border-[6px] border-black" />
        </div>

        {/* Tela branca */}
        <div className="absolute left-[14%] right-[14%] top-[12%] h-[48%] overflow-hidden rounded-md bg-white border-[6px] border-black">
          {screen}
        </div>

        {/* Painel inferior */}
        <div className="absolute left-[7%] right-[7%] bottom-[7%] h-[23%] rounded-[18px] bg-zinc-700 border-[6px] border-black">
          {/* Barra verde */}
          <div className="absolute left-[5%] right-[5%] top-[8%] h-[16%] rounded-full bg-lime-500 border-[5px] border-black" />

          {/* D-Pad */}
          <div className="absolute left-[6%] bottom-[16%] w-[22%] h-[56%]">
            <div className="absolute inset-0 rounded-[10px] border-[5px] border-black bg-zinc-800" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72%] h-[22%] bg-zinc-600 border-4 border-black rounded-md" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] h-[72%] bg-zinc-600 border-4 border-black rounded-md" />
          </div>

          {/* Display verde */}
          <div className="absolute left-[34%] right-[22%] bottom-[16%] h-[56%] bg-lime-500 border-[6px] border-black rounded-lg" />

          {/* Botões */}
          <div className="absolute right-[6%] bottom-[16%] w-[14%] h-[56%]">
            <div className="absolute top-0 right-0 w-[70%] aspect-square rounded-full bg-red-500 border-[6px] border-black flex items-center justify-center">
              <span className="font-black text-black text-[clamp(10px,1.8vw,18px)]">
                X
              </span>
            </div>

            <div className="absolute bottom-0 right-0 w-[70%] aspect-square rounded-full bg-emerald-500 border-[6px] border-black flex items-center justify-center">
              <span className="font-black text-black text-[clamp(12px,2vw,20px)]">
                ✓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="absolute z-30 left-[10%] right-[10%] bottom-[9%]">
        {footer}
      </div>
    </div>
  );
}

export default function Pokedex() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [ability, setAbility] = useState("");
  const [region, setRegion] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [allNames, setAllNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [allPokemonList, setAllPokemonList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(15);

  const [pokemonDetails, setPokemonDetails] = useState({});

  useEffect(() => {
    async function loadNamesAndPokedex() {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
      const data = await res.json();

      setAllNames(data.results.map((p) => p.name));

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
        console.error(e);
      }
    }

    loadDetails();
  }, [allPokemonList, visibleCount]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (search.length >= 3) {
      const query = search.toLowerCase();
      const match = allNames.filter((n) => n.startsWith(query));
      setSuggestions(match.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }, [search, allNames]);

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

  function handleClearFilters() {
    setSearch("");
    setType("");
    setAbility("");
    setRegion("");
    setPokemon(null);
    setError("");
    setSuggestions([]);
  }

  return (
    <div className="relative w-full">
      <section className="w-full mt-6 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            className="w-full mx-auto rounded-2xl border border-neutral-200 bg-white/95 shadow-md backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-1.5 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Pokédex
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                Encontre informações completas sobre qualquer Pokémon.
              </p>
            </div>

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

          <div className="mt-8" />

          {!pokemon && allPokemonList.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {allPokemonList.slice(0, visibleCount).map((p) => {
                  const details = pokemonDetails[p.id];

                  return (
                    <motion.button
                      key={p.id}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => handleSearchClick(p.name)}
                      className="flex flex-col items-stretch justify-start rounded-md bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.1)] border border-neutral-200 transition-shadow duration-200 text-left"
                    >
                      <div className="relative aspect-square w-full rounded-md bg-gray-100 overflow-hidden">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
                          className="object-contain"
                        />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-900 text-center">
                        #{String(p.id).padStart(3, "0")} —{" "}
                        <span className="capitalize">
                          {formatPokemonName(p.name)}
                        </span>
                      </p>

                      {details?.types && (
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

          {/* Card alinhado à esquerda */}
          {pokemon && (
            <div className="mt-8 flex justify-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[420px]"
              >
                <PokedexCardFrame
                  screen={
                    <div className="relative w-full h-full">
                      <Image
                        src={
                          pokemon.sprites.other["official-artwork"].front_default
                        }
                        alt={formatPokemonName(pokemon.name)}
                        fill
                        unoptimized
                        sizes="420px"
                        className="object-contain"
                      />
                    </div>
                  }
                  footer={
                    <div className="text-center">
                      <p className="text-[11px] font-semibold text-black/80">
                        #{String(pokemon.id).padStart(3, "0")}
                      </p>

                      <h2 className="text-lg font-extrabold text-black leading-tight">
                        {formatPokemonName(pokemon.name)}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                        {pokemon.types.map((t) => (
                          <span
                            key={t.type.name}
                            className={`px-3 py-1 rounded-md text-xs font-bold capitalize ${getTypeClass(
                              t.type.name
                            )}`}
                          >
                            {t.type.name}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3">
                        <button
                          onClick={handleClearFilters}
                          className="text-[#E3350D] hover:underline text-xs font-semibold"
                        >
                          Voltar para a Pokédex
                        </button>
                      </div>
                    </div>
                  }
                />
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
