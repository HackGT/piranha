import React from "react";
import { Form, Input, Switch } from "antd";
import { ApolloCache } from "@apollo/client";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import {
  CREATE_VENDOR_MUTATION,
  UPDATE_VENDOR_MUTATION,
  VENDOR_LIST_QUERY,
} from "../../../queries/Vendor";
import { FormModalProps } from "../FormModalProps";

const VendorFormModal: React.FC<FormModalProps> = props => (
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
    createMutation={CREATE_VENDOR_MUTATION}
    updateMutation={UPDATE_VENDOR_MUTATION}
    name="Vendor"
    updateCache={(cache: ApolloCache<any>, createMutationData: any) => {
      // @ts-ignore
      const { vendors } = cache.readQuery({ query: VENDOR_LIST_QUERY });
      cache.writeQuery({
        query: VENDOR_LIST_QUERY,
        data: { vendors: vendors.concat([createMutationData.createVendor]) },
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
