import React, { useEffect, useState } from "react";
import { Drawer, Menu, Button, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons/lib";
import { Link } from "react-router-dom";

import { User } from "../../generated/types";

class Page {
  name: string;
  link: string;
  privateRoute: boolean;

  constructor(name: string, link: string, privateRoute = false) {
    this.name = name;
    this.link = link;
    this.privateRoute = privateRoute;
  }
}

export const routes = [
  new Page("Home", "/"),
  new Page("Projects", "/project"),
  new Page("Create Requisition", "/requisition"),
  new Page("Admin", "/admin", true),
  new Page("Budgets", "/budget", true),
];

interface Props {
  user: any;
}

const Navigation: React.FC<Props> = props => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const filteredRoutes = routes.filter((page: Page) => !page.privateRoute || props.user.roles.exec);

  return (
    <div style={{ direction: "rtl" }}>
      <Drawer
        title="Menu"
        placement="left"
        closable
        onClose={() => setSidebarOpen(false)}
        open={sidebarOpen}
      >
        <Menu mode="vertical" style={{ borderRight: "none" }} selectable={false}>
          {filteredRoutes.map((route: Page) => (
            <Menu.Item key={route.name}>
              <Link onClick={() => setSidebarOpen(false)} to={route.link}>
                {route.name}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>

      <div id="logo" style={{ float: "left" }}>
        <Typography.Title
          level={3}
          style={{
            marginBottom: "2px",
            display: "inline-block",
            color: "white",
            verticalAlign: "middle",
            letterSpacing: "7px",
          }}
        >
          PIRANHA
        </Typography.Title>
      </div>

      {width < 768 ? (
        <Button
          style={{ textAlign: "right" }}
          icon={<MenuOutlined />}
          type="link"
          onClick={() => setSidebarOpen(true)}
        />
      ) : (
        <Menu theme="dark" mode="horizontal" selectable={false}>
          {filteredRoutes
            .slice()
            .reverse()
            .map((route: Page) => (
              <Menu.Item key={route.name}>
                <Link to={route.link}>{route.name}</Link>
              </Menu.Item>
            ))}
        </Menu>
      )}
    </div>
  );
};

export default Navigation;
