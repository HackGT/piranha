import React from "react";
import { Form, Input, Switch } from "antd";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { FormModalProps } from "../FormModalProps";
import QuestionIconLabel from "../../../util/QuestionIconLabel";

const { TextArea } = Input;

const PaymentMethodFormModal: React.FC<FormModalProps> = props => (
  <ManageContentModal
    open={props.modalState.open}
    initialValues={props.modalState.initialValues}
    hiddenValues={props.modalState.hiddenValues}
    closeModal={() =>
      props.setModalState({
        open: false,
        initialValues: props.modalState.initialValues,
      })
    }
    resourceUrl={apiUrl(Service.FINANCE, "/payment-methods")}
    refetch={props.refetch}
    name="Payment Method"
  >
    {(initialValues: any) => (
      <>
        <Form.Item
          name="name"
          rules={[FORM_RULES.requiredRule]}
          label="Name"
          initialValue={initialValues ? initialValues.name : ""}
        >
          <Input placeholder="Gringotts Wizarding Bank" />
        </Form.Item>
        <Form.Item
          name="reimbursementInstructions"
          label={
            <QuestionIconLabel
              label="Reimbursement Instructions"
              helpText="These notes will be shown to the submitter when they are requesting a reimbursement from this payment method. These instructions could include forms to fill out, a Wiki link, etc. Note: Any URL will be converted into a link for easier access."
            />
          }
          initialValue={initialValues ? initialValues.reimbursementInstructions : ""}
        >
          <TextArea
            // @ts-ignore
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="Visit www.docusign.com/form and fill out the reimbursement form. After completing, send it to the Director of Finance."
          />
        </Form.Item>
        <Form.Item
          name="isDirectPayment"
          label={
            <QuestionIconLabel
              label="Direct Payment"
              helpText="For reimbursements, select yes for direct payment if the funding source can immediately send funds after approval. If the funding source requires forms or other documents to be submitted, select no for direct payment."
            />
          }
          valuePropName="checked"
          initialValue={initialValues ? initialValues.isDirectPayment : false}
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
        {initialValues && (
          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
            initialValue={initialValues.isActive}
          >
            <Switch />
          </Form.Item>
        )}
      </>
    )}
  </ManageContentModal>
);

export default PaymentMethodFormModal;
