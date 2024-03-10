import { useEffect } from "react";

import "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import pluginConfig from "./cookieConfig.jsx";

export default function CookieConsent() {
  useEffect(() => {
    if (!document.getElementById("cc--main")) {
      window.CC = window.initCookieConsent();
      window.CC.run(pluginConfig);
    }
  }, []);

  return null;
}
