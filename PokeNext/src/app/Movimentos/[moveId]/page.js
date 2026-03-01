"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import PokeMoveCarousel from "@/components/PokeMoveCarrousel";

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

function formatName(name) {
  return String(name || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function safe(v, fallback = "—") {
  return v === null || v === undefined || v === "" ? fallback : v;
}

function pickFlavorText(move, langs = ["pt-br", "pt", "en"]) {
  const list = Array.isArray(move?.flavor_text_entries) ? move.flavor_text_entries : [];
  for (const lang of langs) {
    const found = list.find((f) => f?.language?.name === lang);
    if (found?.flavor_text) {
      return String(found.flavor_text).replace(/\f|\n|\r/g, " ").trim();
    }
  }
  return "";
}

function pickEffectText(move, langs = ["pt-br", "pt", "en"]) {
  const list = Array.isArray(move?.effect_entries) ? move.effect_entries : [];
  for (const lang of langs) {
    const found = list.find((e) => e?.language?.name === lang);
    if (found?.short_effect) {
      return String(found.short_effect).replace(/\n|\r/g, " ").trim();
    }
  }
  const first = list.find((e) => e?.short_effect);
  return first?.short_effect ? String(first.short_effect).replace(/\n|\r/g, " ").trim() : "";
}

async function fetchTypesThatLearnMove(pokemonNames, { signal, max = 30, concurrency = 6 }) {
  const names = (pokemonNames || []).slice(0, max);
  const typeSet = new Set();
  let idx = 0;

  async function worker() {
    while (idx < names.length) {
      const my = idx++;
      const name = names[my];

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, { signal });
      if (!res.ok) continue;
      const data = await res.json();

      const types = (data?.types || []).map((t) => t?.type?.name).filter(Boolean);
      types.forEach((t) => typeSet.add(t));
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return Array.from(typeSet);
}

export default function MoveIdPage() {
  const router = useRouter();
  const params = useParams();

  const moveId = params?.moveId ?? params?.id ?? params?.slug ?? params?.name;

  // ✅ aqui virá "water-gun"
  const idOrName = useMemo(() => String(moveId || "").trim().toLowerCase(), [moveId]);

  const [move, setMove] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userTypes, setUserTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(false);

  const moveCache = useRef(new Map());

  useEffect(() => {
    if (!idOrName) return;

    const controller = new AbortController();
    let alive = true;

    async function fetchMove() {
      try {
        setLoading(true);
        setError("");

        const cached = moveCache.current.get(idOrName);
        if (cached) {
          setMove(cached);
          return;
        }

        const res = await fetch(`https://pokeapi.co/api/v2/move/${idOrName}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Movimento não encontrado.");

        const data = await res.json();
        if (!alive) return;

        moveCache.current.set(idOrName, data);
        setMove(data);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Erro ao carregar dados do movimento.");
        setMove(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchMove();
    return () => {
      alive = false;
      controller.abort();
    };
  }, [idOrName]);

  useEffect(() => {
    if (!move?.learned_by_pokemon?.length) {
      setUserTypes([]);
      return;
    }

    const controller = new AbortController();
    let alive = true;

    async function loadTypes() {
      try {
        setTypesLoading(true);

        const names = move.learned_by_pokemon.map((p) => p?.name).filter(Boolean);

        const types = await fetchTypesThatLearnMove(names, {
          signal: controller.signal,
          max: 30,
          concurrency: 6,
        });

        if (!alive) return;
        setUserTypes(types);
      } catch {
        if (!alive) return;
        setUserTypes([]);
      } finally {
        if (alive) setTypesLoading(false);
      }
    }

    loadTypes();
    return () => {
      alive = false;
      controller.abort();
    };
  }, [move?.learned_by_pokemon]);

  if (loading && !move) return <div />;

  if (error || !move) {
    return (
      <div className="w-full max-w-xl mx-auto mt-10 px-4">
        <p className="text-red-500 text-sm">{error || "Erro desconhecido."}</p>
        <button
          type="button"
          onClick={() => router.push("/Movimentos")}
          className="mt-3 text-[#E3350D] hover:underline text-sm font-semibold"
        >
          Voltar para Movimentos
        </button>
      </div>
    );
  }

  const typeName = move?.type?.name || "";
  const flavor = pickFlavorText(move);
  const effect = pickEffectText(move);

  const damageClass = move?.damage_class?.name || "";
  const accuracy = move?.accuracy;
  const power = move?.power;
  const pp = move?.pp;
  const priority = move?.priority;

  const contestType = move?.contest_type?.name || "";
  const ailment = move?.meta?.ailment?.name || "";
  const critRate = move?.meta?.crit_rate;
  const flinchChance = move?.meta?.flinch_chance;
  const effectChance = move?.effect_chance;
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
              <span className="opacity-90">{formatName(move.name)}</span>

              {typeName ? (
                <span
                  className={[
                    "px-3 py-1 rounded-lg text-sm sm:text-base font-extrabold capitalize shadow-sm",
                    getTypeClass(typeName),
                  ].join(" ")}
                >
                  {typeName}
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
                      <p className="text-xs font-semibold text-white/70">Power</p>
                      <p className="font-extrabold text-white">{safe(power)}</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                      <p className="text-xs font-semibold text-white/70">Accuracy</p>
                      <p className="font-extrabold text-white">{safe(accuracy)}</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                      <p className="text-xs font-semibold text-white/70">PP</p>
                      <p className="font-extrabold text-white">{safe(pp)}</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                      <p className="text-xs font-semibold text-white/70">Effect Chance</p>
                      <p className="font-extrabold text-white">{safe(effectChance)}</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/10 p-3 col-span-2">
                      <p className="text-xs font-semibold text-white/70">Meta</p>
                      <p className="font-extrabold text-white capitalize">
                        Ailment: {safe(ailment)}{" "}
                        <span className="text-white/60 font-semibold">
                          • Crit: {safe(critRate)} • Flinch: {safe(flinchChance)}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-white/70">
                        Drain: {safe(drain)} • Healing: {safe(healing)} • Contest:{" "}
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

        <div className="mt-6 w-full flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-8 2xl:px-14">
          <div className="w-full">
            <PokeMoveCarousel learnedByPokemon={move?.learned_by_pokemon} />

          </div>
        </div>
        <div className="w-full max-w-6xl rounded-2xl mx-auto mt-6 overflow-visible">
          <div className="px-5 pb-4 flex justify-end">
            <motion.button
              type="button"
              onClick={() => router.push("/Movimentos")}
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
