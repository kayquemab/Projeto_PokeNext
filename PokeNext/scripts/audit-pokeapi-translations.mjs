import { readFile } from "node:fs/promises";
import path from "node:path";

const rootDirectory = process.cwd();
const sourceDirectory = path.join(
  rootDirectory,
  "node_modules",
  ".cache",
  "pokenext-pokeapi-pt-br"
);

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function collectSourceTexts(moveSources, abilitySources, speciesSources) {
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

  return [...new Set(texts.filter(Boolean))];
}

const [moveSources, abilitySources, speciesSources, translations] =
  await Promise.all([
    readJson(path.join(sourceDirectory, "move-sources.json")),
    readJson(path.join(sourceDirectory, "ability-sources.json")),
    readJson(path.join(sourceDirectory, "species-sources.json")),
    readJson(path.join(sourceDirectory, "translations.json")),
  ]);

const sourceTexts = collectSourceTexts(
  moveSources,
  abilitySources,
  speciesSources
);
const missing = sourceTexts.filter((source) => !translations[source]);
const unchanged = sourceTexts.filter(
  (source) =>
    translations[source] &&
    translations[source].toLocaleLowerCase("en") ===
      source.toLocaleLowerCase("en")
);
const suspicious = sourceTexts.filter((source) => {
  const translated = translations[source] || "";
  return (
    translated.length > Math.max(source.length * 4 + 80, 320) ||
    /\b(\p{L}{2,})(?:\s+\1){3,}\b/iu.test(translated)
  );
});

console.log(
  JSON.stringify(
    {
      moves: Object.keys(moveSources).length,
      abilities: Object.keys(abilitySources).length,
      species: Object.keys(speciesSources).length,
      uniqueSourceTexts: sourceTexts.length,
      cachedTranslations: Object.keys(translations).length,
      coveredSourceTexts: sourceTexts.length - missing.length,
      missing: missing.length,
      unchanged: unchanged.length,
      suspicious: suspicious.length,
    },
    null,
    2
  )
);

console.log("\nAusentes:", missing.slice(0, 30));
console.log("\nIguais ao ingl\u00eas:", unchanged.slice(0, 100));
console.log("\nSuspeitas:", suspicious.slice(0, 20));
console.log(
  "\nAmostras:",
  [
    "Thunderbolt",
    "Flamethrower",
    "Water Absorb",
    "May paralyze the target.",
  ].map((source) => [source, translations[source]])
);
