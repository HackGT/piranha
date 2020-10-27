import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons/lib";

interface Props {
  projectReference?: string;
  secondItem: JSX.Element | string;
  thirdItem?: string;
}

const ProjectBreadcrumb: React.FC<Props> = props => (
  <Breadcrumb style={{ marginBottom: "8px" }}>
    <Breadcrumb.Item>
      <Link to="/project"><HomeOutlined /></Link>
    </Breadcrumb.Item>
    <Breadcrumb.Item>
      {props.projectReference
        ? <Link to={`/project/${props.projectReference}`}>{props.secondItem}</Link>
        : props.secondItem}
    </Breadcrumb.Item>
    {props.thirdItem && (
      <Breadcrumb.Item>
        {props.thirdItem}
      </Breadcrumb.Item>
    )}
  </Breadcrumb>
);

export default ProjectBreadcrumb;
