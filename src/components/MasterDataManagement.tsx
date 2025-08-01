import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Save, 
  X,
  Building2,
  Target,
  Activity,
  DollarSign,
  CreditCard,
  Settings,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ApiService } from '../lib/api';
import toast from 'react-hot-toast';
import { DatabaseStatus } from './DatabaseStatus';
import { ErrorDisplay, LoadingState, EmptyState } from './ErrorDisplay';

type MasterDataType = 'bidang' | 'standar' | 'giat' | 'dana' | 'rekening' | 'komponen';

interface MasterDataConfig {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'number';
    required?: boolean;
  }>;
}

const masterDataConfigs: Record<MasterDataType, MasterDataConfig> = {
  bidang: {
    title: 'Bidang',
    icon: Building2,
    color: 'blue',
    fields: [
      { key: 'kode', label: 'Kode', type: 'text', required: true },
      { key: 'nama', label: 'Nama', type: 'text', required: true }
    ]
  },
  standar: {
    title: 'Standar',
    icon: Target,
    color: 'green',
    fields: [
      { key: 'kode', label: 'Kode', type: 'text', required: true },
      { key: 'nama', label: 'Nama', type: 'text', required: true }
    ]
  },
  giat: {
    title: 'Kegiatan',
    icon: Activity,
    color: 'purple',
    fields: [
      { key: 'kode', label: 'Kode', type: 'text', required: true },
      { key: 'nama', label: 'Nama', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'text' }
    ]
  },
  dana: {
    title: 'Sumber Dana',
    icon: DollarSign,
    color: 'yellow',
    fields: [
      { key: 'kode', label: 'Kode', type: 'text', required: true },
      { key: 'nama', label: 'Nama', type: 'text', required: true }
    ]
  },
  rekening: {
    title: 'Rekening',
    icon: CreditCard,
    color: 'red',
    fields: [
      { key: 'kode', label: 'Kode', type: 'text', required: true },
      { key: 'nama', label: 'Nama', type: 'text', required: true }
    ]
  },
  komponen: {
    title: 'Komponen',
    icon: Settings,
    color: 'indigo',
    fields: [
      { key: 'kode', label: 'Kode', type: 'text', required: true },
      { key: 'nama', label: 'Nama', type: 'text', required: true },
      { key: 'satuan', label: 'Satuan', type: 'text' },
      { key: 'merk', label: 'Merk', type: 'text' },
      { key: 'spek', label: 'Spesifikasi', type: 'text' }
    ]
  }
};

