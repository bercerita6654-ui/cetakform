import React, { useState } from 'react';
import { X, Plus, Trash2, Check, RotateCcw, Building2, Clock, FileText } from 'lucide-react';
import { DocumentConfig } from '../types';
import { DEFAULT_TIME_SLOTS } from '../utils/dateUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DocumentConfig;
  onSaveConfig: (newConfig: DocumentConfig) => void;
  onApplySlotsToAllDays: (slots: string[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onApplySlotsToAllDays
}) => {
  const [formData, setFormData] = useState<DocumentConfig>({ ...config });
  const [newSlotInput, setNewSlotInput] = useState('');
  const [activeTab, setActiveTab] = useState<'slots' | 'headers' | 'notes'>('slots');

  if (!isOpen) return null;

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSlotInput.trim() && !formData.defaultSlots.includes(newSlotInput.trim())) {
      setFormData({
        ...formData,
        defaultSlots: [...formData.defaultSlots, newSlotInput.trim()]
      });
      setNewSlotInput('');
    }
  };

  const handleRemoveSlot = (index: number) => {
    setFormData({
      ...formData,
      defaultSlots: formData.defaultSlots.filter((_, i) => i !== index)
    });
  };

  const handleResetSlots = () => {
    setFormData({
      ...formData,
      defaultSlots: [...DEFAULT_TIME_SLOTS]
    });
  };

  const handleSave = () => {
    onSaveConfig(formData);
    onClose();
  };

  const handleApplyToAll = () => {
    onSaveConfig(formData);
    onApplySlotsToAllDays(formData.defaultSlots);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#D1D5DB] overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] bg-[#F8FAFC]">
          <div>
            <h2 className="text-[10px] font-bold text-[#6366F1] uppercase tracking-widest">
              Configuration
            </h2>
            <h3 className="text-sm font-bold text-[#111827]">
              Pengaturan Format & Dokumen
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB] px-5 gap-4 text-xs font-bold bg-white">
          <button
            onClick={() => setActiveTab('slots')}
            className={`py-2.5 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'slots'
                ? 'border-[#6366F1] text-[#6366F1]'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Slot Waktu ({formData.defaultSlots.length})
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`py-2.5 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'headers'
                ? 'border-[#6366F1] text-[#6366F1]'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Kop & Kolom TTD
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-2.5 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'notes'
                ? 'border-[#6366F1] text-[#6366F1]'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Catatan
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 max-h-[55vh] overflow-y-auto space-y-4">
          {activeTab === 'slots' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase mb-1.5">
                  Slot Waktu Default Per Hari Kerja:
                </label>
                <div className="space-y-1.5">
                  {formData.defaultSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-[#EEF2FF] text-[#6366F1] text-[11px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={slot}
                          onChange={(e) => {
                            const updated = [...formData.defaultSlots];
                            updated[index] = e.target.value;
                            setFormData({ ...formData, defaultSlots: updated });
                          }}
                          className="text-xs font-semibold text-[#111827] bg-transparent border-none outline-none focus:ring-1 focus:ring-[#6366F1] rounded px-1"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveSlot(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Slot */}
              <form onSubmit={handleAddSlot} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: 16.00 - 17.00"
                  value={newSlotInput}
                  onChange={(e) => setNewSlotInput(e.target.value)}
                  className="flex-1 border border-[#D1D5DB] rounded px-2.5 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </form>

              <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={handleResetSlots}
                  className="text-[11px] text-[#6B7280] hover:text-[#111827] flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset ke 3 Slot Standar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'headers' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase mb-1">
                  Judul Kolom Penyerah (Kiri)
                </label>
                <input
                  type="text"
                  value={formData.senderTitle}
                  onChange={(e) => setFormData({ ...formData, senderTitle: e.target.value })}
                  placeholder="TTD Yang Menyerahkan"
                  className="w-full border border-[#D1D5DB] rounded px-2.5 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase mb-1">
                  Judul Kolom Penerima (Kanan)
                </label>
                <input
                  type="text"
                  value={formData.receiverTitle}
                  onChange={(e) => setFormData({ ...formData, receiverTitle: e.target.value })}
                  placeholder="TTD Yang Menerima"
                  className="w-full border border-[#D1D5DB] rounded px-2.5 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
              </div>

              <div className="pt-2 border-t border-[#E5E7EB]">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={formData.showCompanyHeader}
                    onChange={(e) => setFormData({ ...formData, showCompanyHeader: e.target.checked })}
                    className="w-3.5 h-3.5 text-[#6366F1] rounded"
                  />
                  <span className="text-xs font-bold text-[#111827]">
                    Tampilkan Kop Perusahaan di Atas Tabel
                  </span>
                </label>

                {formData.showCompanyHeader && (
                  <div className="space-y-2 pl-4 border-l-2 border-[#6366F1]">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                        Nama Perusahaan
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="PT. Sumber Makmur Abadi"
                        className="w-full border border-[#D1D5DB] rounded px-2.5 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#6366F1]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-1">
                        Departemen / Divisi
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="Divisi Finance & Tax"
                        className="w-full border border-[#D1D5DB] rounded px-2.5 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#6366F1]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer mb-1">
                <input
                  type="checkbox"
                  checked={formData.showFooterNotes}
                  onChange={(e) => setFormData({ ...formData, showFooterNotes: e.target.checked })}
                  className="w-3.5 h-3.5 text-[#6366F1] rounded"
                />
                <span className="text-xs font-bold text-[#111827]">
                  Tampilkan Catatan di Bawah Dokumen
                </span>
              </label>

              {formData.showFooterNotes && (
                <div>
                  <textarea
                    rows={3}
                    value={formData.footerNotes}
                    onChange={(e) => setFormData({ ...formData, footerNotes: e.target.value })}
                    placeholder="Tuliskan catatan instruksi di sini..."
                    className="w-full border border-[#D1D5DB] rounded p-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-[#6366F1]"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E5E7EB] flex items-center justify-between flex-wrap gap-2">
          {activeTab === 'slots' && (
            <button
              onClick={handleApplyToAll}
              className="text-[11px] text-[#4F46E5] hover:text-[#4338CA] font-bold underline"
            >
              Terapkan ke Semua Hari Aktif
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white border border-[#D1D5DB] hover:bg-gray-50 text-[#374151] rounded text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Simpan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
