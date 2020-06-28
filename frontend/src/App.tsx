import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HeartOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import Navigation from "./components/navigation/Navigation";
import Home from "./components/home/Home";
import RequisitionForm from "./components/requisitionForm/RequisitionForm";
import ProjectDetail from "./components/projectDetail/ProjectDetail";
import RequisitionDetail from "./components/requisitionDetail/RequisitionDetail";
import ProjectList from "./components/projectList/ProjectList";

import "./App.css";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout className="App" style={{ minHeight: "100vh" }}>
        <Header style={{ padding: "0px 30px" }}>
          <Navigation />
        </Header>
        <Content id="wrapper">
          <div style={{ background: "#fff", padding: "24px", flexGrow: 1 }}>
            <Switch>
              <Route
                path="/project/:projectReference/requisition/:requisitionReference"
                component={RequisitionDetail}
              />
              <Route
                path="/project/:projectReference"
                component={ProjectDetail}
              />
              <Route exact path="/project" component={ProjectList} />
              <Route exact path="/requisition" component={RequisitionForm} />
              <Route exact path="/" component={Home} />
            </Switch>
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
}

export default App;
