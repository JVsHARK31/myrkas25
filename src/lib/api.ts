import { supabase } from './supabase'
import { 
  KertasKerjaPerubahan, KertasKerjaPerubahanInsert, KertasKerjaPerubahanUpdate, 
  FilterOptions, SummaryData, PeriodData,
  User, UserInsert, UserUpdate,
  Student, StudentInsert, StudentUpdate,
  Inventory, InventoryInsert, InventoryUpdate,
  Event, EventInsert, EventUpdate,
  Document, DocumentInsert, DocumentUpdate,
  Notification, NotificationInsert, NotificationUpdate,
  Activity, ActivityInsert, ActivityUpdate,
  Setting, SettingInsert, SettingUpdate,
  AuditLog, AuditLogInsert,
  Bidang, BidangInsert, BidangUpdate,
  Standar, StandarInsert, StandarUpdate,
  Giat, GiatInsert, GiatUpdate,
  Dana, DanaInsert, DanaUpdate,
  Rekening, RekeningInsert, RekeningUpdate,
  Komponen, KomponenInsert, KomponenUpdate
} from '../types/database'

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && 
         url !== 'your_supabase_project_url' && 
         key !== 'your_supabase_anon_key' &&
         url !== 'https://dummy.supabase.co';
};

// LocalStorage helper functions for persistent data storage
const STORAGE_KEYS = {
  KERTAS_KERJA_PERUBAHAN: 'rkas_kertas_kerja_perubahan',
  BIDANG: 'rkas_bidang',
  STANDAR: 'rkas_standar',
  GIAT: 'rkas_giat',
  DANA: 'rkas_dana',
  REKENING: 'rkas_rekening',
  KOMPONEN: 'rkas_komponen'
};

const getFromStorage = (key: string, defaultValue: any[] = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn('Error reading from localStorage:', error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Error saving to localStorage:', error);
  }
};

