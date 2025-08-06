import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Download, Eye, BarChart3, PieChart as PieChartIcon, Activity, Target, AlertCircle, CheckCircle } from 'lucide-react'
import { KertasKerjaPerubahan } from '../types/database'
import toast from 'react-hot-toast'

interface BudgetDetailAnalysisProps {
  data: KertasKerjaPerubahan[]
  selectedItem?: KertasKerjaPerubahan | null
  onClose?: () => void
}

interface AnalysisData {
  totalBudget: number
  totalRealization: number
  realizationPercentage: number
  variance: number
  monthlyData: Array<{
    month: string
    budget: number
    realization: number
    variance: number
  }>
  quarterlyData: Array<{
    quarter: string
    budget: number
    realization: number
    percentage: number
  }>
  bidangData: Array<{
    bidang: string
    budget: number
    realization: number
    count: number
  }>
  sumberDanaData: Array<{
    sumber: string
    budget: number
    percentage: number
  }>
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

const BudgetDetailAnalysis: React.FC<BudgetDetailAnalysisProps> = ({ data, selectedItem, onClose }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear())
  const [filterBidang, setFilterBidang] = useState<string>('')
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar')

  useEffect(() => {
    calculateAnalysis()
  }, [data, filterYear, filterBidang])

  const calculateAnalysis = () => {
    let filteredData = data.filter(item => item.tahun === filterYear)
    
    if (filterBidang) {
      filteredData = filteredData.filter(item => item.bidang_kegiatan === filterBidang)
    }

    if (filteredData.length === 0) {
      setAnalysisData(null)
      return
    }

    const totalBudget = filteredData.reduce((sum, item) => sum + (item.total_akb || 0), 0)
    const totalRealization = filteredData.reduce((sum, item) => sum + (item.total_realisasi || 0), 0)
    const realizationPercentage = totalBudget > 0 ? (totalRealization / totalBudget) * 100 : 0
    const variance = totalBudget - totalRealization

    // Monthly data
    const monthlyData = [
      { month: 'Jan', budget: 0, realization: 0, variance: 0 },
      { month: 'Feb', budget: 0, realization: 0, variance: 0 },
      { month: 'Mar', budget: 0, realization: 0, variance: 0 },
      { month: 'Apr', budget: 0, realization: 0, variance: 0 },
      { month: 'Mei', budget: 0, realization: 0, variance: 0 },
      { month: 'Jun', budget: 0, realization: 0, variance: 0 },
      { month: 'Jul', budget: 0, realization: 0, variance: 0 },
      { month: 'Agu', budget: 0, realization: 0, variance: 0 },
      { month: 'Sep', budget: 0, realization: 0, variance: 0 },
      { month: 'Okt', budget: 0, realization: 0, variance: 0 },
      { month: 'Nov', budget: 0, realization: 0, variance: 0 },
      { month: 'Des', budget: 0, realization: 0, variance: 0 }
    ]

    filteredData.forEach(item => {
      for (let i = 1; i <= 12; i++) {
        const budgetKey = `bulan_${i}` as keyof KertasKerjaPerubahan
        const realizationKey = `realisasi_bulan_${i}` as keyof KertasKerjaPerubahan
        
        monthlyData[i - 1].budget += Number(item[budgetKey]) || 0
        monthlyData[i - 1].realization += Number(item[realizationKey]) || 0
        monthlyData[i - 1].variance = monthlyData[i - 1].budget - monthlyData[i - 1].realization
      }
    })

    // Quarterly data
    const quarterlyData = [
      {
        quarter: 'TW 1',
        budget: monthlyData.slice(0, 3).reduce((sum, month) => sum + month.budget, 0),
        realization: monthlyData.slice(0, 3).reduce((sum, month) => sum + month.realization, 0),
        percentage: 0
      },
      {
        quarter: 'TW 2',
        budget: monthlyData.slice(3, 6).reduce((sum, month) => sum + month.budget, 0),
        realization: monthlyData.slice(3, 6).reduce((sum, month) => sum + month.realization, 0),
        percentage: 0
      },
      {
        quarter: 'TW 3',
        budget: monthlyData.slice(6, 9).reduce((sum, month) => sum + month.budget, 0),
        realization: monthlyData.slice(6, 9).reduce((sum, month) => sum + month.realization, 0),
        percentage: 0
      },
      {
        quarter: 'TW 4',
        budget: monthlyData.slice(9, 12).reduce((sum, month) => sum + month.budget, 0),
        realization: monthlyData.slice(9, 12).reduce((sum, month) => sum + month.realization, 0),
        percentage: 0
      }
    ]

    quarterlyData.forEach(quarter => {
      quarter.percentage = quarter.budget > 0 ? (quarter.realization / quarter.budget) * 100 : 0
    })

    // Bidang data
    const bidangMap = new Map<string, { budget: number; realization: number; count: number }>()
    filteredData.forEach(item => {
      const bidang = item.bidang_kegiatan || 'Tidak Diketahui'
      const existing = bidangMap.get(bidang) || { budget: 0, realization: 0, count: 0 }
      bidangMap.set(bidang, {
        budget: existing.budget + (item.total_akb || 0),
        realization: existing.realization + (item.total_realisasi || 0),
        count: existing.count + 1
      })
    })

    const bidangData = Array.from(bidangMap.entries()).map(([bidang, data]) => ({
      bidang,
      ...data
    }))

    // Sumber dana data
    const sumberDanaMap = new Map<string, number>()
    filteredData.forEach(item => {
      const sumber = item.sumber_dana || 'Tidak Diketahui'
      const existing = sumberDanaMap.get(sumber) || 0
      sumberDanaMap.set(sumber, existing + (item.total_akb || 0))
    })

    const sumberDanaData = Array.from(sumberDanaMap.entries()).map(([sumber, budget]) => ({
      sumber,
      budget,
      percentage: totalBudget > 0 ? (budget / totalBudget) * 100 : 0
    }))

    setAnalysisData({
      totalBudget,
      totalRealization,
      realizationPercentage,
      variance,
      monthlyData,
      quarterlyData,
      bidangData,
      sumberDanaData
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const exportAnalysis = () => {
    if (!analysisData) return
    
    const exportData = {
      summary: {
        totalBudget: analysisData.totalBudget,
        totalRealization: analysisData.totalRealization,
        realizationPercentage: analysisData.realizationPercentage,
        variance: analysisData.variance
      },
      monthlyData: analysisData.monthlyData,
      quarterlyData: analysisData.quarterlyData,
      bidangData: analysisData.bidangData,
      sumberDanaData: analysisData.sumberDanaData
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analisis-anggaran-${filterYear}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Data analisis berhasil diekspor')
  }

  const getUniqueYears = () => {
    const years = [...new Set(data.map(item => item.tahun))].filter(Boolean).sort((a, b) => b - a)
    return years
  }

  const getUniqueBidang = () => {
    const bidang = [...new Set(data.map(item => item.bidang_kegiatan))].filter(Boolean).sort()
    return bidang
  }

  const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: <Eye size={16} /> },
    { id: 'monthly', label: 'Bulanan', icon: <Calendar size={16} /> },
    { id: 'quarterly', label: 'Triwulan', icon: <BarChart3 size={16} /> },
    { id: 'bidang', label: 'Per Bidang', icon: <PieChartIcon size={16} /> },
    { id: 'sumber', label: 'Sumber Dana', icon: <DollarSign size={16} /> }
  ]

  if (!analysisData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Data</h3>
          <p className="text-gray-500">Tidak ada data anggaran untuk tahun {filterYear} yang dipilih.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Detail Analisis Anggaran</h2>
            <p className="text-blue-100 text-sm mt-1">
              Analisis komprehensif anggaran dan realisasi tahun {filterYear}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportAnalysis}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Ekspor</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="px-3 py-1 border rounded-md text-sm"
          >
            {getUniqueYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={filterBidang}
            onChange={(e) => setFilterBidang(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="">Semua Bidang</option>
            {getUniqueBidang().map(bidang => (
              <option key={bidang} value={bidang}>{bidang}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">Grafik:</span>
            <div className="flex rounded-md border">
              {(['bar', 'line', 'area'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1 text-xs font-medium ${
                    chartType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  } first:rounded-l-md last:rounded-r-md border-r last:border-r-0`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Anggaran</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {formatCurrency(analysisData.totalBudget)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Realisasi</p>
                    <p className="text-2xl font-bold text-green-700">
                      {formatCurrency(analysisData.totalRealization)}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Persentase Realisasi</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {formatPercentage(analysisData.realizationPercentage)}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className={`${analysisData.variance >= 0 ? 'bg-yellow-50' : 'bg-red-50'} p-4 rounded-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      analysisData.variance >= 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      Selisih
                    </p>
                    <p className={`text-2xl font-bold ${
                      analysisData.variance >= 0 ? 'text-yellow-700' : 'text-red-700'
                    }`}>
                      {formatCurrency(Math.abs(analysisData.variance))}
                    </p>
                  </div>
                  {analysisData.variance >= 0 ? (
                    <TrendingUp className="h-8 w-8 text-yellow-600" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </div>
            </div>

            {/* Performance Indicator */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Indikator Kinerja</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tingkat Realisasi</span>
                  <span className={`text-sm font-medium ${
                    analysisData.realizationPercentage >= 90 ? 'text-green-600' :
                    analysisData.realizationPercentage >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {analysisData.realizationPercentage >= 90 ? 'Sangat Baik' :
                     analysisData.realizationPercentage >= 70 ? 'Baik' : 'Perlu Perbaikan'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      analysisData.realizationPercentage >= 90 ? 'bg-green-600' :
                      analysisData.realizationPercentage >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(analysisData.realizationPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Analisis Bulanan</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' && (
                  <BarChart data={analysisData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="budget" fill="#3B82F6" name="Anggaran" />
                    <Bar dataKey="realization" fill="#10B981" name="Realisasi" />
                  </BarChart>
                )}
                {chartType === 'line' && (
                  <LineChart data={analysisData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="budget" stroke="#3B82F6" name="Anggaran" strokeWidth={2} />
                    <Line type="monotone" dataKey="realization" stroke="#10B981" name="Realisasi" strokeWidth={2} />
                  </LineChart>
                )}
                {chartType === 'area' && (
                  <AreaChart data={analysisData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Area type="monotone" dataKey="budget" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Anggaran" />
                    <Area type="monotone" dataKey="realization" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Realisasi" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'quarterly' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Analisis Triwulan</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysisData.quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="budget" fill="#3B82F6" name="Anggaran" />
                    <Bar dataKey="realization" fill="#10B981" name="Realisasi" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {analysisData.quarterlyData.map((quarter, index) => (
                  <div key={quarter.quarter} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{quarter.quarter}</h4>
                      <span className={`text-sm font-medium ${
                        quarter.percentage >= 90 ? 'text-green-600' :
                        quarter.percentage >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(quarter.percentage)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Anggaran:</span>
                        <span className="font-medium">{formatCurrency(quarter.budget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Realisasi:</span>
                        <span className="font-medium">{formatCurrency(quarter.realization)}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            quarter.percentage >= 90 ? 'bg-green-600' :
                            quarter.percentage >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${Math.min(quarter.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bidang' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Analisis Per Bidang Kegiatan</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysisData.bidangData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ bidang, percentage }) => `${bidang}: ${percentage?.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="budget"
                    >
                      {analysisData.bidangData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {analysisData.bidangData.map((bidang, index) => (
                  <div key={bidang.bidang} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <div>
                        <div className="font-medium">{bidang.bidang}</div>
                        <div className="text-sm text-gray-600">{bidang.count} kegiatan</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(bidang.budget)}</div>
                      <div className="text-sm text-gray-600">
                        {formatPercentage((bidang.realization / bidang.budget) * 100)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sumber' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Analisis Sumber Dana</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysisData.sumberDanaData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ sumber, percentage }) => `${percentage?.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="budget"
                    >
                      {analysisData.sumberDanaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {analysisData.sumberDanaData.map((sumber, index) => (
                  <div key={sumber.sumber} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <div className="font-medium text-sm">{sumber.sumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(sumber.budget)}</div>
                      <div className="text-sm text-gray-600">
                        {formatPercentage(sumber.percentage)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BudgetDetailAnalysis
export { BudgetDetailAnalysis }