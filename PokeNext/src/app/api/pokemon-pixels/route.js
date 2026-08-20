import { readdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PIXEL_DATA_DIRECTORY = path.join(
  process.cwd(),
  "public",
  "data",
  "pokemon-pixels"
);

async function findPokemonSprites(directory = PIXEL_DATA_DIRECTORY) {
  const entries = await readdir(directory, { withFileTypes: true });
  const pokemon = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const entryPath = path.join(directory, entry.name);
    const children = await readdir(entryPath, { withFileTypes: true });
    const walkSprite = children.find(
      (child) => child.isFile() && child.name === "default_walk_8fps.gif"
    );

    if (walkSprite) {
      const idleSprite = children.find(
        (child) => child.isFile() && child.name === "default_idle_8fps.gif"
      );
      const relativeDirectory = path
        .relative(path.join(process.cwd(), "public"), entryPath)
        .split(path.sep)
        .map(encodeURIComponent)
        .join("/");

      pokemon.push({
        name: entry.name,
        walkSrc: `/${relativeDirectory}/${walkSprite.name}`,
        idleSrc: `/${relativeDirectory}/${idleSprite?.name || walkSprite.name}`,
      });
      continue;
    }

    pokemon.push(...(await findPokemonSprites(entryPath)));
  }

  return pokemon;
}

export async function GET() {
  try {
    const pokemon = await findPokemonSprites();

    return NextResponse.json(pokemon, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json([], {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
