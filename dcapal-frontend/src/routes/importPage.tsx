import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { setAllocationFlowStep, setPfolioFile, Step } from "@app/appSlice.js";
import { Spinner } from "@components/spinner/spinner.jsx";
import { useFetchImportedPortfolio } from "@hooks/useFetchImportedPortfolio.jsx";

import IMPORT_PORTFOLIO_SVG from "@images/headers/import-portfolio.svg";

const navigateToPortfolios = (portfolio, step, dispatch, navigate) => {
  dispatch(setPfolioFile({ file: portfolio ? JSON.stringify(portfolio) : "" }));
  dispatch(setAllocationFlowStep({ step: step }));
  navigate("/allocate");
};

export default function ImportPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const searchParams = new URLSearchParams(location.search);
  const portfolioId = searchParams.get("p");

  const [portfolio, isLoading] = useFetchImportedPortfolio(portfolioId);

  useEffect(() => {
    if (isLoading) return;

    if (!portfolio) {
      navigateToPortfolios(null, Step.PORTFOLIOS, dispatch, navigate);
    } else {
      navigateToPortfolios(portfolio, Step.IMPORT, dispatch, navigate);
    }
  }, [portfolio, isLoading]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-6 py-10 flex flex-col grow justify-center items-center text-center gap-8">
        <img
          className="w-full px-4 sm:max-w-[20rem] pb-2"
          alt="Import Portfolio"
          src={IMPORT_PORTFOLIO_SVG}
        />
        <h1 className="text-3xl font-bold">
          {t("importStep.importPortfolio")}
        </h1>
        <span className="flex flex-col gap-y-2 items-center font-light">
          <p>{t("importStep.fetchData")}...</p>
        </span>
        <Spinner />
      </div>
    </div>
  );
}
