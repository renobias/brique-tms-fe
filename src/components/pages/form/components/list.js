import {
  Card,
  Col,
  List,
  Pagination,
  Table,
  Input,
  Row,
  Button,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { colorTheme } from "../../../../definitions";
import { isSuccesfullRequest } from "../../../../rest-data-provider/briqueTms/utils";
import { useNavigate } from "react-router-dom";
import { useGetList } from "../../../../hooks/data/useGetList";

export const ListFormComponent = () => {
  const [formStructureList, setFormStructureList] = useState([]);
  const navigate = useNavigate();

  const { state: stateFormStructureList, fire: getFormList } = useGetList({
    dataProviderName: "briqueTms",
    resource: "form/list",
    pagination: {
      current: 1,
      pageSize: 10,
    },
    handleResult: () => {
      if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
        setFormStructureList([...stateFormStructureList?.data]);
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
      dataIndex: "displayname",
      key: "displayname",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      dataIndex: "operation",
      key: "operation",
      render: (_, record) => {
        return (
          <>
            <Space>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  navigate(`/form/edit?id=${record.id}`);
                  // router.push({
                  //   pathname: "/master/movies/edit",
                  //   query: {
                  //     id: record.id,
                  //     studioId: record.StudioId,
                  //   },
                  // });
                }}
              />
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => {
                  navigate(`/form/show?id=${record.id}`);
                  // router.push({
                  //   pathname: "/master/movies/edit",
                  //   query: {
                  //     id: record.id,
                  //     studioId: record.StudioId,
                  //   },
                  // });
                }}
              />
            </Space>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getFormList({
      dataProviderName: "briqueTms",
      resource: "form/list",
      pagination: {
        current: 1,
        pageSize: 10,
      },
      handleResult: () => {
        if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
          setFormStructureList([...stateFormStructureList?.data]);
        }
      },
    });
  }, []);
  return (
    <>
      <Row>
        <Col span={18}>
          <h2 style={{ marginBottom: "25px" }}>Form</h2>
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
              navigate("/form/create");
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
        dataSource={formStructureList}
        columns={columns}
        loading={stateFormStructureList.isLoading}
        pagination={{
          pfullnameSize: stateFormStructureList?.perPage, // Number of items per pfullname
          total: stateFormStructureList?.totalAllData, // Total number of items
          showSizeChanger: true, // Show option to change pfullname size
          pfullnameSizeOptions: ["10", "20", "30"], // Pfullname size options
          onChange: (page, pageSize) => {
            getFormList({
              dataProviderName: "briqueTms",
              resource: "form/list",
              pagination: {
                current: page,
                pageSize: pageSize,
              },
              handleResult: () => {
                if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
                  setFormStructureList([...stateFormStructureList?.data]);
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
