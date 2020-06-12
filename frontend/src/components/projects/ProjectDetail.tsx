import React from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {Project, PROJECT_DETAIL_QUERY} from "../../util/types/Project";
import LoadingSpinner from "../../util/LoadingSpinner";
import {Grid, Header, Message, Table} from "semantic-ui-react";
import {Requisition} from "../../util/types/Requisition";
import RequisitionTableRow from "../requisition/RequisitionTableRow";

const ProjectDetail: React.FC<{}> = (props) => {
    let {projectReference} = useParams();

    let [year, shortCode] = (projectReference || "").split("-");

    const {loading, data, error} = useQuery(PROJECT_DETAIL_QUERY, {
        variables: {year, shortCode}
    });

    if (loading) {
        return <LoadingSpinner active={true} message={"Loading project data..."}/>;
    }

    if (error || (data && !data.project)) {
        return <Message error>Unable to display this project</Message>;
    }

    let projectData: Project = data.project as Project;

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Header size="huge">{projectData.name}</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Table basic="very">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textAlign='center' width={4}>Requisition</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center' width={6}>Headline</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center' width={3}>Overall Cost</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center' width={3}>Status</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {projectData.requisitionSet.map((rek: Requisition) => <RequisitionTableRow key={rek.id} data={rek}/>)}
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default ProjectDetail;