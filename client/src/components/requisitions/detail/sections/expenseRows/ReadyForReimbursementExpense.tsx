import React from "react";
import { Collapse } from "antd";

import { RequisitionExpenseSectionProps } from "../ManageStatusSection";
import SelectFundingSourceRow from "./SelectFundingSourceRow";

const ReadyForReimbursementExpense: React.FC<RequisitionExpenseSectionProps> = props => (
  <Collapse>
    <SelectFundingSourceRow requisition={props.requisition} refetch={props.refetch} />
  </Collapse>
);

export default ReadyForReimbursementExpense;
