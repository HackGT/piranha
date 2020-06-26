import React from 'react';
import {useQuery} from "@apollo/client";
import {Project, PROJECTS_LIST_QUERY} from "../../util/types/Project";
import {User} from "../../util/types/User";
import {Link} from "react-router-dom";
import {Card, Empty, List, Skeleton, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons/lib";

const {Text, Title} = Typography;

function ProjectsList(props: any) {
    const {loading, data, error} = useQuery(PROJECTS_LIST_QUERY);

    if (error || (data && !data.projects)) {
        return (
            <>
                <Text type="danger">Error: Unable to display the projects.</Text>
                <Text>{error?.message}</Text>
            </>
        )
    }

    if (data && !data.projects.length) {
        return (
            <>
                <Title>Projects</Title>
                <Empty />
            </>
        )
    }

    let projectData = loading ? [{}, {}] : data.projects;

    return (
        <>
            <Title>{loading ? "Loading..." : "Projects"}</Title>
            <List
                grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5}}
                dataSource={projectData}
                renderItem={(item: Project) => (
                    <List.Item>
                        <Link to={"/project/" + item.referenceString}>
                            <Card
                                title={
                                    <Skeleton loading={loading} paragraph={false} active>
                                        <Title level={3} style={{marginBottom: 0}}>{item.name}</Title>
                                    </Skeleton>
                                }
                                loading={loading}
                                hoverable
                            >
                                <Text strong underline>Leads</Text>
                                <List
                                    dataSource={item.leads}
                                    renderItem={(lead: User) => (
                                        <List.Item>
                                            <Text>
                                                <UserOutlined
                                                    style={{marginRight: '5px'}}/> {lead.preferredName} {lead.lastName}
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
}

export default ProjectsList;