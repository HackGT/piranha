import React from "react";
import { List, Typography } from "antd";
import { Helmet } from "react-helmet";
import { apiUrl, Service, ErrorScreen } from "@hex-labs/core";
import useAxios from "axios-hooks";

import ProjectListCard from "./ProjectListCard";
import { Project } from "../../../generated/types";

const { Title } = Typography;

const ProjectList: React.FC = () => {
  const [{ loading, data, error }] = useAxios(apiUrl(Service.FINANCE, "/projects"));

  if (error) {
    return <ErrorScreen error={error} />;
  }

  const projectData = loading
    ? [{ archived: true }, { archived: true }, { archived: false }, { archived: false }]
    : data;

  const grid = { gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 };

  return (
    <>
      {/* @ts-ignore */}
      <Helmet>
        <title>Piranha - Projects</title>
      </Helmet>
      <Title>{loading ? "Loading..." : "Projects"}</Title>
      <Title style={{ textAlign: "center" }} level={3}>
        Active Projects
      </Title>
      <List
        grid={grid}
        dataSource={projectData.filter((item: Project) => !item.archived)}
        renderItem={(item: Project) => (
          <List.Item>
            <ProjectListCard item={item} loading={loading} />
          </List.Item>
        )}
      />
      <Title style={{ textAlign: "center", marginTop: "20px" }} level={3}>
        Archived Projects
      </Title>
      <List
        grid={grid}
        dataSource={projectData.filter((item: Project) => item.archived)}
        renderItem={(item: Project) => (
          <List.Item>
            <ProjectListCard item={item} loading={loading} />
          </List.Item>
        )}
      />
    </>
  );
};

export default ProjectList;
