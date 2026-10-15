import React from 'react';
import { ADOIO_INFO } from '../data/bejaiaOliveData';
import { Jubile25Logo } from './Jubile25Logo';
import { 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  TrendingUp, 
  Cpu, 
  Leaf, 
  FileText, 
  Users, 
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface AdoioSectionProps {
  onOpenAdhesion: () => void;
}

export const AdoioSection: React.FC<AdoioSectionProps> = ({ onOpenAdhesion }) => {
  const iconMap: Record<string, React.ReactNode> = {
    TrendingUp: <TrendingUp className="w-6 h-6 text-[#E6AB3C]" />,
    Award: <Award className="w-6 h-6 text-[#E6AB3C]" />,
    Cpu: <Cpu className="w-6 h-6 text-[#E6AB3C]" />,
    Leaf: <Leaf className="w-6 h-6 text-[#E6AB3C]" />
  };

  return (
    <section id="adoio" className="py-16 sm:py-24 bg-[#F4EEE1] border-b border-[#E6DEC9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <Award className="w-4 h-4 text-[#E6AB3C]" />
              <span>Organisation Institutionnelle & Professionnelle</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              L'Association ADOIO de Béjaïa
            </h2>
            <p className="font-serif italic text-sm text-[#567B34] mt-1">
              « {ADOIO_INFO.tamazightTitle} »
            </p>
            <p className="mt-3 text-base text-[#436229] leading-relaxed">
              L'<strong>Association pour le Développement de l'Oléiculture et des Industries Oléicoles (ADOIO)</strong> célèbre son <strong>25ᵉ Jubilé d'Argent</strong> et rassemble l'ensemble des acteurs de la filière pour hisser la réputation de l'huile kabyle sur les scènes nationale et internationale.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3.5 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E6DEC9] shadow-xs hover:border-[#8CBE5D] transition-all">
            <Jubile25Logo size={85} />
            <div className="text-xs">
              <span className="font-bold text-[#18230F] block font-serif text-sm">25ᵉ Jubilé d'Argent</span>
              <span className="text-[#567B34] block font-medium">24ᵉ Fête de l'Olive de Béjaïa</span>
              <span className="text-[#E6AB3C] font-bold block mt-0.5">6 au 8 avril 2026</span>
            </div>
          </div>
        </div>

        {/* President's vision & Association profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-14">
          {/* Left: Message from ADOIO */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC9] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F4D9] text-[#233416] text-xs font-bold">
                <Users className="w-3.5 h-3.5 text-[#567B34]" />
                <span>Message de la Gouvernance ADOIO</span>
              </div>
              <blockquote className="font-serif text-lg sm:text-xl text-[#18230F] italic leading-relaxed border-l-4 border-[#E6AB3C] pl-4">
                « {ADOIO_INFO.presidentMessage} »
              </blockquote>
              <p className="text-xs sm:text-sm text-[#436229] leading-relaxed">
                L'ADOIO constitue l'interlocuteur privilégié auprès des services agricoles, des centres de recherche agronomique et des coopératives de la wilaya. Elle assure la transition d'une oléiculture de subsistance vers une filière d'excellence créatrice d'emplois durables dans nos villages.
              </p>
            </div>

            {/* Quick stats of ADOIO */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E6DEC9]">
              <div>
                <span className="font-serif text-2xl font-extrabold text-[#31491E]">20+</span>
                <span className="text-[11px] text-[#6F9D44] block">Années d'action (2004)</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-extrabold text-[#31491E]">1 200+</span>
                <span className="text-[11px] text-[#6F9D44] block">Membres & Oléiculteurs</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-extrabold text-[#E6AB3C]">0.3%</span>
                <span className="text-[11px] text-[#6F9D44] block">Cible d'acidité Vierge Extra</span>
              </div>
            </div>
          </div>

          {/* Right: Contact & Headquarters card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#233416] to-[#18230F] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#8CBE5D]/30 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]/15">
                <h3 className="font-serif text-xl font-bold text-[#FAF7F2]">Siège & Permanence</h3>
                <span className="text-xs font-mono text-[#E6AB3C] bg-[#FAF7F2]/10 px-2 py-0.5 rounded">
                  CAW de Béjaïa
                </span>
              </div>

              <div className="space-y-4 text-xs text-[#E8F4D9]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#E6AB3C] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold block text-[#FAF7F2]">Adresse officielle :</span>
                    <span>{ADOIO_INFO.headquarters}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#E6AB3C] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold block text-[#FAF7F2]">Téléphone & Secrétariat :</span>
                    <a href={`tel:${ADOIO_INFO.phone}`} className="hover:text-white underline block">
                      {ADOIO_INFO.phone}
                    </a>
                    <a href={`tel:${ADOIO_INFO.mobile}`} className="hover:text-white underline block">
                      {ADOIO_INFO.mobile}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#E6AB3C] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold block text-[#FAF7F2]">Courriels de contact :</span>
                    <a href={`mailto:${ADOIO_INFO.email}`} className="hover:text-white underline block">
                      {ADOIO_INFO.email}
                    </a>
                    <a href={`mailto:${ADOIO_INFO.contactSecondary}`} className="hover:text-white underline block">
                      {ADOIO_INFO.contactSecondary}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAdhesion}
              className="w-full py-3 px-4 rounded-xl bg-[#E6AB3C] hover:bg-[#D09222] text-[#18230F] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
            >
              <span>Rejoindre l'ADOIO / Formulaire d'Adhésion</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The 4 Core Missions */}
        <div className="mb-14">
          <h3 className="font-serif text-2xl font-bold text-[#18230F] mb-6">
            Les 4 Piliers Fondamentaux de l'Association
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ADOIO_INFO.keyMissions.map((m, idx) => (
              <div
                key={m.title}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E6DEC9] shadow-xs hover:border-[#8CBE5D] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] flex items-center justify-center">
                      {iconMap[m.icon]}
                    </div>
                    <span className="font-mono text-xs font-bold text-[#567B34] bg-[#E8F4D9] px-2.5 py-1 rounded-full">
                      Pilier 0{idx + 1}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#18230F] mb-2">
                    {m.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#436229] leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Projects & Programs Highlight */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC9] space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
                Actions Concrètes & Projets en Cours
              </h3>
              <p className="text-xs text-[#567B34]">Initiatives déployées sur le terrain dans la wilaya de Béjaïa</p>
            </div>
            <span className="px-3 py-1 bg-[#FEF5DB] text-[#B47A16] text-xs font-bold rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Programme 2024 - 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#18230F]">
                <FileText className="w-4 h-4 text-[#567B34]" />
                <span>Label Indication Géographique (IG)</span>
              </div>
              <p className="text-xs text-[#436229] leading-relaxed">
                Constitution du cahier des charges officiel pour la labellisation de l'<strong>« Huile d'Olive de Kabylie - Terroir Béjaïa »</strong>, garantissant l'origine variétale (Chemlal & Bouchouk) et des critères organoleptiques stricts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#18230F]">
                <Users className="w-4 h-4 text-[#567B34]" />
                <span>Kits de Cueillette & Filets Ajourés</span>
              </div>
              <p className="text-xs text-[#436229] leading-relaxed">
                Distribution accompagnée de filets de récolte et de caisses plastiques de transport pour éradiquer l'usage des sacs en plastique qui favorisent la fermentation prématurée et l'acidité.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[#18230F]">
                <Calendar className="w-4 h-4 text-[#567B34]" />
                <span>Fête de l'Olivier & Salons Professionnels</span>
              </div>
              <p className="text-xs text-[#436229] leading-relaxed">
                Organisation annuelle des rencontres oléicoles de Seddouk et participation aux salons internationaux (SIAL, Djazagro, Salon de l'Agriculture) pour valoriser nos producteurs auprès des importateurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
