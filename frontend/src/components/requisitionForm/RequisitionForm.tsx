import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, DatePicker, Form, Input, Select, Typography, Col, Row, Tooltip, message } from "antd";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons/lib";
import { useHistory } from "react-router-dom";
import { PROJECTS_QUERY } from "../../types/Project";
import RequisitionItemCard from "./RequisitionItemCard";
import { RequisitionFormData, CREATE_REQUISITION_MUTATION, UPDATE_REQUISITION_MUTATION } from "../../types/Requisition";
import { FORM_RULES } from "../../util/util";

const { TextArea } = Input;
const { Text, Title } = Typography;

interface Props {
  editMode?: boolean;
  requisitionData?: RequisitionFormData;
  requisitionId?: string;
}

const RequisitionForm: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();

  const { loading, data, error } = useQuery(PROJECTS_QUERY);
  const [createRequisition] = useMutation(CREATE_REQUISITION_MUTATION);
  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION);

  if (error) {
    return (
      <>
        <Text type="danger">Error: Unable to display this project</Text>
        <Text>{error?.message}</Text>
      </>
    );
  }

  const projectOptions = loading ? [] : data.projects.map((project: any) => ({
    label: project.name,
    value: project.id
  }));

  const vendorOptions = loading ? [] : data.vendors.map((vendor: any) => ({
    label: vendor.name,
    value: vendor.id
  }));

  const saveDataToServer = (values: any) => {
    const mutationData = values;
    Object.keys(mutationData).forEach((key) => (mutationData[key] === undefined ? delete mutationData[key] : {}));

    if (mutationData.paymentRequiredBy) {
      mutationData.paymentRequiredBy = mutationData.paymentRequiredBy.format();
    }

    mutationData.requisitionitemSet = mutationData.items.filter((item: any) => Object.keys(item).length !== 0).map((item: any) => ({
      ...item.name !== undefined && { name: item.name },
      ...item.link !== undefined && { link: item.link },
      ...item.quantity !== undefined && { quantity: item.quantity },
      ...item.unitPrice !== undefined && { unitPrice: item.unitPrice },
      ...item.notes !== undefined && { notes: item.notes }
    }));

    delete mutationData.items;

    const hide = message.loading("Saving requisition...", 0);
    if (props.editMode) {
      updateRequisition({ variables: { data: mutationData, id: props.requisitionId } })
        .then((result) => {
          hide();
          message.success("Successfully updated", 3);

          const rekData = result.data.updateRequisition.requisition;
          history.push(`/project/${rekData.project.referenceString}/requisition/${rekData.projectRequisitionId}`);
        })
        .catch(() => {
          hide();
          message.error("Error saving", 3);
        });
    } else {
      createRequisition({ variables: { data: mutationData } })
        .then((result) => {
          hide();
          message.success("Successfully created", 3);

          const rekData = result.data.createRequisition.requisition;
          history.push(`/project/${rekData.project.referenceString}/requisition/${rekData.projectRequisitionId}`);
        })
        .catch(() => {
          hide();
          message.error("Error saving", 3);
        });
    }
  };

  const onFinish = (values: any) => {
    console.log("Form Success:", values);
    saveDataToServer(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Please complete the required fields.", 3);
    console.log("Failed:", errorInfo);
  };

  const onSaveDraft = () => {
    form.validateFields(["headline", "project"])
      .then((res) => {
        saveDataToServer(form.getFieldsValue());
      })
      .catch((err) => {
        message.error("Please complete the required fields.", 3);
        console.error(err);
      });
  };

  const halfLayout = {
    xs: 24, sm: 12, md: 8, lg: 6, xl: 6
  };
  const fullLayout = {
    xs: 24, sm: 24, md: 16, lg: 12, xl: 12
  };

  const showDraftButton = !props.editMode || (props.editMode && props.requisitionData?.status === "DRAFT");

  return (
    <>
      <Title level={2}>{props.editMode ? "Edit Requisition" : "Create Requisition"}</Title>
      <Form
        name="create"
        initialValues={props.editMode ? props.requisitionData : { items: [{}] }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        autoComplete="off"
        form={form}
      >
        <Row gutter={[32, 8]} justify="center">
          <Col {...halfLayout}>
            <Form.Item
              name="headline"
              rules={[FORM_RULES.requiredRule]}
              label="Headline"
            >
              <Input placeholder="Giant Outdoor Games" />
            </Form.Item>
          </Col>

          <Col {...halfLayout}>
            <Form.Item
              name="project"
              rules={[FORM_RULES.requiredRule]}
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
              rules={[FORM_RULES.requiredRule]}
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
              rules={[FORM_RULES.requiredRule]}
              label="Vendor"
            >
              <Select options={vendorOptions} showSearch optionFilterProp="label" loading={loading} />
            </Form.Item>
          </Col>

          <Col {...halfLayout}>
            <Form.Item
              name="paymentRequiredBy"
              rules={[FORM_RULES.requiredRule]}
              label={(
                <span>
                  {"Payment Required By "}
                  {/* TODO: Fill in actual payment required by policy */}
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
              rules={[FORM_RULES.requiredRule, FORM_RULES.moneyRule]}
              normalize={(value: any) => parseInt(value)}
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
              <Button type="primary" htmlType="submit">{props.editMode ? "Save" : "Submit"}</Button>
              {showDraftButton && <Button style={{ marginLeft: "10px" }} onClick={() => onSaveDraft()}>Save as Draft</Button>}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default RequisitionForm;
