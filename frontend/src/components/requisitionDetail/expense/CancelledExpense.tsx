import React from "react";
import { Collapse } from "antd";
import { useMutation } from "@apollo/client";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { UPDATE_REQUISITION_MUTATION } from "../../../types/Requisition";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../RequisitionExpenseSection";

const CancelledExpense: React.FC<RequisitionExpenseSectionProps> = (props) => {
  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION);

  const onFinish = async () => {
    const mutationData = {
      headline: props.requisition.headline,
      project: props.requisition.project.id,
      vendor: props.requisition.vendor?.id,
      status: "DRAFT"
    };

    await saveExpenseData(updateRequisition, { id: props.requisition.id, data: mutationData });
  };

  return (
    <Collapse>
      <RequisitionExpenseRow
        onFinish={onFinish}
        newStatus="DRAFT"
        title="Reactivate Requisition"
        description="This will make the requisition open to edit again."
        key="reactivate"
        buttonText="Reactivate"
      />
    </Collapse>
  );
};

export default CancelledExpense;
