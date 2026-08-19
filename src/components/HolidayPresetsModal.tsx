import React, { useState } from 'react';
import { X, Check, Sun, Calendar } from 'lucide-react';
import { DayData } from '../types';

interface HolidayPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysData: DayData[];
  onToggleHoliday: (dayId: string, customReason?: string) => void;
  onMarkMultipleHolidays: (holidayMap: { [dayId: string]: string }) => void;
}

export const HolidayPresetsModal: React.FC<HolidayPresetsModalProps> = ({
  isOpen,
  onClose,
  daysData,
  onToggleHoliday,
  onMarkMultipleHolidays
}) => {
  const [selectedHolidays, setSelectedHolidays] = useState<{ [id: string]: boolean }>(() => {
    const initial: { [id: string]: boolean } = {};
    daysData.forEach(d => {
      if (d.isLibur || d.isMinggu) initial[d.id] = true;
    });
    return initial;
  });

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setSelectedHolidays(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSave = () => {
    const holidayMap: { [dayId: string]: string } = {};
    daysData.forEach(day => {
      if (selectedHolidays[day.id]) {
        holidayMap[day.id] = 'LIBUR';
      }
    });
    onMarkMultipleHolidays(holidayMap);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#D1D5DB] overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] bg-[#FEF2F2]">
          <div>
            <h2 className="text-[10px] font-bold text-[#DC2626] uppercase tracking-widest">
              Holiday Management
            </h2>
            <h3 className="text-sm font-bold text-[#111827]">
              Kelola Hari Libur & Minggu
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 max-h-[55vh] overflow-y-auto">
          {daysData.length === 0 ? (
            <p className="text-center text-gray-500 py-6 text-xs">
              Belum ada hari di dalam tabel. Silakan generate bulan terlebih dahulu.
            </p>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <span>Hari & Tanggal</span>
                <span>Status Dokumen</span>
              </div>
              {daysData.map((day) => {
                const isSelected = !!selectedHolidays[day.id];
                const isSunday = day.hari === 'Minggu';

                return (
                  <div
                    key={day.id}
                    onClick={() => handleToggle(day.id)}
                    className={`flex items-center justify-between p-2 rounded border transition cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-red-50/70 border-red-200 text-red-950 font-semibold'
                        : 'bg-white hover:bg-gray-50 border-[#E5E7EB] text-[#374151]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                          isSelected
                            ? 'bg-[#DC2626] border-[#DC2626] text-white'
                            : 'border-[#CBD5E1] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isSunday ? 'text-red-600' : 'text-[#111827]'}`}>
                          {day.hari}
                        </span>
                        <span className="text-[11px] text-gray-500">{day.tanggal}</span>
                        {isSunday && (
                          <span className="text-[9px] font-bold px-1 rounded bg-red-100 text-red-700">
                            Minggu
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      {isSelected ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500 text-white tracking-wider">
                          LIBUR
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-gray-400">
                          Hari Kerja
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E5E7EB] flex items-center justify-between">
          <button
            onClick={() => {
              const sundayMap: { [id: string]: boolean } = {};
              daysData.forEach(d => {
                if (d.hari === 'Minggu') sundayMap[d.id] = true;
              });
              setSelectedHolidays(sundayMap);
            }}
            className="text-[11px] text-gray-600 hover:text-black font-semibold"
          >
            Hanya Hari Minggu
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white border border-[#D1D5DB] hover:bg-gray-50 text-[#374151] rounded text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Terapkan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
