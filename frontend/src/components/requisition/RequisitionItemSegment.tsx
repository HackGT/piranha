import React, {Fragment} from "react";
import {Button, Form, Grid, Header, Segment, Popup, Icon} from "semantic-ui-react";
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
                            <Form.Field required>
                                <label>Name</label>
                                <Popup
                                    content='The name of the sub item.'
                                    trigger={<Icon style={{cursor: 'help'}} name='question circle outline' />}
                                    basic
                                />
                                <Form.Input
                                    name='name'
                                    value={props.data.name}
                                    placeholder='Name...'
                                    onChange={props.onChange}
                                    required
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Field required>
                                <label>Link</label>
                                <Popup
                                    content='The link to the item you want to purchase.'
                                    trigger={<Icon style={{cursor: 'help'}} name='question circle outline' />}
                                    basic
                                />
                                <Form.Input
                                    name='link'
                                    value={props.data.link}
                                    placeholder='Link...'
                                    onChange={props.onChange}
                                    type="url"
                                    required
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form.Field required>
                                <label>Price</label>
                                <Popup
                                    content='The price of the item.'
                                    trigger={<Icon style={{cursor: 'help'}} name='question circle outline' />}
                                    basic
                                />
                                <Form.Input
                                    name='price'
                                    value={props.data.price || ''}
                                    placeholder='Price...'
                                    onChange={props.onChange}
                                    type="number"
                                    required
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Field required>
                                <label>Quantity</label>
                                <Popup
                                    content='The quantity of this item you need.'
                                    trigger={<Icon style={{cursor: 'help'}} name='question circle outline' />}
                                    basic
                                />
                                <Form.Input
                                    name='quantity'
                                    value={props.data.quantity || ''}
                                    placeholder='Quantity...'
                                    onChange={props.onChange}
                                    type="number"
                                    required
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Form.Field>
                                <label>Notes </label>
                                <Popup
                                    content='Any notes about the item such as specific colors or sizes.'
                                    trigger={<Icon style={{cursor: 'help'}} name='question circle outline' />}
                                    basic
                                />
                                <Form.TextArea
                                    name='notes'
                                    value={props.data.notes}
                                    placeholder='Notes...'
                                    onChange={props.onChange}
                                />
                            </Form.Field>
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