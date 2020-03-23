import React, {useState} from 'react';
import {Grid, Header, Label, Table} from "semantic-ui-react";
import {useQuery} from "@apollo/client";
import {FISCAL_YEARS_QUERY} from "../util/types/FiscalYear";

const funPhrases: string[] = [
    "It's a great day to balance the books",
    "Someone said Piranha is cooler than Bolt",
    "Create a requis-WHAT?",
    "Rubber duckies.  You want to buy rubber duckies.",
    "Nice to see you",
    '"No application is complete without some random phrases" -Evan Strat',
    "It's a wonderful day to use Piranha",
    "Millions of coins look up to you",
    "Would you kindly submit a requisition for 1 premium Piranha license?",
    "Can I expense that?",
    "A developer somewhere spent multiple minutes adding these random phrases",
    "🎶 I'm just a poor REK, I need no sympathy... 🎵"
];

export function pickRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function Home(props: any) {
    const {loading, error, data} = useQuery(FISCAL_YEARS_QUERY);

    const randomPhrase = useState(pickRandomElement(funPhrases));
    return (
        <Grid stackable columns={2} style={{paddingLeft: 10, paddingRight: 10}}>
            <Grid.Row>
                <Grid.Column width={12}>
                    <Header size={"huge"} content="Home" subheader={randomPhrase}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Header textAlign={"center"} size="huge">My Open Requisitions</Header>
                    <Table basic={"very"}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Requisition</Table.HeaderCell>
                                <Table.HeaderCell>Headline</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>2020-HOR-01</Table.Cell>
                                <Table.Cell>Photobooth phones</Table.Cell>
                                <Table.Cell><Label>Draft</Label></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>2020-HOR-03</Table.Cell>
                                <Table.Cell>Lunch - Moe's</Table.Cell>
                                <Table.Cell><Label color={"red"}>Pending Changes</Label></Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>2020-HOR-05</Table.Cell>
                                <Table.Cell>Horizons badges</Table.Cell>
                                <Table.Cell><Label color={"green"}>Ready to Order</Label></Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <Header size="huge" textAlign={"center"}>My Expenses</Header>
                </Grid.Column>
                <Grid.Column>
                    <Header size="huge" textAlign={"center"}>Fiscal Years</Header>
                    {loading ? "Loading" : ""}
                    {error ? "Error" : ""}
                    {data && data.fiscalYears ? data.fiscalYears.map((fy: any) => <p>{fy.friendlyName}</p>) : ""}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default Home;