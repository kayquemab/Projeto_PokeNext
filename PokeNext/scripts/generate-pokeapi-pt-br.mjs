import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";
const TRANSLATION_MODEL = "Xenova/opus-mt-en-ROMANCE";
const TRANSLATION_MODEL_REVISION =
  "9d2ba69ac80c8e8453c3d9a1e2323a0e7b8ca3cd";
const TRANSLATION_TARGET_PREFIX = ">>pt_BR<<";
const TRANSLATION_CACHE_VERSION = 6;
const ROOT_DIRECTORY = process.cwd();
const OUTPUT_DIRECTORY = path.join(
  ROOT_DIRECTORY,
  "src",
  "shared",
  "poke-api",
  "locales",
  "pt-br"
);
const CACHE_DIRECTORY = path.join(
  ROOT_DIRECTORY,
  "node_modules",
  ".cache",
  "pokenext-pokeapi-pt-br"
);
const REQUEST_CONCURRENCY = 16;
const TRANSLATION_BATCH_SIZE = 3;

const CURATED_MOVE_NAMES_PT_BR = {
  peck: "Bicada",
  kinesis: "Telecinese",
  flash: "Clar\u00e3o",
  psywave: "Onda Ps\u00edquica",
  octazooka: "Octabazuca",
  magnitude: "Escala S\u00edsmica",
  "will-o-wisp": "Fogo-f\u00e1tuo",
  ingrain: "Enraizar",
  embargo: "Bloqueio",
  avalanche: "Deslizamento de Neve",
  "aqua-jet": "Jato d'\u00c1gua",
  venoshock: "Choque Venenoso",
  inferno: "Fogo Infernal",
  rototiller: "Arado Girat\u00f3rio",
  "gigavolt-havoc": "Devasta\u00e7\u00e3o Gigavolt",
  "zing-zap": "Choque Eletrizante",
  "zippy-zap": "Raio Veloz",
  octolock: "Trava Tentacular",
  "max-flutterby": "Ataque M\u00e1ximo: Inseto",
  "max-knuckle": "Ataque M\u00e1ximo: Punho",
  "max-ooze": "Ataque M\u00e1ximo: Lodo",
  "max-mindstorm": "Ataque M\u00e1ximo: Mente",
  "max-rockfall": "Ataque M\u00e1ximo: Queda de Rochas",
  "max-quake": "Ataque M\u00e1ximo: Terremoto",
  "max-darkness": "Ataque M\u00e1ximo: Escurid\u00e3o",
  "max-steelspike": "Ataque M\u00e1ximo: Espinho de A\u00e7o",
  decorate: "Decorar",
  "drum-beating": "Batida de Tambor",
  "snap-trap": "Armadilha Mordaz",
  eternabeam: "Raio Eterno",
  poltergeist: "Assombra\u00e7\u00e3o",
  "lumina-crash": "Impacto Luminoso",
  "glaive-rush": "Investida de L\u00e2mina",
  doodle: "Rabisco",
  "aqua-step": "Passo Aqu\u00e1tico",
  "rock-polish": "Polimento de Pedra",
  "struggle-bug": "Luta de Inseto",
  "flip-turn": "Virada Aqu\u00e1tica",
  bind: "Constri\u00e7\u00e3o",
  slam: "Pancada",
  "skitter-smack": "Golpe Rastejante",
  "kowtow-cleave": "Talho de Rever\u00eancia",
  "supercell-slam": "Impacto de Superc\u00e9lula",
  "stuff-cheeks": "Encher as Bochechas",
  "fishious-rend": "Dilacera\u00e7\u00e3o Branquial",
  "fillet-away": "Desprendimento de Fil\u00e9",
  "salt-cure": "Salga",
};

const CURATED_ABILITY_NAMES_PT_BR = {
  truant: "Pregui\u00e7a",
  moxie: "Aud\u00e1cia",
  turboblaze: "Chama Turbo",
  teravolt: "Voltagem Tera",
  "punk-rock": "Som Rebelde",
  transistor: "Amplificador",
  "grim-neigh": "Relincho Sinistro",
  costar: "Coestrela",
  "tera-shell": "Casco Tera",
  "mega-sol": "Mega Sol",
  "aqua-boost": "Impulso Aqu\u00e1tico",
  "mycelium-might": "For\u00e7a do Mic\u00e9lio",
  "tera-shift": "Mudan\u00e7a Tera",
  "cloud-nine": "C\u00e9u Limpo",
  "flash-fire": "Absor\u00e7\u00e3o de Fogo",
  oblivious: "Indiferen\u00e7a",
  sniper: "Precis\u00e3o Cr\u00edtica",
  scrappy: "Valentia",
};

