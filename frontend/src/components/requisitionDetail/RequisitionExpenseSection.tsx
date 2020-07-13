import React from "react";
import { Collapse, Typography } from "antd";
import { RequisitionStatus } from "../../types/Requisition";
import CancelledExpense from "./expense/CancelledExpense";
import SubmittedExpense from "./expense/SubmittedExpense";
import ReadyToOrderExpense from "./expense/ReadyToOrderExpense";
import OrderedExpense from "./expense/OrderedExpense";

const { Title } = Typography;

interface Props {
  status: RequisitionStatus;
}

const RequisitionExpenseSection: React.FC<Props> = (props) => {
  let content: any = null;

  switch (props.status) {
    case "CANCELLED":
      content = <CancelledExpense />;
      break;
    case "SUBMITTED":
      content = <SubmittedExpense />;
      break;
    case "READY_TO_ORDER":
      content = <ReadyToOrderExpense />;
      break;
    case "ORDERED":
      content = <OrderedExpense />;
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
        <Collapse>
          {content}
        </Collapse>
      </>
    )
  );
};

export default RequisitionExpenseSection;
