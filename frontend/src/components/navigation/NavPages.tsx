import React from "react";
import PropTypes from "prop-types";
import {Menu} from "semantic-ui-react";
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
];

type NavPagesProps = {
    inSidebar?: boolean,
    mobile?: boolean,
    children?: any,
    onClick?: () => any
}

// This component assumes it's a child of a Menu
const NavPages = (props: NavPagesProps) => {
    const logo = <Menu.Item>
        <img src="https://react.semantic-ui.com/logo.png" alt="Semantic UI logo"/>
    </Menu.Item>;

    const appName = <Menu.Item><strong>Piranha</strong></Menu.Item>;

    return <>
        {logo}
        {appName}
        {props.children}
        {!props.mobile && routes.map(route => <Menu.Item key={route.link} as={Link}
                                                         onClick={props.inSidebar ? props.onClick : () => null}
                                                         to={route.link}>{route.name}</Menu.Item>)}
    </>;
};

NavPages.propTypes = {
    mobile: PropTypes.bool
};

export default NavPages;
