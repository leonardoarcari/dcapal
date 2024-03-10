import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { api } from "@app/api.jsx";
import Fuse from "fuse.js";
import { useSelector } from "react-redux";
import {
  fetchAssetsDcaPal,
  FetchError,
  fetchPrice,
  fetchPriceYF,
  Provider,
} from "@app/providers.js";
import { DCAPAL_API_SEARCH } from "@app/config.js";
import { Spinner } from "../../../spinner/spinner.jsx";
import {
  ACLASS,
  currentPortfolio,
} from "../../portfolioSlice.jsx";
import { useTranslation } from "react-i18next";

let searchId = undefined;

const fetchAssetsYF = async (query) => {
  const url = `${DCAPAL_API_SEARCH}?q=${query}`;
  try {
    const response = await api.get(url);

    if (response.status != 200) {
      console.error(
        `Response {status: ${response.status}, data: ${response.data}`
      );
      return [];
    }

    return response.data.quotes
      .filter((quote) => {
        const type = quote.quoteType.toUpperCase();
        return type === "EQUITY" || type === "ETF" || type === "MUTUALFUND";
      })
      .map((quote) => ({
        name: quote.longname || quote.shortname || "",
        symbol: quote.symbol,
        type: quote.quoteType,
        exchange: quote.exchange,
        aclass: ACLASS.EQUITY,
      }));
  } catch (error) {
    if (!axios.isCancel(error)) {
      console.error(error);
    }
    return [];
  }
};

