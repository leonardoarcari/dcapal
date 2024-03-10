import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { setAllocationFlowStep, setPfolioFile, Step } from "@app/appSlice.js";

import {
  DEMO_PF_60_40,
  DEMO_PF_ALL_SEASONS,
  DEMO_PF_MR_RIP,
  DEMO_PF_HODLX,
} from "../app/config.js";
import PF_60_40 from "@demo/dcapal-60-40.json";
import PF_ALL_SEASONS from "@demo/dcapal-all-seasons.json";
import PF_MR_RIP from "@demo/dcapal-mrrip.json";
import PF_HODLX from "@demo/dcapal-hodlx.json";
import { useTranslation } from "react-i18next";

const demoPortfolios = {
  [DEMO_PF_60_40]: JSON.stringify(PF_60_40),
  [DEMO_PF_ALL_SEASONS]: JSON.stringify(PF_ALL_SEASONS),
  [DEMO_PF_MR_RIP]: JSON.stringify(PF_MR_RIP),
  [DEMO_PF_HODLX]: JSON.stringify(PF_HODLX),
};

const getPfolioFile = (path) => {
  const demoId = path
    .split("/")
    .filter((e) => e !== "")
    .pop();

  if (demoId in demoPortfolios) {
    return demoPortfolios[demoId];
  }

  return "";
};

export default function DemoPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const pfolioFile = getPfolioFile(location.pathname);

  useEffect(() => {
    if (pfolioFile && pfolioFile.length > 0) {
      dispatch(setPfolioFile({ file: pfolioFile }));
      dispatch(setAllocationFlowStep({ step: Step.IMPORT }));
    } else {
      dispatch(setPfolioFile({ file: "" }));
      dispatch(setAllocationFlowStep({ step: Step.PORTFOLIOS }));
    }

    navigate("/allocate");
  }, [pfolioFile]);

  return (
    <div className="px-6 py-10 flex flex-col grow justify-center items-center text-center gap-8">
      <h1 className="text-3xl font-bold">{t("page.demo.loadingDemo")}</h1>
    </div>
  );
}
