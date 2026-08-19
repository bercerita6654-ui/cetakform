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
  onUpdateExpedisiQty: (dayId: string, slotId: string, courier: string, qty: string) => void;
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
  onUpdateExpedisiQty,
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
  const expedisiItems = config.expedisiList && config.expedisiList.length > 0
    ? config.expedisiList
    : ['J&T', 'JNE', 'SPX', 'ID'];

  const totalCols = 5 + expedisiItems.length; // Hari, Tgl, Waktu, Penyerah, Penerima + Couriers

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
                colSpan={totalCols + 1}
                className="border border-black p-3 text-center text-lg sm:text-xl font-bold bg-white text-black uppercase tracking-wider"
              >
                {config.title} {periodString}
              </th>
            </tr>
            {/* Column Headers Row 1 */}
            <tr className="bg-gray-100 font-bold text-center text-black">
              <th rowSpan={2} className="border border-black p-2 w-20 uppercase align-middle whitespace-nowrap">
                Hari
              </th>
              <th rowSpan={2} className="border border-black p-2 w-32 uppercase align-middle whitespace-nowrap">
                Tanggal
              </th>
              <th rowSpan={2} className="border border-black px-3 py-2 w-36 min-w-[130px] uppercase align-middle whitespace-nowrap">
                Waktu
              </th>
              <th rowSpan={2} className="border border-black p-2 w-36 uppercase align-middle">
                {config.senderTitle}
              </th>
              <th rowSpan={2} className="border border-black p-2 w-36 uppercase align-middle">
                {config.receiverTitle}
              </th>
              {/* Group Header for Ekspedisi */}
              <th
                colSpan={expedisiItems.length}
                className="border border-black p-1.5 text-center uppercase tracking-wider bg-gray-200 text-black font-extrabold"
              >
                EKSPEDISI
              </th>
              <th rowSpan={2} className="border border-black p-2 w-16 print-hidden text-xs align-middle">
                Aksi
              </th>
            </tr>
            {/* Column Headers Row 2: Sub-columns for each Courier */}
            <tr className="bg-gray-100 font-bold text-center text-black">
              {expedisiItems.map((courier) => (
                <th
                  key={courier}
                  className="border border-black p-1.5 text-center text-xs font-bold w-14 bg-gray-100 whitespace-nowrap"
                >
                  {courier}
                </th>
              ))}
            </tr>
          </thead>

          {/* Empty State */}
          {daysData.length === 0 ? (
            <tbody id="table-body">
              <tr>
                <td
                  colSpan={totalCols + 1}
                  className="text-center p-12 text-gray-500 border border-black print-hidden bg-gray-50/50"
                >
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
                      <td className="border border-black p-2 text-center align-middle font-bold text-red-600 whitespace-nowrap">
                        {day.hari}
                      </td>
                      <td className="border border-black p-2 text-center align-middle text-red-600 font-medium whitespace-nowrap">
                        {day.tanggal}
                      </td>
                      {/* Red LIBUR Columns across all operational columns */}
                      <td
                        className="border border-black p-2 text-center font-bold tracking-widest text-white select-none whitespace-nowrap"
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
                      {/* Individual Courier Columns with LIBUR in red */}
                      {expedisiItems.map((courier) => (
                        <td
                          key={courier}
                          className="border border-black p-1 text-center font-bold text-xs tracking-wider text-white select-none whitespace-nowrap"
                          style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                        >
                          LIBUR
                        </td>
                      ))}

                      {/* Action Cell */}
                      <td className="border border-black p-1 text-center print-hidden align-middle bg-white">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onToggleLibur(day.id)}
                            title="Ubah jadi Hari Kerja"
                            className="text-emerald-700 hover:bg-emerald-50 p-1.5 rounded transition cursor-pointer"
                          >
                            <Briefcase className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onRemoveDay(day.id)}
                            title="Hapus Hari"
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded transition cursor-pointer"
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
                              className={`border border-black p-2 text-center align-middle font-bold text-gray-900 whitespace-nowrap ${
                                dayIndex % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'
                              }`}
                            >
                              {day.hari}
                            </td>
                            <td
                              rowSpan={slotsCount}
                              className={`border border-black p-2 text-center align-middle text-gray-800 font-medium whitespace-nowrap ${
                                dayIndex % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'
                              }`}
                            >
                              {day.tanggal}
                            </td>
                          </>
                        )}

                        {/* Waktu Slot Cell - Always single line without wrapping */}
                        <td className="border border-black px-2 py-1 text-center h-12 align-middle text-gray-900 whitespace-nowrap">
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
                                className="w-full text-xs font-bold p-1 border border-blue-500 rounded outline-none text-center bg-white shadow-xs whitespace-nowrap font-mono"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveSlot(day.id, slot.id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="group/slot flex items-center justify-center gap-1">
                              <span className="font-semibold text-xs sm:text-sm whitespace-nowrap tracking-tight font-mono text-gray-900">
                                {slot.waktu}
                              </span>
                              <button
                                onClick={() => handleStartEditSlot(slot)}
                                className="print-hidden opacity-0 group-hover/slot:opacity-100 text-gray-400 hover:text-blue-600 p-0.5 rounded transition cursor-pointer"
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

                        {/* Individual Sub-Columns for Each Courier: J&T, JNE, SPX, ID */}
                        {expedisiItems.map((courier) => {
                          const val = slot.expedisiQty?.[courier] || '';
                          return (
                            <td
                              key={courier}
                              className="border border-black p-1 text-center align-middle h-12 w-14 bg-white"
                            >
                              <input
                                type="text"
                                inputMode="numeric"
                                value={val}
                                onChange={(e) =>
                                  onUpdateExpedisiQty(day.id, slot.id, courier, e.target.value)
                                }
                                placeholder=""
                                className="w-full text-center text-xs font-bold outline-none bg-transparent hover:bg-blue-50/50 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded py-1 transition text-gray-900 font-mono"
                                title={`Jumlah invoice/paket untuk ${courier}`}
                              />
                            </td>
                          );
                        })}

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
                                  className="text-amber-600 hover:bg-amber-100/60 p-1 rounded transition cursor-pointer"
                                  title="Tandai Libur"
                                >
                                  <Sun className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onAddSlotToDay(day.id)}
                                  className="text-indigo-600 hover:bg-indigo-100/60 p-1 rounded transition cursor-pointer"
                                  title="Tambah Slot Jam"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onRemoveDay(day.id)}
                                  className="text-red-500 hover:bg-red-100/60 p-1 rounded transition cursor-pointer"
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
                                    className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-20 cursor-pointer"
                                    title="Pindah atas"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onMoveDay(dayIndex, 'down')}
                                    disabled={dayIndex === daysData.length - 1}
                                    className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-20 cursor-pointer"
                                    title="Pindah bawah"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
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
