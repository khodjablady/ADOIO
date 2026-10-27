import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Pause, Play, Square, Gauge } from 'lucide-react';

const GLOBAL_SPEECH_EVENT = 'adoio-speech-synthesis-active';

export interface ArticleAudioReaderProps {
  sectionId: string;
  title: string;
  text: string | (() => string);
  buttonLabel?: string;
  className?: string;
}

/**
 * Splits long agronomic guide text into natural sentence chunks (< 220 chars)
 * so Web Speech API (especially Chromium browsers) never times out mid-article.
 */
function splitTextIntoChunks(rawText: string): string[] {
  const cleaned = rawText
    .replace(/\s+/g, ' ')
    .replace(/[•·]/g, ', ')
    .trim();

  if (!cleaned) return [];

  const sentences = cleaned.split(/(?<=[.!?…;:])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length <= 220) {
      current = (current + ' ' + sentence).trim();
    } else {
      if (current) chunks.push(current);
      if (sentence.length <= 220) {
        current = sentence.trim();
      } else {
        // Split very long clause by comma
        const subParts = sentence.split(/,\s*/);
        let subCurrent = '';
        for (const part of subParts) {
          if ((subCurrent + ', ' + part).trim().length <= 220) {
            subCurrent = subCurrent ? `${subCurrent}, ${part}` : part;
          } else {
            if (subCurrent) chunks.push(subCurrent.trim());
            subCurrent = part.trim();
          }
        }
        current = subCurrent;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function selectFrenchVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;
  const frVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('fr'));
  if (frVoices.length === 0) return null;

  // Prefer high-quality natural or standard fr-FR voices
  const preferred =
    frVoices.find(
      (v) =>
        v.lang.toLowerCase() === 'fr-fr' &&
        (v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('google') ||
          v.name.toLowerCase().includes('thomas') ||
          v.name.toLowerCase().includes('amelie') ||
          v.localService)
    ) ||
    frVoices.find((v) => v.lang.toLowerCase() === 'fr-fr') ||
    frVoices[0];

  return preferred;
}

export const ArticleAudioReader: React.FC<ArticleAudioReaderProps> = ({
  sectionId,
  title,
  text,
  buttonLabel = 'Écouter cet article',
  className = '',
}) => {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [rate, setRate] = useState<number>(1);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);
  const [totalChunks, setTotalChunks] = useState<number>(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef<number>(0);
  const isActiveInstanceRef = useRef<boolean>(false);
  const rateRef = useRef<number>(1);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available.length > 0) {
          setVoices(available);
        }
      } catch {
        // Ignore voice enumeration errors
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
    };
  }, []);

  const stopReading = useCallback((cancelGlobal = true) => {
    isActiveInstanceRef.current = false;
    chunksRef.current = [];
    chunkIndexRef.current = 0;
    setStatus('idle');
    setCurrentChunkIndex(0);
    setTotalChunks(0);

    if (cancelGlobal && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore cancel errors
      }
    }
  }, []);

  // Listen for another section starting playback so only one article plays at a time
  useEffect(() => {
    const handleGlobalSpeech = (event: Event) => {
      const customEvent = event as CustomEvent<{ sectionId: string }>;
      if (customEvent.detail?.sectionId !== sectionId && isActiveInstanceRef.current) {
        stopReading(false);
      }
    };

    window.addEventListener(GLOBAL_SPEECH_EVENT, handleGlobalSpeech);
    return () => {
      window.removeEventListener(GLOBAL_SPEECH_EVENT, handleGlobalSpeech);
      if (isActiveInstanceRef.current) {
        try {
          window.speechSynthesis?.cancel();
        } catch {
          // Ignore
        }
      }
    };
  }, [sectionId, stopReading]);

  const speakChunkAt = useCallback(
    (index: number) => {
      if (!isActiveInstanceRef.current) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      const chunks = chunksRef.current;
      if (index >= chunks.length) {
        stopReading(false);
        return;
      }

      chunkIndexRef.current = index;
      setCurrentChunkIndex(index + 1);

      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = 'fr-FR';
      utterance.rate = rateRef.current;
      utterance.pitch = 1;

      const chosenVoice = selectFrenchVoice(
        voices.length > 0 ? voices : window.speechSynthesis.getVoices()
      );
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.onend = () => {
        if (!isActiveInstanceRef.current) return;
        speakChunkAt(index + 1);
      };

      utterance.onerror = (event) => {
        // 'interrupted' or 'canceled' happens when switching speed or stopping
        if (event.error === 'interrupted' || event.error === 'canceled') {
          return;
        }
        if (isActiveInstanceRef.current && index + 1 < chunks.length) {
          speakChunkAt(index + 1);
        } else {
          stopReading(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [stopReading, voices]
  );

  const handleStart = () => {
    if (!isSupported) return;

    // Notify other ArticleAudioReader instances to reset
    window.dispatchEvent(
      new CustomEvent(GLOBAL_SPEECH_EVENT, { detail: { sectionId } })
    );

    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }

    const resolvedText = typeof text === 'function' ? text() : text;
    const fullNarration = `${title}. ${resolvedText}`;
    const preparedChunks = splitTextIntoChunks(fullNarration);

    if (preparedChunks.length === 0) return;

    chunksRef.current = preparedChunks;
    chunkIndexRef.current = 0;
    isActiveInstanceRef.current = true;
    setTotalChunks(preparedChunks.length);
    setCurrentChunkIndex(1);
    setStatus('playing');

    speakChunkAt(0);
  };

  const handlePauseResume = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (status === 'playing') {
      try {
        window.speechSynthesis.pause();
        setStatus('paused');
      } catch {
        // Fallback if pause not supported on mobile browser: stop
        stopReading(true);
      }
    } else if (status === 'paused') {
      try {
        window.speechSynthesis.resume();
        setStatus('playing');
      } catch {
        setStatus('playing');
        speakChunkAt(chunkIndexRef.current);
      }
    }
  };

  const handleCycleRate = () => {
    const nextRate = rate === 1 ? 1.25 : rate === 1.25 ? 0.9 : 1;
    setRate(nextRate);
    rateRef.current = nextRate;

    // If currently playing, restart current chunk immediately at the new speed
    if (status === 'playing' && isActiveInstanceRef.current) {
      try {
        window.speechSynthesis.cancel();
        speakChunkAt(chunkIndexRef.current);
      } catch {
        // Ignore
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div
      className={`no-print inline-flex flex-wrap items-center gap-1.5 ${className}`}
      role="region"
      aria-label={`Lecteur audio : ${title}`}
    >
      {status === 'idle' ? (
        <button
          type="button"
          onClick={handleStart}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#18230F] border border-[#8CBE5D]/60 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
          title={`Écouter la lecture vocale de : ${title}`}
          aria-label={`${buttonLabel} : ${title}`}
        >
          <Volume2 className="w-4 h-4 text-[#31491E] shrink-0" aria-hidden="true" />
          <span>{buttonLabel}</span>
        </button>
      ) : (
        <div className="inline-flex flex-wrap items-center gap-1.5 p-1 pl-3 rounded-2xl bg-[#18230F] text-[#FAF7F2] border border-[#8CBE5D]/50 shadow-sm">
          {/* Animated Sound Indicator & Progress */}
          <div className="flex items-center gap-2 pr-1.5">
            <span className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
              <span
                className={`w-0.5 bg-[#E6AB3C] rounded-full transition-all ${
                  status === 'playing' ? 'h-3.5 animate-pulse' : 'h-1.5 opacity-60'
                }`}
              />
              <span
                className={`w-0.5 bg-[#8CBE5D] rounded-full transition-all ${
                  status === 'playing' ? 'h-2.5 animate-pulse' : 'h-1.5 opacity-60'
                }`}
              />
              <span
                className={`w-0.5 bg-[#E6AB3C] rounded-full transition-all ${
                  status === 'playing' ? 'h-3 animate-pulse' : 'h-1.5 opacity-60'
                }`}
              />
            </span>
            <span className="text-[11px] font-bold text-[#E8F4D9] tabular-nums">
              {status === 'playing' ? 'Écoute' : 'En pause'}{' '}
              {totalChunks > 1 ? `(${currentChunkIndex}/${totalChunks})` : ''}
            </span>
          </div>

          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={handlePauseResume}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#31491E] hover:bg-[#436229] text-white text-[11px] font-bold transition-colors cursor-pointer"
            title={status === 'playing' ? 'Mettre la lecture en pause' : 'Reprendre la lecture vocale'}
            aria-label={status === 'playing' ? 'Mettre en pause' : 'Reprendre la lecture'}
          >
            {status === 'playing' ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
                <span>Reprendre</span>
              </>
            )}
          </button>

          {/* Playback Speed Button */}
          <button
            type="button"
            onClick={handleCycleRate}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] text-[11px] font-bold transition-colors cursor-pointer tabular-nums"
            title="Modifier la vitesse de lecture vocale"
            aria-label={`Vitesse de lecture : ${rate}x. Cliquer pour changer`}
          >
            <Gauge className="w-3 h-3 text-[#8CBE5D]" aria-hidden="true" />
            <span>{rate}x</span>
          </button>

          {/* Stop Button */}
          <button
            type="button"
            onClick={() => stopReading(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#AF4D24] hover:bg-[#933E1B] text-white text-[11px] font-bold transition-colors cursor-pointer"
            title="Arrêter la lecture vocale"
            aria-label="Arrêter la lecture"
          >
            <Square className="w-3 h-3 fill-current" aria-hidden="true" />
            <span>Arrêter</span>
          </button>
        </div>
      )}
    </div>
  );
};
