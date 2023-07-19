import React, { CSSProperties } from "react";
import { Tag } from "antd";

import { StatusToColor, StatusToString } from "./util";
import { RequisitionStatus } from "../generated/types";

interface RequisitionTagProps {
  status: RequisitionStatus;
  style?: CSSProperties;
}

export const RequisitionTag: React.FC<RequisitionTagProps> = props => (
  <Tag color={StatusToColor(props.status)} style={props.style}>
    {StatusToString(props.status)}
  </Tag>
);

interface ReimbursementTagProps {
  style?: CSSProperties;
}

export const ReimbursementTag: React.FC<ReimbursementTagProps> = props => (
  <Tag style={props.style}>R</Tag>
);
