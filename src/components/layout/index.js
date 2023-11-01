import React from "react";
import { AuthLayout } from "./AuthLayout";
import HomeLayout from "./HomeLayout";
export const AppLayout = ({ type, children }) => {
  const renderLayout = () => {
    switch (type) {
      case "auth":
        return <AuthLayout>{children}</AuthLayout>;
      case "home":
        return <HomeLayout>{children}</HomeLayout>;
      default:
        return <HomeLayout>{children}</HomeLayout>;
    }
  };

  return <>{renderLayout()}</>;
};