const CURATED_MOVE_TEXTS_PT_BR = {
  "pay-day": {
    flavorText: "Atira moedas, que podem ser recolhidas depois da batalha.",
    effectText:
      "Espalha moedas que, ap\u00f3s a batalha, rendem cinco vezes o n\u00edvel do usu\u00e1rio.",
  },
  guillotine: {
    flavorText:
      "Um ataque de pin\u00e7a que causa nocaute em um \u00fanico golpe se acertar.",
    effectText: "Causa nocaute em um \u00fanico golpe se acertar.",
  },
  "horn-drill": {
    flavorText:
      "Um ataque perfurante com o chifre que causa nocaute em um \u00fanico golpe se acertar.",
    effectText: "Causa nocaute em um \u00fanico golpe se acertar.",
  },
  fissure: {
    flavorText:
      "Abre uma fissura no ch\u00e3o e derruba o alvo em um \u00fanico golpe se acertar.",
    effectText: "Causa nocaute em um \u00fanico golpe se acertar.",
  },
  "sheer-cold": {
    flavorText:
      "Um ataque de frio extremo que causa nocaute em um \u00fanico golpe se acertar.",
    effectText: "Causa nocaute em um \u00fanico golpe se acertar.",
  },
  "swords-dance": {
    flavorText:
      "Uma dan\u00e7a vigorosa que aumenta muito o Ataque do usu\u00e1rio.",
    effectText: "Aumenta o Ataque do usu\u00e1rio em dois est\u00e1gios.",
  },
  spikes: {
    flavorText:
      "Espalha espinhos que ferem advers\u00e1rios ao entrarem em campo.",
    effectText:
      "Espalha espinhos que ferem Pok\u00e9mon advers\u00e1rios ao entrarem em campo.",
  },
  "toxic-spikes": {
    flavorText:
      "Espalha espinhos venenosos que envenenam advers\u00e1rios ao entrarem em campo.",
    effectText:
      "Espalha espinhos venenosos que envenenam Pok\u00e9mon advers\u00e1rios ao entrarem em campo.",
  },
  "stealth-rock": {
    flavorText:
      "Espalha pedras flutuantes que ferem advers\u00e1rios ao entrarem em campo.",
    effectText:
      "Fere Pok\u00e9mon advers\u00e1rios quando eles entram em campo.",
  },
  "thunder-shock": {
    flavorText: "Um ataque el\u00e9trico que pode causar paralisia.",
    effectText: "Pode paralisar o alvo.",
  },
};

const CURATED_SPECIES_TEXTS_PT_BR = {
  bulbasaur: {
    description:
      "Uma semente misteriosa foi plantada em suas costas ao nascer. A planta brota e cresce junto com este Pok\u00e9mon.",
    category: "Pok\u00e9mon Semente",
  },
  pikachu: {
    description:
      "Quando v\u00e1rios desses Pok\u00e9mon se re\u00fanem, a eletricidade acumulada pode provocar tempestades de raios.",
    category: "Pok\u00e9mon Rato",
  },
  garchomp: {
    category: "Pok\u00e9mon Supers\u00f4nico",
  },
};

