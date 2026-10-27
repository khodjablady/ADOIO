import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Scissors,
  Bug,
  Calendar,
  RotateCcw,
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  AlertCircle,
  Copy,
  Check,
  Sprout,
  ChevronRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  category?: 'taille' | 'maladies' | 'calendrier' | 'general';
}

interface PresetQuestion {
  id: string;
  category: 'taille' | 'maladies' | 'calendrier';
  categoryLabel: string;
  shortTitle: string;
  prompt: string;
}

const PRESET_QUESTIONS: PresetQuestion[] = [
  {
    id: 'taille-gobelet',
    category: 'taille',
    categoryLabel: 'Techniques de Taille',
    shortTitle: 'Taille en gobelet aéré (Chemlal & Azeradj)',
    prompt:
      "Quelles sont les étapes précises pour réussir la taille de fructification en gobelet aéré sur un olivier Chemlal ou Azeradj à Béjaïa, et à quelle période faut-il intervenir ?",
  },
  {
    id: 'taille-rajeunissement',
    category: 'taille',
    categoryLabel: 'Techniques de Taille',
    shortTitle: 'Rajeunir un vieil olivier de montagne',
    prompt:
      "Comment pratiquer une taille de régénération (rajeunissement) sur un vieil olivier centenaire négligé en zone montagneuse de Kabylie sans bloquer sa survie ?",
  },
  {
    id: 'maladie-mouche-paon',
    category: 'maladies',
    categoryLabel: 'Maladies & Lutte Bio',
    shortTitle: "Mouche de l'olive & Œil de paon en Bio",
    prompt:
      "Quel est le protocole biologique recommandé par l'ADOIO contre la mouche de l'olive (argile kaolinite, piégeage) et l'œil de paon dans la vallée de la Soummam ?",
  },
  {
    id: 'maladie-verticilliose-tuberculose',
    category: 'maladies',
    categoryLabel: 'Maladies & Lutte Bio',
    shortTitle: 'Verticilliose & Tuberculose (Gale)',
    prompt:
      "Comment différencier la verticilliose de la tuberculose de l'olivier sur mes arbres et quelles mesures prophylactiques urgentes appliquer au verger ?",
  },
  {
    id: 'calendrier-annuel',
    category: 'calendrier',
    categoryLabel: 'Calendrier Béjaïa',
    shortTitle: 'Programme annuel des travaux (12 mois)',
    prompt:
      "Peux-tu me donner le calendrier agronomique annuel mois par mois pour conduire une oliveraie dans la wilaya de Béjaïa (taille, fertilisation bio, irrigation, véraison et récolte) ?",
  },
  {
    id: 'calendrier-recolte',
    category: 'calendrier',
    categoryLabel: 'Calendrier Béjaïa',
    shortTitle: 'Indice de maturité & Récolte optimale',
    prompt:
      "Comment déterminer le moment optimal de récolte (véraison) pour les variétés Chemlal, Azeradj et Limli à Béjaïa afin d'obtenir une huile d'olive vierge extra riche en polyphénols ?",
  },
];

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-0',
  role: 'model',
  text: `Azul ! Bienvenue sur le **Chatbot Assistant Agronomique ADOIO Béjaïa**.\n\nJe suis à votre disposition pour répondre à vos questions techniques sur la conduite du verger oléicole en Kabylie :\n- **Techniques de taille** (*taille de fructification en gobelet aéré, éclaircie, rajeunissement des vieux oliviers, prophylaxie des coupes*)\n- **Maladies & ravageurs de l'olivier** (*mouche de l'olive, œil de paon, verticilliose, psylle, tuberculose et traitements biologiques*)\n- **Calendrier agronomique local de Béjaïa** (*travaux saisonniers sur les 52 communes, fertilisation organique, arrosage d'appoint et période optimale de récolte*)\n\nSélectionnez une question fréquente ci-dessous ou posez directement votre question sur votre oliveraie.`,
  timestamp: 'Conseiller ADOIO',
  category: 'general',
};

/**
 * Lightweight formatter turning markdown bold & bullet lists into clean React nodes
 */
function renderFormattedText(content: string) {
  const lines = content.split('\n');
  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={idx} className="h-1" />;
        }

        const isHeading = line.startsWith('### ') || line.startsWith('## ');
        const isBullet = line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ');
        const cleanLine = isHeading
          ? line.replace(/^#{2,3}\s+/, '')
          : isBullet
          ? line.replace(/^[-*•]\s+/, '')
          : line;

        // Parse **bold** and *italic*
        const parts = cleanLine.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        const formattedParts = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-[#18230F]">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return (
              <em key={pIdx} className="italic text-[#31491E]">
                {part.slice(1, -1)}
              </em>
            );
          }
          return <React.Fragment key={pIdx}>{part}</React.Fragment>;
        });

        if (isHeading) {
          return (
            <h4
              key={idx}
              className="font-serif font-bold text-sm sm:text-base text-[#18230F] pt-1.5 border-b border-[#E6DEC9]/60 pb-1"
            >
              {formattedParts}
            </h4>
          );
        }

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E6AB3C] shrink-0 mt-2" />
              <span className="flex-1">{formattedParts}</span>
            </div>
          );
        }

        return <p key={idx}>{formattedParts}</p>;
      })}
    </div>
  );
}

