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
      <Sider />
      <AntdLayout style={containerHomeContentStyles}>
        <Header />
        <AntdLayout.Content style={wrapperHomeContentStyles}>
          {children}
          {/* <div>{children}</div> */}
          {/** masalahnya distyle sini jadi ngescroll */}
        </AntdLayout.Content>
      </AntdLayout>
    </AntdLayout>
  );
}

export default HomeLayout;
