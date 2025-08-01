import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Bell, Shield, Database, 
  Mail, Globe, Palette, Lock, User, 
  Monitor, Smartphone, Tablet, Eye, EyeOff
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface SystemSettings {
  id: string;
  app_name: string;
  app_description: string;
  app_logo?: string;
  theme_color: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  backup_frequency: string;
  max_file_size: number;
  allowed_file_types: string[];
  session_timeout: number;
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
  };
  maintenance_mode: boolean;
  api_rate_limit: number;
  created_at: string;
  updated_at: string;
}

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    id: '1',
    app_name: 'R-KAS',
    app_description: 'Sistem Manajemen Rencana Kas Sekolah',
    theme_color: '#2563eb',
    email_notifications: true,
    sms_notifications: false,
    backup_frequency: 'daily',
    max_file_size: 10,
    allowed_file_types: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png'],
    session_timeout: 30,
    password_policy: {
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: false
    },
    maintenance_mode: false,
    api_rate_limit: 1000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Umum', icon: Settings },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'appearance', label: 'Tampilan', icon: Palette }
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Simulate saving to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings({
        ...settings,
        updated_at: new Date().toISOString()
      });
      
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Aplikasi
        </label>
        <input
          type="text"
          value={settings.app_name}
          onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi Aplikasi
        </label>
        <textarea
          value={settings.app_description}
          onChange={(e) => setSettings({ ...settings, app_description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timeout Sesi (menit)
        </label>
        <input
          type="number"
          value={settings.session_timeout}
          onChange={(e) => setSettings({ ...settings, session_timeout: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ukuran File Maksimal (MB)
        </label>
        <input
          type="number"
          value={settings.max_file_size}
          onChange={(e) => setSettings({ ...settings, max_file_size: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Mode Maintenance</label>
          <p className="text-sm text-gray-500">Aktifkan untuk menonaktifkan akses pengguna</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.maintenance_mode}
            onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Notifikasi Email</label>
          <p className="text-sm text-gray-500">Terima notifikasi melalui email</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.email_notifications}
            onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Notifikasi SMS</label>
          <p className="text-sm text-gray-500">Terima notifikasi melalui SMS</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.sms_notifications}
            onChange={(e) => setSettings({ ...settings, sms_notifications: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Kebijakan Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Panjang Minimum
            </label>
            <input
              type="number"
              value={settings.password_policy.min_length}
              onChange={(e) => setSettings({
                ...settings,
                password_policy: {
                  ...settings.password_policy,
                  min_length: parseInt(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-3">
            {[
              { key: 'require_uppercase', label: 'Wajib huruf besar' },
              { key: 'require_lowercase', label: 'Wajib huruf kecil' },
              { key: 'require_numbers', label: 'Wajib angka' },
              { key: 'require_symbols', label: 'Wajib simbol' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.password_policy[key as keyof typeof settings.password_policy] as boolean}
                    onChange={(e) => setSettings({
                      ...settings,
                      password_policy: {
                        ...settings.password_policy,
                        [key]: e.target.checked
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate Limit API (per jam)
        </label>
        <input
          type="number"
          value={settings.api_rate_limit}
          onChange={(e) => setSettings({ ...settings, api_rate_limit: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frekuensi Backup
        </label>
        <select
          value={settings.backup_frequency}
          onChange={(e) => setSettings({ ...settings, backup_frequency: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="hourly">Setiap Jam</option>
          <option value="daily">Harian</option>
          <option value="weekly">Mingguan</option>
          <option value="monthly">Bulanan</option>
        </select>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Status Backup Terakhir</h4>
        <p className="text-sm text-blue-700">
          Backup terakhir: {new Date().toLocaleDateString('id-ID')} pukul {new Date().toLocaleTimeString('id-ID')}
        </p>
        <p className="text-sm text-blue-700">Status: Berhasil</p>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
          Backup Manual
        </button>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Warna Tema
        </label>
        <div className="flex space-x-3">
          {[
            '#2563eb', '#dc2626', '#059669', '#d97706', 
            '#7c3aed', '#db2777', '#0891b2', '#65a30d'
          ].map((color) => (
            <button
              key={color}
              onClick={() => setSettings({ ...settings, theme_color: color })}
              className={`w-8 h-8 rounded-full border-2 ${
                settings.theme_color === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipe File yang Diizinkan
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png', 'gif', 'zip'].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.allowed_file_types.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSettings({
                      ...settings,
                      allowed_file_types: [...settings.allowed_file_types, type]
                    });
                  } else {
                    setSettings({
                      ...settings,
                      allowed_file_types: settings.allowed_file_types.filter(t => t !== type)
                    });
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">.{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
          <p className="text-gray-600">Kelola konfigurasi dan preferensi sistem</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save size={16} />
          )}
          <span>Simpan Pengaturan</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'backup' && renderBackupSettings()}
          {activeTab === 'appearance' && renderAppearanceSettings()}
        </div>
      </div>
    </div>
  );
};