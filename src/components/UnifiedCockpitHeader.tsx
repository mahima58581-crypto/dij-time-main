import React from 'react';
import { Session, Station, ActiveSidebarTab } from '../types';
import { CyberMarqueeTicker } from './CyberMarqueeTicker';
import { StatsBar } from './StatsBar';
import { Grid } from 'lucide-react';

interface UnifiedCockpitHeaderProps {
  clubName: string;
  activeTab: ActiveSidebarTab;
  stations: Station[];
  sessions: Session[];
  activeSessionsCount: number;
}

export const UnifiedCockpitHeader: React.FC<UnifiedCockpitHeaderProps> = ({
  clubName,
  activeTab,
  stations,
  sessions,
  activeSessionsCount,
}) => {
  return (
    <div className="rounded-2xl border border-emerald-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#070b16]/95 backdrop-blur-xl shadow-xs overflow-hidden relative transition-all">
      {/* 1. Cyber Accent Top Lightbar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

      {/* 2. Seamless Cyber Marquee Ticker */}
      <div className="border-b border-slate-100 dark:border-slate-800/80">
        <CyberMarqueeTicker
          clubName={clubName}
          activeSessionsCount={activeSessionsCount}
          stations={stations}
          sessions={sessions}
          embedded
        />
      </div>

      {/* 3. Real-time Telemetry Metrics Grid */}
      <div className="p-3 sm:p-3.5 bg-slate-50/40 dark:bg-transparent">
        <StatsBar
          sessions={sessions}
          stations={stations}
          activeTab={activeTab}
          embedded
        />
      </div>
    </div>
  );
};
