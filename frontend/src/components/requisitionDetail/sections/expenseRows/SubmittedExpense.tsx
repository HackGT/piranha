import React from "react";
import { Collapse, Form, Input, message } from "antd";
import { useMutation } from "@apollo/client";
import { FORM_RULES } from "../../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { UPDATE_REQUISITION_AND_CREATE_APPROVAL_MUTATION } from "../../../../types/Approval";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../ManageStatusSection";
import { RequisitionStatus } from "../../../../types/Requisition";

const SubmittedExpense: React.FC<RequisitionExpenseSectionProps> = (props) => {
  const [updateRequisitionAndCreateApproval] = useMutation(UPDATE_REQUISITION_AND_CREATE_APPROVAL_MUTATION);

  const onFinish = async (values: any, isApproving: boolean) => {
    if (isApproving && !props.requisition.vendor?.isActive) {
      message.error("Vendor must be active before approval.", 2);
      return;
    }
    let newRequisitionStatus: RequisitionStatus;

    if (isApproving && props.requisition.isReimbursement) {
      newRequisitionStatus = "READY_FOR_REIMBURSEMENT";
    } else if (isApproving && !props.requisition.isReimbursement) {
      newRequisitionStatus = "READY_TO_ORDER";
    } else {
      newRequisitionStatus = "PENDING_CHANGES";
    }

    const requisitionData = {
      status: newRequisitionStatus
    };

    const approvalData = {
      isApproving,
      requisition: props.requisition.id,
      ...values
    };

    await saveExpenseData(updateRequisitionAndCreateApproval, {
      id: props.requisition.id,
      requisitionData,
      approvalData
    });
  };

  return (
    <Collapse>
      <RequisitionExpenseRow
        onFinish={values => onFinish(values, true)}
        newStatus={props.requisition.isReimbursement ? "READY_FOR_REIMBURSEMENT" : "READY_TO_ORDER"}
        title="Approve Requisition"
        description="This will approve the requisition. You are signifying that this is a valid purchase."
        key="approve"
        buttonText="Approve"
      />
      <RequisitionExpenseRow
        onFinish={values => onFinish(values, false)}
        newStatus="PENDING_CHANGES"
        title="Ask For More Information"
        description="This will send the requisition back to the creator for changes."
        key="pending"
        buttonText="Request Changes"
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
