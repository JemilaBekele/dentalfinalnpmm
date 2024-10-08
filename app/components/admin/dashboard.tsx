import { useEffect, useState } from 'react';
import { FieldTimeOutlined, RiseOutlined,FundViewOutlined, CalendarOutlined, AuditOutlined } from '@ant-design/icons';
import RoleCountDisplay from './count'
import TotalCountDisplay from './totalprice'
import TotalCountBalance from './balance'
import TotalMOnthDisplay from './month'
const PatientDashboard = () => {
  const [totalPatients, setTotalPatients] = useState<number | null>(null);
  const [lastMonthPatients, setLastMonthPatients] = useState<number | null>(null);
  const [currentMonthPatients, setCurrentMonthPatients] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Fetch total patients
  const fetchTotalPatients = async () => {
    try {
      const response = await fetch('/api/patient/count');
      const data = await response.json();
      if (response.ok) {
        setTotalPatients(data.totalPatients);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to fetch total patients');
    }
  };

  // Fetch monthly patients (current and last)
  const fetchMonthlyPatients = async () => {
    try {
      const response = await fetch('/api/patient/count/month');
      const data = await response.json();
      if (response.ok) {
        setLastMonthPatients(data.lastMonthPatients);
        setCurrentMonthPatients(data.currentMonthPatients);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to fetch monthly patients');
    }
  };

  // Fetch active patients
  
  useEffect(() => {
    fetchTotalPatients();
    fetchMonthlyPatients();
    
  }, []);

  return (
    <div className="min-h-screen flex">
     
      <div className="flex-1 ml-60 p-10 bg-gray-100"> {/* Adjust margin to make room for sidebar */}
        <h1 className="text-3xl font-bold mb-8">Patient Dashboard</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* Today's Patients Box */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center mb-2">
              <FieldTimeOutlined style={{ fontSize: '36px', color: '#1E90FF' }} /> {/* Blue color for icon */}
              <h2 className="text-xl font-bold mt-2">Total Patients</h2>
            </div>
            {totalPatients !== null ? (
              <p className="text-3xl font-semibold mt-4">{totalPatients}</p> 
            ) : (
              <p>Loading...</p>
            )}
          </div>

          {/* Monthly Patients Box */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center mb-2">
              <CalendarOutlined style={{ fontSize: '36px', color: '#FF6347' }} /> {/* Red/Orange color for icon */}
              <h2 className="text-xl font-bold mt-2">Monthly Patients</h2>
            </div>
            <div className="w-full flex justify-between mt-4">
              {/* Last Month */}
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold">Last Month</h3>
                {lastMonthPatients !== null ? (
                  <p className="text-xl">{lastMonthPatients}</p>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              {/* Current Month */}
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold">Current Month</h3>
                {currentMonthPatients !== null ? (
                  <p className="text-xl">{currentMonthPatients}</p>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>

          {/* Active Patients Box */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center mb-2">
              <AuditOutlined  style={{ fontSize: '36px', color: '#32CD32' }} /> {/* Green color for icon */}
              <h2 className="text-xl font-bold mt-2">Total Balance</h2>
              <TotalCountBalance/>
            </div>
            
          </div>

          
        </div>
        <div className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl">
        <div className="bg-white shadow-sm rounded-lg  flex flex-col items-center justify-center text-center">
        <h2 className="mt-6 text-xl font-bold text-gray-900 capitalize">Employees</h2>
        <RoleCountDisplay />
        </div>
        <div className="bg-white shadow-sm rounded-lg  flex flex-col items-center justify-center text-center">
        <h2 className="mt-6 text-xl font-bold text-gray-900 capitalize " style={{ fontSize: '34px', color: '#b2CD32' }}><RiseOutlined /> Invoice</h2>
<TotalCountDisplay/>
        </div>
        <div className="bg-white shadow-sm rounded-lg mb-3 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center mb-2">
        <FundViewOutlined  style={{ fontSize: '36px', color: '#3ffD32' }} /> {/* Green color for icon */}
        <h2 className="text-xl font-bold mt-2">Total Balance</h2>
        </div>
          <TotalMOnthDisplay/>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default PatientDashboard;