import React from "react";
import { Form, Input, InputNumber, Select, Switch } from "antd";
import { apiUrl, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";

import { FORM_RULES } from "../../../util/util";
import ManageContentModal from "../ManageContentModal";
import { FormModalProps } from "../FormModalProps";
import ErrorDisplay from "../../displays/ErrorDisplay";
import QuestionIconLabel from "../../../util/QuestionIconLabel";

const ProjectFormModal: React.FC<FormModalProps> = props => {
  const [{ loading, data: members, error }] = useAxios({
    url: apiUrl(Service.USERS, "/users/actions/retrieve-members"),
    method: "POST",
  });

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const leadOptions = loading
    ? []
    : members.map((member: any) => ({
        label: `${member.name.first} ${member.name.last} [${member.email}]`,
        value: member.userId,
      }));

  return (
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
      resourceUrl={apiUrl(Service.FINANCE, "/projects")}
      refetch={props.refetch}
      name="Project"
    >
      {(initialValues: any) => (
        <>
          <Form.Item
            name="name"
            rules={[FORM_RULES.requiredRule]}
            label="Name"
            initialValue={initialValues && initialValues.name}
          >
            <Input placeholder="The Great Build GT" />
          </Form.Item>
          <Form.Item
            name="year"
            rules={[FORM_RULES.requiredRule]}
            label="Year"
            initialValue={initialValues && initialValues.year}
          >
            <InputNumber
              type="number"
              min={2018}
              precision={0}
              style={{ width: "100%" }}
              placeholder={new Date().getFullYear().toString()}
            />
          </Form.Item>
          <Form.Item
            name="shortCode"
            rules={[FORM_RULES.requiredRule]}
            label={
              <QuestionIconLabel
                label="Short Code"
                helpText="A short, 2-5 character code to represent this project"
              />
            }
            initialValue={initialValues && initialValues.shortCode}
          >
            <Input placeholder="HACK8" />
          </Form.Item>
          <Form.Item
            name="leads"
            rules={[FORM_RULES.requiredRule]}
            label="Leads"
            initialValue={
              initialValues ? initialValues.leads.map((user: any) => user.userId) : undefined
            }
          >
            <Select
              mode="multiple"
              options={leadOptions}
              optionFilterProp="label"
              loading={loading}
              placeholder="Choose yer captains"
              showSearch
            />
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
};

export default ProjectFormModal;
