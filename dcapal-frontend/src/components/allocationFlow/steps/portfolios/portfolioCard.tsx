import { useState } from "react";
import { useTranslation } from "react-i18next";
import { InputText } from "../../../core/inputText.jsx";
import { useDispatch } from "react-redux";
import {
  deletePortfolio,
  duplicatePortfolio,
  renamePortfolio,
  selectPortfolio,
} from "../../portfolioSlice.jsx";
import { Step, setAllocationFlowStep } from "@app/appSlice.js";

import EDIT_SVG from "@images//icons/edit.svg";
import CLOSE_SVG from "@images//icons/close-menu.svg";

const orderByWeightDesc = (a, b) => b.weight - a.weight;

const weightFmt = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const amtFmt = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const CardState = Object.freeze({
  VIEW: 0,
  EDIT: 10,
});

export const PortfolioCard = ({ id, name, ccy, totalAmount, assets }) => {
  const [state, setState] = useState(CardState.VIEW);
  const [newName, setNewName] = useState(name);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const onClickPortfolio = () => {
    dispatch(selectPortfolio({ id: id }));
    dispatch(setAllocationFlowStep({ step: Step.PORTFOLIO }));
  };

  const onClickEdit = () => {
    if (state === CardState.VIEW) {
      setState(CardState.EDIT);
    } else {
      setNewName(name);
      setState(CardState.VIEW);
    }
  };

  const onClickSave = () => {
    dispatch(renamePortfolio({ id: id, name: newName }));
    setState(CardState.VIEW);
  };

  const onClickDelete = () => {
    dispatch(deletePortfolio({ id: id }));
  };

  const onClickDuplicate = () => {
    dispatch(duplicatePortfolio({ id: id }));
    onClickEdit();
  };

  const editIcon = state === CardState.VIEW ? EDIT_SVG : CLOSE_SVG;

  return (
    <div className="relative w-full max-w-[36rem] flex flex-col px-3 pt-2 pb-3 shadow-md ring-1 ring-black/5 rounded-md bg-white cursor-pointer hover:ring-2 hover:ring-neutral-400 active:ring-2 active:ring-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-500">
      <div
        className="absolute flex justify-center items-center w-8 h-8 -right-4 -top-3.5 rounded-full bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-800 cursor-pointer"
        onClick={onClickEdit}
      >
        <img className="w-3/5" alt="Edit portfolio" src={editIcon} />
      </div>
      {state === CardState.VIEW && (
        <div className="w-full flex flex-col" onClick={onClickPortfolio}>
          <div className="text-lg truncate font-medium" title={name}>
            {name}
          </div>
          <p className="text-sm uppercase">
            {totalAmount.toLocaleString(i18n.language, amtFmt)} {ccy}
          </p>
          {assets.length > 0 && (
            <div className="w-full flex flex-col gap-1 max-h-32 mt-2 overflow-auto">
              {assets.sort(orderByWeightDesc).map((a) => (
                <div className="flex justify-between" key={a.symbol}>
                  <label className="min-w-0 font-light truncate">
                    {a.name}
                  </label>
                  <p className="whitespace-nowrap">
                    {a.weight.toLocaleString(i18n.language, weightFmt)} %
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {state === CardState.EDIT && (
        <div className="w-full flex flex-col">
          <div className="flex flex-col gap-1">
            <p className="pl-1 text-sm font-light">{t("common.name")}</p>
            <InputText
              value={newName}
              onChange={setNewName}
              isValid={newName}
            />
          </div>
          <div className="w-full mt-5 pl-1 flex justify-between items-center">
            <span
              className="font-medium underline cursor-pointer"
              onClick={onClickDelete}
            >
              {t("portfoliosStep.deletePortfolio")}
            </span>
            <div className="flex gap-1">
              <button
                className="px-3 pt-0.5 pb-1 flex justify-center items-center shadow-sm border focus-visible:outline-1 border-neutral-300 hover:text-white hover:bg-neutral-500 hover:border-neutral-500 active:text-white active:bg-neutral-600 focus-visible:outline-neutral-600 text-lg rounded-md disabled:pointer-events-none disabled:opacity-60"
                disabled={!newName}
                onClick={onClickDuplicate}
              >
                {t("common.duplicate")}
              </button>
              <button
                className="px-3 pt-0.5 pb-1 flex justify-center items-center shadow-sm bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-800 text-white text-lg rounded-md disabled:pointer-events-none disabled:opacity-60"
                disabled={!newName}
                onClick={onClickSave}
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
