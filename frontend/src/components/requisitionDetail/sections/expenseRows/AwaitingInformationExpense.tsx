import React from "react";
import { useMutation } from "@apollo/client";
import { Collapse, DatePicker, Form, Input, Select } from "antd";
import { FORM_RULES } from "../../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { UPDATE_REQUISITION_AND_CREATE_PAYMENT_MUTATION } from "../../../../types/Payment";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../ManageStatusSection";
import ErrorDisplay from "../../../../util/ErrorDisplay";

const AwaitingInformationExpense: React.FC<RequisitionExpenseSectionProps> = (props) => {
  const [updateRequisitionAndCreatePayment] = useMutation(UPDATE_REQUISITION_AND_CREATE_PAYMENT_MUTATION);

  if (!props.requisition.fundingSource) {
    const error = new Error("No funding source provided. Please contact an admin.");
    return <ErrorDisplay error={error} />;
  }

  const { isDirectPayment } = props.requisition.fundingSource;

  const onFinish = async (values: any) => {
    const requisitionData = {
      headline: props.requisition.headline,
      project: props.requisition.project.id,
      status: isDirectPayment ? "CLOSED" : "REIMBURSEMENT_IN_PROGRESS"
    };

    const paymentData = {
      amount: values.amount,
      fundingSource: props.requisition.fundingSource.id,
      date: values.date.format("YYYY-MM-DD"),
      recipient: props.requisition.vendor.id,
      requisition: props.requisition.id
    };

    await saveExpenseData(updateRequisitionAndCreatePayment, {
      id: props.requisition.id,
      requisitionData,
      paymentData
    });
  };

  const paymentMethod = [{
    label: props.requisition.fundingSource.name,
    value: props.requisition.fundingSource.id
  }];

  return (
    <Collapse>
      <RequisitionExpenseRow
        onFinish={onFinish}
        newStatus={isDirectPayment ? "CLOSED" : "REIMBURSEMENT_IN_PROGRESS"}
        title={isDirectPayment ? "Payment Sent" : `Request Submitted to ${props.requisition.fundingSource.name} account`}
        description={isDirectPayment
          ? "After sending funds to submitter, fill in the fields below to close the requisition."
          : "Mark reimbursement as being submitted for funds distribution. Will also create a payment for this order."}
        key="payment-submitted"
        buttonText="Submit"
      >
        <Form.Item
          name="amount"
          rules={[FORM_RULES.requiredRule, FORM_RULES.moneyRule]}
          normalize={(value: any) => (value ? parseFloat(value) : null)}
          label="Amount Paid"
        >
          <Input prefix="$" type="number" placeholder="23.90" />
        </Form.Item>
        <Form.Item
          name="fundingSource"
          rules={[FORM_RULES.requiredRule]}
          label="Funding Source"
          initialValue={props.requisition.fundingSource.id}
        >
          <Select options={paymentMethod} optionFilterProp="label" disabled />
        </Form.Item>
        <Form.Item
          name="date"
          rules={[FORM_RULES.requiredRule]}
          label="Payment Date"
        >
          <DatePicker format="MMM-D-YYYY" style={{ width: "100%" }} />
        </Form.Item>
      </RequisitionExpenseRow>
    </Collapse>
  );
};

export default AwaitingInformationExpense;