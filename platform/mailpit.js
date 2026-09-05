// Local-only adapter for exercising the real outbox against Supabase's mail inbox.
// It never relays email to the internet.
export function mailpitFetcher(base, fetcher = fetch) {
  const url = new URL(base);
  if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname))
    throw new Error("Mailpit delivery is restricted to a loopback inbox.");
  return async (endpoint, options = {}) => {
    if (options.method === "POST") {
      const body = JSON.parse(options.body);
      const key = options.headers["Idempotency-Key"];
      const search = await fetcher(
        `${url.origin}/api/v1/search?query=${encodeURIComponent(`tag:${key}`)}`,
        { signal: options.signal },
      );
      if (!search.ok) return search;
      const existing = (await search.json()).messages?.[0];
      if (existing) return Response.json({ id: existing.ID });
      const address = /^(.*?)\s*<([^>]+)>$/.exec(body.from);
      const response = await fetcher(`${url.origin}/api/v1/send`, {
        method: "POST",
        signal: options.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          From: {
            Name: address?.[1]?.trim() || "Visa Seva",
            Email: address?.[2] || body.from,
          },
          To: body.to.map((Email) => ({ Email })),
          Subject: body.subject,
          Text: body.text,
          Tags: [key],
          Headers: { "Message-ID": `<${key}@visa-seva.test>` },
        }),
      });
      if (!response.ok) return response;
      return Response.json({ id: (await response.json()).ID });
    }
    const id = new URL(endpoint).pathname.split("/").pop();
    const response = await fetcher(
      `${url.origin}/api/v1/message/${encodeURIComponent(id)}`,
      { signal: options.signal },
    );
    return response.ok ? Response.json({ last_event: "delivered" }) : response;
  };
}
