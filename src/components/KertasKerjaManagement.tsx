import React, { useState, useEffect } from 'react';
import { 
  Upload, Download, FileText, TrendingUp, TrendingDown, DollarSign, 
  Calendar, Filter, Search, Eye, Edit, Trash2, Plus, Save, X, 
  ChevronLeft, ChevronRight, BarChart3, PieChart, Settings,
  RefreshCw, AlertCircle, CheckCircle, Clock, Users, Database,
  FileSpreadsheet, FileDown, Layers, Activity
} from 'lucide-react';
import { KertasKerjaPerubahan, CSVParser } from '../utils/csvParser';
import ComprehensiveRKASTable from './ComprehensiveRKASTable';
import ComprehensiveRKASForm from './ComprehensiveRKASForm';
import AdvancedFilters from './AdvancedFilters';
import ExportManager from './ExportManager';
import BudgetDetailAnalysis from './BudgetDetailAnalysis';
import { getAllSampleData, sampleRKASData } from '../data/sampleRKASData';
import { toast } from 'sonner';

type ViewMode = 'summary' | 'table' | 'chart';
type DataSource = 'local' | 'csv' | 'sample';

interface KertasKerjaManagementProps {
  onDataLoad?: (data: KertasKerjaPerubahan[]) => void;
}

