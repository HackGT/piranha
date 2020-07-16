import React from "react";
import { message, Table, Typography } from "antd";
import moment from "moment";
import { Requisition } from "../../types/Requisition";
import CancelledExpense from "./expense/CancelledExpense";
import SubmittedExpense from "./expense/SubmittedExpense";
import OrderedExpense from "./expense/OrderedExpense";
import ReadyToOrderExpense from "./expense/ReadyToOrderExpense";
import ReceivedExpense from "./expense/ReceivedExpense";
import { formatPrice } from "../../util/util";
import { Payment } from "../../types/Payment";

const { Text, Title } = Typography;
const { Summary } = Table;

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
  const manageContent = (() => {
    if (!props.requisition.canExpense) {
      return null;
    }

    switch (props.requisition.status) {
      case "CANCELLED":
        return <CancelledExpense requisition={props.requisition} />;
      case "SUBMITTED":
        return <SubmittedExpense requisition={props.requisition} />;
      case "READY_TO_ORDER":
        return <ReadyToOrderExpense requisition={props.requisition} />;
      case "ORDERED":
      case "PARTLY_RECEIVED":
        return <OrderedExpense requisition={props.requisition} />;
      case "RECEIVED":
        return <ReceivedExpense requisition={props.requisition} />;
      case "DRAFT":
      case "PENDING_CHANGES":
      case "CLOSED":
      default:
        return null;
    }
  })();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (value: any) => moment(value).format("MMM D, YYYY"),
      key: "date"
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value: any) => formatPrice(value),
      key: "amount"
    },
    {
      title: "Source",
      dataIndex: "fundingSource",
      render: (value: any) => value.name,
      key: "source"
    }
  ];

  const summaryRow = (rowData: Payment[]) => {
    const total = rowData.reduce((prev, curr) => prev + curr.amount, 0);

    return (
      <>
        <Summary.Row>
          <Summary.Cell index={1}>
            <Text strong>Total Paid</Text>
          </Summary.Cell>
          <Summary.Cell colSpan={2} index={2}>
            <Text strong>{formatPrice(total)}</Text>
          </Summary.Cell>
        </Summary.Row>
      </>
    );
  };

  const displayPayments = props.requisition.paymentSet && props.requisition.paymentSet.length > 0;

  return (
    <>
      {displayPayments && (
        <>
          <Title level={3} style={{ marginTop: "10px" }}>Payments</Title>
          <Table
            columns={columns}
            dataSource={props.requisition.paymentSet}
            pagination={false}
            size="small"
            id="payments-table"
            summary={summaryRow}
          />
        </>
      )}
      {manageContent && (
        <>
          <Title level={3} style={{ marginTop: "10px" }}>Manage Status</Title>
          {manageContent}
        </>
      )}
    </>
  );
};

export default RequisitionExpenseSection;
