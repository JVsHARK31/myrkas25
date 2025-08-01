import React, { useState, useEffect } from 'react';
import { 
  Activity, TrendingUp, TrendingDown, Users, 
  DollarSign, FileText, Calendar, Clock,
  BarChart3, PieChart, LineChart, Download,
  Filter, RefreshCw, AlertTriangle, CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  totalBudget: number;
  totalRealization: number;
  totalUsers: number;
  totalActivities: number;
  budgetTrend: number;
  realizationTrend: number;
  monthlyData: Array<{
    month: string;
    budget: number;
    realization: number;
  }>;
  departmentData: Array<{
    name: string;
    budget: number;
    realization: number;
    percentage: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    user: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
  }>;
}

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, selectedDepartment]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Simulate loading analytics data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        totalBudget: 2500000000,
        totalRealization: 1875000000,
        totalUsers: 45,
        totalActivities: 128,
        budgetTrend: 12.5,
        realizationTrend: 8.3,
        monthlyData: [
          { month: 'Jan', budget: 200000000, realization: 180000000 },
          { month: 'Feb', budget: 220000000, realization: 195000000 },
          { month: 'Mar', budget: 210000000, realization: 185000000 },
          { month: 'Apr', budget: 230000000, realization: 205000000 },
          { month: 'May', budget: 240000000, realization: 220000000 },
          { month: 'Jun', budget: 250000000, realization: 235000000 },
        ],
        departmentData: [
          { name: 'Akademik', budget: 800000000, realization: 720000000, percentage: 32 },
          { name: 'Sarana Prasarana', budget: 600000000, realization: 540000000, percentage: 24 },
          { name: 'Keuangan', budget: 400000000, realization: 350000000, percentage: 16 },
          { name: 'Administrasi', budget: 350000000, realization: 315000000, percentage: 14 },
          { name: 'Humas', budget: 200000000, realization: 180000000, percentage: 8 },
          { name: 'IT', budget: 150000000, realization: 135000000, percentage: 6 },
        ],
        recentActivities: [
          {
            id: '1',
            type: 'budget_update',
            description: 'Budget Akademik diperbarui',
            user: 'Admin',
            timestamp: '2024-01-15T10:30:00Z',
            status: 'success'
          },
          {
            id: '2',
            type: 'realization_add',
            description: 'Realisasi Sarana Prasarana ditambahkan',
            user: 'Manager',
            timestamp: '2024-01-15T09:15:00Z',
            status: 'success'
          },
          {
            id: '3',
            type: 'budget_warning',
            description: 'Budget IT mendekati batas',
            user: 'System',
            timestamp: '2024-01-15T08:45:00Z',
            status: 'warning'
          },
          {
            id: '4',
            type: 'user_login',
            description: 'User baru login',
            user: 'Staff',
            timestamp: '2024-01-15T08:00:00Z',
            status: 'success'
          }
        ]
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'budget_update': return <FileText size={16} className="text-blue-600" />;
      case 'realization_add': return <DollarSign size={16} className="text-green-600" />;
      case 'budget_warning': return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'user_login': return <Users size={16} className="text-purple-600" />;
      default: return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Gagal memuat data analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600">Analisis mendalam tentang kinerja keuangan</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="quarter">Kuartal Ini</option>
            <option value="year">Tahun Ini</option>
          </select>
          <button
            onClick={loadAnalyticsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(data.totalBudget)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{data.budgetTrend}%</span>
            <span className="text-sm text-gray-500 ml-2">dari bulan lalu</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Realisasi</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(data.totalRealization)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{data.realizationTrend}%</span>
            <span className="text-sm text-gray-500 ml-2">dari bulan lalu</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalUsers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-500">Aktif bulan ini</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Aktivitas</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalActivities}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-500">Transaksi bulan ini</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tren Bulanan</h3>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {data.monthlyData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{item.month}</span>
                <div className="flex space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-blue-600">Budget</div>
                    <div className="text-sm font-medium">{formatCurrency(item.budget)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600">Realisasi</div>
                    <div className="text-sm font-medium">{formatCurrency(item.realization)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Distribusi per Departemen</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {data.departmentData.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                  <span className="text-sm text-gray-500">{dept.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Budget: {formatCurrency(dept.budget)}</span>
                  <span>Realisasi: {formatCurrency(dept.realization)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Lihat Semua
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">oleh {activity.user}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                <div className={`flex-shrink-0 ${getStatusColor(activity.status)}`}>
                  {activity.status === 'success' && <CheckCircle size={16} />}
                  {activity.status === 'warning' && <AlertTriangle size={16} />}
                  {activity.status === 'error' && <AlertTriangle size={16} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Download size={16} />
            <span>Export Excel</span>
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2">
            <Download size={16} />
            <span>Export PDF</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};