const DOMAIN_TERMS_PT_BR = [
  ["Sp. Attack", "Ataque Especial"],
  ["Sp. Atk", "Ataque Especial"],
  ["SP. ATQ", "Ataque Especial"],
  ["Special Attack", "Ataque Especial"],
  ["Sp. Defense", "Defesa Especial"],
  ["Sp. Def", "Defesa Especial"],
  ["SP. DEF", "Defesa Especial"],
  ["Special Defense", "Defesa Especial"],
  ["Grass-type", "tipo Planta"],
  ["Fire-type", "tipo Fogo"],
  ["Water-type", "tipo \u00c1gua"],
  ["Electric-type", "tipo El\u00e9trico"],
  ["Psychic-type", "tipo Ps\u00edquico"],
  ["Ice-type", "tipo Gelo"],
  ["Dragon-type", "tipo Drag\u00e3o"],
  ["Dark-type", "tipo Sombrio"],
  ["Fairy-type", "tipo Fada"],
  ["Normal-type", "tipo Normal"],
  ["Fighting-type", "tipo Lutador"],
  ["Flying-type", "tipo Voador"],
  ["Poison-type", "tipo Veneno"],
  ["Ground-type", "tipo Terra"],
  ["Rock-type", "tipo Pedra"],
  ["Bug-type", "tipo Inseto"],
  ["Ghost-type", "tipo Fantasma"],
  ["Steel-type", "tipo A\u00e7o"],
  ["Grass type", "tipo Planta"],
  ["Fire type", "tipo Fogo"],
  ["Water type", "tipo \u00c1gua"],
  ["Electric type", "tipo El\u00e9trico"],
  ["Psychic type", "tipo Ps\u00edquico"],
  ["Ice type", "tipo Gelo"],
  ["Dragon type", "tipo Drag\u00e3o"],
  ["Dark type", "tipo Sombrio"],
  ["Fairy type", "tipo Fada"],
  ["Normal type", "tipo Normal"],
  ["Fighting type", "tipo Lutador"],
  ["Flying type", "tipo Voador"],
  ["Poison type", "tipo Veneno"],
  ["Ground type", "tipo Terra"],
  ["Rock type", "tipo Pedra"],
  ["Bug type", "tipo Inseto"],
  ["Ghost type", "tipo Fantasma"],
  ["Steel type", "tipo A\u00e7o"],
  ["Grass", "Planta"],
  ["Fire", "Fogo"],
  ["Water", "\u00c1gua"],
  ["Electric", "El\u00e9trico"],
  ["Psychic", "Ps\u00edquico"],
  ["Ice", "Gelo"],
  ["Dragon", "Drag\u00e3o"],
  ["Dark", "Sombrio"],
  ["Fairy", "Fada"],
  ["Normal", "Normal"],
  ["Fighting", "Lutador"],
  ["Flying", "Voador"],
  ["Poison", "Veneno"],
  ["Ground", "Terra"],
  ["Rock", "Pedra"],
  ["Bug", "Inseto"],
  ["Ghost", "Fantasma"],
  ["Steel", "A\u00e7o"],
  ["Attack", "Ataque"],
  ["Defense", "Defesa"],
  ["Speed", "Velocidade"],
  ["Accuracy", "Precis\u00e3o"],
  ["Evasion", "Evas\u00e3o"],
  ["Dynamax", "Dinamax"],
  ["Gigantamax", "Gigamax"],
  ["Z-Move", "Movimento Z"],
  ["Z-Moves", "Movimentos Z"],
  ["Terastallized", "Teracristalizado"],
  ["Terastallize", "Teracristalizar"],
  ["Terastal", "Teracristal"],
  ["Terastalizado", "Teracristalizado"],
  ["Z-Power", "Poder Z"],
  ["Berry", "fruta"],
  ["Berries", "frutas"],
  ["flinch", "hesita\u00e7\u00e3o"],
  ["recoil", "dano de recuo"],
];

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function cleanText(value) {
  return String(value || "")
    .replace(/\f|\r|\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function capitalizeFirst(value) {
  const text = cleanText(value)
    .replace(/(\p{L})-\s+(\p{L})/gu, "$1-$2")
    .replace(/\s+([.,;:!?%])/g, "$1");
  return text ? `${text.charAt(0).toLocaleUpperCase("pt-BR")}${text.slice(1)}` : "";
}

function normalizePortugueseText(value) {
  return cleanText(value)
    .replace(/\bpok[e\u00e9]mon\b/giu, "Pok\u00e9mon")
    .replace(/\s+([.,;:!?%])/g, "$1");
}

function normalizePokemonCategory(value) {
  const normalized = normalizePortugueseText(value);
  if (!normalized) return "";

  const pokemonAtEnd = normalized.match(/^(.+?)\s+Pok\u00e9mon$/iu);
  if (pokemonAtEnd) {
    return `Pok\u00e9mon ${capitalizeFirst(pokemonAtEnd[1])}`;
  }

  const pokemonAtStart = normalized.match(/^Pok\u00e9mon\s+(.+)$/iu);
  if (pokemonAtStart) {
    return `Pok\u00e9mon ${capitalizeFirst(pokemonAtStart[1])}`;
  }

  return capitalizeFirst(normalized);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceWholeTerm(value, source, replacement, caseInsensitive = false) {
  if (!source || !replacement || source === replacement) return value;

  const expression = new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(source)}(?![\\p{L}\\p{N}])`,
    caseInsensitive ? "giu" : "gu"
  );
  return value.replace(expression, () => replacement);
}

function buildResourceTerms(sources, translatedNames) {
  return Object.entries(sources)
    .map(([slug, source]) => [source.englishName, translatedNames[slug]])
    .filter(([source, translated]) => source && translated && source !== translated)
    .sort(([sourceA], [sourceB]) => sourceB.length - sourceA.length);
}

function localizeDomainTerms(value, resourceTerms = []) {
  let localized = normalizePortugueseText(value);

  for (const [source, translated] of resourceTerms) {
    localized = replaceWholeTerm(localized, source, translated);
  }

  for (const [source, translated] of DOMAIN_TERMS_PT_BR) {
    localized = replaceWholeTerm(localized, source, translated, true);
  }

  return normalizePortugueseText(localized)
    .replace(/\bSp\s+do usu\u00e1rio\.\s*Atk\b/giu, "Ataque Especial do usu\u00e1rio")
    .replace(
      /\bSp\.\s*(?:As\s+)?(?:estat\u00edsticas?\s+(?:de\s+)?)?(?:Atk|Ataque)\b/giu,
      "Ataque Especial"
    )
    .replace(
      /\bSp\.\s*(?:As\s+)?(?:estat\u00edsticas?\s+(?:de\s+)?)?(?:Def|Defesa|defini\u00e7\u00e3o|definitivamente)\b/giu,
      "Defesa Especial"
    )
    .replace(/\bSp\.\s*Dano de ataque\b/giu, "dano de Ataque Especial")
    .replace(
      /\bSp do usu\u00e1rio\.\s*(?:Estat\u00edsticas?\s+de\s+)?(?:Atk|Ataque)\b/giu,
      "Ataque Especial do usu\u00e1rio"
    )
    .replace(
      /\bSp do usu\u00e1rio\.\s*(?:Estat\u00edsticas?\s+de\s+)?(?:Def|Defesa|defini\u00e7\u00e3o|definitivamente)\b/giu,
      "Defesa Especial do usu\u00e1rio"
    )
    .replace(
      /Tem uma rela\u00e7\u00e3o de cr\u00edticas elevada,\s*cal hit\./giu,
      "Tem alta taxa de acerto cr\u00edtico."
    )
    .replace(/\bfazem switch in\b/giu, "entram em campo")
    .replace(/\bswitch in\b/giu, "entrar em campo")
    .replace(/\bScatters Espinhos\b/gu, "Espalha espinhos")
    .replace(/\bFreq\u00fcentemente\b/gu, "Frequentemente");
}

function buildPokemonTerms(speciesSources) {
  return Object.keys(speciesSources)
    .map((slug) => {
      const source = slug.replace(/-/g, " ").toLocaleUpperCase("en");
      return [source, humanizeIdentifier(slug)];
    })
    .sort(([sourceA], [sourceB]) => sourceB.length - sourceA.length);
}

function isSuspiciousTranslation(source, translation) {
  const normalized = cleanText(translation);
  if (!normalized) return true;
  if (normalized.length > Math.max(cleanText(source).length * 4 + 80, 320)) {
    return true;
  }
  if (/(?:^|\s)-(?:(?:\s+)-){5,}(?:\s|$)/.test(normalized)) return true;
  return /\b(\p{L}{2,})(?:\s+\1){3,}\b/iu.test(normalized);
}

function humanizeIdentifier(identifier) {
  return String(identifier || "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeLanguage(value) {
  return String(value || "").trim().toLowerCase();
}

function getEntry(entries, locales, fields) {
  const list = Array.isArray(entries) ? entries : [];
  const requestedFields = Array.isArray(fields) ? fields : [fields];

  for (const locale of locales) {
    const entry = list.find(
      (item) => normalizeLanguage(item?.language?.name) === locale
    );

    if (!entry) continue;

    for (const field of requestedFields) {
      const value = cleanText(entry?.[field]);
      if (value) return value;
    }
  }

  return "";
}

function prepareEffectText(value, effectChance) {
  return cleanText(value)
    .replace(/\$effect_chance/gi, String(effectChance ?? "—"))
    .replace(/\$target/gi, "the target")
    .replace(/\$user/gi, "the user");
}

async function readJson(filePath, fallbackValue) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallbackValue;
  }
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function fetchJson(url, attempt = 1) {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} em ${url}`);
    }

    return response.json();
  } catch (error) {
    if (attempt >= 5) throw error;
    await wait(350 * 2 ** (attempt - 1));
    return fetchJson(url, attempt + 1);
  }
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );
  return results;
}

