import React, {ChangeEvent, FormEvent, SyntheticEvent} from 'react';
import {Button, Divider, Form, DropdownProps, FormProps} from 'semantic-ui-react';
import {DateInput} from 'semantic-ui-calendar-react';
import RequisitionItemSegment from "./RequisitionItemSegment";
import {InputOnChangeData} from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import {TextAreaProps} from "semantic-ui-react/dist/commonjs/addons/TextArea/TextArea";
import {RequisitionItem} from "../../util/types/RequisitionItem";

type RequisitionFormEvent = ChangeEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement> | SyntheticEvent<HTMLElement>;
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
    items: [RequisitionItem]
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
            // @ts-ignore
            items: [{}]
        }
    }

    handleChange = (event: RequisitionFormEvent, data: RequisitionFormData) => {
        // @ts-ignore
        this.setState({ [data.name]: data.value });
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

        // @ts-ignore
        this.setState({ items: [...this.state.items, {}] })
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
        console.log(this.state);
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
                <Form.Dropdown
                    name='project'
                    label='Project'
                    value={this.state.project}
                    onChange={this.handleChange}
                    options={this.props.projectOptions}
                    placeholder='Select...'
                    selection
                />
                <Form.Dropdown
                    name='vendor'
                    label='Vendor'
                    value={this.state.vendor}
                    onChange={this.handleChange}
                    options={[{text: 'Amazon', value: 'Amazon'}]}
                    placeholder='Select...'
                    selection
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