import { Link } from 'react-router-dom';

export const JOURNEY_STEPS = [
  { id: 'documents', label: 'Sample documents' },
  { id: 'compare', label: 'Compare records' },
  { id: 'questions', label: 'Quick questions' },
  { id: 'result', label: 'Your result' },
  { id: 'report', label: 'Readiness report' },
];

export default function StepNav({ currentStep, completedThrough }) {
  const currentIndex = JOURNEY_STEPS.findIndex((step) => step.id === currentStep);
  return (
    <nav className="step-nav" aria-label="Demo progress">
      <div className="step-progress-mobile" aria-hidden="true">
        <div className="step-progress-copy">
          <span>Step {currentIndex + 1} of {JOURNEY_STEPS.length}</span>
          <strong>{JOURNEY_STEPS[currentIndex]?.label}</strong>
        </div>
        <div className="step-progress-track">
          <span style={{ width: `${((currentIndex + 1) / JOURNEY_STEPS.length) * 100}%` }} />
        </div>
      </div>
      <ol>
        {JOURNEY_STEPS.map((step, index) => {
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
                  to={`/demo/${step.id}`}
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