async function translateTexts(texts) {
  const cachePath = path.join(
    CACHE_DIRECTORY,
    `translations-v${TRANSLATION_CACHE_VERSION}-${TRANSLATION_MODEL_REVISION}.json`
  );
  const cache = await readJson(cachePath, {});
  const draftCache = await readJson(
    path.join(CACHE_DIRECTORY, "translations.json"),
    {}
  );
  const reviewedOverrides = await readJson(
    path.join(ROOT_DIRECTORY, "scripts", "pokeapi-pt-br-missing-overrides.json"),
    {}
  );
  const uniqueTexts = Array.from(
    new Set(texts.map(cleanText).filter(Boolean))
  );

  let importedDrafts = 0;
  for (const source of uniqueTexts) {
    const draft = capitalizeFirst(
      reviewedOverrides[source] || draftCache[source]
    );
    if (!cache[source] && !isSuspiciousTranslation(source, draft)) {
      cache[source] = draft;
      importedDrafts += 1;
    }
  }

  if (importedDrafts) {
    await writeJson(cachePath, cache);
    console.log(
      `${importedDrafts} tradu\u00e7\u00f5es preliminares aproveitadas; ` +
        "as lacunas ser\u00e3o processadas pelo modelo local."
    );
  }

  const missingTexts = uniqueTexts.filter((text) => !cache[text]);
  if (!missingTexts.length) return cache;

  const { env, pipeline } = await import("@huggingface/transformers");
  env.cacheDir = path.join(CACHE_DIRECTORY, "models");
  env.allowRemoteModels = true;

  console.log(
    `Carregando o modelo ${TRANSLATION_MODEL}@${TRANSLATION_MODEL_REVISION}...`
  );
  const translator = await pipeline("translation", TRANSLATION_MODEL, {
    revision: TRANSLATION_MODEL_REVISION,
    dtype: "q8",
  });
  const totalBatches = Math.ceil(missingTexts.length / TRANSLATION_BATCH_SIZE);

  async function runModelBatch(batch) {
    const translated = await translator(
      batch.map((text) => `${TRANSLATION_TARGET_PREFIX} ${text}`),
      {
        batch_size: batch.length,
        max_length: 128,
        num_beams: 4,
        early_stopping: true,
        eos_token_id: 0,
        forced_eos_token_id: 0,
        pad_token_id: 65000,
        renormalize_logits: true,
      }
    );

    return (Array.isArray(translated) ? translated : [translated]).map(
      (item) => capitalizeFirst(item?.translation_text || "")
    );
  }

  for (let index = 0; index < missingTexts.length; index += TRANSLATION_BATCH_SIZE) {
    const batch = missingTexts.slice(index, index + TRANSLATION_BATCH_SIZE);
    const results = await runModelBatch(batch);

    if (results.length !== batch.length) {
      throw new Error(
        `O modelo retornou ${results.length} traduções para ${batch.length} textos.`
      );
    }

    for (let itemIndex = 0; itemIndex < batch.length; itemIndex += 1) {
      const source = batch[itemIndex];
      let translation = results[itemIndex];

      if (isSuspiciousTranslation(source, translation)) {
        [translation] = await runModelBatch([source]);
      }

      if (isSuspiciousTranslation(source, translation)) {
        throw new Error(`Tradução inválida para: ${source}`);
      }

      cache[source] = translation;
    }

    const batchNumber = Math.floor(index / TRANSLATION_BATCH_SIZE) + 1;
    if (batchNumber % 20 === 0 || batchNumber === totalBatches) {
      await writeJson(cachePath, cache);
    }
    process.stdout.write(
      `\rTradução offline: ${batchNumber}/${totalBatches} lotes concluídos`
    );
  }

  process.stdout.write("\n");
  await translator.dispose?.();
  return cache;
}

