import React from "react";
import { DatePicker, Form, Input, Select, message } from "antd";
import { FormInstance, Rule } from "antd/es/form";
import { ErrorScreen, Service, apiUrl } from "@hex-labs/core";
import useAxios from "axios-hooks";
import axios from "axios";

import { FORM_RULES, formatPrice, getTotalCost } from "../../../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps } from "../ManageStatusSection";

const CreatePaymentRow: React.FC<RequisitionExpenseSectionProps> = props => {
  const [{ loading, data: paymentMethods, error }] = useAxios(
    apiUrl(Service.FINANCE, "/payment-methods?isActive=true")
  );

  if (error) {
    return <ErrorScreen error={error} />;
  }

  const totalAlreadyPaid =
    props.requisition.payments?.reduce((prev, curr) => prev + curr.amount, 0) || 0;
  const remainingBalance = getTotalCost(props.requisition, true) - totalAlreadyPaid;
  const maxAmountRule: Rule = {
    max: remainingBalance,
    type: "number",
    message: "Payment amount cannot be more than the remaining balance",
  };

  if (remainingBalance <= 0) {
    return null;
  }

  const onFinish = async (values: any, form: FormInstance) => {
    const paymentData = {
      amount: values.amount,
      fundingSource: values.fundingSource,
      date: values.date.format("YYYY-MM-DD"),
    };

    const hide = message.loading("Saving...", 0);

    try {
      await axios.post(
        apiUrl(Service.FINANCE, `/requisitions/${props.requisition.id}/actions/create-payment`),
        paymentData
      );

      hide();
      message.success("Successful!", 2);
      props.refetch();
    } catch (err) {
      hide();
      message.error("Error saving", 2);
      console.error(JSON.parse(JSON.stringify(err)));
    }

    form.resetFields();
  };

  const paymentMethodOptions = loading
    ? []
    : paymentMethods.map((paymentMethod: any) => ({
        label: paymentMethod.name,
        value: paymentMethod.id,
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
        rules={[FORM_RULES.requiredRule, FORM_RULES.moneyRule, maxAmountRule]}
        normalize={(value: any) => (value ? parseFloat(value) : null)}
        label="Amount Paid"
      >
        <Input
          prefix="$"
          type="number"
          step={0.01}
          placeholder={formatPrice(remainingBalance, true)}
        />
      </Form.Item>
      <Form.Item name="fundingSource" rules={[FORM_RULES.requiredRule]} label="Funding Source">
        <Select options={paymentMethodOptions} optionFilterProp="label" loading={loading} />
      </Form.Item>
      <Form.Item name="date" rules={[FORM_RULES.requiredRule]} label="Payment Date">
        <DatePicker format="MMM-D-YYYY" style={{ width: "100%" }} />
      </Form.Item>
    </RequisitionExpenseRow>
  );
};

export default CreatePaymentRow;
