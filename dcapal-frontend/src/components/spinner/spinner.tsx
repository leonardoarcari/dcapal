import React from "react";
import "./spinner.css";

export const Spinner = ({ width = "80px", height = "80px" }) => (
  <div className="lds-ripple" style={{ width: width, height: height }}>
    <div></div>
    <div></div>
  </div>
);
