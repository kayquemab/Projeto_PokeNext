import { regioes } from "../regions.constants";

export function getRegionNavigationUseCase(regionId) {
  const index = regioes.findIndex((regiao) => regiao.id === regionId);

  if (index < 0) return null;

  return {
    regiaoAtual: regioes[index],
    prev: regioes[(index - 1 + regioes.length) % regioes.length].id,
    next: regioes[(index + 1) % regioes.length].id,
  };
}
