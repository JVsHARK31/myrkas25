import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type BudgetItem = Database['public']['Tables']['budget_items']['Row'];
type ActivityItem = Database['public']['Tables']['activities']['Row'];

interface DataContextType {
  budgetItems: BudgetItem[];
  activities: ActivityItem[];
  loading: boolean;
  tablesExist: boolean;
  setupError: string | null;
  refreshData: () => Promise<void>;
  addBudgetItem: (item: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => Promise<void>;
  deleteBudgetItem: (id: string) => Promise<void>;
  addActivity: (activity: Omit<ActivityItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateActivity: (id: string, updates: Partial<ActivityItem>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  importCSVData: (data: any[]) => Promise<void>;
  exportCSVData: () => Promise<string>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tablesExist, setTablesExist] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setSetupError(null);
    try {
      // Check if tables exist by attempting to query them
      const budgetResponse = await supabase
        .from('budget_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      const activitiesResponse = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      // Check if both tables exist
      const budgetTableExists = !budgetResponse.error || budgetResponse.error.code !== '42P01';
      const activitiesTableExists = !activitiesResponse.error || activitiesResponse.error.code !== '42P01';
      
      if (budgetTableExists && activitiesTableExists) {
        setTablesExist(true);
        // Fetch all data
        const fullBudgetResponse = await supabase
          .from('budget_items')
          .select('*')
          .order('created_at', { ascending: false });
          
        const fullActivitiesResponse = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (fullBudgetResponse.data) setBudgetItems(fullBudgetResponse.data);
        if (fullActivitiesResponse.data) setActivities(fullActivitiesResponse.data);
      } else {
        setTablesExist(false);
        setBudgetItems([]);
        setActivities([]);
        setSetupError('Database tables not found. Please run the database setup SQL in your Supabase SQL Editor.');
      }
    } catch (error) {
      console.error('Database connection error:', error);
      setTablesExist(false);
      setBudgetItems([]);
      setActivities([]);
      setSetupError('Database connection failed. Please check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addBudgetItem = async (item: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>) => {
    if (!tablesExist) {
      throw new Error('Database tables not found. Please run the database setup first.');
    }
    const { data, error } = await supabase.from('budget_items').insert(item).select().single();
    if (error) throw error;
    setBudgetItems(prev => [data, ...prev]);
  };

  const updateBudgetItem = async (id: string, updates: Partial<BudgetItem>) => {
    if (!tablesExist) {
      throw new Error('Database tables not found. Please run the database setup first.');
    }
    const { data, error } = await supabase
      .from('budget_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setBudgetItems(prev => prev.map(item => item.id === id ? data : item));
  };

  const deleteBudgetItem = async (id: string) => {
    if (!tablesExist) {
      throw new Error('Database tables not found. Please run the database setup first.');
    }
    const { error } = await supabase.from('budget_items').delete().eq('id', id);
    if (error) throw error;
    setBudgetItems(prev => prev.filter(item => item.id !== id));
  };

  const addActivity = async (activity: Omit<ActivityItem, 'id' | 'created_at' | 'updated_at'>) => {
    if (!tablesExist) {
      throw new Error('Database tables not found. Please run the database setup first.');
    }
    const { data, error } = await supabase.from('activities').insert(activity).select().single();
    if (error) throw error;
    setActivities(prev => [data, ...prev]);
  };

  const updateActivity = async (id: string, updates: Partial<ActivityItem>) => {
    if (!tablesExist) {
      throw new Error('Database tables not found. Please run the database setup first.');
    }
    const { data, error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setActivities(prev => prev.map(activity => activity.id === id ? data : activity));
  };

  const deleteActivity = async (id: string) => {
    if (!tablesExist) {
      throw new Error('Database tables not found. Please run the database setup first.');
    }
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) throw error;
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const importCSVData = async (data: any[]) => {
    if (!tablesExist) {
      throw new Error('Database tables not found. Please run the database setup first.');
    }
    const budgetItemsToInsert = data.map(row => ({
      kode_bidang: row.KODE_BIDANG || '',
      nama_bidang: row.NAMA_BIDANG || '',
      kode_standar: row.KODE_STANDAR || '',
      nama_standar: row.NAMA_STANDAR || '',
      kode_giat: row.KODE_GIAT || '',
      nama_giat: row.NAMA_GIAT || '',
      kode_dana: row.KODE_DANA || '',
      nama_dana: row.NAMA_DANA || '',
      kode_rekening: row.KODE_REKENING || '',
      nama_rekening: row.NAMA_REKENING || '',
      nama_komponen: row.NAMA_KOMPONEN || '',
      satuan: row.SATUAN || '',
      volume: parseFloat(row.VOLUME) || 0,
      harga_satuan: parseFloat(row.HARGA_SATUAN) || 0,
      nilai_rincian: parseFloat(row.NILAI_RINCIAN) || 0,
      bulan_1: parseFloat(row.BULAN_1) || 0,
      bulan_2: parseFloat(row.BULAN_2) || 0,
      bulan_3: parseFloat(row.BULAN_3) || 0,
      bulan_4: parseFloat(row.BULAN_4) || 0,
      bulan_5: parseFloat(row.BULAN_5) || 0,
      bulan_6: parseFloat(row.BULAN_6) || 0,
      bulan_7: parseFloat(row.BULAN_7) || 0,
      bulan_8: parseFloat(row.BULAN_8) || 0,
      bulan_9: parseFloat(row.BULAN_9) || 0,
      bulan_10: parseFloat(row.BULAN_10) || 0,
      bulan_11: parseFloat(row.BULAN_11) || 0,
      bulan_12: parseFloat(row.BULAN_12) || 0,
      total_akb: parseFloat(row.Total_AKB) || 0,
      total_realisasi: parseFloat(row.Total_REALISASI) || 0,
      status: 'active',
      period_year: new Date().getFullYear(),
    }));

    const { error } = await supabase.from('budget_items').insert(budgetItemsToInsert);
    if (error) throw error;
    await refreshData();
  };

  const exportCSVData = async () => {
    if (!tablesExist) {
      throw new Error('Database tables not found. Please run the database setup first.');
    }
    const headers = [
      'KODE_BIDANG', 'NAMA_BIDANG', 'KODE_STANDAR', 'NAMA_STANDAR',
      'KODE_GIAT', 'NAMA_GIAT', 'KODE_DANA', 'NAMA_DANA',
      'KODE_REKENING', 'NAMA_REKENING', 'NAMA_KOMPONEN', 'SATUAN',
      'VOLUME', 'HARGA_SATUAN', 'NILAI_RINCIAN',
      'BULAN_1', 'BULAN_2', 'BULAN_3', 'BULAN_4', 'BULAN_5', 'BULAN_6',
      'BULAN_7', 'BULAN_8', 'BULAN_9', 'BULAN_10', 'BULAN_11', 'BULAN_12',
      'Total_AKB', 'Total_REALISASI'
    ];

    const csvContent = [
      headers.join(','),
      ...budgetItems.map(item => [
        item.kode_bidang, item.nama_bidang, item.kode_standar, item.nama_standar,
        item.kode_giat, item.nama_giat, item.kode_dana, item.nama_dana,
        item.kode_rekening, item.nama_rekening, item.nama_komponen, item.satuan,
        item.volume, item.harga_satuan, item.nilai_rincian,
        item.bulan_1, item.bulan_2, item.bulan_3, item.bulan_4, item.bulan_5, item.bulan_6,
        item.bulan_7, item.bulan_8, item.bulan_9, item.bulan_10, item.bulan_11, item.bulan_12,
        item.total_akb, item.total_realisasi
      ].join(','))
    ].join('\n');

    return csvContent;
  };

  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  const value = {
    budgetItems,
    activities,
    loading,
    tablesExist,
    setupError,
    refreshData,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    addActivity,
    updateActivity,
    deleteActivity,
    importCSVData,
    exportCSVData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}