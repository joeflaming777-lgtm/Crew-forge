import React from 'react';
import { Navigate } from 'react-router-dom';

export const LeaderRegister: React.FC = () => {
  return <Navigate to="/register?intent=build-team" replace />;
};

export default LeaderRegister;
