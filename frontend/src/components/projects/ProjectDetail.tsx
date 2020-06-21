import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {PROJECT_DETAIL_QUERY} from "../../util/types/Project";
import {Requisition, RequisitionStatus,} from "../../util/types/Requisition";
import {formatPrice, getTotalCost, StatusToColor, StatusToStep, StatusToString} from "../../util/util";

import {Typography, Row, Col, Table, Tag, Button, Steps} from 'antd';
import moment from "moment";
import {Breakpoint} from "antd/es/_util/responsiveObserve";
import RequisitionItemsTable from "./RequisitionItemsTable";
import {Gutter} from "antd/es/grid/row";

const {Title, Text, Link} = Typography;
const {Step} = Steps;

const ProjectDetail: React.FC<{}> = (props) => {
    let [expandedRows, setExpandedRows] = useState<number[]>([]);
    let [mobileWidth, setMobileWidth] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setMobileWidth(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    let {projectReference} = useParams();
    let [year, shortCode] = (projectReference || "").split("-");

    const {loading, data, error} = useQuery(PROJECT_DETAIL_QUERY, {
        variables: {year, shortCode}
    });

    if (error || (data && !data.project)) {
        return (
            <>
                <Text type="danger">Error: Unable to display this project</Text>
                <Text>{error?.message}</Text>
            </>
        )
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: 'projectRequisitionId',
            responsive: ['md'] as Breakpoint[]
        },
        {
            title: 'Headline',
            dataIndex: 'headline',
            ellipsis: true
        },
        {
            title: 'Total Cost',
            render: (record: Requisition) => formatPrice(getTotalCost(record, true)),
            responsive: ['md'] as Breakpoint[]
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: RequisitionStatus) => (
                <Tag color={StatusToColor(status)}>{StatusToString(status)}</Tag>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'canEdit',
            render: (canEdit: boolean, record: Requisition) => canEdit ? (
                <Link href={'/requisition/' + record.referenceString}>Edit</Link>
            ) : null,
        }
    ];

    const rows: Requisition[] = data ? data.project.requisitionSet.concat().sort((first: Requisition, second: Requisition) => {
        return first.projectRequisitionId - second.projectRequisitionId
    }) : [];

    const handleRowsButton = () => {
        if (expandedRows.length === rows.length) {
            setExpandedRows([]);
        } else {
            const rowKeys = rows.map((data: Requisition) => data.projectRequisitionId)
            setExpandedRows(rowKeys);
        }
    }

    const onRowExpand = (expanded: boolean, record: Requisition) => {
        if (expanded) {
            setExpandedRows(expandedRows.concat([record.projectRequisitionId]))
        } else {
            setExpandedRows(expandedRows.filter(item => item !== record.projectRequisitionId))
        }
    }

    const expandRow = (data: Requisition) => {
        const gutter = [{xs: 8, sm: 16, md: 24, lg: 32}, {xs: 4, sm: 8, md: 12, lg: 16}] as [Gutter, Gutter];

        return (
            <div>
                <Row gutter={gutter}>
                    <Col span={21} offset={1}>
                        <Steps current={StatusToStep(data.status)} progressDot>
                            <Step title="Draft"/>
                            <Step title="Submitted"/>
                            <Step title="Ready to Order"/>
                            <Step title="Ordered"/>
                            <Step title="Received"/>
                        </Steps>
                    </Col>
                </Row>
                <Row gutter={gutter}>
                    <Col offset={1}>
                        <Text strong>{data.description}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col span={14} offset={1}>
                        <Text/>
                        <RequisitionItemsTable data={data}/>
                    </Col>
                    <Col span={9}>
                        <Typography style={{textAlign: 'center'}}>
                            <Title level={4} style={{fontSize: '15px'}}>Payment Required By</Title>
                            <Text>{moment(data.paymentRequiredBy).format('dddd, MMMM Do, YYYY')}</Text>
                            <Title level={4} style={{fontSize: '15px'}}>Created By</Title>
                            <Text>{data.createdBy.preferredName} {data.createdBy.lastName}</Text>
                            <Title level={4} style={{fontSize: '15px'}}>Vendor</Title>
                            <Text>{data.vendor.name}</Text>
                        </Typography>
                    </Col>
                </Row>
            </div>
        )
    }

    return (
        <>
            <Typography.Title>{data ? data.project.name : "Loading..."}</Typography.Title>
            <Table
                columns={columns}
                dataSource={rows}
                pagination={false}
                loading={loading}
                expandedRowKeys={expandedRows}
                rowKey={(record: Requisition) => record.projectRequisitionId}
                footer={() => (
                    <Button
                        onClick={handleRowsButton}>{expandedRows.length === rows.length ? "Collapse All" : "Expand All"}</Button>
                )}
                expandable={{
                    expandedRowRender: expandRow,
                    expandRowByClick: true,
                    onExpand: onRowExpand,
                }}
                scroll={{
                    x: true
                }}
                size={mobileWidth ? "small" : undefined}
            />
        </>
    )
}

export default ProjectDetail;