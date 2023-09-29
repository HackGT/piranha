import React from "react";
import { Collapse, message } from "antd";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";

import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps } from "../ManageStatusSection";
import CreatePaymentRow from "./CreatePaymentRow";

const ReceivedExpense: React.FC<RequisitionExpenseSectionProps> = props => {
  const onFinish = async () => {
    const requisitionData = {
      status: "CLOSED",
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
        newStatus="CLOSED"
        title="Requisition Closed"
        description="Mark this requisition as being closed. This means all items have been received and all payments have been made."
        key="closed"
        buttonText="Close"
      />
      <CreatePaymentRow requisition={props.requisition} refetch={props.refetch} />
    </Collapse>
  );
};

export default ReceivedExpense;