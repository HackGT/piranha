import React from "react";
import { Button, Popconfirm, Tooltip, Typography } from "antd";
import { useMutation } from "@apollo/client";
import { useHistory, useLocation } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

import { UPDATE_REQUISITION_MUTATION } from "../../../../queries/Requisition";
import { saveExpenseData } from "./ManageStatusSection";
import { RequisitionSectionProps } from "../RequisitionDetail";

const { Title } = Typography;

const ActionsSection: React.FC<RequisitionSectionProps> = props => {
  const { data, loading } = props;

  const location = useLocation();
  const history = useHistory();

  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION);

  if (loading || ["CLOSED", "CANCELLED"].includes(data.status)) {
    return null;
  }

  const handleEdit = () => {
    if (data.canEdit) {
      history.push(`${location.pathname.replace(/\/+$/, "")}/edit`);
    }
  };

  const handleCancel = async () => {
    const mutationData = {
      headline: data.headline,
      project: data.project.id,
      status: "CANCELLED",
    };

    await saveExpenseData(updateRequisition, { id: data.id, data: mutationData });
  };

  return (
    <>
      <Title level={3} style={{ fontSize: "20px" }}>
        Actions
      </Title>
      <Tooltip
        title={
          !data.canEdit &&
          "You must be a project lead or exec member to edit a requisition after submission."
        }
      >
        <Button className="action-button" onClick={handleEdit} disabled={!data.canEdit}>
          Edit
        </Button>
      </Tooltip>
      <Tooltip title={!data.canCancel && "You must be an exec member to cancel a requisition."}>
        <Popconfirm
          title="Are you sure you want to cancel this requisition?"
          onConfirm={handleCancel}
          okText="Yes"
          cancelText="No"
          disabled={!data.canCancel}
        >
          <Button className="action-button" danger disabled={!data.canCancel}>
            <FaShieldAlt style={{ verticalAlign: "-0.125em", marginRight: "0.25em" }} />
            Cancel
          </Button>
        </Popconfirm>
      </Tooltip>
    </>
  );
};

export default ActionsSection;
