/**
 * Analytics Tracker Service
 * Tracks unique visitors and sends data to Cloudflare Worker
 */

interface TrackingPayload {
  userAgent: string;
  referrer: string;
  path: string;
  screenWidth: number;
  screenHeight: number;
  source?: string;
}

class AnalyticsTracker {
  private workerUrl: string;
  private shouldTrack: boolean;
  private trackedPaths: Set<string> = new Set();

  constructor(workerUrl: string) {
    this.workerUrl = workerUrl;
    this.shouldTrack = !this.isDevelopment();
  }

  private isDevelopment(): boolean {
    return import.meta.env.DEV || import.meta.env.MODE === "development";
  }

  /**
   * Detect traffic source from URL params or referrer hostname.
   * Supports ?source=, ?utm_source=, or ?ref= query params.
   * Falls back to referrer hostname if available.
   */
  private getSource(): string | undefined {
    const params = new URLSearchParams(window.location.search);
    const source =
      params.get("source") || params.get("utm_source") || params.get("ref");
    if (source) return source;

    // Try to extract from referrer
    try {
      if (document.referrer) {
        const refHost = new URL(document.referrer).hostname.replace(
          "www.",
          ""
        );
        if (refHost && refHost !== window.location.hostname) return refHost;
      }
    } catch {
      // ignore
    }
    return undefined;
  }

  /**
   * Initialize tracker - call once on app startup.
   * Does NOT track a page view; App.tsx useEffect handles that.
   */
  async init(): Promise<void> {
    if (!this.shouldTrack) {
      console.debug("[Analytics] Development mode - tracking disabled");
    }
  }

  /**
   * Track a page view (deduplicated per session per path)
   */
  async trackPageView(path: string): Promise<void> {
    if (!this.shouldTrack) return;

    const resolved = path || window.location.pathname;

    // Client-side dedup: only track each path once per session
    if (this.trackedPaths.has(resolved)) {
      console.debug("[Analytics] Path already tracked this session:", resolved);
      return;
    }
    this.trackedPaths.add(resolved);

    const payload: TrackingPayload = {
      userAgent: navigator.userAgent,
      referrer: document.referrer || "direct",
      path: resolved,
      screenWidth: screen.width,
      screenHeight: screen.height,
      source: this.getSource(),
    };

    this.send(payload);
  }

  /**
   * Send tracking data to backend
   */
  private async send(payload: TrackingPayload): Promise<void> {
    try {
      const response = await fetch(`${this.workerUrl}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn("[Analytics] Tracking request failed:", response.status);
        return;
      }

      const data = await response.json();
      if (data.tracked) {
        console.debug("[Analytics] Visitor tracked successfully");
      } else if (data.duplicate) {
        console.debug("[Analytics] Visitor already tracked today");
      }
    } catch (error) {
      console.warn("[Analytics] Tracking error:", error);
      // Fail silently - don't disrupt user experience
    }
  }
}

// Export singleton instance
let trackerInstance: AnalyticsTracker | null = null;

export function initializeTracker(workerUrl: string): AnalyticsTracker {
  if (!trackerInstance) {
    trackerInstance = new AnalyticsTracker(workerUrl);
  }
  return trackerInstance;
}

export function getTracker(): AnalyticsTracker {
  if (!trackerInstance) {
    const defaultUrl = import.meta.env.VITE_WORKER_URL || "http://127.0.0.1:8787";
    trackerInstance = new AnalyticsTracker(defaultUrl);
  }
  return trackerInstance;
}

export type { TrackingPayload };
