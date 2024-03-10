import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Step, setAllocationFlowStep } from "@app/appSlice";
import { EndStep } from "./steps/end/index.jsx";
import { ImportStep } from "./steps/importFile.jsx";
import { InvestStep } from "./steps/invest.jsx";
import { PortfolioStep } from "./steps/portfolio/index.jsx";
import { PortfoliosStep } from "./steps/portfolios/index.jsx";

export const AllocationFlow = () => {
  const step = useSelector((state) => state.app.allocationFlowStep);
  const selectedPfolio = useSelector((state) => state.pfolio.selected);

  const [useTaxEfficient, setUseTaxEfficient] = useState(true);
  const [useWholeShares, setUseWholeShares] = useState(true);
  const [useAllBudget, setUseAllBudget] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (step >= Step.PORTFOLIO && !selectedPfolio) {
      dispatch(setAllocationFlowStep({ step: Step.PORTFOLIOS }));
    }
    window.scrollTo(0, 0); // Reset scroll position on step change
  }, [step]);

  if (step <= Step.PORTFOLIOS) {
    return <PortfoliosStep />;
  } else if (step === Step.IMPORT) {
    return <ImportStep />;
  } else if (step === Step.PORTFOLIO) {
    return <PortfolioStep />;
  } else if (step === Step.INVEST) {
    return (
      <InvestStep
        useTaxEfficient={useTaxEfficient}
        useWholeShares={useWholeShares}
        useAllBudget={useAllBudget}
        setUseTaxEfficient={setUseTaxEfficient}
        setUseWholeShares={setUseWholeShares}
        setUseAllBudget={setUseAllBudget}
      />
    );
  } else if (step === Step.END) {
    return (
      <EndStep
        useTaxEfficient={useTaxEfficient}
        useAllBudget={useAllBudget}
        useWholeShares={useWholeShares}
      />
    );
  }
};
