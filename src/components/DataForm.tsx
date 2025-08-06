import React, { useState, useEffect } from 'react'
import { X, Save, Plus, Trash2, Calculator, Calendar, DollarSign } from 'lucide-react'
import { KertasKerjaPerubahan, KertasKerjaPerubahanInsert, KertasKerjaPerubahanUpdate } from '../types/database'
import { ColumnDefinition } from '../types/column'
import { ColumnService } from '../lib/columnService'
import { ApiService } from '../lib/api'
import toast from 'react-hot-toast'

interface DataFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  item?: KertasKerjaPerubahan | null
  mode: 'add' | 'edit'
}

export const DataForm: React.FC<DataFormProps> = ({ isOpen, onClose, onSave, item, mode }) => {
  const [formData, setFormData] = useState<Partial<KertasKerjaPerubahanInsert>>({})
  const [columns, setColumns] = useState<ColumnDefinition[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('basic')
  const [calculatedValues, setCalculatedValues] = useState({
    totalVolume: 0,
    totalNilai: 0,
    totalAnggaran: 0,
    totalRealisasi: 0
  })

  useEffect(() => {
    if (isOpen) {
      setColumns(ColumnService.getEditableColumns())
      if (mode === 'edit' && item) {
        setFormData(item)
      } else {
        setFormData({
          tahun: new Date().getFullYear(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, item])

  useEffect(() => {
    calculateValues()
  }, [
    formData.volume, 
    formData.harga_satuan, 
    formData.koefisien,
    formData.bulan_1, formData.bulan_2, formData.bulan_3, formData.bulan_4,
    formData.bulan_5, formData.bulan_6, formData.bulan_7, formData.bulan_8,
    formData.bulan_9, formData.bulan_10, formData.bulan_11, formData.bulan_12,
    formData.realisasi_bulan_1, formData.realisasi_bulan_2, formData.realisasi_bulan_3,
    formData.realisasi_bulan_4, formData.realisasi_bulan_5, formData.realisasi_bulan_6,
    formData.realisasi_bulan_7, formData.realisasi_bulan_8, formData.realisasi_bulan_9,
    formData.realisasi_bulan_10, formData.realisasi_bulan_11, formData.realisasi_bulan_12
  ])

  const calculateValues = () => {
    const volume = Number(formData.volume) || 0
    const hargaSatuan = Number(formData.harga_satuan) || 0
    const koefisien = Number(formData.koefisien) || 1

    const totalVolume = volume * koefisien
    const totalNilai = totalVolume * hargaSatuan

    // Calculate total anggaran (sum of all monthly budgets)
    const totalAnggaran = [
      'bulan_1', 'bulan_2', 'bulan_3', 'bulan_4', 'bulan_5', 'bulan_6',
      'bulan_7', 'bulan_8', 'bulan_9', 'bulan_10', 'bulan_11', 'bulan_12'
    ].reduce((sum, month) => sum + (Number(formData[month as keyof typeof formData]) || 0), 0)

    // Calculate total realisasi
    const totalRealisasi = [
      'realisasi_bulan_1', 'realisasi_bulan_2', 'realisasi_bulan_3', 'realisasi_bulan_4',
      'realisasi_bulan_5', 'realisasi_bulan_6', 'realisasi_bulan_7', 'realisasi_bulan_8',
      'realisasi_bulan_9', 'realisasi_bulan_10', 'realisasi_bulan_11', 'realisasi_bulan_12'
    ].reduce((sum, month) => sum + (Number(formData[month as keyof typeof formData]) || 0), 0)

    setCalculatedValues({
      totalVolume,
      totalNilai,
      totalAnggaran,
      totalRealisasi
    })

    // Auto-update calculated fields
    setFormData(prev => ({
      ...prev,
      nilai_rincian: totalNilai,
      total_akb: totalAnggaran,
      total_realisasi: totalRealisasi,
      tw_1: (Number(prev.bulan_1) || 0) + (Number(prev.bulan_2) || 0) + (Number(prev.bulan_3) || 0),
      tw_2: (Number(prev.bulan_4) || 0) + (Number(prev.bulan_5) || 0) + (Number(prev.bulan_6) || 0),
      tw_3: (Number(prev.bulan_7) || 0) + (Number(prev.bulan_8) || 0) + (Number(prev.bulan_9) || 0),
      tw_4: (Number(prev.bulan_10) || 0) + (Number(prev.bulan_11) || 0) + (Number(prev.bulan_12) || 0),
      realisasi_tw_1: (Number(prev.realisasi_bulan_1) || 0) + (Number(prev.realisasi_bulan_2) || 0) + (Number(prev.realisasi_bulan_3) || 0),
      realisasi_tw_2: (Number(prev.realisasi_bulan_4) || 0) + (Number(prev.realisasi_bulan_5) || 0) + (Number(prev.realisasi_bulan_6) || 0),
      realisasi_tw_3: (Number(prev.realisasi_bulan_7) || 0) + (Number(prev.realisasi_bulan_8) || 0) + (Number(prev.realisasi_bulan_9) || 0),
      realisasi_tw_4: (Number(prev.realisasi_bulan_10) || 0) + (Number(prev.realisasi_bulan_11) || 0) + (Number(prev.realisasi_bulan_12) || 0)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    columns.forEach(column => {
      const value = formData[column.name as keyof typeof formData]
      const validation = ColumnService.validateColumnData(column.id, value)
      
      if (!validation.valid) {
        newErrors[column.name] = validation.message || 'Invalid value'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Mohon perbaiki kesalahan pada form')
      return
    }

    setLoading(true)
    try {
      if (mode === 'edit' && item) {
        await ApiService.updateKertasKerjaPerubahan(item.id, formData as KertasKerjaPerubahanUpdate)
        toast.success('Data berhasil diperbarui')
      } else {
        await ApiService.createKertasKerjaPerubahan(formData as KertasKerjaPerubahanInsert)
        toast.success('Data berhasil ditambahkan')
      }
      onSave()
      onClose()
    } catch (error) {
      toast.error('Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      updated_at: new Date().toISOString()
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const renderField = (column: ColumnDefinition) => {
    const value = formData[column.name as keyof typeof formData]
    const error = errors[column.name]

    const baseClasses = `w-full px-3 py-2 border rounded-md ${
      error ? 'border-red-500' : 'border-gray-300'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`

    switch (column.type) {
      case 'textarea':
        return (
          <textarea
            value={String(value || '')}
            onChange={(e) => handleInputChange(column.name, e.target.value)}
            className={`${baseClasses} h-20 resize-none`}
            placeholder={`Masukkan ${column.label.toLowerCase()}`}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(column.name, e.target.value ? Number(e.target.value) : null)}
            className={baseClasses}
            placeholder={`Masukkan ${column.label.toLowerCase()}`}
            min={column.validation?.min}
            max={column.validation?.max}
            step={column.name.includes('harga') || column.name.includes('nilai') ? '0.01' : '1'}
          />
        )

      case 'date':
        return (
          <input
            type="date"
            value={value ? new Date(value).toISOString().split('T')[0] : ''}
            onChange={(e) => handleInputChange(column.name, e.target.value)}
            className={baseClasses}
          />
        )

      case 'select':
        return (
          <select
            value={String(value || '')}
            onChange={(e) => handleInputChange(column.name, e.target.value)}
            className={baseClasses}
          >
            <option value="">Pilih {column.label}</option>
            {column.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )

      default:
        return (
          <input
            type="text"
            value={String(value || '')}
            onChange={(e) => handleInputChange(column.name, e.target.value)}
            className={baseClasses}
            placeholder={`Masukkan ${column.label.toLowerCase()}`}
          />
        )
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  const tabs = [
    { id: 'basic', label: 'Informasi Dasar', icon: <DollarSign size={16} /> },
    { id: 'budget', label: 'Anggaran Bulanan', icon: <Calendar size={16} /> },
    { id: 'realization', label: 'Realisasi Bulanan', icon: <Calculator size={16} /> },
    { id: 'details', label: 'Detail Lainnya', icon: <Plus size={16} /> }
  ]

  const months = [
    { key: 'bulan_1', label: 'Januari' },
    { key: 'bulan_2', label: 'Februari' },
    { key: 'bulan_3', label: 'Maret' },
    { key: 'bulan_4', label: 'April' },
    { key: 'bulan_5', label: 'Mei' },
    { key: 'bulan_6', label: 'Juni' },
    { key: 'bulan_7', label: 'Juli' },
    { key: 'bulan_8', label: 'Agustus' },
    { key: 'bulan_9', label: 'September' },
    { key: 'bulan_10', label: 'Oktober' },
    { key: 'bulan_11', label: 'November' },
    { key: 'bulan_12', label: 'Desember' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-5/6 flex flex-col transform transition-all duration-300 ease-out border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {mode === 'edit' ? 'Edit Data' : 'Tambah Data Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Calculation Summary */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-600">Total Volume</div>
              <div className="font-semibold">{calculatedValues.totalVolume.toLocaleString('id-ID')}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Total Nilai</div>
              <div className="font-semibold text-blue-600">{formatCurrency(calculatedValues.totalNilai)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Total Anggaran</div>
              <div className="font-semibold text-green-600">{formatCurrency(calculatedValues.totalAnggaran)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Total Realisasi</div>
              <div className="font-semibold text-purple-600">{formatCurrency(calculatedValues.totalRealisasi)}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
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

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {columns
                  .filter(col => ['kode_bidang', 'nama_bidang', 'kode_standar', 'nama_standar', 'nama_giat', 'nama_komponen', 'bidang_kegiatan', 'standar_nasional', 'sumber_dana', 'satuan', 'volume', 'harga_satuan', 'koefisien', 'tahun'].includes(col.name))
                  .map(column => (
                    <div key={column.id}>
                      <label className="block text-sm font-medium mb-2">
                        {column.label}
                        {column.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(column)}
                      {errors[column.name] && (
                        <p className="text-red-500 text-sm mt-1">{errors[column.name]}</p>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Anggaran Kas Belanja (AKB)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {months.map(month => (
                    <div key={month.key}>
                      <label className="block text-sm font-medium mb-2">{month.label}</label>
                      <input
                        type="number"
                        value={formData[month.key as keyof typeof formData] || ''}
                        onChange={(e) => handleInputChange(month.key, e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h4 className="text-md font-medium mb-4">Ringkasan Triwulan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">TW 1 (Jan-Mar)</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {formatCurrency(
                          (Number(formData.bulan_1) || 0) + 
                          (Number(formData.bulan_2) || 0) + 
                          (Number(formData.bulan_3) || 0)
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">TW 2 (Apr-Jun)</div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(
                          (Number(formData.bulan_4) || 0) + 
                          (Number(formData.bulan_5) || 0) + 
                          (Number(formData.bulan_6) || 0)
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="text-sm text-gray-600">TW 3 (Jul-Sep)</div>
                      <div className="text-lg font-semibold text-yellow-600">
                        {formatCurrency(
                          (Number(formData.bulan_7) || 0) + 
                          (Number(formData.bulan_8) || 0) + 
                          (Number(formData.bulan_9) || 0)
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">TW 4 (Okt-Des)</div>
                      <div className="text-lg font-semibold text-purple-600">
                        {formatCurrency(
                          (Number(formData.bulan_10) || 0) + 
                          (Number(formData.bulan_11) || 0) + 
                          (Number(formData.bulan_12) || 0)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'realization' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Realisasi Bulanan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {months.map(month => (
                    <div key={`realisasi_${month.key}`}>
                      <label className="block text-sm font-medium mb-2">{month.label}</label>
                      <input
                        type="number"
                        value={formData[`realisasi_${month.key}` as keyof typeof formData] || ''}
                        onChange={(e) => handleInputChange(`realisasi_${month.key}`, e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h4 className="text-md font-medium mb-4">Ringkasan Realisasi Triwulan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">TW 1 (Jan-Mar)</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {formatCurrency(
                          (Number(formData.realisasi_bulan_1) || 0) + 
                          (Number(formData.realisasi_bulan_2) || 0) + 
                          (Number(formData.realisasi_bulan_3) || 0)
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">TW 2 (Apr-Jun)</div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(
                          (Number(formData.realisasi_bulan_4) || 0) + 
                          (Number(formData.realisasi_bulan_5) || 0) + 
                          (Number(formData.realisasi_bulan_6) || 0)
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="text-sm text-gray-600">TW 3 (Jul-Sep)</div>
                      <div className="text-lg font-semibold text-yellow-600">
                        {formatCurrency(
                          (Number(formData.realisasi_bulan_7) || 0) + 
                          (Number(formData.realisasi_bulan_8) || 0) + 
                          (Number(formData.realisasi_bulan_9) || 0)
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">TW 4 (Okt-Des)</div>
                      <div className="text-lg font-semibold text-purple-600">
                        {formatCurrency(
                          (Number(formData.realisasi_bulan_10) || 0) + 
                          (Number(formData.realisasi_bulan_11) || 0) + 
                          (Number(formData.realisasi_bulan_12) || 0)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {columns
                  .filter(col => !['kode_bidang', 'nama_bidang', 'kode_standar', 'nama_standar', 'nama_giat', 'nama_komponen', 'bidang_kegiatan', 'standar_nasional', 'sumber_dana', 'satuan', 'volume', 'harga_satuan', 'koefisien', 'tahun'].includes(col.name))
                  .filter(col => !col.name.startsWith('bulan_') && !col.name.startsWith('realisasi_') && !col.name.startsWith('tw_'))
                  .map(column => (
                    <div key={column.id}>
                      <label className="block text-sm font-medium mb-2">
                        {column.label}
                        {column.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(column)}
                      {errors[column.name] && (
                        <p className="text-red-500 text-sm mt-1">{errors[column.name]}</p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save size={16} />
                )}
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

