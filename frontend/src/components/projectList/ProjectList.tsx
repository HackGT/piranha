import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { Card, Empty, List, Skeleton, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons/lib";
import { User } from "../../types/User";
import { Project, PROJECT_LIST_QUERY } from "../../types/Project";

const { Text, Title } = Typography;

const ProjectList: React.FC = () => {
  const { loading, data, error } = useQuery(PROJECT_LIST_QUERY);

  if (error || (data && !data.projects)) {
    return (
      <>
        <Text type="danger">Error: Unable to display the projects.</Text>
        <Text>{error?.message}</Text>
      </>
    );
  }

  if (data && !data.projects.length) {
    return (
      <>
        <Title>Projects</Title>
        <Empty />
      </>
    );
  }

  const projectData = loading ? [{}, {}] : data.projects;

  return (
    <>
      <Title>{loading ? "Loading..." : "Projects"}</Title>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
        dataSource={projectData}
        renderItem={(item: Project) => (
          <List.Item>
            <Link to={`/project/${item.referenceString}`}>
              <Card
                title={(
                  <Skeleton loading={loading} paragraph={false} active>
                    <div className="card-head-wrapper">
                      <Title level={3} className="card-head-title">{item.name}</Title>
                      <Title level={3} className="card-head-subtitle">{item.year}</Title>
                    </div>
                  </Skeleton>
                )}
                loading={loading}
                hoverable
              >
                <Text strong underline>Leads</Text>
                <List
                  dataSource={item.leads}
                  renderItem={(lead: User) => (
                    <List.Item>
                      <Text>
                        <UserOutlined style={{ marginRight: "5px" }} />
                        {`${lead.preferredName} ${lead.lastName}`}
                      </Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </>
  );
};

export default ProjectList;
