import React, {Fragment} from "react";
import {useParams, Link, useLocation} from "react-router-dom";
import {useQuery} from "@apollo/client";
import LoadingSpinner from "../../util/LoadingSpinner";
import {Divider, Grid, Header, Item, Label, Message, Segment, Table} from "semantic-ui-react";
import {
    getTotalCost,
    getTotalItemsCost,
    Requisition,
    REQUISITION_DETAIL_QUERY,
    RequisitionItem,
    StatusToString
} from "../../util/types/Requisition";
import moment from "moment";

const RequisitionDetail: React.FC<{}> = (props) => {
    let {projectReference, requisitionReference} = useParams();

    let [year, shortCode] = (projectReference || "").split("-");

    let projectRequisitionId: number = parseInt(requisitionReference || "");

    const location = useLocation();
    const {loading, data, error} = useQuery(REQUISITION_DETAIL_QUERY, {
        variables: {year, shortCode, projectRequisitionId}
    });

    if (loading) {
        return <LoadingSpinner active={true} message={"Loading requisition data..."}/>;
    }

    if (error || (data && !data.requisition)) {
        return <Message error>Unable to display this requisition</Message>;
    }

    let requisitionData: Requisition = data.requisition as Requisition;

    console.log(requisitionData);

    return (
        <Fragment>
            <Grid stackable>
                <Grid.Row columns={requisitionData.canEdit ? 2 : 1}>
                    <Grid.Column>
                        <Label
                            size="large"
                            >{StatusToString(requisitionData.status)}</Label>
                    </Grid.Column>
                    {requisitionData.canEdit ?
                        <Grid.Column textAlign="right">
                            <Link to={location.pathname.replace(/\/+$/, '') + "/edit"}>
                                <Label as="a" color="blue" size="large">Edit Requisition</Label>
                            </Link>
                        </Grid.Column>
                        : ""
                    }
                    <Grid.Column></Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Header size="huge">{requisitionData.headline}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Header size="large" color="grey">{requisitionData.project.name}</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Item>
                            <Item.Description>{requisitionData.description}</Item.Description>
                        </Item>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={3} textAlign={"center"} divided>
                    <Grid.Column>
                        <Item>
                            <Item.Header as="h4">Vendor</Item.Header>
                            <Item.Description>{requisitionData.vendor.name}</Item.Description>
                        </Item>
                    </Grid.Column>
                    <Grid.Column>
                        <Item>
                            <Item.Header as="h4">Payment Required By</Item.Header>
                            <Item.Description>{moment(requisitionData.paymentRequiredBy).format('dddd, MMMM Do, YYYY')}</Item.Description>
                        </Item>
                    </Grid.Column>
                    <Grid.Column>
                        <Item>
                            <Item.Header as="h4">Submitted By</Item.Header>
                            <Item.Description>{requisitionData.createdBy.preferredName} {requisitionData.createdBy.lastName}</Item.Description>
                        </Item>
                    </Grid.Column>
                </Grid.Row>
                <Divider />
                <Grid.Row>
                    <Grid.Column width={3} />
                    <Grid.Column width={10} textAlign="center">
                        <Table textAlign="center" celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Total Item Costs</Table.HeaderCell>
                                    <Table.HeaderCell>Other Fees</Table.HeaderCell>
                                    <Table.HeaderCell>Overall Cost</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>${getTotalItemsCost(requisitionData)}</Table.Cell>
                                    <Table.Cell>${requisitionData.otherFees.toFixed(2)}</Table.Cell>
                                    <Table.Cell>${getTotalCost(requisitionData)}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                    <Grid.Column width={3} />
                </Grid.Row>
            </Grid>
            {requisitionData.requisitionitemSet.map((item: RequisitionItem) =>
                <Fragment>
                    <Header as="h3" attached="top">
                        {item.name} - <a href={item.link} target="_blank" rel="noopener noreferrer">View</a>
                    </Header>
                    <Segment attached>
                        <Grid stackable>
                            <Grid.Row columns={3} textAlign="center" divided>
                                <Grid.Column>
                                    <Item>
                                        <Item.Header as="h4">Quantity</Item.Header>
                                        <Item.Description>{item.quantity}</Item.Description>
                                    </Item>
                                </Grid.Column>
                                <Grid.Column>
                                    <Item>
                                        <Item.Header as="h4">Unit Price</Item.Header>
                                        <Item.Description>${item.unitPrice.toFixed(2)}</Item.Description>
                                    </Item>
                                </Grid.Column>
                                <Grid.Column>
                                    <Item>
                                        <Item.Header as="h4">Subtotal</Item.Header>
                                        <Item.Description>${(item.quantity * item.unitPrice).toFixed(2)}</Item.Description>
                                    </Item>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    <Segment attached="bottom">
                        <Item>
                            <Item.Header as="h4">Notes</Item.Header>
                            <Item.Description>{item.notes}</Item.Description>
                        </Item>
                    </Segment>
                </Fragment>
            )}
            <div style={{height: "30px"}}/>
        </Fragment>
    )
}

export default RequisitionDetail;