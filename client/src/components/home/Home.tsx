import React, { useState } from "react";
import { ConfigProvider, Empty, List, Typography, Button } from "antd";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { OPEN_REQUISITIONS_QUERY } from "../../queries/Requisition";
import HomeRequisitionCard from "./HomeRequisitionCard";
import ErrorDisplay from "../../util/ErrorDisplay";
import { Requisition } from "../../generated/types";

const { Title, Text } = Typography;

const funPhrases: string[] = [
  "It's a great day to balance the books",
  "Someone said Piranha is cooler than Bolt",
  "Create a requis-WHAT?",
  "Rubber duckies.  You want to buy rubber duckies.",
  "Nice to see you",
  "\"No application is complete without some random phrases\" -Evan Strat",
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

const Home: React.FC = () => {
  const randomPhrase = useState(pickRandomElement(funPhrases));

  const { loading, data, error } = useQuery(OPEN_REQUISITIONS_QUERY);

  if (error || (data && !data.requisitions)) {
    return <ErrorDisplay error={error} />;
  }

  const emptyRek = {
    items: []
  };

  const rekData = loading ? [emptyRek, emptyRek] : data.requisitions;

  return (
    <>
      <Helmet>
        <title>Piranha - Home</title>
      </Helmet>
      <Title style={{ marginBottom: 0 }}>Home</Title>
      <Text>{randomPhrase}</Text>
      <Title style={{ textAlign: "center" }} level={3}>Your Requisitions</Title>
      <ConfigProvider
        renderEmpty={() => (
          <Empty description="No Open Requisitions">
            <Link to="/requisition">
              <Button type="primary">Create New</Button>
            </Link>
          </Empty>
        )}
      >
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
          dataSource={rekData}
          renderItem={(rek: Requisition) => (
            <List.Item>
              <Link to={loading ? "" : `/project/${rek.project.referenceString}/requisition/${rek.projectRequisitionId}`}>
                <HomeRequisitionCard loading={loading} rek={rek} />
              </Link>
            </List.Item>
          )}
        />
      </ConfigProvider>
    </>
  );
};

export default Home;
