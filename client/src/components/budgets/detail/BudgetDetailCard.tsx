import { Button, Card, Table } from "antd";
import React, { useState } from "react";

import { Category } from "../../../generated/types";
import { FormModalProps } from "../../modal/FormModalProps";

export type ModalState = {
  visible: boolean;
  initialValues: any;
}

interface Props {
  category: Category;
  modal: React.FC<FormModalProps>;
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

  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null,
  } as ModalState);

  const openModal = (values: any) => {
    setModalState({
      visible: true,
      initialValues: values,
    });
  };

  
  const Modal = props.modal;



  return (
    <Card title={props.category.name}>
      <Table dataSource={lineItemsData} columns={lineItemColumns} pagination={false} />
      
      <Button onClick={() => openModal(null)}>
        New Line Item
      </Button>

      <Modal modalState={modalState} setModalState={setModalState} />
    </Card>
  );
};

export default BudgetDetailCard;
