import { store } from "@app/store.js";
import { createSlice } from "@reduxjs/toolkit";
import { roundAmount, roundPrice } from "@utils/index.ts";
import i18n from "i18next";

const updateWeight = (asset, totalAmount) => {
  const qty = asset.qty || 0;
  const price = asset.price || 0;
  const amount = qty * price;

  const weight = totalAmount > 0 ? amount / totalAmount : 0;

  asset.weight = weight * 100;
};

export const ACLASS = Object.freeze({
  UNDEFINED: 0,
  EQUITY: 10,
  CRYPTO: 20,
  CURRENCY: 30,
});

export const isWholeShares = (aclass) => {
  switch (aclass) {
    case ACLASS.EQUITY:
      return true;
    default:
      return false;
  }
};

export const aclassToString = (aclass) => {
  switch (aclass) {
    case ACLASS.UNDEFINED:
      return "UNDEFINED";
    case ACLASS.EQUITY:
      return "EQUITY";
    case ACLASS.CRYPTO:
      return "CRYPTO";
    case ACLASS.CURRENCY:
      return "CURRENCY";
    default:
      return "UNDEFINED";
  }
};

export const parseAClass = (aclassStr) => {
  if (aclassStr === "EQUITY") return ACLASS.EQUITY;
  if (aclassStr === "CRYPTO") return ACLASS.CRYPTO;
  if (aclassStr === "CURRENCY") return ACLASS.CURRENCY;

  return ACLASS.UNDEFINED;
};

export const FeeType = Object.freeze({
  ZERO_FEE: 10,
  FIXED: 20,
  VARIABLE: 30,
});

export const feeTypeToString = (type) => {
  switch (type) {
    case FeeType.ZERO_FEE:
      return "zeroFee";
    case FeeType.FIXED:
      return "fixed";
    case FeeType.VARIABLE:
      return "variable";
    default:
      return "undefined";
  }
};

export const parseFeeType = (typeStr) => {
  if (typeStr === "zeroFee") return FeeType.ZERO_FEE;
  if (typeStr === "fixed") return FeeType.FIXED;
  if (typeStr === "variable") return FeeType.VARIABLE;

  return null;
};

export const parseFees = (fees) => {
  if (!fees) return null;

  const feeType = parseFeeType(fees.feeStructure.type);
  if (!feeType) return null;

  const parsed = getDefaultFees(feeType);

  if (feeType === FeeType.ZERO_FEE) return parsed;

  if (feeType === FeeType.FIXED) {
    if (fees.maxFeeImpact) {
      parsed.maxFeeImpact = fees.maxFeeImpact;
    }
    if (fees.feeStructure.feeAmount) {
      parsed.feeStructure.feeAmount = fees.feeStructure.feeAmount;
    }

    return parsed;
  }

  if (feeType === FeeType.VARIABLE) {
    if (fees.maxFeeImpact) {
      parsed.maxFeeImpact = fees.maxFeeImpact;
    }
    if (fees.feeStructure.feeRate) {
      parsed.feeStructure.feeRate = fees.feeStructure.feeRate;
    }
    if (fees.feeStructure.minFee) {
      parsed.feeStructure.minFee = fees.feeStructure.minFee;
    }
    if (fees.feeStructure.maxFee) {
      parsed.feeStructure.maxFee = fees.feeStructure.maxFee;
    }
    return parsed;
  }

  return null;
};

export const getDefaultFees = (type) => {
  if (!type) {
    return null;
  }

  if (type == FeeType.ZERO_FEE) {
    return {
      feeStructure: {
        type: FeeType.ZERO_FEE,
      },
    };
  } else if (type === FeeType.FIXED) {
    return {
      maxFeeImpact: null,
      feeStructure: {
        type: FeeType.FIXED,
        feeAmount: 0,
      },
    };
  } else {
    return {
      maxFeeImpact: null,
      feeStructure: {
        type: FeeType.VARIABLE,
        feeRate: 0,
        minFee: 0,
        maxFee: null,
      },
    };
  }
};

export const getNewPortfolio = () => {
  return {
    id: crypto.randomUUID(),
    name: "",
    assets: {},
    quoteCcy: "eur",
    nextIdx: 0,
    totalAmount: 0,
    budget: 0,
    fees: getDefaultFees(FeeType.ZERO_FEE),
    lastPriceRefresh: Date.now(),
  };
};

export const getDefaultPortfolioName = () => {
  const defaultName = i18n.t("importStep.defaultPortfolioName");
  const defaultNameCount = Object.values(store.getState().pfolio.pfolios)
    .map((p) => p.name)
    .filter((name) => name.startsWith(defaultName)).length;

  return defaultNameCount > 0
    ? `${defaultName} ${defaultNameCount + 1}`
    : `${defaultName}`;
};

