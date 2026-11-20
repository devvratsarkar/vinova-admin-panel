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
