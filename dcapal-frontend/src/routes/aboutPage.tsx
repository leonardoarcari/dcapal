import GitHubButton from "react-github-btn";

import { Trans, useTranslation } from "react-i18next";
import { ContainerPage } from "./containerPage";

import ME from "@images/headers/me.jpg";
import GITHUB from "@images/social/github.svg";
import LINKEDIN from "@images/social/linkedin.svg";
import TELEGRAM from "@images/social/telegram.svg";
import TWITTER from "@images/social/twitter.svg";
import YOUTUBE from "@images/social/youtube.svg";

const SocialBar = () => {
  return (
    <div className="flex gap-1 items-center justify-center">
      <a href="https://github.com/leonardoarcari">
        <img
          className="w-full max-w-[1.75rem] mr-[2px]"
          alt="Github logo"
          src={GITHUB}
        />
      </a>
      <a href="https://www.linkedin.com/in/leonardoarcari/">
        <img
          className="w-full max-w-[2rem]"
          alt="Linkedin logo"
          src={LINKEDIN}
        />
      </a>
      <a href="https://twitter.com/arcari_leonardo">
        <img className="w-full max-w-[2rem]" alt="Twitter logo" src={TWITTER} />
      </a>
      <a href="https://www.youtube.com/@leonardoarcari3011">
        <img className="w-full max-w-[2rem]" alt="Youtube logo" src={YOUTUBE} />
      </a>
      <a href="https://t.me/leonardoarcari">
        <img
          className="w-full max-w-[2rem]"
          alt="Telegram logo"
          src={TELEGRAM}
        />
      </a>
    </div>
  );
};

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <ContainerPage
      id={"social-profiles"}
      title={"About"}
      content={
        <>
          <div className="w-full flex flex-col items-center gap-4 px-6 py-6 bg-[#ededed]">
            <h1 className="mb-8 text-3xl sm:text-4xl font-bold">
              {t("page.about.title")}
            </h1>
            <img
              className="w-full max-w-[15rem] rounded-full border border-neutral-700/20 shadow-md"
              alt="Social logo"
              src={ME}
            />
            <SocialBar />
          </div>
          <div className="w-full max-w-[44rem] p-6 flex flex-col items-center gap-6">
            <div className="w-full flex flex-col gap-4 text-justify font-light text-lg">
              <p>
                <Trans
                  i18nKey="page.about.presentation1"
                  values={{
                    person: t("page.about.iAmLeo"),
                  }}
                  components={[<span className="font-normal" />]}
                />
              </p>
              <p>
                <Trans
                  i18nKey="page.about.presentation2"
                  values={{
                    tool: t("page.about.pragmaticTool"),
                  }}
                  components={[<span className="font-normal" />]}
                />
              </p>
              <p>
                {t("page.about.commonProblem")}{" "}
                <span className="italic">
                  {t("page.about.questionPresentation")}
                </span>
              </p>
              <p>
                <Trans
                  i18nKey="page.about.motivation"
                  values={{
                    algorithm: t(
                      "page.about.letTheAlgorithmDoTheSplittingForYou"
                    ),
                  }}
                  components={[<span className="font-normal" />]}
                />
                .
              </p>
              <p>{t("page.about.exportPortfolio")}</p>
            </div>
            <div
              id="privacy-policy"
              className="w-full flex flex-col gap-2 text-justify font-light text-lg"
            >
              <h2 className="w-full text-3xl font-semibold mt-4 mb-2">
                {t("page.about.privacyPolicyTitle")}
              </h2>
              <Trans
                i18nKey="page.about.privacyPolicyMessageTotal"
                values={{
                  part1: t("page.about.privacyPolicyMessage1"),
                  part2: t("page.about.privacyPolicyMessage2"),
                  part3: t("page.about.privacyPolicyMessage3"),
                }}
                components={[<p />, <p />, <p />]}
              />
            </div>
            <div
              id="feedback"
              className="w-full flex flex-col gap-2 text-justify font-light text-lg"
            >
              <h2 className="w-full text-3xl font-semibold mt-4 mb-2">
                {t("page.about.feedback")}
              </h2>
              <p>
                <Trans
                  i18nKey="page.about.feedbackMessage"
                  values={{
                    feelFree: t("page.about.feelFreeReachOut"),
                    socialProfiles: t("page.about.socialProfiles"),
                  }}
                  components={[
                    <span className="font-normal" />,
                    <a className="underline" href="#social-profiles" />,
                  ]}
                />
              </p>
              <p>
                <Trans
                  i18nKey="page.about.fellowDev"
                  components={{
                    alignSuper1: <span className="align-super" />,
                    githubStar: (
                      <GitHubButton
                        href="https://github.com/leonardoarcari/dcapal"
                        data-icon="octicon-star"
                        data-size="large"
                        aria-label="Star leonardoarcari/dcapal on GitHub"
                      />
                    ),
                    alignSuper2: <span className="align-super" />,
                    githubLink: (
                      <a
                        className="underline"
                        href="https://github.com/leonardoarcari/dcapal"
                      />
                    ),
                    githubIssue: (
                      <GitHubButton
                        href="https://github.com/leonardoarcari/dcapal/issues"
                        data-icon="octicon-issue-opened"
                        data-size="large"
                        aria-label="Issue leonardoarcari/dcapal on GitHub"
                      />
                    ),
                    alignSuper3: <span className="align-super" />,
                  }}
                />
              </p>
              <p>{t("page.about.everyContribution")}</p>
            </div>
          </div>
        </>
      }
    />
  );
}
