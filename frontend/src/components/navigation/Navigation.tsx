import React, {useEffect, useState} from "react";
import {Drawer, Menu, Button, Typography} from "antd";
import {MenuOutlined} from "@ant-design/icons/lib";
import {Link} from "react-router-dom";

class Page {
    name: string;
    link: string;

    constructor(name: string, link: string) {
        this.name = name;
        this.link = link;
    }
}

export const routes = [
    new Page("Home", "/"),
    new Page("Create Requisition", "/requisition")
];

const Navigation = (props: any) => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    return <div style={{direction: "rtl"}}>
        <Drawer
            title="Menu"
            placement="left"
            closable={true}
            onClose={() => setSidebarVisible(false)}
            visible={sidebarVisible}
        >
            <Menu mode="vertical" style={{borderRight: "None"}} selectable={false}>
                {routes.map((route: Page) =>
                    <Menu.Item key={route.name}><Link to={route.link}>{route.name}</Link></Menu.Item>)
                }
            </Menu>
        </Drawer>

        <div id="logo" style={{
            float: 'left'
        }}>
            <Typography.Title level={3} style={{
                marginBottom: '2px',
                display: 'inline-block',
                color: 'white',
                verticalAlign: 'middle',
                letterSpacing: '7px'
            }}>PIRANHA</Typography.Title>
        </div>

        {width < 768 ?
            <Button style={{textAlign: "right"}} icon={<MenuOutlined/>} type="link"
                    onClick={() => setSidebarVisible(true)}/>
            : <Menu theme="dark" mode="horizontal" selectable={false}>
                {routes.slice().reverse().map((route: Page) =>
                    <Menu.Item key={route.name}><Link to={route.link}>{route.name}</Link></Menu.Item>)
                }
            </Menu>
        }
    </div>;
};

export default Navigation;
