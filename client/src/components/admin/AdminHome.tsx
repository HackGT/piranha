import React from "react";
import { Tabs, Tag, Typography } from "antd";
import { useParams, useHistory } from "react-router-dom";

import AdminContentList from "./AdminContentList";
import { PROJECT_LIST_QUERY } from "../../queries/Project";
import { VENDOR_LIST_QUERY } from "../../queries/Vendor";
import { PAYMENT_METHOD_LIST_QUERY } from "../../queries/PaymentMethod";
import { USER_LIST_QUERY } from "../../queries/User";
import { BUDGET_QUERY } from "../../queries/Budget";
import ProjectFormModal from "../modal/formModals/ProjectFormModal";
import VendorFormModal from "../modal/formModals/VendorFormModal";
import PaymentMethodFormModal from "../modal/formModals/PaymentMethodFormModal";
import BudgetFormModal from "../modal/formModals/BudgetFormModal";
import UserFormModal from "../modal/formModals/UserFormModal";
import { UserAccessLevel } from "../../types/types";
import "./index.css";

const { Title } = Typography;
const { TabPane } = Tabs;

const AdminHome: React.FC = () => {
  const { activeTab } = useParams<any>();
  const history = useHistory();

  const tabKeys = ["projects", "vendors", "payment-methods", "users", "budgets"];

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
      <Tabs
        activeKey={activeTab}
        defaultActiveKey="projects"
        onTabClick={key => history.push(`/admin/${key}`)}
      >
        <TabPane tab="Projects" key={tabKeys[0]}>
          <AdminContentList
            query={PROJECT_LIST_QUERY}
            title="Projects"
            tag={item => (
              <Tag color={item.archived ? "gold" : "green"}>
                {item.archived ? "Archived" : "Active"}
              </Tag>
            )}
            sortData={data => data.projects.concat().sort((a: any, b: any) => b.year - a.year)}
            name={item => `${item.name} (${item.year})`}
            modal={ProjectFormModal}
            searchFilterField="name"
          />
        </TabPane>
        <TabPane tab="Vendors" key={tabKeys[1]}>
          <AdminContentList
            query={VENDOR_LIST_QUERY}
            title="Vendors"
            tag={item => (
              <Tag color={item.isActive ? "green" : "red"}>
                {item.isActive ? "Active" : "Inactive"}
              </Tag>
            )}
            sortData={data =>
              data.vendors.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))
            }
            name={item => item.name}
            modal={VendorFormModal}
            searchFilterField="name"
          />
        </TabPane>
        <TabPane tab="Payment Methods" key={tabKeys[2]}>
          <AdminContentList
            query={PAYMENT_METHOD_LIST_QUERY}
            title="Payment Methods"
            tag={item => (
              <Tag color={item.isActive ? "green" : "red"}>
                {item.isActive ? "Active" : "Inactive"}
              </Tag>
            )}
            sortData={data =>
              data.paymentMethods.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))
            }
            name={item => item.name}
            modal={PaymentMethodFormModal}
            searchFilterField="name"
          />
        </TabPane>
        <TabPane tab="Users" key={tabKeys[3]}>
          <AdminContentList
            query={USER_LIST_QUERY}
            title="Users"
            tag={getUserTag}
            sortData={data =>
              data.users.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))
            }
            name={item => item.name}
            modal={UserFormModal}
            searchFilterField="name"
            hideAddButton
          />
        </TabPane>
        <TabPane tab="Budgets" key={tabKeys[4]}>
          <AdminContentList
            query={BUDGET_QUERY}
            title="Budgets"
            tag={item => (
              <Tag color={item.archived ? "gold" : "green"}>
                {item.archived ? "Archived" : "Active"}
              </Tag>
            )}
            sortData={data =>
              data.budgets.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))
            }
            name={item => item.name}
            modal={BudgetFormModal}
            searchFilterField="name"
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export default AdminHome;
