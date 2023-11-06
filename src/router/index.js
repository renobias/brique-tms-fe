import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import React from "react";

export const Router = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
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
