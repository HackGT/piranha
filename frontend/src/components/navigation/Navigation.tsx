import React, {useState} from "react";
import {Button, Menu, Responsive, Sidebar} from "semantic-ui-react";
import NavPages from "./NavPages";
import NavPagesMenu from "./NavPagesMenu";

// Partially inspired by https://stackoverflow.com/a/46316014
const Navigation = (props: any) => {
    const [sidebarVisible, setSidebarVisible] = useState(false);

    return <>
        <Sidebar
            as={Menu}
            animation="overlay"
            direction="left"
            icon="labeled"
            inverted
            onHide={() => setSidebarVisible(false)}
            vertical
            visible={sidebarVisible}
            width="thin"
        >
            <NavPages inSidebar onClick={() => setSidebarVisible(false)}/>
        </Sidebar>

        <Sidebar.Pusher style={{marginBottom: 30}} dimmed={sidebarVisible}>
            <Responsive maxWidth={767}>
                <NavPagesMenu mobile>
                    <Menu.Item as={Button} link onClick={() => setSidebarVisible(!sidebarVisible)}>Menu</Menu.Item>
                </NavPagesMenu>
            </Responsive>
            <Responsive minWidth={768}>
                <NavPagesMenu/>
            </Responsive>
        </Sidebar.Pusher>
    </>;
};

export default Navigation;
