import React from "react";
import { useMutation } from "@apollo/client";
import { Collapse, DatePicker, Form, Input, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons/lib";
import { FORM_RULES } from "../../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../ManageStatusSection";
import { UPDATE_REQUISITION_MUTATION } from "../../../../types/Requisition";
import CreatePaymentRow from "./CreatePaymentRow";

const ReadyToOrderExpense: React.FC<RequisitionExpenseSectionProps> = (props) => {
  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION);

  const onFinish = async (values: any) => {
    const mutationData = {
      headline: props.requisition.headline,
      project: props.requisition.project.id,
      vendor: props.requisition.vendor?.id,
      status: "ORDERED",
      shippingLocation: values.shippingLocation,
      orderDate: values.orderDate.format("YYYY-MM-DD")
    };

    await saveExpenseData(updateRequisition, { id: props.requisition.id, data: mutationData });
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
        <Form.Item
          name="orderDate"
          rules={[FORM_RULES.requiredRule]}
          label="Order Date"
        >
          <DatePicker format="MMM-D-YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="shippingLocation"
          label={(
            <span>
              {"Shipping Location "}
              <Tooltip title="If applicable, list the location the item(s) will be shipped. Ex. Storage Unit, Klaus, Submitter's Apartment.">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          )}
        >
          <Input placeholder="Storage Unit" />
        </Form.Item>
      </RequisitionExpenseRow>
      <CreatePaymentRow requisition={props.requisition} />
    </Collapse>
  );
};

export default ReadyToOrderExpense;