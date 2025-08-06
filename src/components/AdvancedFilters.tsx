import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, X, ChevronDown, Calendar, DollarSign, BarChart3, RefreshCw } from 'lucide-react';
import { KertasKerjaPerubahan } from '../utils/csvParser';
import { formatCurrency } from '../utils/validation';

export interface FilterCriteria {
  searchText: string;
  kodeBidang: string;
  namaBidang: string;
  kodeGiat: string;
  namaGiat: string;
  kodeRekening: string;
  namaRekening: string;
  namaKomponen: string;
  satuan: string;
  merk: string;
  
  // Range filters
  volumeMin: number;
  volumeMax: number;
  hargaMin: number;
  hargaMax: number;
  anggaranMin: number;
  anggaranMax: number;
  realisasiMin: number;
  realisasiMax: number;
  persentaseMin: number;
  persentaseMax: number;
  
  // Date and status filters
  periodYear: number;
  status: string;
  
  // Advanced filters
  hasRealisasi: boolean | null;
  isCompleted: boolean | null;
}

interface AdvancedFiltersProps {
  data: KertasKerjaPerubahan[];
  onFilterChange: (filteredData: KertasKerjaPerubahan[]) => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  data,
  onFilterChange,
  onExport
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>({
    searchText: '',
    kodeBidang: '',
    namaBidang: '',
    kodeGiat: '',
    namaGiat: '',
    kodeRekening: '',
    namaRekening: '',
    namaKomponen: '',
    satuan: '',
    merk: '',
    volumeMin: 0,
    volumeMax: 0,
    hargaMin: 0,
    hargaMax: 0,
    anggaranMin: 0,
    anggaranMax: 0,
    realisasiMin: 0,
    realisasiMax: 0,
    persentaseMin: 0,
    persentaseMax: 100,
    periodYear: new Date().getFullYear(),
    status: '',
    hasRealisasi: null,
    isCompleted: null
  });

  // Calculate data ranges for filter limits
  const dataRanges = useMemo(() => {
    if (data.length === 0) {
      return {
        volumeMax: 1000000,
        hargaMax: 10000000,
        anggaranMax: 100000000,
        realisasiMax: 100000000
      };
    }

    return {
      volumeMax: Math.max(...data.map(item => item.volume || 0)),
      hargaMax: Math.max(...data.map(item => item.hargaSatuan || 0)),
      anggaranMax: Math.max(...data.map(item => item.totalAkb || 0)),
      realisasiMax: Math.max(...data.map(item => item.totalRealisasi || 0))
    };
  }, [data]);

