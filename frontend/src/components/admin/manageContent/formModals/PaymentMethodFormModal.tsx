import React from "react";
import { Form, Input, Switch, Tooltip } from "antd";
import { ApolloCache } from "@apollo/client";
import { QuestionCircleOutlined } from "@ant-design/icons/lib";
import { FORM_RULES } from "../../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { CREATE_PAYMENT_METHOD_MUTATION, UPDATE_PAYMENT_METHOD_MUTATION, PAYMENT_METHOD_LIST_QUERY } from "../../../../types/PaymentMethod";
import { FormModalProps } from "./FormModalProps";

const { TextArea } = Input;

const PaymentMethodFormModal: React.FC<FormModalProps> = props => (
  <ManageContentModal
    visible={props.modalState.visible}
    initialValues={props.modalState.initialValues}
    closeModal={() => props.setModalState({
      visible: false,
      initialValues: props.modalState.initialValues
    })}
    createMutation={CREATE_PAYMENT_METHOD_MUTATION}
    updateMutation={UPDATE_PAYMENT_METHOD_MUTATION}
    name="Payment Method"
    updateCache={(cache: ApolloCache<any>, createMutationData: any) => {
      // @ts-ignore
      const { paymentMethods } = cache.readQuery({ query: PAYMENT_METHOD_LIST_QUERY });
      cache.writeQuery({
        query: PAYMENT_METHOD_LIST_QUERY,
        data: { paymentMethods: paymentMethods.concat([createMutationData.createPaymentMethod.paymentMethod]) }
      });
    }}
  >
    {(initialValues: any) => (
      <>
        <Form.Item
          name="name"
          rules={[FORM_RULES.requiredRule]}
          label="Name"
          initialValue={initialValues && initialValues.name}
        >
          <Input placeholder="Gringotts Wizarding Bank" />
        </Form.Item>
        <Form.Item
          name="reimbursementInstructions"
          label={(
            <span>
              {"Reimbursement Instructions "}
              <Tooltip title="These notes will be shown to the submitter when they are requesting a reimbursement from this payment method. These instructions could include forms to fill out, or a Wiki link.">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          )}
          initialValue={initialValues && initialValues.reimbursementInstructions}
        >
          <TextArea
            autoSize={{ minRows: 4 }}
            placeholder="Visit www.docusign.com/form and fill out the reimbursement form. After completing, send it to the Director of Finance."
          />
        </Form.Item>
        <Form.Item
          name="isDirectPayment"
          label={(
            <span>
              {"Direct Payment "}
              <Tooltip title="For reimbursements, select yes for direct payment if the funding source can immediately send funds after approval. If the funding source requires forms or other documents to be submitted, select no for direct payment.">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          )}
          valuePropName="checked"
          initialValue={initialValues && initialValues.isDirectPayment}
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
