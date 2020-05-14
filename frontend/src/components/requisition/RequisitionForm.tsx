import React, {ChangeEventHandler, EventHandler, FormEvent, SyntheticEvent} from 'react';
import {Button, Divider, Form, Header, Segment} from 'semantic-ui-react';
import {DateInput} from 'semantic-ui-calendar-react';
import RequisitionItemSegment from "./RequisitionItemSegment";

type RequisitionItem = {
    name: string,
    price: number,
    quantity: number,
    link: string,
    notes: string
}

class RequisitionForm extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            name: '',
            description: '',
            project: '',
            paymentRequiredBy: '',
            vendor: '',
            items: [{}]
        }
    }

    handleChange = (event: any, {name, value}: any) => {
        this.setState({[name]: value});
    }


    handleSubmit = (event: FormEvent) => {
        console.log(this.state);
    }

    addItem = (event: any) => {
        event.preventDefault();

        this.setState({
            items: [...this.state.items, {}]
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

    handleItemChange = (event: any, {name, value}: any, index: number) => {
        if (index >= 0 && index < this.state.items.length) {
            let newItems = this.state.items;
            newItems[index][name] = value;

            this.setState({
                items: newItems
            })
        }
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit} autoComplete='off'>
                <Form.Input
                    name='name'
                    value={this.state.name}
                    onChange={this.handleChange}
                    label='Name'
                    placeholder='Name...'
                />
                <Form.TextArea
                    name='description'
                    value={this.state.description}
                    onChange={this.handleChange}
                    label='Description'
                    placeholder='Description...'
                />
                <Form.Select
                    name='project'
                    label='Project'
                    value={this.state.project}
                    onChange={this.handleChange}
                    options={this.props.projectOptions}
                    placeholder='Select...'
                />
                <Form.Select
                    name='vendor'
                    label='Vendor'
                    value={this.state.vendor}
                    onChange={this.handleChange}
                    options={[{text: 'Amazon', value: 'Amazon'}]}
                    placeholder='Select...'
                />
                <Form.Field>
                    <label>Payment Required By</label>
                    <DateInput
                        name='paymentRequiredBy'
                        value={this.state.paymentRequiredBy}
                        onChange={this.handleChange}
                        iconPosition='left'
                        popupPosition='bottom left'
                        dateFormat='M-DD-YYYY'
                        // @ts-ignore - gets rid of flicker https://github.com/arfedulov/semantic-ui-calendar-react/issues/152
                        animation={'none'}
                    />
                </Form.Field>
                <Divider/>
                {
                    this.state.items.map((item: RequisitionItem, index: number) =>
                        <RequisitionItemSegment
                            id={index}
                            data={item}
                            deleteItem={this.deleteItem}
                            onChange={(event: any, data: any) => this.handleItemChange(event, data, index)}
                            deleteDisabled={this.state.items.length == 1}
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