import React, { useState, useEffect, useCallback } from 'react';
import { X, Save, Calculator, AlertCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { KertasKerjaPerubahan } from '../utils/csvParser';
import {
  validateField,
  validateForm,
  autoCalculateFields,
  formatCurrency,
  formatNumber,
  parseFormattedNumber,
  ValidationErrors,
  getFieldLabel
} from '../utils/validation';
import {
  BIDANG_KEGIATAN_OPTIONS,
  STANDAR_NASIONAL_OPTIONS,
  SUMBER_DANA_OPTIONS
} from '../utils/constants';

interface KertasKerjaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: KertasKerjaPerubahan) => void;
  initialData?: KertasKerjaPerubahan;
  mode: 'add' | 'edit';
}

interface FormSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  fields: string[];
}

const formSections: FormSection[] = [
  {
    id: 'bidang',
    title: 'Informasi Bidang',
    icon: <ChevronRight className="w-4 h-4" />,
    fields: ['kodeBidang', 'namaBidang', 'kodeStandar', 'namaStandar', 'bidangKegiatan', 'standarNasional', 'sumberDana']
  },
  {
    id: 'kegiatan',
    title: 'Informasi Kegiatan',
    icon: <ChevronRight className="w-4 h-4" />,
    fields: ['idGiat', 'kodeGiat', 'namaGiat', 'subtitle']
  },
  {
    id: 'dana',
    title: 'Dana & Rekening',
    icon: <ChevronRight className="w-4 h-4" />,
    fields: ['kodeDana', 'namaDana', 'kodeRekening', 'namaRekening']
  },
  {
    id: 'komponen',
    title: 'Komponen & Spesifikasi',
    icon: <ChevronRight className="w-4 h-4" />,
    fields: ['idRincian', 'idKomponen', 'kodeKomponen', 'namaKomponen', 'satuan', 'merk', 'spek', 'pajak']
  },
  {
    id: 'volume',
    title: 'Volume & Harga',
    icon: <ChevronRight className="w-4 h-4" />,
    fields: ['volume', 'hargaSatuan', 'koefisien', 'vol1', 'sat1', 'vol2', 'sat2', 'vol3', 'sat3', 'vol4', 'sat4']
  },
  {
    id: 'nilai',
    title: 'Nilai Rincian',
    icon: <ChevronRight className="w-4 h-4" />,
    fields: ['nilaiRincianMurni', 'nilaiRincian', 'subRincian', 'keteranganRincian', 'keterangan']
  },
  {
    id: 'anggaran',
    title: 'Anggaran Bulanan',
    icon: <ChevronRight className="w-4 h-4" />,
    fields: [
      'anggaranBulan1', 'anggaranBulan2', 'anggaranBulan3', 'anggaranTw1',
      'anggaranBulan4', 'anggaranBulan5', 'anggaranBulan6', 'anggaranTw2',
      'anggaranBulan7', 'anggaranBulan8', 'anggaranBulan9', 'anggaranTw3',
      'anggaranBulan10', 'anggaranBulan11', 'anggaranBulan12', 'anggaranTw4',
      'totalAkb'
    ]
  },
  {
    id: 'realisasi',
    title: 'Realisasi Bulanan',
    icon: <ChevronRight className="w-4 h-4" />,
    fields: [
      'realisasiBulan1', 'realisasiBulan2', 'realisasiBulan3', 'realisasiTw1',
      'realisasiBulan4', 'realisasiBulan5', 'realisasiBulan6', 'realisasiTw2',
      'realisasiBulan7', 'realisasiBulan8', 'realisasiBulan9', 'realisasiTw3',
      'realisasiBulan10', 'realisasiBulan11', 'realisasiBulan12', 'realisasiTw4',
      'totalRealisasi'
    ]
  }
];

