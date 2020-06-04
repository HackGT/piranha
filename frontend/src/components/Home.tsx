import React, {useState} from 'react';
import {Grid, Header} from "semantic-ui-react";
import ProjectsList from "./projects/ProjectsList";
import RequisitionTableHome from "./requisition/RequisitionTableHome";

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
    const randomPhrase = useState(pickRandomElement(funPhrases));

    return (
        <Grid stackable>
            <Grid.Row>
                <Grid.Column>
                    <Header size="huge" content="Home" subheader={randomPhrase}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Header textAlign="center" size="large">My Open Requisitions</Header>
                    <RequisitionTableHome/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Header textAlign="center" size="large">Projects</Header>
                    <ProjectsList/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default Home;