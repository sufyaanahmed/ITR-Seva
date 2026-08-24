export default function Privacy() {
  return (
    <section className="section">
      <div className="container prose">
        <p className="eyebrow">Privacy and safety</p>
        <h1>Real taxpayer information does not belong here.</h1>
        <p>KarSaathi is an independent hackathon prototype. It uses one bundled fictional person named Rahul Sharma and does not provide a way to upload files or enter PAN, Aadhaar, passwords, OTPs, bank accounts, or payment details.</p>
        <h2>What is saved locally</h2>
        <p>Answers about the fictional Rahul example and fictional discrepancy resolutions are saved in this browser using local storage so the demo can resume. Resetting the demo deletes that journey state.</p>
        <h2>Optional AI requests</h2>
        <p>The plain-language assistant sends only a preset topic, selected language, and fictional screen name to the server. It never sends real taxpayer data. When the API is unavailable, offline guidance is used.</p>
        <h2>No government connection</h2>
        <p>This prototype does not read from, write to, test, scrape, or reverse-engineer a government system. Links to the official e-Filing portal are external and clearly identified.</p>
      </div>
    </section>
  );
}
