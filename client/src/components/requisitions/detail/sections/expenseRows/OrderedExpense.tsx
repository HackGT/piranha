import React from "react";
import { Checkbox, Collapse, Form, message } from "antd";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";

import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps } from "../ManageStatusSection";
import CreatePaymentRow from "./CreatePaymentRow";
import { RequisitionItem } from "../../../../../generated/types";

const OrderedExpense: React.FC<RequisitionExpenseSectionProps> = props => {
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

    const requisitionData = {
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

    const hide = message.loading("Saving...", 0);

    try {
      await axios.patch(
        apiUrl(Service.FINANCE, `/requisitions/${props.requisition.id}`),
        requisitionData
      );

      hide();
      message.success("Successful!", 2);
      props.refetch();
    } catch (err) {
      hide();
      message.error("Error saving", 2);
      console.error(JSON.parse(JSON.stringify(err)));
    }
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
      <CreatePaymentRow requisition={props.requisition} refetch={props.refetch} />
    </Collapse>
  );
};

export default OrderedExpense;
