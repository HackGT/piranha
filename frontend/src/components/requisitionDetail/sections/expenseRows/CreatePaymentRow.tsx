import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DatePicker, Form, Input, Select } from "antd";
import { FormInstance } from "antd/es/form";
import { PAYMENT_METHOD_EXPENSE_QUERY } from "../../../../types/PaymentMethod";
import ErrorDisplay from "../../../../util/ErrorDisplay";
import { FORM_RULES } from "../../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { CREATE_PAYMENT_MUTATION } from "../../../../types/Payment";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../ManageStatusSection";

const CreatePaymentRow: React.FC<RequisitionExpenseSectionProps> = (props) => {
  const { loading, data, error } = useQuery(PAYMENT_METHOD_EXPENSE_QUERY);
  const [createPayment] = useMutation(CREATE_PAYMENT_MUTATION);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const onFinish = async (values: any, form: FormInstance) => {
    const mutationData = {
      amount: values.amount,
      fundingSource: values.fundingSource,
      date: values.date.format("YYYY-MM-DD"),
      recipient: props.requisition.vendor.id,
      requisition: props.requisition.id
    };

    await saveExpenseData(createPayment, { data: mutationData });

    form.resetFields();
  };

  const paymentMethodOptions = loading ? [] : data.paymentMethods.map((paymentMethod: any) => ({
    label: paymentMethod.name,
    value: paymentMethod.id
  }));

  return (
    <RequisitionExpenseRow
      onFinish={onFinish}
      title="Create Payment"
      description="Create a payment for this order. Note: multiple payments can be made as applicable."
      key="payment"
      buttonText="Create"
      {...props}
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
      >
        <Select options={paymentMethodOptions} optionFilterProp="label" loading={loading} />
      </Form.Item>
      <Form.Item
        name="date"
        rules={[FORM_RULES.requiredRule]}
        label="Payment Date"
      >
        <DatePicker format="MMM-D-YYYY" style={{ width: "100%" }} />
      </Form.Item>
    </RequisitionExpenseRow>
  );
};

export default CreatePaymentRow;
