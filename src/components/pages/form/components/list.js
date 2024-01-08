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
  Modal,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { colorTheme } from "../../../../definitions";
import { isSuccesfullRequest } from "../../../../rest-data-provider/briqueTms/utils";
import { useNavigate } from "react-router-dom";
import { useGetList } from "../../../../hooks/data/useGetList";
import { useGet } from "../../../../hooks/data/useGet";
import { isNoData } from "../../../../rest-data-provider/briqueTms/utils/flag";

const { Search } = Input;
const { Option } = Select;

export const ListFormComponent = () => {
  const [formStructureList, setFormStructureList] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const defaultFilter = {
    category: null,
  };
  const [filter, setFilter] = useState(defaultFilter);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const navigate = useNavigate();

  const { state: stateFormStructureList, fire: getFormList } = useGetList({
    dataProviderName: "briqueTms",
    resource: "form/list",
    pagination: {
      current: 1,
      pageSize: 10,
    },
    searching: {
      keyword: textSearch,
    },
    filter,
    handleResult: () => {
      if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
        setFormStructureList([...stateFormStructureList?.data]);
      }
      if (isNoData(stateFormStructureList.statusCode)) {
        setFormStructureList([]);
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
      searching: {
        keyword: textSearch,
      },
      filter,
      handleResult: () => {
        if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
          setFormStructureList([...stateFormStructureList?.data]);
        }
        if (isNoData(stateFormStructureList.statusCode)) {
          setFormStructureList([]);
        }
      },
    });
  }, []);

  const onSearch = (value) => {
    console.log("onsearch -> ", value);
    getFormList({
      dataProviderName: "briqueTms",
      resource: "form/list",
      pagination: {
        current: 1,
        pageSize: 10,
      },
      searching: {
        keyword: textSearch,
      },
      filter,
      handleResult: () => {
        console.log("status code -> ", stateFormStructureList.statusCode);
        if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
          setFormStructureList([...stateFormStructureList?.data]);
        }
        if (isNoData(stateFormStructureList.statusCode)) {
          setFormStructureList([]);
        }
      },
    });
  };

  const showFilter = () => {
    setIsOpenFilter(true);
  };
  const handleOkFilter = () => {
    setIsOpenFilter(false);
  };
  const handleCancelFilter = () => {
    setIsOpenFilter(false);
  };

  function RenderFilterContent() {
    const [filterInternal, setFilterInternal] = useState({
      category: null,
    });
    const [rerenderFilter, setRerenderFilter] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const { state: stateCategoryOptions, fire: getCategoryOptions } = useGet({
      dataProviderName: "briqueTms",
      resource: "form/categories",
      handleResult: () => {
        if (isSuccesfullRequest(stateCategoryOptions?.statusCode)) {
        }
      },
    });

    useEffect(() => {
      setFilterInternal({ ...filter });
      getCategoryOptions({
        dataProviderName: "briqueTms",
        resource: "form/categories",
        handleResult: () => {
          if (isSuccesfullRequest(stateCategoryOptions?.statusCode)) {
            const categoryOptions = stateCategoryOptions?.data?.categories?.map(
              (category) => {
                return {
                  value: category?.id,
                  label: category?.displayName,
                };
              }
            );
            setCategoryOptions([...categoryOptions]);
            // setFilterInternal({ ...filter });
          }
        },
      });
    }, []);

    const toggleRerenderFilter = () => {
      setRerenderFilter(!rerenderFilter);
    };

    const handleCategorySelectChange = (value) => {
      console.log("value -> ", value);
      const selectedCategory = JSON.parse(value);
      // filter.category = {
      //   id: selectedCategory?.value,
      //   label: selectedCategory?.label,
      // };
      // toggleRerenderFilter();
      setFilterInternal({
        ...filterInternal,
        category: {
          id: selectedCategory?.value,
          label: selectedCategory?.label,
        },
      });
    };
    const handleOnReset = () => {
      setFilter(defaultFilter);
      getFormList({
        dataProviderName: "briqueTms",
        resource: "form/list",
        pagination: {
          current: 1,
          pageSize: 10,
        },
        searching: {
          keyword: textSearch,
        },
        filter: defaultFilter,
        handleResult: () => {
          if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
            setFormStructureList([...stateFormStructureList?.data]);
          }
          if (isNoData(stateFormStructureList.statusCode)) {
            setFormStructureList([]);
          }
        },
      });
      handleCancelFilter();
    };
    const handleOnFilter = () => {
      getFormList({
        dataProviderName: "briqueTms",
        resource: "form/list",
        pagination: {
          current: 1,
          pageSize: 10,
        },
        searching: {
          keyword: textSearch,
        },
        // filter: {
        //   ...filter,
        //   categoryId: filter?.category?.value,
        //   category: undefined,
        // },
        // filter: { categoryId: filter?.category?.value },
        filter: {
          ...filterInternal,
        },
        handleResult: () => {
          console.log("status code -> ", stateFormStructureList.statusCode);
          if (isSuccesfullRequest(stateFormStructureList.statusCode)) {
            setFormStructureList([...stateFormStructureList?.data]);
            setFilter(filterInternal);
          }
          if (isNoData(stateFormStructureList.statusCode)) {
            console.log("no data");
            setFormStructureList([]);
          }
        },
      });
      handleCancelFilter();
    };
    return (
      <>
        <div style={{ padding: "10px" }}>
          <Row style={{ marginBottom: "10px" }}>
            <Col span={24} style={{ marginBottom: "5px" }}>
              <h5>Category</h5>
            </Col>
            <Col span={24}>
              <Select
                disabled={stateCategoryOptions?.isLoading}
                style={{ width: "100%" }}
                onChange={handleCategorySelectChange}
                placeholder="-- select category --"
                // options={categoryOptions}
                value={filterInternal?.category}
              >
                {categoryOptions.map((category) => {
                  return (
                    <Option value={JSON.stringify(category)}>
                      {category?.label}
                    </Option>
                  );
                })}
              </Select>
            </Col>
          </Row>
          <Row gutter={5} justify={"end"} style={{ marginTop: "20px" }}>
            <Col>
              <Button onClick={handleOnReset}>Reset</Button>
            </Col>
            <Col>
              <Button
                type={"primary"}
                style={{
                  backgroundColor:
                    colorTheme.Background.buttonPositive["light"],
                }}
                onClick={handleOnFilter}
              >
                Filter
              </Button>
            </Col>
          </Row>
        </div>
      </>
    );
  }
  return (
    <>
      <Row>
        <Col span={18}>
          <h2 style={{ marginBottom: "25px" }}>Form</h2>
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
              navigate("/form/create");
              // router.push({
              //   pathname: "/master/movies/create",
              // });
            }}
          /> */}
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
            size={"large"}
            shape={"circle"}
            onClick={() => {
              navigate("/form/create");
              // router.push({
              //   pathname: "/master/movies/create",
              // });
            }}
          />
        </Col>
        <Col span={8} />
        <Col span={8} style={{ alignItems: "end" }}>
          <Row gutter={10}>
            <Col span={20}>
              <Search
                placeholder="cari nama form, display form, atau category form"
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
                onClick={showFilter}
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
      <Row style={{ marginBottom: "30px" }}>
        <Col span={8}>
          <Row style={{ marginBottom: "10px" }}>
            <Col span={24}>
              <h4>Filter by </h4>
            </Col>
          </Row>
          <Row>
            <Col span={4}>Category</Col>
            <Col span={2}>:</Col>
            <Col span={14}>{filter?.category?.label ?? "-"}</Col>
          </Row>
        </Col>
      </Row>
      <Table
        dataSource={formStructureList}
        columns={columns}
        loading={stateFormStructureList.isLoading}
        // style={{height: "10px"}}
        pagination={
          formStructureList.length > 0
            ? {
                pfullnameSize: stateFormStructureList?.perPage, // Number of items per pfullname
                total: stateFormStructureList?.totalAllData, // Total number of items
                showSizeChanger: true, // Show option to change pfullname size
                current: parseInt(stateFormStructureList?.page),
                pfullnameSizeOptions: ["10", "20", "30"], // Pfullname size options
                onChange: (page, pageSize) => {
                  getFormList({
                    dataProviderName: "briqueTms",
                    resource: "form/list",
                    pagination: {
                      current: page,
                      pageSize: pageSize,
                    },
                    searching: {
                      keyword: textSearch,
                    },
                    filter,
                    handleResult: () => {
                      if (
                        isSuccesfullRequest(stateFormStructureList.statusCode)
                      ) {
                        setFormStructureList([...stateFormStructureList?.data]);
                      }
                      if (isNoData(stateFormStructureList.statusCode)) {
                        setFormStructureList([]);
                      }
                    },
                  });
                },
                // onShowSizeChange: (current, size) => {
                //   console.log("current -> ", current);
                //   console.log("size -> ", size);
                // }
              }
            : false
        }
        scroll={{ y: `calc(100vh - 480px)` }}
      />
      <Modal
        title="Filter"
        open={isOpenFilter}
        // onOk={handleOkFilter}
        onCancel={handleCancelFilter}
        cancelButtonProps={{ style: { display: "none" } }}
        okText={"Filter"}
        okButtonProps={{ style: { display: "none" } }}
        // okButtonProps={{
        //   style: {
        //     backgroundColor: colorTheme.Background.buttonPositive["light"],
        //   },
        // }}
        centered
      >
        <RenderFilterContent />
      </Modal>
    </>
  );
};
