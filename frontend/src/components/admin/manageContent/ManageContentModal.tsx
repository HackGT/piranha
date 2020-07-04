import React, { useEffect } from "react";
import { Form, message, Modal } from "antd";
import { ApolloCache, DocumentNode, useMutation } from "@apollo/client";

interface Props {
  visible: boolean;
  closeModal: () => void;
  initialValues?: any;
  createMutation: DocumentNode;
  updateMutation: DocumentNode;
  name: string;
  updateCache: (cache: ApolloCache<any>, createMutationData: any) => void;
}

const ManageContentModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm();

  const [createMutation] = useMutation(props.createMutation, {
    update(cache, { data: createMutationData }) {
      props.updateCache(cache, createMutationData);
    }
  });
  const [updateMutation] = useMutation(props.updateMutation);

  useEffect(() => form.resetFields(), [form, props.initialValues]); // github.com/ant-design/ant-design/issues/22372

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const hide = message.loading("Saving...", 0);
        if (props.initialValues) {
          updateMutation({ variables: { data: values, id: props.initialValues.id } })
            .then(() => {
              hide();
              message.success("Successfully updated", 2);
              props.closeModal();
            })
            .catch((err) => {
              hide();
              console.error(JSON.parse(JSON.stringify(err)));
              message.error("Error saving", 2);
            });
        } else {
          createMutation({ variables: { data: values } })
            .then(() => {
              hide();
              message.success("Successfully created", 2);
              props.closeModal();
            })
            .catch((err) => {
              hide();
              console.error(JSON.parse(JSON.stringify(err)));
              message.error("Error saving", 2);
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
        title={props.initialValues ? `Manage ${props.name}` : `Create ${props.name}`}
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
          {/* @ts-ignore */}
          {props.children(props.initialValues)}
        </Form>
      </Modal>
    </>
  );
};

export default ManageContentModal;
