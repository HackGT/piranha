import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Pagination, Row, Tag, Typography } from "antd";
import { Helmet } from "react-helmet";
import { apiUrl, ErrorScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";

import { parseRequisitionParams } from "../../../util/util";
import ItemsTableSection from "./sections/ItemsTableSection";
import ManageStatusSection from "./sections/ManageStatusSection";
import { RequisitionTag } from "../../../util/CustomTags";
import ActionsSection from "./sections/ActionsSection";
import InfoCardsSection from "./sections/InfoCardsSection";
import PaymentsTableSection from "./sections/PaymentsTableSection";
import StatusStepsSection from "./sections/StatusStepsSection";
import UploadedFilesSection from "./sections/UploadedFilesSection";
import ReimbursementInstructionsSection from "./sections/ReimbursementInstructionsSection";
import ProjectBreadcrumb from "../../projects/detail/ProjectBreadcrumb";
import { Requisition } from "../../../generated/types";
import "./index.css";

const { Text, Title } = Typography;

export interface RequisitionSectionProps {
  data: any;
  loading?: boolean;
}

const RequisitionDetail: React.FC = () => {
  const { projectReference, requisitionReference } = useParams<any>();
  const navigate = useNavigate();

  const { year, shortCode, projectRequisitionId } = parseRequisitionParams(
    projectReference,
    requisitionReference
  );

  const [{ loading, data, error }, refetch] = useAxios(
    {
      url: apiUrl(Service.FINANCE, `/requisitions/${projectReference}-${requisitionReference}`),
    },
    {
      useCache: false,
    }
  );

  if (error) {
    return <ErrorScreen error={error} />;
  }

  // if (data && !data.requisition) {
  //   return <NotFoundDisplay />;
  // }

  // @ts-ignore
  const rekData: Requisition = loading ? {} : (data as Requisition);

  return (
    <>
      {/* @ts-ignore */}
      <Helmet>
        <title>{rekData.referenceString && `Piranha - ${rekData.referenceString}`}</title>
      </Helmet>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <ProjectBreadcrumb
            projectReference={projectReference}
            secondItem={loading ? shortCode : rekData.project.name}
            thirdItem={rekData.referenceString || "Loading"}
          />
          <RequisitionTag status={rekData.status} style={{ marginBottom: "5px" }} />
          {rekData.isReimbursement && <Tag>Reimbursement</Tag>}
          <Title level={2} style={{ marginBottom: "10px" }}>
            {loading ? "Loading..." : rekData.headline}
          </Title>
          <Text style={{ display: "block", whiteSpace: "pre-line" }}>{rekData.description}</Text>
        </Col>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <ActionsSection data={rekData} loading={loading} refetch={refetch} />
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
      <ManageStatusSection data={rekData} refetch={refetch} />

      <Pagination
        pageSize={1}
        defaultCurrent={projectRequisitionId}
        total={loading ? projectRequisitionId : rekData.project.requisitions.length}
        onChange={(page: number) => navigate(`/project/${projectReference}/requisition/${page}`)}
        style={{ textAlign: "center", marginTop: "25px" }}
        simple
      />
    </>
  );
};

export default RequisitionDetail;
