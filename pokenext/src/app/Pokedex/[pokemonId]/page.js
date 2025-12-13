"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

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
  default: "bg-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:text-white",
};

function getTypeClass(typeName) {
  return TYPE_STYLES[typeName] || TYPE_STYLES.default;
}

function formatPokemonName(name) {
  return String(name || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function PokemonDetailPage() {
  const router = useRouter();
  const { pokemonId } = useParams(); // <- se sua pasta for [pokemononId], troque aqui

  const idOrName = String(pokemonId || "").trim().toLowerCase();

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!idOrName) return;

    let alive = true;

    async function fetchPokemon() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
        if (!res.ok) throw new Error("Pokémon não encontrado.");

        const data = await res.json();
        if (!alive) return;

        setPokemon(data);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Erro ao carregar dados do Pokémon.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchPokemon();

    return () => {
      alive = false;
    };
  }, [idOrName]);

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-10">
        <p className="text-sm text-slate-500">Carregando...</p>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="w-full max-w-xl mx-auto mt-10 px-4">
        <p className="text-red-500 text-sm">{error || "Erro desconhecido."}</p>
        <button
          onClick={() => router.push("/pokedex")}
          className="mt-3 text-[#E3350D] hover:underline text-sm font-semibold"
        >
          Voltar para a Pokédex
        </button>
      </div>
    );
  }

  const artwork =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.front_default;

  return (
    <div className="mt-8 w-full px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-5xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-6 items-start">
          {/* ESQUERDA: CARD ORIGINAL (igual estava) */}
          <div className="w-full max-w-[420px]">
            <div className="relative w-full aspect-736/1104">
              <div className="absolute z-10 left-[14%] right-[14%] top-[20%] h-[48%] overflow-hidden rounded-md">
                <div className="relative w-full h-full">
                  <Image
                    src={artwork}
                    alt={formatPokemonName(pokemon.name)}
                    fill
                    unoptimized
                    sizes="420px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Se quiser voltar a moldura, descomenta aqui
              <Image
                src="/pokedexcard.png"
                alt="Moldura Pokédex"
                fill
                priority
                className="z-20 object-contain pointer-events-none select-none"
              />
              */}
            </div>
          </div>

          {/* DIREITA: infos + wallpaper abaixo */}
          <div className="flex flex-col gap-4">
            {/* CARD CINZA (infos) */}
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 p-5">
              <div className="flex items-center gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-black/70 dark:text-white/70">
                    #{String(pokemon.id).padStart(3, "0")}
                  </p>

                  <h2 className="text-2xl font-extrabold text-black dark:text-white leading-tight truncate">
                    {formatPokemonName(pokemon.name)}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
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
                </div>
              </div>

              <div className="mt-4 text-sm text-black/80 dark:text-white/80">
                <span className="font-extrabold">Base XP:</span>{" "}
                {pokemon.base_experience}
                <span className="mx-2 opacity-50">•</span>
                <span className="font-extrabold">Alt:</span> {pokemon.height / 10}m
                <span className="mx-2 opacity-50">•</span>
                <span className="font-extrabold">Peso:</span> {pokemon.weight / 10}kg
              </div>

              <div className="mt-4">
                <button
                  onClick={() => router.push("/pokedex")}
                  className="text-[#E3350D] hover:underline text-sm font-semibold"
                >
                  Voltar para a Pokédex
                </button>
              </div>
            </div>

            {/* ✅ AQUI: wallpaper-preto.png abaixo do card cinza (linha evolutiva) */}
            <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
              <div className="relative w-full h-100 bg-black">
                <Image
                  src="/wallpaper-preto.png"
                  alt="Área da linha evolutiva"
                  fill
                  sizes="(min-width: 768px) 600px, 100vw"
                  className="object-cover"
                  priority={false}
                />

                {/* overlay/placeholder (trocar depois pela linha evolutiva real) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 border border-white/10 rounded-md px-4 py-2">
                    <span className="text-zinc-200 text-sm font-semibold">
                      Linha evolutiva (placeholder)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* ✅ fim do wallpaper */}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
