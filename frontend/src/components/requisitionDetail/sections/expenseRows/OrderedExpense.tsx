import React from "react";
import { Checkbox, Collapse, Form } from "antd";
import { useMutation } from "@apollo/client";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionItem, UPDATE_REQUISITION_MUTATION } from "../../../../types/Requisition";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../ManageStatusSection";
import CreatePaymentRow from "./CreatePaymentRow";

const OrderedExpense: React.FC<RequisitionExpenseSectionProps> = (props) => {
  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION);

  const onFinish = async (values: any) => {
    const numReceived = Object.values(values).reduce((prev: number, curr: any) => prev + (curr ? 1 : 0), 0);

    let status = ""; // Calculates the requisition status based on the number of items received

    if (numReceived === 0) {
      status = "ORDERED";
    } else if (numReceived === Object.keys(values).length) {
      status = "RECEIVED";
    } else {
      status = "PARTIALLY_RECEIVED";
    }

    const mutationData = {
      headline: props.requisition.headline,
      project: props.requisition.project.id,
      vendor: props.requisition.vendor?.id,
      requisitionitemSet: props.requisition.requisitionitemSet.map((item: RequisitionItem) => ({
        name: item.name,
        link: item.link,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
        lineItem: item.lineItem?.id,
        received: !!values[item.name]
      })),
      status
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
        {props.requisition.requisitionitemSet.map((item: RequisitionItem) => (
          <Form.Item name={item.name} valuePropName="checked" style={{ marginBottom: "10px" }} initialValue={item.received}>
            <Checkbox>{item.name}</Checkbox>
          </Form.Item>
        ))}
      </RequisitionExpenseRow>
      <CreatePaymentRow requisition={props.requisition} />
    </Collapse>
  );
};

export default OrderedExpense;
