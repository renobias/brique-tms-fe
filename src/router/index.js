import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import HomePage from "../pages/home";

import React from "react";

export const Router = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/home",
      element: <HomePage />,
    },
    //   {
    //     path: "*",
    //     element: <NotFoundPage />,
    //   },
  ]);
  return element;
};
