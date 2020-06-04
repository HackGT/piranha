import React from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {Project, PROJECT_DETAIL} from "../../util/types/Project";
import LoadingSpinner from "../../util/LoadingSpinner";
import {Grid, Header, Message, Table} from "semantic-ui-react";
import {Requisition} from "../../util/types/Requisition";
import RequisitionTableRow from "../requisition/RequisitionTableRow";

const ProjectDetail: React.FC<{}> = (props) => {
    let {referenceString} = useParams();

    let [year, shortCode] = (referenceString || "").split("-");

    const {loading, data, error} = useQuery(PROJECT_DETAIL, {
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
                                <Table.HeaderCell textAlign='center' width={5}>Requisition</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center' width={6}>Headline</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center' width={5}>Status</Table.HeaderCell>
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