export const AdoioAssistantChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'taille' | 'maladies' | 'calendrier'>('all');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [isFloatingOpen, setIsFloatingOpen] = useState<boolean>(false);
  const [isFloatingExpanded, setIsFloatingExpanded] = useState<boolean>(false);

  const sectionChatContainerRef = useRef<HTMLDivElement>(null);
  const floatingChatContainerRef = useRef<HTMLDivElement>(null);

  const scrollChatToBottom = () => {
    if (sectionChatContainerRef.current) {
      sectionChatContainerRef.current.scrollTop = sectionChatContainerRef.current.scrollHeight;
    }
    if (floatingChatContainerRef.current) {
      floatingChatContainerRef.current.scrollTop = floatingChatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [messages, isLoading, isFloatingOpen]);

  useEffect(() => {
    if (!isFloatingOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFloatingOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFloatingOpen]);

  const sendMessage = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg(null);
    const nowTime = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: nowTime,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    const botMsgId = `model-${Date.now()}`;
    const replyTime = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    try {
      const historyPayload = nextMessages
        .filter((m) => m.id !== 'welcome-0')
        .slice(0, -1)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          stream: true,
        }),
      });

      const contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.error || "Impossible de joindre l'assistant agronomique ADOIO pour le moment."
        );
      }

      if (contentType.includes('text/event-stream') && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulated = '';
        let messageAdded = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          for (const evt of events) {
            const line = evt.trim();
            if (!line.startsWith('data:')) continue;
            const jsonStr = line.replace(/^data:\s*/, '');
            try {
              const parsed = JSON.parse(jsonStr) as {
                chunk?: string;
                error?: string;
                done?: boolean;
              };
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.chunk) {
                accumulated += parsed.chunk;
                if (!messageAdded) {
                  messageAdded = true;
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: botMsgId,
                      role: 'model',
                      text: accumulated,
                      timestamp: replyTime,
                    },
                  ]);
                } else {
                  const currentText = accumulated;
                  setMessages((prev) =>
                    prev.map((m) => (m.id === botMsgId ? { ...m, text: currentText } : m))
                  );
                }
              }
            } catch (parseErr) {
              if (parseErr instanceof Error && parseErr.message !== 'Unexpected end of JSON input') {
                throw parseErr;
              }
            }
          }
        }
      } else {
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            role: 'model',
            text: data.reply,
            timestamp: replyTime,
          },
        ]);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la consultation de l'assistant Gemini.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleResetChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setErrorMsg(null);
    setInput('');
  };

  const handleCopyMessage = async (msg: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopiedMsgId(msg.id);
      setTimeout(() => setCopiedMsgId(null), 2200);
    } catch {
      setCopiedMsgId(msg.id);
      setTimeout(() => setCopiedMsgId(null), 2000);
    }
  };

  const filteredPresets =
    activeFilter === 'all'
      ? PRESET_QUESTIONS
      : PRESET_QUESTIONS.filter((q) => q.category === activeFilter);

  return (
    <>
      {/* =====================================================================
          1. EMBEDDED SECTION IN SILO 4 ("Outils & Bonnes Pratiques")
          ===================================================================== */}
      <section
        id="assistant-adoio"
        className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E6DEC9] scroll-mt-44"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
                <Bot className="w-4 h-4 text-[#31491E]" />
                <span>Conseiller Technique Intelligent · ADOIO Béjaïa</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight text-balance">
                Chatbot Assistant Agronomique ADOIO
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#436229] leading-relaxed">
                Posez vos questions techniques sur la <strong>taille de l'olivier</strong> (formation en gobelet, rajeunissement), l'identification et le <strong>traitement bio des maladies</strong> (mouche de l'olive, œil de paon, verticilliose, psylle) et le <strong>calendrier agronomique des 52 communes de Béjaïa</strong>.
              </p>
            </div>

            {/* Category filter tabs */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {[
                { id: 'all', label: 'Tous les sujets', icon: Sparkles },
                { id: 'taille', label: 'Taille', icon: Scissors },
                { id: 'maladies', label: 'Maladies & Bio', icon: Bug },
                { id: 'calendrier', label: 'Calendrier Béjaïa', icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#233416] text-[#FAF7F2] border-[#233416] shadow-xs'
                        : 'bg-white text-[#233416] border-[#E6DEC9] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E6AB3C]' : 'text-[#567B34]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Grid: Left Frequent Agronomic Prompts + Right Interactive Chat Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Frequent Questions & Local Agronomic Context (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E6DEC9] pb-3">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-[#567B34]" />
                    <h3 className="font-serif text-lg font-bold text-[#18230F]">
                      Questions Fréquentes des Oléiculteurs
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#567B34] bg-[#E8F4D9] px-2 py-0.5 rounded">
                    {filteredPresets.length} sujets
                  </span>
                </div>

                <p className="text-xs text-[#4A5543]">
                  Cliquez sur une question type pour interroger immédiatement l'assistant ADOIO :
                </p>

                <div className="space-y-2.5">
                  {filteredPresets.map((item) => {
                    const CategoryIcon =
                      item.category === 'taille'
                        ? Scissors
                        : item.category === 'maladies'
                        ? Bug
                        : Calendar;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={isLoading}
                        onClick={() => sendMessage(item.prompt)}
                        className="w-full text-left p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#E8F4D9]/60 border border-[#E6DEC9] hover:border-[#8CBE5D] transition-all group cursor-pointer disabled:opacity-60"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#567B34]">
                            <CategoryIcon className="w-3 h-3 text-[#E6AB3C]" />
                            {item.categoryLabel}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#567B34] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-[#18230F] group-hover:text-[#233416]">
                          {item.shortTitle}
                        </p>
                        <p className="text-[11px] text-[#4A5543] line-clamp-2 mt-1">
                          {item.prompt}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical scope card */}
              <div className="bg-[#F4EEE1] rounded-2xl border border-[#E6DEC9] p-5 space-y-2.5 text-xs text-[#233416]">
                <div className="font-bold text-[#18230F] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E6AB3C]" />
                  <span>Base de connaissances adaptée au terroir kabyle</span>
                </div>
                <p className="text-[#4A5543] leading-relaxed">
                  Les recommandations tiennent compte des spécificités pédoclimatiques de la Wilaya de Béjaïa (vergers de montagne du Djurdjura, pentes des Babor et plaine de la Soummam) et des cultivars autochtones (<strong>Chemlal</strong>, <strong>Azeradj</strong>, <strong>Limli</strong>, <strong>Takesrit</strong>, <strong>Bouchouk</strong>).
                </p>
              </div>
            </div>

            {/* Right Column: Chat Interface (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6DEC9] shadow-sm overflow-hidden flex flex-col h-[620px]">
              {/* Console Top Bar */}
              <div className="bg-[#233416] text-[#FAF7F2] px-6 py-4 flex items-center justify-between border-b border-[#31491E]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#31491E] border border-[#8CBE5D]/40 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-[#E6AB3C]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-base text-[#FAF7F2]">
                        Assistant Agronomique ADOIO
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#31491E] text-[#B0D984] px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8CBE5D] animate-pulse" />
                        En ligne
                      </span>
                    </div>
                    <p className="text-[11px] text-[#E8F4D9]/80">
                      Taille de l'olivier · Diagnostic & Soins Bio · Calendrier de Béjaïa
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Réinitialiser la conversation"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#E6AB3C]" />
                  <span className="hidden sm:inline">Nouvelle discussion</span>
                </button>
              </div>

              {/* Messages Scroll Area */}
              <div
                ref={sectionChatContainerRef}
                className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#FAF7F2]/60"
              >
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 shadow-2xs ${
                          isUser
                            ? 'bg-[#31491E] text-[#FAF7F2] rounded-br-xs'
                            : 'bg-white text-[#242A20] border border-[#E6DEC9] rounded-bl-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-1.5 text-[10px] opacity-80">
                          <span className="font-bold uppercase tracking-wider">
                            {isUser ? 'Oléiculteur / Visiteur' : 'Expert Agronome ADOIO'}
                          </span>
                          <div className="flex items-center gap-2">
                            <span>{msg.timestamp}</span>
                            {!isUser && (
                              <button
                                type="button"
                                onClick={() => handleCopyMessage(msg)}
                                className="inline-flex items-center gap-1 text-[#567B34] hover:text-[#18230F] font-semibold cursor-pointer"
                                title="Copier cette réponse"
                              >
                                {copiedMsgId === msg.id ? (
                                  <Check className="w-3 h-3 text-[#25D366]" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {isUser ? (
                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        ) : (
                          renderFormattedText(msg.text)
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#E6DEC9] rounded-2xl rounded-bl-xs p-4 shadow-2xs flex items-center gap-3 text-xs text-[#31491E]">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#567B34] animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-[#8CBE5D] animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-[#E6AB3C] animate-bounce [animation-delay:300ms]" />
                      </div>
                      <span className="font-medium">
                        Analyse agronomique en cours pour votre oliveraie...
                      </span>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold">Erreur de connexion avec l'assistant</p>
                      <p className="mt-0.5">{errorMsg}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleFormSubmit}
                className="p-4 bg-white border-t border-[#E6DEC9] flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question (ex: Quand tailler la variété Chemlal à Seddouk ? Comment traiter l'œil de paon ?)"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs sm:text-sm text-[#18230F] placeholder:text-[#4A5543]/70 focus:outline-none focus:border-[#567B34]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-3 rounded-xl bg-[#31491E] hover:bg-[#233416] disabled:opacity-50 text-[#FAF7F2] text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4 text-[#E6AB3C]" />
                  <span className="hidden sm:inline">Envoyer</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FLOATING ASSISTANT WIDGET (Accessible from any section)
          ===================================================================== */}
      <div className="fixed bottom-5 left-5 z-40 no-print">
        {!isFloatingOpen ? (
          <button
            type="button"
            onClick={() => setIsFloatingOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#233416] hover:bg-[#31491E] text-[#FAF7F2] text-xs font-bold shadow-xl border border-[#8CBE5D]/50 transition-all hover:scale-[1.02] cursor-pointer"
            aria-label="Ouvrir le Chatbot Assistant Agronomique ADOIO"
            title="Poser une question à l'Assistant Agronomique ADOIO (Taille, Maladies, Calendrier)"
          >
            <div className="w-7 h-7 rounded-xl bg-[#31491E] border border-[#E6AB3C]/40 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#E6AB3C]" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold leading-none">Assistant ADOIO</span>
              <span className="block text-[10px] text-[#B0D984] font-medium mt-0.5">
                Taille · Maladies · Calendrier
              </span>
            </div>
          </button>
        ) : (
          <div
            className={`bg-white rounded-3xl border border-[#E6DEC9] shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
              isFloatingExpanded
                ? 'w-[92vw] sm:w-[540px] h-[78vh] max-h-[680px]'
                : 'w-[90vw] sm:w-[390px] h-[510px]'
            }`}
          >
            {/* Floating Header */}
            <div className="bg-[#233416] text-[#FAF7F2] px-4 py-3 flex items-center justify-between border-b border-[#31491E]">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-[#E6AB3C] shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#FAF7F2] leading-tight">
                    Assistant ADOIO Béjaïa
                  </h4>
                  <p className="text-[10px] text-[#B0D984]">
                    Conseiller taille, maladies & calendrier
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsFloatingExpanded((prev) => !prev)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#FAF7F2] transition-colors cursor-pointer"
                  aria-label={isFloatingExpanded ? 'Réduire la fenêtre' : 'Agrandir la fenêtre'}
                  title={isFloatingExpanded ? 'Réduire' : 'Agrandir'}
                >
                  {isFloatingExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFloatingOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#FAF7F2] transition-colors cursor-pointer"
                  aria-label="Fermer l'assistant"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick chip bar inside floating drawer */}
            <div className="px-3 py-2 bg-[#F4EEE1] border-b border-[#E6DEC9] flex items-center gap-1.5 overflow-x-auto">
              {PRESET_QUESTIONS.slice(0, 4).map((q) => (
                <button
                  key={q.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => sendMessage(q.prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] text-[11px] font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                >
                  {q.shortTitle}
                </button>
              ))}
            </div>

            {/* Floating Messages */}
            <div
              ref={floatingChatContainerRef}
              className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#FAF7F2]/60"
            >
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 text-xs ${
                        isUser
                          ? 'bg-[#31491E] text-[#FAF7F2]'
                          : 'bg-white text-[#242A20] border border-[#E6DEC9]'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        renderFormattedText(msg.text)
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="text-xs text-[#31491E] bg-white border border-[#E6DEC9] rounded-xl p-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E6AB3C] animate-ping" />
                  <span>Réponse de l'agronome ADOIO en cours...</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-[11px]">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Floating Input */}
            <form
              onSubmit={handleFormSubmit}
              className="p-2.5 bg-white border-t border-[#E6DEC9] flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Votre question (taille, maladies, calendrier)..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs text-[#18230F] focus:outline-none focus:border-[#567B34]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-xl bg-[#31491E] hover:bg-[#233416] disabled:opacity-50 text-[#FAF7F2] cursor-pointer"
                aria-label="Envoyer"
              >
                <Send className="w-4 h-4 text-[#E6AB3C]" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
