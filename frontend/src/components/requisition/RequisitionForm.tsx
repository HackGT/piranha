import React, {ChangeEvent, FormEvent, SyntheticEvent} from 'react';
import {Button, Divider, Form, DropdownProps, FormProps, Grid, Icon, Popup} from 'semantic-ui-react';
import {DateInput} from 'semantic-ui-calendar-react';
import RequisitionItemSegment from "./RequisitionItemSegment";
import {InputOnChangeData} from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import {TextAreaProps} from "semantic-ui-react/dist/commonjs/addons/TextArea/TextArea";
import {RequisitionItem} from "../../util/types/RequisitionItem";

type RequisitionFormEvent =
    ChangeEvent<HTMLInputElement>
    | FormEvent<HTMLTextAreaElement>
    | SyntheticEvent<HTMLElement>;
type RequisitionFormData = InputOnChangeData | TextAreaProps | DropdownProps | any;

interface RequisitionFormProps {
    projectOptions: [{
        text: string,
        value: string
    }]
}

interface RequisitionFormState {
    name: string,
    description: string,
    project: string,
    paymentRequiredBy: string,
    vendor: string,
    items: RequisitionItem[]
}

class RequisitionForm extends React.Component<RequisitionFormProps, RequisitionFormState> {
    constructor(props: RequisitionFormProps) {
        super(props);

        this.state = {
            name: '',
            description: '',
            project: '',
            paymentRequiredBy: '',
            vendor: '',
            items: [{
                name: '',
                price: 0,
                quantity: 0,
                link: '',
                notes: ''
            }]
        }
    }

    handleChange = (event: RequisitionFormEvent, data: RequisitionFormData) => {
        // @ts-ignore
        this.setState({[data.name]: data.value});
    }

    handleItemChange = (event: RequisitionFormEvent, data: RequisitionFormData, index: number) => {
        if (index >= 0 && index < this.state.items.length) {
            let newItems = this.state.items;
            // @ts-ignore
            newItems[index][data.name] = data.value;

            this.setState({
                items: newItems
            })
        }
    }

    addItem = (event: any) => {
        event.preventDefault();

        this.setState({
            items: [
                ...this.state.items,
                {
                    name: '',
                    price: 0,
                    quantity: 0,
                    link: '',
                    notes: ''
                }
            ]
        })
    }

    deleteItem = (index: number) => {
        if (index >= 0 && index < this.state.items.length) {
            let newItems = this.state.items;
            newItems.splice(index, 1)

            this.setState({
                items: newItems
            })
        }
    }

    handleSubmit = (event: FormEvent<HTMLFormElement>, data: FormProps) => {
        console.log(event);
        console.log(data);
        console.log(this.state);
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit} autoComplete='off'>
                <Grid stackable>
                    <Grid.Row columns={2}>
                        <Grid.Column width={8}>
                            <Form.Field required>
                                <label>Name</label>
                                <Popup
                                    content='The general name of the item.'
                                    trigger={<Icon style={{cursor: 'help'}} name='question circle outline' />}
                                    basic
                                />
                                <Form.Input
                                    name='name'
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                    placeholder='Name...'
                                    required
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Field required>
                                <label>Project</label>
                                <Popup
                                    content='The project this requisition is associated with.'
                                    trigger={<Icon style={{cursor: 'help'}} name='question circle outline' />}
                                    basic
                                />
                                <Form.Dropdown
                                    name='project'
                                    value={this.state.project}
                                    onChange={this.handleChange}
                                    options={this.props.projectOptions}
                                    placeholder='Select...'
                                    selection
                                    required
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Grid.Column width={16}>
                            <Form.Field required>
                                <label>Description</label>
                                <Popup
                                    content='The description of what you want to order and why you need it.'
                                    trigger={<Icon style={{cursor: 'help'}} name='question circle outline' />}
                                    basic
                                />
                                <Form.TextArea
                                    name='description'
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    placeholder='Description...'
                                    required
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column width={8}>
                            <Form.Field required>
                                <label>Vendor</label>
                                <Popup
                                    content='The vendor you are ordering the item from.'
                                    trigger={<Icon style={{cursor: 'help'}} name='question circle outline' />}
                                    basic
                                />
                                <Form.Dropdown
                                    name='vendor'
                                    value={this.state.vendor}
                                    onChange={this.handleChange}
                                    options={[{text: 'Amazon', value: 'Amazon'}]}
                                    placeholder='Select...'
                                    required
                                    selection
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Field required>
                                <label>Payment Required By</label>
                                <Popup
                                    content='The date you need the payment by. Should be at least 3 days from today.'
                                    trigger={<Icon style={{cursor: 'help'}} name='question circle outline' />}
                                    basic
                                />
                                <DateInput
                                    name='paymentRequiredBy'
                                    value={this.state.paymentRequiredBy}
                                    onChange={this.handleChange}
                                    iconPosition='left'
                                    popupPosition='bottom left'
                                    dateFormat='M-DD-YYYY'
                                    // @ts-ignore - gets rid of flicker https://github.com/arfedulov/semantic-ui-calendar-react/issues/152
                                    animation={'none'}
                                    required
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider/>
                {
                    this.state.items.map((item: RequisitionItem, index: number) =>
                        <RequisitionItemSegment
                            key={index}
                            id={index}
                            data={item}
                            deleteItem={this.deleteItem}
                            onChange={(event: RequisitionFormEvent, data: RequisitionFormData) => this.handleItemChange(event, data, index)}
                            deleteDisabled={this.state.items.length === 1}
                        />
                    )
                }
                <Button fluid onClick={this.addItem}>Add new item</Button>
                <Divider/>
                <Form.Button
                    type='submit'
                    content='Submit'
                />
            </Form>
        )
    }
}

export default RequisitionForm;