import React from 'react';
import {useQuery} from "@apollo/client";
import {Project, PROJECTS_QUERY} from "../../util/types/Project";
import {Message, Table} from "semantic-ui-react";
import LoadingSpinner from "../../util/LoadingSpinner";

function ProjectsList(props: any) {
    const {loading, data, error} = useQuery(PROJECTS_QUERY);

    if (loading) {
        return <LoadingSpinner active={true} message={"Loading projects..."}/>;
    }

    if (error) {
        return <Message error>Unable to display projects</Message>;
    }

    if (data && !data.projects.length) {
        return <Message header="No projects" content="There are no projects to show right now"/>
    }

    return (
        <Table basic={"very"}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Project</Table.HeaderCell>
                    <Table.HeaderCell>Fiscal Year</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data && data.projects.map((project: Project) =>
                    <Table.Row>
                        <Table.Cell content={project.name}/>
                        <Table.Cell content={project.fiscalYear.friendlyName}/>
                    </Table.Row>)}
            </Table.Body>
        </Table>
    );
}

export default ProjectsList;