import React from "react";
import { Tabs, Tag, Typography } from "antd";
import ManageContentList from "./manageContent/ManageContentList";
import { PROJECT_LIST_QUERY } from "../../types/Project";
import { VENDOR_LIST_QUERY } from "../../types/Vendor";
import { PAYMENT_METHOD_LIST_QUERY } from "../../types/PaymentMethod";
import { USER_LIST_QUERY, UserAccessLevel } from "../../types/User";
import ProjectFormModal from "./manageContent/formModals/ProjectFormModal";
import VendorFormModal from "./manageContent/formModals/VendorFormModal";
import PaymentMethodFormModal from "./manageContent/formModals/PaymentMethodFormModal";
import UserFormModal from "./manageContent/formModals/UserFormModal";
import "./index.css";

const { Title } = Typography;
const { TabPane } = Tabs;

const AdminHome: React.FC = () => {
  const getUserTag = (item: any) => {
    switch (item.accessLevel as UserAccessLevel) {
      case UserAccessLevel.ADMIN:
        return <Tag color="blue">Admin</Tag>;
      case UserAccessLevel.EXEC:
        return <Tag color="orange">Exec</Tag>;
      case UserAccessLevel.MEMBER:
        return <Tag color="green">Member</Tag>;
      case UserAccessLevel.NONE:
      default:
        return <Tag color="red">None</Tag>;
    }
  };

  return (
    <>
      <Title>Admin Panel</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Projects" key="1">
          <ManageContentList
            query={PROJECT_LIST_QUERY}
            title="Projects"
            tag={item => <Tag color={item.archived ? "gold" : "green"}>{item.archived ? "Archived" : "Active"}</Tag>}
            sortData={data => data.projects.concat().sort((a: any, b: any) => b.year - a.year)}
            name={item => `${item.name} (${item.year})`}
            modal={ProjectFormModal}
          />
        </TabPane>
        <TabPane tab="Vendors" key="2">
          <ManageContentList
            query={VENDOR_LIST_QUERY}
            title="Vendors"
            tag={item => (<Tag color={item.isActive ? "green" : "red"}>{item.isActive ? "Active" : "Inactive"}</Tag>)}
            sortData={data => data.vendors.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))}
            name={item => item.name}
            modal={VendorFormModal}
          />
        </TabPane>
        <TabPane tab="Payment Methods" key="3">
          <ManageContentList
            query={PAYMENT_METHOD_LIST_QUERY}
            title="Payment Methods"
            tag={item => (<Tag color={item.isActive ? "green" : "red"}>{item.isActive ? "Active" : "Inactive"}</Tag>)}
            sortData={data => data.paymentMethods.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))}
            name={item => item.name}
            modal={PaymentMethodFormModal}
          />
        </TabPane>
        <TabPane tab="Users" key="4">
          <ManageContentList
            query={USER_LIST_QUERY}
            title="Users"
            tag={getUserTag}
            sortData={data => data.users.concat().sort((a: any, b: any) => a.preferredName.localeCompare(b.preferredName))}
            name={item => `${item.preferredName} ${item.lastName}`}
            modal={UserFormModal}
            hideAddButton
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default AdminHome;
