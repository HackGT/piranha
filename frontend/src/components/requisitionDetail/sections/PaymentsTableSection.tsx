import React from "react";
import { Table, Typography } from "antd";
import moment from "moment";
import { formatPrice } from "../../../util/util";
import { Payment } from "../../../types/Payment";
import { RequisitionSectionProps } from "../RequisitionDetail";

const { Text, Title } = Typography;
const { Summary } = Table;

const PaymentsTableSection: React.FC<RequisitionSectionProps> = (props) => {
  const { data } = props;

  if (!data.paymentSet || data.paymentSet.length === 0) {
    return null;
  }

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


  return (
    <>
      <Title level={3} style={{ marginTop: "10px" }}>Payments</Title>
      <Table
        columns={columns}
        dataSource={data.paymentSet}
        pagination={false}
        size="small"
        id="payments-table"
        summary={summaryRow}
      />
    </>
  );
};

export default PaymentsTableSection;
