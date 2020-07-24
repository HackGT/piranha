import React from "react";
import { Button, Result } from "antd";
import { ApolloError } from "@apollo/client";

interface Props {
  error: ApolloError | undefined;
}

const ErrorDisplay: React.FC<Props> = (props) => {
  console.error(JSON.parse(JSON.stringify(props.error)));

  // @ts-ignore
  if (props.error?.networkError?.statusCode === 403) {
    return (
      <Result
        status="error"
        title="Sorry, you don't have access :("
        subTitle="Please contact a tech team member."
      />
    );
  }

  return (
    <Result
      status="error"
      title="Something Went Wrong :("
      subTitle={props.error?.message}
      extra={<Button type="primary" onClick={() => window.location.reload()}>Refresh Page</Button>}
    />
  );
};

export default ErrorDisplay;
