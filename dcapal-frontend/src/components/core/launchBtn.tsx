import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAllocationFlowStep, setPfolioFile, Step } from "@app/appSlice.js";
import { useTranslation } from "react-i18next";

export const LaunchBtn = () => {
  const inputPfolio = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const onClickUpload = () => {
    if (inputPfolio.current) {
      inputPfolio.current.click();
    }
  };

  const onChangeInputPfolio = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (event) {
        dispatch(setPfolioFile({ file: event.target.result }));
        dispatch(setAllocationFlowStep({ step: Step.IMPORT }));
        navigate("/allocate");
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const onClickStart = () => {
    dispatch(setPfolioFile({ file: "" }));
    dispatch(setAllocationFlowStep({ step: Step.PORTFOLIOS }));
    navigate("/allocate");
  };

  return (
    <div className="w-full max-w-[26rem] flex flex-wrap-reverse sm:flex-wrap gap-x-4 gap-y-3 justify-center">
      <div className="min-w-full sm:min-w-0">
        <button
          className="w-full px-3 py-2 flex justify-center items-center border border-neutral-500 hover:bg-neutral-600 active:bg-neutral-800 text-black hover:text-white text-lg rounded"
          onClick={onClickUpload}
        >
          {t("importStep.importPortfolio")}
        </button>
        <input
          style={{ display: "none" }}
          type="file"
          accept=".json"
          ref={inputPfolio}
          onChange={onChangeInputPfolio}
        />
      </div>
      <button
        data-testid="importStep.allocateYourSavings"
        className="min-w-full sm:min-w-0 px-3 py-2 flex justify-center items-center bg-neutral-500 hover:bg-neutral-600 active:bg-neutral-800 text-white text-lg rounded"
        onClick={onClickStart}
      >
        {t("importStep.allocateYourSavings")}
      </button>
    </div>
  );
};