export const SearchBar = (props) => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  const searchOptions = {
    shouldSort: true,
    threshold: 0.1,
    keys: ["symbol", "name"],
  };

  useEffect(() => {
    if (!props.text || props.text.length < 1) {
      setResults(null);
      setIsLoading(false);
    }

    const delayedSearch = setTimeout(() => {
      fetchSearchApi(props.text);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [props.text]);

  const handleAddAssetInputChange = async (e) => {
    const text = e.target.value;
    props.setText(text);
  };

  const fetchSearchApi = async (text) => {
    if (!text || text.length < 2) return;

    searchId = crypto.randomUUID();
    const currentSearchId = searchId;

    const fromDcaPal = async (type) => {
      const assets = await fetchAssetsDcaPal(type);
      const fuse = new Fuse(assets, searchOptions);

      const res = fuse
        .search(text)
        .map((r) => r.item)
        .sort((a, b) => a.symbol - b.symbol);

      return res;
    };

    const fromYF = async () => {
      const assetsYF = await fetchAssetsYF(text.toLowerCase());
      return assetsYF;
    };

    setIsLoading(true);

    const [fiats, cryptos, equities] = await Promise.all([
      fromDcaPal("fiat"),
      fromDcaPal("crypto"),
      fromYF(),
    ]);

    if (currentSearchId !== searchId) return;

    setResults({
      ...results,
      fiat: fiats && fiats.length > 0 ? fiats : [],
      crypto: cryptos && cryptos.length > 0 ? cryptos : [],
      yf: equities && equities.length > 0 ? equities : [],
    });

    setIsLoading(false);
  };

  const removeAssetYf = (symbol) => {
    if (!results || results.yf.length < 1) return;

    const idx = results.yf.findIndex((r) => r.symbol === symbol);
    if (idx >= 0) {
      results.yf.splice(idx, 1);
      setResults({
        ...results,
      });
    }
  };

  const isEmptyResult =
    results &&
    !isLoading &&
    results.fiat.length === 0 &&
    results.crypto.length === 0 &&
    results.yf.length === 0;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <input
        className="w-full h-12 px-6 pb-px border-2 rounded-3xl border-neutral-500/40 focus:border-neutral-500 focus-visible:outline-none uppercase placeholder:normal-case z-20"
        value={props.text}
        placeholder={t("searchBar.placeholder")}
        onChange={handleAddAssetInputChange}
      />
      {isLoading && (
        <div className="w-[calc(100%-2rem)] px-6 py-3 overflow-auto absolute inset-x-4 top-12 bg-white rounded-sm ring-1 ring-slate-500/50 shadow-lg z-40 flex items-center justify-center font-light italic">
          <Spinner width="2.5rem" height="2.5rem" />
        </div>
      )}
      {results && isEmptyResult && (
        <div className="w-[calc(100%-2rem)] px-6 py-4 overflow-auto absolute inset-x-4 top-12 bg-white rounded-sm ring-1 ring-slate-500/50 shadow-lg z-40 flex items-center justify-center font-light italic">
          {t("searchBar.noAssetFoundFor")} '{props.text.toUpperCase()}'
        </div>
      )}
      {results && !isEmptyResult && (
        <ul className="w-[calc(100%-2rem)] max-h-72 min-h-[10rem] overflow-auto absolute inset-x-4 top-12 bg-white rounded-sm ring-1 ring-slate-500/50 shadow-lg z-40">
          {results.fiat.length > 0 && <SearchHeader text="cash" />}
          {results.fiat.map((r) => (
            <SearchItemCW
              key={r.symbol}
              data={r}
              currentSearchId={searchId}
              setText={props.setText}
              addAsset={props.addAsset}
              closeSearchList={() => setResults(null)}
            />
          ))}
          {results.crypto.length > 0 && <SearchHeader text="crypto" />}
          {results.crypto.map((r) => (
            <SearchItemCW
              key={r.symbol}
              data={r}
              currentSearchId={searchId}
              setText={props.setText}
              addAsset={props.addAsset}
              closeSearchList={() => setResults(null)}
            />
          ))}
          {results.yf.length > 0 && <SearchHeader text="equity" />}
          {results.yf.map((r) => (
            <SearchItemYF
              key={r.symbol}
              data={r}
              currentSearchId={searchId}
              setText={props.setText}
              addAsset={props.addAsset}
              removeAsset={removeAssetYf}
              closeSearchList={() => setResults(null)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

const SearchHeader = (props) => (
  <div className="sticky top-0 pl-2 pt-1 pb-1 bg-slate-200 text-xs font-semibold">
    <div className="uppercase">{props.text}</div>
  </div>
);

const SearchItemCW = (props) => {
  const { i18n } = useTranslation();
  const quoteCcy = useSelector((state) => currentPortfolio(state).quoteCcy);

  const [price, setPrice] = useState(null);
  const cancelTokenSources = { price: useRef(null) };

  useEffect(() => {
    const fetchPromise = async () => {
      cancelTokenSources.price.current = axios.CancelToken.source();
      const token = cancelTokenSources.price.current.token;
      const p = await fetchPrice(props.data.symbol, quoteCcy, token);
      if (p) {
        setPrice(p);
      }
    };

    if (props.currentSearchId !== searchId) {
      // Search canceled
      cancelTokenSources.price.current?.cancel();
    }

    fetchPromise();

    return () => {
      cancelTokenSources.price.current?.cancel();
    };
  }, [props.data.symbol, props.currentSearchId]);

  const handleResultClick = () => {
    if (!price) return;

    props.setText(props.data.symbol);
    props.addAsset({
      symbol: props.data.symbol,
      name: props.data.name,
      aclass: props.data.aclass,
      price: price,
      baseCcy: props.data.symbol,
      provider: Provider.DCA_PAL,
    });
    props.closeSearchList();
  };

  const isPrice = price ? true : false;

  return (
    <li className="pl-2 pt-1 pb-1 hover:bg-slate-400/50 cursor-pointer">
      <div
        className="flex items-center justify-between h-10 uppercase"
        onClick={handleResultClick}
      >
        <div className="grow flex flex-col min-w-0">
          <div className="font-medium uppercase">{props.data.symbol}</div>
          <div className="text-xs font-light capitalize truncate">
            {props.data.name}
          </div>
        </div>
        <div className="mr-2">
          <div>
            {isPrice && (
              <div className="flex items-center">
                <div className="text-base font-medium m-1">
                  {price.toLocaleString(i18n.language, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="flex justify-start w-10 uppercase">
                  {quoteCcy}
                </div>
              </div>
            )}
          </div>
          <div>
            {!isPrice && (
              <div className="text-base font-medium">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

const SearchItemYF = (props) => {
  const quoteCcy = useSelector((state) => currentPortfolio(state).quoteCcy);
  const validCcys = useSelector((state) => state.app.currencies);
  const { t, i18n } = useTranslation();

  const [price, setPrice] = useState(null);
  const [baseCcy, setBaseCcy] = useState("");

  const cancelTokenSourcePrice = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      cancelTokenSourcePrice.current = axios.CancelToken.source();
      const token = cancelTokenSourcePrice.current.token;
      const p = await fetchPriceYF(
        props.data.symbol,
        quoteCcy,
        validCcys,
        token
      );
      if (p && !(p in FetchError)) {
        const [px, base] = p;
        setPrice(px);
        setBaseCcy(base);
      } else if (!p || p === FetchError.BAD_DATA) {
        props.removeAsset(props.data.symbol);
      }
    };

    if (props.currentSearchId !== searchId) {
      // Search canceled
      cancelTokenSourcePrice.current?.cancel();
    }

    fetchData();

    return () => cancelTokenSourcePrice.current?.cancel();
  }, [props.data.symbol, props.currentSearchId]);

  const handleResultClick = () => {
    if (!price) return;

    props.setText(props.data.symbol);
    props.addAsset({
      symbol: props.data.symbol,
      name: props.data.name,
      aclass: props.data.aclass,
      price: price,
      baseCcy: baseCcy,
      provider: Provider.YF,
    });
    props.closeSearchList();
  };

  return (
    <li className="pl-2 pt-1 pb-1 hover:bg-slate-400/50 cursor-pointer">
      <div
        className="flex items-center justify-between h-10 uppercase"
        onClick={handleResultClick}
      >
        <div className="grow flex flex-col min-w-0">
          <div className="font-medium uppercase">{props.data.symbol}</div>
          <div className="text-xs font-light capitalize truncate">
            {props.data.name}
          </div>
        </div>
        <div className="mr-2">
          <div>
            {price && (
              <div className="flex items-center">
                <div className="text-base font-medium m-1">
                  {price.toLocaleString(i18n.language, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="flex justify-start w-10 uppercase">
                  {quoteCcy}
                </div>
              </div>
            )}
          </div>
          <div>
            {!price && (
              <div className="text-base font-medium">
                {t("searchBar.loading")}...
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};
