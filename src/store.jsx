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
  employment: 'Salaried',
  entity_type: 'Individual'
};

export const DEMO_COMPANY = {
  name: 'TechInnovate India Pvt Ltd',
  pan: 'AABCT1234F',
  dob: '2015-05-12',
  email: 'tax@techinnovate.in',
  residential_status: 'Resident',
  entity_type: 'Company'
};

export const DEMO_FIRM = {
  name: 'Sharma & Associates LLP',
  pan: 'AAIFS5678L',
  dob: '2018-08-10',
  email: 'info@sharmaassociates.in',
  residential_status: 'Resident',
  entity_type: 'Firm'
};

const getDraftForType = (type) => {
  if (type === 'Company') {
    return {
      step: 0,
      assessment_year: '2026-27',
      filing_status: 'original',
      itr_type: 'ITR-6',
      data: {
        company_name: 'TechInnovate India Pvt Ltd',
        pan: 'AABCT1234F',
        business_receipts: '50000000',
        net_profit: '7500000',
        stcg: '500000',
        sec_80g: '100000',
        advance_tax: '1500000',
        tds: '0'
      }
    };
  } else if (type === 'Firm') {
    return {
      step: 0,
      assessment_year: '2026-27',
      filing_status: 'original',
      itr_type: 'ITR-5',
      data: {
        firm_name: 'Sharma & Associates LLP',
        pan: 'AAIFS5678L',
        professional_receipts: '15000000',
        net_profit: '3000000',
        partner_remuneration: '4000000',
        advance_tax: '800000',
        tds: '0'
      }
    };
  }
  // Default Individual
  return {
    step: 0,
    assessment_year: '2026-27',
    filing_status: 'original',
    itr_type: 'ITR-1',
    data: {
      first_name: 'Rahul',
      last_name: 'Sharma',
      pan: 'ABCPS1234K',
      dob: '1992-07-15',
      gross_salary: '1250000',
      exempt_allowances: '50000',
      house_property_income: '0',
      home_loan_interest: '150000',
      business_income: '0',
      stcg: '0',
      ltcg: '0',
      interest_income: '25000',
      dividend_income: '5000',
      sec_80c: '150000',
      sec_80d: '25000',
      sec_80tta: '10000',
      tds_salary: '110000',
      tds_other: '2500',
      advance_tax: '0',
      self_assessment_tax: '0'
    }
  };
};

const getDbForType = (type) => {
  if (type === 'Company') {
    return {
      demands: [{ id: 'DMD_COMP_01', ay: '2024-25', amount: 150000, type: 'Regular Assessment', status: 'Pending', dueDate: '2025-12-31' }],
      grievances: [],
      payments: [],
      filedReturns: [{ ay: '2025-26', ack: 'ITR6663726', form: 'ITR-6', status: 'Processed', dateFiled: '2025-08-10' }]
    };
  } else if (type === 'Firm') {
    return {
      demands: [],
      grievances: [{ id: 'GRV_FIRM_01', category: 'Processing of ITR', status: 'Pending', date: '2025-10-01' }],
      payments: [],
      filedReturns: [{ ay: '2025-26', ack: 'ITR5553726', form: 'ITR-5', status: 'Processed', dateFiled: '2025-07-25' }]
    };
  }
  return {
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
  };
};

const defaultState = {
  auth: {
    isLoggedIn: false,
    user: null,
  },
  itrDraft: getDraftForType('Individual'),
  mockDb: getDbForType('Individual')
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
      itrDraft: getDraftForType(prev.auth.user.entity_type) // Reset draft for current persona
    }));
  };

  const loginUser = (type) => {
    let newUser;
    if (type === 'Company') newUser = DEMO_COMPANY;
    else if (type === 'Firm') newUser = DEMO_FIRM;
    else newUser = DEMO_USER;

    setState(prev => ({
      ...prev,
      auth: { ...prev.auth, isLoggedIn: true, user: newUser },
      itrDraft: getDraftForType(type),
      mockDb: getDbForType(type)
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
      loginUser,
      resetState 
    }}>
      {children}
    </StoreContext.Provider>
  );
};
