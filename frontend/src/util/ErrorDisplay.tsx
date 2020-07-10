import React from "react";
import { Button, Result } from "antd";

interface Props {
  message: string | undefined;
}

const ErrorDisplay: React.FC<Props> = (props) => (
  <Result
    status="error"
    title="Something Went Wrong :("
    subTitle={props.message}
    extra={<Button type="primary" onClick={() => window.location.reload()}>Refresh Page</Button>}
  />
);

export default ErrorDisplay;
