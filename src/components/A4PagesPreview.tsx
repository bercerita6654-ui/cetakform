import React, { useMemo } from 'react';
import { Printer, ArrowLeft, Layers, FileText } from 'lucide-react';
import { DayData, DocumentConfig } from '../types';

interface A4PagesPreviewProps {
  daysData: DayData[];
  config: DocumentConfig;
  onBackToEditor: () => void;
  onPrint: () => void;
}

export const A4PagesPreview: React.FC<A4PagesPreviewProps> = ({
  daysData,
  config,
  onBackToEditor,
  onPrint
}) => {
  // Approximate chunking for A4 page height
  const pages = useMemo(() => {
    if (daysData.length === 0) return [];

    const result: DayData[][] = [];
    let currentPage: DayData[] = [];
    let currentSlotCount = 0;
    const MAX_SLOTS_PER_PAGE = 24;

    daysData.forEach((day) => {
      const daySlotsWeight = (day.isLibur || day.isMinggu) ? 1.5 : day.slots.length;
      
      if (currentSlotCount + daySlotsWeight > MAX_SLOTS_PER_PAGE && currentPage.length > 0) {
        result.push(currentPage);
        currentPage = [day];
        currentSlotCount = daySlotsWeight;
      } else {
        currentPage.push(day);
        currentSlotCount += daySlotsWeight;
      }
    });

    if (currentPage.length > 0) {
      result.push(currentPage);
    }

    return result;
  }, [daysData]);

  const currentPeriod = `Periode: ${config.month.toUpperCase()} ${config.year}`;
  const expedisiItems = config.expedisiList || ['J&T', 'JNE', 'SPX', 'ID'];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      {/* Top Banner Toolbar */}
      <div className="no-print bg-[#111827] text-white p-3.5 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3 mb-6 sticky top-14 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToEditor}
            className="px-3 py-1.5 bg-[#1F2937] hover:bg-[#374151] text-white rounded text-xs font-bold flex items-center gap-1.5 transition border border-gray-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Editor
          </button>
          <div className="flex items-center gap-2 border-l border-gray-700 pl-3">
            <Layers className="w-3.5 h-3.5 text-[#818CF8]" />
            <span className="text-xs font-semibold text-gray-300">
              Total: <b className="text-white">{pages.length} Halaman A4</b>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-[11px] text-gray-400 hidden sm:block font-mono">
            Format Siap Cetak A4 Portrait
          </p>
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] active:scale-98 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Dokumen Sekarang (Ctrl + P)
          </button>
        </div>
      </div>

      {/* Pages Container */}
      <div className="flex flex-col items-center gap-8">
        {pages.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-300 text-center max-w-sm">
            <p className="text-gray-600 font-semibold text-xs mb-3">Tidak ada data untuk dipratinjau.</p>
            <button
              onClick={onBackToEditor}
              className="px-3.5 py-1.5 bg-[#6366F1] text-white rounded text-xs font-bold"
            >
              Buka Editor
            </button>
          </div>
        ) : (
          pages.map((pageDays, pageIndex) => (
            <div
              key={pageIndex}
              className="a4-sheet-preview bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-8 sm:p-12 border border-[#D1D5DB] relative flex flex-col justify-between"
              style={{ minHeight: '297mm', width: '210mm' }}
            >
              {/* Document Header & Table */}
              <div>
                {/* Optional Company Header */}
                {config.showCompanyHeader && config.companyName && (
                  <div className="mb-3 pb-2 border-b-2 border-black flex justify-between items-end">
                    <div>
                      <h3 className="text-sm font-extrabold uppercase tracking-wide text-black">
                        {config.companyName}
                      </h3>
                      {config.department && (
                        <p className="text-[10px] text-gray-700 font-medium">
                          Departemen: {config.department}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-[9px] text-gray-500 font-mono uppercase">
                      Dokumen Fisik
                    </div>
                  </div>
                )}

                {/* High Density Title Box */}
                <div className="border-2 border-black p-3 mb-5 text-center bg-white">
                  <h3 className="text-xl font-black uppercase tracking-[0.2em] text-[#111827] leading-tight">
                    {config.title}
                  </h3>
                  <p className="text-xs font-semibold mt-0.5 uppercase tracking-widest text-gray-600">
                    {currentPeriod}
                  </p>
                </div>

                {/* Table */}
                <table className="w-full border-collapse border border-black text-[11px]">
                  <thead>
                    <tr className="bg-gray-50 font-bold text-center uppercase tracking-wider text-black">
                      <th className="border border-black p-2 w-20">Hari</th>
                      <th className="border border-black p-2 w-28">Tanggal</th>
                      <th className="border border-black p-2 w-24">Waktu</th>
                      <th className="border border-black p-2 w-36">{config.senderTitle}</th>
                      <th className="border border-black p-2 w-36">{config.receiverTitle}</th>
                      <th className="border border-black p-2 w-36">
                        <div>Ekspedisi</div>
                        <div className="text-[9px] font-normal text-gray-600 tracking-tight">
                          J&T • JNE • SPX • ID
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageDays.map((day) => {
                      const isHoliday = day.isLibur || day.isMinggu;
                      const slotsCount = isHoliday ? 1 : Math.max(1, day.slots.length);

                      if (isHoliday) {
                        return (
                          <tr key={day.id} className="border-b border-black bg-red-50/50">
                            <td className="border border-black p-2 text-center align-middle font-bold text-red-600">
                              {day.hari}
                            </td>
                            <td className="border border-black p-2 text-center align-middle text-red-600 font-medium">
                              {day.tanggal}
                            </td>
                            <td
                              className="border border-black p-2 text-center font-black tracking-[0.3em] bg-red-500 text-white"
                              style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                            >
                              {day.keteranganLibur || 'LIBUR'}
                            </td>
                            <td
                              className="border border-black p-2 text-center font-black tracking-[0.3em] bg-red-500 text-white"
                              style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                            >
                              {day.keteranganLibur || 'LIBUR'}
                            </td>
                            <td
                              className="border border-black p-2 text-center font-black tracking-[0.3em] bg-red-500 text-white"
                              style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                            >
                              {day.keteranganLibur || 'LIBUR'}
                            </td>
                            <td
                              className="border border-black p-2 text-center font-black tracking-[0.3em] bg-red-500 text-white"
                              style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                            >
                              {day.keteranganLibur || 'LIBUR'}
                            </td>
                          </tr>
                        );
                      }

                      return day.slots.map((slot, slotIdx) => (
                        <tr key={slot.id} className="border-b border-black">
                          {slotIdx === 0 && (
                            <>
                              <td
                                rowSpan={slotsCount}
                                className="border border-black p-2 text-center align-middle font-bold text-[#111827] bg-white"
                              >
                                {day.hari}
                              </td>
                              <td
                                rowSpan={slotsCount}
                                className="border border-black p-2 text-center align-middle text-[#374151] font-medium bg-white"
                              >
                                {day.tanggal}
                              </td>
                            </>
                          )}
                          <td className="border border-black p-2 text-center h-11 align-middle font-semibold text-[#111827]">
                            {slot.waktu}
                          </td>
                          <td className="border border-black p-2 h-11"></td>
                          <td className="border border-black p-2 h-11"></td>
                          {/* Expedisi Box */}
                          <td className="border border-black p-1.5 h-11 align-middle">
                            <div className="grid grid-cols-2 gap-1 text-[10px]">
                              {expedisiItems.map(c => {
                                const isChecked = slot.expedisi?.includes(c);
                                return (
                                  <div key={c} className="flex items-center gap-1 font-semibold">
                                    <span className="w-3 h-3 border border-black inline-flex items-center justify-center text-[8px] font-bold">
                                      {isChecked ? '✓' : ''}
                                    </span>
                                    <span>{c}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>

                {/* Footer Notes on last page */}
                {pageIndex === pages.length - 1 && config.showFooterNotes && config.footerNotes && (
                  <div className="mt-4 pt-2 text-[10px] text-gray-700 italic border-t border-gray-300">
                    <b className="font-bold">Catatan:</b> {config.footerNotes}
                  </div>
                )}
              </div>

              {/* Bottom High Density Meta */}
              <div className="mt-6 pt-3 border-t border-dotted border-gray-300 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                <span>Generated System: INV-GEN-V2</span>
                <span className="font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                  Halaman {pageIndex + 1} dari {pages.length}
                </span>
                <span>{config.month} {config.year}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
