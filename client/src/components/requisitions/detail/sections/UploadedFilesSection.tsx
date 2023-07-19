import React from "react";
import { List, Typography } from "antd";
import { apiUrl, Service } from "@hex-labs/core";

import { RequisitionSectionProps } from "../RequisitionDetail";
import { File } from "../../../../generated/types";

const { Title, Link } = Typography;

const UploadedFilesSection: React.FC<RequisitionSectionProps> = props => {
  const { data, loading } = props;

  if (loading || !data.files || data.files.length === 0) {
    return null;
  }

  return (
    <>
      <Title level={3} style={{ margin: "15px 0 0 0" }}>
        Files
      </Title>
      <List
        dataSource={data.files}
        style={{ marginBottom: "10px" }}
        renderItem={(file: File) => (
          <List.Item>
            <Link href={apiUrl(Service.FILES, `/files/${file.id}/view`)} target="_blank">
              {file.name}
            </Link>
          </List.Item>
        )}
      />
    </>
  );
};

export default UploadedFilesSection;
