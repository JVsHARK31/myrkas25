import React, { useState, useEffect } from 'react'
import { KertasKerjaPerubahan, FilterOptions } from '../types/database'
import { ApiService } from '../lib/api'
import { DataTable } from './DataTable'
import { DataForm } from './DataForm'
import { ColumnManager } from './ColumnManager'
import toast from 'react-hot-toast'

interface BudgetManagementProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}

export const BudgetManagement: React.FC<BudgetManagementProps> = ({ filters, onFiltersChange }) => {
  const [data, setData] = useState<KertasKerjaPerubahan[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showColumnManager, setShowColumnManager] = useState(false)
  const [editingItem, setEditingItem] = useState<KertasKerjaPerubahan | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add')

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await ApiService.getKertasKerjaPerubahan(filters)
      setData(result)
    } catch (error) {
      toast.error('Gagal memuat data')
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormMode('add')
    setShowForm(true)
  }

  const handleEdit = (item: KertasKerjaPerubahan) => {
    setEditingItem(item)
    setFormMode('edit')
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      try {
        await ApiService.deleteKertasKerjaPerubahan(id)
        toast.success('Item berhasil dihapus')
        loadData()
      } catch (error) {
        toast.error('Gagal menghapus item')
      }
    }
  }

  const handleFormSave = () => {
    loadData()
  }

  const handleColumnsChange = () => {
    // Trigger re-render of DataTable when columns change
    loadData()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Manajemen R-KAS</h1>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Kelola data Rencana Kerja dan Anggaran Satuan Kerja</p>
            </div>
          </div>

          <DataTable
            data={data}
            loading={loading}
            onRefresh={loadData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            filters={filters}
            onFiltersChange={onFiltersChange}
            onColumnManagerOpen={() => setShowColumnManager(true)}
          />

          <DataForm
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            onSave={handleFormSave}
            item={editingItem}
            mode={formMode}
          />

          <ColumnManager
            isOpen={showColumnManager}
            onClose={() => setShowColumnManager(false)}
            onColumnsChange={handleColumnsChange}
          />
        </div>
      </div>
    </div>
  )
}

