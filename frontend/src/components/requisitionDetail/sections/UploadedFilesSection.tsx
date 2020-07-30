import React from "react";
import { List, Typography } from "antd";
import { RequisitionSectionProps } from "../RequisitionDetail";
import { File } from "../../../types/File";

const { Title, Link } = Typography;

const UploadedFilesSection: React.FC<RequisitionSectionProps> = (props) => {
  const { data, loading } = props;
  const BASE_URL = "/content/";

  if (loading) {
    return null;
  }

  return (
    <>
      <Title level={3} style={{ margin: "15px 0 0 0" }}>Files</Title>
      <List
        dataSource={data.fileSet}
        style={{ marginBottom: "10px" }}
        renderItem={(item: File) => (
          <List.Item>
            <Link href={BASE_URL + item.googleName} target="_blank">{item.name}</Link>
          </List.Item>
        )}
      />
    </>
  );
};

export default UploadedFilesSection;
