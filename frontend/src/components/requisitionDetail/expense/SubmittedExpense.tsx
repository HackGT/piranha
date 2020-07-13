import React from "react";
import { Collapse, Form, Input, message } from "antd";
import { useMutation } from "@apollo/client";
import { FORM_RULES } from "../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { CREATE_APPROVAL_MUTATION } from "../../../types/Approval";
import { Requisition } from "../../../types/Requisition";

interface Props {
  requisition: Requisition;
}

const SubmittedExpense: React.FC<Props> = (props) => {
  const [createApproval] = useMutation(CREATE_APPROVAL_MUTATION);

  const onFinish = async (values: any, isApproving: boolean) => {
    const mutationData = {
      isApproving,
      requisition: props.requisition.id,
      ...values
    };

    const hide = message.loading("Saving...", 0);

    try {
      await createApproval({ variables: { data: mutationData } });
      hide();
      message.success("Successful!", 2);
    } catch (err) {
      hide();
      message.error("Error saving", 2);
      console.error(JSON.parse(JSON.stringify(err)));
    }
  };

  return (
    <Collapse>
      <RequisitionExpenseRow
        onFinish={values => onFinish(values, true)}
        newStatus="READY_TO_ORDER"
        title="Approve Requisition"
        description="This will approve the requisition. You are signifying that this is a valid purchase."
        key="approve"
      />
      <RequisitionExpenseRow
        onFinish={values => onFinish(values, false)}
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
  );
};

export default SubmittedExpense;