const KertasKerjaForm: React.FC<KertasKerjaFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<KertasKerjaPerubahan>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [activeSection, setActiveSection] = useState('bidang');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['bidang']));
  const [isCalculating, setIsCalculating] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData);
      } else {
        // Initialize with default values for add mode
        setFormData({
          kodeBidang: '',
          namaBidang: '',
          kodeStandar: '',
          namaStandar: '',
          bidangKegiatan: 'kurikulum',
          standarNasional: 'standar_kompetensi_lulusan',
          sumberDana: 'bos_reguler',
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
          pajak: '0%',
          volume: 0,
          hargaSatuan: 0,
          koefisien: '',
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
          anggaranBulan1: 0,
          anggaranBulan2: 0,
          anggaranBulan3: 0,
          anggaranTw1: 0,
          anggaranBulan4: 0,
          anggaranBulan5: 0,
          anggaranBulan6: 0,
          anggaranTw2: 0,
          anggaranBulan7: 0,
          anggaranBulan8: 0,
          anggaranBulan9: 0,
          anggaranTw3: 0,
          anggaranBulan10: 0,
          anggaranBulan11: 0,
          anggaranBulan12: 0,
          anggaranTw4: 0,
          totalAkb: 0,
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
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  // Auto-calculate fields when relevant values change
  const handleAutoCalculate = useCallback(() => {
    setIsCalculating(true);
    setTimeout(() => {
      setFormData(prev => {
        const calculated = autoCalculateFields(prev);
        return calculated;
      });
      setIsCalculating(false);
    }, 100);
  }, []);

  // Handle field changes
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [fieldName]: value };
      
      // Clear error for this field
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName];
        return newErrors;
      });
      
      // Validate field
      const error = validateField(fieldName, value, newData as KertasKerjaPerubahan);
      if (error) {
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: error }));
      }
      
      return newData;
    });
  };

  // Handle section toggle
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate entire form
    const formErrors = validateForm(formData as KertasKerjaPerubahan);
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length === 0) {
      // Auto-calculate before saving
      const finalData = autoCalculateFields(formData);
      onSave(finalData as KertasKerjaPerubahan);
      onClose();
    } else {
      // Find first section with error and expand it
      const firstErrorField = Object.keys(formErrors)[0];
      const sectionWithError = formSections.find(section => 
        section.fields.includes(firstErrorField)
      );
      if (sectionWithError) {
        setActiveSection(sectionWithError.id);
        setExpandedSections(prev => new Set([...prev, sectionWithError.id]));
      }
    }
  };

  // Render input field
  const renderField = (fieldName: string) => {
    const value = (formData as any)[fieldName] || '';
    const error = errors[fieldName];
    const label = getFieldLabel(fieldName);
    const isRequired = ['kodeBidang', 'namaBidang', 'kodeGiat', 'namaGiat', 'kodeRekening', 'namaRekening'].includes(fieldName);
    
    // Determine field type
    const isNumber = fieldName.includes('volume') || fieldName.includes('harga') || 
                    fieldName.includes('nilai') || fieldName.includes('anggaran') || 
                    fieldName.includes('realisasi') || fieldName.includes('total') ||
                    fieldName.includes('vol') && !fieldName.includes('sat');
    const isTextarea = fieldName.includes('spek') || fieldName.includes('keterangan') || fieldName.includes('subtitle');
    const isDropdown = ['bidangKegiatan', 'standarNasional', 'sumberDana'].includes(fieldName);
    
    const baseClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      error ? 'border-red-500 bg-red-50' : 'border-gray-300'
    }`;
    
    // Get dropdown options
    const getDropdownOptions = () => {
      switch (fieldName) {
        case 'bidangKegiatan':
          return BIDANG_KEGIATAN_OPTIONS;
        case 'standarNasional':
          return STANDAR_NASIONAL_OPTIONS;
        case 'sumberDana':
          return SUMBER_DANA_OPTIONS;
        default:
          return [];
      }
    };

    return (
      <div key={fieldName} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {isDropdown ? (
          <select
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className={baseClasses}
          >
            <option value="">Pilih {label.toLowerCase()}</option>
            {getDropdownOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : isTextarea ? (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className={baseClasses}
            rows={3}
            placeholder={`Masukkan ${label.toLowerCase()}`}
          />
        ) : isNumber ? (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, parseFloat(e.target.value) || 0)}
            className={baseClasses}
            placeholder="0"
            min="0"
            step="0.01"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className={baseClasses}
            placeholder={`Masukkan ${label.toLowerCase()}`}
          />
        )}
        
        {error && (
          <div className="flex items-center text-red-600 text-sm mt-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
        
        {isNumber && value > 0 && (
          <div className="text-xs text-gray-500">
            {formatCurrency(value)}
          </div>
        )}
      </div>
    );
  };

  // Render quarterly section (special layout for budget/realization)
  const renderQuarterlySection = (sectionId: string, fields: string[]) => {
    const quarters = [
      { label: 'Triwulan 1', months: fields.slice(0, 4) },
      { label: 'Triwulan 2', months: fields.slice(4, 8) },
      { label: 'Triwulan 3', months: fields.slice(8, 12) },
      { label: 'Triwulan 4', months: fields.slice(12, 16) },
    ];
    
    const totalField = fields[fields.length - 1];
    
    return (
      <div className="space-y-6">
        {quarters.map((quarter, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">{quarter.label}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quarter.months.map(field => renderField(field))}
            </div>
          </div>
        ))}
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3">Total</h4>
          {renderField(totalField)}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-gray-50 rounded-l-xl p-4 border-r">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              {mode === 'add' ? 'Tambah Data' : 'Edit Data'} R-KAS
            </h2>
          </div>
          
          <nav className="space-y-2">
            {formSections.map((section) => {
              const hasError = section.fields.some(field => errors[field]);
              const isActive = activeSection === section.id;
              const isExpanded = expandedSections.has(section.id);
              
              return (
                <div key={section.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection(section.id);
                      toggleSection(section.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : hasError
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`transform transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}>
                        {section.icon}
                      </span>
                      <span className="ml-2 text-sm font-medium">{section.title}</span>
                    </div>
                    {hasError && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {formSections.find(s => s.id === activeSection)?.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Lengkapi informasi dengan teliti dan akurat
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleAutoCalculate}
                disabled={isCalculating}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Calculator className={`w-4 h-4 mr-2 ${isCalculating ? 'animate-spin' : ''}`} />
                Hitung Otomatis
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6">
              {expandedSections.has(activeSection) && (
                <div className="space-y-6">
                  {activeSection === 'anggaran' || activeSection === 'realisasi' ? (
                    renderQuarterlySection(
                      activeSection,
                      formSections.find(s => s.id === activeSection)?.fields || []
                    )
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formSections
                        .find(s => s.id === activeSection)
                        ?.fields.map(field => renderField(field))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 px-6 py-4 rounded-br-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {Object.keys(errors).length > 0 && (
                    <span className="text-red-600">
                      {Object.keys(errors).length} field memiliki error
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {mode === 'add' ? 'Simpan' : 'Update'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KertasKerjaForm;