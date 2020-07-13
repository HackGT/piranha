import React from "react";
import { useQuery } from "@apollo/client";
import { Form, Input, Select } from "antd";
import { PAYMENT_METHOD_EXPENSE_QUERY } from "../../../types/PaymentMethod";
import ErrorDisplay from "../../../util/ErrorDisplay";
import { FORM_RULES } from "../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";

const ReadyToOrderExpense: React.FC = (props) => {
  const { loading, data, error } = useQuery(PAYMENT_METHOD_EXPENSE_QUERY);

  if (error) {
    return <ErrorDisplay message={error?.message} />;
  }

  const onFinish = (values: any) => {
    console.log(values);
  };

  const paymentMethodOptions = loading ? [] : data.paymentMethods.map((paymentMethod: any) => ({
    label: paymentMethod.name,
    value: paymentMethod.id
  }));

  return (
    <RequisitionExpenseRow
      onFinish={onFinish}
      newStatus="ORDERED"
      title="Requisition Ordered"
      description="Mark this requisition as being ordered."
      key="ordered"
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
    </RequisitionExpenseRow>
  );
};

export default ReadyToOrderExpense;
