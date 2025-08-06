import { KertasKerjaPerubahan } from './csvParser';
import { formatCurrency, formatNumber } from './validation';

// Export to CSV
export const exportToCSV = (data: KertasKerjaPerubahan[], filename: string = 'kertas-kerja-perubahan') => {
  if (data.length === 0) {
    alert('Tidak ada data untuk diekspor');
    return;
  }

  // Define headers
  const headers = [
    'KODE_BIDANG', 'NAMA_BIDANG', 'KODE_STANDAR', 'NAMA_STANDAR',
    'ID_GIAT', 'KODE_GIAT', 'NAMA_GIAT', 'SUBTITLE',
    'KODE_DANA', 'NAMA_DANA', 'KODE_REKENING', 'NAMA_REKENING',
    'ID_RINCIAN', 'IDKOMPONEN', 'KODE_KOMPONEN', 'NAMA_KOMPONEN',
    'SATUAN', 'MERK', 'SPEK', 'PAJAK',
    'VOLUME', 'HARGA_SATUAN', 'KOEFISIEN',
    'VOL1', 'SAT1', 'VOL2', 'SAT2', 'VOL3', 'SAT3', 'VOL4', 'SAT4',
    'NILAI_RINCIAN_MURNI', 'NILAI_RINCIAN', 'SUB_RINCIAN',
    'KETERANGAN_RINCIAN', 'KETERANGAN',
    'BULAN_1_AKB', 'BULAN_2_AKB', 'BULAN_3_AKB', 'TW_1_AKB',
    'BULAN_4_AKB', 'BULAN_5_AKB', 'BULAN_6_AKB', 'TW_2_AKB',
    'BULAN_7_AKB', 'BULAN_8_AKB', 'BULAN_9_AKB', 'TW_3_AKB',
    'BULAN_10_AKB', 'BULAN_11_AKB', 'BULAN_12_AKB', 'TW_4_AKB',
    'TOTAL_AKB',
    'BULAN_1_REALISASI', 'BULAN_2_REALISASI', 'BULAN_3_REALISASI', 'TW_1_REALISASI',
    'BULAN_4_REALISASI', 'BULAN_5_REALISASI', 'BULAN_6_REALISASI', 'TW_2_REALISASI',
    'BULAN_7_REALISASI', 'BULAN_8_REALISASI', 'BULAN_9_REALISASI', 'TW_3_REALISASI',
    'BULAN_10_REALISASI', 'BULAN_11_REALISASI', 'BULAN_12_REALISASI', 'TW_4_REALISASI',
    'TOTAL_REALISASI'
  ];

  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      item.kodeBidang || '',
      `"${item.namaBidang || ''}"`,
      item.kodeStandar || '',
      `"${item.namaStandar || ''}"`,
      item.idGiat || '',
      item.kodeGiat || '',
      `"${item.namaGiat || ''}"`,
      `"${item.subtitle || ''}"`,
      item.kodeDana || '',
      `"${item.namaDana || ''}"`,
      item.kodeRekening || '',
      `"${item.namaRekening || ''}"`,
      item.idRincian || '',
      item.idKomponen || '',
      item.kodeKomponen || '',
      `"${item.namaKomponen || ''}"`,
      item.satuan || '',
      `"${item.merk || ''}"`,
      `"${item.spek || ''}"`,
      item.pajak || '',
      item.volume || 0,
      item.hargaSatuan || 0,
      item.koefisien || '',
      item.vol1 || '',
      item.sat1 || '',
      item.vol2 || '',
      item.sat2 || '',
      item.vol3 || '',
      item.sat3 || '',
      item.vol4 || '',
      item.sat4 || '',
      item.nilaiRincianMurni || 0,
      item.nilaiRincian || 0,
      item.subRincian || '',
      `"${item.keteranganRincian || ''}"`,
      `"${item.keterangan || ''}"`,
      item.anggaranBulan1 || 0,
      item.anggaranBulan2 || 0,
      item.anggaranBulan3 || 0,
      item.anggaranTw1 || 0,
      item.anggaranBulan4 || 0,
      item.anggaranBulan5 || 0,
      item.anggaranBulan6 || 0,
      item.anggaranTw2 || 0,
      item.anggaranBulan7 || 0,
      item.anggaranBulan8 || 0,
      item.anggaranBulan9 || 0,
      item.anggaranTw3 || 0,
      item.anggaranBulan10 || 0,
      item.anggaranBulan11 || 0,
      item.anggaranBulan12 || 0,
      item.anggaranTw4 || 0,
      item.totalAkb || 0,
      item.realisasiBulan1 || 0,
      item.realisasiBulan2 || 0,
      item.realisasiBulan3 || 0,
      item.realisasiTw1 || 0,
      item.realisasiBulan4 || 0,
      item.realisasiBulan5 || 0,
      item.realisasiBulan6 || 0,
      item.realisasiTw2 || 0,
      item.realisasiBulan7 || 0,
      item.realisasiBulan8 || 0,
      item.realisasiBulan9 || 0,
      item.realisasiTw3 || 0,
      item.realisasiBulan10 || 0,
      item.realisasiBulan11 || 0,
      item.realisasiBulan12 || 0,
      item.realisasiTw4 || 0,
      item.totalRealisasi || 0
    ].join(','))
  ].join('\n');

  // Download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to Excel (using HTML table format)
