import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Spin, Typography } from "antd";
import moment from "moment";
import { parseRequisitionParams } from "../../util/util";
import { REQUISITION_DETAIL_QUERY, RequisitionFormData } from "../../types/Requisition";
import RequisitionForm from "./RequisitionForm";

const { Text } = Typography;

const RequisitionEdit: React.FC = () => {
  const { projectReference, requisitionReference } = useParams();

  const { year, shortCode, projectRequisitionId } = parseRequisitionParams(projectReference, requisitionReference);

  const { loading, data, error } = useQuery(REQUISITION_DETAIL_QUERY, {
    variables: { year, shortCode, projectRequisitionId }
  });

  if (error || (data && !data.requisition)) {
    return (
      <>
        <Text type="danger">Error: Unable to edit this requisition.</Text>
        <Text>{error?.message}</Text>
      </>
    );
  }
  
  if (loading) {
    return <Spin style={{ position: "absolute", top: "48%", left: "48%" }} />;
  }

  const requisitionData: RequisitionFormData = {
    description: data.requisition.description,
    headline: data.requisition.headline,
    items: data.requisition.requisitionitemSet.length === 0 ? [{}] : data.requisition.requisitionitemSet,
    otherFees: data.requisition.otherFees,
    paymentRequiredBy: data.requisition.paymentRequiredBy ? moment(data.requisition.paymentRequiredBy) : undefined,
    project: data.requisition.project.id,
    status: data.requisition.status,
    vendor: data.requisition.vendor ? data.requisition.vendor.id : undefined
  };

  return (
    <RequisitionForm
      requisitionData={requisitionData}
      requisitionId={data.requisition.id}
      editMode
    />
  );
};

export default RequisitionEdit;
