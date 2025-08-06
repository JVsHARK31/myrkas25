import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Minus } from 'lucide-react';
import { KertasKerjaPerubahan } from '../utils/csvParser';
import { toast } from 'sonner';

interface ComprehensiveRKASFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<KertasKerjaPerubahan>) => void;
  editingItem?: KertasKerjaPerubahan | null;
  mode: 'add' | 'edit' | 'view';
}

const ComprehensiveRKASForm: React.FC<ComprehensiveRKASFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<KertasKerjaPerubahan>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 6;

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        kodeBidang: '',
        namaBidang: '',
        kodeStandar: '',
        namaStandar: '',
        idGiat: '',
        kodeGiat: '',
        namaGiat: '',
        subtitle: '',
        kodeDana: '',
        namaDana: '',
        kodeRekening: '',
        namaRekening: '',
        idRincian: '',
        idKomponen: '',
        kodeKomponen: '',
        namaKomponen: '',
        satuan: '',
        merk: '',
        spek: '',
        pajak: 0,
        volume: 0,
        hargaSatuan: 0,
        koefisien: 1,
        vol1: 0,
        sat1: '',
        vol2: 0,
        sat2: '',
        vol3: 0,
        sat3: '',
        vol4: 0,
        sat4: '',
        nilaiRincianMurni: 0,
        nilaiRincian: 0,
        subRincian: '',
        keteranganRincian: '',
        keterangan: '',
        // Monthly budget fields
        bulan1: 0,
        bulan2: 0,
        bulan3: 0,
        tw1: 0,
        bulan4: 0,
        bulan5: 0,
        bulan6: 0,
        tw2: 0,
        bulan7: 0,
        bulan8: 0,
        bulan9: 0,
        tw3: 0,
        bulan10: 0,
        bulan11: 0,
        bulan12: 0,
        tw4: 0,
        totalAkb: 0,
        // Monthly realization fields
        realisasiBulan1: 0,
        realisasiBulan2: 0,
        realisasiBulan3: 0,
        realisasiTw1: 0,
        realisasiBulan4: 0,
        realisasiBulan5: 0,
        realisasiBulan6: 0,
        realisasiTw2: 0,
        realisasiBulan7: 0,
        realisasiBulan8: 0,
        realisasiBulan9: 0,
        realisasiTw3: 0,
        realisasiBulan10: 0,
        realisasiBulan11: 0,
        realisasiBulan12: 0,
        realisasiTw4: 0,
        totalRealisasi: 0
      });
    }
  }, [editingItem, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate derived values
    if (['volume', 'hargaSatuan', 'koefisien'].includes(field)) {
      const newData = { ...formData, [field]: value };
      const calculatedValue = (newData.volume || 0) * (newData.hargaSatuan || 0) * (newData.koefisien || 1);
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        nilaiRincian: calculatedValue,
        nilaiRincianMurni: calculatedValue
      }));
    }

    // Auto-calculate quarterly totals
    if (['bulan1', 'bulan2', 'bulan3'].includes(field)) {
      const newData = { ...formData, [field]: value };
      const tw1Total = (newData.bulan1 || 0) + (newData.bulan2 || 0) + (newData.bulan3 || 0);
      setFormData(prev => ({ ...prev, [field]: value, tw1: tw1Total }));
    }
    
    if (['bulan4', 'bulan5', 'bulan6'].includes(field)) {
      const newData = { ...formData, [field]: value };
      const tw2Total = (newData.bulan4 || 0) + (newData.bulan5 || 0) + (newData.bulan6 || 0);
      setFormData(prev => ({ ...prev, [field]: value, tw2: tw2Total }));
    }
    
    if (['bulan7', 'bulan8', 'bulan9'].includes(field)) {
      const newData = { ...formData, [field]: value };
      const tw3Total = (newData.bulan7 || 0) + (newData.bulan8 || 0) + (newData.bulan9 || 0);
      setFormData(prev => ({ ...prev, [field]: value, tw3: tw3Total }));
    }
    
    if (['bulan10', 'bulan11', 'bulan12'].includes(field)) {
      const newData = { ...formData, [field]: value };
      const tw4Total = (newData.bulan10 || 0) + (newData.bulan11 || 0) + (newData.bulan12 || 0);
      setFormData(prev => ({ ...prev, [field]: value, tw4: tw4Total }));
    }

    // Auto-calculate realization quarterly totals
    if (['realisasiBulan1', 'realisasiBulan2', 'realisasiBulan3'].includes(field)) {
      const newData = { ...formData, [field]: value };
      const tw1Total = (newData.realisasiBulan1 || 0) + (newData.realisasiBulan2 || 0) + (newData.realisasiBulan3 || 0);
      setFormData(prev => ({ ...prev, [field]: value, realisasiTw1: tw1Total }));
    }
    
    if (['realisasiBulan4', 'realisasiBulan5', 'realisasiBulan6'].includes(field)) {
      const newData = { ...formData, [field]: value };
      const tw2Total = (newData.realisasiBulan4 || 0) + (newData.realisasiBulan5 || 0) + (newData.realisasiBulan6 || 0);
      setFormData(prev => ({ ...prev, [field]: value, realisasiTw2: tw2Total }));
    }
    
    if (['realisasiBulan7', 'realisasiBulan8', 'realisasiBulan9'].includes(field)) {
      const newData = { ...formData, [field]: value };
      const tw3Total = (newData.realisasiBulan7 || 0) + (newData.realisasiBulan8 || 0) + (newData.realisasiBulan9 || 0);
      setFormData(prev => ({ ...prev, [field]: value, realisasiTw3: tw3Total }));
    }
    
    if (['realisasiBulan10', 'realisasiBulan11', 'realisasiBulan12'].includes(field)) {
      const newData = { ...formData, [field]: value };
      const tw4Total = (newData.realisasiBulan10 || 0) + (newData.realisasiBulan11 || 0) + (newData.realisasiBulan12 || 0);
      setFormData(prev => ({ ...prev, [field]: value, realisasiTw4: tw4Total }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.kodeBidang) newErrors.kodeBidang = 'Kode bidang wajib diisi';
        if (!formData.namaBidang) newErrors.namaBidang = 'Nama bidang wajib diisi';
        if (!formData.kodeStandar) newErrors.kodeStandar = 'Kode standar wajib diisi';
        if (!formData.namaStandar) newErrors.namaStandar = 'Nama standar wajib diisi';
        break;
      case 2: // Activity Information
        if (!formData.idGiat) newErrors.idGiat = 'ID kegiatan wajib diisi';
        if (!formData.kodeGiat) newErrors.kodeGiat = 'Kode kegiatan wajib diisi';
        if (!formData.namaGiat) newErrors.namaGiat = 'Nama kegiatan wajib diisi';
        break;
      case 3: // Fund and Account Information
        if (!formData.kodeDana) newErrors.kodeDana = 'Kode dana wajib diisi';
        if (!formData.namaDana) newErrors.namaDana = 'Nama dana wajib diisi';
        if (!formData.kodeRekening) newErrors.kodeRekening = 'Kode rekening wajib diisi';
        if (!formData.namaRekening) newErrors.namaRekening = 'Nama rekening wajib diisi';
        break;
      case 4: // Component and Specification
        if (!formData.kodeKomponen) newErrors.kodeKomponen = 'Kode komponen wajib diisi';
        if (!formData.namaKomponen) newErrors.namaKomponen = 'Nama komponen wajib diisi';
        if (!formData.satuan) newErrors.satuan = 'Satuan wajib diisi';
        if (!formData.volume || formData.volume <= 0) newErrors.volume = 'Volume harus lebih dari 0';
        if (!formData.hargaSatuan || formData.hargaSatuan <= 0) newErrors.hargaSatuan = 'Harga satuan harus lebih dari 0';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // Validate all steps
    let isValid = true;
    for (let i = 1; i <= totalSteps; i++) {
      if (!validateStep(i)) {
        isValid = false;
        setCurrentStep(i);
        break;
      }
    }

    if (isValid) {
      // Calculate totals
      const totalAkb = (formData.bulan1 || 0) + (formData.bulan2 || 0) + (formData.bulan3 || 0) +
                      (formData.bulan4 || 0) + (formData.bulan5 || 0) + (formData.bulan6 || 0) +
                      (formData.bulan7 || 0) + (formData.bulan8 || 0) + (formData.bulan9 || 0) +
                      (formData.bulan10 || 0) + (formData.bulan11 || 0) + (formData.bulan12 || 0);
      
      const totalRealisasi = (formData.realisasiBulan1 || 0) + (formData.realisasiBulan2 || 0) + (formData.realisasiBulan3 || 0) +
                            (formData.realisasiBulan4 || 0) + (formData.realisasiBulan5 || 0) + (formData.realisasiBulan6 || 0) +
                            (formData.realisasiBulan7 || 0) + (formData.realisasiBulan8 || 0) + (formData.realisasiBulan9 || 0) +
                            (formData.realisasiBulan10 || 0) + (formData.realisasiBulan11 || 0) + (formData.realisasiBulan12 || 0);

      onSave({
        ...formData,
        totalAkb,
        totalRealisasi
      });
    }
  };

  const renderFormField = (label: string, field: string, type: 'text' | 'number' | 'textarea' = 'text', required = false) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={formData[field as keyof KertasKerjaPerubahan] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={mode === 'view'}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
          } ${mode === 'view' ? 'bg-gray-50' : ''}`}
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={formData[field as keyof KertasKerjaPerubahan] || ''}
          onChange={(e) => handleInputChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          disabled={mode === 'view'}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors[field] ? 'border-red-500' : 'border-gray-300'
          } ${mode === 'view' ? 'bg-gray-50' : ''}`}
        />
      )}
      {errors[field] && (
        <p className="text-sm text-red-500">{errors[field]}</p>
      )}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField('Kode Bidang', 'kodeBidang', 'text', true)}
              {renderFormField('Nama Bidang', 'namaBidang', 'text', true)}
              {renderFormField('Kode Standar', 'kodeStandar', 'text', true)}
              {renderFormField('Nama Standar', 'namaStandar', 'text', true)}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kegiatan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField('ID Kegiatan', 'idGiat', 'text', true)}
              {renderFormField('Kode Kegiatan', 'kodeGiat', 'text', true)}
              {renderFormField('Nama Kegiatan', 'namaGiat', 'text', true)}
              {renderFormField('Subtitle', 'subtitle', 'text')}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dana & Rekening</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField('Kode Dana', 'kodeDana', 'text', true)}
              {renderFormField('Nama Dana', 'namaDana', 'text', true)}
              {renderFormField('Kode Rekening', 'kodeRekening', 'text', true)}
              {renderFormField('Nama Rekening', 'namaRekening', 'text', true)}
              {renderFormField('ID Rincian', 'idRincian', 'text')}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Komponen & Spesifikasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField('ID Komponen', 'idKomponen', 'text')}
              {renderFormField('Kode Komponen', 'kodeKomponen', 'text', true)}
              {renderFormField('Nama Komponen', 'namaKomponen', 'text', true)}
              {renderFormField('Satuan', 'satuan', 'text', true)}
              {renderFormField('Merk', 'merk', 'text')}
              {renderFormField('Spesifikasi', 'spek', 'textarea')}
              {renderFormField('Pajak (%)', 'pajak', 'number')}
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Volume & Harga</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderFormField('Volume', 'volume', 'number', true)}
                {renderFormField('Harga Satuan', 'hargaSatuan', 'number', true)}
                {renderFormField('Koefisien', 'koefisien', 'number')}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {renderFormField('Vol 1', 'vol1', 'number')}
                {renderFormField('Sat 1', 'sat1', 'text')}
                {renderFormField('Vol 2', 'vol2', 'number')}
                {renderFormField('Sat 2', 'sat2', 'text')}
                {renderFormField('Vol 3', 'vol3', 'number')}
                {renderFormField('Sat 3', 'sat3', 'text')}
                {renderFormField('Vol 4', 'vol4', 'number')}
                {renderFormField('Sat 4', 'sat4', 'text')}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {renderFormField('Nilai Rincian Murni', 'nilaiRincianMurni', 'number')}
                {renderFormField('Nilai Rincian', 'nilaiRincian', 'number')}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Anggaran Bulanan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Triwulan 1</h4>
                {renderFormField('Januari', 'bulan1', 'number')}
                {renderFormField('Februari', 'bulan2', 'number')}
                {renderFormField('Maret', 'bulan3', 'number')}
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">Total TW1: {(formData.tw1 || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Triwulan 2</h4>
                {renderFormField('April', 'bulan4', 'number')}
                {renderFormField('Mei', 'bulan5', 'number')}
                {renderFormField('Juni', 'bulan6', 'number')}
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">Total TW2: {(formData.tw2 || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Triwulan 3</h4>
                {renderFormField('Juli', 'bulan7', 'number')}
                {renderFormField('Agustus', 'bulan8', 'number')}
                {renderFormField('September', 'bulan9', 'number')}
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">Total TW3: {(formData.tw3 || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Triwulan 4</h4>
                {renderFormField('Oktober', 'bulan10', 'number')}
                {renderFormField('November', 'bulan11', 'number')}
                {renderFormField('Desember', 'bulan12', 'number')}
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">Total TW4: {(formData.tw4 || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Realisasi Bulanan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Triwulan 1</h4>
                {renderFormField('Januari', 'realisasiBulan1', 'number')}
                {renderFormField('Februari', 'realisasiBulan2', 'number')}
                {renderFormField('Maret', 'realisasiBulan3', 'number')}
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">Total TW1: {(formData.realisasiTw1 || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Triwulan 2</h4>
                {renderFormField('April', 'realisasiBulan4', 'number')}
                {renderFormField('Mei', 'realisasiBulan5', 'number')}
                {renderFormField('Juni', 'realisasiBulan6', 'number')}
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">Total TW2: {(formData.realisasiTw2 || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Triwulan 3</h4>
                {renderFormField('Juli', 'realisasiBulan7', 'number')}
                {renderFormField('Agustus', 'realisasiBulan8', 'number')}
                {renderFormField('September', 'realisasiBulan9', 'number')}
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">Total TW3: {(formData.realisasiTw3 || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Triwulan 4</h4>
                {renderFormField('Oktober', 'realisasiBulan10', 'number')}
                {renderFormField('November', 'realisasiBulan11', 'number')}
                {renderFormField('Desember', 'realisasiBulan12', 'number')}
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">Total TW4: {(formData.realisasiTw4 || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderFormField('Sub Rincian', 'subRincian', 'text')}
                {renderFormField('Keterangan Rincian', 'keteranganRincian', 'textarea')}
                {renderFormField('Keterangan', 'keterangan', 'textarea')}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'add' ? 'Tambah Data R-KAS' : mode === 'edit' ? 'Edit Data R-KAS' : 'Detail Data R-KAS'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Langkah {currentStep} dari {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? 'bg-blue-600 text-white'
                      : step < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            
            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                disabled={mode === 'view'}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Simpan</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Selanjutnya
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveRKASForm;