import React from "react";
import { containerStyles, wrapperContentStyles } from "./styles.ts";

export const AuthLayout = ({ children }) => {
  return (
    <div
      style={containerStyles}
    >
      <div style={wrapperContentStyles}>{children}</div>
    </div>
  );
};
