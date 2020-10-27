import React from "react";
import { Card, Skeleton, Tag, Typography } from "antd";
import { Requisition } from "../../types/Requisition";
import { formatPrice, getTotalCost, StatusToColor, StatusToString } from "../../util/util";

const { Text } = Typography;

interface Props {
  loading: boolean;
  rek: Requisition;
}

const HomeRequisitionCard: React.FC<Props> = (props) => (
  <Card
    title={(
      <Skeleton loading={props.loading} paragraph={false} active>
        <div className="card-head-wrapper">
          <Text className="card-head-title" style={{ color: "black" }} strong>
            {props.rek.headline}
          </Text>
          <Tag className="card-head-tag" color={StatusToColor(props.rek.status)}>
            {StatusToString(props.rek.status)}
          </Tag>
        </div>
      </Skeleton>
    )}
    loading={props.loading}
    hoverable
  >
    <Text>{props.rek.description}</Text>
    <br />
    <br />
    <Text>
      <strong>Overall Cost: </strong>
      {formatPrice(getTotalCost(props.rek, true))}
    </Text>
    <br />
    <Text>
      <strong># of Items: </strong>
      {props.rek.items.length}
    </Text>
  </Card>
);

export default HomeRequisitionCard;
