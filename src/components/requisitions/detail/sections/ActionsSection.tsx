import React from "react";
import { Button, Popconfirm, Tooltip, Typography, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";
import { RefetchFunction } from "axios-hooks";

import { RequisitionSectionProps } from "../RequisitionDetail";

const { Title } = Typography;

interface Props {
  refetch: RefetchFunction<any, any>;
}

const ActionsSection: React.FC<RequisitionSectionProps & Props> = props => {
  const { data, loading } = props;

  const location = useLocation();
  const navigate = useNavigate();

  if (loading || ["CLOSED", "CANCELLED"].includes(data.status)) {
    return null;
  }

  const handleEdit = () => {
    if (data.canEdit) {
      navigate(`${location.pathname.replace(/\/+$/, "")}/edit`);
    }
  };

  const handleCancel = async () => {
    const requisitionData = {
      headline: data.headline,
      project: data.project.id,
      status: "CANCELLED",
    };

    const hide = message.loading("Saving...", 0);

    try {
      await axios.patch(apiUrl(Service.FINANCE, `/requisitions/${data.id}`), requisitionData);

      hide();
      message.success("Successful!", 2);
      props.refetch();
    } catch (err) {
      hide();
      message.error("Error cancelling requisition", 2);
      console.error(JSON.parse(JSON.stringify(err)));
    }
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
            <FaShieldAlt
              style={{ verticalAlign: "-0.125em", marginRight: "0.25em", display: "inline" }}
            />
            Cancel
          </Button>
        </Popconfirm>
      </Tooltip>
    </>
  );
};

export default ActionsSection;
