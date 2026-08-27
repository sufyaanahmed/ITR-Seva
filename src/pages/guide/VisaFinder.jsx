import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

const allCountries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const questions = [
  {
    id: 'passport',
    title: 'What passport do you hold?',
    type: 'country_select',
    options: allCountries,
    help: 'Your nationality determines which visa categories you are eligible for.'
  },
  {
    id: 'purpose',
    title: 'What is the main purpose of your trip?',
    type: 'select',
    options: ['Tourism / Sightseeing', 'Business Meetings', 'Medical Treatment', 'Conference', 'Employment / Work', 'Study'],
    help: 'We need to ensure you apply for the visa that legally permits your activities in India.'
  },
  {
    id: 'duration',
    title: 'How long do you plan to stay in India?',
    type: 'select',
    options: ['Less than 60 days', '1 to 6 months', 'More than 6 months']
  },
  {
    id: 'visited',
    title: 'Have you visited India before?',
    type: 'select',
    options: ['Yes', 'No'],
    help: 'If you have visited before, you may already have a visa history that helps process your application faster.'
  },
  {
    id: 'uae_prior_visa',
    title: 'Have you previously obtained an Indian e-Visa or regular/paper visa?',
    type: 'select',
    options: ['Yes', 'No'],
    help: 'UAE nationals must have previously obtained an Indian visa to be eligible for Visa-on-Arrival. First-time visitors must apply for an e-Visa or paper visa before travelling.',
    // Only shown if passport is UAE
    conditional: (answers) => answers.passport === 'United Arab Emirates'
  }
];

