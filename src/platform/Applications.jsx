import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { api, supabase, selectedFiles } from "./client";
import Auth from "./Auth";
import { useStore } from "../store";
import { getSteps } from "../domain/applicationForm";
export const labels = {
  draft: "Draft",
  awaiting_payment: "Awaiting payment",
  submitted: "Submitted",
  under_review: "Under review",
  waiting_for_information: "Waiting for information",
  accepted: "Accepted",
  rejected: "Rejected",
  unpaid: "Unpaid",
  paid: "Paid",
  pending: "Pending",
  processing: "Processing",
  failed: "Failed",
  cancelled: "Cancelled",
};
export const Badge = ({ value }) => (
  <span className={`platform-badge ${value}`}>{labels[value] || value}</span>
);
export async function signOut() {
  selectedFiles.clear();
  sessionStorage.removeItem("bharat-visa-session-draft-v3");
  await supabase.auth.signOut();
  window.location.assign("/");
}
export function Details({ application }) {
  const fields = getSteps(
    application.answers.application_type,
    application.answers,
  )
    .flatMap((s) => s.fields || [])
    .filter((f) => !f.visible || f.visible(application.answers));
  return (
    <dl className="platform-details">
      {fields.map((f) => (
        <div key={f.name}>
          <dt>{f.label}</dt>
          <dd>
            {typeof application.answers[f.name] === "boolean"
              ? application.answers[f.name]
                ? "Yes"
                : "No"
              : String(application.answers[f.name] || "Not provided")}
          </dd>
        </div>
      ))}
    </dl>
  );
}
export function History({ items }) {
  return (
    <ol className="platform-history">
      {items.map((h) => (
        <li key={h.id}>
          <strong>{labels[h.to_status]}</strong>
          <p>{h.reason}</p>
          <time dateTime={h.created_at}>
            {new Date(h.created_at).toLocaleString()}
          </time>
        </li>
      ))}
    </ol>
  );
}
function ApplicationList() {
  const { startNewApplication } = useStore();
  const [result, setResult] = useState(null),
    [error, setError] = useState(""),
    [page, setPage] = useState(0),
    [refresh, setRefresh] = useState(0),
    [loading, setLoading] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api(`/applications?page=${page}`)
      .then((x) => active && setResult(x))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [page, refresh]);
  return (
    <div className="platform-page">
      <div className="platform-toolbar">
        <div>
          <p className="platform-kicker">Your applications</p>
          <h1>My applications</h1>
        </div>
        <button className="platform-secondary" onClick={signOut}>
          Close secure access
        </button>
      </div>
      <div className="platform-actions">
        <Link
          className="platform-primary"
          to="/guide/visa-finder"
          onClick={() => {
            selectedFiles.clear();
            startNewApplication();
          }}
        >
          Start an application
        </Link>
        <Link className="platform-secondary" to="/assistants">
          Connected assistants
        </Link>
      </div>
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
      {!result && !error && <p role="status">Loading applications…</p>}
      {result?.applications.length === 0 && (
        <div className="platform-card">
          <h2>Ready when you are</h2>
          <p>Start with the Visa Finder to choose your application route.</p>
        </div>
      )}
      {result?.applications.map((a) => (
        <Link
          key={a.id}
          to={`/applications/${a.id}`}
          className="platform-card block"
        >
          <div className="platform-toolbar">
            <strong>{a.reference}</strong>
            <Badge value={a.status} />
          </div>
          <p>
            {[a.answers.given_name, a.answers.surname]
              .filter(Boolean)
              .join(" ") || "Untitled application"}
          </p>
          <p className="platform-muted">
            {a.answers.visa_category} · Updated{" "}
            {new Date(a.updated_at).toLocaleDateString()}
          </p>
        </Link>
      ))}
      {result && (
        <div className="platform-actions">
          <button
            disabled={loading || !page}
            className="platform-secondary"
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <button
            disabled={loading || (page + 1) * 25 >= result.count}
            className="platform-secondary"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
export default function Applications() {
  return (
    <Auth>
      <ApplicationList />
    </Auth>
  );
}
function ApplicationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateState } = useStore();
  const [app, setApp] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [confirmed, setConfirmed] = useState(false),
    [validation, setValidation] = useState(null);
  const load = useCallback(async () => {
    const a = await api(`/applications/${id}`);
    setApp(a);
    return a;
  }, [id]);
  useEffect(() => {
    setApp(null);
    setError("");
    setConfirmed(false);
    setValidation(null);
    load().catch((e) => setError(e.message));
  }, [load]);
  async function action(fn) {
    setError("");
    setBusy(true);
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e.message);
      if (e.details) setValidation(e.details);
    } finally {
      setBusy(false);
    }
  }
  async function edit() {
    let a = app;
    if (a.status === "awaiting_payment")
      a = await api(`/applications/${id}/reopen`, { method: "POST" });
    selectedFiles.clear();
    updateState({
      data: a.answers,
      type: a.answers.application_type,
      step: 0,
      furthestStep: getSteps(a.answers.application_type, a.answers).length - 1,
      submitted: false,
      cloud: { id: a.id, version: a.version },
      docs: app.documents.map((d) => ({
        type: d.type,
        mimeType: d.mime_type,
        size: d.size,
        status: "uploaded",
        cloudId: d.id,
      })),
      identifiers: { temporaryDemoId: a.draft_key, finalDemoId: null },
    });
    navigate("/apply");
  }
  async function checkout() {
    const p = await api(`/applications/${id}/checkout`, {
      method: "POST",
      body: { version: app.version, request_key: crypto.randomUUID() },
    });
    navigate(`/applications/${id}/checkout?session=${p.id}`);
  }
  if (!app)
    return (
      <div className="platform-page">
        <Link to="/applications">← My applications</Link>
        <p role={error ? "alert" : "status"}>
          {error || "Opening application…"}
        </p>
        {error && (
          <button
            className="platform-secondary mt-4"
            onClick={() => {
              setError("");
              load().catch((e) => setError(e.message));
            }}
          >
            Try again
          </button>
        )}
      </div>
    );
  const editable = [
    "draft",
    "waiting_for_information",
    "awaiting_payment",
  ].includes(app.status);
  const currentConfirmation =
    app.confirmed_version === app.version &&
    Date.parse(app.confirmed_at) > Date.now() - 86400000;
  return (
    <div className="platform-page">
      <Link className="platform-link" to="/applications">
        ← My applications
      </Link>
      <div className="platform-toolbar">
        <div>
          <p className="platform-kicker mt-6">{app.reference}</p>
          <h1>Your application</h1>
        </div>
        <Badge value={app.status} />
      </div>
      <div className="platform-card">
        <div className="platform-toolbar">
          <h2>Payment</h2>
          <Badge value={app.payment_status} />
        </div>
        {app.payment_status === "paid" ? (
          <p>
            Payment received.{" "}
            {editable ? "You can submit once your details are confirmed." : ""}
          </p>
        ) : (
          <p>Review your details before continuing to checkout.</p>
        )}
      </div>
      {app.status === "waiting_for_information" && (
        <div className="platform-alert">
          <strong>Additional information needed</strong>
          <p>
            {
              [...app.history]
                .reverse()
                .find((h) => h.to_status === "waiting_for_information")?.reason
            }
          </p>
        </div>
      )}
      {error && (
        <p role="alert" className="platform-alert">
          {error}
        </p>
      )}
      {validation && !validation.complete && (
        <ul className="platform-alert list-disc pl-8">
          {Object.entries(validation.errors).map(([key, value]) => (
            <li key={key}>
              {key.replaceAll("_", " ")}: {value}
            </li>
          ))}
        </ul>
      )}
      <section className="platform-card">
        <h2>Applicant details</h2>
        <Details application={app} />
      </section>
      <section className="platform-card">
        <h2>Documents</h2>
        {app.documents.length ? (
          app.documents.map((d) => (
            <div className="platform-toolbar" key={d.id}>
              <span>{d.type.replaceAll("_", " ")}</span>
              <button
                className="platform-secondary"
                disabled={busy}
                onClick={() =>
                  action(async () => {
                    const r = await api(
                      `/applications/${id}/documents/${d.id}`,
                    );
                    window.location.assign(r.signedUrl);
                  })
                }
              >
                Download
              </button>
            </div>
          ))
        ) : (
          <p>No documents uploaded.</p>
        )}
      </section>
      {editable && (
        <section className="platform-card">
          <h2>Review and continue</h2>
          <p>Check all answers and documents before confirming.</p>
          <label>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mr-2"
            />
            I have reviewed these details and authorize submission of this
            application.
          </label>
          <div className="platform-actions">
            <button
              className="platform-secondary"
              disabled={busy}
              onClick={() => action(edit)}
            >
              Edit application
            </button>
            <button
              className="platform-secondary"
              disabled={busy}
              onClick={() =>
                action(async () =>
                  setValidation(
                    await api(`/applications/${id}/validate`, {
                      method: "POST",
                    }),
                  ),
                )
              }
            >
              Check completeness
            </button>
            {!currentConfirmation && (
              <button
                className="platform-primary"
                disabled={busy || !confirmed}
                onClick={() =>
                  action(async () => {
                    await api(`/applications/${id}/confirm`, {
                      method: "POST",
                      body: { version: app.version },
                    });
                    setConfirmed(false);
                  })
                }
              >
                Confirm details
              </button>
            )}
            {currentConfirmation && app.payment_status !== "paid" && (
              <button
                className="platform-primary"
                disabled={busy}
                onClick={() => action(checkout)}
              >
                Continue to checkout
              </button>
            )}
            {currentConfirmation && app.payment_status === "paid" && (
              <button
                className="platform-primary"
                disabled={busy}
                onClick={() =>
                  action(async () =>
                    api(`/applications/${id}/submit`, {
                      method: "POST",
                      body: { version: app.version },
                    }),
                  )
                }
              >
                Submit application
              </button>
            )}
          </div>
        </section>
      )}
      {app.history.length > 0 && (
        <section className="platform-card">
          <h2>Application history</h2>
          <History items={app.history} />
        </section>
      )}
    </div>
  );
}
export function ApplicationDetail() {
  return (
    <Auth>
      <ApplicationView />
    </Auth>
  );
}
function CheckoutView() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const paymentId = params.get("session");
  const [app, setApp] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [outcome, setOutcome] = useState("paid");
  const load = useCallback(async () => {
    const a = await api(`/applications/${id}`);
    setApp(a);
    return a;
  }, [id]);
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);
  async function pay(result) {
    setBusy(true);
    setError("");
    try {
      await api(`/applications/${id}/payments/${paymentId}`, {
        method: "POST",
        body: { outcome: "processing" },
      });
      await load();
      await new Promise((r) => setTimeout(r, 1000));
      await api(`/applications/${id}/payments/${paymentId}`, {
        method: "POST",
        body: { outcome: result },
      });
      await load();
    } catch (e) {
      setError(e.message);
      await load().catch(() => {});
    } finally {
      setBusy(false);
    }
  }
  const payment = app?.payments.find((p) => p.id === paymentId);
  return (
    <div className="platform-page">
      <div className="platform-checkout">
        <Link to={`/applications/${id}`} className="platform-link">
          ← Back to application
        </Link>
        <div className="platform-card">
          <p className="platform-kicker">Secure checkout · Sandbox</p>
          <h1>
            {payment?.status === "paid"
              ? "Payment successful"
              : "Complete payment"}
          </h1>
          {error && (
            <p role="alert" className="platform-alert">
              {error}
            </p>
          )}
          {!app && !error && <p role="status">Opening checkout…</p>}
          {app && !payment && (
            <p role="alert">
              Checkout session not found. Return to your application.
            </p>
          )}
          {payment && (
            <>
              <p className="platform-muted">{app.reference}</p>
              <p className="text-3xl my-6 font-serif">
                {new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: payment.currency,
                }).format(payment.amount / 100)}
              </p>
              <div className="flex gap-3 my-5">
                <span className="platform-badge">VISA</span>
                <span className="platform-badge">Mastercard</span>
              </div>
              <p className="platform-muted">
                No money is charged. No card details are needed.
              </p>
              <div className="my-5">
                <Badge value={payment.status} />
              </div>
              {busy && (
                <div role="status">
                  <div className="platform-spinner" />
                  Processing payment…
                </div>
              )}
              {!busy && ["pending", "processing"].includes(payment.status) && (
                <>
                  {payment.status === "processing" && (
                    <p className="platform-alert">
                      Payment was interrupted. Continue with this session to
                      avoid starting another payment.
                    </p>
                  )}
                  <label>
                    Test payment result
                    <select
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                    >
                      <option value="paid">Successful</option>
                      <option value="failed">Declined</option>
                      <option value="pending">Pending</option>
                    </select>
                  </label>
                  <div className="platform-actions">
                    <button
                      className="platform-primary"
                      onClick={() => pay(outcome)}
                    >
                      Authorize payment
                    </button>
                    <button
                      className="platform-secondary"
                      onClick={() => pay("cancelled")}
                    >
                      Cancel payment
                    </button>
                  </div>
                </>
              )}
              {payment.status === "paid" && (
                <p>
                  Your payment is recorded. Return to your application to submit
                  it.
                </p>
              )}
              {["failed", "cancelled"].includes(payment.status) && (
                <p>
                  {payment.status === "failed"
                    ? "The payment was declined."
                    : "Payment was cancelled."}{" "}
                  Your application is saved. Return to it to retry checkout.
                </p>
              )}
              <Link
                className="platform-secondary mt-6"
                to={`/applications/${id}`}
              >
                {payment.status === "paid"
                  ? "Continue to submission"
                  : "Return to application"}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export function Checkout() {
  return (
    <Auth>
      <CheckoutView />
    </Auth>
  );
}
