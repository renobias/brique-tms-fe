import { Spin } from "antd";
import React from "react";

export const LoadingPage = ({ children, isLoading = true }) => {
  if (isLoading) {
    return (
      <div style={{ position: "relative" }}>
        {children}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white"
          }}
        >
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
};
