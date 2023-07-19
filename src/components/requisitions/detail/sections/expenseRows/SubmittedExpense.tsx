import React from "react";
import { Collapse, Form, Input, message } from "antd";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES } from "../../../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps } from "../ManageStatusSection";
import { RequisitionStatus } from "../../../../../generated/types";

const SubmittedExpense: React.FC<RequisitionExpenseSectionProps> = props => {
  const onFinish = async (values: any, isApproving: boolean) => {
    if (isApproving) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of props.requisition.items) {
        if (!item.vendor?.isActive) {
          message.error(`Vendor ${item.vendor?.name} must be active before approval.`, 2);
          return;
        }
      }
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
      status: newRequisitionStatus,
    };

    const approvalData = {
      isApproving,
      ...values,
    };

    const hide = message.loading("Saving...", 0);

    try {
      await Promise.all([
        axios.patch(
          apiUrl(Service.FINANCE, `/requisitions/${props.requisition.id}`),
          requisitionData
        ),
        axios.post(
          apiUrl(Service.FINANCE, `/requisitions/${props.requisition.id}/actions/create-approval`),
          approvalData
        ),
      ]);

      hide();
      message.success("Successful!", 2);
      props.refetch();
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
        <Form.Item name="notes" rules={[FORM_RULES.requiredRule]} label="Notes">
          <Input placeholder="Needs more detail in description." />
        </Form.Item>
      </RequisitionExpenseRow>
    </Collapse>
  );
};

export default SubmittedExpense;
