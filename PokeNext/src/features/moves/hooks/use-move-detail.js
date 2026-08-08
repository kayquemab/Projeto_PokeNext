"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMovesApi } from "./use-moves-api";

export function useMoveDetail(moveId) {
  const router = useRouter();
  const { loadMove } = useMovesApi();
  const idOrName = useMemo(
    () => String(moveId || "").trim().toLowerCase(),
    [moveId]
  );

  const [move, setMove] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const moveCache = useRef(new Map());

  useEffect(() => {
    if (!idOrName) return;

    const controller = new AbortController();
    let alive = true;

    async function fetchMove() {
      try {
        setLoading(true);
        setError("");

        const cached = moveCache.current.get(idOrName);
        if (cached) {
          setMove(cached);
          return;
        }

        const data = await loadMove(idOrName, { signal: controller.signal });
        if (!alive) return;

        moveCache.current.set(idOrName, data);
        setMove(data);
      } catch {
        if (!alive) return;
        setError("Não foi possível carregar os dados do movimento.");
        setMove(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchMove();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [idOrName, loadMove]);

  const goBack = useCallback(() => {
    router.push("/movimentos");
  }, [router]);

  return { error, goBack, loading, move };
}
