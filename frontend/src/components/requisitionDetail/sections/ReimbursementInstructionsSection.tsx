import React from "react";
import { Typography } from "antd";
import Linkify from "react-linkify";
import { RequisitionSectionProps } from "../RequisitionDetail";

const { Title, Text } = Typography;

const ReimbursementInstructionsSection: React.FC<RequisitionSectionProps> = (props) => {
  const { data } = props;

  if (!data.isReimbursement || data.status !== "AWAITING_INFORMATION" || !data.fundingSource?.reimbursementInstructions) {
    return null;
  }

  return (
    <>
      <Title level={3} style={{ marginTop: "30px" }}>Reimbursement Instructions</Title>
      <Linkify>
        <Text>{data.fundingSource.reimbursementInstructions}</Text>
      </Linkify>
    </>
  );
};

export default ReimbursementInstructionsSection;
