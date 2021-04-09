import React from "react";
import { List } from "antd";
import Title from "antd/lib/typography/Title";

import BudgetDetailCard from "./BudgetDetailCard";
import { Budget, Category } from "../../generated/types";

interface Props {
  budget: Budget;
}

const BudgetDetail: React.FC<Props> = props => (
  <>
    <Title style={{ textAlign: "left" }} level={2}>
      {props.budget.name} Details
    </Title>
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
      dataSource={props.budget.categories}
      renderItem={(category: Category) => (
        <List.Item>
          <BudgetDetailCard key={category.id} category={category} />
        </List.Item>
      )}
    />
  </>
);

export default BudgetDetail;
