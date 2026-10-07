import React from 'react';
import { Navigate } from 'react-router-dom';

export const CandidateRegister: React.FC = () => {
  return <Navigate to="/register?intent=find-team" replace />;
};

export default CandidateRegister;
