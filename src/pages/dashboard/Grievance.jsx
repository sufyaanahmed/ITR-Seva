import React, { useState } from 'react';
import { useStore } from '../../store';

export default function Grievance() {
  const { state, addGrievance } = useStore();
  const { grievances } = state.mockDb;
  
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' or 'track'
  
  const [formData, setFormData] = useState({
    category: 'Refund related',
    subCategory: 'Refund not credited',
    description: ''
  });

  const [submittedId, setSubmittedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = 'GRV' + Math.floor(Math.random() * 100000);
    const newGrievance = {
      id: newId,
      category: formData.category,
      status: 'Submitted',
      date: new Date().toISOString().split('T')[0]
    };
    addGrievance(newGrievance);
    setSubmittedId(newId);
    setFormData({ ...formData, description: '' });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-primary mb-1">Grievances</h1>
        <p className="text-sm text-text-secondary">Submit or track a grievance with the Income Tax Department</p>
      </div>

      <div className="flex border-b border-border">
        <button 
          className={`px-4 py-2 font-bold text-sm ${activeTab === 'submit' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}
          onClick={() => { setActiveTab('submit'); setSubmittedId(null); }}
        >
          Submit Grievance
        </button>
        <button 
          className={`px-4 py-2 font-bold text-sm ${activeTab === 'track' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}
          onClick={() => setActiveTab('track')}
        >
          View / Track Grievances
        </button>
      </div>

      {activeTab === 'submit' && (
        <div className="bg-white border border-border shadow-sm rounded-sm p-6">
          {submittedId ? (
            <div className="text-center py-8">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-success">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-success mb-2">Grievance Submitted Successfully</h2>
              <p className="mb-6 text-gray-600">Your grievance has been forwarded to the concerned department.</p>
              <div className="bg-gray-100 inline-block p-4 rounded mb-8">
                <span className="block text-sm text-gray-500 mb-1">Grievance Acknowledgement Number</span>
                <span className="font-mono font-bold text-xl text-primary">{submittedId}</span>
              </div>
              <div>
                <button type="button" onClick={() => setActiveTab('track')} className="btn-primary">Track Status</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Relevant Department / Category</label>
                <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Refund related</option>
                  <option>E-Filing Portal related</option>
                  <option>Processing of ITR</option>
                  <option>Demand related</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Sub Category</label>
                <select className="input-field" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}>
                  <option>Refund not credited</option>
                  <option>Refund amount incorrect</option>
                  <option>Intimation not received</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Grievance Description</label>
                <textarea 
                  className="input-field h-32" 
                  placeholder="Provide detailed description of your issue..."
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
                <span className="text-xs text-gray-500">Maximum 3000 characters. Do not share passwords.</span>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Attachment (Optional)</label>
                <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-blue-100" />
                <span className="text-xs text-gray-500 mt-1 block">Supported formats: PDF, ZIP (Max 5MB)</span>
              </div>
              <div>
                <button type="submit" className="btn-primary">Submit Grievance</button>
              </div>
            </form>
          )}
        </div>
      )}

      {activeTab === 'track' && (
        <div className="bg-white border border-border rounded-sm shadow-sm overflow-hidden">
          {grievances.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">No grievances found.</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-text font-bold">
                <tr>
                  <th className="p-4">Grievance ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {grievances.map((g, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-mono font-semibold text-primary">{g.id}</td>
                    <td className="p-4">{g.date}</td>
                    <td className="p-4">{g.category}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${g.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-primary hover:underline font-bold text-xs">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
