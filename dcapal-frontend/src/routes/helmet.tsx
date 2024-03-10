import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { DCAPAL_CANONICAL } from "@app/config.js";

export const DcaPalHelmet = ({ title }) => {
  const location = useLocation();

  const titleStr = `${title} | DcaPal`;
  const pathStr = `${DCAPAL_CANONICAL}${location.pathname}`;

  return (
    <Helmet>
      <title>{titleStr}</title>
      <meta name="og:title" content={titleStr} />
      <meta name="twitter:title" content={titleStr} />
      <link rel="canonical" href={pathStr} />
      <meta name="og:url" content={pathStr} />
    </Helmet>
  );
};