const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Demo data for fallback
const demoData = {
  kertas_kerja_perubahan: [
    {
      id: '1',
      kode_bidang: '01',
      nama_bidang: 'Bidang Pendidikan',
      kode_standar: '01.01',
      nama_standar: 'Standar Pelayanan Pendidikan',
      kode_giat: '01.01.01',
      nama_giat: 'Penyelenggaraan Pendidikan Dasar',
      kode_dana: 'DAK',
      nama_dana: 'Dana Alokasi Khusus',
      kode_rekening: '5.1.1',
      nama_rekening: 'Belanja Pegawai',
      kode_komponen: '5.1.1.01',
      nama_komponen: 'Gaji dan Tunjangan',
      total_akb: 1000000000,
      total_realisasi: 750000000,
      bulan_1: 83333333,
      bulan_2: 83333333,
      bulan_3: 83333333,
      bulan_4: 83333333,
      bulan_5: 83333333,
      bulan_6: 83333333,
      bulan_7: 83333333,
      bulan_8: 83333333,
      bulan_9: 83333333,
      bulan_10: 83333333,
      bulan_11: 83333333,
      bulan_12: 83333333,
      tw_1: 250000000,
      tw_2: 250000000,
      tw_3: 250000000,
      tw_4: 250000000,
      realisasi_bulan_1: 62500000,
      realisasi_bulan_2: 62500000,
      realisasi_bulan_3: 62500000,
      realisasi_bulan_4: 62500000,
      realisasi_bulan_5: 62500000,
      realisasi_bulan_6: 62500000,
      realisasi_bulan_7: 62500000,
      realisasi_bulan_8: 62500000,
      realisasi_bulan_9: 62500000,
      realisasi_bulan_10: 62500000,
      realisasi_bulan_11: 62500000,
      realisasi_bulan_12: 62500000,
      realisasi_tw_1: 187500000,
      realisasi_tw_2: 187500000,
      realisasi_tw_3: 187500000,
      realisasi_tw_4: 187500000,
      tahun: 2024,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      kode_bidang: '02',
      nama_bidang: 'Bidang Kesehatan',
      kode_standar: '02.01',
      nama_standar: 'Standar Pelayanan Kesehatan',
      kode_giat: '02.01.01',
      nama_giat: 'Pelayanan Kesehatan Masyarakat',
      kode_dana: 'DAU',
      nama_dana: 'Dana Alokasi Umum',
      kode_rekening: '5.1.2',
      nama_rekening: 'Belanja Barang dan Jasa',
      kode_komponen: '5.1.2.01',
      nama_komponen: 'Belanja Bahan',
      total_akb: 750000000,
      total_realisasi: 600000000,
      bulan_1: 62500000,
      bulan_2: 62500000,
      bulan_3: 62500000,
      bulan_4: 62500000,
      bulan_5: 62500000,
      bulan_6: 62500000,
      bulan_7: 62500000,
      bulan_8: 62500000,
      bulan_9: 62500000,
      bulan_10: 62500000,
      bulan_11: 62500000,
      bulan_12: 62500000,
      tw_1: 187500000,
      tw_2: 187500000,
      tw_3: 187500000,
      tw_4: 187500000,
      realisasi_bulan_1: 50000000,
      realisasi_bulan_2: 50000000,
      realisasi_bulan_3: 50000000,
      realisasi_bulan_4: 50000000,
      realisasi_bulan_5: 50000000,
      realisasi_bulan_6: 50000000,
      realisasi_bulan_7: 50000000,
      realisasi_bulan_8: 50000000,
      realisasi_bulan_9: 50000000,
      realisasi_bulan_10: 50000000,
      realisasi_bulan_11: 50000000,
      realisasi_bulan_12: 50000000,
      realisasi_tw_1: 150000000,
      realisasi_tw_2: 150000000,
      realisasi_tw_3: 150000000,
      realisasi_tw_4: 150000000,
      tahun: 2024,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  bidang: [
    { id: '1', kode: '01', nama: 'Bidang Pendidikan', deskripsi: 'Urusan pendidikan', created_at: new Date().toISOString() },
    { id: '2', kode: '02', nama: 'Bidang Kesehatan', deskripsi: 'Urusan kesehatan', created_at: new Date().toISOString() }
  ],
  standar: [
    { id: '1', kode: '01.01', nama: 'Standar Pelayanan Pendidikan', bidang_id: '1', created_at: new Date().toISOString() },
    { id: '2', kode: '02.01', nama: 'Standar Pelayanan Kesehatan', bidang_id: '2', created_at: new Date().toISOString() }
  ],
  giat: [
    { id: '1', kode: '01.01.01', nama: 'Penyelenggaraan Pendidikan Dasar', standar_id: '1', created_at: new Date().toISOString() },
    { id: '2', kode: '02.01.01', nama: 'Pelayanan Kesehatan Masyarakat', standar_id: '2', created_at: new Date().toISOString() }
  ],
  dana: [
    { id: '1', kode: 'DAK', nama: 'Dana Alokasi Khusus', created_at: new Date().toISOString() },
    { id: '2', kode: 'DAU', nama: 'Dana Alokasi Umum', created_at: new Date().toISOString() }
  ],
  rekening: [
    { id: '1', kode: '5.1.1', nama: 'Belanja Pegawai', created_at: new Date().toISOString() },
    { id: '2', kode: '5.1.2', nama: 'Belanja Barang dan Jasa', created_at: new Date().toISOString() }
  ],
  komponen: [
    { id: '1', kode: '5.1.1.01', nama: 'Gaji dan Tunjangan', rekening_id: '1', created_at: new Date().toISOString() },
    { id: '2', kode: '5.1.2.01', nama: 'Belanja Bahan', rekening_id: '2', created_at: new Date().toISOString() }
  ]
};

export class ApiService {
  // CRUD Operations for Kertas Kerja Perubahan
  static async getKertasKerjaPerubahan(filters?: FilterOptions) {
    // Always try to get data from localStorage first for immediate response
    let localData = getFromStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, demoData.kertas_kerja_perubahan);
    
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('kertas_kerja_perubahan')
          .select('*')
          .order('created_at', { ascending: false })

        if (filters?.tahun) {
          query = query.eq('tahun', filters.tahun)
        }
        if (filters?.bidang) {
          query = query.eq('nama_bidang', filters.bidang)
        }
        if (filters?.standar) {
          query = query.eq('nama_standar', filters.standar)
        }
        if (filters?.giat) {
          query = query.eq('nama_giat', filters.giat)
        }
        if (filters?.dana) {
          query = query.eq('nama_dana', filters.dana)
        }
        if (filters?.rekening) {
          query = query.eq('nama_rekening', filters.rekening)
        }

        const { data, error } = await query

        if (error) throw error
        
        // Update localStorage with fresh data from Supabase
        if (data && data.length > 0) {
          saveToStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, data);
          localData = data;
        }
      } catch (error) {
        console.warn('Supabase error, using localStorage data:', error);
      }
    }
    
    // Apply filters to local data
    let filteredData = [...localData];
    
    if (filters?.tahun) {
      filteredData = filteredData.filter(item => item.tahun === filters.tahun);
    }
    if (filters?.bidang) {
      filteredData = filteredData.filter(item => item.nama_bidang === filters.bidang);
    }
    if (filters?.standar) {
      filteredData = filteredData.filter(item => item.nama_standar === filters.standar);
    }
    if (filters?.giat) {
      filteredData = filteredData.filter(item => item.nama_giat === filters.giat);
    }
    if (filters?.dana) {
      filteredData = filteredData.filter(item => item.nama_dana === filters.dana);
    }
    if (filters?.rekening) {
      filteredData = filteredData.filter(item => item.nama_rekening === filters.rekening);
    }
    
    return filteredData;
  }

  static async getKertasKerjaPerubahanById(id: string) {
    const { data, error } = await supabase
      .from('kertas_kerja_perubahan')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async createKertasKerjaPerubahan(data: KertasKerjaPerubahanInsert) {
    const newItem = {
      id: generateId(),
      ...data,
      tahun: data.tahun || new Date().getFullYear(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!isSupabaseConfigured()) {
      // Use localStorage as persistent storage
      const existingData = getFromStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, demoData.kertas_kerja_perubahan);
      const updatedData = [...existingData, newItem];
      saveToStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, updatedData);
      console.log('LocalStorage mode: Created item', newItem);
      return newItem;
    }

    try {
      const { data: result, error } = await supabase
        .from('kertas_kerja_perubahan')
        .insert(newItem)
        .select()
        .single()

      if (error) throw error
      
      // Also save to localStorage as backup
      const existingData = getFromStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, []);
      const updatedData = [...existingData, result];
      saveToStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, updatedData);
      
      return result
    } catch (error) {
      console.warn('Supabase error, saving to localStorage:', error);
      // Fallback to localStorage if Supabase fails
      const existingData = getFromStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, demoData.kertas_kerja_perubahan);
      const updatedData = [...existingData, newItem];
      saveToStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, updatedData);
      return newItem;
    }
  }

  static async updateKertasKerjaPerubahan(id: string, data: KertasKerjaPerubahanUpdate) {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };

    // Update localStorage first
    const existingData = getFromStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, demoData.kertas_kerja_perubahan);
    const updatedData = existingData.map(item => 
      item.id === id ? { ...item, ...updateData } : item
    );
    saveToStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, updatedData);
    
    const updatedItem = updatedData.find(item => item.id === id);

    if (!isSupabaseConfigured()) {
      console.log('LocalStorage mode: Updated item', updatedItem);
      return updatedItem;
    }

    try {
      const { data: result, error } = await supabase
        .from('kertas_kerja_perubahan')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Update localStorage with Supabase result
      const finalData = existingData.map(item => 
        item.id === id ? result : item
      );
      saveToStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, finalData);
      
      return result
    } catch (error) {
      console.warn('Supabase error, data saved to localStorage:', error);
      // Return the localStorage updated item as fallback
      return updatedItem;
    }
  }

  static async deleteKertasKerjaPerubahan(id: string) {
    // Delete from localStorage first
    const existingData = getFromStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, demoData.kertas_kerja_perubahan);
    const filteredData = existingData.filter(item => item.id !== id);
    saveToStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, filteredData);

    if (!isSupabaseConfigured()) {
      console.log('LocalStorage mode: Deleted item with id', id);
      return true;
    }

    try {
      const { error } = await supabase
        .from('kertas_kerja_perubahan')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.warn('Supabase error, item deleted from localStorage:', error);
      // Item already deleted from localStorage, so return success
      return true;
    }
  }

  static async bulkDeleteKertasKerjaPerubahan(ids: string[]) {
    const { error } = await supabase
      .from('kertas_kerja_perubahan')
      .delete()
      .in('id', ids)

    if (error) throw error
  }

  // Bulk operations
  static async bulkInsertKertasKerjaPerubahan(data: KertasKerjaPerubahanInsert[]) {
    const processedData = data.map(item => ({
      id: generateId(),
      ...item,
      tahun: item.tahun || new Date().getFullYear(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Save to localStorage first
    const existingData = getFromStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, demoData.kertas_kerja_perubahan);
    const updatedData = [...existingData, ...processedData];
    saveToStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, updatedData);

    if (!isSupabaseConfigured()) {
      console.log('LocalStorage mode: Bulk inserted', processedData.length, 'items');
      return processedData;
    }

    try {
      const { data: result, error } = await supabase
        .from('kertas_kerja_perubahan')
        .insert(processedData)
        .select()

      if (error) throw error
      
      // Update localStorage with Supabase results
      const finalData = [...existingData, ...result];
      saveToStorage(STORAGE_KEYS.KERTAS_KERJA_PERUBAHAN, finalData);
      
      return result
    } catch (error) {
      console.warn('Supabase error, data saved to localStorage:', error);
      return processedData;
    }
  }

  // Filter options
  static async getFilterOptions() {
    const { data, error } = await supabase
      .from('kertas_kerja_perubahan')
      .select('nama_bidang, nama_standar, nama_giat, nama_dana, nama_rekening, tahun')

    if (error) throw error

    const bidang = [...new Set(data.map(item => item.nama_bidang).filter(Boolean))]
    const standar = [...new Set(data.map(item => item.nama_standar).filter(Boolean))]
    const giat = [...new Set(data.map(item => item.nama_giat).filter(Boolean))]
    const dana = [...new Set(data.map(item => item.nama_dana).filter(Boolean))]
    const rekening = [...new Set(data.map(item => item.nama_rekening).filter(Boolean))]
    const tahun = [...new Set(data.map(item => item.tahun).filter(Boolean))].sort((a, b) => b - a)

    return { bidang, standar, giat, dana, rekening, tahun }
  }

  // Summary data
  static async getSummaryData(filters?: FilterOptions): Promise<SummaryData> {
    const data = await this.getKertasKerjaPerubahan(filters)
    
    const totalAnggaran = data.reduce((sum, item) => sum + (item.total_akb || 0), 0)
    const totalRealisasi = data.reduce((sum, item) => sum + (item.total_realisasi || 0), 0)
    const persentaseRealisasi = totalAnggaran > 0 ? (totalRealisasi / totalAnggaran) * 100 : 0
    const jumlahItem = data.length

    return {
      totalAnggaran,
      totalRealisasi,
      persentaseRealisasi,
      jumlahItem
    }
  }

  // Period data for charts
  static async getPeriodData(filters?: FilterOptions, periode: 'bulanan' | 'triwulan' = 'bulanan') {
    const data = await this.getKertasKerjaPerubahan(filters)
    
    if (periode === 'bulanan') {
      return [
        { label: 'Jan', value: data.reduce((sum, item) => sum + (item.bulan_1 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_1 || 0), 0) },
        { label: 'Feb', value: data.reduce((sum, item) => sum + (item.bulan_2 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_2 || 0), 0) },
        { label: 'Mar', value: data.reduce((sum, item) => sum + (item.bulan_3 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_3 || 0), 0) },
        { label: 'Apr', value: data.reduce((sum, item) => sum + (item.bulan_4 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_4 || 0), 0) },
        { label: 'Mei', value: data.reduce((sum, item) => sum + (item.bulan_5 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_5 || 0), 0) },
        { label: 'Jun', value: data.reduce((sum, item) => sum + (item.bulan_6 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_6 || 0), 0) },
        { label: 'Jul', value: data.reduce((sum, item) => sum + (item.bulan_7 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_7 || 0), 0) },
        { label: 'Agu', value: data.reduce((sum, item) => sum + (item.bulan_8 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_8 || 0), 0) },
        { label: 'Sep', value: data.reduce((sum, item) => sum + (item.bulan_9 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_9 || 0), 0) },
        { label: 'Okt', value: data.reduce((sum, item) => sum + (item.bulan_10 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_10 || 0), 0) },
        { label: 'Nov', value: data.reduce((sum, item) => sum + (item.bulan_11 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_11 || 0), 0) },
        { label: 'Des', value: data.reduce((sum, item) => sum + (item.bulan_12 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_bulan_12 || 0), 0) }
      ]
    } else {
      return [
        { label: 'TW 1', value: data.reduce((sum, item) => sum + (item.tw_1 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_tw_1 || 0), 0) },
        { label: 'TW 2', value: data.reduce((sum, item) => sum + (item.tw_2 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_tw_2 || 0), 0) },
        { label: 'TW 3', value: data.reduce((sum, item) => sum + (item.tw_3 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_tw_3 || 0), 0) },
        { label: 'TW 4', value: data.reduce((sum, item) => sum + (item.tw_4 || 0), 0), realisasi: data.reduce((sum, item) => sum + (item.realisasi_tw_4 || 0), 0) }
      ]
    }
  }

  // Export to Excel
  static async exportToExcel(filters?: FilterOptions) {
    const data = await this.getKertasKerjaPerubahan(filters)
    return data
  }

  // Import from Excel
  static async importFromExcel(data: any[]) {
    const processedData: KertasKerjaPerubahanInsert[] = data.map(row => ({
      kode_bidang: row['KODE_BIDANG']?.toString() || null,
      nama_bidang: row['NAMA_BIDANG']?.toString() || null,
      kode_standar: row['KODE_STANDAR']?.toString() || null,
      nama_standar: row['NAMA_STANDAR']?.toString() || null,
      id_giat: row['ID_GIAT']?.toString() || null,
      kode_giat: row['KODE_GIAT']?.toString() || null,
      nama_giat: row['NAMA_GIAT']?.toString() || null,
      subtitle: row['SUBTITLE']?.toString() || null,
      kode_dana: row['KODE_DANA']?.toString() || null,
      nama_dana: row['NAMA_DANA']?.toString() || null,
      kode_rekening: row['KODE_REKENING']?.toString() || null,
      nama_rekening: row['NAMA_REKENING']?.toString() || null,
      id_rincian: row['ID_RINCIAN']?.toString() || null,
      idkomponen: row['IDKOMPONEN']?.toString() || null,
      kode_komponen: row['KODE_KOMPONEN']?.toString() || null,
      nama_komponen: row['NAMA_KOMPONEN']?.toString() || null,
      satuan: row['SATUAN']?.toString() || null,
      merk: row['MERK']?.toString() || null,
      spek: row['SPEK']?.toString() || null,
      pajak: row['PAJAK']?.toString() || null,
      volume: parseFloat(row['VOLUME']) || null,
      harga_satuan: parseFloat(row['HARGA_SATUAN']) || null,
      koefisien: parseFloat(row['KOEFISIEN']) || null,
      vol1: parseFloat(row['VOL1']) || null,
      sat1: row['SAT1']?.toString() || null,
      vol2: parseFloat(row['VOL2']) || null,
      sat2: row['SAT2']?.toString() || null,
      vol3: parseFloat(row['VOL3']) || null,
      sat3: row['SAT3']?.toString() || null,
      vol4: parseFloat(row['VOL4']) || null,
      sat4: row['SAT4']?.toString() || null,
      nilai_rincian_murni: parseFloat(row['NILAI_RINCIAN_MURNI']) || null,
      nilai_rincian: parseFloat(row['NILAI_RINCIAN']) || null,
      sub_rincian: row['SUB_RINCIAN']?.toString() || null,
      keterangan_rincian: row['KETERANGAN_RINCIAN']?.toString() || null,
      keterangan: row['KETERANGAN']?.toString() || null,
      bulan_1: parseFloat(row['BULAN_1']) || null,
      bulan_2: parseFloat(row['BULAN_2']) || null,
      bulan_3: parseFloat(row['BULAN_3']) || null,
      tw_1: parseFloat(row['TW 1']) || null,
      bulan_4: parseFloat(row['BULAN_4']) || null,
      bulan_5: parseFloat(row['BULAN_5']) || null,
      bulan_6: parseFloat(row['BULAN_6']) || null,
      tw_2: parseFloat(row['TW 2']) || null,
      bulan_7: parseFloat(row['BULAN_7']) || null,
      bulan_8: parseFloat(row['BULAN_8']) || null,
      bulan_9: parseFloat(row['BULAN_9']) || null,
      tw_3: parseFloat(row['TW 3']) || null,
      bulan_10: parseFloat(row['BULAN_10']) || null,
      bulan_11: parseFloat(row['BULAN_11']) || null,
      bulan_12: parseFloat(row['BULAN_12']) || null,
      tw_4: parseFloat(row['TW 4']) || null,
      total_akb: parseFloat(row['Total_AKB']) || null,
      realisasi_bulan_1: parseFloat(row['BULAN_1_REALISASI']) || null,
      realisasi_bulan_2: parseFloat(row['BULAN_2_REALISASI']) || null,
      realisasi_bulan_3: parseFloat(row['BULAN_3_REALISASI']) || null,
      realisasi_tw_1: parseFloat(row['TW 1_REALISASI']) || null,
      realisasi_bulan_4: parseFloat(row['BULAN_4_REALISASI']) || null,
      realisasi_bulan_5: parseFloat(row['BULAN_5_REALISASI']) || null,
      realisasi_bulan_6: parseFloat(row['BULAN_6_REALISASI']) || null,
      realisasi_tw_2: parseFloat(row['TW 2_REALISASI']) || null,
      realisasi_bulan_7: parseFloat(row['BULAN_7_REALISASI']) || null,
      realisasi_bulan_8: parseFloat(row['BULAN_8_REALISASI']) || null,
      realisasi_bulan_9: parseFloat(row['BULAN_9_REALISASI']) || null,
      realisasi_tw_3: parseFloat(row['TW 3_REALISASI']) || null,
      realisasi_bulan_10: parseFloat(row['BULAN_10_REALISASI']) || null,
      realisasi_bulan_11: parseFloat(row['BULAN_11_REALISASI']) || null,
      realisasi_bulan_12: parseFloat(row['BULAN_12_REALISASI']) || null,
      realisasi_tw_4: parseFloat(row['TW 4_REALISASI']) || null,
      total_realisasi: parseFloat(row['Total_REALISASI']) || null,
      nama_penyedia: row['NAMA PEYEDUA']?.toString() || null,
      no_pesanan: row['NO PESANAN']?.toString() || null,
      tanggal: row['TANGGAL']?.toString() || null,
      no_negosiasi: row['NO, NEGOSIAI']?.toString() || null,
      tanggal_negosiasi: row['YANGGAL']?.toString() || null,
      tahun: new Date().getFullYear(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    return await this.bulkInsertKertasKerjaPerubahan(processedData)
  }

  // ===== USER MANAGEMENT =====
  static async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async createUser(data: UserInsert) {
    const { data: result, error } = await supabase
      .from('users')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async updateUser(id: string, data: UserUpdate) {
    const { data: result, error } = await supabase
      .from('users')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async deleteUser(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // ===== STUDENT MANAGEMENT =====
  static async getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('nama', { ascending: true })
    if (error) throw error
    return data
  }

  static async getStudentById(id: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async createStudent(data: StudentInsert) {
    const { data: result, error } = await supabase
      .from('students')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async updateStudent(id: string, data: StudentUpdate) {
    const { data: result, error } = await supabase
      .from('students')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async deleteStudent(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // ===== INVENTORY MANAGEMENT =====
  static async getInventory() {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('nama_barang', { ascending: true })
    if (error) throw error
    return data
  }

  static async getInventoryById(id: string) {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async createInventory(data: InventoryInsert) {
    const { data: result, error } = await supabase
      .from('inventory')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async updateInventory(id: string, data: InventoryUpdate) {
    const { data: result, error } = await supabase
      .from('inventory')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async deleteInventory(id: string) {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // ===== EVENT MANAGEMENT =====
  static async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('tanggal_mulai', { ascending: false })
    if (error) throw error
    return data
  }

  static async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async createEvent(data: EventInsert) {
    const { data: result, error } = await supabase
      .from('events')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async updateEvent(id: string, data: EventUpdate) {
    const { data: result, error } = await supabase
      .from('events')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // ===== DOCUMENT MANAGEMENT =====
  static async getDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('tanggal_upload', { ascending: false })
    if (error) throw error
    return data
  }

  static async getDocumentById(id: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async createDocument(data: DocumentInsert) {
    const { data: result, error } = await supabase
      .from('documents')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async updateDocument(id: string, data: DocumentUpdate) {
    const { data: result, error } = await supabase
      .from('documents')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async deleteDocument(id: string) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // ===== NOTIFICATION MANAGEMENT =====
  static async getNotifications(userId?: string) {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('tanggal_kirim', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  static async createNotification(data: NotificationInsert) {
    const { data: result, error } = await supabase
      .from('notifications')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async markNotificationAsRead(id: string) {
    const { data: result, error } = await supabase
      .from('notifications')
      .update({ 
        status: 'read', 
        tanggal_baca: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return result
  }

  // ===== ACTIVITY MANAGEMENT =====
  static async getActivities() {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('tanggal_mulai', { ascending: false })
    if (error) throw error
    return data
  }

  static async getActivityById(id: string) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async createActivity(data: ActivityInsert) {
    const { data: result, error } = await supabase
      .from('activities')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async updateActivity(id: string, data: ActivityUpdate) {
    const { data: result, error } = await supabase
      .from('activities')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async deleteActivity(id: string) {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // ===== SETTINGS MANAGEMENT =====
  static async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('category', { ascending: true })
    if (error) throw error
    return data
  }

  static async getSettingByKey(key: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single()
    if (error) throw error
    return data
  }

  static async updateSetting(key: string, value: string) {
    const { data: result, error } = await supabase
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select()
      .single()
    if (error) throw error
    return result
  }

  // ===== MASTER DATA MANAGEMENT =====
  static async getBidang() {
    if (!isSupabaseConfigured()) {
      return demoData.bidang;
    }

    try {
      const { data, error } = await supabase
        .from('bidang')
        .select('*')
        .order('nama', { ascending: true })
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Supabase error, falling back to demo data:', error);
      return demoData.bidang;
    }
  }

  static async createBidang(data: BidangInsert) {
    const { data: result, error } = await supabase
      .from('bidang')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async getStandar() {
    if (!isSupabaseConfigured()) {
      return demoData.standar;
    }

    try {
      const { data, error } = await supabase
        .from('standar')
        .select('*, bidang(*)')
        .order('nama', { ascending: true })
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Supabase error, falling back to demo data:', error);
      return demoData.standar;
    }
  }

  static async createStandar(data: StandarInsert) {
    const { data: result, error } = await supabase
      .from('standar')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async getGiat() {
    if (!isSupabaseConfigured()) {
      return demoData.giat;
    }

    try {
      const { data, error } = await supabase
        .from('giat')
        .select('*, standar(*, bidang(*))')
        .order('nama', { ascending: true })
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Supabase error, falling back to demo data:', error);
      return demoData.giat;
    }
  }

  static async createGiat(data: GiatInsert) {
    const { data: result, error } = await supabase
      .from('giat')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async getDana() {
    if (!isSupabaseConfigured()) {
      return demoData.dana;
    }

    try {
      const { data, error } = await supabase
        .from('dana')
        .select('*')
        .order('nama', { ascending: true })
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Supabase error, falling back to demo data:', error);
      return demoData.dana;
    }
  }

  static async createDana(data: DanaInsert) {
    const { data: result, error } = await supabase
      .from('dana')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async getRekening() {
    if (!isSupabaseConfigured()) {
      return demoData.rekening;
    }

    try {
      const { data, error } = await supabase
        .from('rekening')
        .select('*')
        .order('nama', { ascending: true })
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Supabase error, falling back to demo data:', error);
      return demoData.rekening;
    }
  }

  static async createRekening(data: RekeningInsert) {
    const { data: result, error } = await supabase
      .from('rekening')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async getKomponen() {
    if (!isSupabaseConfigured()) {
      return demoData.komponen;
    }

    try {
      const { data, error } = await supabase
        .from('komponen')
        .select('*')
        .order('nama', { ascending: true })
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Supabase error, falling back to demo data:', error);
      return demoData.komponen;
    }
  }

  static async createKomponen(data: KomponenInsert) {
    const { data: result, error } = await supabase
      .from('komponen')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  // ===== AUDIT LOG =====
  static async createAuditLog(data: AuditLogInsert) {
    const { data: result, error } = await supabase
      .from('audit_logs')
      .insert(data)
      .select()
      .single()
    if (error) throw error
    return result
  }

  static async getAuditLogs(limit: number = 100) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  }

  // ===== NESTED SERVICE OBJECTS =====
  static bidang = {
    getAll: () => ApiService.getBidang(),
    create: (data: BidangInsert) => ApiService.createBidang(data),
    update: async (id: string, data: BidangUpdate) => {
      const { data: result, error } = await supabase
        .from('bidang')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('bidang')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  }

  static standar = {
    getAll: () => ApiService.getStandar(),
    create: (data: StandarInsert) => ApiService.createStandar(data),
    update: async (id: string, data: StandarUpdate) => {
      const { data: result, error } = await supabase
        .from('standar')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('standar')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  }

  static giat = {
    getAll: () => ApiService.getGiat(),
    create: (data: GiatInsert) => ApiService.createGiat(data),
    update: async (id: string, data: GiatUpdate) => {
      const { data: result, error } = await supabase
        .from('giat')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('giat')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  }

  static dana = {
    getAll: () => ApiService.getDana(),
    create: (data: DanaInsert) => ApiService.createDana(data),
    update: async (id: string, data: DanaUpdate) => {
      const { data: result, error } = await supabase
        .from('dana')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('dana')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  }

  static rekening = {
    getAll: () => ApiService.getRekening(),
    create: (data: RekeningInsert) => ApiService.createRekening(data),
    update: async (id: string, data: RekeningUpdate) => {
      const { data: result, error } = await supabase
        .from('rekening')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('rekening')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  }

  static komponen = {
    getAll: () => ApiService.getKomponen(),
    create: (data: KomponenInsert) => ApiService.createKomponen(data),
    update: async (id: string, data: KomponenUpdate) => {
      const { data: result, error } = await supabase
        .from('komponen')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('komponen')
        .delete()
        .eq('id', id)
      if (error) throw error
    }
  }

  static kertasKerjaPerubahan = {
    getAll: (filters?: FilterOptions) => ApiService.getKertasKerjaPerubahan(filters),
    create: (data: KertasKerjaPerubahanInsert) => ApiService.createKertasKerjaPerubahan(data),
    update: (id: string, data: KertasKerjaPerubahanUpdate) => ApiService.updateKertasKerjaPerubahan(id, data),
    delete: (id: string) => ApiService.deleteKertasKerjaPerubahan(id),
    bulkInsert: (data: KertasKerjaPerubahanInsert[]) => ApiService.bulkInsertKertasKerjaPerubahan(data),
    bulkDelete: (ids: string[]) => ApiService.bulkDeleteKertasKerjaPerubahan(ids)
  }
}

