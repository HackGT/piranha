import React, { useState } from "react";
import { Button, List, Typography } from "antd";
import { DocumentNode, useQuery } from "@apollo/client";
import { FormModalProps } from "./formModals/FormModalProps";
import ErrorDisplay from "../../../util/ErrorDisplay";

const { Title, Text } = Typography;

export type ModalState = {
  visible: boolean;
  initialValues: any;
}

interface Props {
  query: DocumentNode;
  title: string;
  tag: (item: any) => JSX.Element;
  sortData: (data: any) => any;
  name: (item: any) => string;
  modal: React.FC<FormModalProps>;
  hideAddButton?: boolean;
}

const ManageContentList: React.FC<Props> = (props) => {
  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null
  } as ModalState);

  const { loading, data, error } = useQuery(props.query);

  const openModal = (values: any) => {
    setModalState({
      visible: true,
      initialValues: values
    });
  };

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const sortedData = data ? props.sortData(data) : [];
  const Modal = props.modal;

  return (
    <>
      <Title level={3}>{props.title}</Title>
      {!props.hideAddButton && <Button style={{ marginBottom: "10px" }} onClick={() => openModal(null)}>Add +</Button>}
      <List
        bordered
        loading={loading}
        dataSource={sortedData}
        style={{ maxWidth: "800px", margin: "0 auto" }}
        renderItem={(item: any) => (
          <List.Item>
            {props.tag(item)}
            <Text style={{ textAlign: "center", maxWidth: "33%", wordBreak: "break-word" }}>{props.name(item)}</Text>
            <Button onClick={() => openModal(item)}>Edit</Button>
          </List.Item>
        )}
      />
      <Modal modalState={modalState} setModalState={setModalState} />
    </>
  );
};

export default ManageContentList;
