import React from "react";
import { Form, Input } from "antd";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { CREATE_CATEGORY_MUTATION, UPDATE_CATEGORY_MUTATION } from "../../../queries/Category";
import { FormModalProps } from "../FormModalProps";
import { BUDGET_DETAIL_QUERY } from "../../../queries/Budget";

const CategoryFormModal: React.FC<FormModalProps> = props => (
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
    createMutation={CREATE_CATEGORY_MUTATION}
    updateMutation={UPDATE_CATEGORY_MUTATION}
    refetchQuery={[
      { query: BUDGET_DETAIL_QUERY, variables: { id: props.modalState.hiddenValues?.budget } },
    ]}
    name="Category"
  >
    {(initialValues: any) => (
      <>
        <Form.Item
          name="name"
          rules={[FORM_RULES.requiredRule]}
          label="Name"
          initialValue={initialValues && initialValues.name}
        >
          <Input placeholder="Johnny" />
        </Form.Item>
      </>
    )}
  </ManageContentModal>
);

export default CategoryFormModal;
