import React from "react";
import { useMutation } from "@apollo/client";
import { Collapse } from "antd";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../RequisitionExpenseSection";
import { UPDATE_REQUISITION_MUTATION } from "../../../types/Requisition";
import CreatePaymentRow from "./CreatePaymentRow";

const ReceivedExpense: React.FC<RequisitionExpenseSectionProps> = (props) => {
  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION);

  const onFinish = async () => {
    const mutationData = {
      headline: props.requisition.headline,
      project: props.requisition.project.id,
      vendor: props.requisition.vendor?.id,
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
        description="Mark this requisition as being closed. This means all items have been received and all payments have been made."
        key="closed"
      />
      <CreatePaymentRow requisition={props.requisition} />
    </Collapse>
  );
};

export default ReceivedExpense;
