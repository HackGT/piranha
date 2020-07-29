import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Spin } from "antd";
import moment from "moment";
import { parseRequisitionParams } from "../../util/util";
import { REQUISITION_DETAIL_QUERY, RequisitionFormData } from "../../types/Requisition";
import RequisitionForm from "./RequisitionForm";
import ErrorDisplay from "../../util/ErrorDisplay";

const RequisitionEdit: React.FC = () => {
  const { projectReference, requisitionReference } = useParams();

  const { year, shortCode, projectRequisitionId } = parseRequisitionParams(projectReference, requisitionReference);

  const { loading, data, error } = useQuery(REQUISITION_DETAIL_QUERY, {
    variables: { year, shortCode, projectRequisitionId }
  });

  if (error || (data && !data.requisition)) {
    return <ErrorDisplay error={error} />;
  }
  
  if (loading) {
    return <Spin style={{ position: "absolute", top: "48%", left: "48%" }} />;
  }

  if (!data.requisition.canEdit) {
    return <Redirect to={`/project/${projectReference}/requisition/${requisitionReference}`} />;
  }

  const requisitionData: RequisitionFormData = {
    headline: data.requisition.headline,
    project: data.requisition.project.id,
    description: data.requisition.description,
    vendor: data.requisition.vendor ? data.requisition.vendor.id : null,
    paymentRequiredBy: data.requisition.paymentRequiredBy ? moment(data.requisition.paymentRequiredBy) : null,
    otherFees: data.requisition.otherFees,
    requisitionitemSet: data.requisition.requisitionitemSet.length === 0 ? [{}] : data.requisition.requisitionitemSet,
    status: data.requisition.status,
    fileSet: data.requisition.fileSet.map((file: any) => ({ ...file, status: "done", key: file.id, uid: file.id })) // https://github.com/ant-design/ant-design/issues/4120
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
