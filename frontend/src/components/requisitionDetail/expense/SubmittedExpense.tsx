import React from "react";
import { Form, Input } from "antd";
import { FORM_RULES } from "../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";

const SubmittedExpense: React.FC = (props) => {
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <>
      <RequisitionExpenseRow
        onFinish={onFinish}
        newStatus="READY_TO_ORDER"
        title="Approve Requisition"
        description="This will approve the requisition. You are signifying that this is a valid purchase."
        key="approve"
        {...props}
      />
      <RequisitionExpenseRow
        onFinish={onFinish}
        newStatus="PENDING_CHANGES"
        title="Ask For More Information"
        description="This will send the requisition back to the creator for changes."
        key="pending"
        {...props}
      >
        <Form.Item
          name="notes"
          rules={[FORM_RULES.requiredRule]}
          label="Notes"
        >
          <Input placeholder="Needs more detail in description." />
        </Form.Item>
      </RequisitionExpenseRow>
    </>
  );
};

export default SubmittedExpense;
