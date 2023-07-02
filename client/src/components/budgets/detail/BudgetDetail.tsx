import React, { useState } from "react";
import { Breadcrumb, Button, List } from "antd";
import Title from "antd/lib/typography/Title";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { HomeOutlined } from "@ant-design/icons";

import BudgetDetailCard from "./BudgetDetailCard";
import { Category } from "../../../generated/types";
import { BUDGET_DETAIL_QUERY } from "../../../queries/Budget";
import ErrorDisplay from "../../displays/ErrorDisplay";
import CategoryFormModal from "../../modal/formModals/CategoryFormModal";
import { ModalState } from "../../modal/FormModalProps";

const BudgetDetail: React.FC = () => {
  const { id } = useParams<any>();

  const [modalState, setModalState] = useState({
    open: false,
    initialValues: null,
  } as ModalState);

  const openModal = (values: any) => {
    setModalState({
      open: true,
      initialValues: values,
      hiddenValues: {
        budget: id,
      },
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
      <Breadcrumb style={{ marginBottom: "8px" }}>
        <Breadcrumb.Item>
          <Link to="/budget">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/budget/${id}`}>{data?.budget?.name || "Loading..."}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Title style={{ textAlign: "left" }} level={2}>
        {budgetData.name}
      </Title>
      <Button style={{ marginBottom: "20px" }} onClick={() => openModal(null)}>
        Add Category +
      </Button>
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
        loading={loading}
        dataSource={budgetData.categories}
        renderItem={(category: Category) => (
          <List.Item>
            <BudgetDetailCard key={category.id} category={category} />
            <Button style={{ marginTop: "10px" }} onClick={() => openModal(category)}>
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