export const exportToExcel = (data: KertasKerjaPerubahan[], filename: string = 'kertas-kerja-perubahan') => {
  if (data.length === 0) {
    alert('Tidak ada data untuk diekspor');
    return;
  }

  // Create HTML table
  const tableHTML = `
    <table border="1">
      <thead>
        <tr>
          <th>Kode Bidang</th>
          <th>Nama Bidang</th>
          <th>Kode Standar</th>
          <th>Nama Standar</th>
          <th>ID Kegiatan</th>
          <th>Kode Kegiatan</th>
          <th>Nama Kegiatan</th>
          <th>Subtitle</th>
          <th>Kode Dana</th>
          <th>Nama Dana</th>
          <th>Kode Rekening</th>
          <th>Nama Rekening</th>
          <th>ID Rincian</th>
          <th>ID Komponen</th>
          <th>Kode Komponen</th>
          <th>Nama Komponen</th>
          <th>Satuan</th>
          <th>Merk</th>
          <th>Spesifikasi</th>
          <th>Pajak</th>
          <th>Volume</th>
          <th>Harga Satuan</th>
          <th>Koefisien</th>
          <th>Vol 1</th>
          <th>Sat 1</th>
          <th>Vol 2</th>
          <th>Sat 2</th>
          <th>Vol 3</th>
          <th>Sat 3</th>
          <th>Vol 4</th>
          <th>Sat 4</th>
          <th>Nilai Rincian Murni</th>
          <th>Nilai Rincian</th>
          <th>Sub Rincian</th>
          <th>Keterangan Rincian</th>
          <th>Keterangan</th>
          <th>Anggaran Bulan 1</th>
          <th>Anggaran Bulan 2</th>
          <th>Anggaran Bulan 3</th>
          <th>Anggaran TW 1</th>
          <th>Anggaran Bulan 4</th>
          <th>Anggaran Bulan 5</th>
          <th>Anggaran Bulan 6</th>
          <th>Anggaran TW 2</th>
          <th>Anggaran Bulan 7</th>
          <th>Anggaran Bulan 8</th>
          <th>Anggaran Bulan 9</th>
          <th>Anggaran TW 3</th>
          <th>Anggaran Bulan 10</th>
          <th>Anggaran Bulan 11</th>
          <th>Anggaran Bulan 12</th>
          <th>Anggaran TW 4</th>
          <th>Total AKB</th>
          <th>Realisasi Bulan 1</th>
          <th>Realisasi Bulan 2</th>
          <th>Realisasi Bulan 3</th>
          <th>Realisasi TW 1</th>
          <th>Realisasi Bulan 4</th>
          <th>Realisasi Bulan 5</th>
          <th>Realisasi Bulan 6</th>
          <th>Realisasi TW 2</th>
          <th>Realisasi Bulan 7</th>
          <th>Realisasi Bulan 8</th>
          <th>Realisasi Bulan 9</th>
          <th>Realisasi TW 3</th>
          <th>Realisasi Bulan 10</th>
          <th>Realisasi Bulan 11</th>
          <th>Realisasi Bulan 12</th>
          <th>Realisasi TW 4</th>
          <th>Total Realisasi</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            <td>${item.kodeBidang || ''}</td>
            <td>${item.namaBidang || ''}</td>
            <td>${item.kodeStandar || ''}</td>
            <td>${item.namaStandar || ''}</td>
            <td>${item.idGiat || ''}</td>
            <td>${item.kodeGiat || ''}</td>
            <td>${item.namaGiat || ''}</td>
            <td>${item.subtitle || ''}</td>
            <td>${item.kodeDana || ''}</td>
            <td>${item.namaDana || ''}</td>
            <td>${item.kodeRekening || ''}</td>
            <td>${item.namaRekening || ''}</td>
            <td>${item.idRincian || ''}</td>
            <td>${item.idKomponen || ''}</td>
            <td>${item.kodeKomponen || ''}</td>
            <td>${item.namaKomponen || ''}</td>
            <td>${item.satuan || ''}</td>
            <td>${item.merk || ''}</td>
            <td>${item.spek || ''}</td>
            <td>${item.pajak || ''}</td>
            <td>${formatNumber(item.volume || 0)}</td>
            <td>${formatCurrency(item.hargaSatuan || 0)}</td>
            <td>${item.koefisien || ''}</td>
            <td>${item.vol1 || ''}</td>
            <td>${item.sat1 || ''}</td>
            <td>${item.vol2 || ''}</td>
            <td>${item.sat2 || ''}</td>
            <td>${item.vol3 || ''}</td>
            <td>${item.sat3 || ''}</td>
            <td>${item.vol4 || ''}</td>
            <td>${item.sat4 || ''}</td>
            <td>${formatCurrency(item.nilaiRincianMurni || 0)}</td>
            <td>${formatCurrency(item.nilaiRincian || 0)}</td>
            <td>${item.subRincian || ''}</td>
            <td>${item.keteranganRincian || ''}</td>
            <td>${item.keterangan || ''}</td>
            <td>${formatCurrency(item.anggaranBulan1 || 0)}</td>
            <td>${formatCurrency(item.anggaranBulan2 || 0)}</td>
            <td>${formatCurrency(item.anggaranBulan3 || 0)}</td>
            <td>${formatCurrency(item.anggaranTw1 || 0)}</td>
            <td>${formatCurrency(item.anggaranBulan4 || 0)}</td>
            <td>${formatCurrency(item.anggaranBulan5 || 0)}</td>
            <td>${formatCurrency(item.anggaranBulan6 || 0)}</td>
            <td>${formatCurrency(item.anggaranTw2 || 0)}</td>
            <td>${formatCurrency(item.anggaranBulan7 || 0)}</td>
            <td>${formatCurrency(item.anggaranBulan8 || 0)}</td>
            <td>${formatCurrency(item.anggaranBulan9 || 0)}</td>
            <td>${formatCurrency(item.anggaranTw3 || 0)}</td>
            <td>${formatCurrency(item.anggaranBulan10 || 0)}</td>
            <td>${formatCurrency(item.anggaranBulan11 || 0)}</td>
            <td>${formatCurrency(item.anggaranBulan12 || 0)}</td>
            <td>${formatCurrency(item.anggaranTw4 || 0)}</td>
            <td>${formatCurrency(item.totalAkb || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan1 || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan2 || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan3 || 0)}</td>
            <td>${formatCurrency(item.realisasiTw1 || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan4 || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan5 || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan6 || 0)}</td>
            <td>${formatCurrency(item.realisasiTw2 || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan7 || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan8 || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan9 || 0)}</td>
            <td>${formatCurrency(item.realisasiTw3 || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan10 || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan11 || 0)}</td>
            <td>${formatCurrency(item.realisasiBulan12 || 0)}</td>
            <td>${formatCurrency(item.realisasiTw4 || 0)}</td>
            <td>${formatCurrency(item.totalRealisasi || 0)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Create Excel file
  const blob = new Blob([tableHTML], {
    type: 'application/vnd.ms-excel;charset=utf-8;'
  });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to PDF (using HTML to PDF conversion)
export const exportToPDF = (data: KertasKerjaPerubahan[]) => {
  if (data.length === 0) {
    alert('Tidak ada data untuk diekspor');
    return;
  }

  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Popup diblokir. Silakan izinkan popup untuk mengekspor PDF.');
    return;
  }

  // Calculate summary data
  const totalAkb = data.reduce((sum, item) => sum + (item.totalAkb || 0), 0);
  const totalRealisasi = data.reduce((sum, item) => sum + (item.totalRealisasi || 0), 0);
  const persentaseRealisasi = totalAkb > 0 ? (totalRealisasi / totalAkb) * 100 : 0;

  // Group data by bidang
  const groupedData = data.reduce((acc, item) => {
    const bidang = item.namaBidang || 'Tidak Diketahui';
    if (!acc[bidang]) {
      acc[bidang] = [];
    }
    acc[bidang].push(item);
    return acc;
  }, {} as Record<string, KertasKerjaPerubahan[]>);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Laporan Kertas Kerja Perubahan</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #2563eb;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .summary {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          border: 1px solid #e2e8f0;
        }
        .summary h2 {
          margin-top: 0;
          color: #1e40af;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-value {
          font-size: 18px;
          font-weight: bold;
          color: #059669;
        }
        .summary-label {
          color: #6b7280;
          margin-top: 5px;
        }
        .bidang-section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        .bidang-header {
          background: #3b82f6;
          color: white;
          padding: 15px;
          border-radius: 8px 8px 0 0;
          font-weight: bold;
          font-size: 16px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 10px;
        }
        th, td {
          border: 1px solid #d1d5db;
          padding: 8px;
          text-align: left;
        }
        th {
          background: #f3f4f6;
          font-weight: bold;
          color: #374151;
        }
        tr:nth-child(even) {
          background: #f9fafb;
        }
        .currency {
          text-align: right;
          font-family: monospace;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Laporan Kertas Kerja Perubahan</h1>
        <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
        <p>Total Data: ${data.length} item</p>
      </div>

      <div class="summary">
        <h2>Ringkasan Keuangan</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-value">${formatCurrency(totalAkb)}</div>
            <div class="summary-label">Total Anggaran (AKB)</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${formatCurrency(totalRealisasi)}</div>
            <div class="summary-label">Total Realisasi</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${persentaseRealisasi.toFixed(2)}%</div>
            <div class="summary-label">Persentase Realisasi</div>
          </div>
        </div>
      </div>

      ${Object.entries(groupedData).map(([bidang, items], index) => `
        ${index > 0 ? '<div class="page-break"></div>' : ''}
        <div class="bidang-section">
          <div class="bidang-header">
            ${bidang} (${items.length} item)
          </div>
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Kegiatan</th>
                <th>Komponen</th>
                <th>Satuan</th>
                <th>Volume</th>
                <th>Harga Satuan</th>
                <th>Total AKB</th>
                <th>Total Realisasi</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => {
                const percentage = item.totalAkb && item.totalAkb > 0 
                  ? ((item.totalRealisasi || 0) / item.totalAkb) * 100 
                  : 0;
                return `
                  <tr>
                    <td>${item.kodeGiat || ''}</td>
                    <td>${(item.namaGiat || '').substring(0, 50)}${(item.namaGiat || '').length > 50 ? '...' : ''}</td>
                    <td>${(item.namaKomponen || '').substring(0, 30)}${(item.namaKomponen || '').length > 30 ? '...' : ''}</td>
                    <td>${item.satuan || ''}</td>
                    <td class="currency">${formatNumber(item.volume || 0)}</td>
                    <td class="currency">${formatCurrency(item.hargaSatuan || 0)}</td>
                    <td class="currency">${formatCurrency(item.totalAkb || 0)}</td>
                    <td class="currency">${formatCurrency(item.totalRealisasi || 0)}</td>
                    <td class="currency">${percentage.toFixed(1)}%</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `).join('')}

      <div class="footer">
        <p>Dokumen ini dibuat secara otomatis oleh Sistem Manajemen R-KAS</p>
        <p>© ${new Date().getFullYear()} - Semua hak dilindungi</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
};

