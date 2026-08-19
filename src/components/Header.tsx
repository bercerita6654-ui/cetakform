import React from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Settings, 
  Download, 
  CalendarDays,
  LayoutTemplate,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { DocumentConfig } from '../types';

interface HeaderProps {
  config: DocumentConfig;
  onOpenSettings: () => void;
  onOpenHolidays: () => void;
  onExportCSV: () => void;
  onPrint: () => void;
  viewMode: 'table' | 'a4-pages';
  onChangeViewMode: (mode: 'table' | 'a4-pages') => void;
  totalDays: number;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onOpenSettings,
  onOpenHolidays,
  onExportCSV,
  onPrint,
  viewMode,
  onChangeViewMode,
  totalDays
}) => {
  return (
    <header className="no-print bg-white border-b border-[#E5E7EB] sticky top-0 z-40 shadow-xs">
      <div className="w-full px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Document Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center text-white shadow-xs">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-[#111827] leading-tight tracking-tight">
                Invoice Receipt Generator
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]">
                High Density A4
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280]">
              <span className="font-semibold text-[#374151]">{config.title} {config.month.toUpperCase()} {config.year}</span> • {totalDays} Hari Terdaftar
            </p>
          </div>
        </div>

        {/* View Mode & Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="bg-[#F3F4F6] p-0.5 rounded-lg flex items-center border border-[#E5E7EB] text-xs font-semibold">
            <button
              onClick={() => onChangeViewMode('table')}
              className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 text-xs ${
                viewMode === 'table'
                  ? 'bg-white text-[#111827] shadow-xs font-bold'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              Editor Mode
            </button>
            <button
              onClick={() => onChangeViewMode('a4-pages')}
              className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 text-xs ${
                viewMode === 'a4-pages'
                  ? 'bg-white text-[#4F46E5] shadow-xs font-bold'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              A4 Sheet Preview
            </button>
          </div>

          {/* Holiday Presets */}
          <button
            onClick={onOpenHolidays}
            title="Kelola Hari Libur & Cuti"
            className="px-2.5 py-1.5 bg-white hover:bg-red-50 text-[#DC2626] border border-[#FCA5A5] rounded-md transition text-xs font-semibold flex items-center gap-1.5"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Libur / Cuti
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Format Jam & Kop"
            className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-[#374151] border border-[#D1D5DB] rounded-md transition text-xs font-semibold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Format
          </button>

          {/* CSV Export */}
          <button
            onClick={onExportCSV}
            title="Unduh Format CSV"
            className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-[#374151] border border-[#D1D5DB] rounded-md transition text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          {/* Print Button */}
          <button
            onClick={onPrint}
            className="px-3.5 py-1.5 bg-[#111827] hover:bg-black active:scale-98 text-white rounded-md transition text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print to PDF
          </button>
        </div>
      </div>
    </header>
  );
};
