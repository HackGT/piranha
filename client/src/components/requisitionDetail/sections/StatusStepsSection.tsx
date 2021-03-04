import React from "react";
import { Steps } from "antd";

import { RequisitionSectionProps } from "../RequisitionDetail";
import { useScreenWidth, StatusToStep } from "../../../util/util";

const { Step } = Steps;

const StatusStepsSection: React.FC<RequisitionSectionProps> = props => {
  const { data, loading } = props;
  const screenWidth = useScreenWidth();
  let content = null;

  if (data.isReimbursement) {
    content = (
      <>
        <Step title="Draft" />
        <Step title="Submitted" />
        <Step title="Ready for Reimbursement" />
        <Step title="Awaiting Information" />
        <Step title="Reimbursement in Progress" />
        <Step title="Closed" />
      </>
    );
  } else {
    content = (
      <>
        <Step title="Draft" />
        <Step title="Submitted" />
        <Step title="Ready to Order" />
        <Step title="Ordered" />
        <Step title="Received" />
        <Step title="Closed" />
      </>
    );
  }

  return (
    <Steps
      current={loading ? -1 : StatusToStep(data.status)}
      labelPlacement="vertical"
      size={screenWidth < 768 ? "small" : "default"}
      direction={screenWidth < 768 ? "vertical" : "horizontal"}
      style={{ marginTop: "10px" }}
    >
      {content}
    </Steps>
  );
};

export default StatusStepsSection;
