"use client";

type GtagEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: GtagEventParams
    ) => void;
  }
}

export const analyticsEvents = {
  start: "diagnosis_start",
  answer: "diagnosis_answer",
  resultView: "diagnosis_result_view",
  saved: "diagnosis_saved",
  share: "diagnosis_share",
  ctaClick: "diagnosis_cta_click",
  restart: "diagnosis_restart",
} as const;

export function trackEvent(
  eventName: (typeof analyticsEvents)[keyof typeof analyticsEvents],
  params: GtagEventParams = {}
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, {
    event_category: "mac_shindan",
    ...params,
  });
}
