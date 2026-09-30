import { formatDisplayPct } from "./format";
import { displayPercent } from "./model";
import type { UsagePreferences } from "./preferences";
import type { UsageReportEntry } from "./types";

/** One summary window of one account, as the sidebar Usage item shows it. */
export interface PinnedUsageWindow {
  key: string;
  icon: string | null;
  /** Source, account when it has one, and window: "Claude (work) 5-hour". */
  label: string;
  percentText: string;
}

function describe(entry: UsageReportEntry, windowLabel: string): string {
  const account = entry.account.label ? ` (${entry.account.label})` : "";
  return `${entry.sourceLabel}${account} ${windowLabel}`;
}

/** Pins replace defaults; without pins, summarize each account's first window with a percent. */
export function resolvePinnedUsage(
  reports: readonly UsageReportEntry[],
  preferences: UsagePreferences,
): PinnedUsageWindow[] {
  const selections =
    preferences.pinned.length === 0
      ? reports.map((entry) => ({
          entry,
          window: entry.report.windows.find(
            (window) => displayPercent(window, preferences.displayAs) !== null,
          ),
        }))
      : preferences.pinned.flatMap((pin) =>
          reports
            .filter((entry) => entry.sourceId === pin.sourceId)
            .map((entry) => ({
              entry,
              window: entry.report.windows.find((window) => window.id === pin.windowId),
            })),
        );
  return selections.flatMap(({ entry, window }) => {
    if (!window) return [];
    const percent = displayPercent(window, preferences.displayAs);
    if (percent === null) return [];
    return [
      {
        key: `${entry.id}/${window.id}`,
        icon: entry.icon ?? null,
        label: describe(entry, window.label),
        percentText: formatDisplayPct(percent, preferences.displayAs),
      },
    ];
  });
}