export const currentPortfolio = (state) => {
  if ("pfolio" in state) {
    return getPortfolio(state.pfolio.selected, state.pfolio.pfolios);
  }

  return getPortfolio(state.selected, state.pfolios);
};

const getPortfolio = (id, pfolios) => {
  if (!id || !(id in pfolios)) return null;

  return pfolios[id];
};

const initialState = () => {
  return {
    selected: null,
    pfolios: {},
  };
};

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: initialState(),
  reducers: {
    addPortfolio: (state, action) => {
      const { pfolio } = action.payload;

      state.pfolios = { ...state.pfolios, [pfolio.id]: pfolio };
    },
    deletePortfolio: (state, action) => {
      const { id } = action.payload;
      if (!(id in state.pfolios)) return;

      delete state.pfolios[id];
    },
    duplicatePortfolio: (state, action) => {
      const { id } = action.payload;
      if (!(id in state.pfolios)) return;

      const pfolio = { ...state.pfolios[id] };
      pfolio.id = crypto.randomUUID();
      pfolio.name += " " + i18n.t("portfoliosStep.copy");

      state.pfolios = { ...state.pfolios, [pfolio.id]: pfolio };
    },
    selectPortfolio: (state, action) => {
      const { id } = action.payload;
      if (!id) {
        state.selected = null;
        return;
      }

      if (id === state.selected) return;

      if (id in state.pfolios) {
        state.selected = id;
      }
    },
    renamePortfolio: (state, action) => {
      const { id, name } = action.payload;
      if (!(id in state.pfolios)) return;

      state.pfolios[id].name = name;
    },
    addAsset: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      const symbol = action.payload.symbol;
      if (symbol && symbol in pfolio.assets) return;

      pfolio.assets = {
        ...pfolio.assets,
        [action.payload.symbol]: {
          idx: state.nextIdx,
          symbol: action.payload.symbol,
          name: action.payload.name,
          aclass: action.payload.aclass,
          baseCcy: action.payload.baseCcy,
          price: roundPrice(action.payload.price) || 0,
          provider: action.payload.provider,
          qty: 0,
          amount: 0,
          weight: 0,
          targetWeight: 0,
          fees: null,
        },
      };
      pfolio.nextIdx += 1;

      if (Object.keys(pfolio.assets).length === 1) {
        pfolio.lastPriceRefresh = Date.now();
      }
    },
    removeAsset: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      const symbol = action.payload.symbol;
      if (symbol in pfolio.assets) {
        const asset = pfolio.assets[symbol];

        pfolio.totalAmount -= asset.amount;
        delete pfolio.assets[symbol];

        Object.values(pfolio.assets).forEach((asset) => {
          updateWeight(asset, pfolio.totalAmount);
        });
      }
    },
    setQty: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      const asset = pfolio.assets[action.payload.symbol];
      const price = asset?.price || 0;
      const newAmount = roundAmount((action.payload.qty || 0) * price);

      pfolio.totalAmount -= asset.amount;
      pfolio.totalAmount += newAmount;

      pfolio.assets = {
        ...pfolio.assets,
        [action.payload.symbol]: {
          ...pfolio.assets[action.payload.symbol],
          qty: action.payload.qty || 0,
          amount: newAmount,
        },
      };

      Object.values(pfolio.assets).forEach((asset) => {
        updateWeight(asset, pfolio.totalAmount);
      });
    },
    setPrice: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      let { symbol, price } = action.payload;
      if (!symbol || !(symbol in pfolio.assets)) {
        return;
      }

      const asset = pfolio.assets[action.payload.symbol];
      price = roundPrice(price);

      // Refresh amounts
      const newAmount = roundAmount((asset.qty || 0) * price);
      pfolio.totalAmount -= asset.amount;
      pfolio.totalAmount += newAmount;
      pfolio.totalAmount = pfolio.totalAmount;

      // Update asset info
      asset.price = price;
      asset.amount = newAmount;

      Object.values(pfolio.assets).forEach((asset) => {
        updateWeight(asset, pfolio.totalAmount);
      });
    },
    setTargetWeight: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      pfolio.assets = {
        ...pfolio.assets,
        [action.payload.symbol]: {
          ...pfolio.assets[action.payload.symbol],
          targetWeight: action.payload.weight || 0,
        },
      };
    },
    setRefreshTime: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      if (action.payload.time) {
        pfolio.lastPriceRefresh = action.payload.time;
      }
    },
    setQuoteCurrency: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      if (action.payload.quoteCcy && action.payload.quoteCcy.length > 0) {
        pfolio.quoteCcy = action.payload.quoteCcy;
      }
    },
    setBudget: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      if (action.payload.budget && action.payload.budget >= 0) {
        pfolio.budget = action.payload.budget;
      }
    },
    setFees: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      if (action.payload.fees) {
        pfolio.fees = action.payload.fees;
      }
    },
    setFeesAsset: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      const { fees, symbol } = action.payload;
      if (!symbol || !(symbol in pfolio.assets)) {
        return;
      }

      pfolio.assets[symbol].fees = fees;
    },
    setFeeType: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      if (!action.payload.type) {
        pfolio.fees = getDefaultFees(FeeType.ZERO_FEE);
        return;
      }

      if (!pfolio.fees?.feeStructure?.type) {
        pfolio.fees = getDefaultFees(action.payload.type);
        return;
      }

      if (action.payload.type !== pfolio.fees.feeStructure.type) {
        pfolio.fees = {
          ...pfolio.fees,
          feeStructure: getDefaultFees(action.payload.type).feeStructure,
        };
      }
    },
    setFeeTypeAsset: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      const { type, symbol } = action.payload;
      if (!symbol || !(symbol in pfolio.assets)) {
        return;
      }

      if (!type) {
        pfolio.assets[symbol].fees = null;
        return;
      }

      const asset = pfolio.assets[symbol];

      if (!asset.fees?.feeStructure.type) {
        asset.fees = getDefaultFees(type);
        return;
      }

      if (type !== asset.fees.feeStructure.type) {
        asset.fees = {
          ...asset.fees,
          feeStructure: getDefaultFees(type).feeStructure,
        };
      }
    },
    setMaxFeeImpact: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      if (pfolio.fees) {
        pfolio.fees = {
          ...pfolio.fees,
          maxFeeImpact: action.payload.value,
        };
      }
    },
    setMaxFeeImpactAsset: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      const { value, symbol } = action.payload;
      if (!symbol || !(symbol in pfolio.assets)) {
        return;
      }

      const fees = pfolio.assets[symbol].fees;
      if (fees) {
        pfolio.assets[symbol].fees = {
          ...fees,
          maxFeeImpact: value,
        };
      }
    },
    setFixedFeeAmount: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      if (pfolio.fees && pfolio.fees.feeStructure?.type === FeeType.FIXED) {
        pfolio.fees = {
          ...pfolio.fees,
          feeStructure: {
            ...pfolio.fees.feeStructure,
            feeAmount: action.payload.value,
          },
        };
      }
    },
    setFixedFeeAmountAsset: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      const { value, symbol } = action.payload;
      if (!symbol || !(symbol in pfolio.assets)) {
        return;
      }

      const fees = pfolio.assets[symbol].fees;
      if (fees && fees.feeStructure.type === FeeType.FIXED) {
        pfolio.assets[symbol].fees = {
          ...fees,
          feeStructure: {
            ...fees.feeStructure,
            feeAmount: value,
          },
        };
      }
    },
    setVariableFee: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      if (pfolio.fees && pfolio.fees.feeStructure?.type === FeeType.VARIABLE) {
        pfolio.fees = {
          ...pfolio.fees,
          feeStructure: {
            ...pfolio.fees.feeStructure,
            ...action.payload,
          },
        };
      }
    },
    setVariableFeeAsset: (state, action) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      const { symbol, ...rest } = action.payload;
      if (!symbol || !(symbol in pfolio.assets)) {
        return;
      }

      const fees = pfolio.assets[symbol].fees;
      if (fees && fees.feeStructure.type === FeeType.VARIABLE) {
        pfolio.assets[symbol].fees = {
          ...fees,
          feeStructure: {
            ...fees.feeStructure,
            ...rest,
          },
        };
      }
    },
    clearBudget: (state) => {
      const pfolio = currentPortfolio(state);
      if (!pfolio) return;

      pfolio.budget = 0;
    },
  },
});

export const {
  addPortfolio,
  deletePortfolio,
  duplicatePortfolio,
  selectPortfolio,
  renamePortfolio,
  addAsset,
  removeAsset,
  setQty,
  setPrice,
  setTargetWeight,
  setRefreshTime,
  setQuoteCurrency,
  setBudget,
  setFees,
  setFeesAsset,
  setFeeType,
  setFeeTypeAsset,
  setMaxFeeImpact,
  setMaxFeeImpactAsset,
  setFixedFeeAmount,
  setFixedFeeAmountAsset,
  setVariableFee,
  setVariableFeeAsset,
  clearBudget,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
