import React from "react";
import RequisitionExpenseRow from "./RequisitionExpenseRow";

const OrderedExpense: React.FC = (props) => {
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <RequisitionExpenseRow
      onFinish={onFinish}
      newStatus="RECEIVED"
      title="Received Items"
      description="Mark the items below as they are received."
      key="received"
      {...props}
    />
  );
};

export default OrderedExpense;
