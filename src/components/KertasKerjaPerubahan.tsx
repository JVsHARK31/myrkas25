import React, { useState, useEffect } from 'react';
import { Upload, Download, FileText, TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { CSVParser, KertasKerjaPerubahan } from '../utils/csvParser';
import toast from 'react-hot-toast';

interface KertasKerjaPerubahanProps {
  onDataLoad?: (data: KertasKerjaPerubahan[]) => void;
}

export const KertasKerjaPerubahanComponent: React.FC<KertasKerjaPerubahanProps> = ({ onDataLoad }) => {
  const [data, setData] = useState<KertasKerjaPerubahan[]>([]);
  const [filteredData, setFilteredData] = useState<KertasKerjaPerubahan[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('');
  const [selectedView, setSelectedView] = useState<'table' | 'summary'>('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load CSV data on component mount
  useEffect(() => {
    loadDefaultCSV();
  }, []);

  // Filter data based on search and bidang
  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.namaKomponen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaBidang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaGiat.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBidang) {
      filtered = filtered.filter(item => item.kodeBidang === selectedBidang);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, searchTerm, selectedBidang]);

  const loadDefaultCSV = async () => {
    setLoading(true);
    try {
      // Try to load from public folder or use fetch
      const response = await fetch('/KERTASKERJAPERUBAHAN.csv');
      if (response.ok) {
        const content = await response.text();
        const parsedData = CSVParser.parseCSV(content);
        setData(parsedData);
        onDataLoad?.(parsedData);
        toast.success(`Berhasil memuat ${parsedData.length} data dari CSV`);
      } else {
        // If file not found in public, show file upload option
        toast.error('File CSV tidak ditemukan. Silakan upload file CSV.');
      }
    } catch (error) {
      console.error('Error loading CSV:', error);
      toast.error('Gagal memuat file CSV default');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Silakan pilih file CSV');
      return;
    }

    setLoading(true);
    try {
      const parsedData = await CSVParser.loadCSVFromFile(file);
      setData(parsedData);
      onDataLoad?.(parsedData);
      toast.success(`Berhasil memuat ${parsedData.length} data dari ${file.name}`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Gagal memproses file CSV');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const headers = [
      'Kode Bidang', 'Nama Bidang', 'Nama Komponen', 'Satuan', 'Volume',
      'Harga Satuan', 'Total Anggaran', 'Total Realisasi', 'Persentase'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.kodeBidang,
        `"${item.namaBidang}"`,
        `"${item.namaKomponen}"`,
        item.satuan,
        item.volume,
        item.hargaSatuan,
        item.totalAkb,
        item.totalRealisasi,
        CSVParser.calculatePercentage(item.totalRealisasi, item.totalAkb).toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kertas_kerja_perubahan_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Data berhasil diekspor');
  };

  const getSummaryData = () => {
    return CSVParser.getSummaryByBidang(data);
  };

  const getTotalSummary = () => {
    const totalAnggaran = data.reduce((sum, item) => sum + item.totalAkb, 0);
    const totalRealisasi = data.reduce((sum, item) => sum + item.totalRealisasi, 0);
    const persentase = CSVParser.calculatePercentage(totalRealisasi, totalAnggaran);
    
    return { totalAnggaran, totalRealisasi, persentase };
  };

  const getBidangOptions = () => {
    const bidangSet = new Set(data.map(item => item.kodeBidang));
    return Array.from(bidangSet).map(kode => {
      const item = data.find(d => d.kodeBidang === kode);
      return { kode, nama: item?.namaBidang || kode };
    });
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const totalSummary = getTotalSummary();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kertas Kerja Perubahan</h1>
          <p className="text-gray-600">Manajemen data anggaran kas belanja dan realisasi</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={filteredData.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Anggaran</p>
              <p className="text-2xl font-bold text-blue-600">
                {CSVParser.formatCurrency(totalSummary.totalAnggaran)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Realisasi</p>
              <p className="text-2xl font-bold text-green-600">
                {CSVParser.formatCurrency(totalSummary.totalRealisasi)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Persentase Realisasi</p>
              <p className={`text-2xl font-bold ${
                totalSummary.persentase >= 80 ? 'text-green-600' : 
                totalSummary.persentase >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {totalSummary.persentase.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              totalSummary.persentase >= 80 ? 'bg-green-100' : 
              totalSummary.persentase >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {totalSummary.persentase >= 80 ? 
                <TrendingUp className={`w-6 h-6 ${
                  totalSummary.persentase >= 80 ? 'text-green-600' : 
                  totalSummary.persentase >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`} /> :
                <TrendingDown className={`w-6 h-6 ${
                  totalSummary.persentase >= 80 ? 'text-green-600' : 
                  totalSummary.persentase >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              }
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari komponen, bidang, atau kegiatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Bidang</option>
              {getBidangOptions().map(bidang => (
                <option key={bidang.kode} value={bidang.kode}>
                  {bidang.nama}
                </option>
              ))}
            </select>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedView('summary')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedView === 'summary' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Ringkasan
              </button>
              <button
                onClick={() => setSelectedView('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedView === 'table' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Detail
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Memuat data...</span>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {selectedView === 'summary' ? (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan per Bidang</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bidang
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Anggaran
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Realisasi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Persentase
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getSummaryData().map((summary, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{summary.namaBidang}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{summary.jumlahItem}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {CSVParser.formatCurrency(summary.totalAnggaran)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {CSVParser.formatCurrency(summary.totalRealisasi)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            summary.persentase >= 80 ? 'bg-green-100 text-green-800' :
                            summary.persentase >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {summary.persentase.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detail Data ({filteredData.length} item)
                </h3>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Sebelumnya
                    </button>
                    <span className="text-sm text-gray-600">
                      {currentPage} dari {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Selanjutnya
                    </button>
                  </div>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bidang
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Komponen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Harga Satuan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Anggaran
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Realisasi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((item, index) => {
                      const percentage = CSVParser.calculatePercentage(item.totalRealisasi, item.totalAkb);
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.namaBidang}</div>
                            <div className="text-sm text-gray-500">{item.kodeBidang}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{item.namaKomponen}</div>
                            <div className="text-sm text-gray-500">{item.kodeKomponen}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.volume} {item.satuan}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {CSVParser.formatCurrency(item.hargaSatuan)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {CSVParser.formatCurrency(item.totalAkb)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {CSVParser.formatCurrency(item.totalRealisasi)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              percentage >= 80 ? 'bg-green-100 text-green-800' :
                              percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {percentage.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload file CSV untuk memulai analisis data kertas kerja perubahan.
          </p>
        </div>
      )}
    </div>
  );
};

export default KertasKerjaPerubahanComponent;