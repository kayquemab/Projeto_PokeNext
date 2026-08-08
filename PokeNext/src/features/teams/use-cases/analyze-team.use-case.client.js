export function analyzeTeamUseCase(
  team,
  { statConfig, typeWeaknesses }
) {
  if (!Array.isArray(team) || team.length === 0) return null;

  const getStat = (pokemon, statName) =>
    pokemon.stats.find((item) => item.code === statName)?.value ?? 0;

  const totalPower = team.reduce(
    (teamTotal, pokemon) =>
      teamTotal +
      pokemon.stats.reduce((total, item) => total + item.value, 0),
    0
  );

  const allTypes = team.flatMap((pokemon) =>
    pokemon.types.map((item) => item.code)
  );
  const uniqueTypes = [...new Set(allTypes)];

  const averageStats = statConfig.map((stat) => ({
    ...stat,
    value: Math.round(
      team.reduce((sum, pokemon) => sum + getStat(pokemon, stat.code), 0) /
        team.length
    ),
  }));

  const weaknessCount = {};
  allTypes.forEach((type) => {
    (typeWeaknesses[type] ?? []).forEach((weakness) => {
      weaknessCount[weakness] = (weaknessCount[weakness] ?? 0) + 1;
    });
  });

  return {
    totalPower,
    uniqueTypes,
    averageStats,
    mainWeaknesses: Object.entries(weaknessCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    balanceScore: Math.min(
      100,
      Math.round(uniqueTypes.length * 10 + team.length * 8)
    ),
  };
}
