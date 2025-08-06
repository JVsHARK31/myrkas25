import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  FileText,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle2,
  Eye,
  Search,
  Settings
} from 'lucide-react';
import { KertasKerjaPerubahan } from '../utils/csvParser';
import { formatCurrency } from '../utils/validation';
import BudgetDetailAnalysis from '../components/BudgetDetailAnalysis';
import {
  getBidangKegiatanLabel,
  getStandarNasionalLabel,
  getSumberDanaLabel,
  BIDANG_KEGIATAN_OPTIONS,
  STANDAR_NASIONAL_OPTIONS,
  SUMBER_DANA_OPTIONS
} from '../utils/constants';

interface FilterState {
  bidangKegiatan: string;
  standarNasional: string;
  sumberDana: string;
  dateRange: 'all' | 'q1' | 'q2' | 'q3' | 'q4';
  searchTerm: string;
}

interface BudgetSummaryCard {
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

const BudgetDetail: React.FC = () => {
  const [data, setData] = useState<KertasKerjaPerubahan[]>([]);
  const [filteredData, setFilteredData] = useState<KertasKerjaPerubahan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    bidangKegiatan: '',
    standarNasional: '',
    sumberDana: '',
    dateRange: 'all',
    searchTerm: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = localStorage.getItem('kertasKerjaData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setData(parsedData);
          setFilteredData(parsedData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...data];

    // Filter by bidang kegiatan
    if (filters.bidangKegiatan) {
      filtered = filtered.filter(item => item.bidangKegiatan === filters.bidangKegiatan);
    }

    // Filter by standar nasional
    if (filters.standarNasional) {
      filtered = filtered.filter(item => item.standarNasional === filters.standarNasional);
    }

    // Filter by sumber dana
    if (filters.sumberDana) {
      filtered = filtered.filter(item => item.sumberDana === filters.sumberDana);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.namaKegiatan?.toLowerCase().includes(searchLower) ||
        item.rincianKegiatan?.toLowerCase().includes(searchLower) ||
        item.spesifikasiKegiatan?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredData(filtered);
  }, [data, filters]);

  // Calculate summary statistics
  const summaryStats = React.useMemo(() => {
    const totalBudget = filteredData.reduce((sum, item) => sum + (item.totalAkb || 0), 0);
    const totalRealization = filteredData.reduce((sum, item) => sum + (item.totalRealisasi || 0), 0);
    const realizationPercentage = totalBudget > 0 ? (totalRealization / totalBudget) * 100 : 0;
    const remainingBudget = totalBudget - totalRealization;
    const variance = totalRealization - totalBudget;
    const activeProjects = filteredData.length;
    const completedProjects = filteredData.filter(item => 
      (item.totalRealisasi || 0) >= (item.totalAkb || 0) * 0.95
    ).length;

    return {
      totalBudget,
      totalRealization,
      realizationPercentage,
      remainingBudget,
      variance,
      activeProjects,
      completedProjects
    };
  }, [filteredData]);

  // Summary cards configuration
  const summaryCards: BudgetSummaryCard[] = [
    {
      title: 'Total Anggaran',
      value: summaryStats.totalBudget,
      change: 0,
      changeType: 'neutral',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Total Realisasi',
      value: summaryStats.totalRealization,
      change: summaryStats.realizationPercentage,
      changeType: summaryStats.realizationPercentage >= 75 ? 'increase' : 'decrease',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Sisa Anggaran',
      value: summaryStats.remainingBudget,
      change: 0,
      changeType: 'neutral',
      icon: Target,
      color: 'yellow'
    },
    {
      title: 'Proyek Aktif',
      value: summaryStats.activeProjects,
      change: summaryStats.completedProjects,
      changeType: 'neutral',
      icon: BarChart3,
      color: 'purple'
    }
  ];

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      bidangKegiatan: '',
      standarNasional: '',
      sumberDana: '',
      dateRange: 'all',
      searchTerm: ''
    });
  };

  // Export filtered data
  const handleExport = () => {
    const exportData = {
      summary: summaryStats,
      data: filteredData,
      filters,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-detail-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get color classes for summary cards
  const getCardColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      purple: 'bg-purple-50 border-purple-200',
      red: 'bg-red-50 border-red-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600',
      red: 'text-red-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Memuat data anggaran...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Anggaran R-KAS</h1>
              <p className="text-sm text-gray-600 mt-1">
                Analisis komprehensif dan monitoring realisasi anggaran
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAnalysis(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analisis Detail
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-xl border-2 ${getCardColorClasses(card.color)} transition-all hover:shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.title.includes('Proyek') 
                        ? card.value.toLocaleString()
                        : formatCurrency(card.value)
                      }
                    </p>
                    {card.change !== 0 && (
                      <div className="flex items-center mt-2">
                        {card.changeType === 'increase' ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : card.changeType === 'decrease' ? (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        ) : null}
                        <span className={`text-sm font-medium ${
                          card.changeType === 'increase' ? 'text-green-600' :
                          card.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {card.title === 'Total Realisasi' 
                            ? `${card.change.toFixed(1)}% realisasi`
                            : card.title === 'Proyek Aktif'
                            ? `${card.change} selesai`
                            : `${card.change.toFixed(1)}%`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  <Icon className={`w-8 h-8 ${getIconColorClasses(card.color)}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter & Pencarian
            </h2>
            <button
              onClick={resetFilters}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Reset
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari kegiatan..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Bidang Kegiatan Filter */}
            <select
              value={filters.bidangKegiatan}
              onChange={(e) => handleFilterChange('bidangKegiatan', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Bidang</option>
              {BIDANG_KEGIATAN_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {/* Standar Nasional Filter */}
            <select
              value={filters.standarNasional}
              onChange={(e) => handleFilterChange('standarNasional', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Standar</option>
              {STANDAR_NASIONAL_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {/* Sumber Dana Filter */}
            <select
              value={filters.sumberDana}
              onChange={(e) => handleFilterChange('sumberDana', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Sumber</option>
              {SUMBER_DANA_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {/* Date Range Filter */}
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Periode</option>
              <option value="q1">Triwulan 1</option>
              <option value="q2">Triwulan 2</option>
              <option value="q3">Triwulan 3</option>
              <option value="q4">Triwulan 4</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Data Anggaran ({filteredData.length} item)
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Total: {formatCurrency(summaryStats.totalBudget)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kegiatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bidang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Standar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sumber Dana
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anggaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Realisasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">Tidak ada data</p>
                        <p className="text-sm text-gray-600">
                          Tidak ada data yang sesuai dengan filter yang dipilih
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => {
                    const progress = item.totalAkb ? (item.totalRealisasi || 0) / item.totalAkb * 100 : 0;
                    const status = progress >= 95 ? 'completed' : progress >= 75 ? 'good' : progress >= 50 ? 'warning' : 'critical';
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.namaKegiatan || 'Tidak ada nama'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.rincianKegiatan || 'Tidak ada rincian'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {getBidangKegiatanLabel(item.bidangKegiatan || '')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {getStandarNasionalLabel(item.standarNasional || '')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {getSumberDanaLabel(item.sumberDana || '')}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(item.totalAkb || 0)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(item.totalRealisasi || 0)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${
                                  status === 'completed' ? 'bg-green-600' :
                                  status === 'good' ? 'bg-blue-600' :
                                  status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                              {progress.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            status === 'completed' ? 'bg-green-100 text-green-800' :
                            status === 'good' ? 'bg-blue-100 text-blue-800' :
                            status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {status === 'completed' ? (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            ) : status === 'good' ? (
                              <Target className="w-3 h-3 mr-1" />
                            ) : status === 'warning' ? (
                              <AlertTriangle className="w-3 h-3 mr-1" />
                            ) : (
                              <AlertCircle className="w-3 h-3 mr-1" />
                            )}
                            {status === 'completed' ? 'Selesai' :
                             status === 'good' ? 'Baik' :
                             status === 'warning' ? 'Perhatian' : 'Kritis'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Budget Detail Analysis Modal */}
      <BudgetDetailAnalysis
        data={filteredData}
        isOpen={showAnalysis}
        onClose={() => setShowAnalysis(false)}
      />
    </div>
  );
};

export default BudgetDetail;