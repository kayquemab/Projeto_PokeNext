/**
 * Contratos recebidos da PokeAPI. Os typedefs documentam o DTO sem levar o
 * formato externo diretamente para os componentes.
 *
 * @typedef {{ name: string, url: string }} NamedApiResourceDto
 * @typedef {{ count: number, next: string|null, previous: string|null, results: NamedApiResourceDto[] }} NamedApiResourceListDto
 * @typedef {Record<string, unknown> & { id: number, name: string }} PokemonDto
 * @typedef {Record<string, unknown> & { id: number, name: string }} PokemonSpeciesDto
 */

export {};
