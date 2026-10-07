import React from 'react';
import { Navigate } from 'react-router-dom';

export const CandidateLogin: React.FC = () => {
  return <Navigate to="/login?intent=find-team" replace />;
};

export default CandidateLogin;
