import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1',
    headers: {'Content-Type': 'application/json'},
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
export const approveOnboarding = (id: number | string, role: UserRole) => 
    api.post(`/customer-onboarding/${id}/approve`, null, { params: { role } });
export const rejectOnboarding = (id: number | string, role: UserRole) => 
    api.post(`/customer-onboarding/${id}/reject`, null, { params: { role } });
export const getAuditLogs = (id: number | string) => api.get(`/customer-onboarding/${id}/audit-logs`);

export default api;