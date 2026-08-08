import { useMemo } from "react";
import { getRegionNavigationUseCase } from "../use-cases/get-region-navigation.use-case";

export function useRegionNavigation(regionId) {
  return useMemo(() => getRegionNavigationUseCase(regionId), [regionId]);
}
