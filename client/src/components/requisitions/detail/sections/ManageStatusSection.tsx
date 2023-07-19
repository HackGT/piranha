import React from "react";
import { Typography } from "antd";
import { RefetchFunction } from "axios-hooks";

import CancelledExpense from "./expenseRows/CancelledExpense";
import SubmittedExpense from "./expenseRows/SubmittedExpense";
import OrderedExpense from "./expenseRows/OrderedExpense";
import ReadyToOrderExpense from "./expenseRows/ReadyToOrderExpense";
import ReceivedExpense from "./expenseRows/ReceivedExpense";
import { RequisitionSectionProps } from "../RequisitionDetail";
import ReadyForReimbursementExpense from "./expenseRows/ReadyForReimbursementExpense";
import AwaitingInformationExpense from "./expenseRows/AwaitingInformationExpense";
import ReimbursementInProgressExpense from "./expenseRows/ReimbursementInProgressExpense";
import { Requisition } from "../../../../generated/types";

const { Title } = Typography;

export interface RequisitionExpenseSectionProps {
  requisition: Requisition;
  refetch: RefetchFunction<any, any>;
}

interface Props {
  refetch: RefetchFunction<any, any>;
}

const ManageStatusSection: React.FC<RequisitionSectionProps & Props> = props => {
  const { data } = props;

  const content = (() => {
    if (!data.canExpense) {
      return null;
    }

    switch (data.status) {
      case "CANCELLED":
        return <CancelledExpense requisition={data} refetch={props.refetch} />;
      case "SUBMITTED":
        return <SubmittedExpense requisition={data} refetch={props.refetch} />;

      case "READY_TO_ORDER":
        return <ReadyToOrderExpense requisition={data} refetch={props.refetch} />;
      case "ORDERED":
      case "PARTIALLY_RECEIVED":
        return <OrderedExpense requisition={data} refetch={props.refetch} />;
      case "RECEIVED":
        return <ReceivedExpense requisition={data} refetch={props.refetch} />;

      case "READY_FOR_REIMBURSEMENT":
        return <ReadyForReimbursementExpense requisition={data} refetch={props.refetch} />;
      case "AWAITING_INFORMATION":
        return <AwaitingInformationExpense requisition={data} refetch={props.refetch} />;
      case "REIMBURSEMENT_IN_PROGRESS":
        return <ReimbursementInProgressExpense requisition={data} refetch={props.refetch} />;

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
