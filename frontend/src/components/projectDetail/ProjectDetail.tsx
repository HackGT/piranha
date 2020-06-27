import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {Typography, Table, Tag, Button} from "antd";
import {Breakpoint} from "antd/es/_util/responsiveObserve";

import {PROJECT_DETAIL_QUERY} from "../../types/Project";
import {Requisition} from "../../types/Requisition";
import {formatPrice, getTotalCost, StatusToColor, StatusToString, screenWidthHook} from "../../util/util";

import './index.css';

const {Text, Title, Link} = Typography;

type RequisitionTableData = {
    key: number,
    children: {
        key: string,
        nameElement: any,
        cost: string,
        isChild: true // Dummy value to check if record is child or header
    }[]
} & Requisition;

const ProjectDetail: React.FC<{}> = (props) => {
    let [expandedRows, setExpandedRows] = useState<number[]>([]);
    let [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(screenWidthHook(setScreenWidth));

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
            responsive: ['md'] as Breakpoint[],
            render: (record: any) => "isChild" in record ?  null : record.projectRequisitionId
        },
        {
            title: 'Name',
            ellipsis: true,
            render: (record: any) => {
                if ("isChild" in record) {
                    return {
                        children: record.nameElement,
                        props: {
                            colSpan: 2
                        }
                    }
                }
                return <Link href={`/project/${projectReference}/requisition/${record.projectRequisitionId}`} strong>{record.headline}</Link>
            }
        },
        {
            title: 'Status',
            render: (record: any) => {
                if ("isChild" in record) {
                    return {
                        props: {
                            colSpan: 0
                        }
                    }
                }
                return <Tag color={StatusToColor(record.status)}>{StatusToString(record.status)}</Tag>
            }
        },
        {
            title: 'Total Cost',
            render: (record: any) => "isChild" in record ? record.cost : formatPrice(getTotalCost(record, true))
        },
        {
            title: 'Action',
            render: (record: any) => {
                if ("isChild" in record || !record.canEdit) {
                    return null;
                }
                return <Link href={`/project/${projectReference}/requisition/${record.projectRequisitionId}/edit`}>Edit</Link>
            }
        }
    ];

    const sortedData: Requisition[] = data ? data.project.requisitionSet.concat().sort((first: Requisition, second: Requisition) => {
        return first.projectRequisitionId - second.projectRequisitionId
    }) : [];

    const rows: RequisitionTableData[] = sortedData.map(requisition => {
        let row: RequisitionTableData = {
            key: requisition.projectRequisitionId,
            children: requisition.requisitionitemSet.map((item, index) => {
                return {
                    key: requisition.projectRequisitionId.toString() + '-' + index,
                    nameElement: (
                        <>
                            <Link className="table-first-element" href={item.link} target="_blank">{item.name}</Link>
                            <Text>: {item.quantity} @ {formatPrice(item.unitPrice)}</Text>
                        </>
                    ),
                    cost: formatPrice(item.quantity * item.unitPrice),
                    isChild: true
                }
            }),
            ...requisition
        };

        if (requisition.otherFees !== 0) {
            row.children.push({
                key: requisition.projectRequisitionId + '-otherFees',
                nameElement: <Text className="table-first-element">Other Fees</Text>,
                cost: formatPrice(requisition.otherFees),
                isChild: true
            })
        }

        return row;
    })

    const handleRowsButton = () => {
        if (expandedRows.length === rows.length) {
            setExpandedRows([]);
        } else {
            const rowKeys = rows.map(data => data.projectRequisitionId)
            setExpandedRows(rowKeys);
        }
    }

    const onRowExpand = (expanded: boolean, record: RequisitionTableData) => {
        if (expanded) {
            setExpandedRows(expandedRows.concat([record.projectRequisitionId]))
        } else {
            setExpandedRows(expandedRows.filter(item => item !== record.projectRequisitionId))
        }
    }

    return (
        <>
            <Title>{data ? data.project.name : "Loading..."}</Title>
            <Table
                columns={columns}
                dataSource={rows}
                pagination={false}
                loading={loading}
                footer={() => (
                    <Button
                        onClick={handleRowsButton}>{expandedRows.length === rows.length ? "Hide" : "Show"} Details</Button>
                )}
                expandedRowKeys={expandedRows}
                expandable={{
                    expandRowByClick: true,
                    onExpand: onRowExpand,
                    indentSize: 1
                }}
                scroll={{
                    x: true
                }}
                size={screenWidth < 768 ? "small" : undefined}
                id="table"
            />
        </>
    )
}

export default ProjectDetail;