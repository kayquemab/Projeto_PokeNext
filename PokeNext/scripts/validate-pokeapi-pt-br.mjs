import { readFile } from "node:fs/promises";
import path from "node:path";

const rootDirectory = process.cwd();
const cacheDirectory = path.join(
  rootDirectory,
  "node_modules",
  ".cache",
  "pokenext-pokeapi-pt-br"
);
const localeDirectory = path.join(
  rootDirectory,
  "src",
  "shared",
  "poke-api",
  "locales",
  "pt-br"
);

async function readJson(filePath, fallbackValue) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (arguments.length > 1) return fallbackValue;
    throw error;
  }
}

function normalize(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

function collectInvalidText(entries) {
  return entries.filter(([, value]) => {
    const text = String(value || "");
    return (
      !text.trim() ||
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(text) ||
      /(?:Ã.|Â.|â€|\uFFFD)/u.test(text) ||
      /\bPOK(?:E|É)MON\b/u.test(text) ||
      /(?:Movimento|Habilidade)\s+#\d+/iu.test(text) ||
      /\b(?:cal hit|flinch|switch in|Scatters|SP\.\s*(?:ATQ|DEF))\b/iu.test(
        text
      ) ||
      /\b(?:Bind|Slam|Skitter|Kowtow|Fishious|Fillet|Mycelium Might|Tera Shift)\b/u.test(
        text
      ) ||
      /(?:O qu\u00ea\?\s*){3,}/iu.test(text) ||
      /O que \u00e9 isso\?/iu.test(text) ||
      /,\s*s\b/iu.test(text) ||
      /(?:[.\-]\s*){12,}/u.test(text)
    );
  });
}

const [
  moveSources,
  abilitySources,
  speciesSources,
  moveNames,
  abilityNames,
  moveTexts,
  speciesTexts,
  manifest,
] = await Promise.all([
  readJson(path.join(cacheDirectory, "move-sources.json"), null),
  readJson(path.join(cacheDirectory, "ability-sources.json"), null),
  readJson(path.join(cacheDirectory, "species-sources.json"), null),
  readJson(path.join(localeDirectory, "move-names.json")),
  readJson(path.join(localeDirectory, "ability-names.json")),
  readJson(path.join(localeDirectory, "move-texts.json")),
  readJson(path.join(localeDirectory, "species-texts.json")),
  readJson(path.join(localeDirectory, "manifest.json")),
]);

const errors = [];

function requireSameKeys(label, source, translated) {
  const sourceKeys = Object.keys(source);
  const translatedKeys = Object.keys(translated);
  const missing = sourceKeys.filter((key) => !(key in translated));
  const extra = translatedKeys.filter((key) => !(key in source));

  if (missing.length || extra.length) {
    errors.push(
      `${label}: ${missing.length} ausentes e ${extra.length} extras.`
    );
  }
}

requireSameKeys("Nomes e textos de movimentos", moveNames, moveTexts);
if (moveSources) {
  requireSameKeys("Nomes de movimentos", moveSources, moveNames);
  requireSameKeys("Textos de movimentos", moveSources, moveTexts);
}
if (abilitySources) {
  requireSameKeys("Nomes de habilidades", abilitySources, abilityNames);
}
if (speciesSources) {
  requireSameKeys("Textos de esp\u00e9cies", speciesSources, speciesTexts);
}

const expectedCounts = manifest?.resources || {};
const actualCounts = {
  moves: Object.keys(moveNames).length,
  abilities: Object.keys(abilityNames).length,
  species: Object.keys(speciesTexts).length,
};
for (const [resource, count] of Object.entries(actualCounts)) {
  if (expectedCounts[resource] !== count) {
    errors.push(
      `${resource}: o manifesto espera ${expectedCounts[resource]}, mas o cat\u00e1logo possui ${count}.`
    );
  }
}

const scalarEntries = [
  ...Object.entries(moveNames).map(([key, value]) => [`move:${key}`, value]),
  ...Object.entries(abilityNames).map(([key, value]) => [
    `ability:${key}`,
    value,
  ]),
  ...Object.entries(moveTexts).flatMap(([key, value]) => [
    [`move-flavor:${key}`, value?.flavorText],
    [`move-effect:${key}`, value?.effectText],
  ]),
  ...Object.entries(speciesTexts).flatMap(([key, value]) => [
    [`species-description:${key}`, value?.description],
    [`species-category:${key}`, value?.category],
  ]),
];
const invalidText = collectInvalidText(scalarEntries);
if (invalidText.length) {
  errors.push(
    `Foram encontrados ${invalidText.length} textos vazios, corrompidos ou gen\u00e9ricos: ${invalidText
      .slice(0, 10)
      .map(([key]) => key)
      .join(", ")}.`
  );
}

const unchangedProse = [];
for (const [slug, source] of Object.entries(moveSources || {})) {
  const translated = moveTexts[slug];
  if (
    source.englishFlavorText &&
    normalize(source.englishFlavorText) === normalize(translated?.flavorText)
  ) {
    unchangedProse.push(`move-flavor:${slug}`);
  }
  if (
    source.englishEffectText &&
    normalize(source.englishEffectText) === normalize(translated?.effectText)
  ) {
    unchangedProse.push(`move-effect:${slug}`);
  }
}

for (const [slug, source] of Object.entries(speciesSources || {})) {
  const translated = speciesTexts[slug];
  if (
    source.englishDescription &&
    normalize(source.englishDescription) === normalize(translated?.description)
  ) {
    unchangedProse.push(`species-description:${slug}`);
  }
  if (
    source.englishCategory &&
    normalize(source.englishCategory) === normalize(translated?.category)
  ) {
    unchangedProse.push(`species-category:${slug}`);
  }
}

if (unchangedProse.length) {
  errors.push(
    `${unchangedProse.length} textos continuam id\u00eanticos ao ingl\u00eas: ${unchangedProse
      .slice(0, 10)
      .join(", ")}.`
  );
}

const result = {
  moves: Object.keys(moveNames).length,
  abilities: Object.keys(abilityNames).length,
  moveTexts: Object.keys(moveTexts).length,
  species: Object.keys(speciesTexts).length,
  invalidText: invalidText.length,
  unchangedProse: unchangedProse.length,
};

console.log(JSON.stringify(result, null, 2));

if (errors.length) {
  throw new Error(errors.join("\n"));
}

console.log("Cat\u00e1logos pt-BR validados com cobertura integral.");
