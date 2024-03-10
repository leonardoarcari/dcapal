export const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const roundDecimals = (a, n) => {
  const num = Math.round(a + "e" + n);
  return Number(num + "e" + -n);
};

export const roundAmount = (a) => roundDecimals(a, 2);
export const roundPrice = (a) => roundDecimals(a, 4);

export const replacer = (key, value) => {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
};

export const mapValues = (obj, func) => {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
};

export const ignoreNullReplacer = (k, v) => v ?? undefined;
