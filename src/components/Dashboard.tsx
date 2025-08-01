import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, DollarSign, FileText, 
  Calendar, BarChart3, PieChart, Activity, Target,
  Users, Clock, AlertCircle, CheckCircle, Filter,
  Download, RefreshCw, Settings, Eye, Loader2
} from 'lucide-react'
import { ApiService } from '../lib/api'
import { FilterOptions, SummaryData, PeriodData } from '../types/database'
import toast from 'react-hot-toast'

interface DashboardProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}

export const Dashboard: React.FC<DashboardProps> = ({ filters, onFiltersChange }) => {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalAnggaran: 2500000000,
    totalRealisasi: 1875000000,
    persentaseRealisasi: 75,
    jumlahItem: 156
  })
  const [periodData, setPeriodData] = useState<PeriodData[]>([
    { label: 'Januari', value: 200000000, realisasi: 180000000 },
    { label: 'Februari', value: 220000000, realisasi: 165000000 },
    { label: 'Maret', value: 250000000, realisasi: 200000000 },
    { label: 'April', value: 180000000, realisasi: 150000000 }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterOptions, setFilterOptions] = useState<any>({
    tahun: [2023, 2024],
    bidang: ['Pendidikan', 'Kesehatan', 'Infrastruktur', 'Sosial']
  })
  const [selectedPeriode, setSelectedPeriode] = useState<'bulanan' | 'triwulan'>('bulanan')

  useEffect(() => {
    loadDashboardData()
    loadFilterOptions()
  }, [filters, selectedPeriode])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data based on filters
      const mockSummary = {
        totalAnggaran: filters.bidang ? 1500000000 : 2500000000,
        totalRealisasi: filters.bidang ? 1125000000 : 1875000000,
        persentaseRealisasi: 75,
        jumlahItem: filters.bidang ? 89 : 156
      }
      
      const mockPeriod = selectedPeriode === 'bulanan' ? [
        { label: 'Januari', value: 200000000, realisasi: 180000000 },
        { label: 'Februari', value: 220000000, realisasi: 165000000 },
        { label: 'Maret', value: 250000000, realisasi: 200000000 },
        { label: 'April', value: 180000000, realisasi: 150000000 }
      ] : [
        { label: 'Q1 2024', value: 670000000, realisasi: 545000000 },
        { label: 'Q2 2024', value: 580000000, realisasi: 480000000 },
        { label: 'Q3 2024', value: 620000000, realisasi: 510000000 },
        { label: 'Q4 2024', value: 630000000, realisasi: 340000000 }
      ]
      
      setSummaryData(mockSummary)
      setPeriodData(mockPeriod)
      
      // Try real API call but don't fail if it doesn't work
      try {
        const [summary, period] = await Promise.all([
          ApiService.getSummaryData(filters),
          ApiService.getPeriodData(filters, selectedPeriode)
        ])
        setSummaryData(summary)
        setPeriodData(period)
      } catch (apiError) {
        console.log('API not available, using mock data')
      }
      
    } catch (error) {
      setError('Gagal memuat data dashboard')
      toast.error('Gagal memuat data dashboard')
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFilterOptions = async () => {
    try {
      const options = await ApiService.getFilterOptions()
      setFilterOptions(options)
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getRealizationStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, status: 'Sangat Baik' }
    if (percentage >= 70) return { color: 'text-blue-600', bg: 'bg-blue-100', icon: TrendingUp, status: 'Baik' }
    if (percentage >= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock, status: 'Sedang' }
    return { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle, status: 'Perlu Perhatian' }
  }

  const realizationStatus = getRealizationStatus(summaryData.persentaseRealisasi)

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    bgColor, 
    change, 
    changeType 
  }: {
    title: string
    value: string
    icon: React.ElementType
    color: string
    bgColor: string
    change?: string
    changeType?: 'increase' | 'decrease' | 'neutral'
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'increase' && <TrendingUp size={16} className="text-green-500 mr-1" />}
              {changeType === 'decrease' && <TrendingDown size={16} className="text-red-500 mr-1" />}
              <span className={`text-sm ${
                changeType === 'increase' ? 'text-green-600' : 
                changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-full`}>
          <Icon className={`${color} w-6 h-6`} />
        </div>
      </div>
    </div>
  )

  const ChartCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Memuat data dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal Memuat Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header & Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Dashboard R-KAS</h1>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Data Terkini</span>
                  </div>
                </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Filter size={16} className="text-gray-500 flex-shrink-0" />
                <select
                  value={filters.tahun || ''}
                  onChange={(e) => onFiltersChange({ ...filters, tahun: e.target.value ? Number(e.target.value) : undefined })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Semua Tahun</option>
                  {filterOptions.tahun?.map((year: number) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                <select
                  value={selectedPeriode}
                  onChange={(e) => setSelectedPeriode(e.target.value as 'bulanan' | 'triwulan')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="bulanan">Bulanan</option>
                  <option value="triwulan">Triwulan</option>
                </select>
              </div>

              <select
                value={filters.bidang || ''}
                onChange={(e) => onFiltersChange({ ...filters, bidang: e.target.value || undefined })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Semua Bidang</option>
                {filterOptions.bidang?.map((bidang: string) => (
                  <option key={bidang} value={bidang}>{bidang}</option>
                ))}
              </select>

              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Anggaran"
          value={formatCurrency(summaryData.totalAnggaran)}
          icon={DollarSign}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        
        <StatCard
          title="Total Realisasi"
          value={formatCurrency(summaryData.totalRealisasi)}
          icon={TrendingUp}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        
        <StatCard
          title="Persentase Realisasi"
          value={formatPercentage(summaryData.persentaseRealisasi)}
          icon={realizationStatus.icon}
          color={realizationStatus.color}
          bgColor={realizationStatus.bg}
        />
        
        <StatCard
          title="Jumlah Item"
          value={summaryData.jumlahItem.toLocaleString('id-ID')}
          icon={FileText}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Status Realisasi</h3>
            <p className="text-gray-600">Berdasarkan persentase realisasi anggaran</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${realizationStatus.bg}`}>
            <realizationStatus.icon className={`w-5 h-5 ${realizationStatus.color}`} />
            <span className={`font-medium ${realizationStatus.color}`}>
              {realizationStatus.status}
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress Realisasi</span>
            <span>{formatPercentage(summaryData.persentaseRealisasi)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                summaryData.persentaseRealisasi >= 90 ? 'bg-green-600' :
                summaryData.persentaseRealisasi >= 70 ? 'bg-blue-600' :
                summaryData.persentaseRealisasi >= 50 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${Math.min(summaryData.persentaseRealisasi, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Period Chart */}
        <ChartCard title={`Anggaran vs Realisasi ${selectedPeriode === 'bulanan' ? 'Bulanan' : 'Triwulan'}`}>
          <div className="space-y-4">
            {periodData.map((period, index) => {
              const percentage = period.value > 0 ? (period.realisasi / period.value) * 100 : 0
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{period.label}</span>
                    <span className="text-sm text-gray-500">
                      {formatPercentage(percentage)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Anggaran: {formatCurrency(period.value)}</span>
                      <span>Realisasi: {formatCurrency(period.realisasi)}</span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>

        {/* Summary Chart */}
        <ChartCard title="Ringkasan Keuangan">
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray={`${summaryData.persentaseRealisasi}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPercentage(summaryData.persentaseRealisasi)}
                    </div>
                    <div className="text-xs text-gray-500">Realisasi</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Total Anggaran</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  {formatCurrency(summaryData.totalAnggaran)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Total Realisasi</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(summaryData.totalRealisasi)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Sisa Anggaran</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {formatCurrency(summaryData.totalAnggaran - summaryData.totalRealisasi)}
                </span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Export Data</div>
              <div className="text-sm text-gray-500">Download laporan Excel</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Analisis Detail</div>
              <div className="text-sm text-gray-500">Lihat laporan lengkap</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Pengaturan</div>
              <div className="text-sm text-gray-500">Konfigurasi sistem</div>
            </div>
          </button>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}

