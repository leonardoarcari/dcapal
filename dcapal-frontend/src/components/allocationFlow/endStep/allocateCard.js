import { useMediaQuery } from "@react-hook/media-query";
import React from "react";
import { useSelector } from "react-redux";
import { MEDIA_SMALL } from "../../../app/config";

export const AllocateCard = ({
  symbol,
  name,
  amount,
  oldAmount,
  weight,
  oldWeight,
  targetWeight,
  ...props
}) => {
  const quoteCcy = useSelector((state) => state.pfolio.quoteCcy);
  const isMobile = !useMediaQuery(MEDIA_SMALL);

  const priceFmt = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const weightFmt = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  };

  const diffAmount = (amount || 0) - (oldAmount || 0);
  const diffSign = diffAmount > 0 ? "+" : "";
  const diffAmountTxt = diffAmount.toLocaleString("en-US", priceFmt);

  const bgColor =
    diffAmount > 0
      ? "bg-green-700"
      : diffAmount < 0
      ? "bg-red-300"
      : "bg-neutral-500";
  const textColor =
    diffAmount > 0
      ? "text-green-50"
      : diffAmount < 0
      ? "text-red-800"
      : "text-white";
  const diffAmountClass = `ml-4 py-1 px-2 whitespace-nowrap ${bgColor} ${textColor} font-semibold rounded-md`;

  return (
    <div className="w-full max-w-[36rem] flex flex-col my-1 first:mt-0 px-3 pt-2 pb-3 shadow-md ring-1 ring-black/5 rounded-md bg-white">
      <div className="mb-2 flex justify-between items-center">
        <div className="min-w-0 flex flex-col">
          <div className="text-lg truncate font-medium capitalize" title={name}>
            {name}
          </div>
          <div className="text-sm font-light uppercase">{symbol}</div>
        </div>
        <div className={diffAmountClass}>
          <span className="mr-1">{diffSign}</span>
          {diffAmountTxt}
          <span className="ml-1 uppercase">{quoteCcy}</span>
        </div>
      </div>
      {isMobile && (
        <div className="flex flex-col justify-between items-start">
          <div className="w-full flex items-center justify-between">
            <div className="min-w-[5.5rem] mr-2 font-light text-xs">Amount</div>
            <span className="uppercase">
              {amount.toLocaleString("en-US", priceFmt)} {quoteCcy}
            </span>
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="min-w-[5.5rem] mr-2 font-light text-xs">Weight</div>
            <span>{weight.toLocaleString("en-US", weightFmt)} %</span>
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="min-w-[5.5rem] mr-2 font-light text-xs">
              Target weight
            </div>
            <div>{targetWeight.toLocaleString("en-US", weightFmt)} %</div>
          </div>
        </div>
      )}
      {!isMobile && (
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center">
              <div className="min-w-[4.5rem] mr-2 font-light text-xs">
                Weight
              </div>
              <span>{weight.toLocaleString("en-US", weightFmt)} %</span>
            </div>
            <div className="flex items-center">
              <div className="min-w-[4.5rem] mr-2 font-light text-xs">
                Amount
              </div>
              <span className="uppercase">
                {amount.toLocaleString("en-US", priceFmt)} {quoteCcy}
              </span>
            </div>
          </div>
          <div className="flex items-center mr-2">
            <div className="mr-2 font-light text-xs">Target weight</div>
            <div>{targetWeight.toLocaleString("en-US", weightFmt)} %</div>
          </div>
        </div>
      )}
    </div>
  );
};
