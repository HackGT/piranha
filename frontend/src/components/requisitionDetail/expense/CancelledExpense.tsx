import React from "react";
import { Collapse } from "antd";
import RequisitionExpenseRow from "./RequisitionExpenseRow";

const CancelledExpense: React.FC = (props) => {
  const onFinish = (values: any) => {
    console.log(values);
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
