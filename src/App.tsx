import React, { useState } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { InvoiceTable } from './components/InvoiceTable';
import { SettingsModal } from './components/SettingsModal';
import { HolidayPresetsModal } from './components/HolidayPresetsModal';
import { A4PagesPreview } from './components/A4PagesPreview';
import { DayData, DocumentConfig } from './types';
import { 
  MONTHS_ID, 
  DEFAULT_TIME_SLOTS, 
  generateDayData, 
  generateMonthData,
  createDefaultSlots
} from './utils/dateUtils';
import { handlePrintToNewTab, exportToCSV } from './utils/printUtils';

export default function App() {
  const currentDate = new Date();
  const currentMonth = MONTHS_ID[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Document Configuration State
  const [config, setConfig] = useState<DocumentConfig>(() => {
    return {
      title: 'PENYERAHAN INVOICE',
      companyName: '',
      department: '',
      month: currentMonth,
      year: currentYear,
      senderTitle: 'TTD Yang Menyerahkan',
      receiverTitle: 'TTD Yang Menerima',
      defaultSlots: [...DEFAULT_TIME_SLOTS],
      showCompanyHeader: false,
      showFooterNotes: false,
      footerNotes: 'Dokumen tanda terima asli wajib disimpan dan diarsipkan oleh Bagian Keuangan / Finance.'
    };
  });

  // Days Data State (Initializes with 1 full month of current month)
  const [daysData, setDaysData] = useState<DayData[]>(() => {
    return generateMonthData(currentMonth, currentYear, DEFAULT_TIME_SLOTS);
  });

  // UI States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHolidaysOpen, setIsHolidaysOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'a4-pages'>('table');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Generate 1 Full Month
  const handleGenerateMonth = () => {
    const generated = generateMonthData(config.month, config.year, config.defaultSlots);
    setDaysData(generated);
    showNotification(`Berhasil generate ${generated.length} hari untuk bulan ${config.month} ${config.year}!`);
  };

  // Add Today
  const handleAddToday = () => {
    const todayData = generateDayData(new Date(), Date.now().toString(), config.defaultSlots);
    setDaysData(prev => [...prev, todayData]);
    showNotification('Hari ini berhasil ditambahkan ke daftar.');
  };

  // Add Empty Placeholder Day
  const handleAddEmptyDay = () => {
    const emptyDayId = `day-${Date.now()}`;
    const emptyDay: DayData = {
      id: emptyDayId,
      hari: '......',
      tanggal: '.. ........... ....',
      isMinggu: false,
      isLibur: false,
      slots: createDefaultSlots(config.defaultSlots, emptyDayId)
    };
    setDaysData(prev => [...prev, emptyDay]);
    showNotification('Hari kosong bertitik-titik ditambahkan.');
  };

  // Add Custom Calendar Date
  const handleAddCustomDate = (dateString: string) => {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);
      const dateObj = new Date(year, month, day);
      const customDay = generateDayData(dateObj, `custom-${Date.now()}`, config.defaultSlots);
      setDaysData(prev => [...prev, customDay]);
      showNotification(`Tanggal ${customDay.tanggal} ditambahkan.`);
    }
  };

  // Remove a Day
  const handleRemoveDay = (id: string) => {
    setDaysData(prev => prev.filter(day => day.id !== id));
  };

  // Toggle Holiday / Working day
  const handleToggleLibur = (id: string) => {
    setDaysData(prev =>
      prev.map(day => {
        if (day.id === id) {
          const newIsLibur = !day.isLibur;
          return {
            ...day,
            isLibur: newIsLibur,
            keteranganLibur: newIsLibur ? 'LIBUR' : undefined,
            slots: newIsLibur
              ? [{ id: `${day.id}-slot-libur`, waktu: 'LIBUR' }]
              : createDefaultSlots(config.defaultSlots, day.id)
          };
        }
        return day;
      })
    );
  };

  // Add a slot to a day
  const handleAddSlotToDay = (dayId: string) => {
    setDaysData(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          const newSlotNumber = day.slots.length + 1;
          const newSlot = {
            id: `${day.id}-slot-${newSlotNumber}-${Date.now()}`,
            waktu: '16.00 - 17.00'
          };
          return {
            ...day,
            slots: [...day.slots, newSlot]
          };
        }
        return day;
      })
    );
  };

  // Remove a slot from a day
  const handleRemoveSlotFromDay = (dayId: string, slotId: string) => {
    setDaysData(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          if (day.slots.length <= 1) return day;
          return {
            ...day,
            slots: day.slots.filter(s => s.id !== slotId)
          };
        }
        return day;
      })
    );
  };

  // Update Slot Time
  const handleUpdateSlotTime = (dayId: string, slotId: string, newTime: string) => {
    setDaysData(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            slots: day.slots.map(s => (s.id === slotId ? { ...s, waktu: newTime } : s))
          };
        }
        return day;
      })
    );
  };

  // Move Day up / down
  const handleMoveDay = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= daysData.length) return;

    const newDays = [...daysData];
    const temp = newDays[index];
    newDays[index] = newDays[targetIndex];
    newDays[targetIndex] = temp;
    setDaysData(newDays);
  };

  // Clear All
  const handleClearAll = () => {
    if (window.confirm('Kosongkan semua baris tabel?')) {
      setDaysData([]);
      showNotification('Tabel berhasil dikosongkan.');
    }
  };

  // Apply default slots to all working days
  const handleApplySlotsToAllDays = (newSlots: string[]) => {
    setDaysData(prev =>
      prev.map(day => {
        if (day.isLibur || day.isMinggu) return day;
        return {
          ...day,
          slots: createDefaultSlots(newSlots, day.id)
        };
      })
    );
    showNotification(`Slot waktu diperbarui untuk seluruh hari kerja!`);
  };

  // Mark multiple holidays from modal
  const handleMarkMultipleHolidays = (holidayMap: { [dayId: string]: string }) => {
    setDaysData(prev =>
      prev.map(day => {
        const isSelectedHoliday = !!holidayMap[day.id];
        if (isSelectedHoliday) {
          return {
            ...day,
            isLibur: true,
            keteranganLibur: 'LIBUR',
            slots: [{ id: `${day.id}-slot-libur`, waktu: 'LIBUR' }]
          };
        } else {
          return {
            ...day,
            isLibur: false,
            keteranganLibur: undefined,
            slots: day.slots.length > 0 && day.slots[0].waktu !== 'LIBUR'
              ? day.slots
              : createDefaultSlots(config.defaultSlots, day.id)
          };
        }
      })
    );
    showNotification('Daftar hari libur berhasil diperbarui.');
  };

  // Print Action
  const handlePrint = () => {
    const tableElem = document.getElementById('print-area');
    handlePrintToNewTab(tableElem, config);
  };

  // Export CSV
  const handleExport = () => {
    exportToCSV(daysData, config);
    showNotification('File CSV berhasil diunduh.');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans p-4 sm:p-6 antialiased">
      
      {/* Toast Notification */}
      {notification && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-gray-700 animate-fadeIn">
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        config={config}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHolidays={() => setIsHolidaysOpen(true)}
        onExportCSV={handleExport}
        onPrint={handlePrint}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        totalDays={daysData.length}
      />

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        <div className="space-y-6">
          {/* Top Control Panel */}
          <ControlPanel
            config={config}
            onChangeConfig={(newCfg) => setConfig(prev => ({ ...prev, ...newCfg }))}
            onGenerateMonth={handleGenerateMonth}
            onAddToday={handleAddToday}
            onAddEmptyDay={handleAddEmptyDay}
            onAddCustomDate={handleAddCustomDate}
            onClearAll={handleClearAll}
            onPrint={handlePrint}
            daysData={daysData}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenHolidays={() => setIsHolidaysOpen(true)}
          />

          {/* Invoice Table Document Card */}
          <InvoiceTable
            daysData={daysData}
            config={config}
            onRemoveDay={handleRemoveDay}
            onToggleLibur={handleToggleLibur}
            onAddSlotToDay={handleAddSlotToDay}
            onRemoveSlotFromDay={handleRemoveSlotFromDay}
            onUpdateSlotTime={handleUpdateSlotTime}
            onMoveDay={handleMoveDay}
            onGenerateMonth={handleGenerateMonth}
            onAddToday={handleAddToday}
          />
        </div>
      ) : (
        /* Multi-Page A4 Sheet View */
        <A4PagesPreview
          daysData={daysData}
          config={config}
          onBackToEditor={() => setViewMode('table')}
          onPrint={handlePrint}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={(newConfig) => {
          setConfig(newConfig);
          showNotification('Pengaturan format berhasil disimpan.');
        }}
        onApplySlotsToAllDays={handleApplySlotsToAllDays}
      />

      {/* Holiday Presets Modal */}
      <HolidayPresetsModal
        isOpen={isHolidaysOpen}
        onClose={() => setIsHolidaysOpen(false)}
        daysData={daysData}
        onToggleHoliday={handleToggleLibur}
        onMarkMultipleHolidays={handleMarkMultipleHolidays}
      />
    </div>
  );
}
