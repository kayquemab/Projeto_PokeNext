const LEARN_METHOD_RANK = {
  "level-up": 0,
  machine: 1,
  tutor: 2,
  egg: 3,
};

function shuffleCopy(items) {
  const output = [...items];

  for (let index = output.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[randomIndex]] = [output[randomIndex], output[index]];
  }

  return output;
}

function sampleUnique(items, count) {
  const output = Array.from(new Set(items || [])).filter(Boolean);
  if (output.length <= count) return output;

  for (
    let index = output.length - 1;
    index > output.length - 1 - count;
    index -= 1
  ) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[randomIndex]] = [output[randomIndex], output[index]];
  }

  return output.slice(output.length - count);
}

export function selectPokemonSlugsForMoveUseCase(
  pokemonSlugs,
  { pool = 200, take = 12 } = {}
) {
  const universe = (pokemonSlugs || []).slice(
    0,
    Math.min(pool, pokemonSlugs?.length || 0)
  );

  return sampleUnique(universe, Math.min(take, universe.length));
}

function selectBestLearnDetail(learnDetails = []) {
  return [...learnDetails]
    .map((detail) => ({
      method: detail.methodCode || "other",
      level: Number.isFinite(detail.level) ? detail.level : 999,
      rank: LEARN_METHOD_RANK[detail.methodCode] ?? 9,
    }))
    .sort((left, right) => left.rank - right.rank || left.level - right.level)[0];
}

export function selectFeaturedMovesUseCase(moves, count = 12) {
  const uniqueMoves = [];
  const seenSlugs = new Set();

  for (const move of moves || []) {
    if (!move?.slug || !move?.url || seenSlugs.has(move.slug)) continue;

    const bestLearnDetail = selectBestLearnDetail(move.learnDetails);
    seenSlugs.add(move.slug);
    uniqueMoves.push({
      slug: move.slug,
      displayName: move.displayName,
      url: move.url,
      learnMethod: bestLearnDetail?.method || "other",
      learnLevel: bestLearnDetail?.level ?? null,
    });
  }

  return shuffleCopy(uniqueMoves).slice(0, Math.min(count, uniqueMoves.length));
}
