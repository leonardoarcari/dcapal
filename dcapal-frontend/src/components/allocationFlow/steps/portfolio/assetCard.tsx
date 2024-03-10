import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@react-hook/media-query";

import { InputNumber, InputNumberType } from "../../../core/inputNumber.jsx";
import {
  currentPortfolio,
  isWholeShares,
  removeAsset,
} from "../../portfolioSlice.jsx";
import { MEDIA_SMALL } from "@app/config.js";
import { useCollapse } from "react-collapsed";
import classNames from "classnames";
import { TransactionFees } from "./transactionFees.jsx";
import { useTranslation } from "react-i18next";

import CLOSE_SVG from "@images/icons/close-menu.svg";

export const AssetCard = ({
  symbol,
  name,
  aclass,
  price,
  qty,
  weight,
  targetWeight,
  isValidTargetWeight,
  ...props
}) => {
  const { t, i18n } = useTranslation();
  const quoteCcy = useSelector((state) => currentPortfolio(state).quoteCcy);
  const dispatch = useDispatch();
  const isMobile = !useMediaQuery(MEDIA_SMALL);
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  const priceFmt = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const onClickDelete = () => {
    dispatch(removeAsset({ symbol: symbol }));
  };

  return (
    <div className="relative w-full max-w-[36rem] flex flex-col my-2 first:mt-0 px-3 pt-2 pb-3 shadow-md ring-1 ring-black/5 rounded-md bg-white">
      <div
        className="absolute flex justify-center items-center w-8 h-8 -right-4 -top-3.5 rounded-full bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-800 cursor-pointer"
        onClick={onClickDelete}
      >
        <img className="w-3/5" alt="Remove asset" src={CLOSE_SVG} />
      </div>
      <div className="mb-2 flex items-center justify-between">
        <div className="min-w-0 flex flex-col">
          <div className="text-lg truncate font-medium capitalize" title={name}>
            {name}
          </div>
          <div className="text-sm font-light uppercase">{symbol}</div>
        </div>
        <div className="grow flex items-center justify-end">
          {!isMobile && (
            <div className="flex ml-4">
              <div className="font-medium">
                {(price * qty).toLocaleString(i18n.language, priceFmt)}
              </div>
              <div className="ml-1 uppercase">{quoteCcy}</div>
            </div>
          )}
          <div className="whitespace-nowrap ml-4 py-1 px-2 bg-green-800 text-green-50 font-semibold rounded-md">
            {weight.toLocaleString(i18n.language, {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}{" "}
            %
          </div>
        </div>
      </div>
      {isMobile && (
        <div className="flex flex-col">
          <div className="flex items-center py-2">
            <div className="min-w-[6rem] max-w-[6rem] mr-2 font-light text-xs">
              {t("assetCard.amount")}
            </div>
            <div className="uppercase text-sm">{quoteCcy}</div>
            <div className="ml-1 text-sm">
              {(price * qty).toLocaleString(i18n.language, priceFmt)}
            </div>
          </div>
          <div className="flex items-center py-2">
            <div className="min-w-[6rem] max-w-[6rem] mr-2 font-light text-xs">
              {t("assetCard.price")}
            </div>
            <div className="uppercase text-sm">{quoteCcy}</div>
            <div className="ml-1 text-sm">
              {price.toLocaleString(i18n.language, priceFmt)}
            </div>
          </div>
          <div className="flex items-center h-12">
            <div className="min-w-[6rem] max-w-[6rem] mr-2 font-light text-xs">
              {t("assetCard.quantity")}
            </div>
            <div className="grow">
              <InputNumber
                textAlign={"text-right"}
                type={
                  isWholeShares(aclass)
                    ? InputNumberType.INTEGRAL
                    : InputNumberType.DECIMAL
                }
                value={qty}
                onChange={props.setQty}
                isValid={true}
                min={0}
              />
            </div>
          </div>
          <div className="flex items-center h-12">
            <div className="min-w-[6rem] max-w-[6rem] font-light text-xs">
              {t("assetCard.targetWeight")} (%)
            </div>
            <div className="grow ml-2">
              <InputNumber
                textAlign={"text-right"}
                type={InputNumberType.DECIMAL}
                value={targetWeight}
                onChange={props.setTargetWeight}
                isValid={isValidTargetWeight}
                min={0}
                max={100}
              />
            </div>
          </div>
        </div>
      )}
      {!isMobile && (
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center h-12">
              <div className="w-12 mr-2 font-light text-xs">
                {t("assetCard.quantity")}
              </div>
              <div className="w-40">
                <InputNumber
                  textAlign={"text-left"}
                  type={
                    isWholeShares(aclass)
                      ? InputNumberType.INTEGRAL
                      : InputNumberType.DECIMAL
                  }
                  value={qty}
                  onChange={props.setQty}
                  isValid={true}
                  min={0}
                />
              </div>
            </div>
            <div className="flex items-center h-6">
              <div className="w-12 mr-2 font-light text-xs">
                {t("assetCard.price")}
              </div>
              <div className="uppercase text-sm">{quoteCcy}</div>
              <div className="ml-1 text-sm">
                {price.toLocaleString(i18n.language, priceFmt)}
              </div>
            </div>
          </div>
          <div className="flex items-center mr-2 h-12">
            <div className="font-light text-xs">
              {t("assetCard.targetWeight")}
            </div>
            <div className="w-28 ml-2">
              <InputNumber
                textAlign={"text-right"}
                type={InputNumberType.DECIMAL}
                value={targetWeight}
                onChange={props.setTargetWeight}
                isValid={isValidTargetWeight}
                min={0}
                max={100}
                step=".000001"
              />
            </div>
            <div className="ml-1">%</div>
          </div>
        </div>
      )}
      <div className="w-full mt-4 flex flex-col gap-3">
        <div
          className="flex gap-1 items-center font-light text-xs"
          {...getToggleProps()}
        >
          <span
            className={classNames("transition-transform", {
              "rotate-90": isExpanded,
            })}
          >
            {">"}
          </span>
          <span>{t("assetCard.transactionFees")}</span>
        </div>
        <div
          className="w-full flex flex-col gap-1 justify-start text-sm"
          {...getCollapseProps()}
        >
          <TransactionFees asset={symbol} />
        </div>
      </div>
    </div>
  );
};
