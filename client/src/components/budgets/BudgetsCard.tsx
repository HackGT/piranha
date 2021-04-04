import React from "react";
import { Card, List, Skeleton, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons/lib";
import { Link } from "react-router-dom";

import { Budget, User } from "../../generated/types";

const { Title, Text } = Typography;

interface Props {
  item: Budget;
  loading: boolean;
}

const BudgetsCard: React.FC<Props> = props => (  
  <Link to={`/budget/${props.item.id}`}>
    <Card
      title={
        <Skeleton loading={props.loading} paragraph={false} active>
          <div className="card-head-wrapper">
            <Title level={4} className="card-head-title">
              {props.item.name}
            </Title>
          </div>
        </Skeleton>
      }
      loading={props.loading}
      hoverable
    />
  </Link>
);

export default BudgetsCard;
