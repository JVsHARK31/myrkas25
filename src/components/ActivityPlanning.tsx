import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import {
  Plus,
  Search,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
} from 'lucide-react';
import ActivityModal from './ActivityModal';

export default function ActivityPlanning() {
  const { activities, loading, deleteActivity } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const bidangOptions = Array.from(new Set(activities.map(activity => activity.bidang))).filter(Boolean);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || activity.status === selectedStatus;
    const matchesBidang = !selectedBidang || activity.bidang === selectedBidang;
    
    return matchesSearch && matchesStatus && matchesBidang;
  });

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteActivity(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'completed':
        return 'Selesai';
      default:
        return 'Draft';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Perencanaan Kegiatan</h1>
            <p className="text-gray-600 mt-1">Kelola kegiatan dan jadwal sekolah</p>
          </div>
          <button
            onClick={() => {
              setEditingActivity(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kegiatan
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Kegiatan</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{activities.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kegiatan Aktif</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {activities.filter(a => a.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Anggaran</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                Rp {activities.reduce((sum, a) => sum + a.budget_allocated, 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kegiatan..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedBidang}
            onChange={(e) => setSelectedBidang(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Bidang</option>
            {bidangOptions.map(bidang => (
              <option key={bidang} value={bidang}>{bidang}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="completed">Selesai</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada kegiatan</h3>
            <p className="text-gray-600 mb-4">Mulai dengan menambah kegiatan baru</p>
            <button
              onClick={() => {
                setEditingActivity(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kegiatan
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {activity.nama_kegiatan}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                        {getStatusIcon(activity.status)}
                        <span className="ml-1">{getStatusText(activity.status)}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{activity.deskripsi}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Bidang:</span>
                        <p className="font-medium">{activity.bidang}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Periode:</span>
                        <p className="font-medium">{activity.periode}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tanggal:</span>
                        <p className="font-medium">
                          {new Date(activity.tanggal_mulai).toLocaleDateString('id-ID')} -
                          {new Date(activity.tanggal_selesai).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Anggaran:</span>
                        <p className="font-medium">
                          Rp {activity.budget_allocated.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    {activity.budget_used > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500">Penggunaan Anggaran</span>
                          <span className="font-medium">
                            {((activity.budget_used / activity.budget_allocated) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (activity.budget_used / activity.budget_allocated) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Rp {activity.budget_used.toLocaleString('id-ID')} dari Rp {activity.budget_allocated.toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(activity)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(activity.id)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ActivityModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingActivity(null);
          }}
          editingActivity={editingActivity}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}