import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, ChevronDown, Edit, Trash2, Eye, MoreHorizontal, 
  ChevronLeft, ChevronRight, Settings, Download, Filter,
  Search, Plus, RefreshCw, ArrowUpDown
} from 'lucide-react';
import { KertasKerjaPerubahan } from '../utils/csvParser';
import { formatCurrency, formatNumber } from '../utils/validation';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof KertasKerjaPerubahan;
  direction: SortDirection;
}

interface ComprehensiveRKASTableProps {
  data: KertasKerjaPerubahan[];
  onEdit: (item: KertasKerjaPerubahan) => void;
  onDelete: (item: KertasKerjaPerubahan) => void;
  onView: (item: KertasKerjaPerubahan) => void;
  onAdd: () => void;
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  loading?: boolean;
}

interface ColumnConfig {
  key: keyof KertasKerjaPerubahan;
  label: string;
  width: string;
  type: 'text' | 'number' | 'currency';
  visible: boolean;
  sortable: boolean;
  group?: string;
}

const ITEMS_PER_PAGE = 20;

const ComprehensiveRKASTable: React.FC<ComprehensiveRKASTableProps> = ({
  data,
  onEdit,
  onDelete,
  onView,
  onAdd,
  selectedItems,
  onSelectItem,
  onSelectAll,
  loading = false
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'kodeBidang', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Define all columns with comprehensive field mapping
  const allColumns: ColumnConfig[] = [
    // Basic Information
    { key: 'kodeBidang', label: 'Kode Bidang', width: 'w-24', type: 'text', visible: true, sortable: true, group: 'Bidang' },
    { key: 'namaBidang', label: 'Nama Bidang', width: 'w-40', type: 'text', visible: true, sortable: true, group: 'Bidang' },
    { key: 'kodeStandar', label: 'Kode Standar', width: 'w-28', type: 'text', visible: true, sortable: true, group: 'Standar' },
    { key: 'namaStandar', label: 'Nama Standar', width: 'w-40', type: 'text', visible: true, sortable: true, group: 'Standar' },
    
    // Kegiatan Information
    { key: 'idGiat', label: 'ID Giat', width: 'w-24', type: 'text', visible: true, sortable: true, group: 'Kegiatan' },
    { key: 'kodeGiat', label: 'Kode Giat', width: 'w-32', type: 'text', visible: true, sortable: true, group: 'Kegiatan' },
    { key: 'namaGiat', label: 'Nama Giat', width: 'w-48', type: 'text', visible: true, sortable: true, group: 'Kegiatan' },
    { key: 'subtitle', label: 'Subtitle', width: 'w-40', type: 'text', visible: true, sortable: true, group: 'Kegiatan' },
    
    // Dana Information
    { key: 'kodeDana', label: 'Kode Dana', width: 'w-28', type: 'text', visible: true, sortable: true, group: 'Dana' },
    { key: 'namaDana', label: 'Nama Dana', width: 'w-40', type: 'text', visible: true, sortable: true, group: 'Dana' },
    
    // Rekening Information
    { key: 'kodeRekening', label: 'Kode Rekening', width: 'w-32', type: 'text', visible: true, sortable: true, group: 'Rekening' },
    { key: 'namaRekening', label: 'Nama Rekening', width: 'w-48', type: 'text', visible: true, sortable: true, group: 'Rekening' },
    
    // Rincian Information
    { key: 'idRincian', label: 'ID Rincian', width: 'w-28', type: 'text', visible: true, sortable: true, group: 'Rincian' },
    { key: 'idKomponen', label: 'ID Komponen', width: 'w-28', type: 'text', visible: true, sortable: true, group: 'Komponen' },
    { key: 'kodeKomponen', label: 'Kode Komponen', width: 'w-32', type: 'text', visible: true, sortable: true, group: 'Komponen' },
    { key: 'namaKomponen', label: 'Nama Komponen', width: 'w-48', type: 'text', visible: true, sortable: true, group: 'Komponen' },
    
    // Spesifikasi
    { key: 'satuan', label: 'Satuan', width: 'w-20', type: 'text', visible: true, sortable: true, group: 'Spesifikasi' },
    { key: 'merk', label: 'Merk', width: 'w-32', type: 'text', visible: true, sortable: true, group: 'Spesifikasi' },
    { key: 'spek', label: 'Spek', width: 'w-40', type: 'text', visible: true, sortable: true, group: 'Spesifikasi' },
    { key: 'pajak', label: 'Pajak', width: 'w-20', type: 'text', visible: true, sortable: true, group: 'Spesifikasi' },
    
    // Volume dan Harga
    { key: 'volume', label: 'Volume', width: 'w-24', type: 'number', visible: true, sortable: true, group: 'Volume & Harga' },
    { key: 'hargaSatuan', label: 'Harga Satuan', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Volume & Harga' },
    { key: 'koefisien', label: 'Koefisien', width: 'w-24', type: 'text', visible: true, sortable: true, group: 'Volume & Harga' },
    
    // Volume Detail
    { key: 'vol1', label: 'Vol 1', width: 'w-20', type: 'number', visible: false, sortable: true, group: 'Volume Detail' },
    { key: 'sat1', label: 'Sat 1', width: 'w-20', type: 'text', visible: false, sortable: true, group: 'Volume Detail' },
    { key: 'vol2', label: 'Vol 2', width: 'w-20', type: 'number', visible: false, sortable: true, group: 'Volume Detail' },
    { key: 'sat2', label: 'Sat 2', width: 'w-20', type: 'text', visible: false, sortable: true, group: 'Volume Detail' },
    { key: 'vol3', label: 'Vol 3', width: 'w-20', type: 'number', visible: false, sortable: true, group: 'Volume Detail' },
    { key: 'sat3', label: 'Sat 3', width: 'w-20', type: 'text', visible: false, sortable: true, group: 'Volume Detail' },
    { key: 'vol4', label: 'Vol 4', width: 'w-20', type: 'number', visible: false, sortable: true, group: 'Volume Detail' },
    { key: 'sat4', label: 'Sat 4', width: 'w-20', type: 'text', visible: false, sortable: true, group: 'Volume Detail' },
    
    // Nilai Rincian
    { key: 'nilaiRincianMurni', label: 'Nilai Rincian Murni', width: 'w-36', type: 'currency', visible: true, sortable: true, group: 'Nilai Rincian' },
    { key: 'nilaiRincian', label: 'Nilai Rincian', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Nilai Rincian' },
    { key: 'subRincian', label: 'Sub Rincian', width: 'w-32', type: 'text', visible: false, sortable: true, group: 'Nilai Rincian' },
    { key: 'keteranganRincian', label: 'Keterangan Rincian', width: 'w-40', type: 'text', visible: false, sortable: true, group: 'Nilai Rincian' },
    { key: 'keterangan', label: 'Keterangan', width: 'w-40', type: 'text', visible: false, sortable: true, group: 'Nilai Rincian' },
    
    // Anggaran Bulanan
    { key: 'anggaranBulan1', label: 'Anggaran Bulan 1', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranBulan2', label: 'Anggaran Bulan 2', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranBulan3', label: 'Anggaran Bulan 3', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranTw1', label: 'Anggaran TW 1', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Anggaran Triwulan' },
    { key: 'anggaranBulan4', label: 'Anggaran Bulan 4', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranBulan5', label: 'Anggaran Bulan 5', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranBulan6', label: 'Anggaran Bulan 6', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranTw2', label: 'Anggaran TW 2', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Anggaran Triwulan' },
    { key: 'anggaranBulan7', label: 'Anggaran Bulan 7', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranBulan8', label: 'Anggaran Bulan 8', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranBulan9', label: 'Anggaran Bulan 9', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranTw3', label: 'Anggaran TW 3', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Anggaran Triwulan' },
    { key: 'anggaranBulan10', label: 'Anggaran Bulan 10', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranBulan11', label: 'Anggaran Bulan 11', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranBulan12', label: 'Anggaran Bulan 12', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Anggaran Bulanan' },
    { key: 'anggaranTw4', label: 'Anggaran TW 4', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Anggaran Triwulan' },
    { key: 'totalAkb', label: 'Total AKB', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Total Anggaran' },
    
    // Realisasi Bulanan
    { key: 'realisasiBulan1', label: 'Realisasi Bulan 1', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiBulan2', label: 'Realisasi Bulan 2', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiBulan3', label: 'Realisasi Bulan 3', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiTw1', label: 'Realisasi TW 1', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Realisasi Triwulan' },
    { key: 'realisasiBulan4', label: 'Realisasi Bulan 4', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiBulan5', label: 'Realisasi Bulan 5', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiBulan6', label: 'Realisasi Bulan 6', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiTw2', label: 'Realisasi TW 2', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Realisasi Triwulan' },
    { key: 'realisasiBulan7', label: 'Realisasi Bulan 7', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiBulan8', label: 'Realisasi Bulan 8', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiBulan9', label: 'Realisasi Bulan 9', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiTw3', label: 'Realisasi TW 3', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Realisasi Triwulan' },
    { key: 'realisasiBulan10', label: 'Realisasi Bulan 10', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiBulan11', label: 'Realisasi Bulan 11', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiBulan12', label: 'Realisasi Bulan 12', width: 'w-32', type: 'currency', visible: false, sortable: true, group: 'Realisasi Bulanan' },
    { key: 'realisasiTw4', label: 'Realisasi TW 4', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Realisasi Triwulan' },
    { key: 'totalRealisasi', label: 'Total Realisasi', width: 'w-32', type: 'currency', visible: true, sortable: true, group: 'Total Realisasi' }
  ];

  // Initialize column visibility
  React.useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    allColumns.forEach(col => {
      initialVisibility[col.key] = col.visible;
    });
    setColumnVisibility(initialVisibility);
  }, []);

  // Get visible columns
  const visibleColumns = allColumns.filter(col => columnVisibility[col.key] !== false);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.kodeBidang?.toLowerCase().includes(searchLower) ||
        item.namaBidang?.toLowerCase().includes(searchLower) ||
        item.kodeGiat?.toLowerCase().includes(searchLower) ||
        item.namaGiat?.toLowerCase().includes(searchLower) ||
        item.namaKomponen?.toLowerCase().includes(searchLower) ||
        item.merk?.toLowerCase().includes(searchLower) ||
        item.spek?.toLowerCase().includes(searchLower) ||
        item.satuan?.toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (key: keyof KertasKerjaPerubahan) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key, direction: null };
        return { key, direction: 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle column visibility toggle
  const toggleColumnVisibility = (key: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Format cell value
  const formatCellValue = (value: any, type: string) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    
    switch (type) {
      case 'currency':
        return formatCurrency(Number(value));
      case 'number':
        return formatNumber(Number(value));
      default:
        return String(value);
    }
  };

  // Calculate percentage
  const calculatePercentage = (realisasi: number, anggaran: number): number => {
    if (anggaran === 0) return 0;
    return (realisasi / anggaran) * 100;
  };

  // Get status badge
  const getStatusBadge = (item: KertasKerjaPerubahan) => {
    const percentage = calculatePercentage(item.totalRealisasi || 0, item.totalAkb || 0);
    
    if (percentage === 0) {
      return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Belum Mulai</span>;
    } else if (percentage < 50) {
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Dalam Proses</span>;
    } else if (percentage < 100) {
      return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Hampir Selesai</span>;
    } else {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Selesai</span>;
    }
  };

  // Render sort icon
  const renderSortIcon = (key: keyof KertasKerjaPerubahan) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="w-4 h-4 text-blue-600" />;
    }
    if (sortConfig.direction === 'desc') {
      return <ChevronDown className="w-4 h-4 text-blue-600" />;
    }
    return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  };

  // Group columns by category
  const groupedColumns = allColumns.reduce((acc, col) => {
    const group = col.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(col);
    return acc;
  }, {} as Record<string, ColumnConfig[]>);

  if (data.length === 0 && !loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data</h3>
          <p className="text-gray-600 mb-4">Belum ada data R-KAS yang tersedia. Silakan tambah data baru atau import dari file CSV.</p>
          <button
            onClick={onAdd}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Table Controls */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.length === data.length && data.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {selectedItems.length > 0 ? `${selectedItems.length} dipilih` : 'Pilih semua'}
              </span>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onAdd}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </button>
            
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <Settings className="w-4 h-4 mr-1" />
              Kolom
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan bidang, kegiatan, komponen, merk, spek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="text-sm text-gray-600">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, sortedData.length)} dari {sortedData.length} data
          </div>
        </div>
      </div>

      {/* Column Settings Panel */}
      {showColumnSettings && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Pengaturan Kolom</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(groupedColumns).map(([group, columns]) => (
              <div key={group} className="space-y-2">
                <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">{group}</h5>
                {columns.map(col => (
                  <label key={col.key} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={columnVisibility[col.key] !== false}
                      onChange={() => toggleColumnVisibility(col.key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-gray-700">{col.label}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === currentData.length && currentData.length > 0}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                
                {visibleColumns.map(col => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.width} ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.label}</span>
                      {col.sortable && renderSortIcon(col.key)}
                    </div>
                  </th>
                ))}
                
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Status
                </th>
                
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Aksi
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((item, index) => {
                const itemId = item.id || `${item.kodeBidang}-${item.kodeGiat}-${index}`;
                const isSelected = selectedItems.includes(itemId);
                
                return (
                  <tr
                    key={itemId}
                    className={`hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectItem(itemId)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    
                    {visibleColumns.map(col => (
                      <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={String(item[col.key] || '')}>
                          {formatCellValue(item[col.key], col.type)}
                        </div>
                      </td>
                    ))}
                    
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(item)}
                    </td>
                    
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onView(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="text-red-600 hover:text-red-900 transition-colors"
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
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Halaman {currentPage} dari {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Sebelumnya
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveRKASTable;