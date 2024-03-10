import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCollapse } from "react-collapsed";
import { setAllocationFlowStep, Step } from "@app/appSlice.js";
import { InputNumber, InputNumberType } from "@components/core/inputNumber";
import {
  currentPortfolio,
  isWholeShares,
  setBudget,
} from "../portfolioSlice";
import { Trans, useTranslation } from "react-i18next";
import { spawn, Thread, Worker } from "threads";
import { replacer } from "@utils/index.js";

const amtDecimals = 2;

const buildProblemInput = (assets) => {
  return Object.values(assets).reduce(
    (as, a) => ({
      ...as,
      [a.symbol]: {
        symbol: a.symbol,
        target_weight: a.targetWeight / 100,
        shares: a.qty,
        price: a.price,
        is_whole_shares: isWholeShares(a.aclass),
        current_amount: a.amount,
      },
    }),
    {}
  );
};

export const InvestStep = ({
  useTaxEfficient,
  useWholeShares,
  useAllBudget,
  setUseTaxEfficient,
  setUseWholeShares,
  setUseAllBudget,
}) => {
  const [cash, setCash] = useState(0);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const quoteCcy = useSelector((state) => currentPortfolio(state).quoteCcy);
  const totalAmount = useSelector(
    (state) => currentPortfolio(state).totalAmount
  );
  const assets = useSelector((state) => currentPortfolio(state).assets);
  const [solution, setSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleButtonClick = () => {
    setCash(+Number(solution).toFixed(amtDecimals));
  };

  useEffect(() => {
    if (totalAmount === 0) return;

    const launchSolver = async () => {
      const solver = await spawn(
        new Worker(new URL("@workers/analyzer.js", import.meta.url), {
          name: "wasm-analyzer-worker",
        })
      );

      const as = buildProblemInput(assets);

      try {
        const sol = await solver.analyzeAndSolve(as);

        await Thread.terminate(solver);

        console.debug(`solution=${JSON.stringify(sol, replacer)}`);

        return sol;
      } catch (error) {
        console.error("Unexpected exception in dcapal-optimizer:", error);
        return null;
      }
    };

    const solve = async () => {
      const sol = await launchSolver();
      setIsLoading(false);
      if (sol) {
        setSolution(sol);
      }
    };

    solve();
  }, []);

  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  const onClickTaxEfficient = () => {
    setUseTaxEfficient(!useTaxEfficient);
  };

  const onClickWholeShares = () => {
    setUseWholeShares(!useWholeShares);
  };

  const onClickUseAllBudget = () => {
    setUseAllBudget(!useAllBudget);
  };

  const onClickGoBack = () => {
    dispatch(setAllocationFlowStep({ step: Step.PORTFOLIO }));
  };

  const onClickRunAllocation = () => {
    dispatch(setBudget({ budget: cash }));
    dispatch(setAllocationFlowStep({ step: Step.END }));
  };

  const isRunAllocationDisabled = cash + totalAmount <= 0;

  let i18nKey = "";

  if (totalAmount !== 0) {
    if (solution === null && isLoading) {
      i18nKey = "investStep.loading";
    } else if (Number(solution) !== 0) {
      i18nKey = "investStep.youShouldAllocateAmount";
    } else {
      i18nKey = "investStep.youAlreadyReachedTargetAllocation";
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mt-2 mb-8 text-3xl font-light">
        {t("investStep.howMuchAllocate")}
      </div>
      <div className="w-full flex justify-center items-end">
        <div className="w-full">
          <InputNumber
            textSize="4rem"
            textAlign="text-right"
            type={InputNumberType.DECIMAL}
            value={cash}
            onChange={setCash}
            isValid={true}
            min={0}
            leadingNone={true}
          />
        </div>
        <div className="ml-2 pb-2 text-2xl font-light uppercase">
          {quoteCcy}
        </div>
      </div>
      <div className="mt-2 text-xl font-light">
        <Trans
          i18nKey={i18nKey}
          values={{
            solution:
              Number(solution) !== 0
                ? (+Number(solution).toFixed(amtDecimals)).toLocaleString()
                : solution,
            quoteCcy: String(quoteCcy),
          }}
          components={[
            <span className="font-medium" />,
            <span className="uppercase" />,
          ]}
        />
        {Number(solution) !== 0 ? (
          <>
            <button
              onClick={handleButtonClick}
              style={{ textDecoration: "underline", marginRight: "0.5rem" }}
            >
              {t("investStep.clickHere")}
            </button>
            <span>{t("investStep.toInsertAmount")}</span>
          </>
        ) : null}
      </div>

      <div className="w-full flex flex-col gap-4 mt-20">
        <p className="text"></p>
        <div className="w-full flex flex-col gap-1 justify-start">
          <div
            className="w-full flex items-center cursor-pointer"
            onClick={onClickTaxEfficient}
          >
            <input
              id="tax-efficient-checkbox"
              type="checkbox"
              className="w-4 h-4 accent-neutral-500 cursor-pointer"
              checked={useTaxEfficient}
              onChange={onClickTaxEfficient}
            />
            <label
              htmlFor="#tax-efficient-checkbox"
              className="ml-2 cursor-pointer select-none"
            >
              <Trans
                i18nKey="investStep.taxEfficientAlgorithm"
                values={{
                  tax: t("investStep.taxEfficient"),
                }}
                components={[<span className="font-medium capitalize" />]}
              />
            </label>
          </div>
          <p className="text-sm font-light">
            <Trans
              i18nKey="investStep.taxEfficientInfo"
              values={{
                tax: t("investStep.taxEfficient"),
              }}
              components={[<span className="italic capitalize" />]}
            />
          </p>
        </div>
        <div className="w-full flex flex-col gap-1 justify-start">
          <div
            className="w-full flex items-center cursor-pointer"
            onClick={onClickUseAllBudget}
          >
            <input
              id="tax-efficient-checkbox"
              type="checkbox"
              className="w-4 h-4 accent-neutral-500 cursor-pointer"
              checked={useAllBudget}
              onChange={onClickUseAllBudget}
            />
            <label
              htmlFor="#tax-efficient-checkbox"
              className="ml-2 cursor-pointer select-none"
            >
              {t("investStep.allocate")}{" "}
              <span className="font-medium capitalize">
                {t("investStep.allBudget")}
              </span>
            </label>
          </div>
          <p className="text-sm font-light">
            <Trans
              i18nKey="investStep.allocateAllBudgetInfo"
              values={{
                message:
                  t("investStep.allocate") + " " + t("investStep.allBudget"),
              }}
              components={[<span className="italic capitalize" />]}
            />
          </p>
        </div>
        <div className="w-full flex flex-col gap-1 justify-start">
          <div
            className="w-full flex items-center cursor-pointer"
            onClick={onClickWholeShares}
          >
            <input
              id="tax-efficient-checkbox"
              type="checkbox"
              className="w-4 h-4 accent-neutral-500 cursor-pointer"
              checked={!useWholeShares}
              onChange={onClickWholeShares}
            />
            <label
              htmlFor="#tax-efficient-checkbox"
              className="ml-2 cursor-pointer select-none"
            >
              <Trans
                i18nKey="investStep.useFractionalShares"
                values={{
                  fractionalShares: t("investStep.fractionalShares"),
                }}
                components={[<span className="font-medium capitalize" />]}
              />
            </label>
          </div>
          <p className="text-sm font-light">
            <Trans
              i18nKey="investStep.useFractionalSharesInfo"
              values={{
                message: t("investStep.fractionalShares"),
              }}
              components={[<span className="italic capitalize" />]}
            />
          </p>
        </div>
      </div>

      <div className="w-full mt-6 flex items-center justify-between">
        <span
          className="font-medium underline cursor-pointer"
          onClick={onClickGoBack}
        >
          {t("common.goBack")}{" "}
        </span>
        <button
          className="px-3 pt-1.5 pb-2 flex justify-center items-center bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-800 text-white text-lg rounded-md shadow-md disabled:pointer-events-none disabled:opacity-60"
          onClick={onClickRunAllocation}
          disabled={isRunAllocationDisabled}
        >
          {t("investStep.runAllocation")}{" "}
        </button>
      </div>
    </div>
  );
};
