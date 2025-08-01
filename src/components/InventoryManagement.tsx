import React, { useState, useEffect } from 'react'
import { 
  Package, Plus, Search, Filter, Edit, Trash2, 
  Eye, Download, Upload, AlertTriangle, CheckCircle,
  Clock, MapPin, User, Calendar, BarChart3
} from 'lucide-react'
import toast from 'react-hot-toast'

interface InventoryItem {
  id: string
  name: string
  category: string
  code: string
  quantity: number
  unit: string
  condition: 'baik' | 'rusak' | 'perlu_perbaikan'
  location: string
  purchase_date: string
  purchase_price: number
  supplier: string
  responsible_person: string
  last_maintenance: string
  next_maintenance: string
  description: string
  image_url?: string
  created_at: string
  updated_at: string
}

const mockInventoryData: InventoryItem[] = [
  {
    id: '1',
    name: 'Laptop Dell Inspiron 15',
    category: 'Elektronik',
    code: 'ELK-001',
    quantity: 25,
    unit: 'unit',
    condition: 'baik',
    location: 'Lab Komputer 1',
    purchase_date: '2023-01-15',
    purchase_price: 8500000,
    supplier: 'PT. Teknologi Maju',
    responsible_person: 'Budi Santoso',
    last_maintenance: '2024-01-15',
    next_maintenance: '2024-07-15',
    description: 'Laptop untuk kegiatan pembelajaran',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Meja Belajar Kayu',
    category: 'Furniture',
    code: 'FUR-001',
    quantity: 150,
    unit: 'unit',
    condition: 'baik',
    location: 'Kelas 1A-1F',
    purchase_date: '2022-06-10',
    purchase_price: 750000,
    supplier: 'CV. Furniture Jaya',
    responsible_person: 'Siti Aminah',
    last_maintenance: '2023-12-01',
    next_maintenance: '2024-06-01',
    description: 'Meja belajar untuk siswa',
    created_at: '2022-06-10T10:00:00Z',
    updated_at: '2023-12-01T10:00:00Z'
  },
  {
    id: '3',
    name: 'Proyektor Epson EB-X41',
    category: 'Elektronik',
    code: 'ELK-002',
    quantity: 8,
    unit: 'unit',
    condition: 'perlu_perbaikan',
    location: 'Ruang Audio Visual',
    purchase_date: '2021-03-20',
    purchase_price: 4500000,
    supplier: 'PT. Visual Tech',
    responsible_person: 'Ahmad Rizki',
    last_maintenance: '2023-10-15',
    next_maintenance: '2024-04-15',
    description: 'Proyektor untuk presentasi',
    created_at: '2021-03-20T10:00:00Z',
    updated_at: '2023-10-15T10:00:00Z'
  }
]

