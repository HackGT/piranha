import React from "react";
import { Button, Form, Collapse, Typography } from "antd";
import { FormInstance } from "antd/es/form";
import { FaShieldAlt } from "react-icons/fa";

import { RequisitionTag } from "../../../../../util/CustomTags";
import { RequisitionStatus } from "../../../../../generated/types";

const { Text } = Typography;
const { Panel } = Collapse;

interface Props {
  onFinish: (values: any, form: FormInstance) => void;
  newStatus?: RequisitionStatus;
  title: string;
  description: string;
  key: string;
  buttonText: string;
}

const RequisitionExpenseRow: React.FC<Props> = props => {
  const [form] = Form.useForm();

  return (
    <Panel
      extra={
        props.newStatus && (
          <>
            <Text>Update status to</Text>
            <RequisitionTag status={props.newStatus} style={{ margin: "0 0 0 8px" }} />
          </>
        )
      }
      {...props} // https://github.com/ant-design/ant-design/issues/4853
      header={<Text strong>{props.title}</Text>}
    >
      <Text>{props.description}</Text>
      <Form
        name={props.key}
        onFinish={(values: any) => props.onFinish(values, form)}
        autoComplete="off"
        style={{ marginTop: "15px" }}
        form={form}
      >
        {props.children}
        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit">
            <FaShieldAlt style={{ verticalAlign: "-0.125em", marginRight: "0.5em" }} />
            {props.buttonText}
          </Button>
        </Form.Item>
      </Form>
    </Panel>
  );
};

export default RequisitionExpenseRow;
