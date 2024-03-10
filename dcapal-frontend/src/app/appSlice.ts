import { createSlice } from "@reduxjs/toolkit";

export const Step = Object.freeze({
  INIT: 0,
  PORTFOLIOS: 10,
  IMPORT: 20,
  PORTFOLIO: 30,
  INVEST: 40,
  END: 50,
});

export const appSlice = createSlice({
  name: "app",
  initialState: {
    allocationFlowStep: Step.PORTFOLIOS,
    currencies: [],
    preferredCurrency: "",
    pfolioFile: "",
  },
  reducers: {
    setAllocationFlowStep: (state, action) => {
      state.allocationFlowStep = action.payload.step;
    },
    setCurrencies: (state, action) => {
      state.currencies = action.payload.currencies;
    },
    setPreferredCurrency: (state, action) => {
      state.preferredCurrency = action.payload.ccy;
    },
    setPfolioFile: (state, action) => {
      state.pfolioFile = action.payload.file;
    },
  },
});

export const {
  setAllocationFlowStep,
  setCurrencies,
  setPreferredCurrency,
  setPfolioFile,
} = appSlice.actions;

export default appSlice.reducer;
