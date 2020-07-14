import { PresetColorType } from "antd/es/_util/colors";
import React from "react";
import { Rule, RuleObject } from "antd/es/form";
import { StoreValue } from "@apollo/client";
import { Requisition, RequisitionFormData, RequisitionStatus } from "../types/Requisition";

export const StatusToColor = (status: RequisitionStatus): PresetColorType | undefined => {
  switch (status) {
    case "DRAFT": return "magenta";
    case "SUBMITTED": return "gold";
    case "PENDING_CHANGES": return "orange";
    case "READY_TO_ORDER": return "green";
    case "ORDERED": return "blue";
    case "PARTLY_RECEIVED": return "purple";
    case "RECEIVED": return "purple";
    case "CANCELLED": return "red";
    default: return undefined;
  }
};

export const StatusToString = (status: RequisitionStatus) => {
  switch (status) {
    case "DRAFT": return "Draft";
    case "SUBMITTED": return "Submitted";
    case "PENDING_CHANGES": return "Pending Changes";
    case "READY_TO_ORDER": return "Ready to Order";
    case "ORDERED": return "Ordered";
    case "PARTLY_RECEIVED": return "Partly Received";
    case "RECEIVED": return "Received";
    case "CANCELLED": return "Cancelled";
    default: return "Unknown";
  }
};

export const StatusToStep = (status: RequisitionStatus) => {
  switch (status) {
    case "DRAFT": return 0;
    case "SUBMITTED": return 1;
    case "PENDING_CHANGES": return 0;
    case "READY_TO_ORDER": return 2;
    case "ORDERED": return 3;
    case "PARTLY_RECEIVED": return 3;
    case "RECEIVED": return 4;
    case "CANCELLED": return -1;
    default: return 0;
  }
};

export const formatPrice = (num: number) => {
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: "USD"
  };

  return (num || 0).toLocaleString("en-US", options);
};

export const getTotalCost = (requisition: Requisition | RequisitionFormData | undefined, includeOtherFees: boolean) => {
  if (requisition) {
    let itemTotal = 0;

    if (requisition.requisitionitemSet) {
      itemTotal = requisition.requisitionitemSet.reduce((prev, curr) => {
        if (curr.quantity && curr.unitPrice) {
          return prev + (curr.quantity * curr.unitPrice);
        }
        return prev;
      }, 0);
    }

    // @ts-ignore
    return includeOtherFees ? itemTotal + parseFloat(requisition.otherFees || 0) : itemTotal;
  }

  return 0;
};

export const screenWidthHook = (setScreenWidth: React.Dispatch<React.SetStateAction<number>>) => {
  const handleResize = () => setScreenWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
};

export const parseRequisitionParams = (projectReference: (string | null), requisitionReference: (string | null)) => {
  const [year, shortCode] = (projectReference || "").split("-");
  const projectRequisitionId: number = parseInt(requisitionReference || "");

  return { year, shortCode, projectRequisitionId };
};

export const FORM_RULES = {
  requiredRule: {
    required: true,
    message: "This field is required."
  },
  urlRule: {
    type: "url",
    message: "Please enter a valid URL."
  } as Rule,
  moneyRule: { // Checks if entered value is greater than 0
    validator: (rule: RuleObject, value: StoreValue) => {
      if (!value || parseFloat(value as string) > 0) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Please enter a value greater than 0."));
    }
  }
};
