import React from "react";
import { useMutation } from "@apollo/client";
import { Collapse } from "antd";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../ManageStatusSection";
import { UPDATE_REQUISITION_MUTATION } from "../../../../types/Requisition";

const ReimbursementInProgressExpense: React.FC<RequisitionExpenseSectionProps> = (props) => {
  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION);

  const onFinish = async () => {
    const mutationData = {
      headline: props.requisition.headline,
      project: props.requisition.project.id,
      status: "CLOSED"
    };

    await saveExpenseData(updateRequisition, { id: props.requisition.id, data: mutationData });
  };

  return (
    <Collapse>
      <RequisitionExpenseRow
        onFinish={onFinish}
        newStatus="CLOSED"
        title="Requisition Closed"
        description="Mark this requisition as being closed. This means that the submitter has received their reimbursement and all payments have been made."
        key="closed-reimbursement"
        buttonText="Close"
      />
    </Collapse>
  );
};

export default ReimbursementInProgressExpense;
