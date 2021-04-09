import { Card, Table } from "antd";
import React from "react";

import { Category } from "../../generated/types";

interface Props {
  category: Category;
}

const BudgetDetailCard: React.FC<Props> = props => {
  const lineItemsData = props.category.lineItems.map(item => ({
    key: item.id,
    name: item.name,
    quantity: item.quantity,
    unitCost: item.unitCost,
  }));

  const lineItemColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Cost",
      dataIndex: "unitCost",
      key: "unitCost",
    },
  ];

  return (
    <>
      <Card title={props.category.name} style={{ width: 300 }}>
        <Table dataSource={lineItemsData} columns={lineItemColumns} />
      </Card>
    </>
  );
};

export default BudgetDetailCard;
