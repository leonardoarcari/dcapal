import { useEffect, useState } from "react";

import { DCAPAL_API } from "@app/config.js";
import { api } from "@app/api.jsx";

export const useFetchImportedPortfolio = (portfolioId) => {
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!portfolioId) {
      setPortfolio(null);
      setIsLoading(false);
      return;
    }

    let ignore = false;
    fetchPortfolio(portfolioId, setPortfolio, setIsLoading, ignore);

    return () => {
      ignore = true;
    };
  }, [portfolioId]);

  return [portfolio, isLoading];
};

const fetchPortfolio = async (
  portfolioId,
  setPortfolio,
  setIsLoading,
  ignore
) => {
  const p = await fetchImportedPortfolio(portfolioId);
  if (p && !ignore) {
    setPortfolio(p);
    setIsLoading(false);
  } else {
    setPortfolio(null);
    setIsLoading(false);
  }
};

const fetchImportedPortfolio = async (id) => {
  const url = `${DCAPAL_API}/import/portfolio/${id}`;
  try {
    const response = await api.get(url);

    if (response.status != 200) {
      console.error(
        `Failed to fetch imported portfolio (${id}): {status: ${response.status}, data: ${response.data}}`
      );
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
