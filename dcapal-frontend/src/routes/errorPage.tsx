import React from "react";

import { useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ContainerPage } from "./containerPage";

export default function ErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();
  console.error(error);

  return (
    <ContainerPage
      title={"Error"}
      content={
        <div className="flex flex-col grow justify-center items-center gap-10 text-center">
          <h1 className="text-4xl font-bold">{t("page.error.ops")}</h1>
          <p>{t("page.error.errorHasOccurred")}</p>
          <p className="font-light">
            <i>{error.statusText || error.message}</i>
          </p>
        </div>
      }
    />
  );
}
