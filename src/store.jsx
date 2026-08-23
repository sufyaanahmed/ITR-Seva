import React, { createContext, useContext, useState, useEffect } from 'react';

const appKey = 'itr-efiling-demo';

// Consistent fictional taxpayer data
export const DEMO_USER = {
  name: 'Rahul Sharma',
  pan: 'ABCPS1234K',
  dob: '1992-07-15',
  mobile: '98XXXXXX42',
  email: 'rahul.sharma@example.com',
  aadhaar: 'XXXX XXXX 1234',
  aadhaar_linked: true,
  residential_status: 'Resident',
  employment: 'Salaried'
};

const defaultState = {
  auth: {
    isLoggedIn: false,
    user: null,
  },
  itrDraft: {
    step: 0,
    assessment_year: '2026-27',
    filing_status: 'original',
    itr_type: 'ITR-1',
    data: {
      // Step 4: Personal
      first_name: 'Rahul',
      last_name: 'Sharma',
      pan: 'ABCPS1234K',
      dob: '1992-07-15',
      // Step 5: Salary
      gross_salary: '1250000',
      exempt_allowances: '50000',
      // Step 6: House Property
      house_property_income: '0',
      home_loan_interest: '150000',
      // Step 7: Business
      business_income: '0',
      // Step 8: Capital Gains
      stcg: '0',
      ltcg: '0',
      // Step 9: Other Sources
      interest_income: '25000',
      dividend_income: '5000',
      // Step 10: Deductions
      sec_80c: '150000',
      sec_80d: '25000',
      sec_80tta: '10000',
      // Step 11: Taxes Paid
      tds_salary: '110000',
      tds_other: '2500',
      advance_tax: '0',
      self_assessment_tax: '0'
    }
  },
  mockDb: {
    demands: [
      { id: 'DMD2024001', ay: '2024-25', amount: 4500, type: 'Regular Assessment', status: 'Pending', dueDate: '2025-12-31' }
    ],
    grievances: [
      { id: 'GRV9931', category: 'Refund related', status: 'Resolved', date: '2025-08-10' }
    ],
    payments: [],
    filedReturns: [
      { ay: '2025-26', ack: 'ITR8837261', form: 'ITR-1', status: 'Processed', dateFiled: '2025-07-20' },
      { ay: '2024-25', ack: 'ITR7748291', form: 'ITR-1', status: 'Refund Issued', dateFiled: '2024-07-15' }
    ]
  }
};

const StoreContext = createContext();
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(appKey);
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(appKey, JSON.stringify(state));
  }, [state]);

  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const updateAuth = (authData) => {
    setState(prev => ({ ...prev, auth: { ...prev.auth, ...authData } }));
  };

  const updateItrDraft = (draftUpdates) => {
    setState(prev => ({ ...prev, itrDraft: { ...prev.itrDraft, ...draftUpdates } }));
  };

  const updateItrData = (field, value) => {
    setState(prev => ({
      ...prev,
      itrDraft: {
        ...prev.itrDraft,
        data: { ...prev.itrDraft.data, [field]: value }
      }
    }));
  };
  
  const addPayment = (payment) => {
    setState(prev => ({
      ...prev,
      mockDb: { ...prev.mockDb, payments: [payment, ...prev.mockDb.payments] }
    }));
  };

  const addGrievance = (grievance) => {
    setState(prev => ({
      ...prev,
      mockDb: { ...prev.mockDb, grievances: [grievance, ...prev.mockDb.grievances] }
    }));
  };

  const submitItr = (filedReturn) => {
    setState(prev => ({
      ...prev,
      mockDb: { ...prev.mockDb, filedReturns: [filedReturn, ...prev.mockDb.filedReturns] },
      itrDraft: { ...defaultState.itrDraft } // Reset draft
    }));
  };

  const resetState = () => setState(defaultState);

  return (
    <StoreContext.Provider value={{ 
      state, 
      updateState, 
      updateAuth, 
      updateItrDraft, 
      updateItrData,
      addPayment,
      addGrievance,
      submitItr,
      resetState 
    }}>
      {children}
    </StoreContext.Provider>
  );
};
