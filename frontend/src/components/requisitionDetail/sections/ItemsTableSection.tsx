import React from "react";
import { Typography, Table } from "antd";
import { RequisitionItem } from "../../../types/Requisition";
import { formatPrice, getTotalCost } from "../../../util/util";
import { RequisitionSectionProps } from "../RequisitionDetail";

const { Text, Link } = Typography;

type RequisitionItemRow = RequisitionItem & { isDetailsRow: boolean }

const ItemsTableSection: React.FC<RequisitionSectionProps> = (props) => {
  const { data, loading } = props;

  // Boolean determines whether to show green highlights and table footer
  const showReceived = data.status === "PARTIALLY_RECEIVED";
  const greenColor = "#f6ffed";

  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      render: (text: string, record: RequisitionItemRow, index: number) => {
        // If the row shows details, render the appropriate info based on what is currently filled out
        if (record.isDetailsRow) {
          return {
            children: (
              <>
                {props.data.isReimbursement && record.vendor && (
                  <Text style={{ display: "block" }}>
                    <strong>Vendor: </strong>
                    {record.vendor.name}
                  </Text>
                )}
                {record.lineItem && (
                  <Text style={{ display: "block" }}>
                    <strong>Line Item: </strong>
                    {`${record.lineItem.category.name} / ${record.lineItem.name}`}
                  </Text>
                )}
                {record.notes && (
                  <Text style={{ display: "block" }}>
                    <strong>Notes: </strong>
                    {record.notes}
                  </Text>
                )}
              </>
            ),
            props: {
              colSpan: 3,
              style: { background: record.received && showReceived ? greenColor : "" }
            }
          };
        }

        // If the record name is not yet filled out in a draft, show a default item label
        if (!record.name) {
          return `Item ${index / 2 + 1}`;
        }
        
        return {
          children: record.link ? <Link href={record.link} target="_blank">{record.name}</Link> : <Text>{record.name}</Text>,
          props: {
            style: { background: record.received && showReceived ? greenColor : "" }
          }
        };
      }
    },
    {
      title: "Quantity",
      render: (text: number, record: RequisitionItemRow, index: number) => {
        if (record.isDetailsRow) {
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
            style: { background: record.received && showReceived ? greenColor : "" }
          }
        };
      }
    },
    {
      title: "Subtotal",
      render: (text: string, record: RequisitionItemRow, index: number) => {
        if (record.isDetailsRow) {
          return {
            props: {
              colSpan: 0
            }
          };
        }
        return {
          children: formatPrice(record.quantity * record.unitPrice),
          props: {
            style: { background: record.received && showReceived ? greenColor : "" }
          }
        };
      }
    }
  ];

  // Duplicates the rows so that items with notes, line items, or vendor have an extra row
  const rows = loading ? [] : data.requisitionitemSet.flatMap((item) => {
    if (item.notes || item.lineItem || (props.data.isReimbursement && item.vendor)) {
      return [{ ...item, isDetailsRow: false }, { ...item, isDetailsRow: true }];
    }
    return [{ ...item, isDetailsRow: false }];
  });

  return (
    <Table
      columns={columns}
      dataSource={rows}
      pagination={false}
      loading={loading}
      size="small"
      style={{ marginBottom: "15px" }}
      bordered
      scroll={{ x: true }}
      footer={showReceived ? () => <em>* Items in green have been received</em> : undefined}
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
