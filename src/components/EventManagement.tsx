import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, 
  Search, Filter, Eye, CheckCircle, XCircle, AlertCircle,
  User, Mail, Phone, FileText, Download, Upload
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  type: 'meeting' | 'training' | 'event' | 'deadline' | 'holiday';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  organizer: string;
  participants: string[];
  max_participants?: number;
  is_public: boolean;
  created_by: string;
  created_at: string;
  attachments?: string[];
  reminder_minutes?: number;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  status: 'invited' | 'accepted' | 'declined' | 'tentative';
}

export const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    location: '',
    type: 'meeting' as Event['type'],
    organizer: '',
    max_participants: '',
    is_public: true,
    reminder_minutes: 30
  });

  const mockParticipants: Participant[] = [
    { id: '1', name: 'Admin User', email: 'admin@rkas.com', phone: '081234567890', department: 'Administrasi', status: 'accepted' },
    { id: '2', name: 'Manager Keuangan', email: 'manager@rkas.com', phone: '081234567891', department: 'Keuangan', status: 'accepted' },
    { id: '3', name: 'Staff IT', email: 'it@rkas.com', phone: '081234567892', department: 'IT', status: 'invited' },
    { id: '4', name: 'Kepala Sekolah', email: 'kepsek@rkas.com', phone: '081234567893', department: 'Kepala Sekolah', status: 'tentative' }
  ];

  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Rapat Evaluasi Anggaran Q1',
      description: 'Evaluasi pelaksanaan anggaran kuartal pertama dan perencanaan kuartal kedua',
      start_date: '2024-02-15',
      end_date: '2024-02-15',
      start_time: '09:00',
      end_time: '11:00',
      location: 'Ruang Rapat Utama',
      type: 'meeting',
      status: 'scheduled',
      organizer: 'Manager Keuangan',
      participants: ['1', '2', '4'],
      max_participants: 10,
      is_public: false,
      created_by: 'admin',
      created_at: '2024-01-15T10:30:00Z',
      reminder_minutes: 30
    },
    {
      id: '2',
      title: 'Pelatihan Sistem RKAS',
      description: 'Pelatihan penggunaan sistem RKAS untuk staff baru',
      start_date: '2024-02-20',
      end_date: '2024-02-20',
      start_time: '13:00',
      end_time: '16:00',
      location: 'Lab Komputer',
      type: 'training',
      status: 'scheduled',
      organizer: 'Staff IT',
      participants: ['1', '3'],
      max_participants: 20,
      is_public: true,
      created_by: 'admin',
      created_at: '2024-01-16T14:20:00Z',
      reminder_minutes: 60
    },
    {
      id: '3',
      title: 'Deadline Laporan Bulanan',
      description: 'Batas waktu pengumpulan laporan keuangan bulanan',
      start_date: '2024-02-28',
      end_date: '2024-02-28',
      start_time: '17:00',
      end_time: '17:00',
      location: 'Online',
      type: 'deadline',
      status: 'scheduled',
      organizer: 'System',
      participants: ['1', '2'],
      is_public: true,
      created_by: 'system',
      created_at: '2024-01-01T00:00:00Z',
      reminder_minutes: 1440 // 24 hours
    }
  ];

  useEffect(() => {
    loadEvents();
    setParticipants(mockParticipants);
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Simulate loading from Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(mockEvents);
    } catch (error) {
      toast.error('Gagal memuat acara');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: Event['type']) => {
    const colors = {
      meeting: 'bg-blue-100 text-blue-800',
      training: 'bg-green-100 text-green-800',
      event: 'bg-purple-100 text-purple-800',
      deadline: 'bg-red-100 text-red-800',
      holiday: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type];
  };

  const getStatusColor = (status: Event['status']) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getStatusIcon = (status: Event['status']) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'ongoing': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...eventForm,
        max_participants: eventForm.max_participants ? parseInt(eventForm.max_participants) : undefined,
        participants: [],
        status: 'scheduled',
        created_by: 'current_user',
        created_at: new Date().toISOString()
      };

      if (selectedEvent) {
        setEvents(events.map(event => event.id === selectedEvent.id ? { ...newEvent, id: selectedEvent.id } : event));
        toast.success('Acara berhasil diperbarui');
      } else {
        setEvents([newEvent, ...events]);
        toast.success('Acara berhasil dibuat');
      }

      setShowEventModal(false);
      setSelectedEvent(null);
      setEventForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        location: '',
        type: 'meeting',
        organizer: '',
        max_participants: '',
        is_public: true,
        reminder_minutes: 30
      });
    } catch (error) {
      toast.error('Gagal menyimpan acara');
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      type: event.type,
      organizer: event.organizer,
      max_participants: event.max_participants?.toString() || '',
      is_public: event.is_public,
      reminder_minutes: event.reminder_minutes || 30
    });
    setShowEventModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus acara ini?')) {
      try {
        setEvents(events.filter(event => event.id !== id));
        toast.success('Acara berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus acara');
      }
    }
  };

  const getParticipantNames = (participantIds: string[]) => {
    return participantIds
      .map(id => participants.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Acara</h1>
          <p className="text-gray-600">Kelola jadwal dan acara sekolah</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Daftar
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Kalender
            </button>
          </div>
          <button
            onClick={() => setShowEventModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Tambah Acara</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Acara</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terjadwal</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Berlangsung</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'ongoing').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Peserta</p>
              <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
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
                placeholder="Cari acara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Tipe</option>
              <option value="meeting">Rapat</option>
              <option value="training">Pelatihan</option>
              <option value="event">Acara</option>
              <option value="deadline">Deadline</option>
              <option value="holiday">Libur</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="scheduled">Terjadwal</option>
              <option value="ongoing">Berlangsung</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acara
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peserta
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
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada acara ditemukan
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.description}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(event.type)}`}>
                            {event.type === 'meeting' ? 'Rapat' :
                             event.type === 'training' ? 'Pelatihan' :
                             event.type === 'event' ? 'Acara' :
                             event.type === 'deadline' ? 'Deadline' : 'Libur'}
                          </span>
                          {!event.is_public && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Privat
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{formatDateTime(event.start_date, event.start_time)}</div>
                        {event.start_date !== event.end_date && (
                          <div className="text-gray-500">
                            s/d {formatDateTime(event.end_date, event.end_time)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{event.participants.length} peserta</div>
                        {event.max_participants && (
                          <div className="text-xs">
                            Maks: {event.max_participants}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                        {getStatusIcon(event.status)}
                        <span className="ml-1">
                          {event.status === 'scheduled' ? 'Terjadwal' :
                           event.status === 'ongoing' ? 'Berlangsung' :
                           event.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                        </span>
                      </span>
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
                          onClick={() => handleEdit(event)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
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

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedEvent ? 'Edit Acara' : 'Tambah Acara Baru'}
                </h3>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Judul Acara</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={eventForm.start_date}
                      onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                    <input
                      type="date"
                      value={eventForm.end_date}
                      onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Waktu Mulai</label>
                    <input
                      type="time"
                      value={eventForm.start_time}
                      onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Waktu Selesai</label>
                    <input
                      type="time"
                      value={eventForm.end_time}
                      onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipe Acara</label>
                    <select
                      value={eventForm.type}
                      onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as Event['type'] })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="meeting">Rapat</option>
                      <option value="training">Pelatihan</option>
                      <option value="event">Acara</option>
                      <option value="deadline">Deadline</option>
                      <option value="holiday">Libur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Penyelenggara</label>
                    <input
                      type="text"
                      value={eventForm.organizer}
                      onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Maksimal Peserta</label>
                    <input
                      type="number"
                      value={eventForm.max_participants}
                      onChange={(e) => setEventForm({ ...eventForm, max_participants: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pengingat (menit sebelumnya)</label>
                    <select
                      value={eventForm.reminder_minutes}
                      onChange={(e) => setEventForm({ ...eventForm, reminder_minutes: parseInt(e.target.value) })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={15}>15 menit</option>
                      <option value={30}>30 menit</option>
                      <option value={60}>1 jam</option>
                      <option value={1440}>1 hari</option>
                      <option value={10080}>1 minggu</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_public"
                        checked={eventForm.is_public}
                        onChange={(e) => setEventForm({ ...eventForm, is_public: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">
                        Acara publik (dapat dilihat semua pengguna)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false);
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {selectedEvent ? 'Perbarui' : 'Simpan'}
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