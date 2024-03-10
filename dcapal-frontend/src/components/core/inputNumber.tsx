import classNames from "classnames";
import React, { useEffect, useState } from "react";

export const InputNumberType = Object.freeze({
  INTEGRAL: 0,
  DECIMAL: 1,
});

const handleFocus = (event) => {
  setTimeout(() => event.target.select(), 0);
};

export const InputNumber = ({
  type,
  value,
  onChange,
  isValid,
  textAlign,
  min,
  max,
  step,
  textSize,
  leadingNone,
}) => {
  const [state, setState] = useState(value || value === 0 ? value : "");

  useEffect(() => {
    setState(value || value === 0 ? value : "");
  }, [value]);

  const handleChange = (e) => {
    setState(e.target.value);
  };

  const handleOnBlur = (e) => {
    let newValue = e.target.value;
    if (type === InputNumberType.INTEGRAL && newValue.startsWith("0")) {
      newValue = newValue.substr(1);
    }

    if (newValue === "") {
      newValue = null;
    } else if (type === InputNumberType.DECIMAL) {
      newValue = parseFloat(newValue);
    } else {
      newValue = parseInt(newValue);
    }

    if (isNaN(newValue) || newValue < min || newValue > max) {
      newValue = null;
    }

    onChange(newValue);
  };

  const className = `w-full px-2 pt-1 pb-1.5 border focus-visible:outline-1 rounded-md ${textAlign}`;
  const placeholder = type === InputNumberType.INTEGRAL ? "0" : "0.0";

  return (
    <input
      style={{
        fontSize: textSize ? `${textSize}` : "unset",
      }}
      className={classNames(className, {
        "border-gray-300 hover:border-gray-500 focus-visible:outline-gray-600":
          isValid,
        "border-2 border-red-400 hover:border-red-500 focus-visible:outline-red-600 ":
          !isValid,
        "leading-none": leadingNone,
        "leading-normal": !leadingNone,
      })}
      placeholder={placeholder}
      type={"number"}
      value={state}
      onChange={handleChange}
      onBlur={handleOnBlur}
      onFocus={handleFocus}
      min={min}
      max={max}
      step={step ? step : "any"}
    />
  );
};
