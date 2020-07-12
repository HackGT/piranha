import React from "react";
import { Tabs, Tag, Typography } from "antd";
import ManageContentList from "./manageContent/ManageContentList";
import { PROJECT_LIST_QUERY } from "../../types/Project";
import { VENDOR_LIST_QUERY } from "../../types/Vendor";
import { PAYMENT_METHOD_LIST_QUERY } from "../../types/PaymentMethod";
import ProjectFormModal from "./manageContent/formModals/ProjectFormModal";
import VendorFormModal from "./manageContent/formModals/VendorFormModal";
import PaymentMethodFormModal from "./manageContent/formModals/PaymentMethodFormModal";

const { Title } = Typography;
const { TabPane } = Tabs;

const AdminHome: React.FC = () => (
  <>
    <Title>Admin Panel</Title>
    <Tabs defaultActiveKey="1">
      <TabPane tab="Projects" key="1">
        <ManageContentList
          query={PROJECT_LIST_QUERY}
          title="Projects"
          tag={(item) => <Tag color={item.archived ? "gold" : "green"} style={{ margin: 0 }}>{item.archived ? "Archived" : "Active"}</Tag>}
          sortData={(data) => data.projects.concat().sort((a: any, b: any) => b.year - a.year)}
          name={(item) => `${item.name} (${item.year})`}
          modal={ProjectFormModal}
        />
      </TabPane>
      <TabPane tab="Vendors" key="2">
        <ManageContentList
          query={VENDOR_LIST_QUERY}
          title="Vendors"
          tag={(item) => <Tag color={item.isActive ? "green" : "red"} style={{ margin: 0 }}>{item.isActive ? "Active" : "Inactive"}</Tag>}
          sortData={(data) => data.vendors.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))}
          name={(item) => item.name}
          modal={VendorFormModal}
        />
      </TabPane>
      <TabPane tab="Payment Methods" key="3">
        <ManageContentList
          query={PAYMENT_METHOD_LIST_QUERY}
          title="Payment Methods"
          tag={(item) => <Tag color={item.isActive ? "green" : "red"} style={{ margin: 0 }}>{item.isActive ? "Active" : "Inactive"}</Tag>}
          sortData={(data) => data.paymentMethods.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))}
          name={(item) => item.name}
          modal={PaymentMethodFormModal}
        />
      </TabPane>
    </Tabs>
  </>
);

export default AdminHome;