async function loadResourceSources({
  resource,
  cacheFile,
  extract,
}) {
  const cachePath = path.join(CACHE_DIRECTORY, cacheFile);
  const cached = await readJson(cachePath, null);
  if (cached) return cached;

  const list = await fetchJson(`${POKE_API_BASE_URL}/${resource}?limit=2000`);
  let completed = 0;
  const extracted = await mapWithConcurrency(
    list.results || [],
    REQUEST_CONCURRENCY,
    async (item) => {
      const dto = await fetchJson(item.url);
      completed += 1;
      process.stdout.write(
        `\rPokeAPI ${resource}: ${completed}/${list.results.length}`
      );
      return [item.name, extract(dto)];
    }
  );

  process.stdout.write("\n");
  const source = Object.fromEntries(extracted);
  await writeJson(cachePath, source);
  return source;
}

function extractMoveSource(dto) {
  const nativeName = getEntry(dto?.names, ["pt-br", "pt"], "name");
  const englishName =
    getEntry(dto?.names, ["en"], "name") || humanizeIdentifier(dto?.name);
  const nativeFlavorText = getEntry(
    dto?.flavor_text_entries,
    ["pt-br", "pt"],
    "flavor_text"
  );
  const englishFlavorText = getEntry(
    dto?.flavor_text_entries,
    ["en"],
    "flavor_text"
  );
  const nativeEffectText = getEntry(
    dto?.effect_entries,
    ["pt-br", "pt"],
    ["short_effect", "effect"]
  );
  const englishEffectText = prepareEffectText(
    getEntry(dto?.effect_entries, ["en"], ["short_effect", "effect"]),
    dto?.effect_chance ?? dto?.meta?.effect_chance
  );

  return {
    nativeName,
    englishName,
    nativeFlavorText,
    englishFlavorText,
    nativeEffectText,
    englishEffectText,
  };
}

