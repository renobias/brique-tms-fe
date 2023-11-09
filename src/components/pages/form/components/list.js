import { Card, Col, List, Pagination, Table, Input, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { colorTheme } from "../../../../definitions";
import { isSuccesfullRequest } from "../../../../rest-data-provider/briqueTms/utils";
import { useNavigate } from "react-router-dom";
import { useGet } from "../../../../hooks/data/useGet";

export const ListFormComponent = () => {
  const [formStructureList, setFormStructureList] = useState([]);
  const navigate = useNavigate();

  const { state: stateFormStructureList, fire: getFormList } = useGet({
    dataProviderName: "briqueTms",
    resource: "form/list",
    handleResult: () => {
      if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
        setFormStructureList([...stateFormStructureList?.data?.forms]);
      }
    },
  });

  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
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
    getFormList({
      dataProviderName: "briqueTms",
      resource: "form/list",
      handleResult: () => {
        if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
          setFormStructureList([...stateFormStructureList?.data?.forms]);
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
      />
    </>
  );
};
