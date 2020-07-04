import React, { useEffect } from "react";
import { Form, Input, message, Modal, Switch } from "antd";
import { useMutation } from "@apollo/client";
import { FORM_RULES } from "../../../util/util";
import { CREATE_VENDOR_MUTATION, VENDOR_LIST_QUERY, UPDATE_VENDOR_MUTATION } from "../../../types/Vendor";

interface Props {
  visible: boolean;
  closeModal: () => void;
  initialValues?: any;
}

const VendorsFormModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm();

  const [createVendor] = useMutation(CREATE_VENDOR_MUTATION, {
    update(cache, { data: { createVendor: createVendorData } }) {
      // @ts-ignore
      const { vendors } = cache.readQuery({ query: VENDOR_LIST_QUERY });
      cache.writeQuery({
        query: VENDOR_LIST_QUERY,
        data: { vendors: vendors.concat([createVendorData.vendor]) }
      });
    }
  });
  const [updateVendor] = useMutation(UPDATE_VENDOR_MUTATION);

  useEffect(() => form.resetFields(), [form, props.initialValues]); // github.com/ant-design/ant-design/issues/22372

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const hide = message.loading("Saving vendor...", 0);
        if (props.initialValues) {
          updateVendor({ variables: { data: values, id: props.initialValues.id } })
            .then(() => {
              hide();
              message.success("Successfully updated", 3);
              props.closeModal();
            })
            .catch(() => {
              hide();
              message.error("Error saving", 3);
            });
        } else {
          createVendor({ variables: { data: values } })
            .then(() => {
              hide();
              message.success("Successfully created", 3);
              props.closeModal();
            })
            .catch(() => {
              hide();
              message.error("Error saving", 3);
            });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <>
      <Modal
        visible={props.visible}
        title={props.initialValues ? "Manage Vendor" : "Create Vendor"}
        okText={props.initialValues ? "Update" : "Create"}
        cancelText="Cancel"
        onCancel={props.closeModal}
        onOk={onSubmit}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="name"
            rules={[FORM_RULES.requiredRule]}
            label="Name"
            initialValue={props.initialValues && props.initialValues.name}
          >
            <Input placeholder="Wristband Superstore" />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
            initialValue={props.initialValues ? props.initialValues.isActive : true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default VendorsFormModal;
