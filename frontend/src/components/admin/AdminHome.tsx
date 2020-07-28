import React from "react";
import { Tabs, Tag, Typography } from "antd";
import { useParams, useHistory } from "react-router-dom";
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
  const { activeTab } = useParams();
  const history = useHistory();

  const tabKeys = ["projects", "vendors", "payment-methods", "users"];

  if (!tabKeys.includes(activeTab)) {
    history.replace(`/admin/${tabKeys[0]}`);
  }
  
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
      <Tabs activeKey={activeTab} defaultActiveKey="projects" onTabClick={key => history.push(`/admin/${key}`)}>
        <TabPane tab="Projects" key={tabKeys[0]}>
          <ManageContentList
            query={PROJECT_LIST_QUERY}
            title="Projects"
            tag={item => <Tag color={item.archived ? "gold" : "green"}>{item.archived ? "Archived" : "Active"}</Tag>}
            sortData={data => data.projects.concat().sort((a: any, b: any) => b.year - a.year)}
            name={item => `${item.name} (${item.year})`}
            modal={ProjectFormModal}
            searchFilterField="name"
          />
        </TabPane>
        <TabPane tab="Vendors" key={tabKeys[1]}>
          <ManageContentList
            query={VENDOR_LIST_QUERY}
            title="Vendors"
            tag={item => (<Tag color={item.isActive ? "green" : "red"}>{item.isActive ? "Active" : "Inactive"}</Tag>)}
            sortData={data => data.vendors.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))}
            name={item => item.name}
            modal={VendorFormModal}
            searchFilterField="name"
          />
        </TabPane>
        <TabPane tab="Payment Methods" key={tabKeys[2]}>
          <ManageContentList
            query={PAYMENT_METHOD_LIST_QUERY}
            title="Payment Methods"
            tag={item => (<Tag color={item.isActive ? "green" : "red"}>{item.isActive ? "Active" : "Inactive"}</Tag>)}
            sortData={data => data.paymentMethods.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))}
            name={item => item.name}
            modal={PaymentMethodFormModal}
            searchFilterField="name"
          />
        </TabPane>
        <TabPane tab="Users" key={tabKeys[3]}>
          <ManageContentList
            query={USER_LIST_QUERY}
            title="Users"
            tag={getUserTag}
            sortData={data => data.users.concat().sort((a: any, b: any) => a.fullName.localeCompare(b.fullName))}
            name={item => item.fullName}
            modal={UserFormModal}
            searchFilterField="fullName"
            hideAddButton
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default AdminHome;
