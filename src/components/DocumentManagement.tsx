import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, Download, Eye, Edit, Trash2, 
  Search, Filter, Plus, FolderPlus, File, 
  Calendar, User, Tag, Share2, Lock, Unlock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
  tags: string[];
  description?: string;
  uploaded_by: string;
  uploaded_at: string;
  updated_at: string;
  is_public: boolean;
  download_count: number;
  file_url?: string;
}

interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  document_count: number;
}

export const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    name: '',
    category: '',
    description: '',
    tags: '',
    is_public: true
  });

  const mockCategories: DocumentCategory[] = [
    { id: '1', name: 'Laporan Keuangan', description: 'Laporan dan dokumen keuangan', color: 'blue', document_count: 15 },
    { id: '2', name: 'Kebijakan', description: 'Dokumen kebijakan dan prosedur', color: 'green', document_count: 8 },
    { id: '3', name: 'Kontrak', description: 'Kontrak dan perjanjian', color: 'purple', document_count: 12 },
    { id: '4', name: 'Surat Menyurat', description: 'Surat masuk dan keluar', color: 'orange', document_count: 25 },
    { id: '5', name: 'Template', description: 'Template dokumen', color: 'red', document_count: 6 }
  ];

  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Laporan Keuangan Q1 2024.pdf',
      type: 'pdf',
      size: 2048576,
      category: 'Laporan Keuangan',
      tags: ['keuangan', 'laporan', 'q1'],
      description: 'Laporan keuangan kuartal pertama tahun 2024',
      uploaded_by: 'Admin',
      uploaded_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      is_public: true,
      download_count: 45
    },
    {
      id: '2',
      name: 'Kebijakan Pengadaan Barang.docx',
      type: 'docx',
      size: 1024000,
      category: 'Kebijakan',
      tags: ['kebijakan', 'pengadaan'],
      description: 'Kebijakan dan prosedur pengadaan barang dan jasa',
      uploaded_by: 'Manager',
      uploaded_at: '2024-01-14T09:15:00Z',
      updated_at: '2024-01-14T09:15:00Z',
      is_public: false,
      download_count: 12
    },
    {
      id: '3',
      name: 'Kontrak Vendor IT.pdf',
      type: 'pdf',
      size: 3072000,
      category: 'Kontrak',
      tags: ['kontrak', 'vendor', 'it'],
      description: 'Kontrak kerjasama dengan vendor IT',
      uploaded_by: 'Staff IT',
      uploaded_at: '2024-01-13T14:20:00Z',
      updated_at: '2024-01-13T14:20:00Z',
      is_public: false,
      download_count: 8
    }
  ];

  useEffect(() => {
    loadDocuments();
    setCategories(mockCategories);
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      // Simulate loading from Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDocuments(mockDocuments);
    } catch (error) {
      toast.error('Gagal memuat dokumen');
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => doc.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📋';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️';
      default: return '📁';
    }
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      red: 'bg-red-100 text-red-800'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error('Pilih file untuk diupload');
      return;
    }

    try {
      // Simulate file upload
      const newDocument: Document = {
        id: Date.now().toString(),
        name: uploadData.name || uploadFile.name,
        type: uploadFile.name.split('.').pop() || '',
        size: uploadFile.size,
        category: uploadData.category,
        tags: uploadData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        description: uploadData.description,
        uploaded_by: 'Current User',
        uploaded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_public: uploadData.is_public,
        download_count: 0
      };

      setDocuments([newDocument, ...documents]);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadData({
        name: '',
        category: '',
        description: '',
        tags: '',
        is_public: true
      });
      toast.success('Dokumen berhasil diupload');
    } catch (error) {
      toast.error('Gagal mengupload dokumen');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      try {
        setDocuments(documents.filter(doc => doc.id !== id));
        toast.success('Dokumen berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus dokumen');
      }
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      // Simulate download
      const updatedDoc = { ...document, download_count: document.download_count + 1 };
      setDocuments(documents.map(doc => doc.id === document.id ? updatedDoc : doc));
      toast.success(`Mengunduh ${document.name}`);
    } catch (error) {
      toast.error('Gagal mengunduh dokumen');
    }
  };

  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Dokumen</h1>
          <p className="text-gray-600">Kelola dan organisir dokumen sekolah</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <FolderPlus size={16} />
            <span>Kategori</span>
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Upload size={16} />
            <span>Upload Dokumen</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedCategory === category.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedCategory(selectedCategory === category.name ? 'all' : category.name)}
          >
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.color)}`}>
              {category.name}
            </div>
            <p className="text-sm text-gray-600 mt-2">{category.description}</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{category.document_count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari dokumen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Filter berdasarkan tag:</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokumen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ukuran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada dokumen ditemukan
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-2xl mr-3">
                          {getFileIcon(document.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{document.name}</div>
                          {document.description && (
                            <div className="text-sm text-gray-500">{document.description}</div>
                          )}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {document.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        getCategoryColor(categories.find(c => c.name === document.category)?.color || 'gray')
                      }`}>
                        {document.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatFileSize(document.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>oleh {document.uploaded_by}</div>
                      <div>{new Date(document.uploaded_at).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {document.is_public ? (
                          <Unlock className="w-4 h-4 text-green-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm text-gray-500">
                          {document.download_count} unduhan
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDownload(document)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Lihat"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          title="Bagikan"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(document.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-[9999] backdrop-blur-sm">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-2xl rounded-xl bg-white transform transition-all duration-300 ease-out border-gray-200">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Upload Dokumen</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">File</label>
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Dokumen</label>
                  <input
                    type="text"
                    value={uploadData.name}
                    onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                    placeholder="Kosongkan untuk menggunakan nama file"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Kategori</label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags (pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={uploadData.tags}
                    onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                    placeholder="contoh: keuangan, laporan, 2024"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={uploadData.is_public}
                    onChange={(e) => setUploadData({ ...uploadData, is_public: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">
                    Dokumen publik (dapat diakses semua pengguna)
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};