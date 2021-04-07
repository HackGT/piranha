import React from "react";
import { Card, Skeleton, Typography } from "antd";
import { Link } from "react-router-dom";

import { getProjectTotalCost } from '../../util/util';
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
    >      
      <Text>{props.item.categories.length} Categories</Text>
      <br />
      <Text>{props.item.requisitions.length} Requisitions</Text>    
      <br />  
      <Text>
        <strong>Total Project Cost: </strong>
        {getProjectTotalCost(props.item.requisitions)}
      </Text>
    </Card>
  </Link>
);

export default BudgetsCard;
