import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Sun, 
  Briefcase, 
  Edit3, 
  Check, 
  ChevronUp, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { DayData, DocumentConfig, TimeSlot } from '../types';

interface InvoiceTableProps {
  daysData: DayData[];
  config: DocumentConfig;
  onRemoveDay: (id: string) => void;
  onToggleLibur: (id: string) => void;
  onAddSlotToDay: (dayId: string) => void;
  onRemoveSlotFromDay: (dayId: string, slotId: string) => void;
  onUpdateSlotTime: (dayId: string, slotId: string, newTime: string) => void;
  onMoveDay: (index: number, direction: 'up' | 'down') => void;
  onGenerateMonth: () => void;
  onAddToday: () => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  daysData,
  config,
  onRemoveDay,
  onToggleLibur,
  onAddSlotToDay,
  onRemoveSlotFromDay,
  onUpdateSlotTime,
  onMoveDay,
  onGenerateMonth,
  onAddToday
}) => {
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editTimeValue, setEditTimeValue] = useState<string>('');

  const handleStartEditSlot = (slot: TimeSlot) => {
    setEditingSlotId(slot.id);
    setEditTimeValue(slot.waktu);
  };

  const handleSaveSlot = (dayId: string, slotId: string) => {
    if (editTimeValue.trim()) {
      onUpdateSlotTime(dayId, slotId, editTimeValue.trim());
    }
    setEditingSlotId(null);
  };

  const periodString = `${config.month.toUpperCase()} ${config.year}`;

  return (
    <div
      id="print-area"
      className="max-w-5xl mx-auto bg-white p-6 sm:p-10 shadow-lg border border-slate-200 rounded-lg print-card-only"
    >
      {/* Optional Company Header */}
      {config.showCompanyHeader && config.companyName && (
        <div className="mb-4 pb-2 border-b-2 border-black flex justify-between items-end">
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wide text-black">
              {config.companyName}
            </h3>
            {config.department && (
              <p className="text-xs text-gray-700 font-medium">
                Departemen: {config.department}
              </p>
            )}
          </div>
          <div className="text-right text-xs text-gray-500 font-mono">
            Dokumen Fisik Tanda Terima
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-black text-sm print-table">
          <thead>
            {/* Document Title Header inside Table */}
            <tr>
              <th
                colSpan={6}
                className="border border-black p-3 text-center text-lg sm:text-xl font-bold bg-white text-black uppercase tracking-wider"
              >
                {config.title} {periodString}
              </th>
            </tr>
            {/* Column Headers */}
            <tr className="bg-gray-100 font-bold text-center text-black">
              <th className="border border-black p-2 w-20 uppercase">Hari</th>
              <th className="border border-black p-2 w-32 uppercase">Tanggal</th>
              <th className="border border-black p-2 w-28 uppercase">Waktu</th>
              <th className="border border-black p-2 w-48 uppercase">{config.senderTitle}</th>
              <th className="border border-black p-2 w-48 uppercase">{config.receiverTitle}</th>
              <th className="border border-black p-2 w-16 print-hidden text-xs">Aksi</th>
            </tr>
          </thead>

          {/* Empty State */}
          {daysData.length === 0 ? (
            <tbody id="table-body">
              <tr>
                <td colSpan={6} className="text-center p-12 text-gray-500 border border-black print-hidden bg-gray-50/50">
                  <div className="max-w-md mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-gray-800 text-base mb-1">Tabel Masih Kosong</p>
                    <p className="text-xs text-gray-500 mb-4 text-center">
                      Silakan klik tombol <b>Generate 1 Bulan</b> di atas untuk membuat jadwal sebulan penuh, atau klik <b>Tambah Hari Ini</b>.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={onGenerateMonth}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-bold shadow-xs transition"
                      >
                        Generate 1 Bulan ({config.month})
                      </button>
                      <button
                        onClick={onAddToday}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-semibold shadow-xs transition"
                      >
                        + Tambah Hari Ini
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            daysData.map((day, dayIndex) => {
              const isHoliday = day.isLibur || day.isMinggu;
              const slotsCount = isHoliday ? 1 : Math.max(1, day.slots.length);

              return (
                <tbody key={day.id} className="print-avoid-break group/day border-b border-black">
                  {isHoliday ? (
                    /* SUNDAY / HOLIDAY ROW */
                    <tr className="bg-red-50 hover:bg-red-100/60 transition-colors">
                      <td className="border border-black p-2 text-center align-middle font-bold text-red-600">
                        {day.hari}
                      </td>
                      <td className="border border-black p-2 text-center align-middle text-red-600 font-medium">
                        {day.tanggal}
                      </td>
                      {/* 3 Red LIBUR Columns matching user's exact specification */}
                      <td
                        className="border border-black p-2 text-center font-bold tracking-widest text-white select-none"
                        style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                      >
                        {day.keteranganLibur || 'LIBUR'}
                      </td>
                      <td
                        className="border border-black p-2 text-center font-bold tracking-widest text-white select-none"
                        style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                      >
                        {day.keteranganLibur || 'LIBUR'}
                      </td>
                      <td
                        className="border border-black p-2 text-center font-bold tracking-widest text-white select-none"
                        style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                      >
                        {day.keteranganLibur || 'LIBUR'}
                      </td>

                      {/* Action Cell */}
                      <td className="border border-black p-1 text-center print-hidden align-middle bg-white">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onToggleLibur(day.id)}
                            title="Ubah jadi Hari Kerja"
                            className="text-emerald-700 hover:bg-emerald-50 p-1.5 rounded transition"
                          >
                            <Briefcase className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onRemoveDay(day.id)}
                            title="Hapus Hari"
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    /* REGULAR WORKING DAY ROWS */
                    day.slots.map((slot, slotIndex) => (
                      <tr key={slot.id} className="hover:bg-slate-50 transition-colors">
                        {/* Day and Date with RowSpan */}
                        {slotIndex === 0 && (
                          <>
                            <td
                              rowSpan={slotsCount}
                              className={`border border-black p-2 text-center align-middle font-bold text-gray-900 ${
                                dayIndex % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'
                              }`}
                            >
                              {day.hari}
                            </td>
                            <td
                              rowSpan={slotsCount}
                              className={`border border-black p-2 text-center align-middle text-gray-800 font-medium ${
                                dayIndex % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'
                              }`}
                            >
                              {day.tanggal}
                            </td>
                          </>
                        )}

                        {/* Waktu Slot Cell */}
                        <td className="border border-black p-2 text-center h-12 align-middle text-gray-900">
                          {editingSlotId === slot.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editTimeValue}
                                onChange={(e) => setEditTimeValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveSlot(day.id, slot.id);
                                  if (e.key === 'Escape') setEditingSlotId(null);
                                }}
                                className="w-full text-xs font-bold p-1 border border-blue-500 rounded outline-none text-center bg-white shadow-xs"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveSlot(day.id, slot.id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="group/slot flex items-center justify-center gap-1">
                              <span className="font-medium text-xs sm:text-sm">{slot.waktu}</span>
                              <button
                                onClick={() => handleStartEditSlot(slot)}
                                className="print-hidden opacity-0 group-hover/slot:opacity-100 text-gray-400 hover:text-blue-600 p-0.5 rounded transition"
                                title="Edit waktu"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Signature Box Penyerah */}
                        <td className="border border-black p-2 align-middle h-12">
                          {slot.menyerahkan && (
                            <span className="text-xs text-gray-600 block text-center italic">
                              {slot.menyerahkan}
                            </span>
                          )}
                        </td>

                        {/* Signature Box Penerima */}
                        <td className="border border-black p-2 align-middle h-12">
                          {slot.menerima && (
                            <span className="text-xs text-gray-600 block text-center italic">
                              {slot.menerima}
                            </span>
                          )}
                        </td>

                        {/* Action Column on first slot with RowSpan */}
                        {slotIndex === 0 && (
                          <td
                            rowSpan={slotsCount}
                            className="border border-black p-1 text-center print-hidden align-middle bg-gray-50/70"
                          >
                            <div className="flex flex-col items-center justify-center gap-1 py-1">
                              <div className="flex items-center justify-center gap-0.5">
                                <button
                                  onClick={() => onToggleLibur(day.id)}
                                  className="text-amber-600 hover:bg-amber-100/60 p-1 rounded transition"
                                  title="Tandai Libur"
                                >
                                  <Sun className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onAddSlotToDay(day.id)}
                                  className="text-indigo-600 hover:bg-indigo-100/60 p-1 rounded transition"
                                  title="Tambah Slot Jam"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onRemoveDay(day.id)}
                                  className="text-red-500 hover:bg-red-100/60 p-1 rounded transition"
                                  title="Hapus Hari"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {daysData.length > 1 && (
                                <div className="flex items-center justify-center gap-0.5 opacity-50 hover:opacity-100 transition">
                                  <button
                                    onClick={() => onMoveDay(dayIndex, 'up')}
                                    disabled={dayIndex === 0}
                                    className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-20"
                                    title="Pindah atas"
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => onMoveDay(dayIndex, 'down')}
                                    disabled={dayIndex === daysData.length - 1}
                                    className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-20"
                                    title="Pindah bawah"
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              );
            })
          )}
        </table>
      </div>

      {/* Optional Document Footer Note */}
      {config.showFooterNotes && config.footerNotes && (
        <div className="mt-4 pt-2 text-xs text-gray-700 italic border-t border-gray-300">
          <b className="font-bold">Catatan:</b> {config.footerNotes}
        </div>
      )}
    </div>
  );
};