  // Get unique values for dropdown filters
  const uniqueValues = useMemo(() => {
    return {
      bidang: [...new Set(data.map(item => item.kodeBidang).filter(Boolean))].sort(),
      namaBidang: [...new Set(data.map(item => item.namaBidang).filter(Boolean))].sort(),
      kegiatan: [...new Set(data.map(item => item.kodeGiat).filter(Boolean))].sort(),
      namaGiat: [...new Set(data.map(item => item.namaGiat).filter(Boolean))].sort(),
      rekening: [...new Set(data.map(item => item.kodeRekening).filter(Boolean))].sort(),
      namaRekening: [...new Set(data.map(item => item.namaRekening).filter(Boolean))].sort(),
      komponen: [...new Set(data.map(item => item.namaKomponen).filter(Boolean))].sort(),
      satuan: [...new Set(data.map(item => item.satuan).filter(Boolean))].sort(),
      merk: [...new Set(data.map(item => item.merk).filter(Boolean))].sort(),
      years: [...new Set(data.map(item => item.periodYear || new Date().getFullYear()))].sort((a, b) => b - a)
    };
  }, [data]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Text search across multiple fields
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const searchableText = [
          item.kodeBidang,
          item.namaBidang,
          item.kodeGiat,
          item.namaGiat,
          item.kodeRekening,
          item.namaRekening,
          item.namaKomponen,
          item.satuan,
          item.merk,
          item.spek,
          item.keterangan
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      // Dropdown filters
      if (filters.kodeBidang && item.kodeBidang !== filters.kodeBidang) return false;
      if (filters.namaBidang && item.namaBidang !== filters.namaBidang) return false;
      if (filters.kodeGiat && item.kodeGiat !== filters.kodeGiat) return false;
      if (filters.namaGiat && item.namaGiat !== filters.namaGiat) return false;
      if (filters.kodeRekening && item.kodeRekening !== filters.kodeRekening) return false;
      if (filters.namaRekening && item.namaRekening !== filters.namaRekening) return false;
      if (filters.namaKomponen && item.namaKomponen !== filters.namaKomponen) return false;
      if (filters.satuan && item.satuan !== filters.satuan) return false;
      if (filters.merk && item.merk !== filters.merk) return false;

      // Range filters
      if (filters.volumeMin > 0 && (item.volume || 0) < filters.volumeMin) return false;
      if (filters.volumeMax > 0 && (item.volume || 0) > filters.volumeMax) return false;
      if (filters.hargaMin > 0 && (item.hargaSatuan || 0) < filters.hargaMin) return false;
      if (filters.hargaMax > 0 && (item.hargaSatuan || 0) > filters.hargaMax) return false;
      if (filters.anggaranMin > 0 && (item.totalAkb || 0) < filters.anggaranMin) return false;
      if (filters.anggaranMax > 0 && (item.totalAkb || 0) > filters.anggaranMax) return false;
      if (filters.realisasiMin > 0 && (item.totalRealisasi || 0) < filters.realisasiMin) return false;
      if (filters.realisasiMax > 0 && (item.totalRealisasi || 0) > filters.realisasiMax) return false;

      // Percentage filter
      const percentage = item.totalAkb ? (item.totalRealisasi / item.totalAkb) * 100 : 0;
      if (percentage < filters.persentaseMin || percentage > filters.persentaseMax) return false;

      // Year filter
      if (filters.periodYear && item.periodYear && item.periodYear !== filters.periodYear) return false;

      // Boolean filters
      if (filters.hasRealisasi !== null) {
        const hasRealisasi = (item.totalRealisasi || 0) > 0;
        if (hasRealisasi !== filters.hasRealisasi) return false;
      }

      if (filters.isCompleted !== null) {
        const isCompleted = item.totalAkb > 0 && item.totalRealisasi >= item.totalAkb;
        if (isCompleted !== filters.isCompleted) return false;
      }

      return true;
    });
  }, [data, filters]);

  // Update parent component when filtered data changes
  useEffect(() => {
    onFilterChange(filteredData);
  }, [filteredData, onFilterChange]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterCriteria, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      searchText: '',
      kodeBidang: '',
      namaBidang: '',
      kodeGiat: '',
      namaGiat: '',
      kodeRekening: '',
      namaRekening: '',
      namaKomponen: '',
      satuan: '',
      merk: '',
      volumeMin: 0,
      volumeMax: 0,
      hargaMin: 0,
      hargaMax: 0,
      anggaranMin: 0,
      anggaranMax: 0,
      realisasiMin: 0,
      realisasiMax: 0,
      persentaseMin: 0,
      persentaseMax: 100,
      periodYear: new Date().getFullYear(),
      status: '',
      hasRealisasi: null,
      isCompleted: null
    });
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchText) count++;
    if (filters.kodeBidang) count++;
    if (filters.namaBidang) count++;
    if (filters.kodeGiat) count++;
    if (filters.namaGiat) count++;
    if (filters.kodeRekening) count++;
    if (filters.namaRekening) count++;
    if (filters.namaKomponen) count++;
    if (filters.satuan) count++;
    if (filters.merk) count++;
    if (filters.volumeMin > 0 || filters.volumeMax > 0) count++;
    if (filters.hargaMin > 0 || filters.hargaMax > 0) count++;
    if (filters.anggaranMin > 0 || filters.anggaranMax > 0) count++;
    if (filters.realisasiMin > 0 || filters.realisasiMax > 0) count++;
    if (filters.persentaseMin > 0 || filters.persentaseMax < 100) count++;
    if (filters.hasRealisasi !== null) count++;
    if (filters.isCompleted !== null) count++;
    return count;
  }, [filters]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari data..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
              activeFiltersCount > 0
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Reset
            </button>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {filteredData.length} dari {data.length} data
          </span>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onExport('csv')}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              CSV
            </button>
            <button
              onClick={() => onExport('excel')}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Excel
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Dropdown Filters */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Kode Bidang</label>
              <select
                value={filters.kodeBidang}
                onChange={(e) => handleFilterChange('kodeBidang', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Bidang</option>
                {uniqueValues.bidang.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nama Bidang</label>
              <select
                value={filters.namaBidang}
                onChange={(e) => handleFilterChange('namaBidang', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Nama Bidang</option>
                {uniqueValues.namaBidang.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Kode Kegiatan</label>
              <select
                value={filters.kodeGiat}
                onChange={(e) => handleFilterChange('kodeGiat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Kegiatan</option>
                {uniqueValues.kegiatan.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Kode Rekening</label>
              <select
                value={filters.kodeRekening}
                onChange={(e) => handleFilterChange('kodeRekening', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Rekening</option>
                {uniqueValues.rekening.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Komponen</label>
              <select
                value={filters.namaKomponen}
                onChange={(e) => handleFilterChange('namaKomponen', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Komponen</option>
                {uniqueValues.komponen.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Satuan</label>
              <select
                value={filters.satuan}
                onChange={(e) => handleFilterChange('satuan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Satuan</option>
                {uniqueValues.satuan.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tahun Periode</label>
              <select
                value={filters.periodYear}
                onChange={(e) => handleFilterChange('periodYear', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {uniqueValues.years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status Realisasi</label>
              <select
                value={filters.hasRealisasi === null ? '' : filters.hasRealisasi.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('hasRealisasi', value === '' ? null : value === 'true');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Status</option>
                <option value="true">Ada Realisasi</option>
                <option value="false">Belum Ada Realisasi</option>
              </select>
            </div>
          </div>

          {/* Range Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Volume Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Rentang Volume
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.volumeMin || ''}
                  onChange={(e) => handleFilterChange('volumeMin', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.volumeMax || ''}
                  onChange={(e) => handleFilterChange('volumeMax', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Harga Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Rentang Harga
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.hargaMin || ''}
                  onChange={(e) => handleFilterChange('hargaMin', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.hargaMax || ''}
                  onChange={(e) => handleFilterChange('hargaMax', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Anggaran Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Rentang Anggaran
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.anggaranMin || ''}
                  onChange={(e) => handleFilterChange('anggaranMin', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.anggaranMax || ''}
                  onChange={(e) => handleFilterChange('anggaranMax', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Persentase Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Persentase Realisasi (%)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min %"
                  min="0"
                  max="100"
                  value={filters.persentaseMin || ''}
                  onChange={(e) => handleFilterChange('persentaseMin', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max %"
                  min="0"
                  max="100"
                  value={filters.persentaseMax || ''}
                  onChange={(e) => handleFilterChange('persentaseMax', parseFloat(e.target.value) || 100)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;