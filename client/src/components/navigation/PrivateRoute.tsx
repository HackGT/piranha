import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  user: any;
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = props => {
  if (props.user && props.user.canViewAdminPanel) {
    return props.children;
  }

  return <Navigate to="/" />;
};

export default PrivateRoute;
