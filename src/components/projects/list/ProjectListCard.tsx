import React from "react";
import { Card, List, Skeleton, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons/lib";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

interface Props {
  item: any;
  loading: boolean;
}

const ProjectListCard: React.FC<Props> = props => (
  <Link to={`/project/${props.item.referenceString}`}>
    <Card
      title={
        <Skeleton loading={props.loading} paragraph={false} active>
          <div className="card-head-wrapper">
            <Title level={4} className="card-head-title">
              {props.item.name}
            </Title>
            <Title level={4} className="card-head-subtitle">
              {props.item.year}
            </Title>
          </div>
        </Skeleton>
      }
      loading={props.loading}
      hoverable
    >
      <Text strong underline>
        Leads
      </Text>
      <List
        dataSource={props.item.leads}
        renderItem={(lead: any) => (
          <List.Item>
            <Text>
              <UserOutlined style={{ marginRight: "5px" }} />
              {lead.name.first} {lead.name.last}
            </Text>
          </List.Item>
        )}
      />
    </Card>
  </Link>
);

export default ProjectListCard;
