import { Col, Row } from "antd";
import React from "react";
import PropTypes from "prop-types";

export const TextInformation = ({ keyy, value }) => {
  return (
    <>
      <Row className="my-1">
        <Col span={5}>
          <text>{keyy}</text>
        </Col>
        <Col span={1}>
          <text>:</text>
        </Col>
        <Col span={18}>
          <text>{value}</text>
        </Col>
      </Row>
    </>
  );
};

TextInformation.defaultProps = {
  key: "Key",
  value: "Value",
};

TextInformation.propTypes = {
  key: PropTypes.string,
  value: PropTypes.string,
};
