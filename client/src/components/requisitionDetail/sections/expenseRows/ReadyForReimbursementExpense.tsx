import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Collapse, Form, Select } from "antd";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../ManageStatusSection";
import { UPDATE_REQUISITION_MUTATION } from "../../../../queries/Requisition";
import { FORM_RULES } from "../../../../util/util";
import { PAYMENT_METHOD_EXPENSE_QUERY } from "../../../../queries/PaymentMethod";
import ErrorDisplay from "../../../../util/ErrorDisplay";

const ReadyForReimbursementExpense: React.FC<RequisitionExpenseSectionProps> = (props) => {
  const { loading, data, error } = useQuery(PAYMENT_METHOD_EXPENSE_QUERY);
  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const onFinish = async (values: any) => {
    const mutationData = {
      fundingSource: values.fundingSource,
      status: "AWAITING_INFORMATION"
    };

    await saveExpenseData(updateRequisition, { id: props.requisition.id, data: mutationData });
  };

  const paymentMethodOptions = loading ? [] : data.paymentMethods.map((paymentMethod: any) => ({
    label: paymentMethod.name,
    value: paymentMethod.id
  }));

  return (
    <Collapse>
      <RequisitionExpenseRow
        onFinish={onFinish}
        newStatus={"AWAITING_INFORMATION"}
        title="Select Funding Source"
        description="In order to determine the next steps for the reimbursement, select the funding source. If you are unsure, please contact the Director of Finance."
        key="awaiting-information"
        buttonText="Select"
      >
        <Form.Item
          name="fundingSource"
          rules={[FORM_RULES.requiredRule]}
          label="Funding Source"
        >
          <Select options={paymentMethodOptions} optionFilterProp="label" loading={loading} />
        </Form.Item>
      </RequisitionExpenseRow>
    </Collapse>
  );
};

export default ReadyForReimbursementExpense;
