import { useSyncExternalStore } from "react";
import { mapStoredTeam } from "../mappers/teams.mapper";
import {
  getStoredTeamSnapshotUseCase,
  subscribeStoredTeamUseCase,
} from "../use-cases/manage-team.use-case.client";

const EMPTY_TEAM_SNAPSHOT = "[]";

export function useStoredTeam(storageKey) {
  const snapshot = useSyncExternalStore(
    subscribeStoredTeamUseCase,
    () => getStoredTeamSnapshotUseCase(storageKey),
    () => EMPTY_TEAM_SNAPSHOT
  );

  try {
    return mapStoredTeam(snapshot);
  } catch {
    return [];
  }
}
