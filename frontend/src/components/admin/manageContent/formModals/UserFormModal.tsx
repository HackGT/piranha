import React from "react";
import { Form, Input, Radio, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons/lib";
import { FORM_RULES } from "../../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { FormModalProps } from "./FormModalProps";
import { UPDATE_USER_MUTATION, UserAccessLevel } from "../../../../types/User";

const UserFormModal: React.FC<FormModalProps> = (props) => {
  const accessLevelOptions = [
    {
      value: UserAccessLevel.NONE,
      label: "None",
      helpText: "User will not have access to Piranha, and cannot login. They can be reactivated at any time."
    },
    {
      value: UserAccessLevel.MEMBER,
      label: "Member",
      helpText: "This is the general access level. This allows users to login, create and view requisitions, and look at projects."
    },
    {
      value: UserAccessLevel.EXEC,
      label: "Exec",
      helpText: "This provides users with elevated privileges to approve and manage the status of requisitions."
    },
    {
      value: UserAccessLevel.ADMIN,
      label: "Admin",
      helpText: "This provides the user with superuser privileges. Should only be given to developers or experienced users. Also gives the user access to the built-in Django admin panel."
    }
  ];

  return (
    <ManageContentModal
      visible={props.modalState.visible}
      initialValues={props.modalState.initialValues}
      closeModal={() => props.setModalState({
        visible: false,
        initialValues: props.modalState.initialValues
      })}
      updateMutation={UPDATE_USER_MUTATION}
      name="User"
    >
      {(initialValues: any) => (
        <>
          <Form.Item
            name="firstName"
            rules={[FORM_RULES.requiredRule]}
            label="First Name"
            initialValue={initialValues && initialValues.firstName}
          >
            <Input placeholder="Johnny" />
          </Form.Item>
          <Form.Item
            name="preferredName"
            rules={[FORM_RULES.requiredRule]}
            label={(
              <span>
                {"Preferred Name "}
                <Tooltip title="This the name that is used in Piranha.">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            )}
            initialValue={initialValues && initialValues.preferredName}
          >
            <Input placeholder="Alvin" />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[FORM_RULES.requiredRule]}
            label="Last Name"
            initialValue={initialValues && initialValues.lastName}
          >
            <Input placeholder="Depp" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
          >
            <Input placeholder={initialValues && initialValues.email} disabled />
          </Form.Item>
          <Form.Item
            name="accessLevel"
            rules={[FORM_RULES.requiredRule]}
            label="Access Level"
            initialValue={initialValues && UserAccessLevel[initialValues.accessLevel as keyof typeof UserAccessLevel]}
          >
            <Radio.Group>
              {accessLevelOptions.map((item: any) => (
                <Radio style={{ display: "block", height: "30px", lineHeight: "30px" }} value={item.value}>
                  {`${item.label} `}
                  <Tooltip title={item.helpText}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </>
      )}
    </ManageContentModal>
  );
};

export default UserFormModal;