const KertasKerjaManagement: React.FC<KertasKerjaManagementProps> = ({ onDataLoad }) => {
  // State management
  const [data, setData] = useState<KertasKerjaPerubahan[]>([]);
  const [filteredData, setFilteredData] = useState<KertasKerjaPerubahan[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<DataSource>('sample');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  
  // Form and modal states
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingItem, setEditingItem] = useState<KertasKerjaPerubahan | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  
  // Selection and pagination
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Export state
  const [showExportManager, setShowExportManager] = useState(false);
  
  // Budget Analysis state
  const [showBudgetAnalysis, setShowBudgetAnalysis] = useState(false);
  
  // Statistics
  const [summary, setSummary] = useState<any>(null);
  
  // Filter state
  const [filters, setFilters] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isOnline, setIsOnline] = useState(true);

  // Initialize component
  useEffect(() => {
    loadData();
  }, [dataSource]);

  // Update filtered data when data changes
  useEffect(() => {
    setFilteredData(data);
    calculateSummary(data);
    onDataLoad?.(data);
  }, [data, onDataLoad]);

  // Load data based on source
  const loadData = async () => {
    setLoading(true);
    try {
      switch (dataSource) {
        case 'sample':
          await loadSampleData();
          break;
        case 'csv':
          await loadFromCSV();
          break;
        case 'local':
          await loadFromLocalStorage();
          break;
        default:
          await loadSampleData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  // Load sample data
  const loadSampleData = async () => {
    const sampleData = getAllSampleData();
    setData(sampleData);
    toast.success(`Berhasil memuat ${sampleData.length} data sampel`);
  };

  // Load data from CSV file
  const loadFromCSV = async () => {
    try {
      const response = await fetch('/KERTASKERJAPERUBAHAN.csv');
      if (response.ok) {
        const content = await response.text();
        const parsedData = CSVParser.parseCSV(content);
        setData(parsedData);
        toast.success(`Berhasil memuat ${parsedData.length} data dari CSV`);
      } else {
        toast.error('File CSV tidak ditemukan');
        // Fallback to sample data
        await loadSampleData();
      }
    } catch (error) {
      console.error('Error loading CSV:', error);
      toast.error('Gagal memuat file CSV');
      // Fallback to sample data
      await loadSampleData();
    }
  };

  // Load data from local storage
  const loadFromLocalStorage = async () => {
    try {
      const stored = localStorage.getItem('rkas-data');
      if (stored) {
        const parsedData = JSON.parse(stored);
        setData(parsedData);
        toast.success(`Berhasil memuat ${parsedData.length} data dari penyimpanan lokal`);
      } else {
        // Fallback to sample data
        await loadSampleData();
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      toast.error('Gagal memuat data dari penyimpanan lokal');
      // Fallback to sample data
      await loadSampleData();
    }
  };

  // Calculate summary statistics
  const calculateSummary = (data: KertasKerjaPerubahan[]) => {
    const totalAnggaran = data.reduce((sum, item) => sum + (item.totalAkb || 0), 0);
    const totalRealisasi = data.reduce((sum, item) => sum + (item.totalRealisasi || 0), 0);
    const persentaseRealisasi = totalAnggaran > 0 ? (totalRealisasi / totalAnggaran) * 100 : 0;
    
    const bidangSummary = data.reduce((acc, item) => {
      const key = item.kodeBidang;
      if (!acc[key]) {
        acc[key] = {
          kodeBidang: item.kodeBidang,
          namaBidang: item.namaBidang,
          totalAnggaran: 0,
          totalRealisasi: 0,
          jumlahItem: 0
        };
      }
      acc[key].totalAnggaran += item.totalAkb || 0;
      acc[key].totalRealisasi += item.totalRealisasi || 0;
      acc[key].jumlahItem += 1;
      return acc;
    }, {} as Record<string, any>);
    
    setSummary({
      totalAnggaran,
      totalRealisasi,
      persentaseRealisasi,
      jumlahItem: data.length,
      bidangSummary: Object.values(bidangSummary)
    });
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Hanya file CSV yang diperbolehkan');
      return;
    }

    setLoading(true);
    try {
      const content = await file.text();
      const parsedData = CSVParser.parseCSV(content);
      setData(parsedData);
      setDataSource('csv');
      
      // Save to localStorage for persistence
      localStorage.setItem('rkas-data', JSON.stringify(parsedData));
      
      toast.success(`Berhasil mengimpor ${parsedData.length} data`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Gagal mengimpor file CSV');
    } finally {
      setLoading(false);
    }

    // Reset input
    event.target.value = '';
  };

  // Handle form operations
  const handleAdd = () => {
    setFormMode('add');
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: KertasKerjaPerubahan) => {
    setFormMode('edit');
    setEditingItem(item);
    setShowForm(true);
  };

  const handleView = (item: KertasKerjaPerubahan) => {
    setEditingItem(item);
    // Could open a detailed view modal
    toast.info('Fitur detail view akan segera tersedia');
  };

  const handleSave = async (formData: Partial<KertasKerjaPerubahan>) => {
    setLoading(true);
    try {
      const newData = [...data];
      
      if (formMode === 'add') {
        const newItem = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as KertasKerjaPerubahan;
        newData.push(newItem);
        toast.success('Data berhasil ditambahkan');
      } else {
        const index = newData.findIndex(item => item.id === editingItem!.id);
        if (index !== -1) {
          newData[index] = {
            ...newData[index],
            ...formData,
            updatedAt: new Date().toISOString()
          };
          toast.success('Data berhasil diperbarui');
        }
      }
      
      setData(newData);
      
      // Save to localStorage for persistence
      localStorage.setItem('rkas-data', JSON.stringify(newData));
      
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: KertasKerjaPerubahan) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      return;
    }

    setLoading(true);
    try {
      const newData = data.filter(d => d.id !== item.id);
      setData(newData);
      
      // Save to localStorage for persistence
      localStorage.setItem('rkas-data', JSON.stringify(newData));
      
      toast.success('Data berhasil dihapus');
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Gagal menghapus data');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk operations
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast.error('Pilih item yang akan dihapus');
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${selectedItems.length} item?`)) {
      return;
    }

    setLoading(true);
    try {
      const newData = data.filter(item => !selectedItems.includes(item.id || ''));
      setData(newData);
      
      // Save to localStorage for persistence
      localStorage.setItem('rkas-data', JSON.stringify(newData));
      
      toast.success(`${selectedItems.length} item berhasil dihapus`);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error bulk deleting:', error);
      toast.error('Gagal menghapus data');
    } finally {
      setLoading(false);
    }
  };

  // Handle selection
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(filteredData.map(item => item.id || '').filter(Boolean));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle export
  const handleExport = () => {
    setShowExportManager(true);
  };

  // Handle filters
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Apply filters locally
    const filtered = data.filter(item => {
      // Implement filtering logic based on newFilters
      return true; // Placeholder
    });
    setFilteredData(filtered);
  };

  // Get summary statistics
  const getSummaryData = () => {
    if (summary) return summary;
    
    const totalAkb = data.reduce((sum, item) => sum + (item.totalAkb || 0), 0);
    const totalRealisasi = data.reduce((sum, item) => sum + (item.totalRealisasi || 0), 0);
    const persentaseRealisasi = totalAkb > 0 ? (totalRealisasi / totalAkb) * 100 : 0;
    
    return {
      totalItems: data.length,
      totalAkb,
      totalRealisasi,
      persentaseRealisasi,
      bidangCount: new Set(data.map(item => item.namaBidang)).size
    };
  };

  const summaryData = getSummaryData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen R-KAS</h1>
              <p className="mt-1 text-sm text-gray-600">
                Sistem manajemen Rencana Kas Belanja yang komprehensif
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Data Source Toggle */}
              <div className="flex items-center space-x-2">
                <Database className={`w-4 h-4 ${isOnline ? 'text-green-600' : 'text-gray-400'}`} />
                <select
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value as DataSource)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="sample">Sample Data</option>
                  <option value="csv">CSV File</option>
                  <option value="local">Local Storage</option>
                </select>
              </div>
              
              {/* Status Indicator */}
              <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-600' : 'bg-red-600'
                }`} />
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Item</dt>
                    <dd className="text-lg font-medium text-gray-900">{summaryData.totalItems}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Anggaran</dt>
                    <dd className="text-lg font-medium text-blue-600">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(summaryData.totalAkb)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Realisasi</dt>
                    <dd className="text-lg font-medium text-green-600">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(summaryData.totalRealisasi)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Persentase Realisasi</dt>
                    <dd className="text-lg font-medium text-purple-600">
                      {summaryData.persentaseRealisasi.toFixed(2)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="-ml-1 mr-2 h-4 w-4" />
                  Tambah Data
                </button>
                
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                  <Upload className="-ml-1 mr-2 h-4 w-4" />
                  Upload CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    showFilters
                      ? 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Filter className="-ml-1 mr-2 h-4 w-4" />
                  Filter
                </button>
                
                <button
                  onClick={() => setShowBudgetAnalysis(true)}
                  className="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Activity className="-ml-1 mr-2 h-4 w-4" />
                  Detail Anggaran
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedItems.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="-ml-1 mr-2 h-4 w-4" />
                    Hapus ({selectedItems.length})
                  </button>
                )}
                
                <button
                   onClick={handleExport}
                   className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                 >
                   <Download className="-ml-1 mr-2 h-4 w-4" />
                   Export
                 </button>
                
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <RefreshCw className={`-ml-1 mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6">
            <AdvancedFilters
              data={data}
              onFiltersChange={handleFiltersChange}
              onExport={handleExport}
            />
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white shadow rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Memuat data...</span>
            </div>
          ) : (
            <ComprehensiveRKASTable
              data={filteredData}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
            />
          )}
        </div>
      </div>

      {/* Form Modal */}
         {showForm && (
           <ComprehensiveRKASForm
             isOpen={showForm}
             onClose={() => {
               setShowForm(false);
               setEditingItem(null);
             }}
             onSave={handleSave}
             editingItem={editingItem}
             mode={formMode}
           />
         )}

        {/* Export Manager */}
        {showExportManager && (
          <ExportManager
            data={filteredData}
            isOpen={showExportManager}
            onClose={() => setShowExportManager(false)}
          />
        )}
        
        {/* Budget Detail Analysis */}
        {showBudgetAnalysis && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowBudgetAnalysis(false)}></div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
                <BudgetDetailAnalysis
                  data={filteredData}
                  onClose={() => setShowBudgetAnalysis(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default KertasKerjaManagement;