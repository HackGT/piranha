import {Requisition, RequisitionStatus} from "./types/Requisition";
import {PresetColorType} from "antd/es/_util/colors";
import React from "react";

export const StatusToColor = (status: RequisitionStatus): PresetColorType => {
    switch (status) {
        case "DRAFT": return "magenta"
        case "SUBMITTED": return "gold"
        case "PENDING_CHANGES": return "orange"
        case "READY_TO_ORDER": return "green"
        case "ORDERED": return "blue"
        case "RECEIVED": return "blue"
        case "CANCELLED": return "red"
    }
}

export const StatusToString = (status: RequisitionStatus) => {
    switch (status) {
        case "DRAFT": return "Draft"
        case "SUBMITTED": return "Submitted"
        case "PENDING_CHANGES": return "Pending Changes"
        case "READY_TO_ORDER": return "Ready to Order"
        case "ORDERED": return "Ordered"
        case "RECEIVED": return "Received"
        case "CANCELLED": return "Cancelled"
        default: return "Unknown"
    }
}

export const StatusToStep = (status: RequisitionStatus) => {
    switch (status) {
        case "DRAFT": return 0
        case "SUBMITTED": return 1
        case "PENDING_CHANGES": return 1
        case "READY_TO_ORDER": return 2
        case "ORDERED": return 3
        case "RECEIVED": return 4
        case "CANCELLED": return 1
    }
}

export const formatPrice = (num: number) => {
    return '$' + num.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

export const getTotalCost = (requisition: Requisition, includeOtherFees: boolean) => {
    let total = requisition.requisitionitemSet.map(item => item.quantity * item.unitPrice).reduce((prev, curr) => prev + curr, 0);

    return includeOtherFees ? total + requisition.otherFees : total;
}

export const screenWidthHook = (setScreenWidth: React.Dispatch<React.SetStateAction<number>>) => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}