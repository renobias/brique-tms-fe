import { Avatar, Button, Layout, Menu } from "antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  BarsOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Sider = () => {
  const [drawerSiderVisible, setDrawerSiderVisible] = useState(false);

  const homeMenu = (
    <Menu.Item key="home" icon={<DashboardOutlined />}>
      <Link to="home">Home</Link>
      {!drawerSiderVisible === "/" && <div className="ant-menu-tree-arrow" />}
    </Menu.Item>
  );

  const summaryListMenu = (
    <Menu.Item key="summaryList" icon={<DashboardOutlined />}>
      <Link to="/report/viewers">Summary</Link>
      {!drawerSiderVisible === "/" && <div className="ant-menu-tree-arrow" />}
    </Menu.Item>
  );

  const queueCallMenu = (
    <Menu.Item key="moviesList" icon={<DashboardOutlined />}>
      <Link to="/queue/call">Call</Link>
      {!drawerSiderVisible === "/" && <div className="ant-menu-tree-arrow" />}
    </Menu.Item>
  );

  const queueDeferListMenu = (
    <Menu.Item key="moviesList" icon={<DashboardOutlined />}>
      <Link to="/master/movies">Defer</Link>
      {!drawerSiderVisible === "/" && <div className="ant-menu-tree-arrow" />}
    </Menu.Item>
  );

  const queueActiveListMenu = (
    <Menu.Item key="moviesList" icon={<DashboardOutlined />}>
      <Link to="/master/movies">Active</Link>
      {!drawerSiderVisible === "/" && <div className="ant-menu-tree-arrow" />}
    </Menu.Item>
  );

  const reportMenu = (
    <Menu.SubMenu title="Report">{summaryListMenu}</Menu.SubMenu>
  );

  const queueMenu = (
    <Menu.SubMenu title="Queue">
      {queueCallMenu}
      {queueDeferListMenu}
      {queueActiveListMenu}
    </Menu.SubMenu>
  );

  const renderSider = () => {
    return <>{homeMenu}</>;
  };

  const renderMenu = () => {
    return (
      <>
        <Menu
          // selectedKeys={selectedKey ? [selectedKey] : []}
          // defaultOpenKeys={defaultOpenKeys}
          mode="inline"
          style={{
            marginTop: "8px",
            border: "none",
          }}
          onClick={() => {
            setDrawerSiderVisible?.(true);
          }}
        >
          {renderSider()}
        </Menu>
      </>
    );
  };

  return (
    <Layout.Sider
      style={{ backgroundColor: "white" }}
      collapsible
      collapsed={drawerSiderVisible}
      onCollapse={(collapsed, type) => {
        if (type === "clickTrigger") {
          setDrawerSiderVisible?.(collapsed);
        }
      }}
      collapsedWidth={80}
      breakpoint="lg"
      trigger={
        <Button
          type="text"
          style={{
            borderRadius: 0,
            height: "100%",
            width: "100%",
            backgroundColor: "#0080AE",
          }}
        >
          {drawerSiderVisible ? (
            <RightOutlined style={{ color: "white" }} />
          ) : (
            <LeftOutlined style={{ color: "white" }} />
          )}
        </Button>
      }
    >
      {/* <div
        style={{
          width: drawerSiderVisible ? "80px" : "200px",
          padding: drawerSiderVisible ? "0" : "0 16px",
          display: "flex",
          justifyContent: drawerSiderVisible ? "center" : "flex-start",
          alignItems: "center",
          height: "64px",
          backgroundColor: "white",
          fontSize: "14px",
        }}
      > */}
      {/* <RenderToTitle collapsed={drawerSiderVisible} /> */}
      {/* <h4 style={{ textAlign: "center" }}>Menu</h4> */}
      {/* </div> */}
      {renderMenu()}
    </Layout.Sider>
  );
};
