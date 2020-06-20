import React from 'react';
import Navigation from "./components/navigation/Navigation";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from "./components/Home";
import Requisition from "./components/requisition/Requisition";
import ProjectDetail from "./components/projects/ProjectDetail";
import RequisitionDetail from "./components/requisition/RequisitionDetail";

import {Layout} from 'antd';
import {HeartOutlined} from "@ant-design/icons";
const {Header, Content, Footer} = Layout;

function App() {
    return (
        <Router>
            <Layout className="App" style={{minHeight: '100vh'}}>
                <Header>
                    <Navigation/>
                </Header>
                <Content style={{padding: '30px 30px 0 30px', display: 'flex', flexDirection: 'column'}}>
                    <div style={{background: '#fff', padding: '24px', flexGrow: 1}}>
                        <Switch>
                            <Route path="/project/:projectReference/requisition/:requisitionReference"
                                   component={RequisitionDetail}/>
                            <Route path="/project/:projectReference"
                                   component={ProjectDetail}/>
                            <Route exact path="/requisition"
                                   component={Requisition}/>
                            <Route exact path="/"
                                   component={Home}/>
                        </Switch>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>Made with <HeartOutlined/> by the HackGT Team</Footer>
            </Layout>
        </Router>
    );
}

export default App;
