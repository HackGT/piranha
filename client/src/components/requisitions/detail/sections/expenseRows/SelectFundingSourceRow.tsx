import React from "react";
import { Form, Select, message } from "antd";
import { apiUrl, Service, ErrorScreen } from "@hex-labs/core";
import useAxios from "axios-hooks";
import axios from "axios";

import { FORM_RULES } from "../../../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps } from "../ManageStatusSection";

const SelectFundingSourceRow: React.FC<RequisitionExpenseSectionProps> = props => {
  const [{ loading, data: paymentMethods, error }] = useAxios(
    apiUrl(Service.FINANCE, "/payment-methods?isActive=true")
  );

  if (error) {
    return <ErrorScreen error={error} />;
  }

  const onFinish = async (values: any) => {
    const requisitionData = {
      fundingSource: values.fundingSource,
      status: "AWAITING_INFORMATION",
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

  const updateFundingSource = props.requisition.status === "AWAITING_INFORMATION";

  const paymentMethodOptions = loading
    ? []
    : paymentMethods.map((paymentMethod: any) => ({
        label: paymentMethod.name,
        value: paymentMethod.id,
      }));

  return (
    <RequisitionExpenseRow
      onFinish={onFinish}
      newStatus={updateFundingSource ? undefined : "AWAITING_INFORMATION"}
      title={updateFundingSource ? "Update Funding Source" : "Select Funding Source"}
      description={
        updateFundingSource
          ? "Select an option below to update the funding source."
          : "In order to determine the next steps for the reimbursement, select the funding source. If you are unsure, please contact the Director of Finance."
      }
      key="awaiting-information"
      buttonText="Select"
      {...props}
    >
      <Form.Item
        name="fundingSource"
        rules={[FORM_RULES.requiredRule]}
        label="Funding Source"
        initialValue={props.requisition.fundingSource?.id}
      >
        <Select options={paymentMethodOptions} optionFilterProp="label" loading={loading} />
      </Form.Item>
    </RequisitionExpenseRow>
  );
};

export default SelectFundingSourceRow;
