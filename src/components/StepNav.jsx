import { Link } from 'react-router-dom';

export const JOURNEY_STEPS = [
  { id: 'documents', label: 'Sample documents' },
  { id: 'compare', label: 'Compare records' },
  { id: 'questions', label: 'Quick questions' },
  { id: 'result', label: 'Your result' },
  { id: 'report', label: 'Readiness report' },
];

export default function StepNav({ currentStep, completedThrough, basePath = '/demo/individual', steps = JOURNEY_STEPS }) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);
  return (
    <nav className="step-nav" aria-label="Demo progress">
      <div className="step-progress-mobile" aria-hidden="true">
        <div className="step-progress-copy">
          <span>Step {currentIndex + 1} of {steps.length}</span>
          <strong>{steps[currentIndex]?.label}</strong>
        </div>
        <div className="step-progress-track">
          <span style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }} />
        </div>
      </div>
      <ol>
        {steps.map((step, index) => {
          const contents = (
            <>
              <span className="step-index">{index < completedThrough ? '✓' : index + 1}</span>
              <span>{step.label}</span>
            </>
          );
          return (
            <li key={step.id}>
              {index <= completedThrough || index === currentIndex ? (
                <Link
                  to={`${basePath}/${step.id}`}
                  aria-current={index === currentIndex ? 'step' : undefined}
                  data-complete={index < completedThrough}
                >
                  {contents}
                </Link>
              ) : (
                <span className="step-locked" aria-label={`${step.label}, not available yet`}>
                  {contents}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
