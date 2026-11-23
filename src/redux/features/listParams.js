import { csvRequest } from "../../utils/fileDownload";

const LIST_KEYS = [
  "page",
  "limit",
  "search",
  "status",
  "type",
  "brand",
  "category",
  "fromDate",
  "toDate",
  "lens",
  "lensFilters",
  "lensColor",
  "coupon_type",
  "isFree",
  "attribute_type",
  "trash",
];

export function listParams(params = {}) {
  const query = {};
  LIST_KEYS.forEach((key) => {
    if (params?.[key]) query[key] = params[key];
  });
  return query;
}

export function listRequest(url, params = {}, filename = "export.csv", keys = LIST_KEYS) {
  const source = params && typeof params === "object" ? params : {};
  const query = {};
  keys.forEach((key) => {
    if (source[key]) query[key] = source[key];
  });
  return csvRequest(url, query, filename);
}
