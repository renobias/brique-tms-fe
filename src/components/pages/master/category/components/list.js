import { Card, Col, List, Pagination, Table, Input, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { colorTheme } from "../../../../../definitions";
import { isSuccesfullRequest } from "../../../../../rest-data-provider/briqueTms/utils";
import { useNavigate } from "react-router-dom";
import { useGetList } from "../../../../../hooks/data/useGetList";

export const ListCategoryMasterComponent = () => {
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();

  const { state: stateCategoryList, fire: getCategoryList } = useGetList({
    dataProviderName: "briqueTms",
    resource: "form/categories/list",
    pagination: {
      current: 1,
      pageSize: 10
    },
    handleResult: () => {
      if (isSuccesfullRequest(stateCategoryList.statusCode)) {
        setCategoryList([...stateCategoryList?.data]);
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
      resource: "form/categories/list",
      pagination: {
        current: 1,
        pageSize: 10
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateCategoryList.statusCode)) {
          setCategoryList([...stateCategoryList?.data]);
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
        pagination={{
          pfullnameSize: stateCategoryList?.perPage, // Number of items per pfullname
          total: stateCategoryList?.totalAllData, // Total number of items
          showSizeChanger: true, // Show option to change pfullname size
          pfullnameSizeOptions: ["10", "20", "30"], // Pfullname size options
          onChange: (page, pageSize) => {
            getCategoryList({
              dataProviderName: "briqueTms",
              resource: "form/categories/list",
              pagination: {
                current: page,
                pageSize: pageSize
              },
              handleResult: () => {
                if (isSuccesfullRequest(stateCategoryList.statusCode)) {
                  setCategoryList([...stateCategoryList?.data]);
                }
              },
            });
          },
          // onShowSizeChange: (current, size) => {
          //   console.log("current -> ", current);
          //   console.log("size -> ", size);
          // }
        }}
        scroll={{ y: `calc(100vh - 400px)` }}
      />
    </>
  );
};
