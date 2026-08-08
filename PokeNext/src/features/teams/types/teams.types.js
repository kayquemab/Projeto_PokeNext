/**
 * @typedef {{ code: string, label: string }} TeamPokemonType
 * @typedef {{ code: string, label: string }} TeamPokemonAbility
 * @typedef {{ code: string, label: string, value: number }} TeamPokemonStat
 * @typedef {{
 *   id: number,
 *   apiName: string,
 *   displayName: string,
 *   image: string,
 *   height: number,
 *   weight: number,
 *   types: TeamPokemonType[],
 *   abilities: TeamPokemonAbility[],
 *   stats: TeamPokemonStat[]
 * }} TeamPokemon
 */
export {};
