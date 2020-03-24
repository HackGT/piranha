import React from 'react';
import {Grid, Header} from "semantic-ui-react";
import ProjectsList from "./ProjectsList";

function ProjectsContainer(props: any) {
    return (
        <Grid columns={1} stackable>
            <Grid.Row>
                <Grid.Column>
                    <Header size={"huge"}>Projects</Header>
                    <ProjectsList/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default ProjectsContainer;