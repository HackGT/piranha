import React from "react";
import { Collapse } from "antd";
import { useMutation } from "@apollo/client";

import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { UPDATE_REQUISITION_MUTATION } from "../../../../../queries/Requisition";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../ManageStatusSection";

const CancelledExpense: React.FC<RequisitionExpenseSectionProps> = props => {
  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION);

  const onFinish = async () => {
    const mutationData = {
      status: "DRAFT",
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
