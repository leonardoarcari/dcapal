import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full px-12 pt-7 pb-10 flex flex-col gap-y-4 justify-between items-center bg-[#333333] text-white font-light">
      <div className="w-full flex flex-wrap gap-x-5 gap-y-2 justify-center text-xs">
        <a href="https://raw.githubusercontent.com/leonardoarcari/dcapal/master/LICENSE">
          {t("about.terms")}
        </a>
        <Link to={"/about#privacy-policy"}>{t("about.privacy")}</Link>
        <Link to={"/about#social-profiles"}>{t("about.contacts")}</Link>
        <Link to={"/docs"}>{t("about.docs")}</Link>
        <Link to={"/about"}>{t("about.about")}</Link>
        <a href="https://github.com/leonardoarcari/dcapal">Github</a>
      </div>
      <p className="text-xs text-white/70">
        © {new Date().getFullYear().toString()} Leonardo Arcari
      </p>
    </footer>
  );
};
