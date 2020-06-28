import React from "react";
import { StoreValue, useQuery } from "@apollo/client";
import { Button, DatePicker, Form, Input, Select, Typography, Col, Row, Tooltip } from "antd";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons/lib";
import { RuleObject } from "antd/es/form";
import { Vendor } from "../../types/Vendor";
import { Project, PROJECTS_QUERY } from "../../types/Project";
import RequisitionItemCard from "./RequisitionItemCard";

const { TextArea } = Input;
const { Text, Title } = Typography;

const RULES = {
  requiredRule: {
    required: true,
    message: "Please input this field."
  },
  urlRule: {
    type: "url",
    message: "Please enter a valid URL."
  },
  moneyRule: {
    validator: (rule: RuleObject, value: StoreValue) => {
      if (!value || parseInt(value as string) > 0) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Please enter a value greater than 0."));
    }
  }
};

const RequisitionForm: React.FunctionComponent = () => {
  const { loading, data, error } = useQuery(PROJECTS_QUERY);

  if (error) {
    return (
      <>
        <Text type="danger">Error: Unable to display this project</Text>
        <Text>{error?.message}</Text>
      </>
    );
  }

  const projectOptions = loading ? [] : data.projects.map((project: Project) => ({
    label: project.name,
    value: project.name
  }));

  const vendorOptions = loading ? [] : data.vendors.map((vendor: Vendor) => ({
    label: vendor.name,
    value: vendor.id
  }));

  const onFinish = (values: any) => {
    console.log("Form Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const halfLayout = {
    xs: 24, sm: 12, md: 8, lg: 6, xl: 6
  };
  const fullLayout = {
    xs: 24, sm: 24, md: 16, lg: 12, xl: 12
  };

  return (
    <>
      <Title level={2}>Create Requisition</Title>
      <Form
        name="create"
        initialValues={{ items: [{}] }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        autoComplete="off"
        scrollToFirstError
      >
        <Row gutter={[32, 8]} justify="center">
          <Col {...halfLayout}>
            <Form.Item
              name="headline"
              rules={[RULES.requiredRule]}
              label="Headline"
            >
              <Input placeholder="Giant Outdoor Games" />
            </Form.Item>
          </Col>

          <Col {...halfLayout}>
            <Form.Item
              name="project"
              rules={[RULES.requiredRule]}
              label="Project"
            >
              <Select options={projectOptions} showSearch optionFilterProp="label" loading={loading} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[32, 8]} justify="center">
          <Col {...fullLayout}>
            <Form.Item
              name="description"
              rules={[RULES.requiredRule]}
              label={(
                <span>
                  {"Description "}
                  <Tooltip title="The description of what you want to order and why you need it">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              )}
            >
              <TextArea
                autoSize={{ minRows: 2 }}
                placeholder="This will help spice up our venue, and add the pizzazz that will draw students from around the world!"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[32, 8]} justify="center">
          <Col {...halfLayout}>
            <Form.Item
              name="vendor"
              rules={[RULES.requiredRule]}
              label="Vendor"
            >
              <Select options={vendorOptions} showSearch optionFilterProp="label" loading={loading} />
            </Form.Item>
          </Col>

          <Col {...halfLayout}>
            <Form.Item
              name="paymentRequiredBy"
              rules={[RULES.requiredRule]}
              label={(
                <span>
                  {"Payment Required By "}
                  <Tooltip title="The date you need the payment by (Should be at least 3 days from today)">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              )}
            >
              <DatePicker format="MMM-D-YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={[32, 8]} justify="center">
          <Col {...halfLayout}>
            <Form.Item
              name="otherFees"
              rules={[RULES.requiredRule, RULES.moneyRule]}
              label={(
                <span>
                  {"Other Fees "}
                  <Tooltip title="Any other fees associated with this requisition (Such as shipping and handling, processing fees, etc)">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              )}
            >
              <Input prefix="$" type="number" placeholder="68.72" />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div>
              {fields.map((field) => (
                <Row justify="center" key={field.key}>
                  <Col {...fullLayout}>
                    <RequisitionItemCard
                      deleteButton={fields.length > 1}
                      field={field}
                      rules={RULES}
                      remove={remove}
                    />
                  </Col>
                </Row>
              ))}

              <Row justify="center">
                <Col {...fullLayout}>
                  <Form.Item>
                    <Button type="dashed" onClick={add} block>
                      <PlusOutlined />
                      {" Add Item"}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}
        </Form.List>

        <Row justify="center">
          <Col {...fullLayout}>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default RequisitionForm;
