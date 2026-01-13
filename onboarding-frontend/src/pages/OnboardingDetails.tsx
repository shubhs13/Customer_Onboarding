import React from 'react';
import { useParams } from 'react-router-dom';

const OnboardingDetails = () => {
  const { id } = useParams<{ id: string }>();
  return <h1>Onboarding Details Page — ID: {id}</h1>;
};

export default OnboardingDetails;