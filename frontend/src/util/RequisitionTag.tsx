import React, { CSSProperties } from "react";
import { Tag } from "antd";
import { RequisitionStatus } from "../types/Requisition";
import { StatusToColor, StatusToString } from "./util";

interface Props {
  status: RequisitionStatus;
  style?: CSSProperties;
}

const RequisitionTag: React.FC<Props> = (props) => (
  <Tag color={StatusToColor(props.status)} style={props.style}>{StatusToString(props.status)}</Tag>
);

export default RequisitionTag;
