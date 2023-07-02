import React from "react";
import { Tabs, Tag, Typography } from "antd";
import { useParams, useNavigate } from "react-router-dom";

import AdminContentList from "./AdminContentList";
import ProjectFormModal from "../modal/formModals/ProjectFormModal";
import VendorFormModal from "../modal/formModals/VendorFormModal";
import PaymentMethodFormModal from "../modal/formModals/PaymentMethodFormModal";
import BudgetFormModal from "../modal/formModals/BudgetFormModal";
import "./index.css";

const { Title } = Typography;
const { TabPane } = Tabs;

const AdminHome: React.FC = () => {
  const { activeTab } = useParams<any>();
  const navigate = useNavigate();

  const tabKeys = ["projects", "vendors", "payment-methods", "users", "budgets"];

  if (!tabKeys.includes(activeTab ?? "")) {
    navigate(`/admin/${tabKeys[0]}`);
  }

  return (
    <>
      <Title>Admin Panel</Title>
      <Tabs
        activeKey={activeTab}
        defaultActiveKey="projects"
        onTabClick={key => navigate(`/admin/${key}`)}
      >
        <TabPane tab="Projects" key={tabKeys[0]}>
          <AdminContentList
            title="Projects"
            dataUrl="/projects"
            tag={item => (
              <Tag color={item.archived ? "gold" : "green"}>
                {item.archived ? "Archived" : "Active"}
              </Tag>
            )}
            sortData={data => data.concat().sort((a: any, b: any) => b.year - a.year)}
            name={item => `${item.name} (${item.year})`}
            modal={ProjectFormModal}
            searchFilterField="name"
          />
        </TabPane>
        <TabPane tab="Vendors" key={tabKeys[1]}>
          <AdminContentList
            title="Vendors"
            dataUrl="/vendors"
            tag={item => (
              <Tag color={item.isActive ? "green" : "red"}>
                {item.isActive ? "Active" : "Inactive"}
              </Tag>
            )}
            sortData={data => data.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))}
            name={item => item.name}
            modal={VendorFormModal}
            searchFilterField="name"
          />
        </TabPane>
        <TabPane tab="Payment Methods" key={tabKeys[2]}>
          <AdminContentList
            title="Payment Methods"
            dataUrl="/payment-methods"
            tag={item => (
              <Tag color={item.isActive ? "green" : "red"}>
                {item.isActive ? "Active" : "Inactive"}
              </Tag>
            )}
            sortData={data => data.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))}
            name={item => item.name}
            modal={PaymentMethodFormModal}
            searchFilterField="name"
          />
        </TabPane>
        <TabPane tab="Budgets" key={tabKeys[4]}>
          <AdminContentList
            title="Budgets"
            dataUrl="/budgets"
            tag={item => (
              <Tag color={item.archived ? "gold" : "green"}>
                {item.archived ? "Archived" : "Active"}
              </Tag>
            )}
            sortData={data => data.concat().sort((a: any, b: any) => a.name.localeCompare(b.name))}
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
