import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Spin } from "antd";
import moment from "moment";

import { parseRequisitionParams } from "../../../util/util";
import { REQUISITION_DETAIL_QUERY } from "../../../queries/Requisition";
import RequisitionForm from "./RequisitionForm";
import ErrorDisplay from "../../../util/ErrorDisplay";
import { RequisitionFormData } from "../../../types/types";

const RequisitionEdit: React.FC = () => {
  const { projectReference, requisitionReference } = useParams<any>();

  const { year, shortCode, projectRequisitionId } = parseRequisitionParams(
    projectReference,
    requisitionReference
  );

  const { loading, data, error } = useQuery(REQUISITION_DETAIL_QUERY, {
    variables: { year, shortCode, projectRequisitionId },
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

  const rekData = data.requisition;

  const requisitionFormData: RequisitionFormData = {
    headline: rekData.headline,
    project: rekData.project.id,
    description: rekData.description,
    vendor:
      rekData.items.length === 0 || !rekData.items[0].vendor ? null : rekData.items[0].vendor.id,
    budget: rekData.budget ? rekData.budget.id : null,
    paymentRequiredBy: rekData.paymentRequiredBy ? moment(rekData.paymentRequiredBy) : null,
    otherFees: rekData.otherFees,
    isReimbursement: rekData.isReimbursement,
    items:
      rekData.items.length === 0
        ? [{}]
        : rekData.items.map((item: any) => ({
            ...item,
            lineItem: item.lineItem && [item.lineItem.category.id, item.lineItem.id],
            vendor: item.vendor && item.vendor.id,
          })),
    status: rekData.status,
    files: rekData.files.map((file: any) => ({
      ...file,
      status: "done",
      key: file.id,
      uid: file.id,
    })), // https://github.com/ant-design/ant-design/issues/4120
    purchaseDate: rekData.purchaseDate ? moment(rekData.purchaseDate) : null,
  };

  return (
    <RequisitionForm requisitionData={requisitionFormData} requisitionId={rekData.id} editMode />
  );
};

export default RequisitionEdit;
