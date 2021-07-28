import React from "react";
import { Form, Input, InputNumber } from "antd";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { CREATE_LINE_ITEM_MUTATION, UPDATE_LINE_ITEM_MUTATION } from "../../../queries/LineItem";
import { FormModalProps } from "../FormModalProps";
import { BUDGET_DETAIL_QUERY } from "../../../queries/Budget";

const LineItemFormModal: React.FC<FormModalProps> = props => (
  <ManageContentModal
    visible={props.modalState.visible}
    initialValues={props.modalState.initialValues}
    hiddenValues={props.modalState.hiddenValues}
    closeModal={() =>
      props.setModalState({
        visible: false,
        initialValues: props.modalState.initialValues,
      })
    }
    createMutation={CREATE_LINE_ITEM_MUTATION}
    updateMutation={UPDATE_LINE_ITEM_MUTATION}
    refetchQuery={[
      { query: BUDGET_DETAIL_QUERY, variables: { id: props.modalState.hiddenValues?.category } },
    ]}
    name="Line Item"
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
          <InputNumber
            type="number"
            min={0}
            precision={0}
            style={{ width: "100%" }}
            placeholder="100"
          />
        </Form.Item>

        <Form.Item
          name="unitCost"
          rules={[FORM_RULES.requiredRule]}
          label="Unit Cost"
          initialValue={initialValues ? initialValues.unitCost : ""}
        >
          <InputNumber
            type="number"
            min={0}
            precision={2}
            style={{ width: "100%" }}
            placeholder="24.99"
          />
        </Form.Item>
      </>
    )}
  </ManageContentModal>
);

export default LineItemFormModal;
