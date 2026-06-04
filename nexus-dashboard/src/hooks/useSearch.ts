// Custom hook — Ch05 patterns
import { useState, useDeferredValue, useMemo } from "react";

export function useSearch<T>(
  items: T[],
  keys: (keyof T)[],
) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query); // Ch07 — keeps input responsive

  const results = useMemo(() => {
    if (!deferredQuery.trim()) return items;
    const q = deferredQuery.toLowerCase();
    return items.filter(item =>
      keys.some(key => String(item[key]).toLowerCase().includes(q))
    );
  }, [items, keys, deferredQuery]);

  const isStale = query !== deferredQuery;

  return { query, setQuery, results, isStale };
}
