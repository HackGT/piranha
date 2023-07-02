import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Table } from "antd";
import React, { useState } from "react";
import { RefetchFunction } from "axios-hooks";

import { Category } from "../../../generated/types";
import { ModalState } from "../../modal/FormModalProps";
import LineItemFormModal from "../../modal/formModals/LineItemFormModal";

interface Props {
  budgetId?: number;
  category: Category;
  refetch: RefetchFunction<any, any>;
}

const BudgetDetailCard: React.FC<Props> = props => {
  const [modalState, setModalState] = useState({
    open: false,
    initialValues: null,
  } as ModalState);

  const openModal = (values: any) => {
    setModalState({
      open: true,
      initialValues: values,
      hiddenValues: {
        category: props.category.id,
      },
    });
  };

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
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      render: (record: any) => <EditOutlined onClick={() => openModal(record)}>Edit</EditOutlined>,
    },
  ];

  return (
    <Card title={props.category.name}>
      <Table
        dataSource={props.category.lineItems}
        columns={lineItemColumns}
        pagination={false}
        rowKey="id"
      />

      <Button style={{ marginTop: "10px" }} onClick={() => openModal(null)}>
        Line Item +
      </Button>

      <LineItemFormModal
        budgetId={props.budgetId}
        categoryId={props.category.id}
        modalState={modalState}
        setModalState={setModalState}
        refetch={props.refetch}
      />
    </Card>
  );
};

export default BudgetDetailCard;
