import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";

import { AllocationFlow } from "@components/allocationFlow";
import { setCurrencies } from "./appSlice.js";
import { fetchAssetsDcaPal } from "./providers.js";
import { ContainerPage } from "@routes/containerPage";

const loadCurrencies = async (dispatch) => {
  const res = await fetchAssetsDcaPal("fiat");
  const ccys = res.map((c) => c.symbol);

  dispatch(setCurrencies({ currencies: ccys }));
};

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    loadCurrencies(dispatch);
  }, []);

  return (
    <ContainerPage
      title={"Allocate"}
      content={
        <>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              success: {
                duration: 5000,
                iconTheme: { primary: "#166534", secondary: "#f0fdf4" },
              },
            }}
          />
          <div className="absolute bg-[#ededed] w-full h-[50px] top-10 -z-40" />
          <div className="absolute app-bg -z-50" />
          <div className="flex-grow w-full flex flex-col items-center">
            <div className="w-full max-w-[42rem] grow flex px-6 pt-4 pb-6">
              <AllocationFlow />
            </div>
          </div>
        </>
      }
    />
  );
};
