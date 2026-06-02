import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions<T> {
  pageSize?: number;
  depsKey: string;
  fetchPage: (page: number, pageSize: number) => Promise<{ items: T[]; total: number }>;
}

export function useInfiniteScroll<T>({ pageSize = 20, depsKey, fetchPage }: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const loadingMoreRef = useRef(false);
  const itemsLenRef = useRef(0);
  const totalRef = useRef(0);

  const fetchFirst = useCallback(async () => {
    setLoading(true);
    pageRef.current = 1;
    try {
      const res = await fetchPage(1, pageSize);
      setItems(res.items);
      setTotal(res.total);
      itemsLenRef.current = res.items.length;
      totalRef.current = res.total;
    } catch {
      setItems([]);
      setTotal(0);
      itemsLenRef.current = 0;
      totalRef.current = 0;
    } finally {
      setLoading(false);
    }
  }, [fetchPage, pageSize]);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current) return;
    if (itemsLenRef.current >= totalRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    try {
      const res = await fetchPage(nextPage, pageSize);
      setItems((prev) => {
        const next = [...prev, ...res.items];
        itemsLenRef.current = next.length;
        return next;
      });
      pageRef.current = nextPage;
    } catch {
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [fetchPage, pageSize]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchFirst();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchFirst]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !loadingMoreRef.current) void loadMore(); },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, depsKey, loadMore]);

  return {
    items,
    setItems,
    total,
    setTotal,
    loading,
    loadingMore,
    sentinelRef,
    hasMore: items.length < total,
  };
}
