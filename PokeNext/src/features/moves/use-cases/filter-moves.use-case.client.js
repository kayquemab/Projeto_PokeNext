export function createEmptyMoveTypeModeUseCase(typeCodes) {
  return Object.fromEntries((typeCodes || []).map((type) => [type, null]));
}

export function isMoveWeaknessMapReadyUseCase(weaknessMap) {
  return Boolean(weaknessMap && Object.keys(weaknessMap).length > 0);
}

export function buildMoveWeaknessAllowedTypesUseCase(
  selectedWeaknessTargets,
  weaknessMap
) {
  const allowedTypes = new Set();

  for (const targetType of selectedWeaknessTargets || []) {
    for (const attackType of weaknessMap?.[targetType] || []) {
      allowedTypes.add(attackType);
    }
  }

  return allowedTypes;
}

export function matchesMoveFiltersUseCase(detail, filterSnapshot) {
  if (!detail) return false;

  if (
    filterSnapshot.selectedTypeIncludes.length > 0 &&
    (!detail.type || !filterSnapshot.selectedTypeIncludes.includes(detail.type))
  ) {
    return false;
  }

  if (
    filterSnapshot.selectedWeaknessTargets.length > 0 &&
    (!detail.type || !filterSnapshot.weaknessAllowedTypes.has(detail.type))
  ) {
    return false;
  }

  if (
    filterSnapshot.damageClass !== "all" &&
    detail.damageClass !== filterSnapshot.damageClass
  ) {
    return false;
  }

  if (
    filterSnapshot.minPower &&
    (detail.power ?? 0) < Number(filterSnapshot.minPower)
  ) {
    return false;
  }

  if (
    filterSnapshot.minAccuracy &&
    (detail.accuracy ?? 0) < Number(filterSnapshot.minAccuracy)
  ) {
    return false;
  }

  if (filterSnapshot.minPP && (detail.pp ?? 0) < Number(filterSnapshot.minPP)) {
    return false;
  }

  return true;
}

function normalizeSearch(search) {
  return String(search || "").trim().toLowerCase();
}

function moveMatchesSearch(move, query) {
  return (
    move.slug.includes(query) ||
    move.displayName.toLowerCase().includes(query) ||
    String(move.id).includes(query)
  );
}

export function filterMovesBySearchUseCase(moves, search) {
  const query = normalizeSearch(search);
  if (!query) return moves;

  return (moves || []).filter((move) => moveMatchesSearch(move, query));
}

export function rankMoveSuggestionsUseCase(moves, search, limit = 8) {
  const query = normalizeSearch(search);
  if (!query) return [];

  const byName = (moves || [])
    .filter(
      (move) =>
        move.slug.includes(query) ||
        move.displayName.toLowerCase().includes(query)
    )
    .slice(0, limit);

  if (!/^\d+$/.test(query)) return byName;

  const byId = (moves || [])
    .filter((move) => String(move.id).includes(query))
    .slice(0, limit);

  return Array.from(
    new Map([...byId, ...byName].map((move) => [move.id, move])).values()
  ).slice(0, limit);
}
