"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovesByPokemonCarousel } from "@/features/moves";
import { getTypeClass } from "@/shared/poke-api";
import { usePokemonDetail } from "../hooks/use-pokemon-detail";

const padId4 = (id) => String(id).padStart(4, "0");

export default function PokemonId({ pokemonId }) {
  const {
    allForms,
    category,
    description,
    error,
    evoError,
    evoLoading,
    evoStages,
    isNavigating,
    loading,
    navigateToPokedex,
    navigateToPokemon,
    nextId,
    nextPokemon,
    pokemon,
    prefetch,
    prevId,
    prevPokemon,
    weaknesses,
    weakLoading,
  } = usePokemonDetail(pokemonId);

  if (loading && !pokemon) {
    return (
      <div />
    );
  }

  if (error || !pokemon) {
    return (
      <div className="w-full max-w-xl mx-auto mt-10 px-4">
        <p className="text-red-500 text-sm">{error || "Erro desconhecido."}</p>
        <button
          onClick={navigateToPokedex}
          className="mt-3 text-[#E3350D] hover:underline text-sm font-semibold"
        >
          Voltar para a Pokédex
        </button>
      </div>
    );
  }

  const artwork = pokemon.artworkUrl;

  return (
    <div>

      {/* Avançar e retroceder */}
      <header className="relative w-full">
        <motion.div className="mx-auto w-full max-w-6xl pt-0 pb-0">
          <div className="w-full">
            <div className="grid grid-cols-2 gap-1">

              {/* Prev */}
              <button
                type="button"
                onClick={() => navigateToPokemon(prevId)}
                onMouseEnter={() => prefetch(prevId)}
                onFocus={() => prefetch(prevId)}
                disabled={isNavigating}
                className={[
                  "group flex w-full items-center justify-start gap-3 rounded-l-2xl px-4 py-3 text-left text-white transition",
                  "bg-[#616161] hover:bg-[#1B1B1B]",
                  "disabled:opacity-70 disabled:pointer-events-none"
                ].join(" ")}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#616161] transition group-hover:text-[#1B1B1B]">
                  <ChevronLeft className="h-4 w-4" />
                </span>

                <div className="leading-tight">
                  <div className="text-xs font-semibold opacity-90">
                    N° {padId4(prevId)}
                  </div>

                  <div className="text-sm font-semibold truncate max-w-[180px] sm:max-w-none">
                    {prevPokemon?.displayName ? (
                      prevPokemon.displayName
                    ) : (
                      <span className="inline-block h-4 w-28 rounded align-middle" />
                    )}
                  </div>
                </div>
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={() => navigateToPokemon(nextId)}
                onMouseEnter={() => prefetch(nextId)}
                onFocus={() => prefetch(nextId)}
                disabled={isNavigating}
                className={[
                  "group flex w-full items-center justify-end gap-3 rounded-r-2xl px-4 py-3 text-right text-white transition",
                  "bg-[#616161] hover:bg-[#1B1B1B]",
                  "disabled:opacity-70 disabled:pointer-events-none"
                ].join(" ")}
              >
                <div className="leading-tight">
                  <div className="text-sm font-semibold truncate max-w-[180px] sm:max-w-none">
                    {nextPokemon?.displayName ? (
                      nextPokemon.displayName
                    ) : (
                      <span className="inline-block h-4 w-28 rounded align-middle" />
                    )}
                  </div>

                  <div className="text-xs font-semibold opacity-90">
                    N° {padId4(nextId)}
                  </div>
                </div>

                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#616161] transition group-hover:text-[#1B1B1B]">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>

            </div>
          </div>
        </motion.div>
      </header>

      {/* Conteúdo principal */}
      <div className="mt-5 w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-6xl"
        >

          {/* ================= TOPO CENTRAL ================= */}
          <div className="mb-6 text-center">
            <h1 className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
              <span className="opacity-90">
                {pokemon.displayName}
              </span>

              <span className="text-gray-600 font-medium">
                #{String(pokemon.id).padStart(4, "0")}
              </span>
            </h1>
          </div>



          {/* Mecanismo para formas */}
          {allForms.length > 1 && (
            <div className="w-full flex items-center justify-end mb-2 px-4 sm:px-0">
              <div className="w-full sm:w-72">
                <div className="relative w-full">

                  <select
                    className="w-full appearance-none bg-neutral-700 text-white px-3 py-2 pr-10 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#E3350D]/60"
                    value={String(pokemon.id)}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId && selectedId !== String(pokemon.id)) {
                        navigateToPokemon(selectedId);
                      }
                    }}
                  >
                    {allForms.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.label} ({v.displayName})
                      </option>
                    ))}
                  </select>

                  <svg
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>

                </div>
              </div>
            </div>
          )}


          {/* ================= LINHA 1 ================= */}
          <div className="grid grid-cols-1 md:grid-cols-[520px_1fr] gap-6 items-start">

            {/* ===== CARD DA IMAGEM ===== */}
            <div className="w-full h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="
      relative
      h-full w-full
      rounded-2xl
      bg-[url('/wallpaper-preto.png')]
      bg-cover bg-center bg-no-repeat
      shadow-lg
      p-6
      flex items-center justify-center
    "
              >
                <div className="relative w-full max-w-[370px] aspect-square">
                  <Image
                    src={artwork}
                    alt={pokemon.displayName}
                    fill
                    unoptimized
                    sizes="380px"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>


            {/* ===== DESCRIÇÃO + INFOS ===== */}
            <div className="flex flex-col gap-4">

              {/* Descrição */}
              <div
                className="
    rounded-xl
    border border-black/10 dark:border-white/10
    p-5
    bg-cover bg-center bg-no-repeat
  "
                style={{
                  backgroundImage: "url('/wallpaper-cinza.png')",
                }}
              >
                {/* overlay opcional para manter legibilidade */}
                <div className="bg-white/70 dark:bg-zinc-900/60 rounded-lg p-5 -m-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <motion.div
                        className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                        initial={{ scaleY: 0.3, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.35 }}
                      />

                      <h2 className="text-xl font-extrabold text-black dark:text-white leading-tight">
                        Descrição
                      </h2>
                    </div>
                  </div>



                  <p className="mt-4 text-sm text-black/80 dark:text-white/80 leading-relaxed">
                    {description || "Descrição indisponível para este Pokémon."}
                  </p>
                </div>
              </div>

              {/* Informações */}
              <div
                className="
    rounded-xl
    border border-black/10 dark:border-white/10
    p-5
    bg-cover bg-center bg-no-repeat
  "
                style={{
                  backgroundImage: "url('/wallpaper-cinza.png')",
                }}
              >
                {/* overlay para legibilidade */}
                <div className="bg-white/70 dark:bg-zinc-900/60 rounded-lg p-5 -m-5">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                      initial={{ scaleY: 0.3, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.35 }}
                    />

                    <h3 className="text-xl font-extrabold text-black dark:text-white">
                      Informações
                    </h3>
                  </div>


                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-black/80 dark:text-white/80">
                    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3">
                      <p className="text-xs font-semibold opacity-70">Altura</p>
                      <p className="font-extrabold">{pokemon.heightDecimeters / 10} m</p>
                    </div>

                    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3">
                      <p className="text-xs font-semibold opacity-70">Peso</p>
                      <p className="font-extrabold">{pokemon.weightHectograms / 10} kg</p>
                    </div>

                    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3 col-span-2">
                      <p className="text-xs font-semibold opacity-70">Categoria</p>
                      <p className="font-extrabold">
                        {category || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-3 col-span-2">
                      <p className="text-xs font-semibold opacity-70">Habilidades</p>
                      <p className="font-extrabold">
                        {pokemon.abilities.map((a) => a.label).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ================= LINHA 2 ================= */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

            {/* ================= Estatísticas ================= */}
            <div
              className="
      rounded-xl
      border border-black/10 dark:border-white/10
      p-5
      bg-cover bg-center bg-no-repeat
    "
              style={{ backgroundImage: "url('/wallpaper-cinza.png')" }}
            >
              <div className="bg-white/70 dark:bg-zinc-900/60 rounded-lg p-5 -m-5">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                    initial={{ scaleY: 0.3, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                  />

                  <h3 className="text-xl font-extrabold text-black dark:text-white">
                    Estatísticas
                  </h3>
                </div>

                <div className="mt-4 space-y-3">
                  {pokemon.stats.map((s) => {
                    const value = s.value;
                    const pct = Math.min(100, Math.round((value / 255) * 100));
                    const label = s.label;

                    return (
                      <div key={s.code} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-black/70 dark:text-white/70">
                          <span>{label}</span>
                          <span>{value}</span>
                        </div>

                        <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-black/50 dark:bg-white/50"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ================= Tipo / Fraquezas ================= */}
            <div
              className="
      rounded-xl
      border border-black/10 dark:border-white/10
      p-5
      bg-cover bg-center bg-no-repeat
    "
              style={{ backgroundImage: "url('/wallpaper-cinza.png')" }}
            >
              <div className="bg-white/70 dark:bg-zinc-900/60 rounded-lg p-5 -m-5">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                    initial={{ scaleY: 0.3, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                  />

                  <h3 className="text-xl font-extrabold text-black dark:text-white">
                    Tipo / Fraquezas
                  </h3>
                </div>

                {/* Tipos */}
                <div className="mt-5">
                  <p className="text-xs font-semibold text-black/70 dark:text-white/70">
                    Tipos
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {pokemon.types.map((t) => (
                      <span
                        key={t.code}
                        className={`
                px-4 py-2
                rounded-lg
                text-sm font-extrabold
                capitalize
                shadow-sm
                text-white
                ${getTypeClass(t.code)}
              `}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fraquezas */}
                <div className="mt-6">
                  <p className="text-xs font-semibold text-black/70 dark:text-white/70">
                    Fraquezas {weakLoading ? "(calculando...)" : ""}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {weaknesses.length > 0 ? (
                      weaknesses.map((w) => (
                        <span
                          key={w.code}
                          className={`
                  px-4 py-2
                  rounded-lg
                  text-sm font-extrabold
                  capitalize
                  shadow-sm
                  text-white
                  ${getTypeClass(w.code)}
                `}
                        >
                          {w.label}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-black/60 dark:text-white/60">
                        —
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </motion.div>
      </div>



      {/* ================= LINHA 3: Linha evolutiva ================= */}
      <div className="
  mt-6
  px-4
  sm:px-6
  md:px-8
  lg:px-0
">

        <div
          className="
      mx-auto w-full max-w-6xl
      rounded-2xl
      border border-black/10 dark:border-white/10
      overflow-hidden
      bg-[url('/wallpaper-preto.png')]
      bg-cover bg-center bg-no-repeat
      shadow-lg
    "
        >
          <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                  initial={{ scaleY: 0.3, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                />

                <h3 className="text-xl font-extrabold text-black dark:text-white">
                  Linha evolutiva
                </h3>
              </div>
            </div>

            {!evoLoading && !evoError && evoStages?.length > 0 && (() => {
              const isBranched = evoStages.some(stage => stage.length > 2);

              /* ================= EVOLUÇÃO RAMIFICADA (EEVEE) ================= */
              if (isBranched) {
                const base = evoStages[0][0];
                const evolutions = evoStages.flat().slice(1);

                const isBaseCurrent =
                  String(base.id) === String(pokemon.id);

                return (
                  <div className="flex flex-col items-center gap-8">
                    {/* --- (EEVEE INTACTO, NÃO MEXIDO) --- */}
                    {/* Pokémon base */}
                    <button
                      onClick={() => navigateToPokemon(base.id)}
                      className={`
                  flex flex-col items-center gap-2
                  rounded-xl border
                  px-6 py-4
                  transition
                  ${isBaseCurrent
                          ? "border-[#E3350D] bg-white/20"
                          : "border-white/15 bg-white/10 hover:bg-white/20"
                        }
                `}
                    >
                      <div className="relative w-32 h-32">
                        <Image
                          src={base.artwork}
                          alt={base.displayName}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>

                      <p className="text-sm font-extrabold text-zinc-100">
                        {base.displayName}
                      </p>

                      <span className="text-[11px] font-bold text-zinc-300">
                        #{String(base.id).padStart(3, "0")}
                      </span>

                      <div className="flex gap-1">
                        {base.types.slice(0, 2).map(tp => (
                          <span
                            key={tp.code}
                            className={`px-2 py-1 rounded text-[10px] font-extrabold capitalize text-white ${getTypeClass(tp.code)}`}
                          >
                            {tp.label}
                          </span>
                        ))}
                      </div>
                    </button>

                    <div className="w-32 h-px bg-white/30" />

                    <div className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                gap-6
              ">
                      {evolutions.map(evo => {
                        const isCurrent =
                          String(evo.id) === String(pokemon.id);

                        return (
                          <button
                            key={evo.slug}
                            onClick={() => navigateToPokemon(evo.id)}
                            className={`
                        flex flex-col items-center gap-2
                        rounded-xl border
                        px-4 py-4
                        min-w-40
                        transition
                        ${isCurrent
                                ? "border-[#E3350D] bg-white/20"
                                : "border-white/15 bg-white/10 hover:bg-white/20"
                              }
                      `}
                          >
                            <div className="relative w-28 h-28">
                              <Image
                                src={evo.artwork}
                                alt={evo.displayName}
                                fill
                                unoptimized
                                className="object-contain"
                              />
                            </div>

                            <p className="text-xs font-extrabold text-zinc-100">
                              {evo.displayName}
                            </p>

                            <span className="text-[10px] font-bold text-zinc-300">
                              #{String(evo.id).padStart(3, "0")}
                            </span>

                            <div className="flex gap-1">
                              {evo.types.slice(0, 2).map(tp => (
                                <span
                                  key={tp.code}
                                  className={`px-2 py-1 rounded text-[10px] font-extrabold capitalize text-white ${getTypeClass(tp.code)}`}
                                >
                                  {tp.label}
                                </span>
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              /* ================= EVOLUÇÃO LINEAR (MOBILE EMPILHADO) ================= */
              return (
                <div className="flex justify-center">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {evoStages.map((stage, stageIdx) => (
                      <div
                        key={stageIdx}
                        className="flex flex-col md:flex-row items-center gap-6"
                      >
                        {stage.map(evo => {
                          const isCurrent =
                            String(evo.id) === String(pokemon.id);

                          return (
                            <button
                              key={evo.slug}
                              onClick={() => navigateToPokemon(evo.id)}
                              className={`
                          flex flex-col items-center gap-2
                          rounded-xl border
                          px-5 py-4
                          min-w-40
                          transition
                          ${isCurrent
                                  ? "border-[#E3350D] bg-white/20"
                                  : "border-white/15 bg-white/10 hover:bg-white/20"
                                }
                        `}
                            >
                              <div className="relative w-28 h-28">
                                <Image
                                  src={evo.artwork}
                                  alt={evo.displayName}
                                  fill
                                  unoptimized
                                  className="object-contain"
                                />
                              </div>

                              <p className="text-sm font-extrabold text-zinc-100">
                                {evo.displayName}
                              </p>

                              <span className="text-[11px] font-bold text-zinc-300">
                                #{String(evo.id).padStart(3, "0")}
                              </span>

                              <div className="flex gap-1">
                                {evo.types.slice(0, 2).map(tp => (
                                  <span
                                    key={tp.code}
                                    className={`px-2 py-1 rounded text-[10px] font-extrabold capitalize text-white ${getTypeClass(tp.code)}`}
                                  >
                                    {tp.label}
                                  </span>
                                ))}
                              </div>
                            </button>
                          );
                        })}

                        {/* seta responsiva */}
                        {stageIdx < evoStages.length - 1 && (
                          <>
                            {/* Mobile: seta para baixo */}
                            <span className="md:hidden text-zinc-200/70 text-xl font-extrabold">
                              ↓
                            </span>

                            {/* Desktop: seta para direita */}
                            <span className="hidden md:block text-zinc-200/70 text-xl font-extrabold">
                              →
                            </span>
                          </>
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      {/* Carrousel - final */}
      <div className="mt-6 w-full flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <div className="w-full">
          <MovesByPokemonCarousel pokemonId={pokemon.id} />
        </div>
      </div>

      {/* Botão Voltar para a Pokédex */}
      <div
        className="
    w-full max-w-6xl
    rounded-2xl
    mx-auto mt-6
    overflow-visible
  "
      >
        <div className="px-5 pb-4 flex justify-end">
          <motion.button
            onClick={navigateToPokedex}
            whileHover={{
              scale: 1.08,
              y: -2,
              transition: { type: "spring", stiffness: 250, damping: 14 },
            }}
            className="
        relative z-10
        px-6 py-3
        rounded-xl
        bg-[#E3350D] hover:bg-[#C32B0B]
        text-white font-semibold text-sm
        transition
      "
          >
            Voltar para a Pokédex
          </motion.button>
        </div>
      </div>

    </div>
  );
}

