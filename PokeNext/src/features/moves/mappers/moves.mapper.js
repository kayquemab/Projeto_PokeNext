import {
  formatPokemonName,
  getLocalizedEntry,
  translatePokeApiResourceName,
  translateStatName,
  translateTypeName,
} from "@/shared/poke-api";
import { getPokeApiResourceId } from "@/shared/poke-api/poke-api.client";
import moveTextsPtBr from "@/shared/poke-api/locales/pt-br/move-texts.json";

function mapNamedResource(resource, kind) {
  if (!resource) return null;

  const code = resource.name || "";

  return {
    id: resource.id || getPokeApiResourceId(resource),
    code,
    slug: code,
    label: translatePokeApiResourceName(resource, kind),
    url: resource.url || "",
  };
}

function mapMoveResource(resource) {
  const mapped = mapNamedResource(resource, "move");
  if (!mapped) return null;

  return {
    id: mapped.id,
    slug: mapped.slug,
    displayName: mapped.label,
    url: mapped.url,
  };
}

function mapTypeResource(resource) {
  const mapped = mapNamedResource(resource, "type");
  if (!mapped) return null;

  return {
    id: mapped.id,
    code: mapped.code,
    label: mapped.label,
    url: mapped.url,
  };
}

function mapLearnDetail(detail) {
  return {
    methodCode: detail?.move_learn_method?.name || "other",
    level: Number.isFinite(detail?.level_learned_at)
      ? detail.level_learned_at
      : null,
  };
}

export function mapMoveListDto(dto) {
  return {
    count: dto?.count || 0,
    items: (dto?.results || []).map(mapMoveResource).filter(Boolean),
  };
}

export function mapTypeListDto(dto) {
  return {
    count: dto?.count || 0,
    items: (dto?.results || []).map(mapTypeResource).filter(Boolean),
  };
}

export function mapMoveDto(dto) {
  const catalogTexts = moveTextsPtBr[dto?.name] || {};
  const effect =
    getLocalizedEntry(dto?.effect_entries, ["short_effect", "effect"]) ||
    catalogTexts.effectText ||
    "Efeito indispon\u00edvel em portugu\u00eas.";
  const effectChance = dto?.effect_chance ?? dto?.meta?.effect_chance;
  const damageClass = mapNamedResource(dto?.damage_class, "damage-class");
  const contestType = mapNamedResource(dto?.contest_type, "contest-type");
  const target = mapNamedResource(dto?.target, "move-target");
  const ailment = mapNamedResource(dto?.meta?.ailment, "ailment");
  const category = mapNamedResource(dto?.meta?.category, "move-category");

  return {
    id: dto?.id || null,
    slug: dto?.name || "",
    displayName: translatePokeApiResourceName(dto, "move"),
    flavorText:
      getLocalizedEntry(dto?.flavor_text_entries, "flavor_text") ||
      catalogTexts.flavorText ||
      "Descri\u00e7\u00e3o indispon\u00edvel em portugu\u00eas.",
    effectText: effect.replace(/\$effect_chance/g, String(effectChance ?? "—")),
    type: mapTypeResource(dto?.type),
    damageClass: damageClass
      ? { code: damageClass.code, label: damageClass.label }
      : null,
    contestType: contestType
      ? { code: contestType.code, label: contestType.label }
      : null,
    target: target ? { code: target.code, label: target.label } : null,
    accuracy: dto?.accuracy ?? null,
    power: dto?.power ?? null,
    pp: dto?.pp ?? null,
    priority: dto?.priority ?? null,
    effectChance: effectChance ?? null,
    meta: dto?.meta
      ? {
          ailment: ailment ? { code: ailment.code, label: ailment.label } : null,
          category: category ? { code: category.code, label: category.label } : null,
          critRate: dto.meta.crit_rate ?? null,
          flinchChance: dto.meta.flinch_chance ?? null,
          drain: dto.meta.drain ?? null,
          healing: dto.meta.healing ?? null,
        }
      : null,
    learnedByPokemon: (dto?.learned_by_pokemon || [])
      .map((resource) => {
        const mapped = mapNamedResource(resource, "pokemon");
        if (!mapped) return null;

        return {
          id: mapped.id,
          slug: mapped.slug,
          displayName: mapped.label,
          url: mapped.url,
        };
      })
      .filter(Boolean),
  };
}

export function mapPokemonForMovesDto(dto) {
  return {
    id: dto?.id || null,
    slug: dto?.name || "",
    displayName: formatPokemonName(dto?.name),
    image:
      dto?.sprites?.other?.["official-artwork"]?.front_default ||
      dto?.sprites?.front_default ||
      null,
    types: (dto?.types || []).map((item) => ({
      code: item?.type?.name || "",
      label: translateTypeName(item?.type?.name),
    })),
    abilities: (dto?.abilities || []).map((item) => ({
      code: item?.ability?.name || "",
      label: translatePokeApiResourceName(item?.ability, "ability"),
    })),
    stats: (dto?.stats || []).map((item) => ({
      code: item?.stat?.name || "",
      label: translateStatName(item?.stat?.name),
      value: item?.base_stat ?? 0,
    })),
    moves: (dto?.moves || []).map((item) => {
      const move = mapMoveResource(item?.move);

      return {
        ...move,
        learnDetails: (item?.version_group_details || []).map(mapLearnDetail),
      };
    }),
  };
}

export function mapTypeForMovesDto(dto) {
  return {
    id: dto?.id || null,
    code: dto?.name || "",
    label: translatePokeApiResourceName(dto, "type"),
    doubleDamageFrom: (dto?.damage_relations?.double_damage_from || [])
      .map(mapTypeResource)
      .filter(Boolean),
    moves: (dto?.moves || []).map(mapMoveResource).filter(Boolean),
  };
}
