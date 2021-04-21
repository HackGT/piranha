import React from "react";
import { Cascader, Form, Input, Switch } from "antd";

import { ApolloCache } from "@apollo/client";
import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import {
  CREATE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION
} from "../../../queries/Category";
import { FormModalProps } from "../FormModalProps";

const CategoryFormModal: React.FC<FormModalProps> = props => (  
  <ManageContentModal
    visible={props.modalState.visible}
    initialValues={props.modalState.initialValues}
    closeModal={() =>
      props.setModalState({
        visible: false,
        initialValues: props.modalState.initialValues,
      })
    }
    createMutation={CREATE_CATEGORY_MUTATION}
    updateMutation={UPDATE_CATEGORY_MUTATION}
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
