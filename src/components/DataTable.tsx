import React, { useState, useEffect, useMemo } from 'react'
import { 
  Search, Filter, Download, Upload, Plus, Edit2, Trash2, 
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  MoreVertical, Eye, Copy, RefreshCw, Settings, Calendar,
  BarChart3, TrendingUp, FileSpreadsheet, CheckSquare
} from 'lucide-react'
import { KertasKerjaPerubahan, FilterOptions } from '../types/database'
import { ColumnDefinition } from '../types/column'
import { ColumnService } from '../lib/columnService'
import { ApiService } from '../lib/api'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface DataTableProps {
  data: KertasKerjaPerubahan[]
  loading: boolean
  onRefresh: () => void
  onEdit: (item: KertasKerjaPerubahan) => void
  onDelete: (id: string) => void
  onAdd: () => void
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onColumnManagerOpen: () => void
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  loading,
  onRefresh,
  onEdit,
  onDelete,
  onAdd,
  filters,
  onFiltersChange,
  onColumnManagerOpen
}) => {
  const [columns, setColumns] = useState<ColumnDefinition[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [filterOptions, setFilterOptions] = useState<any>({})
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  useEffect(() => {
    loadColumns()
    loadFilterOptions()
  }, [])

  const loadColumns = () => {
    setColumns(ColumnService.getVisibleColumns())
  }

  const loadFilterOptions = async () => {
    try {
      const options = await ApiService.getFilterOptions()
      setFilterOptions(options)
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data]

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(item =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchLower)
        )
      )
    }

    return result
  }, [data, searchTerm])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn as keyof KertasKerjaPerubahan]
      const bValue = b[sortColumn as keyof KertasKerjaPerubahan]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      let comparison = 0
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else {
        comparison = String(aValue).localeCompare(String(bValue))
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortColumn, sortDirection])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (columnName: string) => {
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnName)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedData.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(paginatedData.map(item => item.id)))
    }
  }

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return

    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedItems.size} item?`)) {
      try {
        await ApiService.bulkDeleteKertasKerjaPerubahan(Array.from(selectedItems))
        toast.success(`${selectedItems.size} item berhasil dihapus`)
        setSelectedItems(new Set())
        onRefresh()
      } catch (error) {
        toast.error('Gagal menghapus item')
      }
    }
  }

  const handleExport = async () => {
    try {
      const exportData = await ApiService.exportToExcel(filters)
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Kertas Kerja Perubahan')
      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      
      const fileName = `kertas_kerja_perubahan_${new Date().toISOString().split('T')[0]}.xlsx`
      saveAs(blob, fileName)
      
      toast.success('Data berhasil diekspor')
    } catch (error) {
      toast.error('Gagal mengekspor data')
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        await ApiService.importFromExcel(jsonData)
        toast.success(`${jsonData.length} item berhasil diimpor`)
        onRefresh()
      } catch (error) {
        toast.error('Gagal mengimpor data')
      }
    }
    reader.readAsArrayBuffer(file)
    event.target.value = ''
  }

  const formatCurrency = (value: number | null) => {
    if (!value) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatValue = (value: any, column: ColumnDefinition) => {
    if (value === null || value === undefined) return '-'
    
    switch (column.type) {
      case 'number':
        if (column.name.includes('harga') || column.name.includes('nilai') || column.name.includes('total')) {
          return formatCurrency(Number(value))
        }
        return Number(value).toLocaleString('id-ID')
      case 'date':
        return new Date(value).toLocaleDateString('id-ID')
      default:
        return String(value)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Data R-KAS</h2>
            <span className="text-sm text-gray-500">
              {sortedData.length} dari {data.length} item
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Cari data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              >
                <FileSpreadsheet size={16} />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
              >
                <BarChart3 size={16} />
              </button>
            </div>

            {/* Actions */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Filter size={16} />
            </button>
            
            <button
              onClick={onRefresh}
              className="px-3 py-2 border rounded-lg hover:bg-gray-50"
            >
              <RefreshCw size={16} />
            </button>

            <button
              onClick={onColumnManagerOpen}
              className="px-3 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Settings size={16} />
            </button>

            <button
              onClick={handleExport}
              className="px-3 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Download size={16} />
            </button>

            <label className="px-3 py-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Upload size={16} />
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              onClick={onAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} className="inline mr-1" />
              Tambah
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tahun</label>
                <select
                  value={filters.tahun || ''}
                  onChange={(e) => onFiltersChange({ ...filters, tahun: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Semua Tahun</option>
                  {filterOptions.tahun?.map((year: number) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Periode</label>
                <select
                  value={filters.periode || 'bulanan'}
                  onChange={(e) => onFiltersChange({ ...filters, periode: e.target.value as 'bulanan' | 'triwulan' })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="bulanan">Bulanan</option>
                  <option value="triwulan">Triwulan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bidang</label>
                <select
                  value={filters.bidang || ''}
                  onChange={(e) => onFiltersChange({ ...filters, bidang: e.target.value || undefined })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Semua Bidang</option>
                  {filterOptions.bidang?.map((bidang: string) => (
                    <option key={bidang} value={bidang}>{bidang}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dana</label>
                <select
                  value={filters.dana || ''}
                  onChange={(e) => onFiltersChange({ ...filters, dana: e.target.value || undefined })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Semua Dana</option>
                  {filterOptions.dana?.map((dana: string) => (
                    <option key={dana} value={dana}>{dana}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedItems.size} item dipilih
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Hapus Terpilih
              </button>
              <button
                onClick={() => setSelectedItems(new Set())}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table/Cards View */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                {columns.map(column => (
                  <th
                    key={column.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.name)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {sortColumn === column.name ? (
                            sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                          ) : (
                            <ChevronUp size={16} className="opacity-50" />
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded"
                    />
                  </td>
                  {columns.map(column => (
                    <td key={column.id} className="px-4 py-3 text-sm">
                      <div className="max-w-xs truncate" title={String(item[column.name as keyof KertasKerjaPerubahan] || '')}>
                        {formatValue(item[column.name as keyof KertasKerjaPerubahan], column)}
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map(item => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded"
                    />
                    <h3 className="font-medium text-sm">{item.nama_komponen || 'Tidak ada nama'}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bidang:</span>
                    <span className="font-medium">{item.nama_bidang || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kegiatan:</span>
                    <span className="truncate ml-2">{item.nama_giat || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total AKB:</span>
                    <span className="font-medium text-blue-600">{formatCurrency(item.total_akb)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Realisasi:</span>
                    <span className="font-medium text-green-600">{formatCurrency(item.total_realisasi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tahun:</span>
                    <span>{item.tahun}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tampilkan</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-2 py-1 border rounded"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">per halaman</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

