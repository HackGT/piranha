import React, { useEffect, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { Button, Card, Col, List, PageHeader, Pagination, Popconfirm, Row, Skeleton, Steps, Tooltip, Typography } from "antd";
import { Requisition, REQUISITION_DETAIL_QUERY, UPDATE_REQUISITION_MUTATION } from "../../types/Requisition";
import { formatPrice, parseRequisitionParams, screenWidthHook, StatusToStep } from "../../util/util";
import RequisitionItemsTable from "./RequisitionItemsTable";
import "./index.css";
import ErrorDisplay from "../../util/ErrorDisplay";
import RequisitionExpenseSection, { saveExpenseData } from "./RequisitionExpenseSection";
import RequisitionTag from "../../util/RequisitionTag";
import { Approval } from "../../types/Approval";
import { Payment } from "../../types/Payment";

const { Text, Title } = Typography;
const { Step } = Steps;

const RequisitionDetail: React.FC<{}> = (props) => {
  const { projectReference, requisitionReference } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(screenWidthHook(setScreenWidth));

  const { year, shortCode, projectRequisitionId } = parseRequisitionParams(projectReference, requisitionReference);

  const { loading, data, error } = useQuery(REQUISITION_DETAIL_QUERY, {
    variables: { year, shortCode, projectRequisitionId }
  });
  const [updateRequisition] = useMutation(UPDATE_REQUISITION_MUTATION); // Used to cancel requisition

  if (error || (data && !data.requisition)) {
    console.error(JSON.parse(JSON.stringify(error)));
    return <ErrorDisplay message={error?.message} />;
  }

  // @ts-ignore
  const rekData: Requisition = loading ? {} : data.requisition as Requisition;

  const listData = [
    {
      title: "Payment Required By",
      body: (loading || !rekData.paymentRequiredBy) ? "Not Set" : moment(rekData.paymentRequiredBy).format("dddd, MMMM Do, YYYY")
    },
    {
      title: "Created By",
      body: loading ? "" : `${rekData.createdBy.preferredName} ${rekData.createdBy.lastName}`
    },
    {
      title: "Vendor",
      body: (loading || !rekData.vendor) ? "Not Set" : rekData.vendor.name
    }
  ];
  
  if (rekData.approvalSet && rekData.approvalSet.length > 0) {
    const approval: Approval = rekData.approvalSet[rekData.approvalSet.length - 1]; // Gets last approval
    let text = "";

    if (approval.isApproving) {
      text = `Approved by ${approval.approver.preferredName} ${approval.approver.lastName} on ${moment(approval.createdAt).format("M/D/YY")}`;
    } else {
      text = `Not approved by ${approval.approver.preferredName} ${approval.approver.lastName} on ${moment(approval.createdAt).format("M/D/YY")} Notes: ${approval.notes}`;
    }

    listData.push({
      title: "Approval",
      body: text
    });
  }

  if (rekData.paymentSet && rekData.paymentSet.length > 0) {
    const payment: Payment = rekData.paymentSet[rekData.paymentSet.length - 1]; // Gets last payment

    listData.push({
      title: "Payment",
      body: `Paid ${formatPrice(payment.amount)} from ${payment.fundingSource.name} on ${moment(payment.date).format("M/D/YY")}`
    });

    if (payment.shippingLocation) {
      listData.push({
        title: "Order Info",
        body: `Shipped to ${payment.shippingLocation}`
      });
    }
  }

  const handleEdit = () => {
    if (rekData.canEdit) {
      history.push(`${location.pathname.replace(/\/+$/, "")}/edit`);
    }
  };

  const handleCancel = async () => {
    const mutationData = {
      headline: rekData.headline,
      project: rekData.project.id,
      status: "CANCELLED"
    };

    await saveExpenseData(updateRequisition, { id: rekData.id, data: mutationData });
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <PageHeader
            onBack={() => history.push(`/project/${projectReference}`)}
            title=""
            subTitle={loading ? shortCode : `${rekData.project.name} Requisitions`}
            style={{ padding: 0, marginBottom: "10px" }}
          />
          <RequisitionTag status={rekData.status} />
          <Title level={2} style={{ marginBottom: "0.25em", marginTop: "0.1em" }}>{loading ? "Loading..." : rekData.headline}</Title>
          <Text strong>{rekData.description}</Text>
        </Col>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <Title level={3} style={{ fontSize: "20px" }}>Actions</Title>
          <Tooltip title={!rekData.canEdit && "You must be a project lead or exec member to edit a requisition after submission."}>
            <Button className="action-button" onClick={handleEdit} disabled={!rekData.canEdit}>Edit</Button>
          </Tooltip>
          <Tooltip title={!rekData.canCancel && "You must be an exec member to cancel a requisition."}>
            <Popconfirm
              title="Are you sure you want to cancel this requisition?"
              onConfirm={handleCancel}
              okText="Yes"
              cancelText="No"
              disabled={!rekData.canCancel}
            >
              <Button className="action-button" danger disabled={!rekData.canCancel}>Cancel</Button>
            </Popconfirm>
          </Tooltip>
        </Col>
      </Row>
      <Row gutter={[16, 32]}>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <RequisitionItemsTable data={rekData} loading={loading} />
          {rekData.status === "PARTLY_RECEIVED" && <em>* Items in green have been received</em>}
        </Col>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
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
        </Col>
      </Row>
      <Steps
        current={loading ? -1 : StatusToStep(rekData.status)}
        labelPlacement="vertical"
        size={screenWidth < 768 ? "small" : "default"}
        direction={screenWidth < 650 ? "vertical" : "horizontal"}
      >
        <Step title="Draft" />
        <Step title="Submitted" />
        <Step title="Ready to Order" />
        <Step title="Ordered" />
        <Step title="Received" />
      </Steps>
      <RequisitionExpenseSection requisition={rekData} />
      <Pagination
        pageSize={1}
        defaultCurrent={projectRequisitionId}
        total={loading ? projectRequisitionId : rekData.project.requisitionSet.length}
        onChange={(page: number) => history.push(`/project/${projectReference}/requisition/${page}`)}
        style={{ textAlign: "center", marginTop: "25px" }}
        simple
      />
    </>
  );
};

export default RequisitionDetail;
