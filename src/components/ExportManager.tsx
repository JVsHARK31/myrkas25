import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File, X } from 'lucide-react';
import { KertasKerjaPerubahan } from '../utils/csvParser';
import { toast } from 'sonner';

interface ExportManagerProps {
  data: KertasKerjaPerubahan[];
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

const ExportManager: React.FC<ExportManagerProps> = ({ data, isOpen, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'kodeBidang', 'namaBidang', 'kodeGiat', 'namaGiat', 'namaKomponen', 
    'volume', 'hargaSatuan', 'nilaiRincian', 'totalAkb', 'totalRealisasi'
  ]);
  const [isExporting, setIsExporting] = useState(false);

  const availableFields = [
    { key: 'kodeBidang', label: 'Kode Bidang' },
    { key: 'namaBidang', label: 'Nama Bidang' },
    { key: 'kodeStandar', label: 'Kode Standar' },
    { key: 'namaStandar', label: 'Nama Standar' },
    { key: 'idGiat', label: 'ID Kegiatan' },
    { key: 'kodeGiat', label: 'Kode Kegiatan' },
    { key: 'namaGiat', label: 'Nama Kegiatan' },
    { key: 'subtitle', label: 'Subtitle' },
    { key: 'kodeDana', label: 'Kode Dana' },
    { key: 'namaDana', label: 'Nama Dana' },
    { key: 'kodeRekening', label: 'Kode Rekening' },
    { key: 'namaRekening', label: 'Nama Rekening' },
    { key: 'idRincian', label: 'ID Rincian' },
    { key: 'idKomponen', label: 'ID Komponen' },
    { key: 'kodeKomponen', label: 'Kode Komponen' },
    { key: 'namaKomponen', label: 'Nama Komponen' },
    { key: 'satuan', label: 'Satuan' },
    { key: 'merk', label: 'Merk' },
    { key: 'spek', label: 'Spesifikasi' },
    { key: 'pajak', label: 'Pajak' },
    { key: 'volume', label: 'Volume' },
    { key: 'hargaSatuan', label: 'Harga Satuan' },
    { key: 'koefisien', label: 'Koefisien' },
    { key: 'vol1', label: 'Volume 1' },
    { key: 'sat1', label: 'Satuan 1' },
    { key: 'vol2', label: 'Volume 2' },
    { key: 'sat2', label: 'Satuan 2' },
    { key: 'vol3', label: 'Volume 3' },
    { key: 'sat3', label: 'Satuan 3' },
    { key: 'vol4', label: 'Volume 4' },
    { key: 'sat4', label: 'Satuan 4' },
    { key: 'nilaiRincianMurni', label: 'Nilai Rincian Murni' },
    { key: 'nilaiRincian', label: 'Nilai Rincian' },
    { key: 'subRincian', label: 'Sub Rincian' },
    { key: 'keteranganRincian', label: 'Keterangan Rincian' },
    { key: 'keterangan', label: 'Keterangan' },
    { key: 'bulan1', label: 'Januari' },
    { key: 'bulan2', label: 'Februari' },
    { key: 'bulan3', label: 'Maret' },
    { key: 'tw1', label: 'TW 1' },
    { key: 'bulan4', label: 'April' },
    { key: 'bulan5', label: 'Mei' },
    { key: 'bulan6', label: 'Juni' },
    { key: 'tw2', label: 'TW 2' },
    { key: 'bulan7', label: 'Juli' },
    { key: 'bulan8', label: 'Agustus' },
    { key: 'bulan9', label: 'September' },
    { key: 'tw3', label: 'TW 3' },
    { key: 'bulan10', label: 'Oktober' },
    { key: 'bulan11', label: 'November' },
    { key: 'bulan12', label: 'Desember' },
    { key: 'tw4', label: 'TW 4' },
    { key: 'totalAkb', label: 'Total AKB' },
    { key: 'realisasiBulan1', label: 'Realisasi Januari' },
    { key: 'realisasiBulan2', label: 'Realisasi Februari' },
    { key: 'realisasiBulan3', label: 'Realisasi Maret' },
    { key: 'realisasiTw1', label: 'Realisasi TW 1' },
    { key: 'realisasiBulan4', label: 'Realisasi April' },
    { key: 'realisasiBulan5', label: 'Realisasi Mei' },
    { key: 'realisasiBulan6', label: 'Realisasi Juni' },
    { key: 'realisasiTw2', label: 'Realisasi TW 2' },
    { key: 'realisasiBulan7', label: 'Realisasi Juli' },
    { key: 'realisasiBulan8', label: 'Realisasi Agustus' },
    { key: 'realisasiBulan9', label: 'Realisasi September' },
    { key: 'realisasiTw3', label: 'Realisasi TW 3' },
    { key: 'realisasiBulan10', label: 'Realisasi Oktober' },
    { key: 'realisasiBulan11', label: 'Realisasi November' },
    { key: 'realisasiBulan12', label: 'Realisasi Desember' },
    { key: 'realisasiTw4', label: 'Realisasi TW 4' },
    { key: 'totalRealisasi', label: 'Total Realisasi' }
  ];

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values' },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
    { value: 'pdf', label: 'PDF', icon: File, description: 'Portable Document Format' },
    { value: 'json', label: 'JSON', icon: FileText, description: 'JavaScript Object Notation' }
  ];

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey)
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const selectAllFields = () => {
    setSelectedFields(availableFields.map(f => f.key));
  };

  const deselectAllFields = () => {
    setSelectedFields([]);
  };

  const exportToCSV = (data: KertasKerjaPerubahan[], fields: string[]) => {
    const headers = fields.map(field => 
      availableFields.find(f => f.key === field)?.label || field
    );
    
    const csvContent = [
      includeHeaders ? headers.join(',') : '',
      ...data.map(item => 
        fields.map(field => {
          const value = item[field as keyof KertasKerjaPerubahan];
          // Handle values that might contain commas
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value || '';
        }).join(',')
      )
    ].filter(Boolean).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rkas-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (data: KertasKerjaPerubahan[], fields: string[]) => {
    const filteredData = data.map(item => {
      const filtered: any = {};
      fields.forEach(field => {
        filtered[field] = item[field as keyof KertasKerjaPerubahan];
      });
      return filtered;
    });

    const jsonContent = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rkas-data-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data: KertasKerjaPerubahan[], fields: string[]) => {
    // For now, export as CSV with .xlsx extension
    // In a real application, you would use a library like xlsx
    const headers = fields.map(field => 
      availableFields.find(f => f.key === field)?.label || field
    );
    
    const csvContent = [
      includeHeaders ? headers.join('\t') : '',
      ...data.map(item => 
        fields.map(field => {
          const value = item[field as keyof KertasKerjaPerubahan];
          return value || '';
        }).join('\t')
      )
    ].filter(Boolean).join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rkas-data-${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (data: KertasKerjaPerubahan[], fields: string[]) => {
    // For now, create a simple HTML table and print
    // In a real application, you would use a library like jsPDF
    const headers = fields.map(field => 
      availableFields.find(f => f.key === field)?.label || field
    );
    
    const htmlContent = `
      <html>
        <head>
          <title>Data R-KAS</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .page-break { page-break-after: always; }
          </style>
        </head>
        <body>
          <h1>Data R-KAS</h1>
          <p>Diekspor pada: ${new Date().toLocaleDateString('id-ID')}</p>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  ${fields.map(field => {
                    const value = item[field as keyof KertasKerjaPerubahan];
                    return `<td>${value || ''}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      toast.error('Pilih minimal satu field untuk diekspor');
      return;
    }

    setIsExporting(true);
    try {
      switch (selectedFormat) {
        case 'csv':
          exportToCSV(data, selectedFields);
          break;
        case 'excel':
          exportToExcel(data, selectedFields);
          break;
        case 'pdf':
          exportToPDF(data, selectedFields);
          break;
        case 'json':
          exportToJSON(data, selectedFields);
          break;
      }
      
      toast.success(`Data berhasil diekspor ke format ${selectedFormat.toUpperCase()}`);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal mengekspor data');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Ekspor Data R-KAS</h2>
            <p className="text-sm text-gray-500 mt-1">
              {data.length} item akan diekspor
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Format Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Pilih Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {formatOptions.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value as ExportFormat)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedFormat === format.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <div className="font-medium">{format.label}</div>
                    <div className="text-xs text-gray-500">{format.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Opsi Ekspor</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Sertakan header kolom</span>
              </label>
            </div>
          </div>

          {/* Field Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Pilih Kolom</h3>
              <div className="space-x-2">
                <button
                  onClick={selectAllFields}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Pilih Semua
                </button>
                <button
                  onClick={deselectAllFields}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Hapus Semua
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableFields.map((field) => (
                <label key={field.key} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.key)}
                    onChange={() => handleFieldToggle(field.key)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 truncate" title={field.label}>
                    {field.label}
                  </span>
                </label>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 mt-2">
              {selectedFields.length} dari {availableFields.length} kolom dipilih
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Batal
          </button>
          
          <button
            onClick={handleExport}
            disabled={isExporting || selectedFields.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Mengekspor...' : 'Ekspor Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportManager;