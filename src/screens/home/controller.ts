import { useMemo, useState } from "react";

import { redirect } from "next/navigation";

import { Routes } from "@constants";
import { useGetColorListQuery } from "@data";
import { CookiesUtils } from "@utils";

export const useHomePageController = () => {
  const { data, isLoading, error } = useGetColorListQuery();
  const [query, setQuery] = useState("");

  const onSignOutClick = () => {
    CookiesUtils.removeTokens();
    redirect(Routes.auth.signin);
  };

  const mapped = data?.data?.map((c, idx) => ({ id: c.id ?? idx, ...c }));

  const filtered = useMemo(() => {
    if (!mapped) return [];
    const q = query.trim().toLowerCase();
    if (!q) return mapped;
    return mapped.filter((c) => {
      const name = String(c.name ?? "").toLowerCase();
      const hex = String(c.hex ?? "").toLowerCase();
      return (
        name.includes(q) ||
        hex.includes(q) ||
        hex.replace("#", "").includes(q.replace("#", ""))
      );
    });
  }, [mapped, query]);

  return {
    data: filtered,
    error: error,
    isLoading,
    query,
    setQuery,
    onSignOutClick,
  };
};
