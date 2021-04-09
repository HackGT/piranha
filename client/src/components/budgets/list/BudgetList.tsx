import React from "react";
import { List, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";

import { BUDGET_QUERY } from "../../../queries/Budget";
import ErrorDisplay from "../../displays/ErrorDisplay";
import { Budget } from "../../../generated/types";
import BudgetListCard from "./BudgetListCard";

const { Title } = Typography;

const BudgetList: React.FC = () => {
  const { loading, data, error } = useQuery(BUDGET_QUERY);

  if (error || (data && !data.budgets)) {
    return <ErrorDisplay error={error} />;
  }

  const budgetData = loading ? [] : data.budgets;

  const grid = { gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 };

  return (
    <>
      <Helmet>
        <title>Piranha - Budgets</title>
      </Helmet>
      <Title>{loading ? "Loading..." : "Budgets"}</Title>
      <List
        grid={grid}
        dataSource={budgetData}
        renderItem={(item: Budget) => (
          <List.Item>
            <BudgetListCard item={item} loading={loading} />
          </List.Item>
        )}
      />
    </>
  );
};

export default BudgetList;
