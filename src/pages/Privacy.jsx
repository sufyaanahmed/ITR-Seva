export default function Privacy() {
  return (
    <section className="section">
      <div className="container prose">
        <p className="eyebrow">Privacy and safety</p>
        <h1>Real taxpayer information does not belong here.</h1>
        <p>KarSaathi is an independent hackathon prototype. It uses three bundled fictional samples and does not provide a way to upload files or enter PAN, Aadhaar, TAN, CIN/LLPIN, GSTIN, DSC credentials, passwords, OTPs, bank accounts, or payment details.</p>
        <h2>What is saved locally</h2>
        <p>Answers and review choices for each fictional sample are saved separately in this browser using local storage so a journey can resume. Resetting one sample deletes only that sample’s fictional progress.</p>
        <h2>Optional AI requests</h2>
        <p>The plain-language assistant sends only a preset topic, selected language, and fictional screen name to the server. It never sends real taxpayer data. When the API is unavailable, offline guidance is used.</p>
        <h2>No government connection</h2>
        <p>This prototype does not read from, write to, test, scrape, or reverse-engineer a government system. Links to the official e-Filing portal are external and clearly identified.</p>
      </div>
    </section>
  );
}
