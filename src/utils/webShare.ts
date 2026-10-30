export interface SharePayload {
  title: string;
  text: string;
  url: string;
}

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

/**
 * Checks whether the browser supports the native Web Share API (`navigator.share`).
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Shares an agronomical finding, landscape terroir, or olive mill using the browser's
 * native Web Share API (`navigator.share`).
 *
 * Gracefully falls back to copying the direct URL via `navigator.clipboard.writeText`
 * when Web Share API is unsupported or rejected for non-cancellation reasons.
 */
export async function shareFinding(payload: SharePayload): Promise<ShareOutcome> {
  const { title, text, url } = payload;

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    const shareData: ShareData = { title, text, url };

    let canUseNativeShare = true;
    if (typeof navigator.canShare === 'function') {
      try {
        canUseNativeShare = navigator.canShare(shareData);
      } catch {
        canUseNativeShare = true;
      }
    }

    if (canUseNativeShare) {
      try {
        await navigator.share(shareData);
        return 'shared';
      } catch (error: unknown) {
        if (
          error &&
          typeof error === 'object' &&
          'name' in error &&
          (error as { name?: string }).name === 'AbortError'
        ) {
          return 'cancelled';
        }
        // Fall through to clipboard fallback if native share failed for other reasons
      }
    }
  }

  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(url || `${title} — ${text}`);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
