import { LaunchBtn } from "@components/core/launchBtn";
import { RootCard } from "@components/core/rootCard";
import { Trans, useTranslation } from "react-i18next";
import { ContainerPage } from "./containerPage";

import INVESTING_FRONT from "@images/headers/investing_front.svg";
import ICON_AMOUNT from "@images/icons/amount.svg";
import ICON_MARKET from "@images/icons/market.svg";
import ICON_PORTFOLIO from "@images/icons/portfolio.svg";
import ICON_REBALANCE from "@images/icons/rebalance.svg";

export const Root = () => {
  const { t } = useTranslation();
  return (
    <ContainerPage
      title={"DcaPal - A smart assistant for your periodic investments"}
      content={
        <>
          <div className="w-full px-6 py-8 mb-8 bg-[#ededed]">
            <div className="flex flex-col items-center gap-y-7">
              <div className="w-full max-w-[35rem] flex flex-col items-start gap-y-7">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  {t("page.root.title1")}
                </h1>
                <p className="text-xl sm:text-2xl font-light">
                  {t("page.root.subtitle1")}
                </p>
              </div>
              <img
                className="w-full px-4 sm:max-w-[26rem]"
                alt="Investing front"
                src={INVESTING_FRONT}
              />
              <LaunchBtn />
            </div>
          </div>
          <div className="w-full max-w-[38rem] px-4 flex flex-col gap-y-5 text-center">
            <h2 className="w-full text-3xl font-semibold">
              {t("page.root.title2")}
            </h2>
            <span className="w-full flex flex-col text-xl font-light gap-y-2">
              <Trans
                i18nKey="page.root.subtitle2"
                components={{
                  p1: <p />,
                  p2: <p />,
                  p3: <p />,
                  it: <span className="italic" />,
                }}
              />
            </span>
          </div>
          <div
            id="allocate-process"
            className="w-full max-w-[25rem] px-4 pt-8 flex flex-col gap-y-6"
          >
            <RootCard
              imgSrc={ICON_PORTFOLIO}
              text={
                <Trans
                  i18nKey="page.root.cardStep1"
                  components={{
                    p1: <p />,
                    bold: <span className="font-normal" />,
                  }}
                />
              }
            />
            <RootCard
              imgSrc={ICON_AMOUNT}
              text={
                <Trans
                  i18nKey="page.root.cardStep2"
                  components={{
                    p1: <p />,
                    bold: <span className="font-normal" />,
                  }}
                />
              }
            />
            <RootCard
              id={"tax-efficient"}
              imgSrc={ICON_REBALANCE}
              text={
                <Trans
                  i18nKey="page.root.cardStep3"
                  components={{
                    p1: <p />,
                    bold1: <span className="font-normal" />,
                    bold2: <span className="font-normal" />,
                  }}
                />
              }
            />
            <RootCard
              imgSrc={ICON_MARKET}
              text={
                <Trans
                  i18nKey="page.root.cardStep4"
                  components={{
                    p1: <p />,
                    bold: <span className="font-normal" />,
                  }}
                />
              }
            />
          </div>
          <div className="w-full px-6 py-8 mt-10 bg-[#ededed]">
            <div className="flex flex-col items-center gap-y-7 text-center">
              <div className="w-full max-w-[35rem] flex flex-col gap-y-4">
                <Trans
                  i18nKey="page.root.getStart"
                  components={{
                    p1: <p className="text-3xl font-semibold" />,
                    p2: <p className="text-xl font-light" />,
                    p3: <p className="text-xl font-light" />,
                  }}
                />
              </div>
              <LaunchBtn />
            </div>
          </div>
        </>
      }
    ></ContainerPage>
  );
};
