import React from "react";
import classNames from "classnames";

export const CcyRadio = ({ ccy, selected, setSelected, ...props }) => {
  const isSelected = selected === ccy;

  const onClick = () => {
    setSelected(ccy);
  };

  const commonClass =
    "px-3 py-2 flex justify-center items-center border hover:bg-neutral-600  hover:border-neutral-600 hover:text-white active:bg-neutral-800 active:text-white text-lg rounded-md uppercase cursor-pointer";

  const className = classNames(commonClass, {
    "border-gray-300": !isSelected,
    "bg-white": !isSelected,
    "border-gray-500": isSelected,
    "bg-neutral-500": isSelected,
    "text-white": isSelected,
  });

  return (
    <div data-testid="ccyRadio" className={className} onClick={onClick}>
      {ccy}
    </div>
  );
};
