import {
  Layout as AntdLayout,
  Breadcrumb,
  Button,
  FloatButton,
  Menu,
} from "antd";
import React from "react";
import { Header } from "./header";
import {
  containerHomeContentStyles,
  containerHomeStyles,
  wrapperHomeContentStyles,
} from "./styles.ts";
import { Sider } from "./sider";
import { LogoutOutlined } from "@ant-design/icons";
import { useLogout } from "../../../hooks/auth/useLogout.js";
import { authProvider } from "../../../authProvider";
import { LoadingPage } from "../../../components/pages/LoadingPage";

function HomeLayout({ children }) {
  const { fire: logout, state: stateLogout } = useLogout();
  const identity = authProvider.getIdentity();
  return (
    <AntdLayout style={containerHomeStyles}>
      <Header />
      <AntdLayout style={containerHomeContentStyles}>
        <Sider />
        <AntdLayout.Content>
          <div style={wrapperHomeContentStyles}>{children}</div>
        </AntdLayout.Content>
      </AntdLayout>
    </AntdLayout>
  );
}

export default HomeLayout;
