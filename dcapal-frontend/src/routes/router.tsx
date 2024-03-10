import { useRoutes } from "react-router-dom";
import { App } from "@app/index";

import AboutPage from "./aboutPage.jsx";
import DemoPage from "./demoPage.jsx";
import ErrorPage from "./errorPage.jsx";
import ImportPage from "./importPage.jsx";
import NotFoundPage from "./notFoundPage.jsx";
import { Root } from "./root";
import UnderConstructionPage from "./underConstruction";

import {
  DEMO_PF_60_40,
  DEMO_PF_ALL_SEASONS,
  DEMO_PF_MR_RIP,
  DEMO_PF_HODLX,
} from "../app/config";

export const Router = () => {
  let routesConfig = [
    {
      path: "*",
      element: <NotFoundPage />,
    },
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
    },
    {
      path: "allocate",
      element: <App />,
      errorElement: <ErrorPage />,
    },
    {
      path: "about",
      element: <AboutPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "docs",
      element: <UnderConstructionPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "import",
      element: <ImportPage />,
      errorElement: <ErrorPage />,
    },
  ];

  const demoRoutes = [
    DEMO_PF_60_40,
    DEMO_PF_ALL_SEASONS,
    DEMO_PF_MR_RIP,
    DEMO_PF_HODLX,
  ];
  for (const route of demoRoutes) {
    routesConfig.push({
      path: `demo/${route}`,
      element: <DemoPage />,
      errorElement: <ErrorPage />,
    });
  }

  return useRoutes(routesConfig);
};
