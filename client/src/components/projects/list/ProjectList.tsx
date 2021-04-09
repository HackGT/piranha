import React from "react";
import { useQuery } from "@apollo/client";
import { List, Typography } from "antd";
import { Helmet } from "react-helmet";

import { PROJECT_LIST_QUERY } from "../../../queries/Project";
import ProjectListCard from "./ProjectListCard";
import ErrorDisplay from "../../../util/ErrorDisplay";
import { Project } from "../../../generated/types";

const { Title } = Typography;

const ProjectList: React.FC = () => {
  const { loading, data, error } = useQuery(PROJECT_LIST_QUERY);

  if (error || (data && !data.projects)) {
    return <ErrorDisplay error={error} />;
  }

  const projectData = loading
    ? [{ archived: true }, { archived: true }, { archived: false }, { archived: false }]
    : data.projects;

  const grid = { gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 };

  return (
    <>
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
