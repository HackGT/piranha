import React from "react";
import { Typography, Table } from "antd";
import { Requisition, RequisitionItem } from "../../types/Requisition";
import { formatPrice, getTotalCost } from "../../util/util";

const { Text, Link } = Typography;

interface Props {
  data: Requisition;
  loading: boolean;
}

const RequisitionItemsTable: React.FC<Props> = (props) => {
  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      render: (text: string, record: RequisitionItem, index: number) => {
        if (index % 2 === 0) {
          return (
            <Link href={record.link} target="_blank">{record.name}</Link>
          );
        }
        return {
          children: <Text>{record.notes}</Text>,
          props: {
            colSpan: 3
          }
        };
      }
    },
    {
      title: "Quantity",
      render: (text: number, record: RequisitionItem, index: number) => {
        if (index % 2 === 0) {
          return `${record.quantity} @ ${formatPrice(record.unitPrice)}`;
        }
        return {
          props: {
            colSpan: 0
          }
        };
      }
    },
    {
      title: "Subtotal",
      render: (text: string, record: RequisitionItem, index: number) => {
        if (index % 2 === 0) {
          return formatPrice(record.quantity * record.unitPrice);
        }
        return {
          props: {
            colSpan: 0
          }
        };
      }
    }
  ];

  // Duplicates the rows so every other row can be used for the notes
  const rows = props.loading ? [] : props.data.requisitionitemSet.flatMap((item) => [item, item]);

  return (
    <Table
      columns={columns}
      dataSource={rows}
      pagination={false}
      loading={props.loading}
      size="small"
      bordered
      scroll={{ x: true }}
      summary={(items: RequisitionItem[]) => (props.loading ? null
        : (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell index={1} colSpan={2}>
                <Text strong>Subtotal</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong>{formatPrice(getTotalCost(props.data, false))}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={1} colSpan={2}>
                <Text>Other Fees</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text>{formatPrice(props.data.otherFees)}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={1} colSpan={2}>
                <Text strong>Total</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong>{formatPrice(getTotalCost(props.data, true))}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        ))}
    />
  );
};

export default RequisitionItemsTable;
