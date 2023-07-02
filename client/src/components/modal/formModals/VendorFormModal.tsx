import React from "react";
import { Form, Input, Switch } from "antd";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { FormModalProps } from "../FormModalProps";

const VendorFormModal: React.FC<FormModalProps> = props => (
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
    resourceUrl={apiUrl(Service.FINANCE, "/vendors")}
    refetch={props.refetch}
    name="Vendor"
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

export default VendorFormModal;
