export interface Database {
  public: {
    Tables: {
      bidang: {
        Row: {
          id: string
          kode: string
          nama: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kode: string
          nama: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kode?: string
          nama?: string
          created_at?: string
          updated_at?: string
        }
      }
      standar: {
        Row: {
          id: string
          kode: string
          nama: string
          bidang_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kode: string
          nama: string
          bidang_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kode?: string
          nama?: string
          bidang_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      giat: {
        Row: {
          id: string
          kode: string
          nama: string
          subtitle: string | null
          standar_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kode: string
          nama: string
          subtitle?: string | null
          standar_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kode?: string
          nama?: string
          subtitle?: string | null
          standar_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      dana: {
        Row: {
          id: string
          kode: string
          nama: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kode: string
          nama: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kode?: string
          nama?: string
          created_at?: string
          updated_at?: string
        }
      }
      rekening: {
        Row: {
          id: string
          kode: string
          nama: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kode: string
          nama: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kode?: string
          nama?: string
          created_at?: string
          updated_at?: string
        }
      }
      komponen: {
        Row: {
          id: string
          kode: string
          nama: string
          satuan: string | null
          merk: string | null
          spek: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kode: string
          nama: string
          satuan?: string | null
          merk?: string | null
          spek?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kode?: string
          nama?: string
          satuan?: string | null
          merk?: string | null
          spek?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      kertas_kerja_perubahan: {
        Row: {
          id: string
          kode_bidang: string | null
          nama_bidang: string | null
          kode_standar: string | null
          nama_standar: string | null
          id_giat: string | null
          kode_giat: string | null
          nama_giat: string | null
          subtitle: string | null
          kode_dana: string | null
          nama_dana: string | null
          kode_rekening: string | null
          nama_rekening: string | null
          id_rincian: string | null
          idkomponen: string | null
          kode_komponen: string | null
          nama_komponen: string | null
          satuan: string | null
          merk: string | null
          spek: string | null
          pajak: string | null
          volume: number | null
          harga_satuan: number | null
          koefisien: number | null
          vol1: number | null
          sat1: string | null
          vol2: number | null
          sat2: string | null
          vol3: number | null
          sat3: string | null
          vol4: number | null
          sat4: string | null
          nilai_rincian_murni: number | null
          nilai_rincian: number | null
          sub_rincian: string | null
          keterangan_rincian: string | null
          keterangan: string | null
          bulan_1: number | null
          bulan_2: number | null
          bulan_3: number | null
          tw_1: number | null
          bulan_4: number | null
          bulan_5: number | null
          bulan_6: number | null
          tw_2: number | null
          bulan_7: number | null
          bulan_8: number | null
          bulan_9: number | null
          tw_3: number | null
          bulan_10: number | null
          bulan_11: number | null
          bulan_12: number | null
          tw_4: number | null
          total_akb: number | null
          realisasi_bulan_1: number | null
          realisasi_bulan_2: number | null
          realisasi_bulan_3: number | null
          realisasi_tw_1: number | null
          realisasi_bulan_4: number | null
          realisasi_bulan_5: number | null
          realisasi_bulan_6: number | null
          realisasi_tw_2: number | null
          realisasi_bulan_7: number | null
          realisasi_bulan_8: number | null
          realisasi_bulan_9: number | null
          realisasi_tw_3: number | null
          realisasi_bulan_10: number | null
          realisasi_bulan_11: number | null
          realisasi_bulan_12: number | null
          realisasi_tw_4: number | null
          total_realisasi: number | null
          bidang_kegiatan: string | null
          standar_nasional: string | null
          sumber_dana: string | null
          nama_penyedia: string | null
          no_pesanan: string | null
          tanggal: string | null
          no_negosiasi: string | null
          tanggal_negosiasi: string | null
          tahun: number
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          kode_bidang?: string | null
          nama_bidang?: string | null
          kode_standar?: string | null
          nama_standar?: string | null
          id_giat?: string | null
          kode_giat?: string | null
          nama_giat?: string | null
          subtitle?: string | null
          kode_dana?: string | null
          nama_dana?: string | null
          kode_rekening?: string | null
          nama_rekening?: string | null
          id_rincian?: string | null
          idkomponen?: string | null
          kode_komponen?: string | null
          nama_komponen?: string | null
          satuan?: string | null
          merk?: string | null
          spek?: string | null
          pajak?: string | null
          volume?: number | null
          harga_satuan?: number | null
          koefisien?: number | null
          vol1?: number | null
          sat1?: string | null
          vol2?: number | null
          sat2?: string | null
          vol3?: number | null
          sat3?: string | null
          vol4?: number | null
          sat4?: string | null
          nilai_rincian_murni?: number | null
          nilai_rincian?: number | null
          sub_rincian?: string | null
          keterangan_rincian?: string | null
          keterangan?: string | null
          bulan_1?: number | null
          bulan_2?: number | null
          bulan_3?: number | null
          tw_1?: number | null
          bulan_4?: number | null
          bulan_5?: number | null
          bulan_6?: number | null
          tw_2?: number | null
          bulan_7?: number | null
          bulan_8?: number | null
          bulan_9?: number | null
          tw_3?: number | null
          bulan_10?: number | null
          bulan_11?: number | null
          bulan_12?: number | null
          tw_4?: number | null
          total_akb?: number | null
          realisasi_bulan_1?: number | null
          realisasi_bulan_2?: number | null
          realisasi_bulan_3?: number | null
          realisasi_tw_1?: number | null
          realisasi_bulan_4?: number | null
          realisasi_bulan_5?: number | null
          realisasi_bulan_6?: number | null
          realisasi_tw_2?: number | null
          realisasi_bulan_7?: number | null
          realisasi_bulan_8?: number | null
          realisasi_bulan_9?: number | null
          realisasi_tw_3?: number | null
          realisasi_bulan_10?: number | null
          realisasi_bulan_11?: number | null
          realisasi_bulan_12?: number | null
          realisasi_tw_4?: number | null
          total_realisasi?: number | null
          bidang_kegiatan?: string | null
          standar_nasional?: string | null
          sumber_dana?: string | null
          nama_penyedia?: string | null
          no_pesanan?: string | null
          tanggal?: string | null
          no_negosiasi?: string | null
          tanggal_negosiasi?: string | null
          tahun: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          kode_bidang?: string | null
          nama_bidang?: string | null
          kode_standar?: string | null
          nama_standar?: string | null
          id_giat?: string | null
          kode_giat?: string | null
          nama_giat?: string | null
          subtitle?: string | null
          kode_dana?: string | null
          nama_dana?: string | null
          kode_rekening?: string | null
          nama_rekening?: string | null
          id_rincian?: string | null
          idkomponen?: string | null
          kode_komponen?: string | null
          nama_komponen?: string | null
          satuan?: string | null
          merk?: string | null
          spek?: string | null
          pajak?: string | null
          volume?: number | null
          harga_satuan?: number | null
          koefisien?: number | null
          vol1?: number | null
          sat1?: string | null
          vol2?: number | null
          sat2?: string | null
          vol3?: number | null
          sat3?: string | null
          vol4?: number | null
          sat4?: string | null
          nilai_rincian_murni?: number | null
          nilai_rincian?: number | null
          sub_rincian?: string | null
          keterangan_rincian?: string | null
          keterangan?: string | null
          bulan_1?: number | null
          bulan_2?: number | null
          bulan_3?: number | null
          tw_1?: number | null
          bulan_4?: number | null
          bulan_5?: number | null
          bulan_6?: number | null
          tw_2?: number | null
          bulan_7?: number | null
          bulan_8?: number | null
          bulan_9?: number | null
          tw_3?: number | null
          bulan_10?: number | null
          bulan_11?: number | null
          bulan_12?: number | null
          tw_4?: number | null
          total_akb?: number | null
          realisasi_bulan_1?: number | null
          realisasi_bulan_2?: number | null
          realisasi_bulan_3?: number | null
          realisasi_tw_1?: number | null
          realisasi_bulan_4?: number | null
          realisasi_bulan_5?: number | null
          realisasi_bulan_6?: number | null
          realisasi_tw_2?: number | null
          realisasi_bulan_7?: number | null
          realisasi_bulan_8?: number | null
          realisasi_bulan_9?: number | null
          realisasi_tw_3?: number | null
          realisasi_bulan_10?: number | null
          realisasi_bulan_11?: number | null
          realisasi_bulan_12?: number | null
          realisasi_tw_4?: number | null
          total_realisasi?: number | null
          bidang_kegiatan?: string | null
          standar_nasional?: string | null
          sumber_dana?: string | null
          nama_penyedia?: string | null
          no_pesanan?: string | null
          tanggal?: string | null
          no_negosiasi?: string | null
          tanggal_negosiasi?: string | null
          tahun?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          password: string
          name: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          nis: string
          nama: string
          kelas: string
          alamat: string | null
          telepon: string | null
          email: string | null
          tanggal_lahir: string | null
          jenis_kelamin: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nis: string
          nama: string
          kelas: string
          alamat?: string | null
          telepon?: string | null
          email?: string | null
          tanggal_lahir?: string | null
          jenis_kelamin?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nis?: string
          nama?: string
          kelas?: string
          alamat?: string | null
          telepon?: string | null
          email?: string | null
          tanggal_lahir?: string | null
          jenis_kelamin?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          kode_barang: string
          nama_barang: string
          kategori: string
          satuan: string
          stok: number
          harga_satuan: number
          lokasi: string | null
          kondisi: string
          tanggal_masuk: string
          keterangan: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kode_barang: string
          nama_barang: string
          kategori: string
          satuan: string
          stok: number
          harga_satuan: number
          lokasi?: string | null
          kondisi?: string
          tanggal_masuk: string
          keterangan?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kode_barang?: string
          nama_barang?: string
          kategori?: string
          satuan?: string
          stok?: number
          harga_satuan?: number
          lokasi?: string | null
          kondisi?: string
          tanggal_masuk?: string
          keterangan?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          nama_event: string
          deskripsi: string | null
          tanggal_mulai: string
          tanggal_selesai: string
          lokasi: string | null
          status: string
          anggaran: number | null
          penanggung_jawab: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama_event: string
          deskripsi?: string | null
          tanggal_mulai: string
          tanggal_selesai: string
          lokasi?: string | null
          status?: string
          anggaran?: number | null
          penanggung_jawab?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama_event?: string
          deskripsi?: string | null
          tanggal_mulai?: string
          tanggal_selesai?: string
          lokasi?: string | null
          status?: string
          anggaran?: number | null
          penanggung_jawab?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          nama_dokumen: string
          jenis_dokumen: string
          file_path: string
          ukuran_file: number
          uploaded_by: string
          tanggal_upload: string
          status: string
          keterangan: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama_dokumen: string
          jenis_dokumen: string
          file_path: string
          ukuran_file: number
          uploaded_by: string
          tanggal_upload?: string
          status?: string
          keterangan?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama_dokumen?: string
          jenis_dokumen?: string
          file_path?: string
          ukuran_file?: number
          uploaded_by?: string
          tanggal_upload?: string
          status?: string
          keterangan?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          judul: string
          pesan: string
          jenis: string
          status: string
          tanggal_kirim: string
          tanggal_baca: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          judul: string
          pesan: string
          jenis?: string
          status?: string
          tanggal_kirim?: string
          tanggal_baca?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          judul?: string
          pesan?: string
          jenis?: string
          status?: string
          tanggal_kirim?: string
          tanggal_baca?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          nama_aktivitas: string
          deskripsi: string | null
          tanggal_mulai: string
          tanggal_selesai: string
          status: string
          prioritas: string
          assigned_to: string | null
          progress: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama_aktivitas: string
          deskripsi?: string | null
          tanggal_mulai: string
          tanggal_selesai: string
          status?: string
          prioritas?: string
          assigned_to?: string | null
          progress?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama_aktivitas?: string
          deskripsi?: string | null
          tanggal_mulai?: string
          tanggal_selesai?: string
          status?: string
          prioritas?: string
          assigned_to?: string | null
          progress?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string
          description: string | null
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          description?: string | null
          category?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string | null
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_values: Record<string, unknown> | null
          new_values: Record<string, unknown> | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_values?: Record<string, unknown> | null
          new_values?: Record<string, unknown> | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_values?: Record<string, unknown> | null
          new_values?: Record<string, unknown> | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Table type exports
export type Bidang = Database['public']['Tables']['bidang']['Row']
export type BidangInsert = Database['public']['Tables']['bidang']['Insert']
export type BidangUpdate = Database['public']['Tables']['bidang']['Update']

export type Standar = Database['public']['Tables']['standar']['Row']
export type StandarInsert = Database['public']['Tables']['standar']['Insert']
export type StandarUpdate = Database['public']['Tables']['standar']['Update']

export type Giat = Database['public']['Tables']['giat']['Row']
export type GiatInsert = Database['public']['Tables']['giat']['Insert']
export type GiatUpdate = Database['public']['Tables']['giat']['Update']

export type Dana = Database['public']['Tables']['dana']['Row']
export type DanaInsert = Database['public']['Tables']['dana']['Insert']
export type DanaUpdate = Database['public']['Tables']['dana']['Update']

export type Rekening = Database['public']['Tables']['rekening']['Row']
export type RekeningInsert = Database['public']['Tables']['rekening']['Insert']
export type RekeningUpdate = Database['public']['Tables']['rekening']['Update']

export type Komponen = Database['public']['Tables']['komponen']['Row']
export type KomponenInsert = Database['public']['Tables']['komponen']['Insert']
export type KomponenUpdate = Database['public']['Tables']['komponen']['Update']

export type KertasKerjaPerubahan = Database['public']['Tables']['kertas_kerja_perubahan']['Row']
export type KertasKerjaPerubahanInsert = Database['public']['Tables']['kertas_kerja_perubahan']['Insert']
export type KertasKerjaPerubahanUpdate = Database['public']['Tables']['kertas_kerja_perubahan']['Update']

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Student = Database['public']['Tables']['students']['Row']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type StudentUpdate = Database['public']['Tables']['students']['Update']

export type Inventory = Database['public']['Tables']['inventory']['Row']
export type InventoryInsert = Database['public']['Tables']['inventory']['Insert']
export type InventoryUpdate = Database['public']['Tables']['inventory']['Update']

export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

export type Activity = Database['public']['Tables']['activities']['Row']
export type ActivityInsert = Database['public']['Tables']['activities']['Insert']
export type ActivityUpdate = Database['public']['Tables']['activities']['Update']

export type Setting = Database['public']['Tables']['settings']['Row']
export type SettingInsert = Database['public']['Tables']['settings']['Insert']
export type SettingUpdate = Database['public']['Tables']['settings']['Update']

export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert']
export type AuditLogUpdate = Database['public']['Tables']['audit_logs']['Update']

export interface FilterOptions {
  tahun?: number
  periode?: 'bulanan' | 'triwulan'
  bidang?: string
  standar?: string
  giat?: string
  dana?: string
  rekening?: string
}

export interface PeriodData {
  label: string
  value: number
  realisasi: number
}

export interface SummaryData {
  totalAnggaran: number
  totalRealisasi: number
  persentaseRealisasi: number
  jumlahItem: number
}

