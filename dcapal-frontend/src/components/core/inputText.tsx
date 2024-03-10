import classNames from "classnames";
import React, { useEffect, useState } from "react";

const handleFocus = (event) => {
  setTimeout(() => event.target.select(), 0);
};

export const InputText = ({
  value,
  onChange,
  isValid,
  textSize,
  leadingNone,
}) => {
  const [state, setState] = useState(value || "");

  useEffect(() => {
    setState(value || "");
  }, [value]);

  const handleChange = (e) => {
    setState(e.target.value);
  };

  const handleOnBlur = (e) => {
    let newValue = e.target.value.trim();
    onChange(newValue);
  };

  return (
    <input
      style={{
        fontSize: textSize ? `${textSize}` : "unset",
      }}
      className={classNames(
        "w-full px-2 pt-1 pb-1.5 border focus-visible:outline-1 rounded-md",
        {
          "border-gray-300 hover:border-gray-500 focus-visible:outline-gray-600":
            isValid,
          "border-2 border-red-400 hover:border-red-500 focus-visible:outline-red-600 ":
            !isValid,
          "leading-none": leadingNone,
          "leading-normal": !leadingNone,
        }
      )}
      type={"text"}
      value={state}
      onChange={handleChange}
      onBlur={handleOnBlur}
      onFocus={handleFocus}
    />
  );
};
