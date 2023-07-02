import React from "react";
import { Form, Input } from "antd";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { FormModalProps } from "../FormModalProps";

const CategoryFormModal: React.FC<FormModalProps> = props => (
  <ManageContentModal
    open={props.modalState.visible}
    initialValues={props.modalState.initialValues}
    hiddenValues={props.modalState.hiddenValues}
    closeModal={() =>
      props.setModalState({
        visible: false,
        initialValues: props.modalState.initialValues,
      })
    }
    resourceUrl={apiUrl(Service.FINANCE, "/budgets")}
    refetch={props.refetch}
    name="Category"
  >
    {(initialValues: any) => (
      <Form.Item
        name="name"
        rules={[FORM_RULES.requiredRule]}
        label="Name"
        initialValue={initialValues && initialValues.name}
      >
        <Input placeholder="Johnny" />
      </Form.Item>
    )}
  </ManageContentModal>
);

export default CategoryFormModal;
