import React from "react";
import { Typography } from "antd";
import { Requisition } from "../../types/Requisition";
import CancelledExpense from "./expense/CancelledExpense";
import SubmittedExpense from "./expense/SubmittedExpense";
import ReadyToOrderExpense from "./expense/ReadyToOrderExpense";
import OrderedExpense from "./expense/OrderedExpense";

const { Title } = Typography;

interface Props {
  requisition: Requisition;
}

const RequisitionExpenseSection: React.FC<Props> = (props) => {
  let content: any = null;

  switch (props.requisition.status) {
    case "CANCELLED":
      content = <CancelledExpense />;
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
