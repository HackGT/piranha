import React from "react";
import { Collapse } from "antd";
import { RequisitionExpenseSectionProps } from "../ManageStatusSection";
import SelectFundingSourceRow from "./SelectFundingSourceRow";

const ReadyForReimbursementExpense: React.FC<RequisitionExpenseSectionProps> = props => (
  <Collapse>
    <SelectFundingSourceRow requisition={props.requisition} />
  </Collapse>
);

export default ReadyForReimbursementExpense;
