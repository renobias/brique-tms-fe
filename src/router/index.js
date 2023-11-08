import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import ListCategoryMasterPage from "../pages/master/category/list";
import ListStructureFormPage from "../pages/form/structure/list";
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
    {
      path: "/form/structure",
      element: <ListStructureFormPage />,
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
