import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

// Types
export interface CustomerOnboardingRequest {
    fullName: string;
    email: string;
    phone: string;
}

export enum UserRole {
    OPS_USER = 'OPS_USER',
    OPS_MANAGER = 'OPS_MANAGER',
    COMPLIANCE_USER = 'COMPLIANCE_USER'
}

// API functions
export const getOnboardings = () => api.get('/customer-onboarding');
export const getOnboardingById = (id: number | string) => api.get(`/customer-onboarding/${id}`);
export const createOnboarding = (data: CustomerOnboardingRequest) => api.post('/customer-onboarding', data);

// ✅ Fixed approve/reject functions
export const approveOnboarding = (customerId: number | string, role: UserRole) => 
    api.post(`/customer-onboarding/${customerId}/approve`, null, { params: { role: role.toString() } });

export const rejectOnboarding = (customerId: number | string, role: UserRole) => 
    api.post(`/customer-onboarding/${customerId}/reject`, null, { params: { role: role.toString() } });

export const getAuditLogs = (id: number | string) => api.get(`/customer-onboarding/${id}/audit-logs`);

export default api;
