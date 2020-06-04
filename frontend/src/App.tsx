import React from 'react';
import Navigation from "./components/navigation/Navigation";
import {Sidebar} from 'semantic-ui-react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from "./components/Home";
import Requisition from "./components/requisition/Requisition";
import ProjectDetail from "./components/projects/ProjectDetail";
import RequisitionDetail from "./components/requisition/RequisitionDetail";

function App() {
    return (
        <div className="App">
            <Sidebar.Pushable as={"div"} style={{
                width: "100%",
                margin: "0 auto",
                padding: "0 10px",
                minHeight: "100vh", // We need the page height to match the screen/window height so the mobile
                // hamburger menu appears correctly.  This method of doing that is from https://github.com/ctrlplusb/react-sizeme/issues/111#issuecomment-295166102
            }}>
                <Router>
                    <div>
                        <Navigation/>
                        <div style={{
                            maxWidth: "960px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            paddingLeft: 10,
                            paddingRight: 10
                        }}>
                            <Switch>
                                <Route path="/project/:projectReference/requisition/:requisitionReference" component={RequisitionDetail} />
                                <Route path="/project/:projectReference" component={ProjectDetail} />
                                <Route exact path="/requisition" component={Requisition}/>
                                <Route exact path="/" component={Home}/>
                            </Switch>
                        </div>
                    </div>
                </Router>
            </Sidebar.Pushable>

        </div>
    );
}

export default App;
