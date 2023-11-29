import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import ListCategoryMasterPage from "../pages/master/category/list";
import CreateCategoriesMasterPage from "../pages/master/category/create";
import EditCategoriesMasterPage from "../pages/master/category/edit";
import ListFieldDynamicPage from "../pages/field-dynamic/list";
import ListFieldSelectionFetchPage from "../pages/field-selection-fetch/list";
import React from "react";
import ListFormPage from "../pages/form/list";
import EditFormPage from "../pages/form/edit";
import CreateFormPage from "../pages/form/create";

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
      path: "/form/edit",
      element: <EditFormPage />,
    },
    {
      path: "/form/create",
      element: <CreateFormPage />,
    },
    {
      path: "/master/category",
      element: <ListCategoryMasterPage />,
    },
    {
      path: "/master/category/create",
      element: <CreateCategoriesMasterPage />,
    },
    {
      path: "/master/category/edit",
      element: <EditCategoriesMasterPage />,
    },
    {
      path: "/field-dynamic/list",
      element: <ListFieldDynamicPage />,
    },
    {
      path: "/field-selection-fetch/list",
      element: <ListFieldSelectionFetchPage />,
    },
    //   {
    //     path: "*",
    //     element: <NotFoundPage />,
    //   },
  ]);
  return element;
};
