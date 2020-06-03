import React from 'react';
import {useQuery} from "@apollo/client";
import {Project, PROJECTS_QUERY} from "../../util/types/Project";
import {Card, Header, Icon, Message} from "semantic-ui-react";
import LoadingSpinner from "../../util/LoadingSpinner";
import {User} from "../../util/types/User";

function ProjectsList(props: any) {
    const {loading, data, error} = useQuery(PROJECTS_QUERY);

    if (loading) {
        return <LoadingSpinner active={true} message={"Loading projects..."}/>;
    }

    if (error || (data && !data.projects)) {
        return <Message error>Unable to display projects</Message>;
    }

    if (data && !data.projects.length) {
        return <Message header="No projects" content="There are no projects to show right now"/>
    }

    return (
        <Card.Group>
            {data && data.projects.map((project: Project) =>
                <Card key={project.id}>
                    <Card.Content as={Header} content={project.name}/>
                    {project.leads.map((lead: User) => <Card.Content key={lead.id}>
                        <Icon name={"user"}/> {lead.preferredName} {lead.lastName}
                    </Card.Content>)}
                </Card>
            )}
        </Card.Group>


    );
}

export default ProjectsList;