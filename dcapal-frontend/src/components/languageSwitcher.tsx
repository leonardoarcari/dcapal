import React from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <select
      className="pl-3 pr-1.5 py-2 border focus-visible:outline-1 rounded-md text-center border-gray-300 hover:border-gray-500 focus-visible:outline-gray-600 leading-normal"
      value={i18n.resolvedLanguage}
      onChange={(e) => {
        const newLang = e.target.value;
        i18n.changeLanguage(newLang);
      }}
    >
      <option value="en"> {t("language.en")} </option>
      <option value="it"> {t("language.it")} </option>
    </select>
  );
}
export default LanguageSwitcher;
