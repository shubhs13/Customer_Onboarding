import React, { useEffect, useState } from 'react';
import { getOnboardings } from '../api/onboardingApi';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { UserRole } from '../api/onboardingApi';

interface Onboarding{
  customerId : number;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  stage: string;
  createdBy: UserRole;
}

const OnboardingList = () => {
  const navigate: (to: string) => void = useNavigate();
  const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
  const [error, setError] = useState('');

  useEffect(()=>{
    async function fetchData(){
      try{
        const response = await getOnboardings();
        setOnboardings(response.data);
      } catch (err:any){
        setError('Failed to fetch onboardings')
      }
    }
    fetchData();
  },[]);

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
                <td>{o.status}</td>
                <td>{o.stage}</td>
                <td>
                  <button onClick={() => navigate(`/details/${o.customerId}`)}>View</button>
                  {/* Approve/Reject Button will com later */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );

};

export default OnboardingList