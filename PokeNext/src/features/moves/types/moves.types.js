/**
 * @typedef {{ id: number | null, slug: string, displayName: string, url: string }} MoveListItem
 * @typedef {{ id: number | null, code: string, label: string, url?: string }} MoveType
 * @typedef {{ code: string, label: string }} LocalizedCode
 * @typedef {{
 *   id: number | null,
 *   slug: string,
 *   displayName: string,
 *   flavorText: string,
 *   effectText: string,
 *   type: MoveType | null,
 *   damageClass: LocalizedCode | null,
 *   contestType: LocalizedCode | null,
 *   accuracy: number | null,
 *   power: number | null,
 *   pp: number | null,
 *   priority: number | null,
 *   effectChance: number | null
 * }} Move
 */

export {};
