import { DayData, DocumentConfig } from '../types';

export function handlePrintToNewTab(
  tableElement: HTMLElement | null,
  config: DocumentConfig
) {
  if (!tableElement) {
    window.print();
    return;
  }

  // Clone table and replace inputs with their values for print fidelity
  const cloned = tableElement.cloneNode(true) as HTMLElement;
  const originalInputs = tableElement.querySelectorAll('input');
  const clonedInputs = cloned.querySelectorAll('input');
  originalInputs.forEach((origInput, idx) => {
    const val = (origInput as HTMLInputElement).value;
    if (clonedInputs[idx]) {
      const span = document.createElement('span');
      span.className = 'font-bold text-xs inline-block text-center w-full';
      span.textContent = val || '';
      clonedInputs[idx].parentNode?.replaceChild(span, clonedInputs[idx]);
    }
  });

  const tableContent = cloned.outerHTML;
  const currentTitle = `${config.title} ${config.month.toUpperCase()} ${config.year}`;

  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <title>Print - ${currentTitle}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
              body {
                  background-color: #334155;
                  padding: 2rem 0;
                  font-family: 'Plus Jakarta Sans', sans-serif;
              }
              
              .a4-preview {
                  background-color: white;
                  width: 210mm;
                  min-height: 297mm;
                  margin: 0 auto 2rem auto;
                  padding: 8mm 10mm;
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
                  box-sizing: border-box;
                  position: relative;
              }

              .print-hidden {
                  display: none !important;
              }

              /* Exact background print colors */
              * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
              }

              @media print {
                  @page {
                      size: A4 portrait;
                      margin: 8mm 10mm 10mm 10mm;
                  }
                  body {
                      background-color: white !important;
                      padding: 0 !important;
                  }
                  .a4-preview {
                      width: 100% !important;
                      min-height: auto !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      box-shadow: none !important;
                      page-break-after: always;
                  }
                  .a4-preview:last-child {
                      page-break-after: auto;
                  }
                  .no-print {
                      display: none !important;
                  }
              }
          </style>
      </head>
      <body>
          <div class="no-print flex flex-col items-center mb-8 sticky top-4 z-50">
              <div class="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl flex flex-col items-center max-w-lg mx-auto">
                  <div class="flex items-center gap-3">
                      <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2 text-sm">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                          Cetak Dokumen Sekarang (Ctrl + P)
                      </button>
                      <button onclick="window.close()" class="bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2.5 px-4 rounded-xl transition text-sm">
                          Tutup
                      </button>
                  </div>
                  <p class="text-slate-300 mt-2 text-xs text-center">
                    Dokumen dipaginasi otomatis ke <b>A4 Portrait</b> dengan kolom <b>EKSPEDISI (J&T, JNE, SPX, ID)</b>.
                  </p>
              </div>
          </div>
          
          <div id="pages-container"></div>
          
          <div id="source-table" style="display:none;">
              ${tableContent}
          </div>
          
          <script>
              window.onload = function() {
                  const MAX_TABLE_HEIGHT = 980; 
                  
                  const sourceTable = document.querySelector('#source-table table');
                  if (!sourceTable) return;

                  const theadHTML = sourceTable.querySelector('thead') ? sourceTable.querySelector('thead').outerHTML : '';
                  const tbodies = Array.from(sourceTable.querySelectorAll('tbody.print-avoid-break'));
                  
                  const container = document.getElementById('pages-container');
                  
                  if (tbodies.length === 0) {
                      const page = createPage(container, 1);
                      const table = createTable(page, theadHTML);
                      const emptyBody = sourceTable.querySelector('tbody');
                      if (emptyBody) table.appendChild(emptyBody.cloneNode(true));
                      return;
                  }

                  let pageNumber = 1;
                  let currentPage = createPage(container, pageNumber);
                  let currentTable = createTable(currentPage, theadHTML);
                  
                  tbodies.forEach((tbody, idx) => {
                      const clonedTbody = tbody.cloneNode(true);
                      currentTable.appendChild(clonedTbody);
                      
                      if (currentTable.offsetHeight > MAX_TABLE_HEIGHT && currentTable.querySelectorAll('tbody').length > 1) {
                          currentTable.removeChild(clonedTbody);
                          
                          pageNumber++;
                          currentPage = createPage(container, pageNumber);
                          currentTable = createTable(currentPage, theadHTML); 
                          currentTable.appendChild(clonedTbody);
                      }
                  });
              };
              
              function createPage(container, pageNum) {
                  const page = document.createElement('div');
                  page.className = 'a4-preview';
                  container.appendChild(page);
                  return page;
              }
              
              function createTable(page, theadHTML) {
                  const table = document.createElement('table');
                  table.className = 'w-full border-collapse border border-black text-xs';
                  table.innerHTML = theadHTML;
                  page.appendChild(table);
                  return table;
              }
          </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  } catch (err) {
    console.error('Error opening print tab, fallback to direct print', err);
    window.print();
  }
}

// Export data to CSV
export function exportToCSV(days: DayData[], config: DocumentConfig) {
  const couriers = config.expedisiList && config.expedisiList.length > 0
    ? config.expedisiList
    : ['J&T', 'JNE', 'SPX', 'ID'];

  const rows: string[][] = [
    [`PENYERAHAN INVOICE ${config.month.toUpperCase()} ${config.year}`],
    [config.companyName ? `Perusahaan: ${config.companyName}` : ''],
    ['Hari', 'Tanggal', 'Waktu', 'TTD Yang Menyerahkan', 'TTD Yang Menerima', ...couriers],
  ];

  days.forEach(day => {
    if (day.isLibur || day.isMinggu) {
      const liburCols = couriers.map(() => 'LIBUR');
      rows.push([day.hari, day.tanggal, 'LIBUR', 'LIBUR', 'LIBUR', ...liburCols]);
    } else {
      day.slots.forEach((slot, slotIdx) => {
        const courierValues = couriers.map(c => slot.expedisiQty?.[c] || '');
        rows.push([
          slotIdx === 0 ? day.hari : '',
          slotIdx === 0 ? day.tanggal : '',
          slot.waktu,
          slot.menyerahkan || '',
          slot.menerima || '',
          ...courierValues
        ]);
      });
    }
  });

  const csvContent = rows
    .map(e => e.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Penyerahan_Invoice_${config.month}_${config.year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
