import { Card, Col, List, Pagination, Table, Input, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { colorTheme } from "../../../../../definitions";
import { isSuccesfullRequest } from "../../../../../rest-data-provider/briqueTms/utils";
import { useNavigate } from "react-router-dom";
import { useGet } from "../../../../../hooks/data/useGet";

export const ListCategoryMasterComponent = () => {
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();

  const { state: stateCategoryList, fire: getCategoryList } = useGet({
    dataProviderName: "briqueTms",
    resource: "form/categories",
    handleResult: () => {
      if (isSuccesfullRequest(stateCategoryList.statusCode)) {
        setCategoryList([...stateCategoryList?.data?.categories]);
      }
    },
  });

  const columns = [
    {
      title: "No",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Display Name",
      dataIndex: "displayName",
      key: "displayName",
    },
    {
      dataIndex: "operation",
      key: "operation",
      render: (_, record) => {
        return (
          <Button
            onClick={() => {
              // router.push({
              //   pathname: "/master/movies/edit",
              //   query: {
              //     id: record.id,
              //     studioId: record.StudioId,
              //   },
              // });
            }}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    getCategoryList({
      dataProviderName: "briqueTms",
      resource: "form/categories",
      handleResult: () => {
        if (isSuccesfullRequest(stateCategoryList.statusCode)) {
          setCategoryList([...stateCategoryList?.data?.categories]);
        }
      },
    });
  }, []);
  return (
    <>
      <Row>
        <Col span={18}>
          <h2 style={{ marginBottom: "25px" }}>Master Category</h2>
        </Col>
        <Col span={6} style={{ textAlign: "end" }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            style={{
              width: "100px",
              height: "35px",
              backgroundColor: colorTheme.Background.buttonPositive["light"],
            }}
            onClick={() => {
              // router.push({
              //   pathname: "/master/movies/create",
              // });
            }}
          >
            Add
          </Button>
        </Col>
      </Row>
      <Row style={{ marginBottom: "30px" }}>
        <Col span={8}></Col>
        <Col span={8} />
        <Col span={8} style={{ alignItems: "end" }}>
          {/* <Search
            placeholder="cari judul movie"
            allowClear
          // onSearch={onSearch}
          /> */}
        </Col>
      </Row>
      <Table
        dataSource={categoryList}
        columns={columns}
        loading={stateCategoryList.isLoading}
      />
    </>
  );
};
