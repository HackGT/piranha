import React, {Fragment} from "react";
import {Button, Form, Grid, Header, Segment} from "semantic-ui-react";
import {RequisitionItem} from "../../util/types/RequisitionItem";

interface RequisitionItemSegmentProps {
    id: number,
    data: RequisitionItem,
    deleteItem: (item: number) => void,
    onChange: (event: any, data: any) => void,
    deleteDisabled: boolean
}

const RequisitionItemSegment: React.FunctionComponent<RequisitionItemSegmentProps> = (props: RequisitionItemSegmentProps) => {
    return (
        <Fragment>
            <Header as='h4' attached='top'>
                Item {props.id + 1}
            </Header>
            <Segment attached='bottom'>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form.Input
                                name='name'
                                value={props.data.name}
                                label='Name'
                                placeholder='Name...'
                                onChange={props.onChange}
                                required
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Input
                                name='link'
                                value={props.data.link}
                                label='Link'
                                placeholder='Link...'
                                onChange={props.onChange}
                                type="url"
                                required
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form.Input
                                name='price'
                                value={props.data.price || ''}
                                label='Price'
                                placeholder='Price...'
                                onChange={props.onChange}
                                type="number"
                                required
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Input
                                name='quantity'
                                value={props.data.quantity || ''}
                                label='Quantity'
                                placeholder='Quantity...'
                                onChange={props.onChange}
                                type="number"
                                required
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Form.TextArea
                                name='notes'
                                value={props.data.notes}
                                label='Notes'
                                placeholder='Notes...'
                                onChange={props.onChange}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Button
                                disabled={props.deleteDisabled}
                                color='red'
                                onClick={() => props.deleteItem(props.id)}
                                basic
                            >
                                Delete
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </Fragment>
    )
}

export default RequisitionItemSegment;