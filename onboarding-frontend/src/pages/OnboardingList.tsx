import React, { useEffect, useState } from 'react';
import { approveOnboarding, getOnboardings, rejectOnboarding } from '../api/onboardingApi';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { UserRole } from '../api/onboardingApi';

interface Onboarding{
  customerId : number;
  fullName: string;
  email: string;
  phone: string;
  onboardingStatus: string;
  currentStage: string;
  createdBy: UserRole;
}



const OnboardingList = () => {
  const navigate: (to: string) => void = useNavigate();
  const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
  const [error, setError] = useState('');

  //mock role
  const currentRole: UserRole = UserRole.OPS_USER
  const fetchOnboardings = async function fetchData(){
    try{
      const response = await getOnboardings();
      setOnboardings(response.data);
    } catch (err:any){
      setError('Failed to fetch onboardings')
    }
  }
  useEffect(()=>{
    fetchOnboardings();
  },[]);

  //Approve Handler
  const handleApprove = async (customerId: number) => {
    try {
      await approveOnboarding(customerId, currentRole);
      fetchOnboardings(); // refresh list
    } catch (err: any) {
      console.error(err);
    }
  };
  
  const handleReject = async (customerId: number) => {
    try {
      await rejectOnboarding(customerId, currentRole);
      fetchOnboardings(); // refresh list
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div style= {{maxWidth: 800, margin: '2rem auto'}}>
      <h1>Onboarding List</h1>
        {error && <p style = {{color:'red'}}>{error}</p>}
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Stage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {onboardings.map((o: Onboarding)=>(
              <tr key={o.customerId} style={{borderBottom:'1px solid #ccc'}}>
                <td>{o.customerId}</td>
                <td>{o.fullName}</td>
                <td>{o.email}</td>
                <td>{o.phone}</td>
                <td>{o.onboardingStatus}</td>
                <td>{o.currentStage}</td>
                <td>
                  <button onClick={() => navigate(`/details/${o.customerId}`)}>View</button>
                  {/* Approve/Reject Button will com later */}
                  <button 
                    disabled={o.onboardingStatus !=='PENDING' ||
                              currentRole !==UserRole.OPS_USER}
                    onClick={() => handleApprove(o.customerId)}> Approve
                  </button>
                  <button 
                    disabled={o.onboardingStatus !=='PENDING' || 
                              currentRole !==UserRole.OPS_USER}
                    onClick={() => handleReject(o.customerId)}> Reject
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );

};

export default OnboardingList