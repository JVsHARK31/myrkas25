import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { X, Save } from 'lucide-react';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingActivity?: any;
}

export default function ActivityModal({ isOpen, onClose, editingActivity }: ActivityModalProps) {
  const { addActivity, updateActivity } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_kegiatan: '',
    deskripsi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    budget_allocated: 0,
    budget_used: 0,
    status: 'draft',
    bidang: '',
    periode: '',
  });

  useEffect(() => {
    if (editingActivity) {
      setFormData({
        nama_kegiatan: editingActivity.nama_kegiatan || '',
        deskripsi: editingActivity.deskripsi || '',
        tanggal_mulai: editingActivity.tanggal_mulai ? editingActivity.tanggal_mulai.split('T')[0] : '',
        tanggal_selesai: editingActivity.tanggal_selesai ? editingActivity.tanggal_selesai.split('T')[0] : '',
        budget_allocated: editingActivity.budget_allocated || 0,
        budget_used: editingActivity.budget_used || 0,
        status: editingActivity.status || 'draft',
        bidang: editingActivity.bidang || '',
        periode: editingActivity.periode || '',
      });
    } else {
      setFormData({
        nama_kegiatan: '',
        deskripsi: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        budget_allocated: 0,
        budget_used: 0,
        status: 'draft',
        bidang: '',
        periode: '',
      });
    }
  }, [editingActivity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingActivity) {
        await updateActivity(editingActivity.id, formData);
      } else {
        await addActivity(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const bidangOptions = [
    'Kurikulum',
    'Kesiswaan',
    'Sarana & Prasarana',
    'Ketenagaan',
    'Keuangan',
    'Humas',
    'Perpustakaan',
    'Laboratorium',
    'Administrasi',
    'Lainnya'
  ];

  const periodeOptions = [
    'Semester 1',
    'Semester 2',
    'Tahun Ajaran',
    'Triwulan 1',
    'Triwulan 2',
    'Triwulan 3',
    'Triwulan 4',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingActivity ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kegiatan *
              </label>
              <input
                type="text"
                value={formData.nama_kegiatan}
                onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Deskripsi kegiatan..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bidang *
                </label>
                <select
                  value={formData.bidang}
                  onChange={(e) => setFormData({ ...formData, bidang: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih Bidang</option>
                  {bidangOptions.map(bidang => (
                    <option key={bidang} value={bidang}>{bidang}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode *
                </label>
                <select
                  value={formData.periode}
                  onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih Periode</option>
                  {periodeOptions.map(periode => (
                    <option key={periode} value={periode}>{periode}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Mulai *
                </label>
                <input
                  type="date"
                  value={formData.tanggal_mulai}
                  onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Selesai *
                </label>
                <input
                  type="date"
                  value={formData.tanggal_selesai}
                  onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anggaran Dialokasikan *
                </label>
                <input
                  type="number"
                  value={formData.budget_allocated}
                  onChange={(e) => setFormData({ ...formData, budget_allocated: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anggaran Terpakai
                </label>
                <input
                  type="number"
                  value={formData.budget_used}
                  onChange={(e) => setFormData({ ...formData, budget_used: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="1000"
                  max={formData.budget_allocated}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="active">Aktif</option>
                <option value="completed">Selesai</option>
              </select>
            </div>

            {/* Budget Summary */}
            {formData.budget_allocated > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Ringkasan Anggaran</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Dialokasikan:</span>
                    <p className="font-medium text-blue-900">
                      Rp {formData.budget_allocated.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-600">Tersisa:</span>
                    <p className="font-medium text-blue-900">
                      Rp {(formData.budget_allocated - formData.budget_used).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                {formData.budget_used > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-blue-600">Penggunaan</span>
                      <span className="font-medium text-blue-900">
                        {((formData.budget_used / formData.budget_allocated) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (formData.budget_used / formData.budget_allocated) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}