import React, { useEffect } from "react";
import { Form, message, Modal } from "antd";
import axios from "axios";
import { RefetchFunction } from "axios-hooks";

interface Props {
  open: boolean;
  closeModal: () => void;
  initialValues?: any;
  hiddenValues?: any;
  resourceUrl: string;
  name: string;
  children?: any;
  refetch: RefetchFunction<any, any>;
}

const ManageContentModal: React.FC<Props> = props => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [form, props.initialValues]); // github.com/ant-design/ant-design/issues/22372

  const onSubmit = async () => {
    try {
      let values = await form.validateFields();
      values = { ...values, ...props.hiddenValues };

      const hide = message.loading("Saving...", 0);

      try {
        if (props.initialValues) {
          await axios.put(`${props.resourceUrl}/${props.initialValues.id}`, values);
        } else {
          await axios.post(props.resourceUrl, values);
        }

        props.refetch();
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
    <Modal
      open={props.open}
      title={props.initialValues ? `Manage ${props.name}` : `Create ${props.name}`}
      okText={props.initialValues ? "Update" : "Create"}
      cancelText="Cancel"
      onCancel={props.closeModal}
      onOk={onSubmit}
      bodyStyle={{ paddingBottom: 0 }}
      forceRender // https://stackoverflow.com/q/61056421
    >
      <Form form={form} layout="vertical" autoComplete="off">
        {/* @ts-ignore */}
        {props.children(props.initialValues)}
      </Form>
    </Modal>
  );
};

export default ManageContentModal;
