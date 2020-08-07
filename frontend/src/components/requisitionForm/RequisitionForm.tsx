import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, DatePicker, Form, Input, Select, Typography, Col, Row, Tooltip, message, Switch, Upload } from "antd";
import { PlusOutlined, QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons/lib";
import { useHistory } from "react-router-dom";
import { RcFile } from "antd/es/upload";
import RequisitionItemCard from "./RequisitionItemCard";
import { RequisitionFormData, CREATE_REQUISITION_MUTATION, UPDATE_REQUISITION_MUTATION, REQUISITION_FORM_QUERY, OPEN_REQUISITIONS_QUERY, RequisitionStatus } from "../../types/Requisition";
import { FORM_RULES, formatPrice, getTotalCost } from "../../util/util";
import ErrorDisplay from "../../util/ErrorDisplay";

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Dragger } = Upload;

interface Props {
  editMode?: boolean;
  requisitionData?: RequisitionFormData;
  requisitionId?: string;
}

const RequisitionForm: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [runningTotal, setRunningTotal] = useState(getTotalCost(props.requisitionData, true));

  const { loading, data, error } = useQuery(REQUISITION_FORM_QUERY, { fetchPolicy: "network-only" });

  // This updates the cache so the requisition appears on the users home page after creation
  const [createRequisition] = useMutation(CREATE_REQUISITION_MUTATION, {
    update(cache, { data: createMutationData }) {
      try {
        // @ts-ignore
        const { requisitions } = cache.readQuery({ query: OPEN_REQUISITIONS_QUERY });
        cache.writeQuery({
          query: OPEN_REQUISITIONS_QUERY,
          data: { requisitions: requisitions.concat([createMutationData.createRequisition.requisition]) }
        });
      } catch {
        // Home screen hasn't been loaded yet
      }
    }
  });

  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const projectOptions = loading ? [] : data.projects.map((project: any) => ({
    label: project.name,
    value: project.id
  }));

  const vendorOptions = loading ? [] : data.vendors.map((vendor: any) => ({
    label: vendor.name,
    value: vendor.id
  }));

  // Determines if requisition is submitting for review or just editing to save changes by an admin
  const submittalMode = !props.requisitionData || ["DRAFT", "PENDING_CHANGES"].includes(props.requisitionData.status);

  // Determines if draft button shows on bottom of screen
  const showDraftButton = !props.editMode || (props.editMode && props.requisitionData?.status === "DRAFT");

  // Determines if a requisition can be changed between reimbursement and non-reimbursement
  const reimbursementToggleEnabled = !props.requisitionData || (props.editMode && ["DRAFT", "PENDING_CHANGES"].includes(props.requisitionData.status));

  vendorOptions.sort((a: any, b: any) => a.label.localeCompare(b.label)); // Sorts vendors alphabetically

  const saveDataToServer = async (values: any, requisitionStatus: RequisitionStatus) => {
    const mutationData: RequisitionFormData = {
      headline: values.headline,
      project: values.project,
      description: values.description,
      vendor: values.vendor || undefined,
      paymentRequiredBy: values.paymentRequiredBy ? values.paymentRequiredBy.format("YYYY-MM-DD") : null,
      otherFees: values.otherFees,
      isReimbursement: values.isReimbursement,
      requisitionitemSet: values.requisitionitemSet.map((item: any) => ({
        name: item.name,
        link: item.link,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes
      })),
      status: requisitionStatus,
      fileSet: values.fileSet
    };

    const hide = message.loading("Saving requisition...", 0);

    try {
      let rekData, text;
      if (props.editMode) {
        const result = await updateRequisition({ variables: { data: mutationData, id: props.requisitionId } });
        text = "Successfully updated";
        rekData = result.data.updateRequisition.requisition;
      } else {
        const result = await createRequisition({ variables: { data: mutationData } });
        text = "Successfully created";
        rekData = result.data.createRequisition.requisition;
      }

      hide();
      message.success(text, 2);
      history.push(`/project/${rekData.project.referenceString}/requisition/${rekData.projectRequisitionId}`);
    } catch (err) {
      hide();
      message.error("Error saving", 2);
      console.error(JSON.parse(JSON.stringify(err)));
    }
  };

  const onFinish = async (values: any) => {
    console.log("Form Success:", values);
    await saveDataToServer(values, submittalMode ? "SUBMITTED" : props.requisitionData!.status);
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Please complete the required fields.", 2);
    console.log("Failed:", errorInfo);
  };

  const onSaveDraft = async () => {
    try {
      await form.validateFields(["headline", "project"]);
      await saveDataToServer(form.getFieldsValue(), "DRAFT");
    } catch (err) {
      message.error("Please complete the required fields.", 2);
      console.error(err);
    }
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    setRunningTotal(getTotalCost(allValues, true));
  };

  const halfLayout = {
    xs: 24, sm: 12, md: 8, lg: 6, xl: 6
  };
  const fullLayout = {
    xs: 24, sm: 24, md: 16, lg: 12, xl: 12
  };

  const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf", "text/plain"]; // Has backend validation as well
  const MAX_FILE_SIZE = 1024 * 1024 * 3; // 3 MB
  const FILE_ERROR_STRING = "Please upload a png, jpeg, or pdf file less than 3 MB";

  const checkFileUpload = (file: RcFile, fileList: RcFile[]) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      message.error(FILE_ERROR_STRING);
      fileList.shift();
    }
    return false;
  };

  return (
    <>
      <Title>{props.editMode ? "Edit Requisition" : "Create Requisition"}</Title>
      <Form
        name="create"
        initialValues={props.editMode ? props.requisitionData : { requisitionitemSet: [{}] }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
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
              label={(
                <span>
                  {"Payment Required By "}
                  {/* TODO: Fill in actual payment required by policy */}
                  <Tooltip title="If you need the payment by a certain date, list it here (Should be at least 3 days from today)">
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
              normalize={(value: any) => (value ? parseFloat(value) : null)}
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
          <Col {...halfLayout}>
            <Form.Item
              name="isReimbursement"
              valuePropName="checked"
              label={(
                <span>
                  {"Is this a Reimbursement? "}
                  <Tooltip title="Select yes if you have paid for this requisition already. Otherwise, HackGT will pay for and order the items.">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              )}
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" disabled={!reimbursementToggleEnabled} />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="requisitionitemSet">
          {(fields, { add, remove }) => (
            <div>
              {fields.map(field => (
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
            <Form.Item
              name="fileSet"
              label={(
                <span>
                  {"Upload Files "}
                  <Tooltip title="Add any invoices, receipts, or other documents associated with the requisition.">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              )}
              valuePropName="fileList"
              getValueFromEvent={(event: any) => (Array.isArray(event) ? event : event && event.fileList)}
            >
              <Dragger listType="picture" name="file" accept={ACCEPTED_FILE_TYPES.join(",")} beforeUpload={checkFileUpload} multiple>
                <UploadOutlined style={{ color: "#40a9ff", fontSize: "36px", marginBottom: "5px" }} />
                <p>Click or drag file to this area to upload</p>
              </Dragger>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[0, 16]} justify="center">
          <Col {...fullLayout}>
            <Text>
              <strong>Total: </strong>
              {formatPrice(runningTotal)}
            </Text>
          </Col>
        </Row>

        <Row justify="center">
          <Col {...fullLayout}>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ margin: "0 10px 10px 0" }}>{submittalMode ? "Submit for Review" : "Save"}</Button>
              {showDraftButton && <Button onClick={() => onSaveDraft()}>Save as Draft</Button>}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default RequisitionForm;
