import React from "react";
import { List, Collapse } from "antd";
import { useQuery } from "@apollo/client";

import ErrorDisplay from "../../util/ErrorDisplay"
import BudgetCard from "./BudgetCard";
import { BUDGET_QUERY } from "../../queries/Budget"
import { Budget, Category } from "../../generated/types";

const { Panel } = Collapse;

const BudgetDetail: React.FC = () => {

  const { data, loading, error } = useQuery(BUDGET_QUERY);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const emptyBudget = [
    {
      id: 1,
      name: "loading",
      categories: [
        {
          id: 1,
          name: "-",
          lineItems: [
            {
              id: 1,
              name: "-",
              quantity: 1,
              unitCost: 1
            }
          ], 
        }
      ]
    }
  ];

  const allBudgets = loading ? emptyBudget : data.budgets;

  return (
    <>
      <List
        dataSource={allBudgets}
        renderItem={(budget: Budget) => (
          <Collapse key={budget.id}>
            <Panel key={budget.id} header={budget.name}>
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }} 
                  dataSource={budget.categories}
                  renderItem={(category: Category) => (
                  <List.Item>
                    <BudgetCard key={category.id} category={category} />
                  </List.Item>
                  )}
                />
            </Panel>
          </Collapse>
        )}
      />
    </>
  );
};

export default BudgetDetail;