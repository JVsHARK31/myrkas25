import React, { useState, useEffect } from 'react';
import { 
  Bell, Mail, MessageSquare, Phone, Settings, 
  Send, Inbox, Archive, Trash2, Star, Search,
  Filter, Plus, Edit, Eye, Users, Calendar,
  CheckCircle, XCircle, AlertTriangle, Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recipient_type: 'all' | 'role' | 'individual';
  recipients: string[];
  sender: string;
  channels: ('email' | 'sms' | 'push' | 'in_app')[];
  scheduled_at?: string;
  sent_at?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  read_count: number;
  total_recipients: number;
  created_at: string;
  attachments?: string[];
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push';
  variables: string[];
  created_at: string;
}

interface NotificationSettings {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  email_smtp_host: string;
  email_smtp_port: number;
  email_username: string;
  sms_provider: string;
  sms_api_key: string;
  default_sender: string;
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    email_enabled: true,
    sms_enabled: false,
    push_enabled: true,
    email_smtp_host: 'smtp.gmail.com',
    email_smtp_port: 587,
    email_username: 'admin@rkas.com',
    sms_provider: 'twilio',
    sms_api_key: '',
    default_sender: 'RKAS System'
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates' | 'settings'>('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info' as Notification['type'],
    priority: 'medium' as Notification['priority'],
    recipient_type: 'all' as Notification['recipient_type'],
    recipients: [] as string[],
    channels: ['in_app'] as Notification['channels'],
    scheduled_at: ''
  });

  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'email' as Template['type'],
    variables: [] as string[]
  });

  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Pengingat Deadline Laporan',
      message: 'Deadline pengumpulan laporan keuangan bulanan adalah besok, 28 Februari 2024.',
      type: 'warning',
      priority: 'high',
      recipient_type: 'role',
      recipients: ['finance_staff', 'admin'],
      sender: 'System',
      channels: ['email', 'in_app'],
      scheduled_at: '2024-02-27T09:00:00Z',
      sent_at: '2024-02-27T09:00:00Z',
      status: 'sent',
      read_count: 8,
      total_recipients: 12,
      created_at: '2024-02-26T10:00:00Z'
    },
    {
      id: '2',
      title: 'Rapat Evaluasi Anggaran',
      message: 'Rapat evaluasi anggaran Q1 akan dilaksanakan pada 15 Februari 2024 pukul 09:00 di Ruang Rapat Utama.',
      type: 'info',
      priority: 'medium',
      recipient_type: 'individual',
      recipients: ['admin@rkas.com', 'manager@rkas.com'],
      sender: 'Admin',
      channels: ['email', 'sms', 'in_app'],
      sent_at: '2024-02-10T08:00:00Z',
      status: 'sent',
      read_count: 2,
      total_recipients: 2,
      created_at: '2024-02-10T07:30:00Z'
    },
    {
      id: '3',
      title: 'Pemeliharaan Sistem',
      message: 'Sistem akan menjalani pemeliharaan rutin pada Sabtu, 17 Februari 2024 dari pukul 22:00 - 02:00.',
      type: 'info',
      priority: 'low',
      recipient_type: 'all',
      recipients: [],
      sender: 'IT Support',
      channels: ['email', 'push', 'in_app'],
      scheduled_at: '2024-02-16T10:00:00Z',
      status: 'scheduled',
      read_count: 0,
      total_recipients: 50,
      created_at: '2024-02-15T14:00:00Z'
    }
  ];

  const mockTemplates: Template[] = [
    {
      id: '1',
      name: 'Pengingat Deadline',
      subject: 'Pengingat: Deadline {{task_name}}',
      content: 'Halo {{recipient_name}},\n\nIni adalah pengingat bahwa deadline untuk {{task_name}} adalah {{deadline_date}}.\n\nTerima kasih.',
      type: 'email',
      variables: ['recipient_name', 'task_name', 'deadline_date'],
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Undangan Rapat',
      subject: 'Undangan Rapat: {{meeting_title}}',
      content: 'Anda diundang untuk menghadiri rapat {{meeting_title}} pada {{meeting_date}} di {{meeting_location}}.',
      type: 'email',
      variables: ['meeting_title', 'meeting_date', 'meeting_location'],
      created_at: '2024-01-16T11:00:00Z'
    },
    {
      id: '3',
      name: 'SMS Pengingat',
      subject: '',
      content: 'Pengingat: {{task_name}} deadline {{deadline_date}}. Info: {{contact_info}}',
      type: 'sms',
      variables: ['task_name', 'deadline_date', 'contact_info'],
      created_at: '2024-01-17T09:00:00Z'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Simulate loading from Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
      setTemplates(mockTemplates);
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeColor = (type: Notification['type']) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[type];
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const getStatusColor = (status: Notification['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...notificationForm,
        sender: 'Current User',
        status: notificationForm.scheduled_at ? 'scheduled' : 'sent',
        sent_at: notificationForm.scheduled_at ? undefined : new Date().toISOString(),
        read_count: 0,
        total_recipients: notificationForm.recipient_type === 'all' ? 50 : notificationForm.recipients.length,
        created_at: new Date().toISOString()
      };

      if (selectedNotification) {
        setNotifications(notifications.map(n => n.id === selectedNotification.id ? { ...newNotification, id: selectedNotification.id } : n));
        toast.success('Notifikasi berhasil diperbarui');
      } else {
        setNotifications([newNotification, ...notifications]);
        toast.success('Notifikasi berhasil dibuat');
      }

      setShowNotificationModal(false);
      setSelectedNotification(null);
      setNotificationForm({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        recipient_type: 'all',
        recipients: [],
        channels: ['in_app'],
        scheduled_at: ''
      });
    } catch (error) {
      toast.error('Gagal menyimpan notifikasi');
    }
  };

  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTemplate: Template = {
        id: Date.now().toString(),
        ...templateForm,
        created_at: new Date().toISOString()
      };

      if (selectedTemplate) {
        setTemplates(templates.map(t => t.id === selectedTemplate.id ? { ...newTemplate, id: selectedTemplate.id } : t));
        toast.success('Template berhasil diperbarui');
      } else {
        setTemplates([newTemplate, ...templates]);
        toast.success('Template berhasil dibuat');
      }

      setShowTemplateModal(false);
      setSelectedTemplate(null);
      setTemplateForm({
        name: '',
        subject: '',
        content: '',
        type: 'email',
        variables: []
      });
    } catch (error) {
      toast.error('Gagal menyimpan template');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus notifikasi ini?')) {
      try {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.success('Notifikasi berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus notifikasi');
      }
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus template ini?')) {
      try {
        setTemplates(templates.filter(t => t.id !== id));
        toast.success('Template berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus template');
      }
    }
  };

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setNotificationForm({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      recipient_type: notification.recipient_type,
      recipients: notification.recipients,
      channels: notification.channels,
      scheduled_at: notification.scheduled_at || ''
    });
    setShowNotificationModal(true);
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      subject: template.subject,
      content: template.content,
      type: template.type,
      variables: template.variables
    });
    setShowTemplateModal(true);
  };

  const saveSettings = async () => {
    try {
      // Simulate saving to Supabase
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pusat Notifikasi</h1>
          <p className="text-gray-600">Kelola notifikasi dan komunikasi sekolah</p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'notifications' && (
            <button
              onClick={() => setShowNotificationModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Buat Notifikasi</span>
            </button>
          )}
          {activeTab === 'templates' && (
            <button
              onClick={() => setShowTemplateModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Buat Template</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bell size={16} />
              <span>Notifikasi</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MessageSquare size={16} />
              <span>Template</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Settings size={16} />
              <span>Pengaturan</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Terkirim</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.status === 'sent').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Terjadwal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.status === 'scheduled').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Inbox className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.status === 'draft').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tingkat Baca</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((notifications.reduce((acc, n) => acc + n.read_count, 0) / 
                    notifications.reduce((acc, n) => acc + n.total_recipients, 0)) * 100) || 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Cari notifikasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Terjadwal</option>
                  <option value="sent">Terkirim</option>
                  <option value="failed">Gagal</option>
                </select>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="info">Info</option>
                  <option value="success">Sukses</option>
                  <option value="warning">Peringatan</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notifikasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penerima
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statistik
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
                  ) : filteredNotifications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Tidak ada notifikasi ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <tr key={notification.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                                {getTypeIcon(notification.type)}
                                <span className="ml-1">{notification.type}</span>
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 mt-1">{notification.title}</div>
                            <div className="text-sm text-gray-500">{notification.message.substring(0, 100)}...</div>
                            <div className="text-xs text-gray-400 mt-1">
                              oleh {notification.sender} • {new Date(notification.created_at).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {notification.recipient_type === 'all' ? 'Semua Pengguna' :
                               notification.recipient_type === 'role' ? 'Berdasarkan Peran' : 'Individual'}
                            </div>
                            <div className="text-gray-500">{notification.total_recipients} penerima</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {notification.channels.map((channel) => (
                              <span
                                key={channel}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                              >
                                {channel === 'email' && <Mail className="w-3 h-3 mr-1" />}
                                {channel === 'sms' && <Phone className="w-3 h-3 mr-1" />}
                                {channel === 'push' && <Bell className="w-3 h-3 mr-1" />}
                                {channel === 'in_app' && <MessageSquare className="w-3 h-3 mr-1" />}
                                {channel}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                            {notification.status === 'draft' ? 'Draft' :
                             notification.status === 'scheduled' ? 'Terjadwal' :
                             notification.status === 'sent' ? 'Terkirim' : 'Gagal'}
                          </span>
                          {notification.scheduled_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(notification.scheduled_at).toLocaleString('id-ID')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{notification.read_count} dibaca</div>
                            <div className="text-xs">
                              {Math.round((notification.read_count / notification.total_recipients) * 100)}% tingkat baca
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="Lihat Detail"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditNotification(notification)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
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
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      template.type === 'email' ? 'bg-blue-100 text-blue-800' :
                      template.type === 'sms' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {template.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {template.subject && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">Subject:</p>
                    <p className="text-sm text-gray-600">{template.subject}</p>
                  </div>
                )}
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700">Content:</p>
                  <p className="text-sm text-gray-600">{template.content.substring(0, 100)}...</p>
                </div>
                
                {template.variables.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable) => (
                        <span
                          key={variable}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                        >
                          {`{{${variable}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Notifikasi</h3>
            
            <div className="space-y-6">
              {/* Channel Settings */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Channel Notifikasi</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-500">Kirim notifikasi via email</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.email_enabled}
                      onChange={(e) => setSettings({ ...settings, email_enabled: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">SMS</p>
                        <p className="text-sm text-gray-500">Kirim notifikasi via SMS</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.sms_enabled}
                      onChange={(e) => setSettings({ ...settings, sms_enabled: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Push Notification</p>
                        <p className="text-sm text-gray-500">Kirim push notification</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.push_enabled}
                      onChange={(e) => setSettings({ ...settings, push_enabled: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Email Settings */}
              {settings.email_enabled && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Pengaturan Email</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SMTP Host</label>
                      <input
                        type="text"
                        value={settings.email_smtp_host}
                        onChange={(e) => setSettings({ ...settings, email_smtp_host: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SMTP Port</label>
                      <input
                        type="number"
                        value={settings.email_smtp_port}
                        onChange={(e) => setSettings({ ...settings, email_smtp_port: parseInt(e.target.value) })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Email Username</label>
                      <input
                        type="email"
                        value={settings.email_username}
                        onChange={(e) => setSettings({ ...settings, email_username: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SMS Settings */}
              {settings.sms_enabled && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Pengaturan SMS</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SMS Provider</label>
                      <select
                        value={settings.sms_provider}
                        onChange={(e) => setSettings({ ...settings, sms_provider: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="twilio">Twilio</option>
                        <option value="nexmo">Nexmo</option>
                        <option value="local">Local Provider</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">API Key</label>
                      <input
                        type="password"
                        value={settings.sms_api_key}
                        onChange={(e) => setSettings({ ...settings, sms_api_key: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* General Settings */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Pengaturan Umum</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Sender</label>
                  <input
                    type="text"
                    value={settings.default_sender}
                    onChange={(e) => setSettings({ ...settings, default_sender: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={saveSettings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedNotification ? 'Edit Notifikasi' : 'Buat Notifikasi Baru'}
                </h3>
                <button
                  onClick={() => {
                    setShowNotificationModal(false);
                    setSelectedNotification(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Judul</label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Pesan</label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipe</label>
                    <select
                      value={notificationForm.type}
                      onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value as Notification['type'] })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="info">Info</option>
                      <option value="success">Sukses</option>
                      <option value="warning">Peringatan</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prioritas</label>
                    <select
                      value={notificationForm.priority}
                      onChange={(e) => setNotificationForm({ ...notificationForm, priority: e.target.value as Notification['priority'] })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Rendah</option>
                      <option value="medium">Sedang</option>
                      <option value="high">Tinggi</option>
                      <option value="urgent">Mendesak</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Penerima</label>
                  <select
                    value={notificationForm.recipient_type}
                    onChange={(e) => setNotificationForm({ ...notificationForm, recipient_type: e.target.value as Notification['recipient_type'] })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Semua Pengguna</option>
                    <option value="role">Berdasarkan Peran</option>
                    <option value="individual">Individual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
                  <div className="space-y-2">
                    {['email', 'sms', 'push', 'in_app'].map((channel) => (
                      <div key={channel} className="flex items-center">
                        <input
                          type="checkbox"
                          id={channel}
                          checked={notificationForm.channels.includes(channel as any)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNotificationForm({
                                ...notificationForm,
                                channels: [...notificationForm.channels, channel as any]
                              });
                            } else {
                              setNotificationForm({
                                ...notificationForm,
                                channels: notificationForm.channels.filter(c => c !== channel)
                              });
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={channel} className="ml-2 block text-sm text-gray-900 capitalize">
                          {channel === 'in_app' ? 'In-App' : channel}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Jadwal Kirim (opsional)</label>
                  <input
                    type="datetime-local"
                    value={notificationForm.scheduled_at}
                    onChange={(e) => setNotificationForm({ ...notificationForm, scheduled_at: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotificationModal(false);
                      setSelectedNotification(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {selectedNotification ? 'Perbarui' : 'Kirim'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedTemplate ? 'Edit Template' : 'Buat Template Baru'}
                </h3>
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setSelectedTemplate(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleTemplateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Template</label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipe</label>
                  <select
                    value={templateForm.type}
                    onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value as Template['type'] })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push Notification</option>
                  </select>
                </div>

                {templateForm.type === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input
                      type="text"
                      value={templateForm.subject}
                      onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Gunakan {{variable}} untuk variabel dinamis"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={templateForm.content}
                    onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                    rows={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Gunakan {{variable}} untuk variabel dinamis"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Variables (pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={templateForm.variables.join(', ')}
                    onChange={(e) => setTemplateForm({ 
                      ...templateForm, 
                      variables: e.target.value.split(',').map(v => v.trim()).filter(Boolean)
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="recipient_name, task_name, deadline_date"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplateModal(false);
                      setSelectedTemplate(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {selectedTemplate ? 'Perbarui' : 'Simpan'}
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