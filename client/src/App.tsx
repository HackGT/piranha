import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HeartOutlined } from "@ant-design/icons";
import { Layout, Spin } from "antd";
import "./App.css";
import { useQuery } from "@apollo/client";

import Navigation from "./components/general/Navigation";
import Home from "./components/home/Home";
import RequisitionForm from "./components/requisitions/form/RequisitionForm";
import ProjectDetail from "./components/projects/detail/ProjectDetail";
import BudgetDetail from "./components/budgets/detail/BudgetDetail";
import RequisitionDetail from "./components/requisitions/detail/RequisitionDetail";
import ProjectList from "./components/projects/list/ProjectList";
import RequisitionEdit from "./components/requisitions/form/RequisitionEdit";
import AdminHome from "./components/admin/AdminHome";
import { USER_INFO_QUERY } from "./queries/User";
import PrivateRoute from "./util/PrivateRoute";
import NotFound from "./components/general/NotFound";
import ErrorDisplay from "./util/ErrorDisplay";
import ScrollToTop from "./util/ScrollToTop";
import { User } from "./generated/types";
import BudgetList from "./components/budgets/list/BudgetList";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const { loading, data, error } = useQuery(USER_INFO_QUERY);

  if (error || (data && !data.user)) {
    return <ErrorDisplay error={error} />;
  }

  const user: User = data && data.user;

  return (
    <Router>
      <ScrollToTop />
      <Layout className="App" style={{ minHeight: "100vh" }}>
        <Header style={{ padding: "0px 30px" }}>
          <Navigation user={user} />
        </Header>
        <Content id="wrapper">
          <div style={{ background: "#fff", padding: "24px", flexGrow: 1 }}>
            {loading ? (
              <Spin style={{ position: "absolute", top: "48%", left: "48%" }} />
            ) : (
              <Switch>
                <Route
                  exact
                  path="/project/:projectReference/requisition/:requisitionReference/edit"
                  component={RequisitionEdit}
                />
                <Route
                  exact
                  path="/project/:projectReference/requisition/:requisitionReference"
                  component={RequisitionDetail}
                />
                <Route exact path="/budget/:id" component={BudgetDetail} />
                <Route exact path="/budget" component={BudgetList} />
                <Route exact path="/project/:projectReference" component={ProjectDetail} />
                <Route exact path="/project" component={ProjectList} />
                <Route exact path="/requisition" component={RequisitionForm} />
                <PrivateRoute exact path="/admin/:activeTab?" component={AdminHome} user={user} />
                <Route exact path="/" component={Home} />
                <Route component={NotFound} />
              </Switch>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {"Made with "}
          <HeartOutlined />
          {" by the HackGT Team"}
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
