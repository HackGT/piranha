import React from 'react';
import './App.css';
import Navigation from "./components/navigation/Navigation";
import {Sidebar} from 'semantic-ui-react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Test from "./components/Test";

function App() {
    return (
        <div className="App">
            <Sidebar.Pushable as={"div"} style={{
                width: "100%",
                maxWidth: "960px",
                margin: "0 auto",
                padding: "0 5px",
                minHeight: "100vh" // We need the page height to match the screen/window height so the mobile
                                   // hamburger menu appears correctly.  This method of doing that is from https://github.com/ctrlplusb/react-sizeme/issues/111#issuecomment-295166102
            }}>
                <Router>
                    <div>
                        <Navigation/>
                        <Switch>
                            <Route exact path="/" component={Test}/>
                        </Switch>
                    </div>
                </Router>
            </Sidebar.Pushable>

        </div>
    );
}

export default App;
