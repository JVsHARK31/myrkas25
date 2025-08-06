import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { KertasKerjaPerubahan } from '../utils/csvParser';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Database table name
const TABLE_NAME = 'kertas_kerja_perubahan';

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  success: boolean;
  error: string | null;
}

// Filter and sort options
export interface FilterOptions {
  search?: string;
  bidang?: string[];
  kegiatan?: string[];
  rekening?: string[];
  komponen?: string[];
  satuan?: string[];
  merk?: string[];
  volumeMin?: number;
  volumeMax?: number;
  hargaMin?: number;
  hargaMax?: number;
  anggaranMin?: number;
  anggaranMax?: number;
  realisasiMin?: number;
  realisasiMax?: number;
  persentaseMin?: number;
  persentaseMax?: number;
  tahun?: number;
  status?: 'belum_mulai' | 'dalam_proses' | 'hampir_selesai' | 'selesai';
}

export interface SortOptions {
  field: keyof KertasKerjaPerubahan;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

// Convert KertasKerjaPerubahan to database format
const toDbFormat = (item: KertasKerjaPerubahan) => {
  return {
    id: item.id,
    kode_bidang: item.kodeBidang,
    nama_bidang: item.namaBidang,
    kode_standar: item.kodeStandar,
    nama_standar: item.namaStandar,
    id_giat: item.idGiat,
    kode_giat: item.kodeGiat,
    nama_giat: item.namaGiat,
    subtitle: item.subtitle,
    kode_dana: item.kodeDana,
    nama_dana: item.namaDana,
    kode_rekening: item.kodeRekening,
    nama_rekening: item.namaRekening,
    id_rincian: item.idRincian,
    id_komponen: item.idKomponen,
    kode_komponen: item.kodeKomponen,
    nama_komponen: item.namaKomponen,
    satuan: item.satuan,
    merk: item.merk,
    spek: item.spek,
    pajak: item.pajak,
    volume: item.volume,
    harga_satuan: item.hargaSatuan,
    koefisien: item.koefisien,
    vol1: item.vol1,
    sat1: item.sat1,
    vol2: item.vol2,
    sat2: item.sat2,
    vol3: item.vol3,
    sat3: item.sat3,
    vol4: item.vol4,
    sat4: item.sat4,
    nilai_rincian_murni: item.nilaiRincianMurni,
    nilai_rincian: item.nilaiRincian,
    sub_rincian: item.subRincian,
    keterangan_rincian: item.keteranganRincian,
    keterangan: item.keterangan,
    anggaran_bulan_1: item.anggaranBulan1,
    anggaran_bulan_2: item.anggaranBulan2,
    anggaran_bulan_3: item.anggaranBulan3,
    anggaran_tw_1: item.anggaranTw1,
    anggaran_bulan_4: item.anggaranBulan4,
    anggaran_bulan_5: item.anggaranBulan5,
    anggaran_bulan_6: item.anggaranBulan6,
    anggaran_tw_2: item.anggaranTw2,
    anggaran_bulan_7: item.anggaranBulan7,
    anggaran_bulan_8: item.anggaranBulan8,
    anggaran_bulan_9: item.anggaranBulan9,
    anggaran_tw_3: item.anggaranTw3,
    anggaran_bulan_10: item.anggaranBulan10,
    anggaran_bulan_11: item.anggaranBulan11,
    anggaran_bulan_12: item.anggaranBulan12,
    anggaran_tw_4: item.anggaranTw4,
    total_akb: item.totalAkb,
    realisasi_bulan_1: item.realisasiBulan1,
    realisasi_bulan_2: item.realisasiBulan2,
    realisasi_bulan_3: item.realisasiBulan3,
    realisasi_tw_1: item.realisasiTw1,
    realisasi_bulan_4: item.realisasiBulan4,
    realisasi_bulan_5: item.realisasiBulan5,
    realisasi_bulan_6: item.realisasiBulan6,
    realisasi_tw_2: item.realisasiTw2,
    realisasi_bulan_7: item.realisasiBulan7,
    realisasi_bulan_8: item.realisasiBulan8,
    realisasi_bulan_9: item.realisasiBulan9,
    realisasi_tw_3: item.realisasiTw3,
    realisasi_bulan_10: item.realisasiBulan10,
    realisasi_bulan_11: item.realisasiBulan11,
    realisasi_bulan_12: item.realisasiBulan12,
    realisasi_tw_4: item.realisasiTw4,
    total_realisasi: item.totalRealisasi,
  };
};

// Convert database format to KertasKerjaPerubahan
const fromDbFormat = (dbItem: Record<string, unknown>): KertasKerjaPerubahan => {
  return {
    id: dbItem.id,
    kodeBidang: dbItem.kode_bidang,
    namaBidang: dbItem.nama_bidang,
    kodeStandar: dbItem.kode_standar,
    namaStandar: dbItem.nama_standar,
    idGiat: dbItem.id_giat,
    kodeGiat: dbItem.kode_giat,
    namaGiat: dbItem.nama_giat,
    subtitle: dbItem.subtitle,
    kodeDana: dbItem.kode_dana,
    namaDana: dbItem.nama_dana,
    kodeRekening: dbItem.kode_rekening,
    namaRekening: dbItem.nama_rekening,
    idRincian: dbItem.id_rincian,
    idKomponen: dbItem.id_komponen,
    kodeKomponen: dbItem.kode_komponen,
    namaKomponen: dbItem.nama_komponen,
    satuan: dbItem.satuan,
    merk: dbItem.merk,
    spek: dbItem.spek,
    pajak: dbItem.pajak,
    volume: dbItem.volume,
    hargaSatuan: dbItem.harga_satuan,
    koefisien: dbItem.koefisien,
    vol1: dbItem.vol1,
    sat1: dbItem.sat1,
    vol2: dbItem.vol2,
    sat2: dbItem.sat2,
    vol3: dbItem.vol3,
    sat3: dbItem.sat3,
    vol4: dbItem.vol4,
    sat4: dbItem.sat4,
    nilaiRincianMurni: dbItem.nilai_rincian_murni,
    nilaiRincian: dbItem.nilai_rincian,
    subRincian: dbItem.sub_rincian,
    keteranganRincian: dbItem.keterangan_rincian,
    keterangan: dbItem.keterangan,
    anggaranBulan1: dbItem.anggaran_bulan_1,
    anggaranBulan2: dbItem.anggaran_bulan_2,
    anggaranBulan3: dbItem.anggaran_bulan_3,
    anggaranTw1: dbItem.anggaran_tw_1,
    anggaranBulan4: dbItem.anggaran_bulan_4,
    anggaranBulan5: dbItem.anggaran_bulan_5,
    anggaranBulan6: dbItem.anggaran_bulan_6,
    anggaranTw2: dbItem.anggaran_tw_2,
    anggaranBulan7: dbItem.anggaran_bulan_7,
    anggaranBulan8: dbItem.anggaran_bulan_8,
    anggaranBulan9: dbItem.anggaran_bulan_9,
    anggaranTw3: dbItem.anggaran_tw_3,
    anggaranBulan10: dbItem.anggaran_bulan_10,
    anggaranBulan11: dbItem.anggaran_bulan_11,
    anggaranBulan12: dbItem.anggaran_bulan_12,
    anggaranTw4: dbItem.anggaran_tw_4,
    totalAkb: dbItem.total_akb,
    realisasiBulan1: dbItem.realisasi_bulan_1,
    realisasiBulan2: dbItem.realisasi_bulan_2,
    realisasiBulan3: dbItem.realisasi_bulan_3,
    realisasiTw1: dbItem.realisasi_tw_1,
    realisasiBulan4: dbItem.realisasi_bulan_4,
    realisasiBulan5: dbItem.realisasi_bulan_5,
    realisasiBulan6: dbItem.realisasi_bulan_6,
    realisasiTw2: dbItem.realisasi_tw_2,
    realisasiBulan7: dbItem.realisasi_bulan_7,
    realisasiBulan8: dbItem.realisasi_bulan_8,
    realisasiBulan9: dbItem.realisasi_bulan_9,
    realisasiTw3: dbItem.realisasi_tw_3,
    realisasiBulan10: dbItem.realisasi_bulan_10,
    realisasiBulan11: dbItem.realisasi_bulan_11,
    realisasiBulan12: dbItem.realisasi_bulan_12,
    realisasiTw4: dbItem.realisasi_tw_4,
    totalRealisasi: dbItem.total_realisasi,
    createdAt: dbItem.created_at,
    updatedAt: dbItem.updated_at,
  };
};

// CRUD Operations
export class KertasKerjaService {
  // Get all items with filtering, sorting, and pagination
  static async getAll(
    filters?: FilterOptions,
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<PaginatedResponse<KertasKerjaPerubahan>> {
    try {
      let query = supabase.from(TABLE_NAME).select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.search) {
          query = query.or(`nama_bidang.ilike.%${filters.search}%,nama_giat.ilike.%${filters.search}%,nama_komponen.ilike.%${filters.search}%,kode_giat.ilike.%${filters.search}%`);
        }
        
        if (filters.bidang && filters.bidang.length > 0) {
          query = query.in('nama_bidang', filters.bidang);
        }
        
        if (filters.kegiatan && filters.kegiatan.length > 0) {
          query = query.in('nama_giat', filters.kegiatan);
        }
        
        if (filters.rekening && filters.rekening.length > 0) {
          query = query.in('nama_rekening', filters.rekening);
        }
        
        if (filters.komponen && filters.komponen.length > 0) {
          query = query.in('nama_komponen', filters.komponen);
        }
        
        if (filters.satuan && filters.satuan.length > 0) {
          query = query.in('satuan', filters.satuan);
        }
        
        if (filters.merk && filters.merk.length > 0) {
          query = query.in('merk', filters.merk);
        }
        
        if (filters.volumeMin !== undefined) {
          query = query.gte('volume', filters.volumeMin);
        }
        
        if (filters.volumeMax !== undefined) {
          query = query.lte('volume', filters.volumeMax);
        }
        
        if (filters.hargaMin !== undefined) {
          query = query.gte('harga_satuan', filters.hargaMin);
        }
        
        if (filters.hargaMax !== undefined) {
          query = query.lte('harga_satuan', filters.hargaMax);
        }
        
        if (filters.anggaranMin !== undefined) {
          query = query.gte('total_akb', filters.anggaranMin);
        }
        
        if (filters.anggaranMax !== undefined) {
          query = query.lte('total_akb', filters.anggaranMax);
        }
        
        if (filters.realisasiMin !== undefined) {
          query = query.gte('total_realisasi', filters.realisasiMin);
        }
        
        if (filters.realisasiMax !== undefined) {
          query = query.lte('total_realisasi', filters.realisasiMax);
        }
      }

      // Apply sorting
      if (sort) {
        const dbField = this.convertFieldToDbFormat(sort.field);
        query = query.order(dbField, { ascending: sort.direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        return {
          data: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0,
          success: false,
          error: error.message
        };
      }

      const items = data?.map(fromDbFormat) || [];
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: items,
        total,
        page,
        pageSize,
        totalPages,
        success: true,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        total: 0,
        page: pagination?.page || 1,
        pageSize: pagination?.pageSize || 10,
        totalPages: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get item by ID
  static async getById(id: string): Promise<ApiResponse<KertasKerjaPerubahan>> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false
        };
      }

      return {
        data: fromDbFormat(data),
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Create new item
  static async create(item: Omit<KertasKerjaPerubahan, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<KertasKerjaPerubahan>> {
    try {
      const dbItem = toDbFormat({ ...item, id: crypto.randomUUID() } as KertasKerjaPerubahan);
      
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(dbItem)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false
        };
      }

      return {
        data: fromDbFormat(data),
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Update item
  static async update(id: string, item: Partial<KertasKerjaPerubahan>): Promise<ApiResponse<KertasKerjaPerubahan>> {
    try {
      const dbItem = toDbFormat(item as KertasKerjaPerubahan);
      
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(dbItem)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false
        };
      }

      return {
        data: fromDbFormat(data),
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Delete item
  static async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) {
        return {
          data: false,
          error: error.message,
          success: false
        };
      }

      return {
        data: true,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Bulk delete
  static async bulkDelete(ids: string[]): Promise<ApiResponse<number>> {
    try {
      const { error, count } = await supabase
        .from(TABLE_NAME)
        .delete({ count: 'exact' })
        .in('id', ids);

      if (error) {
        return {
          data: 0,
          error: error.message,
          success: false
        };
      }

      return {
        data: count || 0,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Bulk insert
  static async bulkInsert(items: Omit<KertasKerjaPerubahan, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ApiResponse<KertasKerjaPerubahan[]>> {
    try {
      const dbItems = items.map(item => 
        toDbFormat({ ...item, id: crypto.randomUUID() } as KertasKerjaPerubahan)
      );
      
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(dbItems)
        .select();

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false
        };
      }

      return {
        data: data?.map(fromDbFormat) || [],
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get summary statistics
  static async getSummary(): Promise<ApiResponse<Record<string, unknown>>> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('nama_bidang, total_akb, total_realisasi');

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false
        };
      }

      const summary = {
        totalItems: data.length,
        totalAkb: data.reduce((sum, item) => sum + (item.total_akb || 0), 0),
        totalRealisasi: data.reduce((sum, item) => sum + (item.total_realisasi || 0), 0),
        bidangCount: new Set(data.map(item => item.nama_bidang)).size,
        byBidang: data.reduce((acc, item) => {
          const bidang = item.nama_bidang || 'Tidak Diketahui';
          if (!acc[bidang]) {
            acc[bidang] = {
              count: 0,
              totalAkb: 0,
              totalRealisasi: 0
            };
          }
          acc[bidang].count++;
          acc[bidang].totalAkb += item.total_akb || 0;
          acc[bidang].totalRealisasi += item.total_realisasi || 0;
          return acc;
        }, {} as Record<string, { count: number; totalAkb: number; totalRealisasi: number }>)
      };

      return {
        data: summary,
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get unique values for filters
  static async getUniqueValues(field: string): Promise<ApiResponse<string[]>> {
    try {
      const dbField = this.convertFieldToDbFormat(field as keyof KertasKerjaPerubahan);
      
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(dbField)
        .not(dbField, 'is', null)
        .not(dbField, 'eq', '');

      if (error) {
        return {
          data: [],
          error: error.message,
          success: false
        };
      }

      const uniqueValues = [...new Set(data.map(item => item[dbField]).filter(Boolean))];
      
      return {
        data: uniqueValues.sort(),
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Helper method to convert field names to database format
  private static convertFieldToDbFormat(field: keyof KertasKerjaPerubahan): string {
    const fieldMap: Record<string, string> = {
      kodeBidang: 'kode_bidang',
      namaBidang: 'nama_bidang',
      kodeStandar: 'kode_standar',
      namaStandar: 'nama_standar',
      idGiat: 'id_giat',
      kodeGiat: 'kode_giat',
      namaGiat: 'nama_giat',
      kodeDana: 'kode_dana',
      namaDana: 'nama_dana',
      kodeRekening: 'kode_rekening',
      namaRekening: 'nama_rekening',
      idRincian: 'id_rincian',
      idKomponen: 'id_komponen',
      kodeKomponen: 'kode_komponen',
      namaKomponen: 'nama_komponen',
      hargaSatuan: 'harga_satuan',
      nilaiRincianMurni: 'nilai_rincian_murni',
      nilaiRincian: 'nilai_rincian',
      subRincian: 'sub_rincian',
      keteranganRincian: 'keterangan_rincian',
      anggaranBulan1: 'anggaran_bulan_1',
      anggaranBulan2: 'anggaran_bulan_2',
      anggaranBulan3: 'anggaran_bulan_3',
      anggaranTw1: 'anggaran_tw_1',
      anggaranBulan4: 'anggaran_bulan_4',
      anggaranBulan5: 'anggaran_bulan_5',
      anggaranBulan6: 'anggaran_bulan_6',
      anggaranTw2: 'anggaran_tw_2',
      anggaranBulan7: 'anggaran_bulan_7',
      anggaranBulan8: 'anggaran_bulan_8',
      anggaranBulan9: 'anggaran_bulan_9',
      anggaranTw3: 'anggaran_tw_3',
      anggaranBulan10: 'anggaran_bulan_10',
      anggaranBulan11: 'anggaran_bulan_11',
      anggaranBulan12: 'anggaran_bulan_12',
      anggaranTw4: 'anggaran_tw_4',
      totalAkb: 'total_akb',
      realisasiBulan1: 'realisasi_bulan_1',
      realisasiBulan2: 'realisasi_bulan_2',
      realisasiBulan3: 'realisasi_bulan_3',
      realisasiTw1: 'realisasi_tw_1',
      realisasiBulan4: 'realisasi_bulan_4',
      realisasiBulan5: 'realisasi_bulan_5',
      realisasiBulan6: 'realisasi_bulan_6',
      realisasiTw2: 'realisasi_tw_2',
      realisasiBulan7: 'realisasi_bulan_7',
      realisasiBulan8: 'realisasi_bulan_8',
      realisasiBulan9: 'realisasi_bulan_9',
      realisasiTw3: 'realisasi_tw_3',
      realisasiBulan10: 'realisasi_bulan_10',
      realisasiBulan11: 'realisasi_bulan_11',
      realisasiBulan12: 'realisasi_bulan_12',
      realisasiTw4: 'realisasi_tw_4',
      totalRealisasi: 'total_realisasi',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };

    return fieldMap[field] || field;
  }
}

// Export default instance
export default KertasKerjaService;