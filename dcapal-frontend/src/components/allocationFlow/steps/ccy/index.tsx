import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAllocationFlowStep, Step } from "@app/appSlice.js";
import {
  currentPortfolio,
  setQuoteCurrency,
} from "../../portfolioSlice.jsx";
import { CcyGroup } from "./ccyGroup.jsx";
import { useTranslation } from "react-i18next";

const priority = {
  usd: 10,
  eur: 20,
  gbp: 30,
  chf: 40,
  jpy: 50,
  cad: 60,
  aed: 70,
  aud: 80,
};

const sortCcy = (a, b) => {
  const [pA, pB] = [priority[a], priority[b]];
  if (pA && pB) return pA - pB;
  if (!pA && pB) return 1;
  if (pA && !pB) return -1;
  return a - b;
};

export const CcyStep = ({ ...props }) => {
  const portfolioState = useSelector(currentPortfolio);
  const [selected, setSelected] = useState(portfolioState.quoteCcy ?? "");
  const ccys = useSelector((state) => state.app.currencies);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const onClickBack = () => {
    navigate("/");
  };

  const onClickNext = () => {
    dispatch(setQuoteCurrency({ quoteCcy: selected }));
    dispatch(setAllocationFlowStep({ step: Step.PORTFOLIO }));
  };

  const sortedCcys = [...ccys].sort(sortCcy);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mt-2 mb-8 text-3xl font-light">
        {t("currencyStep.chooseCurrency")}
      </div>
      <div>
        <CcyGroup
          ccys={sortedCcys}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      <div className="w-full mt-12 flex justify-between items-center">
        <span
          className="font-medium underline cursor-pointer"
          onClick={onClickBack}
        >
          {t("common.goBack")}
        </span>
        <button
          className="px-3 pt-1.5 pb-2 flex justify-center items-center bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-800 text-white text-lg rounded-md shadow-md disabled:pointer-events-none disabled:opacity-60"
          onClick={onClickNext}
          disabled={selected.length === 0}
        >
          {t("common.next")}
        </button>
      </div>
    </div>
  );
};
