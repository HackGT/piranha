import React from "react";
import { Button, Card, Col, Form, Input, InputNumber, Popconfirm, Row, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons/lib";
import { FORM_RULES } from "../../util/util";

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
}

const RequisitionItemCard: React.FC<Props> = (props) => (
  <Card
    size="small"
    title={`Item ${props.field.name + 1}`}
    style={{ marginBottom: "15px" }}
    extra={props.deleteButton && (
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
    )}
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
          rules={[FORM_RULES.requiredRule, FORM_RULES.urlRule]}
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
          normalize={(value: any) => parseInt(value)}
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
          rules={[FORM_RULES.requiredRule]}
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
