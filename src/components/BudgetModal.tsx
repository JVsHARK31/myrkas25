import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { X, Save } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: any;
}

export default function BudgetModal({ isOpen, onClose, editingItem }: BudgetModalProps) {
  const { addBudgetItem, updateBudgetItem } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kode_bidang: '',
    nama_bidang: '',
    kode_standar: '',
    nama_standar: '',
    kode_giat: '',
    nama_giat: '',
    kode_dana: '',
    nama_dana: '',
    kode_rekening: '',
    nama_rekening: '',
    nama_komponen: '',
    satuan: '',
    volume: 0,
    harga_satuan: 0,
    nilai_rincian: 0,
    bulan_1: 0,
    bulan_2: 0,
    bulan_3: 0,
    bulan_4: 0,
    bulan_5: 0,
    bulan_6: 0,
    bulan_7: 0,
    bulan_8: 0,
    bulan_9: 0,
    bulan_10: 0,
    bulan_11: 0,
    bulan_12: 0,
    total_akb: 0,
    total_realisasi: 0,
    status: 'active',
    period_year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        kode_bidang: editingItem.kode_bidang || '',
        nama_bidang: editingItem.nama_bidang || '',
        kode_standar: editingItem.kode_standar || '',
        nama_standar: editingItem.nama_standar || '',
        kode_giat: editingItem.kode_giat || '',
        nama_giat: editingItem.nama_giat || '',
        kode_dana: editingItem.kode_dana || '',
        nama_dana: editingItem.nama_dana || '',
        kode_rekening: editingItem.kode_rekening || '',
        nama_rekening: editingItem.nama_rekening || '',
        nama_komponen: editingItem.nama_komponen || '',
        satuan: editingItem.satuan || '',
        volume: editingItem.volume || 0,
        harga_satuan: editingItem.harga_satuan || 0,
        nilai_rincian: editingItem.nilai_rincian || 0,
        bulan_1: editingItem.bulan_1 || 0,
        bulan_2: editingItem.bulan_2 || 0,
        bulan_3: editingItem.bulan_3 || 0,
        bulan_4: editingItem.bulan_4 || 0,
        bulan_5: editingItem.bulan_5 || 0,
        bulan_6: editingItem.bulan_6 || 0,
        bulan_7: editingItem.bulan_7 || 0,
        bulan_8: editingItem.bulan_8 || 0,
        bulan_9: editingItem.bulan_9 || 0,
        bulan_10: editingItem.bulan_10 || 0,
        bulan_11: editingItem.bulan_11 || 0,
        bulan_12: editingItem.bulan_12 || 0,
        total_akb: editingItem.total_akb || 0,
        total_realisasi: editingItem.total_realisasi || 0,
        status: editingItem.status || 'active',
        period_year: editingItem.period_year || new Date().getFullYear(),
      });
    }
  }, [editingItem]);

  useEffect(() => {
    // Auto-calculate totals
    const monthlyTotal = Object.keys(formData)
      .filter(key => key.startsWith('bulan_'))
      .reduce((sum, key) => sum + (formData[key] || 0), 0);
    
    const calculatedTotal = formData.volume * formData.harga_satuan;
    
    setFormData(prev => ({
      ...prev,
      nilai_rincian: calculatedTotal,
      total_akb: monthlyTotal > 0 ? monthlyTotal : calculatedTotal,
    }));
  }, [formData.volume, formData.harga_satuan, formData.bulan_1, formData.bulan_2, formData.bulan_3, formData.bulan_4, formData.bulan_5, formData.bulan_6, formData.bulan_7, formData.bulan_8, formData.bulan_9, formData.bulan_10, formData.bulan_11, formData.bulan_12]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        await updateBudgetItem(editingItem.id, formData);
      } else {
        await addBudgetItem(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving budget item:', error);
      alert('Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-out">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingItem ? 'Edit Item Anggaran' : 'Tambah Item Anggaran'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Dasar</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Bidang
              </label>
              <input
                type="text"
                value={formData.kode_bidang}
                onChange={(e) => setFormData({ ...formData, kode_bidang: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Bidang
              </label>
              <input
                type="text"
                value={formData.nama_bidang}
                onChange={(e) => setFormData({ ...formData, nama_bidang: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Standar
              </label>
              <input
                type="text"
                value={formData.kode_standar}
                onChange={(e) => setFormData({ ...formData, kode_standar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Standar
              </label>
              <input
                type="text"
                value={formData.nama_standar}
                onChange={(e) => setFormData({ ...formData, nama_standar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Kegiatan
              </label>
              <input
                type="text"
                value={formData.kode_giat}
                onChange={(e) => setFormData({ ...formData, kode_giat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kegiatan
              </label>
              <input
                type="text"
                value={formData.nama_giat}
                onChange={(e) => setFormData({ ...formData, nama_giat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Komponen
              </label>
              <input
                type="text"
                value={formData.nama_komponen}
                onChange={(e) => setFormData({ ...formData, nama_komponen: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Satuan
              </label>
              <input
                type="text"
                value={formData.satuan}
                onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume
              </label>
              <input
                type="number"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Satuan
              </label>
              <input
                type="number"
                value={formData.harga_satuan}
                onChange={(e) => setFormData({ ...formData, harga_satuan: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
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
                <option value="active">Aktif</option>
                <option value="completed">Selesai</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun Periode
              </label>
              <input
                type="number"
                value={formData.period_year}
                onChange={(e) => setFormData({ ...formData, period_year: parseInt(e.target.value) || new Date().getFullYear() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="2020"
                max="2030"
              />
            </div>

            {/* Monthly Budget Allocation */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Alokasi Anggaran Bulanan</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <div key={month}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {monthNames[month - 1]}
                    </label>
                    <input
                      type="number"
                      value={formData[`bulan_${month}` as keyof typeof formData] || 0}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        [`bulan_${month}`]: parseFloat(e.target.value) || 0 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Ringkasan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Nilai Rincian</p>
                  <p className="text-lg font-bold text-blue-900">
                    Rp {formData.nilai_rincian.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Total AKB</p>
                  <p className="text-lg font-bold text-green-900">
                    Rp {formData.total_akb.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Total Realisasi</p>
                  <p className="text-lg font-bold text-orange-900">
                    Rp {formData.total_realisasi.toLocaleString('id-ID')}
                  </p>
                  <input
                    type="number"
                    value={formData.total_realisasi}
                    onChange={(e) => setFormData({ ...formData, total_realisasi: parseFloat(e.target.value) || 0 })}
                    className="w-full mt-2 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    placeholder="Masukkan realisasi..."
                  />
                </div>
              </div>
            </div>
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