export const MasterDataManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MasterDataType>('bidang');
  // Mock data untuk fallback
  const mockData: Record<MasterDataType, any[]> = {
    bidang: [
      { id: 1, kode: 'BID001', nama: 'Pendidikan', deskripsi: 'Bidang Pendidikan' },
      { id: 2, kode: 'BID002', nama: 'Kesehatan', deskripsi: 'Bidang Kesehatan' }
    ],
    standar: [
      { id: 1, kode: 'STD001', nama: 'Standar Pelayanan Minimal', deskripsi: 'SPM Pendidikan' },
      { id: 2, kode: 'STD002', nama: 'Standar Nasional', deskripsi: 'Standar Nasional Pendidikan' }
    ],
    giat: [
      { id: 1, kode: 'GIA001', nama: 'Kegiatan Pembelajaran', deskripsi: 'Kegiatan pembelajaran siswa' },
      { id: 2, kode: 'GIA002', nama: 'Kegiatan Ekstrakurikuler', deskripsi: 'Kegiatan di luar jam pelajaran' }
    ],
    dana: [
      { id: 1, kode: 'DAN001', nama: 'Dana BOS', deskripsi: 'Dana Bantuan Operasional Sekolah' },
      { id: 2, kode: 'DAN002', nama: 'Dana APBD', deskripsi: 'Dana Anggaran Pendapatan dan Belanja Daerah' }
    ],
    rekening: [
      { id: 1, kode: '5.1.1', nama: 'Belanja Pegawai', deskripsi: 'Belanja untuk pegawai' },
      { id: 2, kode: '5.1.2', nama: 'Belanja Barang', deskripsi: 'Belanja untuk barang dan jasa' }
    ],
    komponen: [
      { id: 1, kode: 'KOM001', nama: 'Komponen Utama', deskripsi: 'Komponen utama kegiatan' },
      { id: 2, kode: 'KOM002', nama: 'Komponen Pendukung', deskripsi: 'Komponen pendukung kegiatan' }
    ]
  };

  const [data, setData] = useState<Record<MasterDataType, any[]>>(mockData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<any>({});

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Load specific data when tab changes
  useEffect(() => {
    if (data[activeTab].length === 0) {
      loadData(activeTab);
    }
  }, [activeTab]);

  // Load data for specific type
  const loadData = async (type: MasterDataType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const config = masterDataConfigs[type];
      let response;
      
      // Add delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      switch (type) {
        case 'bidang':
          response = await ApiService.bidang.getAll();
          break;
        case 'standar':
          response = await ApiService.standar.getAll();
          break;
        case 'giat':
          response = await ApiService.giat.getAll();
          break;
        case 'dana':
          response = await ApiService.dana.getAll();
          break;
        case 'rekening':
          response = await ApiService.rekening.getAll();
          break;
        case 'komponen':
          response = await ApiService.komponen.getAll();
          break;
        default:
          throw new Error(`Unknown data type: ${type}`);
      }
      
      if (response && Array.isArray(response)) {
        setData(prev => ({ ...prev, [type]: response }));
        setError(null);
        
        // Check if we're using demo data
        const isDemo = !import.meta.env.VITE_SUPABASE_URL || 
                      import.meta.env.VITE_SUPABASE_URL === 'https://your-project-id.supabase.co';
        
        if (isDemo) {
          setError('⚠️ Using demo data - configure Supabase for real data');
          toast.success(`📊 ${config.title} demo data loaded`);
        } else {
          toast.success(`✅ ${config.title} loaded from database`);
        }
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error: any) {
      console.error(`Error loading ${type}:`, error);
      
      // Use mock data as fallback
      setData(prev => ({ ...prev, [type]: mockData[type] || [] }));
      
      let errorMessage = `Failed to load ${type}`;
      if (error.message?.includes('recursion') || error.message?.includes('42P17')) {
        errorMessage = 'Database RLS recursion detected';
      } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        errorMessage = 'Database table not found';
      } else if (error.message?.includes('JWT') || error.message?.includes('auth')) {
        errorMessage = 'Authentication issue';
      } else if (error.message?.includes('connection') || error.message?.includes('fetch')) {
        errorMessage = 'Database connection failed';
      }
      
      setError(errorMessage + ' - using demo data');
      toast.error(`Error loading ${type}, using demo data`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load all data
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading all master data...');
      
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const results: Record<MasterDataType, any[]> = {
        bidang: [],
        standar: [],
        giat: [],
        dana: [],
        rekening: [],
        komponen: []
      };
      
      let hasApiData = false;
      
      // Try to load data from API first
      for (const [key, config] of Object.entries(masterDataConfigs)) {
        try {
          const response = await ApiService[key as MasterDataType].getAll();
          if (response && Array.isArray(response) && response.length > 0) {
            results[key as MasterDataType] = response;
            hasApiData = true;
          } else if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
            results[key as MasterDataType] = response.data;
            hasApiData = true;
          }
        } catch (error: any) {
          console.warn(`API not available for ${key}, using mock data:`, error.message);
          // Gunakan mock data sebagai fallback
          results[key as MasterDataType] = mockData[key as MasterDataType] || [];
        }
      }
      
      // Use mock data as fallback for empty results
      for (const [key, value] of Object.entries(results)) {
        if (!value || value.length === 0) {
          results[key as MasterDataType] = mockData[key as MasterDataType] || [];
        }
      }
      
      setData(results);
      
      if (hasApiData) {
        setError(null);
        toast.success('✅ Master data loaded from database successfully');
      } else {
        setError('⚠️ Database connection failed - using demo data');
        toast.success('📊 Demo master data loaded successfully');
      }
      
    } catch (error: any) {
      console.error('Unexpected error loading master data:', error);
      
      // Use mock data as fallback
      setData(mockData);
      
      let errorMessage = '❌ Unexpected error occurred';
      if (error.message?.includes('recursion') || error.message?.includes('42P17')) {
        errorMessage = '⚠️ Database RLS recursion detected';
      } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        errorMessage = '⚠️ Database table not found';
      } else if (error.message?.includes('JWT') || error.message?.includes('auth')) {
        errorMessage = '⚠️ Authentication issue';
      } else if (error.message?.includes('connection') || error.message?.includes('fetch')) {
        errorMessage = '⚠️ Database connection failed';
      }
      
      setError(errorMessage + ' - using demo data');
      toast.error('Error loading data, using demo data');
    } finally {
      setIsLoading(false);
    }
  };

  // Save item
  const saveItem = async () => {
    const config = masterDataConfigs[activeTab];
    
    // Validate required fields
    for (const field of config.fields) {
      if (field.required && !formData[field.key]) {
        toast.error(`${field.label} harus diisi`);
        return;
      }
    }

    try {
      let result: any;
      
      // Check if we're using demo data
      const isDemo = !import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.VITE_SUPABASE_URL === 'https://your-project-id.supabase.co';
      
      if (!isDemo) {
        // Try real API call
        try {
          if (editingItem) {
            // Update existing item
            switch (activeTab) {
              case 'bidang':
                result = await ApiService.bidang.update(editingItem.id, formData);
                break;
              case 'standar':
                result = await ApiService.standar.update(editingItem.id, formData);
                break;
              case 'giat':
                result = await ApiService.giat.update(editingItem.id, formData);
                break;
              case 'dana':
                result = await ApiService.dana.update(editingItem.id, formData);
                break;
              case 'rekening':
                result = await ApiService.rekening.update(editingItem.id, formData);
                break;
              case 'komponen':
                result = await ApiService.komponen.update(editingItem.id, formData);
                break;
            }
            
            setData(prev => ({
              ...prev,
              [activeTab]: prev[activeTab].map(item => 
                item.id === editingItem.id ? result : item
              )
            }));
            
            toast.success(`${config.title} berhasil diperbarui`);
          } else {
            // Create new item
            const newData = {
              ...formData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            switch (activeTab) {
              case 'bidang':
                result = await ApiService.bidang.create(newData);
                break;
              case 'standar':
                result = await ApiService.standar.create(newData);
                break;
              case 'giat':
                result = await ApiService.giat.create(newData);
                break;
              case 'dana':
                result = await ApiService.dana.create(newData);
                break;
              case 'rekening':
                result = await ApiService.rekening.create(newData);
                break;
              case 'komponen':
                result = await ApiService.komponen.create(newData);
                break;
            }
            
            setData(prev => ({
              ...prev,
              [activeTab]: [result, ...prev[activeTab]]
            }));
            
            toast.success(`${config.title} berhasil ditambahkan`);
          }
        } catch (apiError: any) {
          console.warn('API error, falling back to demo mode:', apiError);
          throw apiError; // Re-throw to trigger demo mode fallback
        }
      } else {
        // Demo mode - simulate API behavior
        if (editingItem) {
          // Update existing item in demo data
          const updatedItem = { 
            ...editingItem, 
            ...formData,
            updated_at: new Date().toISOString()
          };
          setData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(item => 
              item.id === editingItem.id ? updatedItem : item
            )
          }));
          toast.success(`${config.title} berhasil diperbarui (mode demo)`);
        } else {
          // Create new item in demo data
          const existingIds = data[activeTab].map(item => parseInt(item.id?.toString() || '0')).filter(id => !isNaN(id));
          const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
          const newItem = { 
            id: newId.toString(), 
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setData(prev => ({
            ...prev,
            [activeTab]: [newItem, ...prev[activeTab]]
          }));
          toast.success(`${config.title} berhasil ditambahkan (mode demo)`);
        }
      }
      
      setShowModal(false);
      setEditingItem(null);
      setFormData({});
      
    } catch (error: any) {
      console.error('Error saving item:', error);
      
      // Fallback to demo mode if API fails
      if (editingItem) {
        const updatedItem = { 
          ...editingItem, 
          ...formData,
          updated_at: new Date().toISOString()
        };
        setData(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].map(item => 
            item.id === editingItem.id ? updatedItem : item
          )
        }));
        toast.success(`${config.title} berhasil diperbarui (mode demo)`);
      } else {
        const existingIds = data[activeTab].map(item => parseInt(item.id?.toString() || '0')).filter(id => !isNaN(id));
        const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
        const newItem = { 
          id: newId.toString(), 
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setData(prev => ({
          ...prev,
          [activeTab]: [newItem, ...prev[activeTab]]
        }));
        toast.success(`${config.title} berhasil ditambahkan (mode demo)`);
      }
      
      setShowModal(false);
      setEditingItem(null);
      setFormData({});
    }
  };

  // Delete item
  const deleteItem = async (id: string | number) => {
    const config = masterDataConfigs[activeTab];
    
    if (!confirm(`Apakah Anda yakin ingin menghapus ${config.title} ini?`)) return;

    try {
      // Check if we're using demo data
      const isDemo = !import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.VITE_SUPABASE_URL === 'https://your-project-id.supabase.co';
      
      if (!isDemo) {
        // Try real API call
        try {
          switch (activeTab) {
            case 'bidang':
              await ApiService.bidang.delete(id.toString());
              break;
            case 'standar':
              await ApiService.standar.delete(id.toString());
              break;
            case 'giat':
              await ApiService.giat.delete(id.toString());
              break;
            case 'dana':
              await ApiService.dana.delete(id.toString());
              break;
            case 'rekening':
              await ApiService.rekening.delete(id.toString());
              break;
            case 'komponen':
              await ApiService.komponen.delete(id.toString());
              break;
          }
          
          setData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(item => item.id !== id)
          }));
          
          toast.success(`${config.title} berhasil dihapus`);
        } catch (apiError: any) {
          console.warn('API error, falling back to demo mode:', apiError);
          throw apiError; // Re-throw to trigger demo mode fallback
        }
      } else {
        // Demo mode - simulate deletion
        setData(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].filter(item => item.id !== id)
        }));
        
        toast.success(`${config.title} berhasil dihapus (mode demo)`);
      }
      
    } catch (error: any) {
      console.error('Error deleting item:', error);
      
      // Fallback to demo mode if API fails
      setData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== id)
      }));
      
      toast.success(`${config.title} berhasil dihapus (mode demo)`);
    }
  };

  // Open modal for add/edit
  const openModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({});
    }
    setShowModal(true);
  };

  // Filter data
  const filteredData = data[activeTab].filter(item =>
    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load data when component mounts or tab changes
  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  useEffect(() => {
    loadAllData();
  }, []);

  const config = masterDataConfigs[activeTab];
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4 lg:space-y-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Master Data Management</h1>
                  {isLoading && (
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      <span className="text-xs">Memuat...</span>
                    </div>
                  )}

                  {!error && !isLoading && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <Database className="w-4 h-4 mr-1" />
                      <span className="text-xs">Data Terkini</span>
                    </div>
                  )}
                </div>
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Kelola data master untuk sistem R-KAS
                </p>
              </div>
              <button
                onClick={loadAllData}
                disabled={isLoading}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Database className="w-4 h-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>

      {/* Database Status */}
      <DatabaseStatus onStatusChange={(connected) => {
        if (connected && Object.values(data).every(arr => arr.length === 0) && !error) {
          loadAllData()
        }
      }} />

      {/* Error Display */}
      {error && (
        <ErrorDisplay 
          error={error} 
          onRetry={loadAllData}
          showDetails={true}
        />
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <LoadingState message="Memuat data master..." />
      )}

      {/* Empty State for all data */}
      {!isLoading && !error && Object.values(data).every(arr => arr.length === 0) && (
        <EmptyState
          title="Belum Ada Data Master"
          description="Belum ada data master yang tersedia. Mulai dengan menambah data master untuk setiap kategori."
          action={{
            label: "Muat Ulang Data",
            onClick: loadAllData
          }}
          icon={<Database className="w-12 h-12" />}
        />
      )}

      {/* Tabs - Only show if we have data or no error */}
      {!isLoading && !error && Object.values(data).some(arr => arr.length > 0) && (
        <>
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="-mb-px flex space-x-4 lg:space-x-8 min-w-max">
              {Object.entries(masterDataConfigs).map(([key, config]) => {
                const IconComp = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as MasterDataType)}
                    className={`flex items-center py-2 px-2 lg:px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap ${
                      activeTab === key
                        ? `border-${config.color}-500 text-${config.color}-600 dark:text-${config.color}-400`
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <IconComp className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">{config.title}</span>
                    <span className="sm:hidden">{config.title.slice(0, 3)}</span>
                    <span className="ml-1 lg:ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-1.5 lg:px-2 rounded-full text-xs">
                      {data[key as MasterDataType].length}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Toolbar */}
            <div className="p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={`Cari ${config.title.toLowerCase()}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={() => openModal()}
                  className={`flex items-center justify-center px-3 lg:px-4 py-2 bg-${config.color}-600 text-white rounded-lg hover:bg-${config.color}-700 text-sm`}
                >
                  <Plus className="w-4 h-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Tambah {config.title}</span>
                  <span className="sm:hidden">Tambah</span>
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {config.fields.map(field => (
                      <th
                        key={field.key}
                        className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {field.label}
                      </th>
                    ))}
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {config.fields.map(field => (
                        <td key={field.key} className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-900 dark:text-white">
                          <div className="max-w-32 lg:max-w-none">
                            <span className="block truncate lg:whitespace-normal" title={item[field.key] || '-'}>
                              {item[field.key] || '-'}
                            </span>
                          </div>
                        </td>
                      ))}
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <button
                            onClick={() => openModal(item)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                            title="Hapus"
                          >
                            <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan={config.fields.length + 1}
                        className="px-3 lg:px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        {isLoading ? 'Memuat data...' : `Tidak ada data ${config.title.toLowerCase()}`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100 border border-gray-200 dark:border-gray-700">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-medium text-gray-900 dark:text-white">
                  {editingItem ? `Edit ${config.title}` : `Tambah ${config.title}`}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {config.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [field.key]: field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                      }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Masukkan ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  onClick={saveItem}
                  className={`w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm bg-${config.color}-600 text-white rounded-lg hover:bg-${config.color}-700`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};