export const InventoryManagement: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryData)
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(mockInventoryData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCondition, setSelectedCondition] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [formData, setFormData] = useState<Partial<InventoryItem>>({})

  const categories = ['Elektronik', 'Furniture', 'Alat Tulis', 'Olahraga', 'Laboratorium']
  const conditions = ['baik', 'rusak', 'perlu_perbaikan']

  useEffect(() => {
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedCondition) {
      filtered = filtered.filter(item => item.condition === selectedCondition)
    }

    setFilteredItems(filtered)
  }, [items, searchTerm, selectedCategory, selectedCondition])

  const handleAddItem = () => {
    if (!formData.name || !formData.category || !formData.code) {
      toast.error('Mohon lengkapi data yang diperlukan')
      return
    }

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: formData.name || '',
      category: formData.category || '',
      code: formData.code || '',
      quantity: formData.quantity || 0,
      unit: formData.unit || 'unit',
      condition: formData.condition || 'baik',
      location: formData.location || '',
      purchase_date: formData.purchase_date || '',
      purchase_price: formData.purchase_price || 0,
      supplier: formData.supplier || '',
      responsible_person: formData.responsible_person || '',
      last_maintenance: formData.last_maintenance || '',
      next_maintenance: formData.next_maintenance || '',
      description: formData.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setItems([...items, newItem])
    setFormData({})
    setShowAddModal(false)
    toast.success('Item inventaris berhasil ditambahkan')
  }

  const handleEditItem = () => {
    if (!selectedItem || !formData.name || !formData.category || !formData.code) {
      toast.error('Mohon lengkapi data yang diperlukan')
      return
    }

    const updatedItems = items.map(item =>
      item.id === selectedItem.id
        ? { ...item, ...formData, updated_at: new Date().toISOString() }
        : item
    )

    setItems(updatedItems)
    setFormData({})
    setSelectedItem(null)
    setShowEditModal(false)
    toast.success('Item inventaris berhasil diperbarui')
  }

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      setItems(items.filter(item => item.id !== id))
      toast.success('Item inventaris berhasil dihapus')
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'baik': return 'text-green-600 bg-green-100'
      case 'rusak': return 'text-red-600 bg-red-100'
      case 'perlu_perbaikan': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'baik': return <CheckCircle size={16} />
      case 'rusak': return <AlertTriangle size={16} />
      case 'perlu_perbaikan': return <Clock size={16} />
      default: return <Clock size={16} />
    }
  }

  const exportToCSV = () => {
    const headers = ['Kode', 'Nama', 'Kategori', 'Jumlah', 'Satuan', 'Kondisi', 'Lokasi', 'Harga Beli', 'Penanggung Jawab']
    const csvData = filteredItems.map(item => [
      item.code,
      item.name,
      item.category,
      item.quantity,
      item.unit,
      item.condition,
      item.location,
      item.purchase_price,
      item.responsible_person
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `inventaris_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success('Data inventaris berhasil diekspor')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Inventaris</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola inventaris dan aset sekolah</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} className="mr-2" />
            Ekspor CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Tambah Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Semua Kategori</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Semua Kondisi</option>
            {conditions.map(condition => (
              <option key={condition} value={condition}>
                {condition.charAt(0).toUpperCase() + condition.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Package size={16} className="mr-2" />
            Total: {filteredItems.length} item
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kondisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Penanggung Jawab
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.code}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition)}`}>
                      {getConditionIcon(item.condition)}
                      <span className="ml-1">
                        {item.condition.charAt(0).toUpperCase() + item.condition.slice(1).replace('_', ' ')}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 text-gray-400" />
                      {item.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <User size={14} className="mr-1 text-gray-400" />
                      {item.responsible_person}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setShowDetailModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setFormData(item)
                          setShowEditModal(true)
                        }}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {showAddModal ? 'Tambah Item Inventaris' : 'Edit Item Inventaris'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Item *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kode Item *
                </label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kategori *
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jumlah
                </label>
                <input
                  type="number"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Satuan
                </label>
                <input
                  type="text"
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kondisi
                </label>
                <select
                  value={formData.condition || ''}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih Kondisi</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>
                      {condition.charAt(0).toUpperCase() + condition.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Harga Beli
                </label>
                <input
                  type="number"
                  value={formData.purchase_price || ''}
                  onChange={(e) => setFormData({ ...formData, purchase_price: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  value={formData.supplier || ''}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={formData.responsible_person || ''}
                  onChange={(e) => setFormData({ ...formData, responsible_person: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setShowEditModal(false)
                  setFormData({})
                  setSelectedItem(null)
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Batal
              </button>
              <button
                onClick={showAddModal ? handleAddItem : handleEditItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showAddModal ? 'Tambah' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Detail Item Inventaris
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Item
                </label>
                <p className="text-gray-900 dark:text-white">{selectedItem.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kode Item
                </label>
                <p className="text-gray-900 dark:text-white">{selectedItem.code}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kategori
                </label>
                <p className="text-gray-900 dark:text-white">{selectedItem.category}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jumlah
                </label>
                <p className="text-gray-900 dark:text-white">{selectedItem.quantity} {selectedItem.unit}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kondisi
                </label>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(selectedItem.condition)}`}>
                  {getConditionIcon(selectedItem.condition)}
                  <span className="ml-1">
                    {selectedItem.condition.charAt(0).toUpperCase() + selectedItem.condition.slice(1).replace('_', ' ')}
                  </span>
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lokasi
                </label>
                <p className="text-gray-900 dark:text-white">{selectedItem.location}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Harga Beli
                </label>
                <p className="text-gray-900 dark:text-white">
                  Rp {selectedItem.purchase_price.toLocaleString('id-ID')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supplier
                </label>
                <p className="text-gray-900 dark:text-white">{selectedItem.supplier}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Penanggung Jawab
                </label>
                <p className="text-gray-900 dark:text-white">{selectedItem.responsible_person}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal Pembelian
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedItem.purchase_date).toLocaleDateString('id-ID')}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deskripsi
                </label>
                <p className="text-gray-900 dark:text-white">{selectedItem.description}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedItem(null)
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}