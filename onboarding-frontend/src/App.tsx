import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OnboardingList from './pages/OnboardingList';
import CreateOnboarding from './pages/CreateOnboarding';
import OnboardingDetails from './pages/OnboardingDetails';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default page — list of onboardings */}
        <Route path="/" element={<OnboardingList />} />

        {/* Create onboarding form */}
        <Route path="/create" element={<CreateOnboarding />} />

        {/* Details page — use :id to get onboarding id */}
        <Route path="/details/:id" element={<OnboardingDetails />} />
      </Routes>
    </Router>
  );
}

export default App;