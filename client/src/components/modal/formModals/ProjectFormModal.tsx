import React from "react";
import { Form, Input, InputNumber, Select, Switch } from "antd";
import { ApolloCache, useQuery } from "@apollo/client";

import { FORM_RULES } from "../../../util/util";
import {
  CREATE_PROJECT_MUTATION,
  PROJECT_LIST_QUERY,
  UPDATE_PROJECT_MUTATION,
} from "../../../queries/Project";
import ManageContentModal from "../ManageContentModal";
import { FormModalProps } from "../FormModalProps";
import { ALL_USERS_QUERY } from "../../../queries/User";
import ErrorDisplay from "../../displays/ErrorDisplay";
import QuestionIconLabel from "../../../util/QuestionIconLabel";

const ProjectFormModal: React.FC<FormModalProps> = props => {
  const { loading, data, error } = useQuery(ALL_USERS_QUERY);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const leadOptions = loading
    ? []
    : data.users.map((user: any) => ({
        label: `${user.name} [${user.email}]`,
        value: user.id,
      }));

  return (
    <ManageContentModal
      visible={props.modalState.visible}
      initialValues={props.modalState.initialValues}
      closeModal={() =>
        props.setModalState({
          visible: false,
          initialValues: props.modalState.initialValues,
        })
      }
      createMutation={CREATE_PROJECT_MUTATION}
      updateMutation={UPDATE_PROJECT_MUTATION}
      name="Project"
      updateCache={(cache: ApolloCache<any>, createMutationData: any) => {
        // @ts-ignore
        const { projects } = cache.readQuery({ query: PROJECT_LIST_QUERY });
        cache.writeQuery({
          query: PROJECT_LIST_QUERY,
          data: { projects: projects.concat([createMutationData.createProject]) },
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
              initialValues ? initialValues.leads.map((user: any) => user.id) : undefined
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
