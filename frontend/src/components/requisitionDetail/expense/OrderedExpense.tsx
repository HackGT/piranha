import React from "react";
import { Checkbox, Collapse, Form } from "antd";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionItem } from "../../../types/Requisition";
import { RequisitionExpenseSectionProps } from "../RequisitionExpenseSection";

const OrderedExpense: React.FC<RequisitionExpenseSectionProps> = (props) => {
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Collapse>
      <RequisitionExpenseRow
        onFinish={onFinish}
        newStatus="RECEIVED"
        title="Received Items"
        description="Mark the items below as they are received."
        key="received"
      >
        {props.requisition.requisitionitemSet.map((item: RequisitionItem) => (
          <Form.Item name={item.name} valuePropName="checked" style={{ marginBottom: "10px" }} initialValue={item.received}>
            <Checkbox>{item.name}</Checkbox>
          </Form.Item>
        ))}
      </RequisitionExpenseRow>
    </Collapse>
  );
};

export default OrderedExpense;
