import { describe, it, expect, vi, afterEach } from 'vitest';
import { shareFinding, isWebShareSupported, SharePayload } from '../utils/webShare';

describe('Web Share API utility (webShare.ts)', () => {
  const samplePayload: SharePayload = {
    title: 'Huilerie Moderne Numidia — Akbou (Béjaïa)',
    text: 'Unité de trituration moderne 2 phases à Akbou, capacité 250 qx/jour.',
    url: 'https://adoio-bejaia.dz/?mill=mill-akbou-numidia#annuaire',
  };

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('detects when navigator.share is supported or unsupported', () => {
    vi.stubGlobal('navigator', {
      share: vi.fn(),
    });
    expect(isWebShareSupported()).toBe(true);

    vi.stubGlobal('navigator', {});
    expect(isWebShareSupported()).toBe(false);
  });

  it('uses navigator.share when available and returns "shared"', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    const canShareMock = vi.fn().mockReturnValue(true);

    vi.stubGlobal('navigator', {
      share: shareMock,
      canShare: canShareMock,
    });

    const outcome = await shareFinding(samplePayload);
    expect(outcome).toBe('shared');
    expect(canShareMock).toHaveBeenCalledWith(samplePayload);
    expect(shareMock).toHaveBeenCalledWith(samplePayload);
  });

  it('returns "cancelled" without writing to clipboard when user aborts native share sheet', async () => {
    const abortError = new Error('Share canceled');
    abortError.name = 'AbortError';

    const shareMock = vi.fn().mockRejectedValue(abortError);
    const writeTextMock = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal('navigator', {
      share: shareMock,
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const outcome = await shareFinding(samplePayload);
    expect(outcome).toBe('cancelled');
    expect(writeTextMock).not.toHaveBeenCalled();
  });

  it('falls back to navigator.clipboard.writeText when navigator.share is unavailable', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const outcome = await shareFinding(samplePayload);
    expect(outcome).toBe('copied');
    expect(writeTextMock).toHaveBeenCalledWith(samplePayload.url);
  });

  it('falls back to clipboard when navigator.share throws a non-AbortError', async () => {
    const shareMock = vi.fn().mockRejectedValue(new Error('NotAllowedError'));
    const writeTextMock = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal('navigator', {
      share: shareMock,
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const outcome = await shareFinding(samplePayload);
    expect(outcome).toBe('copied');
    expect(writeTextMock).toHaveBeenCalledWith(samplePayload.url);
  });
});
