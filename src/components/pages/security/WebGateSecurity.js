import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authProvider } from "../../../authProvider";

export const WebGateSecurity = (props) => {
  const { children, context } = props;
  const { authenticated, redirectTo } = authProvider.check(context);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location?.pathname;
  console.log("current path -> ", currentPath);

  useEffect(() => {
    if (!authenticated) {
      navigate(redirectTo, { replace: true });
      return;
    }
    if (authenticated) {
      if (currentPath == "/login") {
        navigate(redirectTo, {
          replace: true,
        });
      }
    }
  }, []);
  return children;
};
