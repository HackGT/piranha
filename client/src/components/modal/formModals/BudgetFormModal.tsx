import React from "react";
import { Form, Input, Switch } from "antd";
import { ApolloCache } from "@apollo/client";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import {
  CREATE_BUDGET_MUTATION,
  UPDATE_BUDGET_MUTATION,
  BUDGET_QUERY,
} from "../../../queries/Budget";
import { FormModalProps } from "../FormModalProps";

const BudgetFormModal: React.FC<FormModalProps> = props => (
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
    createMutation={CREATE_BUDGET_MUTATION}
    updateMutation={UPDATE_BUDGET_MUTATION}
    name="Budget"
    updateCache={(cache: ApolloCache<any>, createMutationData: any) => {
      // @ts-ignore
      const { budgets } = cache.readQuery({ query: BUDGET_QUERY });
      cache.writeQuery({
        query: BUDGET_QUERY,
        data: { budgets: budgets.concat([createMutationData.createBudget]) },
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
