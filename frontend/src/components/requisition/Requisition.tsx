import React, {Fragment} from "react";
import {Message, Header, Divider} from "semantic-ui-react";
import RequisitionForm from "./RequisitionForm";
import {useQuery} from "@apollo/client";
import {Project, PROJECTS_QUERY} from "../../util/types/Project";
import LoadingSpinner from "../../util/LoadingSpinner";

const Requisition: React.FunctionComponent<{}> = (props) => {

    const {loading, data, error} = useQuery(PROJECTS_QUERY);

    if (loading) {
        return <LoadingSpinner active message={"Loading data..."}/>;
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
        <Fragment>
            <Header as='h1'>Create New Requisition</Header>
            <Divider />
            <RequisitionForm
                projectOptions={options}
            />
        </Fragment>
    )
}

export default Requisition;