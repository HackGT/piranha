import React from "react";
import { Card, List, Skeleton } from "antd";
import moment from "moment";
import { Approval } from "../../../types/Approval";
import { RequisitionSectionProps } from "../RequisitionDetail";

const InfoCardsSection: React.FC<RequisitionSectionProps> = (props) => {
  const { data, loading } = props;
  
  const listData = [
    {
      title: "Created By",
      body: (loading || !data.createdBy) ? "Not Set" : data.createdBy.fullName
    },
    {
      title: "Vendor",
      body: (loading || !data.vendor) ? "Not Set" : data.vendor.name
    }
  ];

  if (data.paymentRequiredBy) {
    listData.push({
      title: "Payment Required By",
      body: moment(data.paymentRequiredBy).format("dddd, MMMM Do, YYYY")
    });
  }

  if (data.approvalSet && data.approvalSet.length > 0) {
    const approval: Approval = data.approvalSet[data.approvalSet.length - 1]; // Gets last approval
    let text = "";

    const time = moment(approval.createdAt);
    // @ts-ignore
    const timeDisplay = time.diff() < 86400000 ? time.fromNow() : `on ${time.format("M/D/YY")}`; // Checks if requisition was approved less than a day ago

    if (approval.isApproving) {
      text = `Approved by ${approval.approver.fullName} ${timeDisplay}`;
    } else {
      text = `${approval.approver.fullName} requested changes ${timeDisplay}. Notes: ${approval.notes}`;
    }

    listData.push({
      title: "Approval",
      body: text
    });
  }

  if (data.orderDate) {
    let text = "";

    if (data.shippingLocation) {
      text = `Ordered on ${moment(data.orderDate).format("M/D/YY")} and shipped to ${data.shippingLocation}`;
    } else {
      text = `Ordered on ${moment(data.orderDate).format("M/D/YY")}`;
    }

    listData.push({
      title: "Order Info",
      body: text
    });
  }

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 3, md: 1, lg: 2, xl: 2, xxl: 2 }}
      dataSource={listData}
      id="detail-list"
      style={{ margin: 0 }}
      renderItem={(item: any) => (
        <List.Item>
          <Card
            title={item.title}
            size="small"
            headStyle={{ wordWrap: "break-word" }}
          >
            {loading ? <Skeleton active loading={loading} paragraph={false} /> : item.body}
          </Card>
        </List.Item>
      )}
    />
  );
};

export default InfoCardsSection;
