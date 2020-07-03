import React, { useState } from "react";
import { Button, List, Tag, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { MANAGE_VENDORS_QUERY, Vendor } from "../../../types/Vendor";
import VendorsFormModal from "./VendorsFormModal";

const { Title, Text } = Typography;

type ModalState = {
  visible: boolean;
  initialValues: any;
}

const ManageVendors: React.FC = () => {
  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null
  } as ModalState);

  const { loading, data, error } = useQuery(MANAGE_VENDORS_QUERY);

  const openModal = (vendor: Vendor | null) => {
    setModalState({
      visible: true,
      initialValues: vendor
    });
  };

  if (error || (data && !data.vendors)) {
    return (
      <>
        <Text type="danger">Error: Unable to display vendors.</Text>
        <Text>{error?.message}</Text>
      </>
    );
  }

  const vendorData = data ? data.vendors.concat().sort((a: any, b: any) => a.name.localeCompare(b.name)) : [];

  return (
    <>
      <Title level={3}>Vendors</Title>
      <Button style={{ marginBottom: "10px" }} onClick={() => openModal(null)}>Add +</Button>
      <List
        bordered
        loading={loading}
        dataSource={vendorData}
        style={{ maxWidth: "800px", margin: "0 auto" }}
        renderItem={(vendor: Vendor) => (
          <List.Item>
            <Tag color={vendor.isActive ? "green" : "red"} style={{ margin: 0 }}>{vendor.isActive ? "Active" : "Inactive"}</Tag>
            <Text style={{ textAlign: "center", maxWidth: "33%", wordBreak: "break-word" }}>{vendor.name}</Text>
            <Button onClick={() => openModal(vendor)}>Edit</Button>
          </List.Item>
        )}
      />
      <VendorsFormModal
        visible={modalState.visible}
        initialValues={modalState.initialValues}
        closeModal={() => setModalState({
          visible: false,
          initialValues: modalState.initialValues
        })}
      />
    </>
  );
};

export default ManageVendors;
