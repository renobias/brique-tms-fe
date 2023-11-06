import React from "react";
import { LoginPage } from "./components/login";
import { RegisterPage } from "./components/register";
import PropTypes from "prop-types";

export const AuthPage = (props) => {
  const { type } = props;
  const renderView = () => {
    switch (type) {
      case "register":
        return <RegisterPage {...props} />;
      default:
        return <LoginPage {...props} />;
    }
  };
  return <>{renderView()}</>;
};

AuthPage.defaultProps = {
  type: "login",
};

AuthPage.propTypes = {
  type: PropTypes.string,
};
