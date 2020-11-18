import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Select } from "antd";
import { PAYMENT_METHOD_EXPENSE_QUERY } from "../../../../queries/PaymentMethod";
import ErrorDisplay from "../../../../util/ErrorDisplay";
import { FORM_RULES } from "../../../../util/util";
import RequisitionExpenseRow from "./RequisitionExpenseRow";
import { RequisitionExpenseSectionProps, saveExpenseData } from "../ManageStatusSection";
import { UPDATE_REQUISITION_MUTATION } from "../../../../queries/Requisition";

const SelectFundingSourceRow: React.FC<RequisitionExpenseSectionProps> = (props) => {
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

    const updateFundingSource = props.requisition.status === "AWAITING_INFORMATION";

    const paymentMethodOptions = loading ? [] : data.paymentMethods.map((paymentMethod: any) => ({
        label: paymentMethod.name,
        value: paymentMethod.id
    }));

    return (
        <RequisitionExpenseRow
            onFinish={onFinish}
            newStatus={updateFundingSource ? undefined : "AWAITING_INFORMATION"}
            title={updateFundingSource ? "Update Funding Source" : "Select Funding Source"}
            description={updateFundingSource ? "Select an option below to update the funding source." : "In order to determine the next steps for the reimbursement, select the funding source. If you are unsure, please contact the Director of Finance."}
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
