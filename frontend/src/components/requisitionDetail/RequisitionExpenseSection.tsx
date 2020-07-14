import React from "react";
import { message, Typography } from "antd";
import { Requisition } from "../../types/Requisition";
import CancelledExpense from "./expense/CancelledExpense";
import SubmittedExpense from "./expense/SubmittedExpense";
import ReadyToOrderExpense from "./expense/ReadyToOrderExpense";
import OrderedExpense from "./expense/OrderedExpense";

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

const RequisitionExpenseSection: React.FC<RequisitionExpenseSectionProps> = (props) => {
  let content: any = null;

  switch (props.requisition.status) {
    case "CANCELLED":
      content = <CancelledExpense requisition={props.requisition} />;
      break;
    case "SUBMITTED":
      content = <SubmittedExpense requisition={props.requisition} />;
      break;
    case "READY_TO_ORDER":
      content = <ReadyToOrderExpense requisition={props.requisition} />;
      break;
    case "ORDERED":
      content = <OrderedExpense requisition={props.requisition} />;
      break;
    case "DRAFT":
    case "PENDING_CHANGES":
    case "RECEIVED":
    default:
      break;
  }

  return (
    content
    && (
      <>
        <Title level={3} style={{ marginTop: "10px" }}>Manage Status</Title>
        {content}
      </>
    )
  );
};

export default RequisitionExpenseSection;
