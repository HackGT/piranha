import React from "react";
import { Typography, List } from "antd";
import { useQuery } from "@apollo/client";

import BudgetCard from "./BudgetCard";
import { BUDGET_QUERY } from "../../queries/Budget"

const { Title } = Typography;

const Budgets: React.FC = () => {

  const { data } = useQuery(BUDGET_QUERY);
  console.log(data);

  
  const budgetCardCategories = data.budgets.categories;

  return (
    <>
      <Title style={{ textAlign: "left" }} level={2}>
        Your Budgets
      </Title>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }} 
        dataSource={budgetCardCategories}
        renderItem={category => (
          <List.Item>
            <BudgetCard key={category.id} category={category} />
          </List.Item>
        )}
      />
    </>
  );
};

export default Budgets;
