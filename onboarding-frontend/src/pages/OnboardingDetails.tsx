import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOnboardingById, getAuditLogs, approveOnboarding, rejectOnboarding, UserRole } from '../api/onboardingApi';

interface Onboarding {
  customerId: number;
  fullName: string;
  email: string;
  phone: string;
  onboardingStatus: string;
  currentStage: string;
  createdBy: UserRole;
}

interface AuditLog {
  id: number;
  action: string;
  actionBy: UserRole;
  timestamp: string;
  stage: string;
  status: string;
}

const OnboardingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [onboarding, setOnboarding] = useState<Onboarding | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState('');

  // Mock current role for testing
  const currentRole: UserRole = UserRole.OPS_USER;

  // Fetch onboarding + audit logs
  const fetchData = async () => {
    if (!id) return;

    try {
      const resp = await getOnboardingById(id);
      console.log("BAckend data:", resp.data)

      setOnboarding(resp.data);

      const logsResp = await getAuditLogs(id);
      setAuditLogs(logsResp.data);
    } catch (err: any) {
      setError('Failed to load onboarding details');
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Approve / Reject handlers
  const handleApprove = async () => {
    if (!id) return;
    try {
      await approveOnboarding(Number(id), currentRole);
      fetchData(); // refresh details + audit logs
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      await rejectOnboarding(Number(id), currentRole);
      fetchData(); // refresh details + audit logs
    } catch (err: any) {
      console.error(err);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!onboarding) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Onboarding Details</h1>

      <div>
        <p><strong>ID:</strong> {onboarding.customerId}</p>
        <p><strong>Name:</strong> {onboarding.fullName}</p>
        <p><strong>Email:</strong> {onboarding.email}</p>
        <p><strong>Phone:</strong> {onboarding.phone}</p>
        <p><strong>Status:</strong> {onboarding.onboardingStatus}</p>
        <p><strong>Stage:</strong> {onboarding.currentStage}</p>
        <p><strong>Created By:</strong> {onboarding.createdBy}</p>
      </div>

      {/* Approve / Reject buttons */}
      {onboarding.onboardingStatus === 'PENDING' && currentRole === UserRole.OPS_USER && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleApprove}>Approve</button>
          <button onClick={handleReject} style={{ marginLeft: '0.5rem' }}>Reject</button>
        </div>
      )}

      <h2 style={{ marginTop: '2rem' }}>Audit Logs</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Action</th>
            <th>By</th>
            <th>Stage</th>
            <th>Status</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td>{log.action}</td>
              <td>{log.actionBy}</td>
              <td>{log.stage}</td>
              <td>{log.status}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button style={{ marginTop: '1rem' }} onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default OnboardingDetails;
