import React from "react";
import { Collapse, DatePicker, Form, Input, message } from "antd";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";

import { FORM_RULES } from "../../../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps } from "../ManageStatusSection";
import CreatePaymentRow from "./CreatePaymentRow";
import QuestionIconLabel from "../../../../../util/QuestionIconLabel";

const ReadyToOrderExpense: React.FC<RequisitionExpenseSectionProps> = props => {
  const onFinish = async (values: any) => {
    const requisitionData = {
      status: "ORDERED",
      shippingLocation: values.shippingLocation,
      orderDate: values.orderDate.format("YYYY-MM-DD"),
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
        newStatus="ORDERED"
        title="Requisition Ordered"
        description="Mark this requisition as being ordered."
        key="ordered"
        buttonText="Ordered"
      >
        <Form.Item name="orderDate" rules={[FORM_RULES.requiredRule]} label="Order Date">
          <DatePicker format="MMM-D-YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="shippingLocation"
          label={
            <QuestionIconLabel
              label="Shipping Location"
              helpText="If applicable, list the location the item(s) will be shipped. Ex. Storage Unit, Klaus, Submitter's Apartment."
            />
          }
        >
          <Input placeholder="Storage Unit" />
        </Form.Item>
      </RequisitionExpenseRow>
      <CreatePaymentRow requisition={props.requisition} refetch={props.refetch} />
    </Collapse>
  );
};

export default ReadyToOrderExpense;
