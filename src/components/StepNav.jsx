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
      <ol>
        {JOURNEY_STEPS.map((step, index) => (
          <li key={step.id}>
            <Link
              to={`/demo/${step.id}`}
              aria-current={index === currentIndex ? 'step' : undefined}
              data-complete={index < completedThrough}
            >
              <span className="step-index">{index < completedThrough ? '✓' : index + 1}</span>
              <span>{step.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
