import React from "react";
import { Tabs, Typography } from "antd";
import ManageVendors from "./vendors/ManageVendors";

const { Title } = Typography;
const { TabPane } = Tabs;

const AdminHome: React.FC = () => {
  const test = true;
  return (
    <>
      <Title>Admin Panel</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Projects" key="1">
          Project Info
        </TabPane>
        <TabPane tab="Vendors" key="2">
          <ManageVendors />
        </TabPane>
      </Tabs>
    </>
  );
};

export default AdminHome;
