import React from "react";
import { Form, Input, Radio, Tooltip, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons/lib";
import { useApolloClient } from "@apollo/client";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { FormModalProps } from "../FormModalProps";
import { UPDATE_USER_MUTATION, USER_INFO_QUERY } from "../../../queries/User";
import QuestionIconLabel from "../../../util/QuestionIconLabel";
import { UserAccessLevel } from "../../../types/types";

const { Text } = Typography;

const UserFormModal: React.FC<FormModalProps> = props => {
  const client = useApolloClient();
  const { user: currentUser } = client.readQuery({ query: USER_INFO_QUERY });

  const accessLevelOptions = [
    {
      value: UserAccessLevel.NONE,
      label: "None",
      helpText:
        "User will not have access to Piranha, and cannot login. They can be reactivated at any time.",
    },
    {
      value: UserAccessLevel.MEMBER,
      label: "Member",
      helpText:
        "This is the general access level. This allows users to login, create and view requisitions, and look at projects.",
    },
    {
      value: UserAccessLevel.EXEC,
      label: "Exec",
      helpText:
        "This provides users with elevated privileges to approve and manage the status of requisitions.",
    },
    {
      value: UserAccessLevel.ADMIN,
      label: "Admin",
      helpText:
        "This provides the user with superuser privileges. Should only be given to developers or experienced users. Also gives the user access to the built-in Django admin panel.",
    },
  ];

  return (
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
      updateMutation={UPDATE_USER_MUTATION}
      name="User"
    >
      {(initialValues: any) => (
        <>
          <Form.Item
            name="name"
            rules={[FORM_RULES.requiredRule]}
            label="Name"
            initialValue={initialValues && initialValues.name}
          >
            <Input placeholder="Johnny" />
          </Form.Item>
          <Form.Item
            name="slackId"
            label={
              <QuestionIconLabel
                label="Slack Id"
                helpText="The Slack Id of the user used to send notifications. Note: this is not the user's slack username or profile name. If no id is specified, the user will not receive notifications."
              />
            }
            initialValue={initialValues && initialValues.slackId}
          >
            <Input placeholder="US3EHAOWN" />
          </Form.Item>
          <Form.Item
            name="accessLevel"
            rules={[FORM_RULES.requiredRule]}
            label="Access Level"
            initialValue={
              initialValues &&
              UserAccessLevel[initialValues.accessLevel as keyof typeof UserAccessLevel]
            }
          >
            <Radio.Group>
              {accessLevelOptions.map((item: any) => (
                <Radio
                  key={item.label}
                  style={{ display: "block", height: "30px", lineHeight: "30px" }}
                  value={item.value}
                  disabled={initialValues && initialValues.id === currentUser.id} // You can't change your own access level
                >
                  {`${item.label} `}
                  <Tooltip title={item.helpText}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Text strong>Email</Text>
          <br />
          <Text>{initialValues?.email || "Not Set"}</Text>
          <br />
          <br />
          <Text strong>Ground Truth Id</Text>
          <br />
          <Text>{initialValues?.uuid || "Not Set"}</Text>
          <br />
          <br />
        </>
      )}
    </ManageContentModal>
  );
};

export default UserFormModal;
