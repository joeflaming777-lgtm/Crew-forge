import React from 'react';
import { Navigate } from 'react-router-dom';

export const LeaderLogin: React.FC = () => {
  return <Navigate to="/login?intent=build-team" replace />;
};

export default LeaderLogin;
