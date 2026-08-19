export interface TimeSlot {
  id: string;
  waktu: string;
  catatan?: string;
  menyerahkan?: string;
  menerima?: string;
  expedisi?: string[]; // e.g. ['J&T', 'JNE', 'SPX', 'ID']
}

export interface DayData {
  id: string;
  hari: string;
  tanggal: string; // e.g. "01 Juni 2026"
  rawDate?: string; // YYYY-MM-DD
  isMinggu: boolean;
  isLibur: boolean;
  keteranganLibur?: string;
  slots: TimeSlot[];
}

export interface DocumentConfig {
  title: string;
  companyName: string;
  department: string;
  month: string;
  year: number;
  senderTitle: string;
  receiverTitle: string;
  expedisiTitle?: string;
  expedisiList: string[]; // ['J&T', 'JNE', 'SPX', 'ID']
  defaultSlots: string[];
  showCompanyHeader: boolean;
  showFooterNotes: boolean;
  footerNotes: string;
}
