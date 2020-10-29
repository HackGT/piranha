import React from "react";
import { List, Typography } from "antd";
import { RequisitionSectionProps } from "../RequisitionDetail";
import { File } from "../../../generated/types";

const { Title, Link } = Typography;

const UploadedFilesSection: React.FC<RequisitionSectionProps> = (props) => {
  const { data, loading } = props;

  if (loading || !data.files || data.files.length === 0) {
    return null;
  }

  return (
    <>
      <Title level={3} style={{ margin: "15px 0 0 0" }}>Files</Title>
      <List
        dataSource={data.files}
        style={{ marginBottom: "10px" }}
        renderItem={(item: File) => (
          <List.Item>
            <Link href={item.signedUrl} target="_blank">{item.name}</Link>
          </List.Item>
        )}
      />
    </>
  );
};

export default UploadedFilesSection;
