import React from "react";
import { Card, Skeleton, Typography } from "antd";
import { Link } from "react-router-dom";

import { formatPrice, getProjectTotalCost } from "../../util/util";
import { Budget } from "../../generated/types";

const { Title, Text } = Typography;

interface Props {
  item: Budget;
  loading: boolean;
}

const BudgetListCard: React.FC<Props> = ({ item, loading }) => (
  <Link to={`/budget/${item.id}`}>
    <Card
      title={
        <Skeleton loading={loading} paragraph={false} active>
          <div className="card-head-wrapper">
            <Title level={4} className="card-head-title">
              {item.name}
            </Title>
          </div>
        </Skeleton>
      }
      loading={loading}
      hoverable
    >
      <Text>
        <strong># of Categories: </strong>
        {item.categories.length}
      </Text>
      <br />
      <Text>
        <strong># of Requisitions: </strong>
        {item.requisitions.length}
      </Text>
      <br />
      <Text>
        <strong>Total Project Cost: </strong>
        {formatPrice(getProjectTotalCost(item.requisitions))}
      </Text>
    </Card>
  </Link>
);

export default BudgetListCard;
