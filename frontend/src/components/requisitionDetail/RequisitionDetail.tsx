import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { Button, Card, Col, List, PageHeader, Pagination, Row, Skeleton, Steps, Tag, Typography } from "antd";
import { Requisition, REQUISITION_DETAIL_QUERY } from "../../types/Requisition";
import { parseRequisitionParams, screenWidthHook, StatusToColor, StatusToStep, StatusToString } from "../../util/util";

import RequisitionItemsTable from "./RequisitionItemsTable";

import "./index.css";
import ErrorDisplay from "../../util/ErrorDisplay";

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

  if (error || (data && !data.requisition)) {
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
          <Tag color={StatusToColor(rekData.status)}>{StatusToString(rekData.status)}</Tag>
          <Title level={2} style={{ marginBottom: "0.25em", marginTop: "0.1em" }}>{loading ? "Loading..." : rekData.headline}</Title>
          <Text strong>{rekData.description}</Text>
        </Col>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <Title level={3} style={{ fontSize: "20px" }}>Actions</Title>
          <Button type="primary" className="action-button">Approve</Button>
          <Link to={`${location.pathname.replace(/\/+$/, "")}/edit`}>
            <Button className="action-button">Edit</Button>
          </Link>
          <Button className="action-button" danger>Cancel</Button>
        </Col>
      </Row>
      <Row gutter={[16, 32]}>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <RequisitionItemsTable data={rekData} loading={loading} />
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
