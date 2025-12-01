import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { debounce } from "lodash";
import { useFilterStore } from "../store/useFilterStore";

export const useQueryFilter = (prefix = "") => {
  prefix = prefix ? prefix + "_" : prefix;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isFirstLoadRef = useRef(true);
  const {
    query,
    getQuery,
    setQuery,
    resetFilter,
    resetFilterExceptPageAndLimit,
    updateQueryParams,
    onChangeSearchInput,
  } = useFilterStore();

  useEffect(() => {
    const params = {};
    searchParams.forEach((value, key) => (params[key] = value));
    const timeout = setTimeout(() => {
      setQuery(params);
      isFirstLoadRef.current = false;
    }, 50);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams, setQuery]);

  useEffect(() => {
    if (isFirstLoadRef.current) return;
    const updateUrl = () => {
      const newParams = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "")
          newParams.set(key, String(value));
      });
      navigate(`${pathname}?${newParams.toString()}`, { replace: true });
    };
    const debounced = debounce(updateUrl, 100);
    debounced();
    return () => debounced.cancel();
  }, [query, pathname, navigate]);

  return {
    query: getQuery(prefix),
    updateQueryParams: (params) => updateQueryParams(params, prefix),
    resetFilter: () => resetFilter(prefix),
    resetFilterExceptPageAndLimit: () => resetFilterExceptPageAndLimit(prefix),
    onChangeSearchInput: (text, options) =>
      onChangeSearchInput(text, { ...options, prefix }),
  };
};
