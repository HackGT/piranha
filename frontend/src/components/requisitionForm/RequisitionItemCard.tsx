import React from "react";
import { Button, Card, Col, Form, Input, InputNumber, Row } from "antd";

const { TextArea } = Input;

interface FieldData {
  name: number;
  key: number;
  fieldKey: number;
}

interface Props {
  field: FieldData;
  deleteButton: boolean;
  rules: any;
  remove: (index: number) => void;
}

const RequisitionItemCard: React.FC<Props> = (props) => (
  <Card
    size="small"
    title={`Item ${props.field.name + 1}`}
    style={{ marginBottom: "15px" }}
    extra={props.deleteButton
      ? (
        <Button onClick={() => props.remove(props.field.name)} type="text" size="small" danger>
          Delete
        </Button>
      ) : null}
  >
    <Row gutter={[8, 0]}>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Name"
          name={[props.field.name, "name"]}
          fieldKey={[props.field.fieldKey, "name"]}
          rules={[props.rules.requiredRule]}
        >
          <Input placeholder="Sparkly crayons" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          label="Link"
          name={[props.field.name, "link"]}
          fieldKey={[props.field.fieldKey, "link"]}
          rules={[props.rules.requiredRule, props.rules.urlRule]}
        >
          <Input type="url" placeholder="http://rubberducks.com" />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[8, 0]}>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Quantity"
          name={[props.field.name, "quantity"]}
          fieldKey={[props.field.fieldKey, "quantity"]}
          rules={[props.rules.requiredRule]}
        >
          <InputNumber
            prefix="$"
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
          label="Unit Price"
          name={[props.field.name, "unitPrice"]}
          fieldKey={[props.field.fieldKey, "unitPrice"]}
          rules={[props.rules.requiredRule, props.rules.moneyRule]}
        >
          <Input prefix="$" type="number" placeholder="99.99" />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[8, 0]}>
      <Col span={24}>
        <Form.Item
          label="Notes"
          name={[props.field.name, "notes"]}
          fieldKey={[props.field.fieldKey, "notes"]}
          rules={[props.rules.requiredRule]}
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
