import UNDER_CONSTRUCTION from "@images/headers/under-construction.svg";

import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { ContainerPage } from "./containerPage";

export default function UnderConstructionPage() {
  const { t } = useTranslation();
  return (
    <ContainerPage
      title={"Docs"}
      content={
        <div className="px-6 py-10 flex flex-col grow justify-center items-center text-center gap-8">
          <img
            className="w-full px-4 sm:max-w-[35rem] pb-2"
            alt="Under construction"
            src={UNDER_CONSTRUCTION}
          />
          <h1 className="text-3xl font-bold">
            {t("page.underConstruction.title")}
          </h1>
          <Trans
            i18nKey="page.underConstruction.message"
            components={{
              container: (
                <span className="flex flex-col gap-y-2 items-center font-light" />
              ),
              p1: <p />,
              p2: <p />,
              underlineLink: <span className="underline" />,
              linkHome: <Link to={"/"} />,
            }}
          />
        </div>
      }
    />
  );
}
