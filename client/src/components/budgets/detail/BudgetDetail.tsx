import React, { useState } from "react";
import { Breadcrumb, Button, List } from "antd";
import Title from "antd/lib/typography/Title";
import { Link, useParams } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { apiUrl, ErrorScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";

import BudgetDetailCard from "./BudgetDetailCard";
import { Category } from "../../../generated/types";
import CategoryFormModal from "../../modal/formModals/CategoryFormModal";
import { ModalState } from "../../modal/FormModalProps";

const BudgetDetail: React.FC = () => {
  const budgetId = parseInt(useParams<any>().id ?? "");

  const [modalState, setModalState] = useState({
    open: false,
    initialValues: null,
  } as ModalState);

  const openModal = (values: any) => {
    setModalState({
      open: true,
      initialValues: values,
      hiddenValues: {
        budget: budgetId,
      },
    });
  };
  const [{ loading, data, error }, refetch] = useAxios(
    apiUrl(Service.FINANCE, `/budgets/${budgetId}`)
  );

  if (error) {
    return <ErrorScreen error={error} />;
  }

  const budgetData = loading ? {} : data;

  return (
    <>
      <Breadcrumb style={{ marginBottom: "8px" }}>
        <Breadcrumb.Item>
          <Link to="/budget">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/budget/${budgetId}`}>{data?.name || "Loading..."}</Link>
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
            <BudgetDetailCard
              key={category.id}
              budgetId={budgetId}
              category={category}
              refetch={refetch}
            />
            <Button style={{ marginTop: "10px" }} onClick={() => openModal(category)}>
              Edit
            </Button>
          </List.Item>
        )}
      />

      <CategoryFormModal
        modalState={modalState}
        setModalState={setModalState}
        refetch={refetch}
        budgetId={budgetId}
      />
    </>
  );
};

export default BudgetDetail;