function extractAbilitySource(dto) {
  return {
    nativeName: getEntry(dto?.names, ["pt-br", "pt"], "name"),
    englishName:
      getEntry(dto?.names, ["en"], "name") || humanizeIdentifier(dto?.name),
  };
}

function extractSpeciesSource(dto) {
  return {
    nativeDescription: getEntry(
      dto?.flavor_text_entries,
      ["pt-br", "pt"],
      "flavor_text"
    ),
    englishDescription: getEntry(
      dto?.flavor_text_entries,
      ["en"],
      "flavor_text"
    ),
    nativeCategory: getEntry(dto?.genera, ["pt-br", "pt"], "genus"),
    englishCategory: getEntry(dto?.genera, ["en"], "genus"),
  };
}

function collectEnglishTexts(moveSources, abilitySources, speciesSources) {
  const texts = [];

  for (const source of Object.values(moveSources)) {
    if (!source.nativeName) texts.push(source.englishName);
    if (!source.nativeFlavorText) texts.push(source.englishFlavorText);
    if (!source.nativeEffectText) texts.push(source.englishEffectText);
  }

  for (const source of Object.values(abilitySources)) {
    if (!source.nativeName) texts.push(source.englishName);
  }

  for (const source of Object.values(speciesSources)) {
    if (!source.nativeDescription) texts.push(source.englishDescription);
    if (!source.nativeCategory) texts.push(source.englishCategory);
  }

  return texts;
}

function translatedOrNative(nativeText, englishText, translations) {
  return normalizePortugueseText(
    cleanText(nativeText) || translations[cleanText(englishText)] || ""
  );
}

