import React from 'react';

// The home page reveals its own artwork. Lazy routes only need a quiet,
// delayed loading cue so a fast navigation never flashes a separate screen.
export default function Loader() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="route-loading min-h-[55vh]">
      <span className="route-loading-track" aria-hidden="true"><span /></span>
      <span className="sr-only">Loading page</span>
    </div>
  );
}
