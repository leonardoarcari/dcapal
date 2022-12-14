import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { api } from "../../../app/api";
import Fuse from "fuse.js";
import { useSelector } from "react-redux";
import {
  fetchAssetsDcaPal,
  fetchPrice,
  fetchPriceYF,
  Provider,
} from "../../../app/providers";
import { YF_API_2 } from "../../../app/config";

let searchId = undefined;

const fetchAssetsYF = async (query) => {
  const url = `${YF_API_2}/v1/finance/search?q=${query}`;
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
        name: quote.longname,
        symbol: quote.symbol,
        type: quote.quoteType,
        exchange: quote.exchange,
      }));
  } catch (error) {
    if (!axios.isCancel(error)) {
      console.error(error);
    }
    return [];
  }
};

export const SearchBar = (props) => {
  const emptyRes = { fiat: [], crypto: [], yf: [] };
  const [results, setResults] = useState({ ...emptyRes });

  const searchOptions = {
    shouldSort: true,
    threshold: 0.1,
    keys: ["symbol", "name"],
  };

  useEffect(() => {
    if (!props.text || props.text.length < 1) {
      setResults({ ...emptyRes });
    }
  }, [props.text]);

  const handleAddAssetInputChange = async (e) => {
    const text = e.target.value;
    props.setText(text);

    if (text && text.length > 2) {
      searchId = uuidv4();
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
        const assetsYF = await fetchAssetsYF(text);
        return assetsYF;
      };

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
    }
  };

  const isAnyResult =
    results.fiat.length > 0 ||
    results.crypto.length > 0 ||
    results.yf.length > 0;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <input
        className="w-full h-12 px-6 pb-px border-2 rounded-3xl border-gray-500/40 uppercase placeholder:normal-case z-20"
        value={props.text}
        placeholder={"Search Crypto, ETF and much more"}
        onChange={handleAddAssetInputChange}
      />
      {isAnyResult && (
        <ul className="w-[calc(100%-2rem)] max-h-72 overflow-auto absolute inset-x-4 top-12 bg-white rounded-sm ring-1 ring-slate-500/50 shadow-lg z-10">
          {results.fiat.length > 0 && <SearchHeader text="cash" />}
          {results.fiat.map((r) => (
            <SearchItemCW
              key={r.symbol}
              data={r}
              currentSearchId={searchId}
              setText={props.setText}
              addAsset={props.addAsset}
              closeSearchList={() => setResults({ ...emptyRes })}
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
              closeSearchList={() => setResults({ ...emptyRes })}
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
              closeSearchList={() => setResults({ ...emptyRes })}
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
  const quoteCcy = useSelector((state) => state.pfolio.quoteCcy);

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
      price: price,
      baseCcy: props.data.symbol,
      provider: Provider.DCA_PAL,
    });
    props.closeSearchList();
  };

  const isPrice = price ? true : false;

  return (
    <li className="pl-2 pt-1 pb-1 hover:bg-slate-400/50">
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
                  {price.toLocaleString("en-US", {
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
  const quoteCcy = useSelector((state) => state.pfolio.quoteCcy);

  const [price, setPrice] = useState(null);
  const [baseCcy, setBaseCcy] = useState("");
  const cancelTokenSourcePrice = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      cancelTokenSourcePrice.current = axios.CancelToken.source();
      const token = cancelTokenSourcePrice.current.token;
      const p = await fetchPriceYF(props.data.symbol, quoteCcy, token);
      if (p) {
        const [px, base] = p;
        setPrice(px);
        setBaseCcy(base);
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
      price: price,
      baseCcy: baseCcy,
      provider: Provider.YF,
    });
    props.closeSearchList();
  };

  return (
    <li className="pl-2 pt-1 pb-1 hover:bg-slate-400/50">
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
                  {price.toLocaleString("en-US", {
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
            {!price && <div className="text-base font-medium">Loading...</div>}
          </div>
        </div>
      </div>
    </li>
  );
};
