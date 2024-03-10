import React from "react";
import { CcyRadio } from "./ccyRadio.jsx";

export const CcyGroup = ({ ccys, selected, setSelected, ...props }) => (
  <div data-testid="ccyGroup" className="flex flex-wrap gap-2">
    {ccys.map((c) => (
      <CcyRadio key={c} ccy={c} selected={selected} setSelected={setSelected} />
    ))}
  </div>
);
