import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { HeartOutlined } from "@ant-design/icons";
import { Layout, Spin } from "antd";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { setPersistence, getAuth, inMemoryPersistence } from "firebase/auth";
import {
  useLogin,
  LoadingScreen,
  apiUrl,
  Service,
  NotFoundScreen,
  ErrorScreen,
} from "@hex-labs/core";

import Navigation from "./components/navigation/Navigation";
import Home from "./components/home/Home";
import RequisitionForm from "./components/requisitions/form/RequisitionForm";
import ProjectDetail from "./components/projects/detail/ProjectDetail";
import BudgetDetail from "./components/budgets/detail/BudgetDetail";
import RequisitionDetail from "./components/requisitions/detail/RequisitionDetail";
import ProjectList from "./components/projects/list/ProjectList";
import RequisitionEdit from "./components/requisitions/form/RequisitionEdit";
import AdminHome from "./components/admin/AdminHome";
import PrivateRoute from "./components/navigation/PrivateRoute";
import ScrollToTop from "./util/ScrollToTop";
import BudgetList from "./components/budgets/list/BudgetList";
import "./App.css";

const { Header, Content, Footer } = Layout;

// Initialized the Firebase app through the credentials provided
export const app = initializeApp({
  apiKey: "AIzaSyCsukUZtMkI5FD_etGfefO4Sr7fHkZM7Rg",
  authDomain: "auth.hexlabs.org",
});
// Sets the Firebase persistence to in memory since we use cookies for session
// management. These cookies are set by the backend on login/logout.
setPersistence(getAuth(app), inMemoryPersistence);

// By default sends axios requests with user session cookies so that the backend
// can verify the user's identity.
axios.defaults.withCredentials = true;

const App: React.FC = () => {
  const [loading, loggedIn] = useLogin(app);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userDataError, setUserDataError] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(apiUrl(Service.FINANCE, "/user/check"));
        setUser(response.data);
      } catch (err: any) {
        setUserDataError(err);
      } finally {
        setUserDataLoading(false);
      }
    };

    if (loggedIn) {
      getUserData();
    } else {
      setUser(null);
    }
  }, [loggedIn]);

  // If loading, show a loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // If the user is not logged in, redirect to the login frontend with a redirect
  // param so that the user can login and come back to the page they were on.
  if (!loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
    return <LoadingScreen />;
  }

  if (userDataLoading) {
    return <LoadingScreen />;
  }
  if (userDataError) {
    return <ErrorScreen error={userDataError} />;
  }

  return (
    <>
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
              <Routes>
                <Route
                  path="/project/:projectReference/requisition/:requisitionReference/edit"
                  element={<RequisitionEdit />}
                />
                <Route
                  path="/project/:projectReference/requisition/:requisitionReference"
                  element={<RequisitionDetail />}
                />
                <Route
                  path="/budget/:id"
                  element={
                    <PrivateRoute user={user}>
                      <BudgetDetail />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/budget"
                  element={
                    <PrivateRoute user={user}>
                      <BudgetList />
                    </PrivateRoute>
                  }
                />
                <Route path="/project/:projectReference" element={<ProjectDetail />} />
                <Route path="/project" element={<ProjectList />} />
                <Route path="/requisition" element={<RequisitionForm />} />
                <Route
                  path="/admin/:activeTab?"
                  element={
                    <PrivateRoute user={user}>
                      <AdminHome />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Home />} />
                <Route element={<NotFoundScreen />} />
              </Routes>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {"Made with "}
          <HeartOutlined />
          {" by the HexLabs Team"}
        </Footer>
      </Layout>
    </>
  );
};

export default App;
