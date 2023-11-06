import React from "react";
import { containerStyles, wrapperContentStyles } from "./styles.js";

export const AuthLayout = ({ children }) => {
  return (
    <div
      style={containerStyles}
    >
      <div style={wrapperContentStyles}>{children}</div>
    </div>
  );
};
