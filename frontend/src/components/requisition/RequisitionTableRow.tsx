import React from "react";
import {Label, Table} from "semantic-ui-react";
import {Requisition, StatusToColor, StatusToString} from "../../util/types/Requisition";
import {Link} from "react-router-dom";

interface RequisitionTableRowProps {
    data: Requisition
}

const RequisitionTableRow: React.FC<RequisitionTableRowProps> = (props) => {
    let statusString = StatusToString(props.data.status);
    let color = StatusToColor(props.data.status);

    let navigationUrl = `/project/${props.data.project.referenceString}/requisition/${props.data.projectRequisitionId}`

    return (
        <Table.Row>
            <Table.Cell textAlign='center' width={5}>
                <Link to={navigationUrl}>
                    {props.data.referenceString}
                </Link>
            </Table.Cell>
            <Table.Cell textAlign='center' width={6}>{props.data.headline}</Table.Cell>
            <Table.Cell textAlign='center' width={5}><Label color={color}>{statusString}</Label></Table.Cell>
        </Table.Row>

    )
}

export default RequisitionTableRow;