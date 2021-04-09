import React, { useEffect } from "react";
import { Form, message, Modal } from "antd";
import { ApolloCache, DocumentNode, useMutation } from "@apollo/client";

interface Props {
  visible: boolean;
  closeModal: () => void;
  initialValues?: any;
  createMutation?: DocumentNode;
  updateMutation: DocumentNode;
  name: string;
  updateCache?: (cache: ApolloCache<any>, createMutationData: any) => void;
}

const ManageContentModal: React.FC<Props> = props => {
  const [form] = Form.useForm();

  // For types without create option (ex. users), default to using update mutation, since this will not be called anyways
  const [createMutation] = useMutation(props.createMutation || props.updateMutation, {
    update(cache, { data: createMutationData }) {
      props.updateCache?.(cache, createMutationData);
    },
  });
  const [updateMutation] = useMutation(props.updateMutation);

  useEffect(() => form.resetFields(), [form, props.initialValues]); // github.com/ant-design/ant-design/issues/22372

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const hide = message.loading("Saving...", 0);

      try {
        if (props.initialValues) {
          await updateMutation({ variables: { data: values, id: props.initialValues.id } });
        } else {
          await createMutation({ variables: { data: values } });
        }

        hide();
        props.closeModal();
        message.success("Successfully updated", 2);
        form.resetFields();
      } catch (err) {
        hide();
        message.error("Error saving", 2);
        console.error(JSON.parse(JSON.stringify(err)));
      }
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <>
      <Modal
        visible={props.visible}
        title={props.initialValues ? `Manage ${props.name}` : `Create ${props.name}`}
        okText={props.initialValues ? "Update" : "Create"}
        cancelText="Cancel"
        onCancel={props.closeModal}
        onOk={onSubmit}
        bodyStyle={{ paddingBottom: 0 }}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          {/* @ts-ignore */}
          {props.children(props.initialValues)}
        </Form>
      </Modal>
    </>
  );
};

export default ManageContentModal;