function buildCatalogs(moveSources, abilitySources, speciesSources, translations) {
  const moveNames = {};
  const moveTexts = {};
  const abilityNames = {};
  const speciesTexts = {};

  for (const [slug, source] of Object.entries(moveSources)) {
    moveNames[slug] =
      CURATED_MOVE_NAMES_PT_BR[slug] ||
      translatedOrNative(source.nativeName, source.englishName, translations);
    moveTexts[slug] = {
      flavorText: translatedOrNative(
        source.nativeFlavorText,
        source.englishFlavorText,
        translations
      ) || "Descri\u00e7\u00e3o indispon\u00edvel em portugu\u00eas.",
      effectText: translatedOrNative(
        source.nativeEffectText,
        source.englishEffectText,
        translations
      ) || "Efeito indispon\u00edvel em portugu\u00eas.",
    };

    if (CURATED_MOVE_TEXTS_PT_BR[slug]) {
      moveTexts[slug] = CURATED_MOVE_TEXTS_PT_BR[slug];
    }
  }

  for (const [slug, source] of Object.entries(abilitySources)) {
    abilityNames[slug] =
      CURATED_ABILITY_NAMES_PT_BR[slug] ||
      translatedOrNative(source.nativeName, source.englishName, translations);
  }

  for (const [slug, source] of Object.entries(speciesSources)) {
    speciesTexts[slug] = {
      description: translatedOrNative(
        source.nativeDescription,
        source.englishDescription,
        translations
      ) || "Descri\u00e7\u00e3o indispon\u00edvel em portugu\u00eas.",
      category: normalizePokemonCategory(
        translatedOrNative(
          source.nativeCategory,
          source.englishCategory,
          translations
        )
      ) || "Categoria indispon\u00edvel em portugu\u00eas",
    };


    if (CURATED_SPECIES_TEXTS_PT_BR[slug]) {
      speciesTexts[slug] = {
        ...speciesTexts[slug],
        ...CURATED_SPECIES_TEXTS_PT_BR[slug],
      };
    }
  }

  const resourceTerms = [
    ...buildResourceTerms(moveSources, moveNames),
    ...buildResourceTerms(abilitySources, abilityNames),
  ].sort(([sourceA], [sourceB]) => sourceB.length - sourceA.length);
  const pokemonTerms = buildPokemonTerms(speciesSources);

  for (const text of Object.values(moveTexts)) {
    text.flavorText = localizeDomainTerms(text.flavorText, resourceTerms);
    text.effectText = localizeDomainTerms(text.effectText, resourceTerms);

    for (const [source, translated] of pokemonTerms) {
      text.flavorText = replaceWholeTerm(text.flavorText, source, translated);
      text.effectText = replaceWholeTerm(text.effectText, source, translated);
    }
  }

  for (const text of Object.values(speciesTexts)) {
    text.description = localizeDomainTerms(text.description);
    text.category = normalizePokemonCategory(
      localizeDomainTerms(text.category)
    );

    for (const [source, translated] of pokemonTerms) {
      text.description = replaceWholeTerm(text.description, source, translated);
    }
  }

  return { moveNames, moveTexts, abilityNames, speciesTexts };
}

async function main() {
  await mkdir(OUTPUT_DIRECTORY, { recursive: true });
  await mkdir(CACHE_DIRECTORY, { recursive: true });

  if (process.argv.includes("--smoke")) {
    const samples = [
      "Thunderbolt",
      "Flamethrower",
      "Water Absorb",
      "May paralyze the target.",
    ];
    const translated = await translateTexts(samples);

    for (const sample of samples) {
      console.log(`${sample} -> ${translated[sample]}`);
    }
    return;
  }

  const [moveSources, abilitySources, speciesSources] = await Promise.all([
    loadResourceSources({
      resource: "move",
      cacheFile: "move-sources.json",
      extract: extractMoveSource,
    }),
    loadResourceSources({
      resource: "ability",
      cacheFile: "ability-sources.json",
      extract: extractAbilitySource,
    }),
    loadResourceSources({
      resource: "pokemon-species",
      cacheFile: "species-sources.json",
      extract: extractSpeciesSource,
    }),
  ]);

  const translations = await translateTexts(
    collectEnglishTexts(moveSources, abilitySources, speciesSources)
  );
  const catalogs = buildCatalogs(
    moveSources,
    abilitySources,
    speciesSources,
    translations
  );
  const manifest = {
    locale: "pt-BR",
    source: POKE_API_BASE_URL,
    translationModel: TRANSLATION_MODEL,
    translationModelRevision: TRANSLATION_MODEL_REVISION,
    resources: {
      moves: Object.keys(catalogs.moveNames).length,
      abilities: Object.keys(catalogs.abilityNames).length,
      species: Object.keys(catalogs.speciesTexts).length,
    },
  };

  await Promise.all([
    writeJson(path.join(OUTPUT_DIRECTORY, "move-names.json"), catalogs.moveNames),
    writeJson(path.join(OUTPUT_DIRECTORY, "move-texts.json"), catalogs.moveTexts),
    writeJson(
      path.join(OUTPUT_DIRECTORY, "ability-names.json"),
      catalogs.abilityNames
    ),
    writeJson(
      path.join(OUTPUT_DIRECTORY, "species-texts.json"),
      catalogs.speciesTexts
    ),
    writeJson(path.join(OUTPUT_DIRECTORY, "manifest.json"), manifest),
  ]);

  console.log(
    `Catálogos gerados: ${Object.keys(catalogs.moveNames).length} movimentos, ` +
      `${Object.keys(catalogs.abilityNames).length} habilidades e ` +
      `${Object.keys(catalogs.speciesTexts).length} espécies.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
