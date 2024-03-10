import { combineReducers, configureStore } from "@reduxjs/toolkit";
import i18n from "i18next";
import portfolioReducer, {
  FeeType,
  getDefaultFees,
} from "../components/allocationFlow/portfolioSlice"
import appReducer, { Step } from "./appSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createMigrate from "redux-persist/es/createMigrate";
import { mapValues } from "@utils/index.js";
import { REFRESH_PRICE_INTERVAL_SEC } from "./config.js";

const migrations = {
  0: (state) => {
    const assets = state?.pfolio?.assets;
    if (!assets || Object.keys(assets).length === 0) {
      return state;
    }

    const anyAsset = Object.values(assets)[0];
    if (!anyAsset.aclass) {
      console.log(
        "Old 'pfolio' persisted state version, missing 'aclass' property. Purging state"
      );
      return {};
    }

    return state;
  },
  2: (state) => {
    return {
      ...state,
      pfolio: {
        ...state.pfolio,
        fees: getDefaultFees(FeeType.ZERO_FEE),
        assets: mapValues(state.pfolio.assets, (a) => ({ ...a, fees: null })),
      },
    };
  },
  3: (state) => {
    return {
      ...state,
      pfolio: {
        ...state.pfolio,
        lastPriceRefresh: Date.now() - (REFRESH_PRICE_INTERVAL_SEC + 1) * 1000,
      },
    };
  },
  4: (state) => {
    const pfolio = state.pfolio;
    const id = crypto.randomUUID();
    const name = i18n.t("importStep.defaultPortfolioName");

    const hasPfolio = Object.keys(pfolio?.assets).length > 0;

    return {
      ...state,
      app: {
        ...state.app,
        ...(!hasPfolio && { allocationFlowStep: Step.PORTFOLIOS }),
        preferredCurrency: pfolio.quoteCcy ?? "",
      },
      pfolio: {
        selected: id,
        pfolios: {
          [id]: {
            ...pfolio,
            id: id,
            name: name,
          },
        },
      },
    };
  },
};

const rootConfig = {
  key: "root",
  version: 4,
  storage,
  migrate: createMigrate(migrations, { debug: false }),
};

const rootReducer = combineReducers({
  app: appReducer,
  pfolio: portfolioReducer,
});

const persistedReducer = persistReducer(rootConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
