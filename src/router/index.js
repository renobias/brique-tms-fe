import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import ListCategoryMasterPage from "../pages/master/category/list";
import React from "react";
import ListFormPage from "../pages/form/list";

export const Router = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <ListFormPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/home",
      element: <HomePage />,
    },
    {
      path: "/form/list",
      element: <ListFormPage />,
    },
    {
      path: "/master/category",
      element: <ListCategoryMasterPage />,
    },
    //   {
    //     path: "*",
    //     element: <NotFoundPage />,
    //   },
  ]);
  return element;
};
