import React from 'react';
import { Navigate } from 'react-router-dom';

export const CandidateRegister: React.FC = () => {
  return <Navigate to="/register" replace />;
};

export default CandidateRegister;
