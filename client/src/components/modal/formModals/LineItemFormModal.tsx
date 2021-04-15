import React from "react";
import { Form, Input, Switch } from "antd";
import { ApolloCache } from "@apollo/client";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import {
  CREATE_LINE_ITEM_MUTATION,
  UPDATE_LINE_ITEM_MUTATION
} from "../../../queries/LineItem";
import { FormModalProps } from "../FormModalProps";
// import QuestionIconLabel from "../../../util/QuestionIconLabel";

const LineItemFormModal: React.FC<FormModalProps> = props => (
  <ManageContentModal
    visible={props.modalState.visible}
    initialValues={props.modalState.initialValues}
    closeModal={() =>
      props.setModalState({
        visible: false,
        initialValues: props.modalState.initialValues,
      })
    }
    createMutation={CREATE_LINE_ITEM_MUTATION}
    updateMutation={UPDATE_LINE_ITEM_MUTATION}
    name="New Line Item"
  >
    {(initialValues: any) => (
      <>
        <Form.Item
          name="name"
          rules={[FORM_RULES.requiredRule]}
          label="Name"
          initialValue={initialValues ? initialValues.name : ""}
        >
          <Input placeholder="Hoodies" />
        </Form.Item>

        <Form.Item
          name="quantity"
          rules={[FORM_RULES.requiredRule]}
          label="Quantity"
          initialValue={initialValues ? initialValues.quantity : ""}
        >
          <Input placeholder="100" />
        </Form.Item>

        <Form.Item
          name="unitCost"
          rules={[FORM_RULES.requiredRule]}
          label="Unit Cost"
          initialValue={initialValues ? initialValues.unitCost : ""}
        >
          <Input placeholder="24.99" />
        </Form.Item>

        {/* Check if we need this part below */}
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
        {/* Check if we need this part above */}
      </>
    )}
  </ManageContentModal>
);

export default LineItemFormModal;