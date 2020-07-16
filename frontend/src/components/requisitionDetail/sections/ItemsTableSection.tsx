import React from "react";
import { Typography, Table } from "antd";
import { RequisitionItem } from "../../../types/Requisition";
import { formatPrice, getTotalCost } from "../../../util/util";
import { RequisitionSectionProps } from "../RequisitionDetail";

const { Text, Link } = Typography;

type RequisitionItemRow = RequisitionItem & { isNotesRow: boolean }

const ItemsTableSection: React.FC<RequisitionSectionProps> = (props) => {
  const { data, loading } = props;
  
  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      render: (text: string, record: RequisitionItemRow, index: number) => {
        if (record.isNotesRow) {
          return {
            children: <Text>{record.notes}</Text>,
            props: {
              colSpan: 3,
              style: { background: record.received && data.status === "PARTLY_RECEIVED" ? "#f6ffed" : "" }
            }
          };
        }
        if (!record.name) {
          return `Item ${index / 2 + 1}`;
        }
        return {
          children: <Link href={record.link} target="_blank">{record.name}</Link>,
          props: {
            style: { background: record.received && data.status === "PARTLY_RECEIVED" ? "#f6ffed" : "" }
          }
        };
      }
    },
    {
      title: "Quantity",
      render: (text: number, record: RequisitionItemRow, index: number) => {
        if (record.isNotesRow) {
          return {
            props: {
              colSpan: 0
            }
          };
        }
        if (!record.quantity || !record.unitPrice) {
          return "Not Set";
        }
        return {
          children: `${record.quantity} @ ${formatPrice(record.unitPrice)}`,
          props: {
            style: { background: record.received && data.status === "PARTLY_RECEIVED" ? "#f6ffed" : "" }
          }
        };
      }
    },
    {
      title: "Subtotal",
      render: (text: string, record: RequisitionItemRow, index: number) => {
        if (record.isNotesRow) {
          return {
            props: {
              colSpan: 0
            }
          };
        }
        return {
          children: formatPrice(record.quantity * record.unitPrice),
          props: {
            style: { background: record.received && data.status === "PARTLY_RECEIVED" ? "#f6ffed" : "" }
          }
        };
      }
    }
  ];

  // Duplicates the rows so that items with notes have an extra row
  const rows = loading ? [] : data.requisitionitemSet.flatMap((item) => {
    if (item.notes) {
      return [{ ...item, isNotesRow: false }, { ...item, isNotesRow: true }];
    }
    return [{ ...item, isNotesRow: false }];
  });

  return (
    <Table
      columns={columns}
      dataSource={rows}
      pagination={false}
      loading={loading}
      size="small"
      bordered
      scroll={{ x: true }}
      footer={data.status === "PARTLY_RECEIVED" ? () => <em>* Items in green have been received</em> : undefined}
      summary={() => (loading ? null
        : (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell index={1} colSpan={2}>
                <Text strong>Subtotal</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong>{formatPrice(getTotalCost(data, false))}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={1} colSpan={2}>
                <Text>Other Fees</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text>{formatPrice(data.otherFees)}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={1} colSpan={2}>
                <Text strong>Total</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong>{formatPrice(getTotalCost(data, true))}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        ))}
    />
  );
};

export default ItemsTableSection;
