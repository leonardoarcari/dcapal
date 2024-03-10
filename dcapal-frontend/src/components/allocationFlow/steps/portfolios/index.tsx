import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { PortfolioCard } from "./portfolioCard.jsx";
import { useNavigate } from "react-router-dom";
import { InputText } from "../../../core/inputText.jsx";
import { CcyGroup } from "../ccy/ccyGroup.jsx";
import {
  Step,
  setAllocationFlowStep,
  setPreferredCurrency,
} from "@app/appSlice.js";
import {
  addPortfolio,
  getNewPortfolio,
  selectPortfolio,
} from "../../portfolioSlice.jsx";
import classNames from "classnames";

export const PortfoliosStep = () => {
  const { t } = useTranslation();
  const pfolios = useSelector((state) => state.pfolio.pfolios);
  const [showNewPfolio, setShowNewPfolio] = useState(
    Object.keys(pfolios).length === 0
  );

  const pfoliosCount = Object.keys(pfolios).length;

  useEffect(() => {
    if (pfoliosCount === 0) {
      setShowNewPfolio(true);
    }
  }, [pfoliosCount]);

  const onClickNewPortfolio = () => {
    setShowNewPfolio(true);
  };

  const title =
    pfoliosCount > 0
      ? t("portfoliosStep.myPortfolios")
      : t("portfoliosStep.newPortfolio");

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mt-2 mb-8 text-3xl font-light">{title}</div>
      <div className="w-full flex flex-col gap-5 items-center">
        {Object.values(pfolios).map((p) => {
          return (
            <PortfolioCard
              key={p.id}
              id={p.id}
              name={p.name}
              ccy={p.quoteCcy}
              totalAmount={p.totalAmount}
              assets={Object.values(p.assets)}
            />
          );
        })}
      </div>
      {!showNewPfolio && (
        <span
          className="mt-5 font-medium underline cursor-pointer"
          onClick={onClickNewPortfolio}
        >
          {t("portfoliosStep.newPortfolio")}
        </span>
      )}
      {showNewPfolio && pfoliosCount > 0 && (
        <p className="w-full mt-10 mb-3 text-2xl font-thin">
          {t("portfoliosStep.newPortfolio")}
        </p>
      )}
      {showNewPfolio && (
        <div className={classNames("w-full", { "pl-2": pfoliosCount > 0 })}>
          <NewPortfolioForm
            pfoliosCount={pfoliosCount}
            cancelCb={() => {
              setShowNewPfolio(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

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

const NewPortfolioForm = ({ pfoliosCount, cancelCb }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [name, setName] = useState("");

  const ccys = useSelector((state) => state.app.currencies);
  const preferredCcy = useSelector((state) => state.app.preferredCurrency);
  const sortedCcys = [...ccys].sort(sortCcy);

  const [selectedCcy, setSelectedCcy] = useState(
    preferredCcy ? preferredCcy : sortedCcys.length > 0 ? sortedCcys.at(0) : ""
  );

  useEffect(() => {
    setSelectedCcy(
      preferredCcy
        ? preferredCcy
        : sortedCcys.length > 0
          ? sortedCcys.at(0)
          : ""
    );
  }, [preferredCcy, ccys]);

  const onClickNext = () => {
    const pfolio = getNewPortfolio();
    pfolio.name = name;
    pfolio.quoteCcy = selectedCcy;

    dispatch(addPortfolio({ pfolio: pfolio }));
    dispatch(selectPortfolio({ id: pfolio.id }));
    dispatch(setPreferredCurrency({ ccy: selectedCcy }));
    dispatch(setAllocationFlowStep({ step: Step.PORTFOLIO }));
  };

  const onClickGoBack = () => {
    navigate("/");
  };

  const isFormValid = name && selectedCcy;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-1">
        <label className="text-sm font-light">{t("common.name")}</label>
        <InputText value={name} onChange={setName} isValid={true} />
      </div>
      <div className="w-full flex flex-col gap-2">
        <label className="text-sm font-light">{t("common.currency")}</label>
        <div>
          <CcyGroup
            ccys={sortedCcys}
            selected={selectedCcy}
            setSelected={setSelectedCcy}
          />
        </div>
      </div>
      <div className="w-full mt-6 flex justify-between items-center">
        <span
          className="font-medium underline cursor-pointer"
          onClick={pfoliosCount > 0 ? cancelCb : onClickGoBack}
        >
          {t("common.cancel")}
        </span>
        <button
          className="px-3 pt-1.5 pb-2 flex justify-center items-center bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-800 text-white text-lg rounded-md shadow-md disabled:pointer-events-none disabled:opacity-60"
          onClick={onClickNext}
          disabled={!isFormValid}
        >
          {t("common.next")}
        </button>
      </div>
    </div>
  );
};
