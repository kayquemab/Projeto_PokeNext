const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";

export class PokeApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "PokeApiError";
    this.status = status;
  }
}

function resolvePokeApiUrl(resource) {
  const value = String(resource || "").trim();

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${POKE_API_BASE_URL}/${value.replace(/^\/+|\/+$/g, "")}`;
}

export async function fetchPokeApi(resource, options = {}) {
  const response = await fetch(resolvePokeApiUrl(resource), options);

  if (!response.ok) {
    throw new PokeApiError(
      `A PokeAPI respondeu com o status ${response.status}.`,
      response.status
    );
  }

  return response.json();
}

export function getPokeApiResourceId(resource) {
  const url = typeof resource === "string" ? resource : resource?.url;
  const match = String(url || "").match(/\/(\d+)\/?$/);

  return match ? Number(match[1]) : null;
}
