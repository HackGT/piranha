import React from "react";
import { List } from "antd";
import Title from "antd/lib/typography/Title";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import BudgetDetailCard from "./BudgetDetailCard";
import { Category } from "../../../generated/types";
import { BUDGET_DETAIL_QUERY } from "../../../queries/Budget";
import ErrorDisplay from "../../displays/ErrorDisplay";

const BudgetDetail: React.FC = () => {
  const { id } = useParams<any>();

  const { loading, data, error } = useQuery(BUDGET_DETAIL_QUERY, {
    variables: { id },
    fetchPolicy: "network-only", // Never cache in case budget updates
  });

  if (error || (data && !data.budget)) {
    return <ErrorDisplay error={error} />;
  }

  const budgetData = loading ? {} : data.budget;

  return (
    <>
      <Title style={{ textAlign: "left" }} level={2}>
        {budgetData.name} Details
      </Title>
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
        loading={loading}
        dataSource={budgetData.categories}
        renderItem={(category: Category) => (
          <List.Item>
            <BudgetDetailCard key={category.id} category={category} />
          </List.Item>
        )}
      />
    </>
  );
};

export default BudgetDetail;
