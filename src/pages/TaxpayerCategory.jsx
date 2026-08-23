import React from 'react';
import { useParams, Link } from 'react-router-dom';

const categoryData = {
  'individual': {
    title: 'Individual / HUF',
    description: 'Tax information and filing guidance for Individuals and Hindu Undivided Families.',
    subcategories: [
      { name: 'Salaried Employees', links: [
        { label: 'How to File', url: '/help' },
        { label: 'Returns Applicable', url: '/help' },
        { label: 'Tax Slabs', url: '/help' },
        { label: 'Deductions', url: '/help' }
      ]},
      { name: 'Business / Profession', links: [
        { label: 'How to File', url: '/help' },
        { label: 'Returns Applicable', url: '/help' },
        { label: 'Tax Slabs', url: '/help' },
        { label: 'Deductions', url: '/help' }
      ]},
      { name: 'Senior Citizens', links: [
        { label: 'How to File', url: '/help' },
        { label: 'Returns Applicable', url: '/help' },
        { label: 'Tax Slabs', url: '/help' },
        { label: 'Deductions', url: '/help' }
      ]}
    ]
  },
  'company': {
    title: 'Company',
    description: 'Tax information for Domestic and Foreign Companies.',
    subcategories: [
      { name: 'Domestic Company', links: [
        { label: 'Returns Applicable', url: '/help' },
        { label: 'Tax Slabs', url: '/help' },
        { label: 'Deductions', url: '/help' }
      ]},
      { name: 'Foreign Company', links: [
        { label: 'Returns Applicable', url: '/help' },
        { label: 'Tax Slabs', url: '/help' },
        { label: 'Deductions', url: '/help' }
      ]}
    ]
  },
  'non-company': {
    title: 'Non-Company',
    description: 'Tax information for Firms, LLPs, Trusts, and Local Authorities.',
    subcategories: [
      { name: 'Firm / LLP', links: [
        { label: 'How to File', url: '/help' },
        { label: 'Returns Applicable', url: '/help' },
        { label: 'Tax Slabs', url: '/help' },
        { label: 'Deductions', url: '/help' }
      ]},
      { name: 'AOP / BOI / Trust', links: [
        { label: 'Returns Applicable', url: '/help' },
        { label: 'Tax Slabs', url: '/help' },
        { label: 'Deductions', url: '/help' }
      ]}
    ]
  },
  'tax-professionals': {
    title: 'Tax Professionals & Others',
    description: 'Information for Chartered Accountants, ERIs, and External Agencies.',
    subcategories: [
      { name: 'Chartered Accountants', links: [
        { label: 'Registration', url: '/help' },
        { label: 'Services Available', url: '/help' }
      ]},
      { name: 'e-Return Intermediaries (ERI)', links: [
        { label: 'API Specifications', url: '/help' },
        { label: 'ERI List', url: '/help' }
      ]}
    ]
  }
};

export default function TaxpayerCategory() {
  const { type } = useParams();
  const data = categoryData[type];

  if (!data) {
    return (
      <div className="max-w-[1200px] mx-auto py-12 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <Link to="/" className="text-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-6">
      <div className="bg-primary text-white p-8 rounded-sm shadow-md mb-12">
        <h1 className="text-4xl font-serif font-bold mb-4">{data.title}</h1>
        <p className="text-lg text-primary-light max-w-2xl">{data.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.subcategories.map(sub => (
          <div key={sub.name} className="border border-border bg-white rounded-sm shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gray-50 border-b border-border p-4">
              <h2 className="font-bold text-lg text-primary">{sub.name}</h2>
            </div>
            <ul className="p-4 flex-1 space-y-3">
              {sub.links.map(link => (
                <li key={link.label}>
                  <Link to={link.url} className="text-sm font-medium text-text-secondary hover:text-primary hover:underline flex items-center">
                    <span className="mr-2 text-primary">→</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
