import { Card, Col, List, Pagination, Table, Input, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import { colorTheme } from "../../../../../definitions";
import { isSuccesfullRequest } from "../../../../../rest-data-provider/briqueTms/utils";
import { useNavigate } from "react-router-dom";
import { useGetList } from "../../../../../hooks/data/useGetList";

const { Search } = Input;

export const ListCategoryMasterComponent = () => {
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();
  const [textSearch, setTextSearch] = useState("");

  const { state: stateCategoryList, fire: getCategoryList } = useGetList({
    dataProviderName: "briqueTms",
    resource: "form/categories/list",
    pagination: {
      current: 1,
      pageSize: 10,
    },
    searching: {
      keyword: textSearch,
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
              // navigate("/master/category/create");
              navigate(`/master/category/edit?id=${record.id}`);
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
        pageSize: 10,
      },
      searching: {
        keyword: textSearch,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateCategoryList.statusCode)) {
          setCategoryList([...stateCategoryList?.data]);
        }
      },
    });
  }, []);

  const onSearch = (value) => {
    console.log("onsearch -> ", value);
    getCategoryList({
      dataProviderName: "briqueTms",
      resource: "form/categories/list",
      pagination: {
        current: 1,
        pageSize: 10,
      },
      searching: {
        keyword: textSearch,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateCategoryList.statusCode)) {
          setCategoryList([...stateCategoryList?.data]);
        }
      },
    });
  };
  return (
    <>
      <Row>
        <Col span={18}>
          <h2 style={{ marginBottom: "25px" }}>Master Category</h2>
        </Col>
        <Col span={6} style={{ textAlign: "end" }}>
          {/* <Button
            icon={<PlusOutlined />}
            type="primary"
            style={{
              width: "100px",
              height: "35px",
              backgroundColor: colorTheme.Background.buttonPositive["light"],
            }}
            onClick={() => {
              navigate("/master/category/create");
            }}
          >
            Add
          </Button> */}
        </Col>
      </Row>
      <Row style={{ marginBottom: "30px" }}>
        <Col span={8}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            style={{
              width: "43px",
              height: "43px",
              backgroundColor: colorTheme.Background.buttonPositive["light"],
            }}
            shape={"circle"}
            onClick={() => {
              navigate("/master/category/create");
            }}
          />
        </Col>
        <Col span={8} />
        <Col span={8} style={{ alignItems: "end" }}>
          <Row gutter={10}>
            <Col span={20}>
              <Search
                placeholder="cari nama category atau display name category"
                // allowClear
                onChange={(e) => {
                  console.log("value on change -> ", e.target.value);
                  setTextSearch(e.target.value);
                }}
                onSearch={onSearch}
              />
            </Col>
            <Col span={2}>
              <Button
                icon={<FilterOutlined />}
                type="primary"
                // shape="circle"
                style={{
                  backgroundColor:
                    colorTheme.Background.buttonPositive["light"],
                }}
              />
            </Col>
          </Row>
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
          current: parseInt(stateCategoryList?.page),
          onChange: (page, pageSize) => {
            getCategoryList({
              dataProviderName: "briqueTms",
              resource: "form/categories/list",
              pagination: {
                current: page,
                pageSize: pageSize,
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
