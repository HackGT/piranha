import React from "react";
import {
  Button,
  Card,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
} from "antd";

import { FORM_RULES } from "../../../util/util";
import QuestionIconLabel from "../../../util/QuestionIconLabel";

const { TextArea } = Input;

interface FieldData {
  name: number;
  key: number;
  fieldKey: number;
}

interface Props {
  field: FieldData;
  deleteButton: boolean;
  remove: (index: number) => void;
  lineItemOptions: any;
  vendorOptions: any;
  isReimbursement: boolean;
  loading: boolean;
}

const RequisitionItemCard: React.FC<Props> = props => (
  <Card
    size="small"
    title={`Item ${props.field.name + 1}`}
    style={{ marginBottom: "15px" }}
    extra={
      props.deleteButton && (
        <Popconfirm
          title="Are you sure you want to delete this item?"
          onConfirm={() => props.remove(props.field.name)}
          okText="Delete"
          cancelText="Cancel"
        >
          <Button type="text" size="small" danger>
            Delete
          </Button>
        </Popconfirm>
      )
    }
  >
    <Row gutter={[8, 0]}>
      <Col xs={24} sm={12}>
        <Form.Item
          name={[props.field.name, "name"]}
          fieldKey={[props.field.fieldKey, "name"]}
          rules={[FORM_RULES.requiredRule]}
          label="Name"
        >
          <Input placeholder="Sparkly crayons" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          name={[props.field.name, "link"]}
          fieldKey={[props.field.fieldKey, "link"]}
          rules={[FORM_RULES.urlRule]}
          label={
            <QuestionIconLabel label="Link" helpText="The link to this item (if applicable)" />
          }
        >
          <Input placeholder="http://rubberducks.com" />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[8, 0]}>
      <Col xs={24} sm={12}>
        <Form.Item
          name={[props.field.name, "quantity"]}
          fieldKey={[props.field.fieldKey, "quantity"]}
          rules={[FORM_RULES.requiredRule]}
          label="Quantity"
        >
          <InputNumber
            type="number"
            min={1}
            precision={0}
            style={{ width: "100%" }}
            placeholder="578"
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          name={[props.field.name, "unitPrice"]}
          fieldKey={[props.field.fieldKey, "unitPrice"]}
          rules={[FORM_RULES.requiredRule, FORM_RULES.moneyRule]}
          label="Unit Price"
          normalize={(value: any) => (value ? parseFloat(value) : null)}
        >
          <Input prefix="$" type="number" step={0.01} placeholder="99.99" />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[8, 0]} justify="center">
      <Col xs={24} sm={12}>
        <Form.Item
          name={[props.field.name, "lineItem"]}
          fieldKey={[props.field.fieldKey, "lineItem"]}
          rules={[FORM_RULES.requiredRule]}
          label={
            <QuestionIconLabel
              label="Line Item"
              helpText="The specific line item from the budget separated by category. Please select a budget first."
            />
          }
        >
          <Cascader
            options={props.lineItemOptions}
            fieldNames={{ label: "name", value: "id", children: "lineItems" }}
            disabled={props.lineItemOptions.length === 0}
            placeholder=""
          />
        </Form.Item>
      </Col>

      {props.isReimbursement && (
        <Col xs={24} sm={12}>
          <Form.Item
            name={[props.field.name, "vendor"]}
            fieldKey={[props.field.fieldKey, "vendor"]}
            rules={[FORM_RULES.requiredRule]}
            label={
              <QuestionIconLabel
                label="Vendor"
                helpText="For reimbursements, please specify the vendor per item."
              />
            }
          >
            <Select
              options={props.vendorOptions}
              showSearch
              optionFilterProp="label"
              loading={props.loading}
            />
          </Form.Item>
        </Col>
      )}
    </Row>

    <Row gutter={[8, 0]}>
      <Col span={24}>
        <Form.Item
          name={[props.field.name, "notes"]}
          fieldKey={[props.field.fieldKey, "notes"]}
          label={
            <QuestionIconLabel
              label="Notes"
              helpText="Any notes about the item such as specific colors or sizes"
            />
          }
        >
          <TextArea
            autoSize={{ minRows: 2 }}
            placeholder="This item forms a part of the cute dog drawing contest."
          />
        </Form.Item>
      </Col>
    </Row>
  </Card>
);

export default RequisitionItemCard;
