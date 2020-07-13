import React from "react";
import RequisitionExpenseRow from "./RequisitionExpenseRow";

const CancelledExpense: React.FC = (props) => {
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <RequisitionExpenseRow
      onFinish={onFinish}
      newStatus="DRAFT"
      title="Reactivate Requisition"
      description="This will reactivate the requisition."
      key="reactivate"
      {...props}
    />
  );
};

export default CancelledExpense;