// Export filtered data based on current filters
export const exportFilteredData = (
  data: KertasKerjaPerubahan[],
  filters: Record<string, unknown>,
  format: 'csv' | 'excel' | 'pdf',
  filename?: string
) => {
  // Apply filters to data (this would use the same logic as AdvancedFilters component)
  let filteredData = [...data];
  
  // Text search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredData = filteredData.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchLower)
      )
    );
  }
  
  // Bidang filter
  if (filters.bidang && filters.bidang.length > 0) {
    filteredData = filteredData.filter(item =>
      filters.bidang.includes(item.namaBidang)
    );
  }
  
  // Date range filter (if applicable)
  // Add more filter logic as needed
  
  const baseFilename = filename || `kertas-kerja-filtered-${new Date().toISOString().split('T')[0]}`;
  
  switch (format) {
    case 'csv':
      exportToCSV(filteredData, baseFilename);
      break;
    case 'excel':
      exportToExcel(filteredData, baseFilename);
      break;
    case 'pdf':
      exportToPDF(filteredData);
      break;
    default:
      console.error('Format tidak didukung:', format);
  }
};

// Generate summary report
export const generateSummaryReport = (data: KertasKerjaPerubahan[]) => {
  const summary = {
    totalItems: data.length,
    totalAkb: data.reduce((sum, item) => sum + (item.totalAkb || 0), 0),
    totalRealisasi: data.reduce((sum, item) => sum + (item.totalRealisasi || 0), 0),
    bidangCount: new Set(data.map(item => item.namaBidang)).size,
    kegiatanCount: new Set(data.map(item => item.namaGiat)).size,
    komponenCount: new Set(data.map(item => item.namaKomponen)).size,
    
    // Group by bidang
    byBidang: data.reduce((acc, item) => {
      const bidang = item.namaBidang || 'Tidak Diketahui';
      if (!acc[bidang]) {
        acc[bidang] = {
          count: 0,
          totalAkb: 0,
          totalRealisasi: 0
        };
      }
      acc[bidang].count++;
      acc[bidang].totalAkb += item.totalAkb || 0;
      acc[bidang].totalRealisasi += item.totalRealisasi || 0;
      return acc;
    }, {} as Record<string, { count: number; totalAkb: number; totalRealisasi: number }>),
    
    // Monthly breakdown
    monthlyBreakdown: {
      anggaran: {
        bulan1: data.reduce((sum, item) => sum + (item.anggaranBulan1 || 0), 0),
        bulan2: data.reduce((sum, item) => sum + (item.anggaranBulan2 || 0), 0),
        bulan3: data.reduce((sum, item) => sum + (item.anggaranBulan3 || 0), 0),
        bulan4: data.reduce((sum, item) => sum + (item.anggaranBulan4 || 0), 0),
        bulan5: data.reduce((sum, item) => sum + (item.anggaranBulan5 || 0), 0),
        bulan6: data.reduce((sum, item) => sum + (item.anggaranBulan6 || 0), 0),
        bulan7: data.reduce((sum, item) => sum + (item.anggaranBulan7 || 0), 0),
        bulan8: data.reduce((sum, item) => sum + (item.anggaranBulan8 || 0), 0),
        bulan9: data.reduce((sum, item) => sum + (item.anggaranBulan9 || 0), 0),
        bulan10: data.reduce((sum, item) => sum + (item.anggaranBulan10 || 0), 0),
        bulan11: data.reduce((sum, item) => sum + (item.anggaranBulan11 || 0), 0),
        bulan12: data.reduce((sum, item) => sum + (item.anggaranBulan12 || 0), 0),
      },
      realisasi: {
        bulan1: data.reduce((sum, item) => sum + (item.realisasiBulan1 || 0), 0),
        bulan2: data.reduce((sum, item) => sum + (item.realisasiBulan2 || 0), 0),
        bulan3: data.reduce((sum, item) => sum + (item.realisasiBulan3 || 0), 0),
        bulan4: data.reduce((sum, item) => sum + (item.realisasiBulan4 || 0), 0),
        bulan5: data.reduce((sum, item) => sum + (item.realisasiBulan5 || 0), 0),
        bulan6: data.reduce((sum, item) => sum + (item.realisasiBulan6 || 0), 0),
        bulan7: data.reduce((sum, item) => sum + (item.realisasiBulan7 || 0), 0),
        bulan8: data.reduce((sum, item) => sum + (item.realisasiBulan8 || 0), 0),
        bulan9: data.reduce((sum, item) => sum + (item.realisasiBulan9 || 0), 0),
        bulan10: data.reduce((sum, item) => sum + (item.realisasiBulan10 || 0), 0),
        bulan11: data.reduce((sum, item) => sum + (item.realisasiBulan11 || 0), 0),
        bulan12: data.reduce((sum, item) => sum + (item.realisasiBulan12 || 0), 0),
      }
    }
  };
  
  // Calculate percentage
  summary['persentaseRealisasi'] = summary.totalAkb > 0 
    ? (summary.totalRealisasi / summary.totalAkb) * 100 
    : 0;
  
  return summary;
};