export default function VisaFinder() {
  const navigate = useNavigate();
  const { updateState } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHelp, setShowHelp] = useState(false);
  const [result, setResult] = useState(null);

  // Filter questions based on conditional logic (e.g., UAE prior visa question)
  const activeQuestions = questions.filter(q => !q.conditional || q.conditional(answers));
  const currentQ = activeQuestions[currentStep];

  const handleSelect = (option) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: option }));
  };

  const handleNext = () => {
    // Determine the active questions (skip UAE prior visa question for non-UAE)
    const activeQuestions = questions.filter(q => !q.conditional || q.conditional(answers));
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowHelp(false);
    } else {
      generateRecommendation();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowHelp(false);
    } else {
      navigate(-1);
    }
  };

  const VOA_COUNTRIES = ['Japan', 'South Korea', 'United Arab Emirates'];
  const VOA_PURPOSES = ['Tourism / Sightseeing', 'Business Meetings', 'Medical Treatment', 'Conference'];

  const generateRecommendation = () => {
    let recommendation = {};
    const isVoaCountry = VOA_COUNTRIES.includes(answers.passport);
    const isVoaPurpose = VOA_PURPOSES.includes(answers.purpose);
    const isUae = answers.passport === 'United Arab Emirates';
    const uaeHasPriorVisa = answers.uae_prior_visa === 'Yes';

    if (answers.passport === 'Afghanistan') {
      recommendation = {
        type: 'Afghan National Visa',
        desc: 'Based on your nationality, you must apply for a specific visa for Afghan Nationals through the dedicated Afghan portal.',
        path: '/flow/afghan',
        category: 'afghan'
      };
    } else if (isVoaCountry && isVoaPurpose && answers.duration === 'Less than 60 days' && (!isUae || uaeHasPriorVisa)) {
      recommendation = {
        type: 'Visa on Arrival',
        desc: `As a ${answers.passport} national, you are eligible for a Visa-on-Arrival at designated Indian airports. No prior online application is needed — you will complete a form and pay ₹2,000 on arrival.`,
        path: '/flow/voa',
        category: 'voa'
      };
    } else if (isUae && !uaeHasPriorVisa) {
      recommendation = {
        type: 'e-Visa (First-Time UAE Visitor)',
        desc: 'UAE nationals visiting India for the first time must obtain an e-Visa or paper visa before travel. You are not yet eligible for Visa-on-Arrival.',
        path: '/apply',
        category: 'evisa'
      };
    } else if (answers.duration === 'More than 6 months' || answers.purpose === 'Employment / Work' || answers.purpose === 'Study' || answers.passport === 'Pakistan') {
      recommendation = {
        type: 'Regular / Paper Visa',
        desc: 'Because of your duration of stay, nationality, or purpose of visit, you must apply for a Regular Visa through the nearest Indian Mission or Post.',
        path: '/flow/regular',
        category: 'regular'
      };
    } else {
      recommendation = {
        type: 'e-Visa',
        desc: 'You are eligible for a quick, online e-Visa. You will not need to visit an embassy or send your physical passport.',
        path: '/apply',
        category: 'evisa'
      };
    }
    setResult(recommendation);
  };

  const startApplication = () => {
    if (result.path === '/apply') {
      updateState({ 
        type: result.category, 
        step: 0, 
        data: { 
          application_type: result.category,
          visa_category: answers.purpose === 'Business Meetings' ? 'business' : answers.purpose === 'Medical Treatment' ? 'medical' : 'tourist',
          nationality: answers.passport !== 'Other' ? answers.passport : ''
        }, 
        docs: [], 
        submitted: false 
      });
    }
    navigate(result.path);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4 flex justify-center relative pattern-kalamkari">
        <div className="absolute inset-0 bg-surface/90"></div>
        <div className="max-w-2xl w-full bg-white border border-border-dark p-8 md:p-12 text-center relative z-10">
          <div className="w-16 h-16 bg-surface border border-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-secondary-accent uppercase tracking-[0.2em] mb-2 font-sans">Recommendation</h2>
          <h1 className="text-4xl font-serif font-bold text-primary mb-6">{result.type}</h1>
          <p className="text-text-secondary mb-10 text-lg font-serif italic">{result.desc}</p>
          
          <div className="border border-border-dark p-6 mb-10 text-left bg-surface">
            <h3 className="font-sans font-bold text-primary mb-2 flex items-center gap-2 uppercase tracking-widest text-sm">
              <svg className="w-5 h-5 text-secondary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Why this visa?
            </h3>
            <p className="text-text-secondary text-sm font-sans">
              We recommend this option because you hold a {answers.passport} passport and are traveling for {answers.purpose.toLowerCase()} for {answers.duration.toLowerCase()}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <button onClick={() => setResult(null)} className="btn-secondary">
              Change Answers
            </button>
            <button onClick={startApplication} className="btn-mughal group">
              <span className="inner-border"></span>
              <span className="relative z-10 flex items-center gap-2">Start Application <span className="text-secondary-accent transform group-hover:translate-x-1 transition-transform">&rarr;</span></span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-4 flex flex-col items-center relative pattern-kalamkari">
      <div className="absolute inset-0 bg-surface/90"></div>
      <div className="max-w-3xl w-full bg-white border border-border-dark flex flex-col min-h-[500px] relative z-10">
        
        {/* Header & Progress */}
        <div className="bg-primary px-8 py-8 text-white relative border-b border-border-dark pattern-jali">
          <div className="absolute inset-0 bg-primary/95"></div>
          <div className="relative z-10">
            <p className="text-[0.65rem] font-bold text-secondary-accent uppercase tracking-[0.2em] mb-2 font-sans">Visa Finder</p>
            <div className="flex justify-between items-end mb-6">
              <h1 className="text-3xl font-serif font-bold text-white">Find the right visa</h1>
              <span className="text-xs font-sans uppercase tracking-widest text-primary-light">Step {currentStep + 1} of {questions.length}</span>
            </div>
            <div className="w-full bg-primary-dark h-1 mt-4 overflow-hidden">
              <div 
                className="bg-secondary-accent h-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="p-8 md:p-12 flex-1 flex flex-col">
          <h2 className="text-3xl font-serif font-bold text-primary mb-8">{currentQ.title}</h2>
          
          {currentQ.type === 'country_select' ? (
            <div className="w-full mb-8 relative">
              <select 
                className="w-full appearance-none bg-surface border border-border-dark px-4 py-4 font-sans text-primary focus:outline-none focus:border-secondary-accent transition-colors duration-200"
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleSelect(e.target.value)}
              >
                <option value="">Select your country...</option>
                {currentQ.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {currentQ.options.map(option => {
                const isSelected = answers[currentQ.id] === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`p-5 text-left border transition-all duration-300 font-sans ${
                      isSelected 
                        ? 'border-secondary-accent bg-surface shadow-sm' 
                        : 'border-border-dark hover:border-primary-light hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 flex-shrink-0 mr-4 border flex items-center justify-center transition-colors ${
                        isSelected ? 'border-secondary-accent' : 'border-border'
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 bg-secondary-accent"></div>
                        )}
                      </div>
                      <span className={`text-sm tracking-wide ${isSelected ? 'text-primary font-bold' : 'text-text-secondary font-medium'}`}>
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Intelligent Context Help */}
          {currentQ.help && (
            <div className="mt-auto pt-6 border-t border-border-dark">
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className="text-xs font-sans font-bold text-secondary-accent uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Why are we asking this?
              </button>
              {showHelp && (
                <div className="mt-4 p-4 bg-surface border-l-2 border-secondary-accent text-text-secondary text-sm font-sans italic animate-fade-in">
                  {currentQ.help}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-surface px-8 py-6 border-t border-border-dark flex justify-between items-center">
          <button 
            onClick={handleBack}
            className="text-sm font-sans font-bold text-text-secondary uppercase tracking-widest hover:text-primary transition-colors"
          >
            &larr; Back
          </button>
          <button 
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className={`px-8 py-3 font-sans font-bold uppercase tracking-widest text-sm transition-all duration-300 border ${
              !answers[currentQ.id] 
                ? 'bg-surface border-border text-text-muted cursor-not-allowed' 
                : 'bg-primary border-primary text-white hover:bg-white hover:text-primary'
            }`}
          >
            {currentStep === questions.length - 1 ? 'See Recommendation' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
}
