import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Typography, Table, Tag, Button, Switch } from "antd";
import { Breakpoint } from "antd/es/_util/responsiveObserve";
import { Helmet } from "react-helmet";
import { PROJECT_DETAIL_QUERY } from "../../queries/Project";
import { formatPrice, getTotalCost, StatusToColor, StatusToString, screenWidthHook, getProjectTotalCost } from "../../util/util";

import "./index.css";
import ErrorDisplay from "../../util/ErrorDisplay";
import { ReimbursementTag } from "../../util/CustomTags";
import ProjectBreadcrumb from "./ProjectBreadcrumb";
import NotFound from "../NotFound";
import { Requisition } from "../../generated/types";

const { Text, Title } = Typography;

type RequisitionTableData = {
  key: number,
  children: {
    key: string,
    nameElement: any,
    cost: string,
    isChild: true // Dummy value to check if record is child or header
  }[]
} & Requisition;

const ProjectDetail: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [hideCancelledReks, setHideCancelledReks] = useState(true);

  useEffect(screenWidthHook(setScreenWidth));

  const { projectReference } = useParams<any>();
  let [year, shortCode] = (projectReference || "").split("-");

  year = parseInt(year) || 0;

  const { loading, data, error } = useQuery(PROJECT_DETAIL_QUERY, {
    variables: { year, shortCode },
    fetchPolicy: "network-only" // Never cache in case requisition status updates
  });

  if (error) {
    return <ErrorDisplay error={error} />;
  } if (data && !data.project) {
    return <NotFound />;
  }

  const columns = [
    {
      title: "Reference Code",
      render: (record: any) => ("isChild" in record ? null : record.referenceString),
      sorter: (a: any, b: any) => a.projectRequisitionId - b.projectRequisitionId,
      defaultSortOrder: "ascend" as "ascend" | "descend" | null,
      sortDirections: ["ascend", "descend", "ascend"] as ("ascend" | "descend" | null)[]
    },
    {
      title: "Status",
      render: (record: any) => {
        if ("isChild" in record) {
          return {
            props: {
              colSpan: 0
            }
          };
        }
        return <Tag color={StatusToColor(record.status)} style={{ margin: 0 }}>{StatusToString(record.status)}</Tag>;
      }
    },
    {
      title: "Name",
      render: (record: any) => {
        if ("isChild" in record) {
          return {
            children: record.nameElement,
            props: {
              colSpan: 2
            }
          };
        }
        return (
          <>
            {record.isReimbursement && <ReimbursementTag />}
            <Link to={`/project/${projectReference}/requisition/${record.projectRequisitionId}`} style={{ fontWeight: "bold" }}>
              {record.headline}
            </Link>
          </>
        );
      }
    },
    {
      title: "Created By",
      render: (record: any) => ("isChild" in record ? null : record.createdBy.name)
    },
    {
      title: "Total Cost",
      responsive: ["md"] as Breakpoint[],
      render: (record: any) => ("isChild" in record ? record.cost : formatPrice(getTotalCost(record, true)))
    }
  ];

  let sortedData: Requisition[] = [];

  if (data) {
    sortedData = data.project.requisitions.concat();
    sortedData = sortedData.sort((first, second) => first.projectRequisitionId - second.projectRequisitionId);
    sortedData = sortedData.filter(rek => hideCancelledReks ? rek.status !== "CANCELLED" : true);
  }

  const rows: RequisitionTableData[] = sortedData.map((requisition) => {
    const row: RequisitionTableData = {
      key: requisition.projectRequisitionId,
      children: requisition.items.map((item, index) => ({
        key: `${requisition.projectRequisitionId.toString()}-${index}`,
        nameElement: (
          <>
            {
              item.link
                ? <Typography.Link className="table-first-element" href={item.link} target="_blank">{item.name || `Item ${index + 1}`}</Typography.Link>
                : <Text className="table-first-element">{item.name || `Item ${index + 1}`}</Text>
            }
            <Text>
              {(item.quantity && item.unitPrice) && `: ${item.quantity} @ ${formatPrice(item.unitPrice)}`}
            </Text>
          </>
        ),
        cost: formatPrice((item.quantity || 0) * (item.unitPrice || 0)),
        isChild: true
      })),
      ...requisition
    };

    if (requisition.otherFees) {
      row.children.push({
        key: `${requisition.projectRequisitionId}-otherFees`,
        nameElement: <Text className="table-first-element">Other Fees</Text>,
        cost: formatPrice(requisition.otherFees),
        isChild: true
      });
    }

    return row;
  });

  const handleRowsButton = () => {
    if (expandedRows.length === rows.length) {
      setExpandedRows([]);
    } else {
      const rowKeys = rows.map(row => row.projectRequisitionId);
      setExpandedRows(rowKeys);
    }
  };

  const onRowExpand = (expanded: boolean, record: RequisitionTableData) => {
    if (expanded) {
      setExpandedRows(expandedRows.concat([record.projectRequisitionId]));
    } else {
      setExpandedRows(expandedRows.filter(item => item !== record.projectRequisitionId));
    }
  };

  return (
    <>
      <Helmet>
        <title>{data && `Piranha - ${data.project.name}`}</title>
      </Helmet>
      <ProjectBreadcrumb secondItem={loading ? shortCode : data.project.name} />
      <Title level={2}>{data ? data.project.name : "Loading..."}</Title>
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        loading={loading}
        footer={() => (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <Button onClick={handleRowsButton}>
                {expandedRows.length === rows.length ? "Close All" : "Expand All"}
              </Button>
            </div>
            <div>
              <ReimbursementTag style={{ lineHeight: "20px" }} />
              <p style={{ display: "inline" }}> = Reimbursement</p>
            </div>
          </div>
        )}
        expandedRowKeys={expandedRows}
        expandable={{
          expandRowByClick: true,
          onExpand: onRowExpand,
          indentSize: 1
        }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={1}>
              <Text style={{ fontWeight: "bold" }}>Total Cost</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} colSpan={3} />
            <Table.Summary.Cell index={1}>
              <Text>{formatPrice(getProjectTotalCost(sortedData))}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
        scroll={{ x: true }}
        bordered={screenWidth < 525}
        size={screenWidth < 768 ? "small" : undefined}
        id="table"
      />
      <Text style={{ display: "block", margin: "10px 0" }}>Hide Cancelled Requisitions</Text>
      <Switch checked={hideCancelledReks} onClick={() => setHideCancelledReks(hideCancelledReks => !hideCancelledReks)} checkedChildren="Yes" unCheckedChildren="No" />
    </>
  );
};

export default ProjectDetail;
