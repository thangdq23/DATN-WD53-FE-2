import { debounce } from "lodash";
import { create } from "zustand";

export const useFilterStore = create((set, get) => ({
  query: {},
  getQuery: (prefix = "") => {
    const { query } = get();
    if (!prefix) return query;
    const result = {};
    Object.entries(query).forEach(([key, value]) => {
      if (key.startsWith(prefix)) {
        result[key.slice(prefix.length)] = value;
      }
    });
    return result;
  },
  setQuery: (query) => set({ query }),
  resetFilter: (prefix = "") => {
    const { query } = get();
    if (!prefix) {
      set({ query: {} });
    } else {
      const newQuery = {};
      Object.entries(query).forEach(([key, value]) => {
        if (!key.startsWith(prefix)) {
          newQuery[key] = value;
        }
      });
      set({ query: newQuery });
    }
  },
  resetFilterExceptPageAndLimit: (prefix = "") => {
    const { query } = get();
    const newQuery = {};
    Object.entries(query).forEach(([key, value]) => {
      if (!prefix || key.startsWith(prefix)) {
        if (key.endsWith("page") || key.endsWith("limit")) {
          newQuery[key] = value;
        }
      } else {
        newQuery[key] = value;
      }
    });
    set({ query: newQuery });
  },
  updateQueryParams: (params, prefix = "") => {
    const { query } = get();
    const newQuery = { ...query };
    Object.entries(params).forEach(([key, value]) => {
      const finalKey = prefix ? `${prefix}${key}` : key;
      if (value === undefined || value === null || value === "") {
        delete newQuery[finalKey];
      } else {
        newQuery[finalKey] = value;
      }
    });
    set({ query: newQuery });
  },

  onChangeSearchInput: debounce((text, options) => {
    const { updateQueryParams } = get();
    if (options.enableOnChangeSearch) {
      updateQueryParams({ search: text }, options.prefix);
    }
  }, 500),
}));
