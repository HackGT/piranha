import React, { useState } from "react";
import { Button, List } from "antd";
import Title from "antd/lib/typography/Title";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import BudgetDetailCard from "./BudgetDetailCard";
import { Category } from "../../../generated/types";
import { BUDGET_DETAIL_QUERY } from "../../../queries/Budget";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LineItemFormModal from "../../modal/formModals/LineItemFormModal";
import CategoryFormModal from "../../modal/formModals/CategoryFormModal";

export type ModalState = {
  visible: boolean;
  initialValues: any;
};

const BudgetDetail: React.FC = () => {
  const { id } = useParams<any>();

  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null,
  } as ModalState);

  const openModal = (values: any) => {
    console.log("Values in openModal: ", values);
    setModalState({
      visible: true,
      initialValues: values,
    });
  };

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
      <Button style={{ marginRight: "10px" }} onClick={() => openModal({ budget: data.budget.id })}>
        Add +
      </Button>
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
        loading={loading}
        dataSource={budgetData.categories}
        renderItem={(category: Category) => (
          <List.Item>
            <BudgetDetailCard key={category.id} category={category} modal={LineItemFormModal} />
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => openModal({ id: category.id, budget: data.budget.id })}
            >
              Edit
            </Button>
          </List.Item>
        )}
      />
      <CategoryFormModal modalState={modalState} setModalState={setModalState} />
    </>
  );
};

export default BudgetDetail;
