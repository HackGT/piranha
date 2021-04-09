import React from "react";
import { Checkbox, Collapse, Form } from "antd";
import { useMutation } from "@apollo/client";

import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { UPDATE_REQUISITION_MUTATION } from "../../../../../queries/Requisition";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../ManageStatusSection";
import CreatePaymentRow from "./CreatePaymentRow";
import { RequisitionItem } from "../../../../../generated/types";

const OrderedExpense: React.FC<RequisitionExpenseSectionProps> = props => {
  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION);

  const onFinish = async (values: any) => {
    const numReceived = Object.values(values).reduce(
      (prev: number, curr: any) => prev + (curr ? 1 : 0),
      0
    );

    let status = ""; // Calculates the requisition status based on the number of items received

    if (numReceived === 0) {
      status = "ORDERED";
    } else if (numReceived === Object.keys(values).length) {
      status = "RECEIVED";
    } else {
      status = "PARTIALLY_RECEIVED";
    }

    const mutationData = {
      items: props.requisition.items.map((item: RequisitionItem) => ({
        name: item.name,
        link: item.link,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
        lineItem: item.lineItem?.id,
        vendor: item.vendor?.id,
        received: !!values[item.name || ""],
      })),
      status,
    };

    await saveExpenseData(updateRequisition, { id: props.requisition.id, data: mutationData });
  };

  return (
    <Collapse>
      <RequisitionExpenseRow
        onFinish={onFinish}
        newStatus="RECEIVED"
        title="Received Items"
        description="Mark the items below as they are received."
        key="received"
        buttonText="Submit"
      >
        {props.requisition.items.map((item: RequisitionItem) => (
          <Form.Item
            name={item.name || ""}
            valuePropName="checked"
            style={{ marginBottom: "10px" }}
            initialValue={item.received}
            key={item.id}
          >
            <Checkbox>{item.name}</Checkbox>
          </Form.Item>
        ))}
      </RequisitionExpenseRow>
      <CreatePaymentRow requisition={props.requisition} />
    </Collapse>
  );
};

export default OrderedExpense;
