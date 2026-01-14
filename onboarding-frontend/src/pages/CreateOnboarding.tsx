import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOnboarding, CustomerOnboardingRequest, UserRole } from '../api/onboardingApi';
import Button from '../components/Button';

const CreateOnboarding = () => {
  const navigate = useNavigate();

  // 1️⃣ Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // 2️⃣ Feedback state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 3️⃣ Mock current role
  const currentRole: UserRole = UserRole.OPS_USER;

  // 4️⃣ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !email || !phone) {
      setError('All fields are required');
      return;
    }

    const payload: CustomerOnboardingRequest = { fullName, email, phone };

    try {
      await createOnboarding(payload);
      setSuccess('Onboarding created successfully!');
      // Redirect to list after 1s
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h1>Create Onboarding</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Button type="submit">Create</Button>
      </form>
    </div>
  );
};

export default CreateOnboarding;