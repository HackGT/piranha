import React, {Fragment} from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import LoadingSpinner from "../../util/LoadingSpinner";
import {Grid, Header, Item, Label, Message, Segment} from "semantic-ui-react";
import {
    Requisition,
    REQUISITION_DETAIL_QUERY,
    RequisitionItem,
    StatusToColor,
    StatusToString
} from "../../util/types/Requisition";
import moment from "moment";

const RequisitionDetail: React.FC<{}> = (props) => {
    let {projectReference, requisitionReference} = useParams();

    let [year, shortCode] = (projectReference || "").split("-");

    let projectRequisitionId: number = parseInt(requisitionReference || "");

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
                <Grid.Row>
                    <Grid.Column>
                        <Label color={StatusToColor(requisitionData.status)}>{StatusToString(requisitionData.status)}</Label>
                    </Grid.Column>
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
                            <Item.Header as="h4">Description</Item.Header>
                            <Item.Description>{requisitionData.description}</Item.Description>
                        </Item>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} textAlign={"center"} divided>
                    <Grid.Column>
                        <Item>
                            <Item.Header as="h4">Payment Required By</Item.Header>
                            <Item.Description>{moment(requisitionData.paymentRequiredBy).format('dddd, MMMM Do, YYYY')}</Item.Description>
                        </Item>
                    </Grid.Column>
                    <Grid.Column>
                        <Item>
                            <Item.Header as="h4">Vendor</Item.Header>
                            <Item.Description>{requisitionData.vendor.name}</Item.Description>
                        </Item>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {requisitionData.requisitionitemSet.map((item: RequisitionItem) =>
                <Fragment>
                    <Header as="h3" attached="top">
                        {item.name}
                    </Header>
                    <Segment attached="bottom">
                        <Grid>
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
                                        <Item.Description>${item.unitPrice}</Item.Description>
                                    </Item>
                                </Grid.Column>
                                <Grid.Column>
                                    <Item>
                                        <Item.Header as="h4">Link</Item.Header>
                                        <Item.Description>{item.link}</Item.Description>
                                    </Item>
                                </Grid.Column>
                            </Grid.Row>
                            {item.notes ?
                                <Grid.Row>
                                    <Grid.Column>
                                        <Item>
                                            <Item.Header as="h4">Notes</Item.Header>
                                            <Item.Description>{item.notes}</Item.Description>
                                        </Item>
                                    </Grid.Column>
                                </Grid.Row>
                                : ""
                            }
                        </Grid>
                    </Segment>
                </Fragment>
            )}
            <div style={{height: "30px"}} />
        </Fragment>
    )
}

export default RequisitionDetail;