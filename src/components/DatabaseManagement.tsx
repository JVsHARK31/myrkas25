import React, { useState, useRef } from 'react';
import { 
  Upload, Download, Plus, Edit, Trash2, Save, 
  FileText, Database, AlertCircle, CheckCircle,
  RefreshCw, Eye, Search, Filter, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ApiService } from '../lib/api';
import type { KertasKerjaPerubahan } from '../types/database';
import { DatabaseStatus } from './DatabaseStatus';
import { ErrorDisplay, LoadingState, EmptyState } from './ErrorDisplay';

export const DatabaseManagement: React.FC = () => {
  const [records, setRecords] = useState<KertasKerjaPerubahan['Row'][]>([
    {
      id: 1,
      tahun: 2024,
      kode_rekening: '5.1.02.01.01.0001',
      uraian: 'Belanja Gaji dan Tunjangan',
      pagu_anggaran: 500000000,
      realisasi: 375000000,
      sisa_anggaran: 125000000,
      persentase_realisasi: 75
    },
    {
      id: 2,
      tahun: 2024,
      kode_rekening: '5.1.02.01.01.0002',
      uraian: 'Belanja Barang dan Jasa',
      pagu_anggaran: 300000000,
      realisasi: 180000000,
      sisa_anggaran: 120000000,
      persentase_realisasi: 60
    },
    {
      id: 3,
      tahun: 2024,
      kode_rekening: '5.1.02.01.01.0003',
      uraian: 'Belanja Modal',
      pagu_anggaran: 200000000,
      realisasi: 150000000,
      sisa_anggaran: 50000000,
      persentase_realisasi: 75
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<KertasKerjaPerubahan['Row'] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<number | ''>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newRecord, setNewRecord] = useState<KertasKerjaPerubahan['Insert']>({
    tahun: new Date().getFullYear(),
    kode_rekening: '',
    uraian: '',
    pagu_anggaran: 0,
    realisasi: 0
  });

  // Load data from Supabase using ApiService
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading data from database...');
      
      // Simulate API call for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try real API call but gracefully fallback to mock data
      try {
        const response = await ApiService.kertasKerjaPerubahan.getAll();
        console.log('Database connection successful:', response?.length || 0, 'records found');
        
        if (response && Array.isArray(response) && response.length > 0) {
          // Transform data to match expected format
          const transformedRecords = response.map((item, index) => ({
            id: item.id || index + 1,
            tahun: item.tahun || 2024,
            kode_rekening: item.kode_rekening || item.kode_komponen || 'N/A',
            uraian: item.nama_komponen || item.uraian || 'Data tidak tersedia',
            pagu_anggaran: item.total_akb || 0,
            realisasi: item.total_realisasi || 0,
            sisa_anggaran: (item.total_akb || 0) - (item.total_realisasi || 0),
            persentase_realisasi: item.total_akb ? ((item.total_realisasi || 0) / item.total_akb * 100) : 0
          }));
          
          setRecords(transformedRecords);
          setError(null);
          toast.success(`✅ Data berhasil dimuat dari database: ${transformedRecords.length} record`);
          return;
        } else {
          console.log('No data found in database, using mock data');
        }
      } catch (apiError: any) {
        console.log('API call failed, using mock data:', apiError.message);
        
        // Set informative error message but don't fail completely
        if (apiError.message?.includes('recursion') || apiError.message?.includes('42P17')) {
          setError('⚠️ Database RLS recursion detected - using demo data');
        } else if (apiError.message?.includes('relation') && apiError.message?.includes('does not exist')) {
          setError('⚠️ Database table not found - using demo data');
        } else if (apiError.message?.includes('JWT') || apiError.message?.includes('auth')) {
          setError('⚠️ Authentication issue - using demo data');
        } else {
          setError('⚠️ Database connection failed - using demo data');
        }
      }
      
      // Check if we're using demo data
      const isDemo = !import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.VITE_SUPABASE_URL === 'https://your-project-id.supabase.co';
      
      if (isDemo) {
        setError('⚠️ Using demo data - configure Supabase for real data');
      }
      
      // Always show success message for demo data
      toast.success('📊 Demo data loaded successfully');
      
    } catch (error: any) {
      console.error('Unexpected error loading data:', error);
      setError('❌ Unexpected error occurred - using demo data');
      toast.error('Error loading data, using demo data');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new record
  const addRecord = async () => {
    if (!newRecord.kode_rekening || !newRecord.uraian) {
      toast.error('Kode rekening dan uraian harus diisi');
      return;
    }

    setIsLoading(true);
    
    try {
      // Always use ApiService which now has localStorage fallback
      const data = await ApiService.kertasKerjaPerubahan.create(newRecord);
      
      // Transform data to match UI format
      const transformedRecord = {
        id: data.id || Math.max(...records.map(r => r.id || 0)) + 1,
        tahun: data.tahun || newRecord.tahun,
        kode_rekening: data.kode_rekening || newRecord.kode_rekening,
        uraian: data.nama_komponen || data.uraian || newRecord.uraian,
        pagu_anggaran: data.total_akb || newRecord.pagu_anggaran,
        realisasi: data.total_realisasi || newRecord.realisasi,
        sisa_anggaran: (data.total_akb || newRecord.pagu_anggaran) - (data.total_realisasi || newRecord.realisasi),
        persentase_realisasi: (data.total_akb || newRecord.pagu_anggaran) > 0 ? 
          ((data.total_realisasi || newRecord.realisasi) / (data.total_akb || newRecord.pagu_anggaran)) * 100 : 0
      };
      
      setRecords([transformedRecord, ...records]);
      toast.success('✅ Data berhasil disimpan');

      setNewRecord({
        tahun: new Date().getFullYear(),
        kode_rekening: '',
        uraian: '',
        pagu_anggaran: 0,
        realisasi: 0
      });
      setShowAddModal(false);
      
    } catch (error: any) {
      console.error('Error adding record:', error);
      toast.error('⚠️ Terjadi kesalahan, silakan coba lagi');
    } finally {
      setIsLoading(false);
    }
  };

  // Import CSV
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Hanya file CSV yang diperbolehkan');
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('File CSV harus memiliki header dan minimal 1 baris data');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const importedRecords: KertasKerjaPerubahan['Insert'][] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length >= 5) {
          const record: KertasKerjaPerubahan['Insert'] = {
            tahun: parseInt(values[0]) || new Date().getFullYear(),
            kode_rekening: values[1] || '',
            uraian: values[2] || '',
            pagu_anggaran: parseFloat(values[3]) || 0,
            realisasi: parseFloat(values[4]) || 0
          };

          importedRecords.push(record);
        }
      }

      if (importedRecords.length === 0) {
        toast.error('Tidak ada data valid yang ditemukan dalam file CSV');
        return;
      }

      // Import records using ApiService
      setIsLoading(true);
      const data = await ApiService.kertasKerjaPerubahan.bulkInsert(importedRecords);
      
      // Transform imported data to match UI format
      const transformedData = data.map((item: any, index: number) => ({
        id: item.id || Math.max(...records.map(r => r.id || 0)) + index + 1,
        tahun: item.tahun || new Date().getFullYear(),
        kode_rekening: item.kode_rekening || item.kode_komponen || 'N/A',
        uraian: item.nama_komponen || item.uraian || 'Data import',
        pagu_anggaran: item.total_akb || item.pagu_anggaran || 0,
        realisasi: item.total_realisasi || item.realisasi || 0,
        sisa_anggaran: (item.total_akb || item.pagu_anggaran || 0) - (item.total_realisasi || item.realisasi || 0),
        persentase_realisasi: (item.total_akb || item.pagu_anggaran || 0) > 0 ? 
          ((item.total_realisasi || item.realisasi || 0) / (item.total_akb || item.pagu_anggaran || 0)) * 100 : 0
      }));
      
      setRecords([...transformedData, ...records]);
      toast.success(`✅ ${transformedData.length} record berhasil diimport`);

      setShowImportModal(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error: any) {
      console.error('Error importing file:', error);
      toast.error('⚠️ Terjadi kesalahan saat import file');
    } finally {
      setIsLoading(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (records.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const headers = ['Tahun', 'Kode Rekening', 'Uraian', 'Pagu Anggaran', 'Realisasi', 'Sisa Anggaran', 'Persentase Realisasi'];
    const csvContent = [
      headers.join(','),
      ...records.map(record => [
        record.tahun,
        record.kode_rekening,
        `"${record.uraian}"`,
        record.pagu_anggaran,
        record.realisasi,
        record.sisa_anggaran || 0,
        record.persentase_realisasi?.toFixed(2) || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rkas_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Data berhasil diekspor');
  };

  // Delete record
  const deleteRecord = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus record ini?')) return;

    setIsLoading(true);
    
    try {
      // Use ApiService which now has localStorage fallback
      await ApiService.kertasKerjaPerubahan.delete(id.toString());
      setRecords(records.filter(record => record.id !== id));
      toast.success('✅ Data berhasil dihapus');
    } catch (error: any) {
      console.error('Error deleting record:', error);
      toast.error('⚠️ Terjadi kesalahan saat menghapus data');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.uraian.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.kode_rekening.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === '' || record.tahun === filterYear;
    return matchesSearch && matchesYear;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Load data on component mount
  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4 lg:space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Database Management</h1>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  Kelola data R-KAS dengan input manual atau import CSV
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={loadData}
                  disabled={isLoading}
                  className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Refresh
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Import CSV</span>
                  <span className="sm:hidden">Import</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Tambah Data</span>
                  <span className="sm:hidden">Tambah</span>
                </button>
              </div>
            </div>
          </div>

      {/* Database Status */}
      <DatabaseStatus onStatusChange={(connected) => {
        if (connected && records.length === 0) {
          loadData()
        }
      }} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 lg:p-4">
          <div className="flex items-center">
            <Database className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 flex-shrink-0" />
            <div className="ml-2 lg:ml-3 min-w-0">
              <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">Total Records</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{records.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 lg:p-4">
          <div className="flex items-center">
            <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 flex-shrink-0" />
            <div className="ml-2 lg:ml-3 min-w-0">
              <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">Total Pagu</p>
              <p className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white truncate">
                {formatCurrency(records.reduce((sum, record) => sum + record.pagu_anggaran, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 lg:p-4">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600 flex-shrink-0" />
            <div className="ml-2 lg:ml-3 min-w-0">
              <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">Total Realisasi</p>
              <p className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white truncate">
                {formatCurrency(records.reduce((sum, record) => sum + record.realisasi, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 lg:p-4">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 lg:w-8 lg:h-8 text-red-600 flex-shrink-0" />
            <div className="ml-2 lg:ml-3 min-w-0">
              <p className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">Sisa Anggaran</p>
              <p className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white truncate">
                {formatCurrency(records.reduce((sum, record) => sum + (record.sisa_anggaran || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 lg:p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari uraian atau kode rekening..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value ? parseInt(e.target.value) : '')}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Semua Tahun</option>
              {Array.from(new Set(records.map(r => r.tahun))).sort().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <button
              onClick={exportToCSV}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tahun
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kode
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Uraian
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Pagu
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Realisasi
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Sisa
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  %
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-3 lg:px-6 py-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 lg:px-6 py-8 text-center">
                    <Database className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">Belum ada data</p>
                    <p className="text-sm text-gray-400">Tambah data manual atau import CSV</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 dark:text-white">
                      {record.tahun}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 dark:text-white">
                      <span className="truncate block max-w-20 lg:max-w-none" title={record.kode_rekening}>
                        {record.kode_rekening}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-900 dark:text-white">
                      <div className="max-w-32 lg:max-w-none">
                        <span className="block truncate lg:whitespace-normal" title={record.uraian}>
                          {record.uraian}
                        </span>
                        {/* Show financial info on mobile */}
                        <div className="sm:hidden mt-1 text-xs text-gray-500">
                          <div>Pagu: {formatCurrency(record.pagu_anggaran)}</div>
                          <div>Real: {formatCurrency(record.realisasi)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                      {formatCurrency(record.pagu_anggaran)}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                      {formatCurrency(record.realisasi)}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 dark:text-white hidden md:table-cell">
                      {formatCurrency(record.sisa_anggaran || 0)}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm hidden md:table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (record.persentase_realisasi || 0) > 90 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : (record.persentase_realisasi || 0) > 70
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {(record.persentase_realisasi || 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <button
                          onClick={() => setEditingRecord(record)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                          title="Edit"
                        >
                          <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                        </button>
                        <button
                          onClick={() => deleteRecord(record.id!)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                          title="Hapus"
                        >
                          <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tambah Data Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tahun
                </label>
                <input
                  type="number"
                  value={newRecord.tahun}
                  onChange={(e) => setNewRecord({...newRecord, tahun: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kode Rekening
                </label>
                <input
                  type="text"
                  value={newRecord.kode_rekening}
                  onChange={(e) => setNewRecord({...newRecord, kode_rekening: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Uraian
                </label>
                <textarea
                  value={newRecord.uraian}
                  onChange={(e) => setNewRecord({...newRecord, uraian: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pagu Anggaran
                </label>
                <input
                  type="number"
                  value={newRecord.pagu_anggaran}
                  onChange={(e) => setNewRecord({...newRecord, pagu_anggaran: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Realisasi
                </label>
                <input
                  type="number"
                  value={newRecord.realisasi}
                  onChange={(e) => setNewRecord({...newRecord, realisasi: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={addRecord}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ease-out border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Import Data CSV
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pilih File CSV
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileImport}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Format CSV yang diharapkan:
                </p>
                <code className="text-xs text-gray-800 dark:text-gray-200">
                  tahun,kode_rekening,uraian,pagu_anggaran,realisasi
                </code>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};