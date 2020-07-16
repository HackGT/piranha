import React, { useEffect, useState } from "react";
import { Steps } from "antd";
import { RequisitionSectionProps } from "../RequisitionDetail";
import { screenWidthHook, StatusToStep } from "../../../util/util";

const { Step } = Steps;

const StatusStepsSection: React.FC<RequisitionSectionProps> = (props) => {
  const { data, loading } = props;

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(screenWidthHook(setScreenWidth));

  return (
    <Steps
      current={loading ? -1 : StatusToStep(data.status)}
      labelPlacement="vertical"
      size={screenWidth < 768 ? "small" : "default"}
      direction={screenWidth < 768 ? "vertical" : "horizontal"}
    >
      <Step title="Draft" />
      <Step title="Submitted" />
      <Step title="Ready to Order" />
      <Step title="Ordered" />
      <Step title="Received" />
      <Step title="Closed" />
    </Steps>
  );
};

export default StatusStepsSection;
