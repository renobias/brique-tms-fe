import React, { useEffect, useState } from "react";
import { authProvider } from "./authProvider";
// import { useRouter } from "next/router";

const { createContext } = require("react");
export const globalStateContext = createContext();
export const GlobalStateProvider = ({ children, context }) => {
  const { authenticated } = authProvider.check(context);
  const [currentLayout, setCurrentLayout] = useState("common");
  const [isModalOpenCustomerInfo, setIsModalOpenCustomerInfo] = useState(false);
  // const router = useRouter();

  // useEffect(() => {
  //   if (router.pathname == "/login" || router.pathname == "/register") {
  //     setCurrentLayout("auth");
  //   } else {
  //     setCurrentLayout("home");
  //   }
  // }, [router.pathname]);

  const globalState = {
    layout: {
      current: {
        currentLayout,
        setCurrentLayout,
      },
    },
    modal: {
      isModalOpenCustomerInfo,
      setIsModalOpenCustomerInfo,
    },
  };

  return (
    <globalStateContext.Provider value={globalState}>
      {children}
    </globalStateContext.Provider>
  );
};
