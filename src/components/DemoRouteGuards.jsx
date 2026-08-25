import { Navigate, useParams } from 'react-router-dom';
import Journey from '../pages/Journey.jsx';
import EntityJourney from '../pages/EntityJourney.jsx';
import { isProfileId } from '../context/AppContext.jsx';

export function LegacyDemoRedirect() {
  const { stepId } = useParams();
  return <Navigate to={`/demo/individual/${stepId || 'documents'}`} replace />;
}

export function ProfileJourneyRoute() {
  const { profileId } = useParams();
  if (!isProfileId(profileId)) return <Navigate to="/demo" replace />;
  if (profileId !== 'individual') return <EntityJourney />;
  return <Journey profileId={profileId} />;
}
