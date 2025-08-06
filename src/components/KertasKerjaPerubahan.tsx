import React, { useState, useEffect } from 'react';
import { 
  Upload, Download, FileText, TrendingUp, TrendingDown, DollarSign, 
  Calendar, Filter, Search, Eye, Edit, Trash2, Plus, Save, X, 
  ChevronLeft, ChevronRight, BarChart3, PieChart, Settings,
  RefreshCw, AlertCircle, CheckCircle, Clock, Users
} from 'lucide-react';
import { CSVParser, KertasKerjaPerubahan } from '../utils/csvParser';
import { KertasKerjaForm } from './KertasKerjaForm';
import toast from 'react-hot-toast';

interface KertasKerjaPerubahanProps {
  onDataLoad?: (data: KertasKerjaPerubahan[]) => void;
}

interface FormData extends Partial<KertasKerjaPerubahan> {
  id?: string;
}

type ViewMode = 'summary' | 'table' | 'form' | 'monthly' | 'quarterly';

export const KertasKerjaPerubahanComponent: React.FC<KertasKerjaPerubahanProps> = ({ onDataLoad }) => {
  const [data, setData] = useState<KertasKerjaPerubahan[]>([]);
  const [filteredData, setFilteredData] = useState<KertasKerjaPerubahan[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('');
  const [selectedView, setSelectedView] = useState<ViewMode>('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<KertasKerjaPerubahan | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof KertasKerjaPerubahan>('namaKomponen');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 15;

  // Load CSV data on component mount
  useEffect(() => {
    loadDefaultCSV();
  }, []);

  // Filter and sort data
  useEffect(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.namaKomponen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaBidang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaGiat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kodeGiat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaRekening?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.merk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.spek?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply bidang filter
    if (selectedBidang) {
      filtered = filtered.filter(item => item.kodeBidang === selectedBidang);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, searchTerm, selectedBidang, sortField, sortDirection]);

  const loadDefaultCSV = async () => {
    setLoading(true);
    try {
      const response = await fetch('/KERTASKERJAPERUBAHAN.csv');
      if (response.ok) {
        const content = await response.text();
        const parsedData = CSVParser.parseCSV(content);
        setData(parsedData);
        onDataLoad?.(parsedData);
        toast.success(`Berhasil memuat ${parsedData.length} data dari CSV`);
      } else {
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
      'Kode Bidang', 'Nama Bidang', 'Kode Standar', 'Nama Standar',
      'ID Giat', 'Kode Giat', 'Nama Giat', 'Subtitle',
      'Kode Dana', 'Nama Dana', 'Kode Rekening', 'Nama Rekening',
      'ID Rincian', 'ID Komponen', 'Kode Komponen', 'Nama Komponen',
      'Satuan', 'Merk', 'Spek', 'Pajak', 'Volume', 'Harga Satuan', 'Koefisien',
      'Vol1', 'Sat1', 'Vol2', 'Sat2', 'Vol3', 'Sat3', 'Vol4', 'Sat4',
      'Nilai Rincian Murni', 'Nilai Rincian', 'Sub Rincian', 'Keterangan Rincian', 'Keterangan',
      'Anggaran Jan', 'Anggaran Feb', 'Anggaran Mar', 'Anggaran TW1',
      'Anggaran Apr', 'Anggaran Mei', 'Anggaran Jun', 'Anggaran TW2',
      'Anggaran Jul', 'Anggaran Agu', 'Anggaran Sep', 'Anggaran TW3',
      'Anggaran Okt', 'Anggaran Nov', 'Anggaran Des', 'Anggaran TW4', 'Total AKB',
      'Realisasi Jan', 'Realisasi Feb', 'Realisasi Mar', 'Realisasi TW1',
      'Realisasi Apr', 'Realisasi Mei', 'Realisasi Jun', 'Realisasi TW2',
      'Realisasi Jul', 'Realisasi Agu', 'Realisasi Sep', 'Realisasi TW3',
      'Realisasi Okt', 'Realisasi Nov', 'Realisasi Des', 'Realisasi TW4', 'Total Realisasi'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.kodeBidang, `"${item.namaBidang}"`, item.kodeStandar, `"${item.namaStandar}"`,
        item.idGiat, item.kodeGiat, `"${item.namaGiat}"`, `"${item.subtitle}"`,
        item.kodeDana, `"${item.namaDana}"`, item.kodeRekening, `"${item.namaRekening}"`,
        item.idRincian, item.idKomponen, item.kodeKomponen, `"${item.namaKomponen}"`,
        item.satuan, item.merk, item.spek, item.pajak, item.volume, item.hargaSatuan, item.koefisien,
        item.vol1, item.sat1, item.vol2, item.sat2, item.vol3, item.sat3, item.vol4, item.sat4,
        item.nilaiRincianMurni, item.nilaiRincian, item.subRincian, item.keteranganRincian, item.keterangan,
        item.anggaranBulan1, item.anggaranBulan2, item.anggaranBulan3, item.anggaranTw1,
        item.anggaranBulan4, item.anggaranBulan5, item.anggaranBulan6, item.anggaranTw2,
        item.anggaranBulan7, item.anggaranBulan8, item.anggaranBulan9, item.anggaranTw3,
        item.anggaranBulan10, item.anggaranBulan11, item.anggaranBulan12, item.anggaranTw4, item.totalAkb,
        item.realisasiBulan1, item.realisasiBulan2, item.realisasiBulan3, item.realisasiTw1,
        item.realisasiBulan4, item.realisasiBulan5, item.realisasiBulan6, item.realisasiTw2,
        item.realisasiBulan7, item.realisasiBulan8, item.realisasiBulan9, item.realisasiTw3,
        item.realisasiBulan10, item.realisasiBulan11, item.realisasiBulan12, item.realisasiTw4, item.totalRealisasi
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kertas_kerja_perubahan_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Data berhasil diekspor');
  };

  const handleSort = (field: keyof KertasKerjaPerubahan) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (item: KertasKerjaPerubahan) => {
    setFormMode('edit');
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormMode('add');
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSave = (item: KertasKerjaPerubahan) => {
    if (formMode === 'edit' && editingItem) {
      setData(prev => prev.map(d => d.id === item.id ? item : d));
      toast.success('Data berhasil diperbarui');
    } else {
      setData(prev => [...prev, item]);
      toast.success('Data berhasil ditambahkan');
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = (item: KertasKerjaPerubahan) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      setData(prev => prev.filter(d => d.id !== item.id));
      toast.success('Data berhasil dihapus');
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) {
      toast.error('Pilih item yang akan dihapus');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedItems.size} item?`)) {
      setData(prev => prev.filter(item => !selectedItems.has(item.id || '')));
      setSelectedItems(new Set());
      toast.success(`${selectedItems.size} item berhasil dihapus`);
    }
  };

  const getSummaryData = () => {
    return CSVParser.getSummaryByBidang(data);
  };

  const getTotalSummary = () => {
    const totalAnggaran = data.reduce((sum, item) => sum + (item.totalAkb || 0), 0);
    const totalRealisasi = data.reduce((sum, item) => sum + (item.totalRealisasi || 0), 0);
    const persentase = CSVParser.calculatePercentage(totalRealisasi, totalAnggaran);
    
    return { totalAnggaran, totalRealisasi, persentase };
  };

  const getMonthlyData = () => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    return months.map((month, index) => {
      const anggaranField = `anggaranBulan${index + 1}` as keyof KertasKerjaPerubahan;
      const realisasiField = `realisasiBulan${index + 1}` as keyof KertasKerjaPerubahan;
      
      const totalAnggaran = data.reduce((sum, item) => sum + (Number(item[anggaranField]) || 0), 0);
      const totalRealisasi = data.reduce((sum, item) => sum + (Number(item[realisasiField]) || 0), 0);
      
      return {
        month,
        anggaran: totalAnggaran,
        realisasi: totalRealisasi,
        persentase: CSVParser.calculatePercentage(totalRealisasi, totalAnggaran)
      };
    });
  };

  const getQuarterlyData = () => {
    const quarters = ['TW 1', 'TW 2', 'TW 3', 'TW 4'];
    
    return quarters.map((quarter, index) => {
      const anggaranField = `anggaranTw${index + 1}` as keyof KertasKerjaPerubahan;
      const realisasiField = `realisasiTw${index + 1}` as keyof KertasKerjaPerubahan;
      
      const totalAnggaran = data.reduce((sum, item) => sum + (Number(item[anggaranField]) || 0), 0);
      const totalRealisasi = data.reduce((sum, item) => sum + (Number(item[realisasiField]) || 0), 0);
      
      return {
        quarter,
        anggaran: totalAnggaran,
        realisasi: totalRealisasi,
        persentase: CSVParser.calculatePercentage(totalRealisasi, totalAnggaran)
      };
    });
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

  const renderFormField = (label: string, field: keyof FormData, type: 'text' | 'number' = 'text', required = false) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[field] || ''}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          [field]: type === 'number' ? Number(e.target.value) : e.target.value
        }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        required={required}
      />
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kertas Kerja Perubahan</h1>
            <p className="text-gray-600 mt-1">Sistem manajemen anggaran kas belanja dan realisasi yang komprehensif</p>
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
            
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Data
            </button>
            
            {selectedItems.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hapus ({selectedItems.size})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Item</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
        
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
                placeholder="Cari komponen, bidang, kegiatan, rekening, merk, spek..."
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
              {[
                { key: 'summary', label: 'Ringkasan', icon: PieChart },
                { key: 'table', label: 'Detail', icon: FileText },
                { key: 'monthly', label: 'Bulanan', icon: Calendar },
                { key: 'quarterly', label: 'Triwulan', icon: BarChart3 }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedView(key as ViewMode)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedView === key 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Memuat data...</span>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingItem ? 'Edit Data' : 'Tambah Data Baru'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Bidang Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Bidang</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderFormField('Kode Bidang', 'kodeBidang', 'text', true)}
                  {renderFormField('Nama Bidang', 'namaBidang', 'text', true)}
                  {renderFormField('Kode Standar', 'kodeStandar')}
                  {renderFormField('Nama Standar', 'namaStandar')}
                </div>
              </div>

              {/* Kegiatan Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Kegiatan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderFormField('ID Giat', 'idGiat')}
                  {renderFormField('Kode Giat', 'kodeGiat', 'text', true)}
                  {renderFormField('Nama Giat', 'namaGiat', 'text', true)}
                  {renderFormField('Subtitle', 'subtitle')}
                </div>
              </div>

              {/* Dana & Rekening Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Dana & Rekening</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderFormField('Kode Dana', 'kodeDana')}
                  {renderFormField('Nama Dana', 'namaDana')}
                  {renderFormField('Kode Rekening', 'kodeRekening')}
                  {renderFormField('Nama Rekening', 'namaRekening')}
                </div>
              </div>

              {/* Komponen Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Komponen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderFormField('ID Rincian', 'idRincian')}
                  {renderFormField('ID Komponen', 'idKomponen')}
                  {renderFormField('Kode Komponen', 'kodeKomponen')}
                  {renderFormField('Nama Komponen', 'namaKomponen', 'text', true)}
                  {renderFormField('Satuan', 'satuan', 'text', true)}
                  {renderFormField('Merk', 'merk')}
                  {renderFormField('Spek', 'spek')}
                  {renderFormField('Pajak', 'pajak')}
                </div>
              </div>

              {/* Volume & Harga */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Volume & Harga</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderFormField('Volume', 'volume', 'number')}
                  {renderFormField('Harga Satuan', 'hargaSatuan', 'number')}
                  {renderFormField('Koefisien', 'koefisien')}
                </div>
                
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Detail Volume</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      {renderFormField('Vol 1', 'vol1', 'number')}
                      {renderFormField('Sat 1', 'sat1')}
                    </div>
                    <div className="space-y-2">
                      {renderFormField('Vol 2', 'vol2', 'number')}
                      {renderFormField('Sat 2', 'sat2')}
                    </div>
                    <div className="space-y-2">
                      {renderFormField('Vol 3', 'vol3', 'number')}
                      {renderFormField('Sat 3', 'sat3')}
                    </div>
                    <div className="space-y-2">
                      {renderFormField('Vol 4', 'vol4', 'number')}
                      {renderFormField('Sat 4', 'sat4')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nilai Rincian */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Nilai Rincian</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderFormField('Nilai Rincian Murni', 'nilaiRincianMurni', 'number')}
                  {renderFormField('Nilai Rincian', 'nilaiRincian', 'number')}
                  {renderFormField('Sub Rincian', 'subRincian')}
                  {renderFormField('Keterangan Rincian', 'keteranganRincian')}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea
                    value={formData.keterangan || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={3}
                  />
                </div>
              </div>

              {/* Anggaran Bulanan */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Anggaran Bulanan</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Januari', field: 'anggaranBulan1' },
                    { label: 'Februari', field: 'anggaranBulan2' },
                    { label: 'Maret', field: 'anggaranBulan3' },
                    { label: 'TW 1', field: 'anggaranTw1' },
                    { label: 'April', field: 'anggaranBulan4' },
                    { label: 'Mei', field: 'anggaranBulan5' },
                    { label: 'Juni', field: 'anggaranBulan6' },
                    { label: 'TW 2', field: 'anggaranTw2' },
                    { label: 'Juli', field: 'anggaranBulan7' },
                    { label: 'Agustus', field: 'anggaranBulan8' },
                    { label: 'September', field: 'anggaranBulan9' },
                    { label: 'TW 3', field: 'anggaranTw3' },
                    { label: 'Oktober', field: 'anggaranBulan10' },
                    { label: 'November', field: 'anggaranBulan11' },
                    { label: 'Desember', field: 'anggaranBulan12' },
                    { label: 'TW 4', field: 'anggaranTw4' }
                  ].map(({ label, field }) => (
                    renderFormField(label, field as keyof FormData, 'number')
                  ))}
                </div>
              </div>

              {/* Realisasi Bulanan */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Realisasi Bulanan</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Januari', field: 'realisasiBulan1' },
                    { label: 'Februari', field: 'realisasiBulan2' },
                    { label: 'Maret', field: 'realisasiBulan3' },
                    { label: 'TW 1', field: 'realisasiTw1' },
                    { label: 'April', field: 'realisasiBulan4' },
                    { label: 'Mei', field: 'realisasiBulan5' },
                    { label: 'Juni', field: 'realisasiBulan6' },
                    { label: 'TW 2', field: 'realisasiTw2' },
                    { label: 'Juli', field: 'realisasiBulan7' },
                    { label: 'Agustus', field: 'realisasiBulan8' },
                    { label: 'September', field: 'realisasiBulan9' },
                    { label: 'TW 3', field: 'realisasiTw3' },
                    { label: 'Oktober', field: 'realisasiBulan10' },
                    { label: 'November', field: 'realisasiBulan11' },
                    { label: 'Desember', field: 'realisasiBulan12' },
                    { label: 'TW 4', field: 'realisasiTw4' }
                  ].map(({ label, field }) => (
                    renderFormField(label, field as keyof FormData, 'number')
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingItem ? 'Update' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Views */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {selectedView === 'summary' && (
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
          )}

          {selectedView === 'monthly' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Bulanan</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bulan
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
                    {getMonthlyData().map((monthly, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{monthly.month}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {CSVParser.formatCurrency(monthly.anggaran)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {CSVParser.formatCurrency(monthly.realisasi)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            monthly.persentase >= 80 ? 'bg-green-100 text-green-800' :
                            monthly.persentase >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {monthly.persentase.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedView === 'quarterly' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Triwulanan</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Triwulan
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
                    {getQuarterlyData().map((quarterly, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{quarterly.quarter}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {CSVParser.formatCurrency(quarterly.anggaran)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {CSVParser.formatCurrency(quarterly.realisasi)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            quarterly.persentase >= 80 ? 'bg-green-100 text-green-800' :
                            quarterly.persentase >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {quarterly.persentase.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedView === 'table' && (
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
                      className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Sebelumnya
                    </button>
                    <span className="text-sm text-gray-600">
                      {currentPage} dari {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Selanjutnya
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(new Set(paginatedData.map(item => item.id || '')));
                            } else {
                              setSelectedItems(new Set());
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </th>
                      {[
                        { key: 'kodeBidang', label: 'Kode Bidang' },
                        { key: 'namaBidang', label: 'Bidang' },
                        { key: 'namaKomponen', label: 'Komponen' },
                        { key: 'satuan', label: 'Satuan' },
                        { key: 'volume', label: 'Volume' },
                        { key: 'hargaSatuan', label: 'Harga Satuan' },
                        { key: 'totalAkb', label: 'Total Anggaran' },
                        { key: 'totalRealisasi', label: 'Total Realisasi' }
                      ].map(({ key, label }) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort(key as keyof KertasKerjaPerubahan)}
                        >
                          <div className="flex items-center gap-1">
                            {label}
                            {sortField === key && (
                              <span className="text-blue-600">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((item, index) => {
                      const percentage = CSVParser.calculatePercentage(item.totalRealisasi || 0, item.totalAkb || 0);
                      const isSelected = selectedItems.has(item.id || '');
                      
                      return (
                        <tr key={index} className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                          <td className="px-2 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const newSelected = new Set(selectedItems);
                                if (e.target.checked) {
                                  newSelected.add(item.id || '');
                                } else {
                                  newSelected.delete(item.id || '');
                                }
                                setSelectedItems(newSelected);
                              }}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.kodeBidang}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.namaBidang}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{item.namaKomponen}</div>
                            <div className="text-sm text-gray-500">{item.kodeKomponen}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className="text-sm text-gray-900">{item.volume} {item.satuan}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {CSVParser.formatCurrency(item.hargaSatuan || 0)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {CSVParser.formatCurrency(item.totalAkb || 0)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {CSVParser.formatCurrency(item.totalRealisasi || 0)}
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload file CSV untuk memulai analisis data kertas kerja perubahan.
            </p>
            <div className="mt-6">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Upload CSV Sekarang
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && data.length > 0 && filteredData.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada hasil</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tidak ditemukan data yang sesuai dengan filter pencarian Anda.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBidang('');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Filter
              </button>
            </div>
          </div>
        )})}}
      </div>

      {/* Form Modal */}
      <KertasKerjaForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        initialData={editingItem || {}}
        mode={formMode}
      />
    );
  };

  export default KertasKerjaPerubahanComponent;