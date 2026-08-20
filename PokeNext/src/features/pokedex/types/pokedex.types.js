/**
 * Modelos internos consumidos pela UI. Nenhum deles preserva o formato bruto
 * dos DTOs da PokéAPI.
 *
 * @typedef {{ code: string, label: string, url: string }} PokemonType
 * @typedef {{ code: string, label: string }} PokemonAbility
 * @typedef {{ code: string, label: string, value: number }} PokemonStat
 * @typedef {{ id: number, slug: string, displayName: string, artworkUrl: string }} PokemonListItem
 * @typedef {{ id: number, speciesId: number, slug: string, displayName: string, artworkUrl: string, heightDecimeters: number, weightHectograms: number, speciesUrl: string, types: PokemonType[], abilities: PokemonAbility[], stats: PokemonStat[] }} Pokemon
 * @typedef {{ id: number|null, slug: string, displayName: string, label: string, group?: string }} PokemonVariety
 * @typedef {{ id: number, slug: string, displayName: string, description: string, category: string, evolutionChainUrl: string, varieties: PokemonVariety[] }} PokemonSpecies
 */

export {};
