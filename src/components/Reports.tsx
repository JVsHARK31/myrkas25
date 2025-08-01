import React, { useState } from 'react'
import { 
  FileText, Download, Calendar, Filter, TrendingUp, 
  PieChart, BarChart3, DollarSign, Target, AlertTriangle,
  CheckCircle, Clock, Eye, Printer, Mail, Share2
} from 'lucide-react'
import { FilterOptions } from '../types/database'
import toast from 'react-hot-toast'

interface ReportsProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  category: string
  lastGenerated?: string
}

interface ReportData {
  totalBudget: number
  totalRealization: number
  realizationPercentage: number
  variance: number
  departmentCount: number
  activeProjects: number
}

export const Reports: React.FC<ReportsProps> = ({ filters, onFiltersChange }) => {
  const [selectedReport, setSelectedReport] = useState<string>('')
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  })
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'budget-summary',
      name: 'Ringkasan Anggaran',
      description: 'Laporan ringkasan anggaran dan realisasi per departemen',
      icon: DollarSign,
      category: 'Keuangan'
    },
    {
      id: 'realization-analysis',
      name: 'Analisis Realisasi',
      description: 'Analisis detail realisasi anggaran dengan perbandingan target',
      icon: TrendingUp,
      category: 'Analisis'
    },
    {
      id: 'variance-report',
      name: 'Laporan Varians',
      description: 'Laporan selisih antara anggaran dan realisasi',
      icon: BarChart3,
      category: 'Analisis'
    },
    {
      id: 'department-breakdown',
      name: 'Breakdown per Departemen',
      description: 'Rincian anggaran dan realisasi per departemen/unit kerja',
      icon: PieChart,
      category: 'Departemen'
    },
    {
      id: 'monthly-trend',
      name: 'Tren Bulanan',
      description: 'Analisis tren realisasi anggaran per bulan',
      icon: Calendar,
      category: 'Tren'
    },
    {
      id: 'performance-dashboard',
      name: 'Dashboard Kinerja',
      description: 'Dashboard komprehensif kinerja keuangan sekolah',
      icon: Target,
      category: 'Dashboard'
    }
  ]

  const mockReportData: ReportData = {
    totalBudget: 15000000000,
    totalRealization: 11250000000,
    realizationPercentage: 75,
    variance: -3750000000,
    departmentCount: 12,
    activeProjects: 45
  }

  const categories = [...new Set(reportTemplates.map(template => template.category))]

  const generateReport = async () => {
    if (!selectedReport) {
      toast.error('Silakan pilih template laporan')
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const selectedTemplate = reportTemplates.find(t => t.id === selectedReport)
      toast.success(`Laporan "${selectedTemplate?.name}" berhasil dibuat`)
      
      // In real implementation, this would trigger file download
      const blob = new Blob(['Mock report content'], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedTemplate?.name}_${new Date().toISOString().split('T')[0]}.${reportFormat}`
      a.click()
      URL.revokeObjectURL(url)
      
    } catch (error) {
      toast.error('Gagal membuat laporan')
    } finally {
      setIsGenerating(false)
    }
  }

  const previewReport = () => {
    if (!selectedReport) {
      toast.error('Silakan pilih template laporan')
      return
    }
    setShowPreview(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Laporan R-KAS</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate dan kelola laporan keuangan sekolah
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={previewReport}
            disabled={!selectedReport}
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          <button
            onClick={generateReport}
            disabled={!selectedReport || isGenerating}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'Membuat...' : 'Generate Laporan'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Anggaran</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(mockReportData.totalBudget)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Realisasi</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(mockReportData.totalRealization)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Persentase Realisasi</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockReportData.realizationPercentage}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departemen Aktif</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockReportData.departmentCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Template Laporan</h3>
              <p className="text-gray-600 dark:text-gray-400">Pilih template laporan yang ingin dibuat</p>
            </div>
            <div className="p-6">
              {categories.map(category => (
                <div key={category} className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTemplates
                      .filter(template => template.category === category)
                      .map(template => {
                        const IconComponent = template.icon
                        return (
                          <div
                            key={template.id}
                            onClick={() => setSelectedReport(template.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedReport === template.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${
                                selectedReport === template.id
                                  ? 'bg-blue-100 dark:bg-blue-800'
                                  : 'bg-gray-100 dark:bg-gray-700'
                              }`}>
                                <IconComponent className={`w-5 h-5 ${
                                  selectedReport === template.id
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {template.name}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {template.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Settings */}
        <div className="space-y-6">
          {/* Date Range */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Periode Laporan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Format Output</h3>
            <div className="space-y-3">
              {[
                { value: 'pdf', label: 'PDF Document', icon: FileText },
                { value: 'excel', label: 'Excel Spreadsheet', icon: BarChart3 },
                { value: 'csv', label: 'CSV Data', icon: Download }
              ].map(format => (
                <label key={format.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value={format.value}
                    checked={reportFormat === format.value}
                    onChange={(e) => setReportFormat(e.target.value as any)}
                    className="text-blue-600"
                  />
                  <format.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 dark:text-white">{format.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                <Printer className="w-4 h-4 mr-2" />
                Print Laporan
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                Email Laporan
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Laporan Terbaru</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                name: 'Ringkasan Anggaran Q4 2024',
                type: 'PDF',
                date: '2024-01-15',
                size: '2.4 MB',
                status: 'completed'
              },
              {
                name: 'Analisis Realisasi Desember 2024',
                type: 'Excel',
                date: '2024-01-10',
                size: '1.8 MB',
                status: 'completed'
              },
              {
                name: 'Dashboard Kinerja 2024',
                type: 'PDF',
                date: '2024-01-05',
                size: '3.2 MB',
                status: 'completed'
              }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {report.type} • {report.size} • {new Date(report.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Selesai
                  </span>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview Laporan</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {reportTemplates.find(t => t.id === selectedReport)?.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Periode: {new Date(dateRange.startDate).toLocaleDateString('id-ID')} - {new Date(dateRange.endDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Total Anggaran</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(mockReportData.totalBudget)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Total Realisasi</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(mockReportData.totalRealization)}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Ringkasan Eksekutif</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Laporan ini menunjukkan kinerja keuangan sekolah untuk periode yang dipilih. 
                    Tingkat realisasi anggaran mencapai {mockReportData.realizationPercentage}% dari total anggaran yang dialokasikan. 
                    Terdapat {mockReportData.departmentCount} departemen yang aktif dengan {mockReportData.activeProjects} proyek yang sedang berjalan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

