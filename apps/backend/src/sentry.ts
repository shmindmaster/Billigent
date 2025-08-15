import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Initialize Sentry as early as possible
export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.warn("Sentry DSN not set - skipping instrumentation");
    return;
  }
  Sentry.init({
    dsn,
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.2"),
    profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || "0.1"),
    environment: process.env.NODE_ENV || "development",
    release: process.env.APP_RELEASE || "local",
    integrations: [
      nodeProfilingIntegration(),
      // Removed Prisma integration after migration
      // (previous Sentry.prismaIntegration() call deleted)
    ],
    beforeSend(event) {
      // Placeholder for future PII scrubbing if needed
      return event;
    }
  });
}

export { Sentry };
