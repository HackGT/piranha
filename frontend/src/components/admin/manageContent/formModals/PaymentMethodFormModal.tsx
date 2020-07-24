import React from "react";
import { Form, Input, Switch } from "antd";
import { ApolloCache } from "@apollo/client";
import { FORM_RULES } from "../../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { CREATE_PAYMENT_METHOD_MUTATION, UPDATE_PAYMENT_METHOD_MUTATION, PAYMENT_METHOD_LIST_QUERY } from "../../../../types/PaymentMethod";
import { FormModalProps } from "./FormModalProps";

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
