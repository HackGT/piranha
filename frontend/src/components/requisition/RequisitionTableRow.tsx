import React from "react";
import {Label, Table} from "semantic-ui-react";
import {RequisitionStatus, StatusToColor} from "../../util/types/Requisition";

interface RequisitionTableRowProps {
    data: {
        id: string,
        referenceId: string,
        headline: string,
        status: string,
        project: {
            id: string
        }
    }
}

const RequisitionTableRow: React.FC<RequisitionTableRowProps> = (props) => {
    let requisitionStatus = RequisitionStatus[props.data.status as keyof typeof RequisitionStatus];
    let color = StatusToColor(requisitionStatus);

    return (
        <Table.Row>
            <Table.Cell textAlign='center' width={5}>{props.data.referenceId}</Table.Cell>
            <Table.Cell textAlign='center' width={6}>{props.data.headline}</Table.Cell>
            <Table.Cell textAlign='center' width={5}><Label color={color}>{requisitionStatus.toString()}</Label></Table.Cell>
        </Table.Row>
    )
}

export default RequisitionTableRow;