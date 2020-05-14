import React from "react";
import {Container, Message} from "semantic-ui-react";
import RequisitionForm from "./RequisitionForm";
import {useQuery} from "@apollo/client";
import {Project, PROJECTS_QUERY} from "../../util/types/Project";
import LoadingSpinner from "../../util/LoadingSpinner";

function Requisition(props: any) {

    const {loading, data, error} = useQuery(PROJECTS_QUERY);

    if (loading) {
        return <LoadingSpinner active={true} message={"Loading data..."}/>;
    }

    if (error) {
        return <Message error>Unable to display projects</Message>;
    }

    const options = data.projects.map((project: Project) => {
        return {
            text: project.name,
            value: project.name
        }
    })

    return (
        <Container text>
            <RequisitionForm
                projectOptions={options}
            />
        </Container>
    )
}

export default Requisition;