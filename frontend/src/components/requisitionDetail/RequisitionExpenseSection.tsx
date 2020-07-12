import React from "react";
import { Collapse, Form, Input, Typography } from "antd";
import { Requisition } from "../../types/Requisition";
import { FORM_RULES } from "../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";

const { Title } = Typography;

interface Props {
  requisition: Requisition;
}

const RequisitionExpenseSection: React.FC<Props> = (props) => {
  const onFinish = (key: string, values: any) => {
    console.log("Form Success:", values);
  };

  return (
    <>
      <Title level={3} style={{ marginTop: "10px" }}>Manage Status</Title>
      <Collapse bordered={false}>
        <RequisitionExpenseRow
          onFinish={onFinish}
          newStatus="READY_TO_ORDER"
          title="Approve Requisition"
          description="This will approve the requisition. You are signifying that this is a valid purchase."
          key="approve"
        />
        <RequisitionExpenseRow
          onFinish={onFinish}
          newStatus="PENDING_CHANGES"
          title="Ask For More Information"
          description="This will send the requisition back to the creator for changes."
          key="pending"
        >
          <Form.Item
            name="notes"
            rules={[FORM_RULES.requiredRule]}
            label="Notes"
          >
            <Input placeholder="Needs more detail in description." />
          </Form.Item>
        </RequisitionExpenseRow>
      </Collapse>
    </>
  );
};

export default RequisitionExpenseSection;
