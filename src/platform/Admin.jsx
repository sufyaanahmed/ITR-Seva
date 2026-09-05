import React, { useEffect, useState } from "react";
import { api } from "./client";
import Auth from "./Auth";
import { Badge, Details, History, labels, signOut } from "./Applications";
function AdminPortal() {
  const [me, setMe] = useState(null),
    [rows, setRows] = useState([]),
    [total, setTotal] = useState(0),
    [counts, setCounts] = useState({}),
    [status, setStatus] = useState(""),
    [search, setSearch] = useState(""),
    [page, setPage] = useState(0),
    [selected, setSelected] = useState(null),
    [reason, setReason] = useState(""),
    [target, setTarget] = useState("under_review"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [refresh, setRefresh] = useState(0);
  useEffect(() => {
    setError("");
    api("/me")
      .then(setMe)
      .catch((e) => setError(e.message));
  }, [refresh]);
  useEffect(() => {
    if (!me?.role) return;
    let active = true;
    setError("");
    setBusy(true);
    Promise.all([
      api(
        `/admin/applications?${new URLSearchParams({ status, search, page })}`,
      ),
      api("/admin/counts"),
    ])
      .then(([result, c]) => {
        if (active) {
          setRows(result.applications);
          setTotal(result.count);
          setCounts(c);
        }
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setBusy(false));
    return () => {
      active = false;
    };
  }, [me, status, search, page, refresh]);
  async function open(id) {
    setError("");
    setBusy(true);
    try {
      const a = await api(`/admin/applications/${id}`);
      setSelected(a);
      setReason("");
      setTarget(
        a.status === "under_review"
          ? "waiting_for_information"
          : "under_review",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function transition(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api(`/admin/applications/${selected.id}/transition`, {
        method: "POST",
        body: { version: selected.version, status: target, reason },
      });
      await open(selected.id);
      setRefresh((x) => x + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const options =
    selected?.status === "submitted"
      ? ["under_review", "waiting_for_information"]
      : selected?.status === "under_review"
        ? [
            "waiting_for_information",
            ...(["decision_maker", "administrator"].includes(me?.role)
              ? ["accepted", "rejected"]
              : []),
          ]
        : selected?.status === "waiting_for_information"
          ? ["under_review"]
          : [];
  return (
    <>
      <header className="platform-admin-header">
        <strong>Visa Seva · Administration</strong>
        <button onClick={signOut}>Sign out</button>
      </header>
      <main className="platform-page">
        {error && (
          <p role="alert" className="platform-alert">
            {error}
            <button
              className="platform-secondary ml-3"
              onClick={() => setRefresh((value) => value + 1)}
            >
              Try again
            </button>
          </p>
        )}
        {!me && !error && <p role="status">Checking access…</p>}
        {me && !me.role && (
          <div className="platform-card">
            <h1>Access restricted</h1>
            <p>Your account does not have an assigned admin role.</p>
          </div>
        )}
        {me?.role && (
          <>
            {selected ? (
              <>
                <button
                  className="platform-link"
                  onClick={() => setSelected(null)}
                >
                  ← All applications
                </button>
                <div className="platform-toolbar mt-6">
                  <h1>{selected.reference}</h1>
                  <Badge value={selected.status} />
                </div>
                <div className="platform-card">
                  <h2>Applicant details</h2>
                  <Details application={selected} />
                </div>
                <div className="platform-card">
                  <h2>Documents</h2>
                  {selected.documents.map((d) => (
                    <div className="platform-toolbar" key={d.id}>
                      <span>
                        {d.type.replaceAll("_", " ")} ·{" "}
                        {Math.ceil(d.size / 1024)} KB
                      </span>
                      <button
                        className="platform-secondary"
                        onClick={async () => {
                          try {
                            const result = await api(
                              `/admin/applications/${selected.id}/documents/${d.id}`,
                            );
                            window.location.assign(result.signedUrl);
                          } catch (e) {
                            setError(e.message);
                          }
                        }}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
                <div className="platform-card">
                  <h2>Payment</h2>
                  <Badge value={selected.payment_status} />
                  {selected.payments.map((p) => (
                    <p key={p.id} className="mt-3 platform-muted">
                      {p.currency} {(p.amount / 100).toFixed(2)} · {p.status} ·{" "}
                      {p.transaction_reference || "No transaction reference"}
                    </p>
                  ))}
                </div>
                {options.length > 0 && (
                  <form className="platform-card" onSubmit={transition}>
                    <h2>Review decision</h2>
                    <label>
                      Move application to
                      <select
                        value={options.includes(target) ? target : ""}
                        required
                        onChange={(e) => setTarget(e.target.value)}
                      >
                        <option value="" disabled>
                          Choose a status
                        </option>
                        {options.map((o) => (
                          <option key={o} value={o}>
                            {labels[o]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Reason and next steps
                      <textarea
                        required
                        minLength={3}
                        maxLength={4000}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Explain the decision or specify the information needed."
                      />
                    </label>
                    <p className="platform-muted">
                      The applicant can see this reason. Decision and
                      information-request emails include it.
                    </p>
                    <button
                      className="platform-primary mt-4"
                      disabled={busy || !options.includes(target)}
                    >
                      Record decision
                    </button>
                  </form>
                )}
                <div className="platform-card">
                  <h2>Decision history</h2>
                  <History items={selected.history} />
                </div>
                <div className="platform-card">
                  <h2>Email delivery</h2>
                  {selected.emails.length ? (
                    selected.emails.map((e) => (
                      <div className="py-3 border-b" key={e.id}>
                        <strong>{e.subject}</strong>
                        <p className="platform-muted">
                          {e.status} · {e.attempts} attempts ·{" "}
                          {new Date(e.created_at).toLocaleString()}
                        </p>
                        {e.last_error && <p>{e.last_error}</p>}
                      </div>
                    ))
                  ) : (
                    <p>No notifications yet.</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="platform-kicker">Application management</p>
                <h1>Review queue</h1>
                <div className="platform-grid">
                  {Object.entries(counts).map(([key, value]) => (
                    <button
                      key={key}
                      className="platform-stat"
                      onClick={() => {
                        setStatus(key);
                        setPage(0);
                      }}
                    >
                      <strong>{value}</strong>
                      {labels[key]}
                    </button>
                  ))}
                </div>
                <div className="platform-toolbar mt-8">
                  <label className="flex-1">
                    Search by reference
                    <input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(0);
                      }}
                      placeholder="VS-…"
                    />
                  </label>
                  <label>
                    Status
                    <select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(0);
                      }}
                    >
                      <option value="">All statuses</option>
                      {Object.entries(labels)
                        .slice(0, 7)
                        .map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                    </select>
                  </label>
                  <button
                    className="platform-secondary"
                    disabled={busy}
                    onClick={() => setRefresh((x) => x + 1)}
                  >
                    Refresh
                  </button>
                </div>
                {busy && <p role="status">Loading applications…</p>}
                <div className="platform-card platform-scroll">
                  <table className="platform-table">
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Applicant</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((a) => (
                        <tr key={a.id}>
                          <td>
                            <button
                              className="underline"
                              onClick={() => open(a.id)}
                            >
                              {a.reference}
                            </button>
                          </td>
                          <td>
                            {a.answers.given_name} {a.answers.surname}
                          </td>
                          <td>
                            <Badge value={a.status} />
                          </td>
                          <td>
                            <Badge value={a.payment_status} />
                          </td>
                          <td>{new Date(a.updated_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!rows.length && !busy && (
                    <p className="p-5">No matching applications.</p>
                  )}
                </div>
                <div className="platform-actions">
                  <button
                    className="platform-secondary"
                    disabled={!page || busy}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                  <span className="p-3">
                    Page {page + 1} · {total} applications
                  </span>
                  <button
                    className="platform-secondary"
                    disabled={(page + 1) * 25 >= total || busy}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}
export default function Admin() {
  return (
    <Auth admin>
      <AdminPortal />
    </Auth>
  );
}
