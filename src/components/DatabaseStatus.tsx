import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertTriangle, RefreshCw, Settings, Info } from 'lucide-react';
import { ApiService } from '../lib/api';
import { supabase } from '../lib/supabase';

interface DatabaseStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
}

export const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ onStatusChange }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'demo' | 'error' | 'warning'>('checking');
  const [message, setMessage] = useState('Memeriksa koneksi database...');
  const [details, setDetails] = useState<string[]>([]);
  const [mode, setMode] = useState<'supabase' | 'demo'>('demo');

  const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return url && key && 
           url !== 'your_supabase_project_url' && 
           key !== 'your_supabase_anon_key' &&
           url !== 'https://dummy.supabase.co';
  };

  const checkDatabaseConnection = async () => {
    setStatus('checking');
    setMessage('Memeriksa koneksi database...');
    setDetails([]);

    // Check if Supabase is configured
    const configured = isSupabaseConfigured();
    
    if (!configured) {
      // Running in demo mode
      setStatus('demo');
      setMode('demo');
      setMessage('Aplikasi berjalan dalam mode demo');
      setDetails([
        '⚠️ Supabase belum dikonfigurasi',
        '📊 Menggunakan data demo untuk testing',
        '✓ Semua fitur dapat digunakan',
        '💡 Lihat SETUP_SUPABASE_GUIDE.md untuk konfigurasi'
      ]);
      onStatusChange?.(true);
      return;
    }

    setMode('supabase');

    try {
      // Test basic Supabase connection
      const { data: healthCheck, error: healthError } = await supabase
        .from('user_profiles')
        .select('count', { count: 'exact', head: true });

      if (healthError) {
        throw healthError;
      }

      // Test API service methods
      const testResults = [];
      
      try {
        const kertasKerjaData = await ApiService.getKertasKerjaPerubahan({ tahun: new Date().getFullYear() });
        testResults.push(`✓ Kertas Kerja Perubahan: ${kertasKerjaData.length} records`);
      } catch (error: any) {
        testResults.push(`✗ Kertas Kerja Perubahan: ${error.message}`);
      }

      try {
        const bidangData = await ApiService.getBidang();
        testResults.push(`✓ Bidang: ${bidangData.length} records`);
      } catch (error: any) {
        testResults.push(`✗ Bidang: ${error.message}`);
      }

      try {
        const standarData = await ApiService.getStandar();
        testResults.push(`✓ Standar: ${standarData.length} records`);
      } catch (error: any) {
        testResults.push(`✗ Standar: ${error.message}`);
      }

      try {
        const giatData = await ApiService.getGiat();
        testResults.push(`✓ Giat: ${giatData.length} records`);
      } catch (error: any) {
        testResults.push(`✗ Giat: ${error.message}`);
      }

      try {
        const danaData = await ApiService.getDana();
        testResults.push(`✓ Dana: ${danaData.length} records`);
      } catch (error: any) {
        testResults.push(`✗ Dana: ${error.message}`);
      }

      try {
        const rekeningData = await ApiService.getRekening();
        testResults.push(`✓ Rekening: ${rekeningData.length} records`);
      } catch (error: any) {
        testResults.push(`✗ Rekening: ${error.message}`);
      }

      try {
        const komponenData = await ApiService.getKomponen();
        testResults.push(`✓ Komponen: ${komponenData.length} records`);
      } catch (error: any) {
        testResults.push(`✗ Komponen: ${error.message}`);
      }

      setDetails(testResults);

      const failedTests = testResults.filter(result => result.includes('✗'));
      
      if (failedTests.length === 0) {
        setStatus('connected');
        setMessage('Database Supabase terhubung dengan baik');
        onStatusChange?.(true);
      } else if (failedTests.length < testResults.length) {
        setStatus('warning');
        setMessage(`Database terhubung dengan ${failedTests.length} masalah`);
        onStatusChange?.(true);
      } else {
        setStatus('error');
        setMessage('Tidak dapat terhubung ke database');
        onStatusChange?.(false);
      }

    } catch (error: any) {
      console.error('Database connection error:', error);
      setStatus('error');
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch failed')) {
        setMessage('Tidak dapat terhubung ke server Supabase');
        setDetails([
          '❌ Koneksi ke Supabase gagal',
          '🔧 Periksa kredensial di file .env',
          '🌐 Pastikan koneksi internet stabil',
          '📋 Lihat SETUP_SUPABASE_GUIDE.md untuk bantuan'
        ]);
      } else if (error.message?.includes('JWT')) {
        setMessage('Masalah autentikasi Supabase');
        setDetails([
          '🔑 Token autentikasi tidak valid',
          '⚙️ Periksa VITE_SUPABASE_ANON_KEY di .env',
          '🔄 Restart development server setelah update .env'
        ]);
      } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        setMessage('Tabel database tidak ditemukan');
        setDetails([
          '🗄️ Database belum diinisialisasi',
          '⚡ Jalankan: node fix-database-comprehensive.js',
          '📋 Atau setup manual via Supabase dashboard'
        ]);
      } else {
        setMessage(`Error: ${error.message}`);
        setDetails([
          `❌ ${error.message}`,
          '📋 Lihat SETUP_SUPABASE_GUIDE.md untuk solusi'
        ]);
      }
      
      onStatusChange?.(false);
    }
  };

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'demo':
        return <Info className="w-5 h-5 text-orange-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'border-blue-200 bg-blue-50';
      case 'connected':
        return 'border-green-200 bg-green-50';
      case 'demo':
        return 'border-orange-200 bg-orange-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  const getModeIndicator = () => {
    if (mode === 'demo') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <Database className="w-3 h-3 mr-1" />
          Mode Demo
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Database className="w-3 h-3 mr-1" />
          Supabase
        </span>
      );
    }
  };

  // Hide error status display
  if (status === 'error') {
    return null;
  }

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium text-gray-900">Status Database</span>
          {getModeIndicator()}
        </div>
        <button
          onClick={checkDatabaseConnection}
          disabled={status === 'checking'}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center space-x-1"
        >
          <RefreshCw className={`w-3 h-3 ${status === 'checking' ? 'animate-spin' : ''}`} />
          <span>Periksa Ulang</span>
        </button>
      </div>
      
      <p className="text-sm text-gray-700 mb-2">{message}</p>
      
      {status === 'demo' && (
        <div className="bg-orange-100 border border-orange-200 rounded-md p-3 mb-2">
          <div className="flex items-start space-x-2">
            <Settings className="w-4 h-4 text-orange-600 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-medium">Konfigurasi Supabase Diperlukan</p>
              <p className="mt-1">Untuk menggunakan database real, konfigurasikan kredensial Supabase di file .env</p>
            </div>
          </div>
        </div>
      )}
      
      {details.length > 0 && (
        <div className="text-xs text-gray-600">
          <details className="cursor-pointer">
            <summary className="font-medium hover:text-gray-800">Detail Status</summary>
            <ul className="mt-2 space-y-1 ml-4">
              {details.map((detail, index) => (
                <li key={index} className="font-mono text-xs">
                  {detail}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;