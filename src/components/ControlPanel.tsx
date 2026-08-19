import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Zap,
  FileText, 
  Printer, 
  Trash2, 
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CalendarDays
} from 'lucide-react';
import { MONTHS_ID } from '../utils/dateUtils';
import { DocumentConfig, DayData } from '../types';

interface ControlPanelProps {
  config: DocumentConfig;
  onChangeConfig: (newConfig: Partial<DocumentConfig>) => void;
  onGenerateMonth: () => void;
  onAddToday: () => void;
  onAddEmptyDay: () => void;
  onAddCustomDate: (dateString: string) => void;
  onClearAll: () => void;
  onPrint: () => void;
  daysData: DayData[];
  onOpenSettings: () => void;
  onOpenHolidays: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChangeConfig,
  onGenerateMonth,
  onAddToday,
  onAddEmptyDay,
  onAddCustomDate,
  onClearAll,
  onPrint,
  daysData,
  onOpenSettings,
  onOpenHolidays
}) => {
  const [customDate, setCustomDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showCustomDateInput, setShowCustomDateInput] = useState(false);

  // Statistics
  const totalDays = daysData.length;
  const totalLibur = daysData.filter(d => d.isLibur || d.isMinggu).length;
  const totalKerja = totalDays - totalLibur;

  const handleCustomDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDate) {
      onAddCustomDate(customDate);
      setShowCustomDateInput(false);
    }
  };

  const handlePrevMonth = () => {
    const currentIndex = MONTHS_ID.indexOf(config.month);
    if (currentIndex > 0) {
      onChangeConfig({ month: MONTHS_ID[currentIndex - 1] });
    } else {
      onChangeConfig({ month: MONTHS_ID[11], year: config.year - 1 });
    }
  };

  const handleNextMonth = () => {
    const currentIndex = MONTHS_ID.indexOf(config.month);
    if (currentIndex < 11) {
      onChangeConfig({ month: MONTHS_ID[currentIndex + 1] });
    } else {
      onChangeConfig({ month: MONTHS_ID[0], year: config.year + 1 });
    }
  };

  return (
    <div className="no-print max-w-5xl mx-auto mb-6 bg-white p-6 rounded-xl shadow-md border border-slate-200">
      
      {/* Top Header with Lucide Calendar Icon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center text-blue-600">
          <Calendar className="w-6 h-6 mr-2 shrink-0 text-blue-600" />
          Pengaturan Dokumen Penyerahan Invoice
        </h1>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            Total: <b>{totalDays}</b> Hari
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            Kerja: <b>{totalKerja}</b>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-red-50 text-red-700 font-semibold border border-red-200">
            Libur: <b>{totalLibur}</b>
          </span>
        </div>
      </div>
      
      {/* Month & Year Selectors & Title Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {/* Month Selector */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center justify-between">
            <span>Bulan</span>
            <span className="text-xs text-blue-600 font-medium">Januari - Desember</span>
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              title="Bulan Sebelumnya"
              className="p-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <select
              id="month-select"
              value={config.month}
              onChange={(e) => onChangeConfig({ month: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-xs border p-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {MONTHS_ID.map((month, idx) => (
                <option key={month} value={month}>
                  {String(idx + 1).padStart(2, '0')} - {month}
                </option>
              ))}
            </select>
            <button
              onClick={handleNextMonth}
              title="Bulan Berikutnya"
              className="p-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Year Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tahun</label>
          <input
            type="number"
            id="year-input"
            min="2000"
            max="2100"
            value={config.year}
            onChange={(e) => onChangeConfig({ year: parseInt(e.target.value) || 2026 })}
            className="w-full border-gray-300 rounded-md shadow-xs border p-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          />
        </div>

        {/* Document Title Header */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Dokumen</label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => onChangeConfig({ title: e.target.value })}
            placeholder="PENYERAHAN INVOICE"
            className="w-full border-gray-300 rounded-md shadow-xs border p-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white uppercase"
          />
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
        
        {/* Generate 1 Bulan Button */}
        <button
          onClick={onGenerateMonth}
          className="flex items-center px-4 py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md transition font-bold text-sm shadow-2xs active:scale-98"
          title="Otomatis buat seluruh hari di bulan terpilih"
        >
          <Zap className="w-4 h-4 mr-2 text-purple-700 fill-current" />
          Generate 1 Bulan ({config.month})
        </button>

        {/* Tambah Hari Ini Button */}
        <button
          onClick={onAddToday}
          className="flex items-center px-4 py-2.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-md transition font-semibold text-sm shadow-2xs active:scale-98"
        >
          <Plus className="w-4 h-4 mr-2 text-green-700 font-bold" />
          Tambah Hari Ini
        </button>

        {/* Tambah Hari Kosong Button */}
        <button
          onClick={onAddEmptyDay}
          className="flex items-center px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition font-semibold text-sm shadow-2xs active:scale-98"
        >
          <FileText className="w-4 h-4 mr-2 text-gray-700" />
          Tambah Hari Kosong
        </button>

        {/* Pilih Tanggal Kustom Button */}
        <button
          onClick={() => setShowCustomDateInput(!showCustomDateInput)}
          className="flex items-center px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-md transition font-semibold text-sm"
        >
          <CalendarPlus className="w-4 h-4 mr-1.5 text-sky-600" />
          Pilih Tanggal
        </button>

        {/* Kelola Libur */}
        <button
          onClick={onOpenHolidays}
          className="flex items-center px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md transition font-semibold text-xs"
        >
          <CalendarDays className="w-4 h-4 mr-1" />
          Kelola Libur
        </button>

        {/* Pengaturan Jam / Kop */}
        <button
          onClick={onOpenSettings}
          className="flex items-center px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition font-semibold text-xs"
        >
          <SlidersHorizontal className="w-4 h-4 mr-1" />
          Format Jam & Kop
        </button>

        {/* Clear Button */}
        {daysData.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-md transition text-xs font-semibold"
            title="Kosongkan tabel"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Reset
          </button>
        )}

        {/* Cetak / Save PDF Button - Always prominent */}
        <button
          onClick={onPrint}
          className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition ml-auto font-bold shadow-md active:scale-98 text-sm"
        >
          <Printer className="w-4 h-4 mr-2" />
          Cetak / Save PDF
        </button>
      </div>

      {/* Custom Date Form Dropdown */}
      {showCustomDateInput && (
        <form onSubmit={handleCustomDateSubmit} className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg flex items-center gap-3 flex-wrap animate-fadeIn">
          <span className="text-xs font-bold text-sky-900">Tambahkan Tanggal Tertentu:</span>
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="bg-white border border-sky-300 rounded-md px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold transition"
          >
            Tambahkan
          </button>
          <button
            type="button"
            onClick={() => setShowCustomDateInput(false)}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
          >
            Batal
          </button>
        </form>
      )}

    </div>
  );
};
