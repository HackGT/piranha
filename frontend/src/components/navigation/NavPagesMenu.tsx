import React from "react";
import NavPages from "./NavPages";
import {Menu} from "semantic-ui-react";

const NavPagesMenu = (props: any) => {
    return <Menu>
        <NavPages mobile={props.mobile}>
            {props.children}
        </NavPages>
    </Menu>;
};

export default NavPagesMenu;
