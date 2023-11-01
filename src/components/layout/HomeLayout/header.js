import React from "react";
import {
  Layout as AntdLayout,
  Avatar,
  Button,
  Col,
  Dropdown,
  Input,
  Row,
  Space,
  Switch,
} from "antd";
import { useLogout } from "../../../hooks/auth/useLogout.js";
import { authProvider } from "../../../authProvider.js";
import { btnCinorxPrimaryStyles } from "../../../styles/globalStyles.ts";
import {
  buttonIconHeaderStyles,
  containerHeaderStyles,
  headerStyles,
  textHeaderStyles,
  wrapperMenuHeaderStyles,
  wrapperTitleHeaderStyles,
} from "./styles.ts";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { fire: logout, state: stateLogout } = useLogout();
  const identity = authProvider.getIdentity();
  const { authenticated } = authProvider.check();
  const navigate = useNavigate();

  const profileItems = [
    {
      key: "logout",
      label: "logout",
      onClick: () => {
        logout({
          username: identity?.username,
          branchCode: identity?.branchCode,
        });
      },
    },
  ];

  return (
    <AntdLayout.Header style={headerStyles}>
      <div style={containerHeaderStyles}>
        <div
          style={wrapperTitleHeaderStyles}
          onClick={() => {
            navigate("/home", { replace: true });
          }}
        >
          Norxel Queue
        </div>
        <div style={wrapperMenuHeaderStyles}>
          <Space align="center">
            <Button
              type="text"
              onClick={() => {
                logout({
                  username: identity?.username,
                  branchCode: identity?.branchCode,
                });
              }}
              loading={stateLogout.isLoading}
            >
              <text style={btnCinorxPrimaryStyles}>Logout</text>
            </Button>
          </Space>
        </div>
      </div>
    </AntdLayout.Header>
  );
};
