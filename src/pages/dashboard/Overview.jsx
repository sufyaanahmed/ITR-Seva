import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store';

export default function Overview() {
  const { state } = useStore();
  const { user } = state.auth;
  const { demands, filedReturns } = state.mockDb;

  const totalDemand = demands.reduce((acc, curr) => acc + curr.amount, 0);
  const latestReturn = filedReturns[0];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm border border-border rounded-sm p-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Welcome, {user.name}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-text">PAN:</span> <span className="uppercase">{user.pan}</span>
            <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-text">Aadhaar:</span> <span>{user.aadhaar}</span>
            {user.aadhaar_linked && <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-bold">Linked</span>}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-text">Status:</span> <span>{user.residential_status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm border border-border rounded-sm p-6 flex flex-col">
          <h2 className="text-sm font-bold uppercase text-text-secondary tracking-wider mb-4">Return Filing Status</h2>
          <div className="flex-1">
            {latestReturn ? (
              <div>
                <p className="font-bold text-xl mb-1">{latestReturn.ay}</p>
                <p className="text-primary font-semibold mb-2">{latestReturn.form}</p>
                <div className="flex items-center justify-between border-t pt-2 mt-4">
                  <span className="text-sm text-text-secondary">Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${latestReturn.status.includes('Refund') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {latestReturn.status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-text-secondary">No returns filed yet.</p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Link to="/itr/assessment-year" className="text-primary font-bold text-sm hover:underline">File ITR &rarr;</Link>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-border rounded-sm p-6 flex flex-col">
          <h2 className="text-sm font-bold uppercase text-text-secondary tracking-wider mb-4">Outstanding Demand</h2>
          <div className="flex-1 flex flex-col justify-center">
            {totalDemand > 0 ? (
              <>
                <p className="text-3xl font-bold text-error mb-2">₹ {totalDemand}</p>
                <p className="text-sm text-text-secondary">You have pending tax demands.</p>
              </>
            ) : (
              <p className="text-3xl font-bold text-success mb-2">₹ 0</p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            {totalDemand > 0 ? (
              <Link to="/demand" className="text-primary font-bold text-sm hover:underline">View Demands &rarr;</Link>
            ) : (
              <span className="text-text-secondary text-sm">No action required</span>
            )}
          </div>
        </div>

        <div className="bg-white shadow-sm border border-border rounded-sm p-6 flex flex-col">
          <h2 className="text-sm font-bold uppercase text-text-secondary tracking-wider mb-4">Quick Actions</h2>
          <div className="flex-1 space-y-3">
            <Link to="/itr/assessment-year" className="block text-sm font-medium text-text-secondary hover:text-primary hover:underline">
              File Income Tax Return
            </Link>
            <Link to="/ais" className="block text-sm font-medium text-text-secondary hover:text-primary hover:underline">
              View AIS (Annual Information Statement)
            </Link>
            <Link to="/form-26as" className="block text-sm font-medium text-text-secondary hover:text-primary hover:underline">
              View Form 26AS
            </Link>
            <Link to="/tax-payment" className="block text-sm font-medium text-text-secondary hover:text-primary hover:underline">
              e-Pay Tax
            </Link>
            <Link to="/grievances/new" className="block text-sm font-medium text-text-secondary hover:text-primary hover:underline">
              Submit Grievance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
