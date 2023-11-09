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

  const formMenu = (
    <Menu.Item key="formList" icon={<DashboardOutlined />}>
      <Link to="/form/list">Form</Link>
      {!drawerSiderVisible === "/" && <div className="ant-menu-tree-arrow" />}
    </Menu.Item>
  );

  const masterCategoryMenu = (
    <Menu.Item key="masterCategory" icon={<DashboardOutlined />}>
      <Link to="/master/category">Category</Link>
      {!drawerSiderVisible === "/" && <div className="ant-menu-tree-arrow" />}
    </Menu.Item>
  );
  const masterMenu = (
    <Menu.SubMenu title="Master">{masterCategoryMenu}</Menu.SubMenu>
  );

  const renderSider = () => {
    return (
      <>
        {formMenu}
        {masterMenu}
      </>
    );
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
