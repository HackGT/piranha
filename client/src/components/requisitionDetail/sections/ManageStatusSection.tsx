import React from "react";
import { message, Typography } from "antd";

import CancelledExpense from "./expenseRows/CancelledExpense";
import SubmittedExpense from "./expenseRows/SubmittedExpense";
import OrderedExpense from "./expenseRows/OrderedExpense";
import ReadyToOrderExpense from "./expenseRows/ReadyToOrderExpense";
import ReceivedExpense from "./expenseRows/ReceivedExpense";
import { RequisitionSectionProps } from "../RequisitionDetail";
import ReadyForReimbursementExpense from "./expenseRows/ReadyForReimbursementExpense";
import AwaitingInformationExpense from "./expenseRows/AwaitingInformationExpense";
import ReimbursementInProgressExpense from "./expenseRows/ReimbursementInProgressExpense";
import { Requisition } from "../../../generated/types";

const { Title } = Typography;

export interface RequisitionExpenseSectionProps {
  requisition: Requisition;
}

export const saveExpenseData = async (mutation: any, variables: any) => {
  const hide = message.loading("Saving...", 0);

  try {
    await mutation({ variables });
    hide();
    message.success("Successful!", 2);
  } catch (err) {
    hide();
    message.error("Error saving", 2);
    console.error(JSON.parse(JSON.stringify(err)));
  }
};

const ManageStatusSection: React.FC<RequisitionSectionProps> = props => {
  const { data } = props;

  const content = (() => {
    if (!data.canExpense) {
      return null;
    }

    switch (data.status) {
      case "CANCELLED":
        return <CancelledExpense requisition={data} />;
      case "SUBMITTED":
        return <SubmittedExpense requisition={data} />;

      case "READY_TO_ORDER":
        return <ReadyToOrderExpense requisition={data} />;
      case "ORDERED":
      case "PARTIALLY_RECEIVED":
        return <OrderedExpense requisition={data} />;
      case "RECEIVED":
        return <ReceivedExpense requisition={data} />;

      case "READY_FOR_REIMBURSEMENT":
        return <ReadyForReimbursementExpense requisition={data} />;
      case "AWAITING_INFORMATION":
        return <AwaitingInformationExpense requisition={data} />;
      case "REIMBURSEMENT_IN_PROGRESS":
        return <ReimbursementInProgressExpense requisition={data} />;

      case "DRAFT":
      case "PENDING_CHANGES":
      case "CLOSED":
      default:
        return null;
    }
  })();

  if (!content) {
    return null;
  }

  return (
    <>
      <Title level={3} style={{ marginTop: "30px" }}>
        Manage Status
      </Title>
      {content}
    </>
  );
};

export default ManageStatusSection;
