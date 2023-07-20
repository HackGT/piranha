import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Typography,
  Col,
  Row,
  message,
  Switch,
  Upload,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons/lib";
import { useNavigate } from "react-router-dom";
import { RcFile } from "antd/es/upload";
import { Helmet } from "react-helmet";
import { apiUrl, Service, ErrorScreen } from "@hex-labs/core";
import useAxios from "axios-hooks";
import axios from "axios";

import RequisitionItemCard from "./RequisitionItemCard";
import { FORM_RULES, formatPrice, getTotalCost } from "../../../util/util";
import QuestionIconLabel from "../../../util/QuestionIconLabel";
import { RequisitionItem, RequisitionStatus } from "../../../generated/types";
import { RequisitionFormData } from "../../../types/types";

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Dragger } = Upload;

interface Props {
  editMode?: boolean;
  requisitionData?: RequisitionFormData;
  requisitionId?: string;
}

const RequisitionForm: React.FC<Props> = props => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [runningTotal, setRunningTotal] = useState(getTotalCost(props.requisitionData, true));
  const [selectedBudget, setSelectedBudget] = useState<string | undefined>(
    props.requisitionData?.budget
  );
  const [isReimbursement, setIsReimbursement] = useState(
    props.requisitionData?.isReimbursement || false
  );

  const [{ loading: projectsLoading, data: projectsData, error: projectsError }] = useAxios({
    url: apiUrl(Service.FINANCE, "/projects"),
    method: "GET",
    params: {
      archived: false,
    },
  });
  const [{ loading: vendorsLoading, data: vendorsData, error: vendorsError }] = useAxios({
    url: apiUrl(Service.FINANCE, "/vendors"),
    method: "GET",
    params: {
      isActive: true,
    },
  });
  const [{ loading: budgetsLoading, data: budgetsData, error: budgetsError }] = useAxios({
    url: apiUrl(Service.FINANCE, "/budgets"),
    method: "GET",
    params: {
      archived: false,
    },
  });

  if (projectsError) {
    return <ErrorScreen error={projectsError} />;
  }
  if (vendorsError) {
    return <ErrorScreen error={vendorsError} />;
  }
  if (budgetsError) {
    return <ErrorScreen error={budgetsError} />;
  }

  const projectOptions = projectsLoading
    ? []
    : projectsData.map((project: any) => ({
        label: project.name,
        value: project.id,
      }));

  const vendorOptions = vendorsLoading
    ? []
    : vendorsData.map((vendor: any) => ({
        label: vendor.name,
        value: vendor.id,
      }));

  const budgetOptions = budgetsLoading
    ? []
    : budgetsData.map((budget: any) => ({
        label: budget.name,
        value: budget.id,
      }));

  const lineItemOptions =
    budgetsLoading || !selectedBudget
      ? []
      : budgetsData.find((budget: any) => budget.id === selectedBudget).categories;

  // Determines if requisition is submitting for review or just editing to save changes by an admin
  const submittalMode =
    !props.requisitionData || ["DRAFT", "PENDING_CHANGES"].includes(props.requisitionData.status);

  // Determines if draft button shows on bottom of screen
  const showDraftButton =
    !props.editMode || (props.editMode && props.requisitionData?.status === "DRAFT");

  // Determines if a requisition can be changed between reimbursement and non-reimbursement
  const reimbursementToggleEnabled =
    !props.requisitionData ||
    (props.editMode && ["DRAFT", "PENDING_CHANGES"].includes(props.requisitionData.status));

  vendorOptions.sort((a: any, b: any) => a.label.localeCompare(b.label)); // Sorts vendors alphabetically

  const saveDataToServer = async (values: any, requisitionStatus: RequisitionStatus) => {
    const hide = message.loading("Saving requisition...", 0);

    // Setup initial file upload data with old files
    let fileUploadData = values.files
      ? values.files.filter((file: any) => !file.originFileObj)
      : [];

    // Handle file uploads
    try {
      const multipartFormData = new FormData();
      for (const file of values.files) {
        if (file.originFileObj) {
          multipartFormData.append("files", file.originFileObj, file.name);
        }
      }

      if (multipartFormData.has("files")) {
        const result = await axios.post(
          apiUrl(Service.FILES, "/files/upload-finance"),
          multipartFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        fileUploadData = fileUploadData.concat(result.data);
      }
    } catch (err: any) {
      hide();
      message.error("Error uploading files", 2);
      console.error(JSON.parse(JSON.stringify(err)));
      return;
    }

    const mutationData: RequisitionFormData = {
      headline: values.headline,
      project: values.project,
      description: values.description,
      budget: values.budget || undefined,
      paymentRequiredBy: values.paymentRequiredBy
        ? values.paymentRequiredBy.format("YYYY-MM-DD")
        : undefined,
      otherFees: values.otherFees,
      isReimbursement: values.isReimbursement,
      items: values.items
        .filter((item: any) => Object.keys(item).length !== 0)
        .map((item: any) => ({
          name: item.name,
          link: item.link,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
          lineItem: item.lineItem ? item.lineItem[1] : undefined, // Get id of line item, index 0 is category,
          vendor: (isReimbursement ? item.vendor : values.vendor) || undefined, // Map vendor to items based on reimbursement
        })),
      status: requisitionStatus,
      files: fileUploadData,
      purchaseDate: values.purchaseDate ? values.purchaseDate.format("YYYY-MM-DD") : undefined,
    };

    try {
      let result, text;
      if (props.editMode) {
        result = await axios.patch(
          apiUrl(Service.FINANCE, `/requisitions/${props.requisitionId}`),
          mutationData
        );
        text = "Successfully updated";
      } else {
        result = await axios.post(apiUrl(Service.FINANCE, "/requisitions"), mutationData);
        text = "Successfully created";
      }

      console.log(result);
      hide();
      message.success(text, 2);
      navigate(
        `/project/${result.data.project.referenceString}/requisition/${result.data.projectRequisitionId}`
      );
    } catch (err) {
      hide();
      message.error("Error saving", 2);
      console.error(JSON.parse(JSON.stringify(err)));
    }
  };

  const onFinish = async (values: any) => {
    console.log("Form Success:", values);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  const onBudgetChange = (newValue: any) => {
    setSelectedBudget(newValue);

    // Resets existing line item selections
    const newItemValues = form
      .getFieldsValue()
      .items.map((item: any) => ({ ...item, lineItem: null }));
    form.setFieldsValue({ items: newItemValues });
  };

  const onVendorChange = (newValue: any) => {
    // Set vendor for all items
    const newItemValues = form
      .getFieldsValue()
      .items.map((item: any) => ({ ...item, vendor: newValue }));
    form.setFieldsValue({ items: newItemValues });
  };

  const halfLayout = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6,
  };
  const fullLayout = {
    xs: 24,
    sm: 24,
    md: 16,
    lg: 12,
    xl: 12,
  };
  const defaultItem: RequisitionItem = {
    id: 0,
    name: null,
    unitPrice: null,
    quantity: null,
    link: null,
    notes: null,
    received: null,
    lineItem: null,
  };

  const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf", "text/plain"]; // Has backend validation as well
  const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 MB
  const FILE_ERROR_STRING = "Please upload a png, jpeg, or pdf file less than 5 MB";

  const checkFileUpload = (file: RcFile, fileList: RcFile[]) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      message.error(FILE_ERROR_STRING);
      fileList.shift();
    }
    return false;
  };

  return (
    <>
      {/* @ts-ignore */}
      <Helmet>
        <title>
          {props.editMode ? "Piranha - Edit Requisition" : "Piranha - Create Requisition"}
        </title>
      </Helmet>
      <Title>{props.editMode ? "Edit Requisition" : "Create Requisition"}</Title>
      <Form
        name="create"
        initialValues={props.editMode ? props.requisitionData : { items: [defaultItem] }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
        layout="vertical"
        autoComplete="off"
        form={form}
      >
        <Row gutter={[32, 8]} justify="center">
          <Col {...halfLayout}>
            <Form.Item name="headline" rules={[FORM_RULES.requiredRule]} label="Headline">
              <Input placeholder="Giant Outdoor Games" />
            </Form.Item>
          </Col>

          <Col {...halfLayout}>
            <Form.Item name="project" rules={[FORM_RULES.requiredRule]} label="Project">
              <Select
                options={projectOptions}
                showSearch
                optionFilterProp="label"
                loading={projectsLoading}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[32, 8]} justify="center">
          <Col {...fullLayout}>
            <Form.Item
              name="description"
              rules={[FORM_RULES.requiredRule]}
              label={
                <QuestionIconLabel
                  label="Description"
                  helpText="The description of what you want to order and why you need it"
                />
              }
            >
              <TextArea
                // @ts-ignore
                autoSize={{ minRows: 2 }}
                placeholder="This will help spice up our venue, and add the pizzazz that will draw students from around the world!"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[32, 8]} justify="center">
          <Col {...halfLayout}>
            <Form.Item
              name="budget"
              rules={[FORM_RULES.requiredRule]}
              label={
                <QuestionIconLabel
                  label="Budget"
                  helpText="The name of the budget used to draw funds. It is usually the same name as the project."
                />
              }
            >
              <Select
                options={budgetOptions}
                showSearch
                optionFilterProp="label"
                loading={budgetsLoading}
                onChange={onBudgetChange}
              />
            </Form.Item>
          </Col>

          <Col {...halfLayout}>
            {/* TODO: Fill in actual payment required by policy */}
            <Form.Item
              name="paymentRequiredBy"
              label={
                <QuestionIconLabel
                  label="Payment Required By"
                  helpText="If you need the payment by a certain date, list it here (Should be at least 3 days from today)"
                />
              }
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
              label={
                <QuestionIconLabel
                  label="Other Fees"
                  helpText="Any other fees associated with this requisition (Such as shipping and handling, processing fees, etc)"
                />
              }
            >
              <Input prefix="$" type="number" step={0.01} placeholder="68.72" />
            </Form.Item>
          </Col>
          <Col {...halfLayout}>
            <Form.Item
              name="isReimbursement"
              valuePropName="checked"
              label={
                <QuestionIconLabel
                  label="Is this a Reimbursement?"
                  helpText="Select yes if you have paid for this requisition already. Otherwise, HackGT will pay for and order the items."
                />
              }
            >
              <Switch
                checkedChildren="Yes"
                unCheckedChildren="No"
                disabled={!reimbursementToggleEnabled}
                onChange={(newValue: boolean) => setIsReimbursement(newValue)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[32, 8]} justify="center">
          {!isReimbursement && (
            <Col {...halfLayout}>
              <Form.Item name="vendor" rules={[FORM_RULES.requiredRule]} label="Vendor">
                <Select
                  options={vendorOptions}
                  showSearch
                  optionFilterProp="label"
                  loading={vendorsLoading}
                  onChange={onVendorChange}
                />
              </Form.Item>
            </Col>
          )}

          {isReimbursement && (
            <Col {...halfLayout}>
              <Form.Item
                name="purchaseDate"
                rules={[FORM_RULES.requiredRule]}
                label={
                  <QuestionIconLabel
                    label="Purchase Date"
                    helpText="For reimbursements, select the date your purchase was made."
                  />
                }
              >
                <DatePicker format="MMM-D-YYYY" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div>
              {fields.map(field => (
                <Row justify="center" key={field.key}>
                  <Col {...fullLayout}>
                    <RequisitionItemCard
                      deleteButton={fields.length > 1}
                      field={field}
                      remove={remove}
                      lineItemOptions={lineItemOptions}
                      vendorOptions={vendorOptions}
                      isReimbursement={isReimbursement}
                      loading={vendorsLoading}
                    />
                  </Col>
                </Row>
              ))}

              <Row justify="center">
                <Col {...fullLayout}>
                  <Form.Item>
                    <Button type="dashed" onClick={() => add(defaultItem)} block>
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
              name="files"
              label={
                <QuestionIconLabel
                  label="Upload Files"
                  helpText="Add any invoices, receipts, or other documents associated with the requisition."
                />
              }
              valuePropName="fileList"
              getValueFromEvent={(event: any) =>
                Array.isArray(event) ? event : event && event.fileList
              }
            >
              <Dragger
                listType="picture"
                name="file"
                accept={ACCEPTED_FILE_TYPES.join(",")}
                beforeUpload={checkFileUpload}
                multiple
              >
                <UploadOutlined
                  style={{ color: "#40a9ff", fontSize: "36px", marginBottom: "5px" }}
                />
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
              <Button type="primary" htmlType="submit" style={{ margin: "0 10px 10px 0" }}>
                {submittalMode ? "Submit for Review" : "Save"}
              </Button>
              {showDraftButton && <Button onClick={() => onSaveDraft()}>Save as Draft</Button>}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default RequisitionForm;
