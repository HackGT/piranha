import { RequisitionStatus } from "@prisma/client";
import { WebClient } from "@slack/web-api";
import { GraphQLError } from "graphql";

import {
  projectReferenceString,
  requisitionReferenceString,
  statusToString,
} from "../api/resolvers/common";
import { prisma } from "../common";

const web = new WebClient(process.env.SLACK_API_TOKEN);

export const sendSlackNotification = async (requisitionId: number) => {
  const requisition = await prisma.requisition.findUnique({
    where: {
      id: requisitionId,
    },
    include: {
      project: true,
      createdBy: true,
      approvals: {
        orderBy: {
          id: "desc",
        },
      },
    },
  });

  if (!process.env.SLACK_API_TOKEN || !process.env.ROOT_URL) {
    console.log("No slack api token or root url provided. Not sending slack message.");
    return;
  }

  if (!requisition?.createdBy.slackId || requisition.status === RequisitionStatus.DRAFT) {
    return;
  }

  if (!requisition) {
    throw new GraphQLError("Requisition not found when sending slack message.");
  }

  const url = `${process.env.ROOT_URL}/project/${projectReferenceString(
    requisition.project
  )}/requisition/${requisition.projectRequisitionId}`;
  const nameSnippet = `<${url}|${requisitionReferenceString(requisition)}> (${
    requisition.headline
  })`;
  let message;

  if (requisition.status === RequisitionStatus.SUBMITTED) {
    message = `Thank you for submitting requisition ${nameSnippet}! You will receive alerts from me when the status is changed.`;
  } else if (requisition.status === RequisitionStatus.PENDING_CHANGES) {
    message = `Requisition ${nameSnippet} has requested changes. Notes by reviewer: ${requisition.approvals[0].notes}`;
  } else {
    message = `Requisition ${nameSnippet} status updated to *${statusToString(
      requisition.status
    )}*`;
  }

  const res = await web.chat.postMessage({ channel: requisition.createdBy.slackId, text: message });

  if (res.error) {
    throw new GraphQLError(res.error);
  }
};
