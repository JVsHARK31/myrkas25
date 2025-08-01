import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, Settings, Eye, EyeOff, GripVertical } from 'lucide-react'
import { ColumnDefinition, ColumnGroup } from '../types/column'
import { ColumnService } from '../lib/columnService'
import toast from 'react-hot-toast'

interface ColumnManagerProps {
  isOpen: boolean
  onClose: () => void
  onColumnsChange: () => void
}

export const ColumnManager: React.FC<ColumnManagerProps> = ({ isOpen, onClose, onColumnsChange }) => {
  const [columns, setColumns] = useState<ColumnDefinition[]>([])
  const [groups, setGroups] = useState<ColumnGroup[]>([])
  const [editingColumn, setEditingColumn] = useState<ColumnDefinition | null>(null)
  const [editingGroup, setEditingGroup] = useState<ColumnGroup | null>(null)
  const [showAddColumn, setShowAddColumn] = useState(false)
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = () => {
    setColumns(ColumnService.getColumns())
    setGroups(ColumnService.getColumnGroups())
  }

  const handleSaveColumn = (column: ColumnDefinition) => {
    try {
      if (editingColumn) {
        ColumnService.updateColumn(column.id, column)
        toast.success('Kolom berhasil diperbarui')
      } else {
        ColumnService.addColumn(column)
        toast.success('Kolom berhasil ditambahkan')
      }
      loadData()
      setEditingColumn(null)
      setShowAddColumn(false)
      onColumnsChange()
    } catch (error) {
      toast.error('Gagal menyimpan kolom')
    }
  }

  const handleDeleteColumn = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kolom ini?')) {
      try {
        ColumnService.deleteColumn(id)
        toast.success('Kolom berhasil dihapus')
        loadData()
        onColumnsChange()
      } catch (error) {
        toast.error('Gagal menghapus kolom')
      }
    }
  }

  const handleToggleVisibility = (id: string, visible: boolean) => {
    try {
      ColumnService.updateColumn(id, { visible })
      loadData()
      onColumnsChange()
    } catch (error) {
      toast.error('Gagal mengubah visibilitas kolom')
    }
  }

  const handleSaveGroup = (group: ColumnGroup) => {
    try {
      if (editingGroup) {
        ColumnService.updateColumnGroup(group.id, group)
        toast.success('Grup berhasil diperbarui')
      } else {
        ColumnService.addColumnGroup(group)
        toast.success('Grup berhasil ditambahkan')
      }
      loadData()
      setEditingGroup(null)
      setShowAddGroup(false)
    } catch (error) {
      toast.error('Gagal menyimpan grup')
    }
  }

  const handleDeleteGroup = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus grup ini?')) {
      try {
        ColumnService.deleteColumnGroup(id)
        toast.success('Grup berhasil dihapus')
        loadData()
      } catch (error) {
        toast.error('Gagal menghapus grup')
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    if (draggedColumn && draggedColumn !== targetColumnId) {
      const newOrder = [...columns]
      const draggedIndex = newOrder.findIndex(col => col.id === draggedColumn)
      const targetIndex = newOrder.findIndex(col => col.id === targetColumnId)
      
      const [draggedItem] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedItem)
      
      const reorderedIds = newOrder.map(col => col.id)
      ColumnService.reorderColumns(reorderedIds)
      loadData()
      onColumnsChange()
    }
    setDraggedColumn(null)
  }

  const resetToDefaults = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan ke pengaturan default?')) {
      ColumnService.resetToDefaults()
      loadData()
      onColumnsChange()
      toast.success('Pengaturan berhasil direset')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-5/6 flex flex-col transform transition-all duration-300 ease-out border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Manajemen Kolom</h2>
          <div className="flex gap-2">
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reset Default
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Column Groups */}
          <div className="w-1/3 border-r p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Grup Kolom</h3>
              <button
                onClick={() => setShowAddGroup(true)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Plus size={16} />
              </button>
            </div>

            {showAddGroup && (
              <GroupForm
                group={null}
                onSave={handleSaveGroup}
                onCancel={() => setShowAddGroup(false)}
              />
            )}

            {editingGroup && (
              <GroupForm
                group={editingGroup}
                onSave={handleSaveGroup}
                onCancel={() => setEditingGroup(null)}
              />
            )}

            <div className="space-y-2">
              {groups.map(group => (
                <div key={group.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="font-medium">{group.label}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingGroup(group)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columns */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Kolom</h3>
              <button
                onClick={() => setShowAddColumn(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                <Plus size={16} className="inline mr-1" />
                Tambah Kolom
              </button>
            </div>

            {showAddColumn && (
              <ColumnForm
                column={null}
                groups={groups}
                onSave={handleSaveColumn}
                onCancel={() => setShowAddColumn(false)}
              />
            )}

            {editingColumn && (
              <ColumnForm
                column={editingColumn}
                groups={groups}
                onSave={handleSaveColumn}
                onCancel={() => setEditingColumn(null)}
              />
            )}

            <div className="space-y-2">
              {columns.map(column => (
                <div
                  key={column.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className={`p-3 border rounded-lg cursor-move ${
                    draggedColumn === column.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-gray-400" />
                      <div>
                        <div className="font-medium">{column.label}</div>
                        <div className="text-sm text-gray-500">
                          {column.name} • {column.type}
                          {column.group && (
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                              {groups.find(g => g.id === column.group)?.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleVisibility(column.id, !column.visible)}
                        className={`p-1 rounded ${
                          column.visible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {column.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => setEditingColumn(column)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteColumn(column.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ColumnFormProps {
  column: ColumnDefinition | null
  groups: ColumnGroup[]
  onSave: (column: ColumnDefinition) => void
  onCancel: () => void
}

const ColumnForm: React.FC<ColumnFormProps> = ({ column, groups, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<ColumnDefinition>>({
    name: '',
    label: '',
    type: 'text',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    order: 999,
    ...column
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.label) {
      toast.error('Nama dan label kolom harus diisi')
      return
    }

    onSave({
      ...formData,
      id: column?.id || '',
      created_at: column?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as ColumnDefinition)
  }

  return (
    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Kolom</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="nama_kolom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <input
              type="text"
              value={formData.label || ''}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Label Kolom"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipe</label>
            <select
              value={formData.type || 'text'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="select">Select</option>
              <option value="textarea">Textarea</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Grup</label>
            <select
              value={formData.group || ''}
              onChange={(e) => setFormData({ ...formData, group: e.target.value || undefined })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Tanpa Grup</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>{group.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.required || false}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              className="mr-2"
            />
            Wajib diisi
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.visible || false}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              className="mr-2"
            />
            Terlihat
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.editable || false}
              onChange={(e) => setFormData({ ...formData, editable: e.target.checked })}
              className="mr-2"
            />
            Dapat diedit
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.sortable || false}
              onChange={(e) => setFormData({ ...formData, sortable: e.target.checked })}
              className="mr-2"
            />
            Dapat diurutkan
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.filterable || false}
              onChange={(e) => setFormData({ ...formData, filterable: e.target.checked })}
              className="mr-2"
            />
            Dapat difilter
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  )
}

interface GroupFormProps {
  group: ColumnGroup | null
  onSave: (group: ColumnGroup) => void
  onCancel: () => void
}

const GroupForm: React.FC<GroupFormProps> = ({ group, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<ColumnGroup>>({
    name: '',
    label: '',
    order: 999,
    collapsed: false,
    color: '#3B82F6',
    ...group
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.label) {
      toast.error('Nama dan label grup harus diisi')
      return
    }

    onSave({
      ...formData,
      id: group?.id || ''
    } as ColumnGroup)
  }

  return (
    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Grup</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="nama_grup"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            value={formData.label || ''}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Label Grup"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Warna</label>
          <input
            type="color"
            value={formData.color || '#3B82F6'}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full px-3 py-2 border rounded-md h-10"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  )
}

