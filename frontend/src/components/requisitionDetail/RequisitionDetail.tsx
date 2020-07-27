import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Col, Pagination, Row, Tag, Typography } from "antd";
import { Requisition, REQUISITION_DETAIL_QUERY } from "../../types/Requisition";
import { parseRequisitionParams } from "../../util/util";
import ItemsTableSection from "./sections/ItemsTableSection";
import ErrorDisplay from "../../util/ErrorDisplay";
import ManageStatusSection from "./sections/ManageStatusSection";
import { RequisitionTag } from "../../util/CustomTags";
import ActionsSection from "./sections/ActionsSection";
import InfoCardsSection from "./sections/InfoCardsSection";
import PaymentsTableSection from "./sections/PaymentsTableSection";
import StatusStepsSection from "./sections/StatusStepsSection";
import UploadedFilesSection from "./sections/UploadedFilesSection";
import ReimbursementInstructionsSection from "./sections/ReimbursementInstructionsSection";
import ProjectBreadcrumb from "../projectDetail/ProjectBreadcrumb";
import "./index.css";

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
    return <ErrorDisplay error={error} />;
  }

  // @ts-ignore
  const rekData: Requisition = loading ? {} : data.requisition as Requisition;

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <ProjectBreadcrumb
            projectReference={projectReference}
            secondItem={loading ? shortCode : rekData.project.name}
            thirdItem={rekData.referenceString || "Loading"}
          />
          <RequisitionTag status={rekData.status} />
          {rekData.isReimbursement && <Tag>Reimbursement</Tag>}
          <Title level={2} style={{ marginBottom: "10px" }}>{loading ? "Loading..." : rekData.headline}</Title>
          <Text style={{ display: "block" }}>{rekData.description}</Text>
        </Col>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <ActionsSection data={rekData} loading={loading} />
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <ItemsTableSection data={rekData} loading={loading} />
          <UploadedFilesSection data={rekData} loading={loading} />
        </Col>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <InfoCardsSection data={rekData} loading={loading} />
        </Col>
      </Row>

      <StatusStepsSection data={rekData} loading={loading} />
      <ReimbursementInstructionsSection data={rekData} />
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
