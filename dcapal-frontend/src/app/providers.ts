import axios from "axios";
import { api } from "./api.jsx";
import { DCAPAL_API, DCAPAL_API_CHART } from "./config.js";
import { ACLASS } from "../components/allocationFlow/portfolioSlice.jsx";

export const Provider = Object.freeze({
  DCA_PAL: "DCAPal",
  YF: "YF",
});

export const FetchError = Object.freeze({
  BAD_DATA: "BAD_DATA",
  REQUEST_CANCELED: "REQUEST_CANCELED",
});

export const fetchPrice = async (base, quote, token) => {
  const url = `${DCAPAL_API}/price/${base}?quote=${quote}`;
  try {
    const response = await api.get(url, { cancelToken: token });

    if (response.status != 200) {
      console.error(
        `Response {status: ${response.status}, data: ${response.data}`
      );
      return null;
    }

    return response.data.price;
  } catch (error) {
    if (!axios.isCancel(error)) {
      console.error(error);
    }
    return null;
  }
};

const toUnixTimestamp = (date, startOfDay) => {
  const d = new Date(date.getTime());
  if (startOfDay) {
    d.setUTCHours(0, 0, 0, 0);
  }
  return Math.floor(d.getTime() / 1000);
};

export const fetchPriceYF = async (symbol, quote, validCcys, token) => {
  const lastFourDays = new Date();
  lastFourDays.setDate(lastFourDays.getDate() - 4);
  const period1 = toUnixTimestamp(lastFourDays, true);
  const period2 = toUnixTimestamp(new Date(), false);
  const url = `${DCAPAL_API_CHART}/${symbol}?interval=5m&period1=${period1}&period2=${period2}&close=adjusted`;
  try {
    const response = await api.get(url, {
      cancelToken: token,
    });

    if (response.status != 200) {
      console.error(
        `Response {status: ${response.status}, data: ${response.data}`
      );
      return null;
    }

    // On error, log and exit
    if (!response.data.chart || response.data.chart?.error) {
      console.error(response.data.chart?.error);
      return FetchError.BAD_DATA;
    }

    const result = response.data.chart.result;
    if (!Array.isArray(result) || result.length < 1) {
      console.error("Empty YF price result:", response.data, url);
      return FetchError.BAD_DATA;
    }

    const base = result[0].meta?.currency?.toLowerCase();
    if (!base) {
      console.error("Missing base currency:", response.data, url);
      return FetchError.BAD_DATA;
    }

    const isValidCcy = validCcys.find((ccy) => ccy === base);
    if (!isValidCcy) {
      console.warn("Unsupported currency:", response.data, url, validCcys);
      return FetchError.BAD_DATA;
    }

    const quotes = result[0].indicators?.quote;
    if (!Array.isArray(quotes) || quotes.length < 1) {
      console.error("Empty quotes:", response.data, url);
      return FetchError.BAD_DATA;
    }

    const closePrices = quotes[0].close;
    if (!Array.isArray(closePrices) || closePrices.length < 1) {
      console.error("Empty close prices:", response.data, url);
      return FetchError.BAD_DATA;
    }

    const price = closePrices
      .slice()
      .reverse()
      .find((p) => p);

    if (base === quote) {
      return [price, base];
    } else {
      const rate = await fetchPrice(base, quote, token);
      return [price * rate, base];
    }
  } catch (error) {
    if (!axios.isCancel(error)) {
      console.error(error);
    }
    return FetchError.REQUEST_CANCELED;
  }
};

export const getFetcher = (provider, validCcys) => {
  if (provider === Provider.DCA_PAL) {
    return async (symbol, quote) => {
      return await fetchPrice(symbol, quote, null);
    };
  }

  return async (symbol, quote) => {
    const p = await fetchPriceYF(symbol, quote, validCcys, null);
    if (p && !(p in FetchError)) {
      const [px] = p;
      return px;
    }
    return null;
  };
};

export const fetchAssetsDcaPal = async (type) => {
  const url = `${DCAPAL_API}/assets/${type}`;
  try {
    const response = await api.get(url);

    if (response.status != 200) {
      console.error(
        `Response {status: ${response.status}, data: ${response.data}`
      );
      return [];
    }

    const aclass = type === "fiat" ? ACLASS.CURRENCY : ACLASS.CRYPTO;

    return response.data.map((asset) => ({
      symbol: asset.id,
      name: asset.symbol,
      aclass: aclass,
    }));
  } catch (error) {
    if (!axios.isCancel(error)) {
      console.error(error);
    }
    return [];
  }
};
