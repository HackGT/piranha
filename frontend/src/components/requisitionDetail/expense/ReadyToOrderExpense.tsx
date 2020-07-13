import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Collapse, DatePicker, Form, Input, message, Select } from "antd";
import { PAYMENT_METHOD_EXPENSE_QUERY } from "../../../types/PaymentMethod";
import ErrorDisplay from "../../../util/ErrorDisplay";
import { FORM_RULES } from "../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { Requisition } from "../../../types/Requisition";
import { CREATE_PAYMENT_MUTATION } from "../../../types/Payment";

interface Props {
  requisition: Requisition;
}

const ReadyToOrderExpense: React.FC<Props> = (props) => {
  const { loading, data, error } = useQuery(PAYMENT_METHOD_EXPENSE_QUERY);
  const [createPayment] = useMutation(CREATE_PAYMENT_MUTATION);

  if (error) {
    return <ErrorDisplay message={error?.message} />;
  }

  const onFinish = async (values: any) => {
    const mutationData = {
      ...values,
      recipient: props.requisition.vendor.id,
      requisition: props.requisition.id,
      date: values.date.format("YYYY-MM-DD")
    };

    const hide = message.loading("Saving...", 0);

    try {
      await createPayment({ variables: { data: mutationData } });
      hide();
      message.success("Successful!", 2);
    } catch (err) {
      hide();
      message.error("Error saving", 2);
      console.error(JSON.parse(JSON.stringify(err)));
    }
  };

  const paymentMethodOptions = loading ? [] : data.paymentMethods.map((paymentMethod: any) => ({
    label: paymentMethod.name,
    value: paymentMethod.id
  }));

  return (
    <Collapse>
      <RequisitionExpenseRow
        onFinish={onFinish}
        newStatus="ORDERED"
        title="Requisition Ordered"
        description="Mark this requisition as being ordered."
        key="ordered"
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
          label="Order Date"
        >
          <DatePicker format="MMM-D-YYYY" style={{ width: "100%" }} />
        </Form.Item>
      </RequisitionExpenseRow>
    </Collapse>
  );
};

export default ReadyToOrderExpense;
