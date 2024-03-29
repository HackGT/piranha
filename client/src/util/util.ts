import { PresetColorType } from "antd/es/_util/colors";
import React, { useEffect, useState } from "react";
import { Rule, RuleObject } from "antd/es/form";
import { StoreValue } from "@apollo/client";

import { Requisition, RequisitionStatus } from "../generated/types";
import { RequisitionFormData } from "../types/types";

export const StatusToColor = (status: RequisitionStatus): PresetColorType | undefined => {
  switch (status) {
    case "DRAFT":
      return "magenta";
    case "SUBMITTED":
      return "gold";
    case "PENDING_CHANGES":
      return "orange";
    case "READY_TO_ORDER":
      return "green";
    case "ORDERED":
      return "blue";
    case "PARTIALLY_RECEIVED":
      return "purple";
    case "RECEIVED":
      return "purple";
    case "CLOSED":
      return undefined;
    case "CANCELLED":
      return "red";
    case "READY_FOR_REIMBURSEMENT":
      return "green";
    case "AWAITING_INFORMATION":
      return "orange";
    case "REIMBURSEMENT_IN_PROGRESS":
      return "blue";
    default:
      return undefined;
  }
};

export const StatusToString = (status: RequisitionStatus) => {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "SUBMITTED":
      return "Submitted";
    case "PENDING_CHANGES":
      return "Pending Changes";
    case "READY_TO_ORDER":
      return "Ready to Order";
    case "ORDERED":
      return "Ordered";
    case "PARTIALLY_RECEIVED":
      return "Partially Received";
    case "RECEIVED":
      return "Received";
    case "CLOSED":
      return "Closed";
    case "CANCELLED":
      return "Cancelled";
    case "READY_FOR_REIMBURSEMENT":
      return "Ready for Reimbursement";
    case "AWAITING_INFORMATION":
      return "Awaiting Information";
    case "REIMBURSEMENT_IN_PROGRESS":
      return "Reimbursement in Progress";
    default:
      return "Unknown";
  }
};

export const StatusToStep = (status: RequisitionStatus) => {
  switch (status) {
    case "DRAFT":
      return 0;
    case "SUBMITTED":
      return 1;
    case "PENDING_CHANGES":
      return 0;
    case "READY_TO_ORDER":
      return 2;
    case "ORDERED":
      return 3;
    case "PARTIALLY_RECEIVED":
      return 3;
    case "RECEIVED":
      return 4;
    case "CLOSED":
      return 5;
    case "CANCELLED":
      return -1;
    case "READY_FOR_REIMBURSEMENT":
      return 2;
    case "AWAITING_INFORMATION":
      return 3;
    case "REIMBURSEMENT_IN_PROGRESS":
      return 4;
    default:
      return 0;
  }
};

export const formatPrice = (num: number | undefined | null, noDollarSign = false) => {
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: noDollarSign ? undefined : "currency",
    currency: noDollarSign ? undefined : "USD",
  };

  return (num || 0).toLocaleString("en-US", options);
};

export const getTotalCost = (
  requisition: Requisition | RequisitionFormData | undefined,
  includeOtherFees: boolean
) => {
  if (requisition) {
    let itemTotal = 0;

    if (requisition.items) {
      itemTotal = requisition.items.reduce((prev, curr) => {
        if (curr.quantity && curr.unitPrice) {
          return prev + curr.quantity * curr.unitPrice;
        }
        return prev;
      }, 0);
    }

    // @ts-ignore
    return includeOtherFees ? itemTotal + parseFloat(requisition.otherFees || 0) : itemTotal;
  }

  return 0;
};

export const getProjectTotalCost = (requisitions: Requisition[] | undefined) => {
  if (!requisitions || requisitions.length === 0) {
    return 0;
  }

  let total = 0;

  requisitions.forEach(requisition => {
    if (requisition.status !== "CANCELLED") {
      total += getTotalCost(requisition, true);
    }
  });

  return total;
};

export const screenWidthHook = (setScreenWidth: React.Dispatch<React.SetStateAction<number>>) => {
  const handleResize = () => setScreenWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
};

export function useScreenWidth() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenWidth;
}

export const parseRequisitionParams = (
  projectReference: string | null,
  requisitionReference: string | null
) => {
  const [yearString, shortCode] = (projectReference || "").split("-");
  const year = parseInt(yearString || "");
  const projectRequisitionId = parseInt(requisitionReference || "");

  return { year, shortCode, projectRequisitionId };
};

export const FORM_RULES = {
  requiredRule: {
    required: true,
    message: "This field is required.",
  },
  urlRule: {
    type: "url",
    message: "Please enter a valid URL.",
  } as Rule,
  moneyRule: {
    // Checks if entered value is greater than 0
    validator: (rule: RuleObject, value: StoreValue) => {
      if (!value || parseFloat(value as string) > 0) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Please enter a value greater than 0."));
    },
  },
};
