import React from "react";
import { Button, Card, Col, Form, Input, InputNumber, Row, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons/lib";

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
    extra={props.deleteButton && (
      <Button onClick={() => props.remove(props.field.name)} type="text" size="small" danger>
        Delete
      </Button>
    )}
  >
    <Row gutter={[8, 0]}>
      <Col xs={24} sm={12}>
        <Form.Item
          name={[props.field.name, "name"]}
          fieldKey={[props.field.fieldKey, "name"]}
          rules={[props.rules.requiredRule]}
          label="Name"
        >
          <Input placeholder="Sparkly crayons" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          name={[props.field.name, "link"]}
          fieldKey={[props.field.fieldKey, "link"]}
          rules={[props.rules.requiredRule, props.rules.urlRule]}
          label={(
            <span>
              {"Link "}
              <Tooltip title="The link to the item you want to purchase">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          )}
        >
          <Input type="url" placeholder="http://rubberducks.com" />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[8, 0]}>
      <Col xs={24} sm={12}>
        <Form.Item
          name={[props.field.name, "quantity"]}
          fieldKey={[props.field.fieldKey, "quantity"]}
          rules={[props.rules.requiredRule]}
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
          rules={[props.rules.requiredRule, props.rules.moneyRule]}
          label="Unit Price"
        >
          <Input prefix="$" type="number" placeholder="99.99" />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[8, 0]}>
      <Col span={24}>
        <Form.Item
          name={[props.field.name, "notes"]}
          fieldKey={[props.field.fieldKey, "notes"]}
          rules={[props.rules.requiredRule]}
          label={(
            <span>
              {"Notes "}
              <Tooltip title="Any notes about the item such as specific colors or sizes">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          )}
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
