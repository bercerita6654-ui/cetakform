import { DayData, TimeSlot } from '../types';

export const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const DAY_NAMES_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

export const DEFAULT_TIME_SLOTS = [
  '09.00 - 10.00',
  '12.00 - 13.00',
  '14.00 - 15.00'
];

// Helper to create slots array
export function createDefaultSlots(slotsList: string[] = DEFAULT_TIME_SLOTS, prefix: string): TimeSlot[] {
  return slotsList.map((slot, index) => ({
    id: `${prefix}-slot-${index + 1}-${Math.random().toString(36).substring(2, 7)}`,
    waktu: slot,
    menyerahkan: '',
    menerima: '',
    catatan: ''
  }));
}

// Generate single day data
export function generateDayData(
  dateObj: Date,
  uniqueSuffix: string = '',
  customSlots: string[] = DEFAULT_TIME_SLOTS
): DayData {
  const hari = DAY_NAMES_ID[dateObj.getDay()];
  const isMinggu = dateObj.getDay() === 0;

  const dayString = String(dateObj.getDate()).padStart(2, '0');
  const monthString = MONTHS_ID[dateObj.getMonth()];
  const yearString = dateObj.getFullYear();
  const tanggal = `${dayString} ${monthString} ${yearString}`;
  const rawDate = `${yearString}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dayString}`;

  const dayId = `day-${dateObj.getTime()}-${uniqueSuffix || Math.random().toString(36).substring(2, 7)}`;

  if (isMinggu) {
    return {
      id: dayId,
      hari,
      tanggal,
      rawDate,
      isMinggu: true,
      isLibur: true,
      keteranganLibur: 'LIBUR',
      slots: [{ id: `${dayId}-slot-libur`, waktu: 'LIBUR' }]
    };
  }

  return {
    id: dayId,
    hari,
    tanggal,
    rawDate,
    isMinggu: false,
    isLibur: false,
    slots: createDefaultSlots(customSlots, dayId)
  };
}

// Generate full month of days
export function generateMonthData(
  monthName: string,
  year: number,
  customSlots: string[] = DEFAULT_TIME_SLOTS
): DayData[] {
  const monthIndex = MONTHS_ID.indexOf(monthName);
  if (monthIndex === -1) return [];

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const result: DayData[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(year, monthIndex, i);
    result.push(generateDayData(dateObj, `gen-${i}`, customSlots));
  }

  return result;
}

// Format Date object to Indonesian date format
export function formatDateID(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}
