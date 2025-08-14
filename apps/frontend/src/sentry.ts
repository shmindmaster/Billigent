import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE || "development",
  release: import.meta.env.VITE_APP_RELEASE || "local",
  tracesSampleRate: parseFloat(
    import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || "0.2"
  ),
  integrations: [
    Sentry.browserTracingIntegration({
      // Restrict propagation to our API calls (adjust host/port if backend differs)
      // NOTE: Previous version had an unterminated regex because the final pattern slash was escaped.
      // This version correctly terminates the regex literal.
      tracePropagationTargets: ["localhost", "localhost:3001/api"],
      // Example: scrub/normalize transaction names (replace hex-ish ids)
      beforeStartSpan: (ctx) => {
        return { ...ctx, name: ctx.name.replace(/\b[0-9a-f]{8,}\b/g, "<id>") };
      },
      shouldCreateSpanForRequest: (url) => !/\/health$|\/ready$/.test(url),
    }),
  ],
  replaysSessionSampleRate: 0, // disabled for now
  replaysOnErrorSampleRate: 0,
});
