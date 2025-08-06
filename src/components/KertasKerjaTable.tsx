import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Edit, Trash2, Eye, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { KertasKerjaPerubahan } from '../utils/csvParser';
import { formatCurrency, formatNumber } from '../utils/validation';
import { getBidangKegiatanLabel, getStandarNasionalLabel, getSumberDanaLabel } from '../utils/constants';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof KertasKerjaPerubahan;
  direction: SortDirection;
}

interface KertasKerjaTableProps {
  data: KertasKerjaPerubahan[];
  onEdit: (item: KertasKerjaPerubahan) => void;
  onDelete: (item: KertasKerjaPerubahan) => void;
  onView: (item: KertasKerjaPerubahan) => void;
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  viewMode: 'summary' | 'detail';
}

const ITEMS_PER_PAGE = 10;

const KertasKerjaTable: React.FC<KertasKerjaTableProps> = ({
  data,
  onEdit,
  onDelete,
  onView,
  selectedItems,
  onSelectItem,
  onSelectAll,
  viewMode
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'kodeBidang', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.direction) return data;

    return [...data].sort((a, b) => {
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
  }, [data, sortConfig]);

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

  // Handle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="w-4 h-4 text-blue-600" />;
    }
    if (sortConfig.direction === 'desc') {
      return <ChevronDown className="w-4 h-4 text-blue-600" />;
    }
    return <ChevronUp className="w-4 h-4 text-gray-400" />;
  };

  // Summary view columns
  const summaryColumns = [
    { key: 'kodeBidang' as keyof KertasKerjaPerubahan, label: 'Kode Bidang', width: 'w-24' },
    { key: 'namaBidang' as keyof KertasKerjaPerubahan, label: 'Nama Bidang', width: 'w-40' },
    { key: 'bidangKegiatan' as keyof KertasKerjaPerubahan, label: 'Bidang Kegiatan', width: 'w-32' },
    { key: 'standarNasional' as keyof KertasKerjaPerubahan, label: 'Standar Nasional', width: 'w-36' },
    { key: 'sumberDana' as keyof KertasKerjaPerubahan, label: 'Sumber Dana', width: 'w-32' },
    { key: 'kodeGiat' as keyof KertasKerjaPerubahan, label: 'Kode Kegiatan', width: 'w-32' },
    { key: 'namaGiat' as keyof KertasKerjaPerubahan, label: 'Nama Kegiatan', width: 'w-60' },
    { key: 'namaKomponen' as keyof KertasKerjaPerubahan, label: 'Komponen', width: 'w-40' },
    { key: 'totalAkb' as keyof KertasKerjaPerubahan, label: 'Total Anggaran', width: 'w-32' },
    { key: 'totalRealisasi' as keyof KertasKerjaPerubahan, label: 'Total Realisasi', width: 'w-32' },
  ];

  // Detail view columns
  const detailColumns = [
    { key: 'kodeBidang' as keyof KertasKerjaPerubahan, label: 'Kode Bidang', width: 'w-20' },
    { key: 'namaBidang' as keyof KertasKerjaPerubahan, label: 'Nama Bidang', width: 'w-32' },
    { key: 'bidangKegiatan' as keyof KertasKerjaPerubahan, label: 'Bidang Kegiatan', width: 'w-28' },
    { key: 'standarNasional' as keyof KertasKerjaPerubahan, label: 'Standar Nasional', width: 'w-32' },
    { key: 'sumberDana' as keyof KertasKerjaPerubahan, label: 'Sumber Dana', width: 'w-28' },
    { key: 'kodeGiat' as keyof KertasKerjaPerubahan, label: 'Kode Kegiatan', width: 'w-28' },
    { key: 'namaGiat' as keyof KertasKerjaPerubahan, label: 'Nama Kegiatan', width: 'w-48' },
    { key: 'kodeRekening' as keyof KertasKerjaPerubahan, label: 'Kode Rekening', width: 'w-28' },
    { key: 'namaRekening' as keyof KertasKerjaPerubahan, label: 'Nama Rekening', width: 'w-40' },
    { key: 'namaKomponen' as keyof KertasKerjaPerubahan, label: 'Komponen', width: 'w-32' },
    { key: 'satuan' as keyof KertasKerjaPerubahan, label: 'Satuan', width: 'w-20' },
    { key: 'volume' as keyof KertasKerjaPerubahan, label: 'Volume', width: 'w-20' },
    { key: 'hargaSatuan' as keyof KertasKerjaPerubahan, label: 'Harga Satuan', width: 'w-28' },
    { key: 'nilaiRincian' as keyof KertasKerjaPerubahan, label: 'Nilai Rincian', width: 'w-28' },
    { key: 'totalAkb' as keyof KertasKerjaPerubahan, label: 'Total AKB', width: 'w-28' },
    { key: 'totalRealisasi' as keyof KertasKerjaPerubahan, label: 'Total Realisasi', width: 'w-28' },
  ];

  const columns = viewMode === 'summary' ? summaryColumns : detailColumns;

  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data</h3>
          <p className="text-gray-600">Belum ada data R-KAS yang tersedia. Silakan tambah data baru atau import dari file CSV.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
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
          
          <div className="text-sm text-gray-600">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, sortedData.length)} dari {sortedData.length} data
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <span className="sr-only">Select</span>
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${column.width} px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    {renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
              <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => {
              const isSelected = selectedItems.includes(item.id || '');
              const isExpanded = expandedRows.has(item.id || '');
              const percentage = calculatePercentage(item.totalRealisasi || 0, item.totalAkb || 0);
              
              return (
                <React.Fragment key={item.id || index}>
                  <tr className={`hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectItem(item.id || '')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    
                    {columns.map((column) => {
                      const value = item[column.key];
                      let displayValue: React.ReactNode = value;
                      
                      // Format different types of values
                      if (typeof value === 'number') {
                        if (column.key.includes('total') || column.key.includes('nilai') || column.key.includes('harga')) {
                          displayValue = formatCurrency(value);
                        } else {
                          displayValue = formatNumber(value);
                        }
                      } else if (typeof value === 'string') {
                        // Handle dropdown fields with user-friendly labels
                        if (column.key === 'bidangKegiatan') {
                          displayValue = getBidangKegiatanLabel(value);
                        } else if (column.key === 'standarNasional') {
                          displayValue = getStandarNasionalLabel(value);
                        } else if (column.key === 'sumberDana') {
                          displayValue = getSumberDanaLabel(value);
                        } else if (value.length > 50) {
                          displayValue = (
                            <span title={value}>
                              {value.substring(0, 50)}...
                            </span>
                          );
                        }
                      }
                      
                      return (
                        <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                          {displayValue}
                        </td>
                      );
                    })}
                    
                    <td className="px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        {getStatusBadge(item)}
                        <div className="text-xs text-gray-600">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onView(item)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleRowExpansion(item.id || '')}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Expand"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row */}
                  {isExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={columns.length + 3} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Basic Information */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Informasi Dasar</h4>
                            <div className="text-sm space-y-1">
                              <div><span className="font-medium">ID Kegiatan:</span> {item.idGiat}</div>
                              <div><span className="font-medium">Subtitle:</span> {item.subtitle}</div>
                              <div><span className="font-medium">Dana:</span> {item.kodeDana} - {item.namaDana}</div>
                              <div><span className="font-medium">Merk:</span> {item.merk}</div>
                              <div><span className="font-medium">Spesifikasi:</span> {item.spek}</div>
                            </div>
                          </div>
                          
                          {/* Volume Details */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Detail Volume</h4>
                            <div className="text-sm space-y-1">
                              <div><span className="font-medium">Volume 1:</span> {item.vol1} {item.sat1}</div>
                              <div><span className="font-medium">Volume 2:</span> {item.vol2} {item.sat2}</div>
                              <div><span className="font-medium">Volume 3:</span> {item.vol3} {item.sat3}</div>
                              <div><span className="font-medium">Volume 4:</span> {item.vol4} {item.sat4}</div>
                              <div><span className="font-medium">Koefisien:</span> {item.koefisien}</div>
                            </div>
                          </div>
                          
                          {/* Financial Summary */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Ringkasan Keuangan</h4>
                            <div className="text-sm space-y-1">
                              <div><span className="font-medium">Nilai Rincian Murni:</span> {formatCurrency(item.nilaiRincianMurni || 0)}</div>
                              <div><span className="font-medium">TW 1:</span> {formatCurrency(item.anggaranTw1 || 0)} / {formatCurrency(item.realisasiTw1 || 0)}</div>
                              <div><span className="font-medium">TW 2:</span> {formatCurrency(item.anggaranTw2 || 0)} / {formatCurrency(item.realisasiTw2 || 0)}</div>
                              <div><span className="font-medium">TW 3:</span> {formatCurrency(item.anggaranTw3 || 0)} / {formatCurrency(item.realisasiTw3 || 0)}</div>
                              <div><span className="font-medium">TW 4:</span> {formatCurrency(item.anggaranTw4 || 0)} / {formatCurrency(item.realisasiTw4 || 0)}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Keterangan */}
                        {(item.keterangan || item.keteranganRincian) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">Keterangan</h4>
                            {item.keteranganRincian && (
                              <div className="text-sm text-gray-700 mb-2">
                                <span className="font-medium">Keterangan Rincian:</span> {item.keteranganRincian}
                              </div>
                            )}
                            {item.keterangan && (
                              <div className="text-sm text-gray-700">
                                <span className="font-medium">Keterangan:</span> {item.keterangan}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Halaman {currentPage} dari {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Sebelumnya
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default KertasKerjaTable;