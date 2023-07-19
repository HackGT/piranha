import React from "react";
import { Collapse, message } from "antd";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";

import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps } from "../ManageStatusSection";

const CancelledExpense: React.FC<RequisitionExpenseSectionProps> = props => {
  const onFinish = async () => {
    const requisitionData = {
      status: "DRAFT",
    };

    const hide = message.loading("Saving...", 0);

    try {
      await axios.patch(
        apiUrl(Service.FINANCE, `/requisitions/${props.requisition.id}`),
        requisitionData
      );

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
