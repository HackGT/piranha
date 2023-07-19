import React from "react";
import { List, Typography } from "antd";
import { Helmet } from "react-helmet";
import { apiUrl, ErrorScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";

import { Budget } from "../../../generated/types";
import BudgetListCard from "./BudgetListCard";

const { Title } = Typography;

const BudgetList: React.FC = () => {
  const [{ loading, data, error }] = useAxios(apiUrl(Service.FINANCE, "/budgets"));

  const budgetData = loading ? [] : data;

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <>
      {/* @ts-ignore */}
      <Helmet>
        <title>Piranha - Budgets</title>
      </Helmet>
      <Title>{loading ? "Loading..." : "Budgets"}</Title>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
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
