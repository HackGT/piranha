import React from "react";
import { Form, Input, InputNumber } from "antd";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { FormModalProps } from "../FormModalProps";

const LineItemFormModal: React.FC<FormModalProps> = props => (
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
