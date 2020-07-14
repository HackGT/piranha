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
      status: "DRAFT"
    };

    await saveExpenseData(updateRequisition(), { id: props.requisition.id, data: mutationData });
  };

  return (
    <Collapse>
      <RequisitionExpenseRow
        onFinish={onFinish}
        newStatus="DRAFT"
        title="Reactivate Requisition"
        description="This will reactivate the requisition."
        key="reactivate"
      />
    </Collapse>
  );
};

export default CancelledExpense;
