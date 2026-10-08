import React from 'react';
import { Navigate } from 'react-router-dom';

export const CandidateLogin: React.FC = () => {
  return <Navigate to="/login" replace />;
};

export default CandidateLogin;
