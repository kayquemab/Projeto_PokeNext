"use client";

import { motion } from "framer-motion";
import PokemonByMoveCarousel from "./pokemon-by-move-carousel";
import { useMoveDetail } from "../hooks/use-move-detail";

const TYPE_STYLES = {
  bug: "bg-[#A8B820] text-white",
  dragon: "bg-[#7038F8] text-white",
  fairy: "bg-[#EE99AC] text-white",
  fire: "bg-[#F08030] text-white",
  ghost: "bg-[#705898] text-white",
  ground: "bg-[#E0C068] text-white",
  normal: "bg-[#A8A878] text-white",
  psychic: "bg-[#F85888] text-white",
  steel: "bg-[#B8B8D0] text-white",
  dark: "bg-[#705848] text-white",
  electric: "bg-[#F8D030] text-white",
  fighting: "bg-[#C03028] text-white",
  flying: "bg-[#A890F0] text-white",
  grass: "bg-[#78C850] text-white",
  ice: "bg-[#98D8D8] text-white",
  poison: "bg-[#A040A0] text-white",
  rock: "bg-[#B8A038] text-white",
  water: "bg-[#6890F0] text-white",
  default: "bg-neutral-400 text-white",
};

function getTypeClass(typeName) {
  return TYPE_STYLES[typeName] || TYPE_STYLES.default;
}

function safe(v, fallback = "—") {
  return v === null || v === undefined || v === "" ? fallback : v;
}

export default function MoveIdPage({ moveId }) {
  const { error, goBack, loading, move } = useMoveDetail(moveId);

  if (loading && !move) return <div />;

  if (error || !move) {
    return (
      <div className="w-full max-w-xl mx-auto mt-10 px-4">
        <p className="text-red-500 text-sm">{error || "Erro desconhecido."}</p>
        <button
          type="button"
          onClick={goBack}
          className="mt-3 text-[#E3350D] hover:underline text-sm font-semibold"
        >
          Voltar para Movimentos
        </button>
      </div>
    );
  }

  const typeName = move?.type?.code || "";
  const flavor = move.flavorText;
  const effect = move.effectText;

  const damageClass = move?.damageClass?.label || "";
  const accuracy = move?.accuracy;
  const power = move?.power;
  const pp = move?.pp;
  const priority = move?.priority;

  const contestType = move?.contestType?.label || "";
  const ailment = move?.meta?.ailment?.label || "";
  const critRate = move?.meta?.critRate;
  const flinchChance = move?.meta?.flinchChance;
  const effectChance = move?.effectChance;
  const drain = move?.meta?.drain;
  const healing = move?.meta?.healing;

  return (
    <div>



      <div className="mt-5 w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto w-full max-w-6xl"
        >

          <div className="mb-6 text-center">
            <h1 className="flex flex-wrap items-center justify-center gap-8 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
              <span className="opacity-90">{move.displayName}</span>

              {typeName ? (
                <span
                  className={[
                    "px-3 py-1 rounded-lg text-sm sm:text-base font-extrabold capitalize shadow-sm",
                    getTypeClass(typeName),
                  ].join(" ")}
                >
                  {move.type.label}
                </span>
              ) : null}
            </h1>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-[520px_1fr] gap-6 items-start">
            <div className="w-full h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28 }}
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
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]"
                      initial={{ scaleY: 0.3, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.35 }}
                    />
                    <h2 className="text-xl font-extrabold text-white">
                      Estatísticas do Movimento
                    </h2>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                      <p className="text-xs font-semibold text-white/70">Classe</p>
                      <p className="font-extrabold text-white capitalize">
                        {safe(damageClass)}
                      </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                      <p className="text-xs font-semibold text-white/70">Prioridade</p>
                      <p className="font-extrabold text-white">
                        {safe(priority)}
                      </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                      <p className="text-xs font-semibold text-white/70">Poder</p>
                      <p className="font-extrabold text-white">{safe(power)}</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                      <p className="text-xs font-semibold text-white/70">Precisão</p>
                      <p className="font-extrabold text-white">{safe(accuracy)}</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                      <p className="text-xs font-semibold text-white/70">PP</p>
                      <p className="font-extrabold text-white">{safe(pp)}</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                      <p className="text-xs font-semibold text-white/70">Chance de Efeito</p>
                      <p className="font-extrabold text-white">{safe(effectChance)}</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/10 p-3 col-span-2">
                      <p className="text-xs font-semibold text-white/70">Metadados</p>
                      <p className="font-extrabold text-white capitalize">
                        Condição: {safe(ailment)}{" "}
                        <span className="text-white/60 font-semibold">
                          • Crítico: {safe(critRate)} • Recuo: {safe(flinchChance)}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-white/70">
                        Dreno: {safe(drain)} • Cura: {safe(healing)} • Concurso:{" "}
                        {safe(contestType)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col gap-4">
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
                    <h2 className="text-xl font-extrabold text-black dark:text-white">
                      Descrição
                    </h2>
                  </div>

                  <p className="mt-4 text-sm text-black/80 dark:text-white/80 leading-relaxed">
                    {flavor || "Descrição indisponível para este movimento."}
                  </p>
                </div>
              </div>

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
                      Efeito
                    </h3>
                  </div>

                  <p className="mt-4 text-sm text-black/80 dark:text-white/80 leading-relaxed">
                    {effect || "Efeito indisponível para este movimento."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 w-full flex flex-col items-center sm:px-6 md:px-8 lg:px-10 xl:px-8 2xl:px-14">
          <div className="w-full">
            <PokemonByMoveCarousel learnedByPokemon={move?.learnedByPokemon} />

          </div>
        </div>
        <div className="w-full max-w-6xl rounded-2xl mx-auto mt-6 overflow-visible">
          <div className="px-5 pb-4 flex justify-end">
            <motion.button
              type="button"
              onClick={goBack}
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
              Voltar para Movimentos
            </motion.button>
          </div>
        </div>

      </div>
    </div>
  );
}
