import React from "react";
import { useParams, Navigate } from "react-router-dom";
import moment from "moment";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";

import RequisitionForm from "./RequisitionForm";
import { RequisitionFormData } from "../../../types/types";

const RequisitionEdit: React.FC = () => {
  const { projectReference, requisitionReference } = useParams<any>();

  const [{ loading, data, error }] = useAxios(
    apiUrl(Service.FINANCE, `/requisitions/${projectReference}-${requisitionReference}`),
    {
      useCache: false,
    }
  );

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (!data.canEdit) {
    return <Navigate to={`/project/${projectReference}/requisition/${requisitionReference}`} />;
  }

  const requisitionFormData: RequisitionFormData = {
    headline: data.headline,
    project: data.project.id,
    description: data.description,
    vendor: data.items.length === 0 || !data.items[0].vendor ? null : data.items[0].vendor.id,
    budget: data.budget ? data.budget.id : null,
    paymentRequiredBy: data.paymentRequiredBy ? moment(data.paymentRequiredBy) : null,
    otherFees: data.otherFees,
    isReimbursement: data.isReimbursement,
    items:
      data.items.length === 0
        ? [{}]
        : data.items.map((item: any) => ({
            ...item,
            lineItem: item.lineItem && [item.lineItem.category.id, item.lineItem.id],
            vendor: item.vendor && item.vendor.id,
          })),
    status: data.status,
    files: data.files.map((file: any) => ({
      ...file,
      status: "done",
      key: file.id,
      uid: file.id,
    })), // https://github.com/ant-design/ant-design/issues/4120
    purchaseDate: data.purchaseDate ? moment(data.purchaseDate) : null,
  };

  return <RequisitionForm requisitionData={requisitionFormData} requisitionId={data.id} editMode />;
};

export default RequisitionEdit;
