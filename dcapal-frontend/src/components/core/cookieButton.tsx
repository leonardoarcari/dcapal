import React from "react";

export const CookieButton = () => {
  return (
    <button
      type="button"
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        top: "unset",
        zIndex: 3147483649,
        backgroundColor: "#ccc",
        padding: "5px 5px 0",
        borderTopLeftRadius: "0.5rem",
      }}
      data-cc="c-settings"
      onClick={() => {
        window.CC.showSettings(0);
      }}
    >
      🍪
    </button>
  );
};
