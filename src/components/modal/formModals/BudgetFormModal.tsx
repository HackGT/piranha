import React from "react";
import { Form, Input, Switch } from "antd";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { FormModalProps } from "../FormModalProps";

const BudgetFormModal: React.FC<FormModalProps> = props => (
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
    resourceUrl={apiUrl(Service.FINANCE, "/budgets")}
    refetch={props.refetch}
    name="Budget"
  >
    {(initialValues: any) => (
      <>
        <Form.Item
          name="name"
          rules={[FORM_RULES.requiredRule]}
          label="Name"
          initialValue={initialValues && initialValues.name}
        >
          <Input placeholder="Wristband Superstore" />
        </Form.Item>
        {initialValues && (
          <Form.Item
            name="archived"
            label="Archived"
            valuePropName="checked"
            initialValue={initialValues.archived}
          >
            <Switch />
          </Form.Item>
        )}
      </>
    )}
  </ManageContentModal>
);

export default BudgetFormModal;
