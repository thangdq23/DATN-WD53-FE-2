import { useMemo } from "react";
import { debounce } from "lodash";
import { useQueryFilter } from "./useQueryFilter";

export const convertObject = (inputObj) => {
  return Object.entries(inputObj).reduce((result, [key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      result[key] = value.join(",");
    } else if (value === null || value === undefined) {
      result[key] = "";
    } else {
      result[key] = value;
    }
    return result;
  }, {});
};

export const useTable = (prefix = "") => {
  const {
    query,
    resetFilter: reset,
    resetFilterExceptPageAndLimit,
    updateQueryParams,
  } = useQueryFilter(prefix);

  const getFilteredValue = (key) => {
    return query[key] ? query[key].split(",") : undefined;
  };

  const resetFilter = (options) => {
    if (options?.keepPageAndLimit) {
      resetFilterExceptPageAndLimit();
    } else {
      reset();
    }
  };

  const onChangeSearchInput = useMemo(() => {
    return debounce((text, options) => {
      if (options.enableOnChangeSearch) {
        updateQueryParams({ ...query, search: text });
      }
    }, 500);
  }, [query, updateQueryParams]);

  const onSubmitSearch = (text) => {
    updateQueryParams({ ...query, search: text });
  };

  const onSelectPaginateChange = (page, pageSize) => {
    updateQueryParams({
      ...query,
      page: String(page),
      limit: pageSize ? pageSize.toString() : "10",
    });
  };

  const onFilter = (filter, sorter) => {
    const filterParams = convertObject(filter);
    const sortColumnKey = Array.isArray(sorter)
      ? sorter[0]?.columnKey
      : sorter?.columnKey;
    const sortOrder = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;

    const params = {
      ...query,
      ...filterParams,
      page: "1",
    };

    if (sortColumnKey && sortOrder) {
      params.sort = sortColumnKey.toString();
      params.order = sortOrder === "ascend" ? "asc" : "desc";
    } else {
      params.sort = undefined;
      params.order = undefined;
    }
    updateQueryParams(params);
  };

  const getSorterProps = (field) => ({
    sorter: true,
    showSorterTooltip: false,
    sortOrder:
      query.sort === field
        ? query.order
          ? query.order === "asc"
            ? "ascend"
            : "descend"
          : undefined
        : undefined,
  });

  return {
    query,
    onFilter,
    updateQueryParams,
    getSorterProps,
    getFilteredValue,
    resetFilter,
    onSelectPaginateChange,
    onChangeSearchInput,
    onSubmitSearch,
  };
};
