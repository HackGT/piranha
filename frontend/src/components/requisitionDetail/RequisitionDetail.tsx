import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Col, PageHeader, Pagination, Row, Typography } from "antd";
import { Requisition, REQUISITION_DETAIL_QUERY } from "../../types/Requisition";
import { parseRequisitionParams } from "../../util/util";
import ItemsTableSection from "./sections/ItemsTableSection";
import ErrorDisplay from "../../util/ErrorDisplay";
import ManageStatusSection from "./sections/ManageStatusSection";
import RequisitionTag from "../../util/RequisitionTag";
import ActionsSection from "./sections/ActionsSection";
import InfoCardsSection from "./sections/InfoCardsSection";
import PaymentsTableSection from "./sections/PaymentsTableSection";
import "./index.css";
import StatusStepsSection from "./sections/StatusStepsSection";

const { Text, Title } = Typography;

export interface RequisitionSectionProps {
  data: Requisition;
  loading?: boolean;
}

const RequisitionDetail: React.FC = () => {
  const { projectReference, requisitionReference } = useParams();
  const history = useHistory();

  const { year, shortCode, projectRequisitionId } = parseRequisitionParams(projectReference, requisitionReference);

  const { loading, data, error } = useQuery(REQUISITION_DETAIL_QUERY, {
    variables: { year, shortCode, projectRequisitionId }
  });

  if (error || (data && !data.requisition)) {
    console.error(JSON.parse(JSON.stringify(error)));
    return <ErrorDisplay message={error?.message} />;
  }

  // @ts-ignore
  const rekData: Requisition = loading ? {} : data.requisition as Requisition;

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <PageHeader
            onBack={() => history.push(`/project/${projectReference}`)}
            title=""
            subTitle={loading ? shortCode : `${rekData.project.name} Requisitions`}
            style={{ padding: 0, marginBottom: "10px" }}
          />
          <RequisitionTag status={rekData.status} />
          <Title level={2} style={{ marginBottom: "0.25em", marginTop: "0.1em" }}>{loading ? "Loading..." : rekData.headline}</Title>
          <Text strong>{rekData.description}</Text>
        </Col>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <ActionsSection data={rekData} />
        </Col>
      </Row>

      <Row gutter={[16, 32]}>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <ItemsTableSection data={rekData} loading={loading} />
        </Col>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <InfoCardsSection data={rekData} loading={loading} />
        </Col>
      </Row>

      <StatusStepsSection data={rekData} loading={loading} />
      <PaymentsTableSection data={rekData} />
      <ManageStatusSection data={rekData} />

      <Pagination
        pageSize={1}
        defaultCurrent={projectRequisitionId}
        total={loading ? projectRequisitionId : rekData.project.requisitionSet.length}
        onChange={(page: number) => history.push(`/project/${projectReference}/requisition/${page}`)}
        style={{ textAlign: "center", marginTop: "25px" }}
        simple
      />
    </>
  );
};

export default RequisitionDetail;
