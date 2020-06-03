import React from "react";
import {OPEN_REQUISITIONS_QUERY} from "../../util/types/Requisition";
import LoadingSpinner from "../../util/LoadingSpinner";
import {Message, Table} from "semantic-ui-react";
import {useQuery} from "@apollo/client";
import RequisitionTableRow from "./RequisitionTableRow";

interface RequisitionTableHomeProps {

}

const RequisitionTableHome: React.FC<RequisitionTableHomeProps> = (props) => {

    const {loading, data, error} = useQuery(OPEN_REQUISITIONS_QUERY);

    if (loading) {
        return <LoadingSpinner active={true} message={"Loading data..."}/>;
    }

    if (error || (data && !data.requisitions)) {
        return <Message error>Unable to display open requisitions</Message>;
    }

    if (data && !data.requisitions.length) {
        return <Message header="No projects" content="There are no projects to show right now"/>
    }

    return (
        <Table basic="very">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell textAlign='center' width={5}>Requisition</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center' width={6}>Headline</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center' width={5}>Status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.requisitions.map((rek: any) => <RequisitionTableRow data={rek}/>)}
            </Table.Body>
        </Table>
    )
}

export default RequisitionTableHome;