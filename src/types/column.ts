export interface ColumnDefinition {
  id: string
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'textarea'
  required: boolean
  visible: boolean
  editable: boolean
  sortable: boolean
  filterable: boolean
  width?: number
  options?: string[] // for select type
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  defaultValue?: unknown
  description?: string
  group?: string
  order: number
  created_at: string
  updated_at: string
}

export interface ColumnGroup {
  id: string
  name: string
  label: string
  order: number
  collapsed: boolean
  color?: string
}

export const DEFAULT_COLUMNS: ColumnDefinition[] = [
  {
    id: 'kode_bidang',
    name: 'kode_bidang',
    label: 'Kode Bidang',
    type: 'text',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'identifikasi',
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'nama_bidang',
    name: 'nama_bidang',
    label: 'Nama Bidang',
    type: 'text',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'identifikasi',
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'kode_standar',
    name: 'kode_standar',
    label: 'Kode Standar',
    type: 'text',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'identifikasi',
    order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'nama_standar',
    name: 'nama_standar',
    label: 'Nama Standar',
    type: 'text',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'identifikasi',
    order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'nama_giat',
    name: 'nama_giat',
    label: 'Nama Kegiatan',
    type: 'text',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'kegiatan',
    order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'nama_komponen',
    name: 'nama_komponen',
    label: 'Nama Komponen',
    type: 'text',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'komponen',
    order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'volume',
    name: 'volume',
    label: 'Volume',
    type: 'number',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'komponen',
    order: 7,
    validation: { min: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'harga_satuan',
    name: 'harga_satuan',
    label: 'Harga Satuan',
    type: 'number',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'komponen',
    order: 8,
    validation: { min: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'total_akb',
    name: 'total_akb',
    label: 'Total AKB',
    type: 'number',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'anggaran',
    order: 9,
    validation: { min: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'total_realisasi',
    name: 'total_realisasi',
    label: 'Total Realisasi',
    type: 'number',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'realisasi',
    order: 10,
    validation: { min: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'bidang_kegiatan',
    name: 'bidang_kegiatan',
    label: 'Bidang Kegiatan',
    type: 'select',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'kegiatan',
    order: 11,
    options: [
      'Pendidikan',
      'Kesehatan',
      'Infrastruktur',
      'Ekonomi',
      'Sosial',
      'Lingkungan',
      'Keamanan',
      'Pemerintahan',
      'Teknologi Informasi',
      'Pariwisata',
      'Pertanian',
      'Perikanan',
      'Kehutanan',
      'Energi',
      'Transportasi'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'standar_nasional',
    name: 'standar_nasional',
    label: 'Standar Nasional',
    type: 'select',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'identifikasi',
    order: 12,
    options: [
      'SNI (Standar Nasional Indonesia)',
      'SPM (Standar Pelayanan Minimal)',
      'SBK (Standar Biaya Khusus)',
      'SBU (Standar Biaya Umum)',
      'NSPK (Norma, Standar, Prosedur, dan Kriteria)',
      'Standar Akuntansi Pemerintahan',
      'Standar Audit Intern Pemerintah',
      'Standar Kompetensi Kerja Nasional',
      'Standar Nasional Pendidikan',
      'Standar Pelayanan Publik',
      'Standar Keselamatan dan Kesehatan Kerja',
      'Standar Lingkungan Hidup'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'sumber_dana',
    name: 'sumber_dana',
    label: 'Sumber Dana',
    type: 'select',
    required: false,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'anggaran',
    order: 13,
    options: [
      'APBN (Anggaran Pendapatan dan Belanja Negara)',
      'APBD Provinsi (Anggaran Pendapatan dan Belanja Daerah Provinsi)',
      'APBD Kabupaten/Kota (Anggaran Pendapatan dan Belanja Daerah Kabupaten/Kota)',
      'Dana Alokasi Umum (DAU)',
      'Dana Alokasi Khusus (DAK)',
      'Dana Bagi Hasil (DBH)',
      'Dana Desa',
      'Dana Hibah',
      'Dana Bantuan Sosial',
      'Dana CSR (Corporate Social Responsibility)',
      'Dana Swadaya Masyarakat',
      'Dana Pinjaman/Kredit',
      'Dana Investasi Swasta',
      'Dana Kerjasama Internasional',
      'Dana BUMN/BUMD'
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tahun',
    name: 'tahun',
    label: 'Tahun',
    type: 'number',
    required: true,
    visible: true,
    editable: true,
    sortable: true,
    filterable: true,
    group: 'periode',
    order: 14,
    validation: { min: 2020, max: 2030 },
    defaultValue: new Date().getFullYear(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const DEFAULT_COLUMN_GROUPS: ColumnGroup[] = [
  {
    id: 'identifikasi',
    name: 'identifikasi',
    label: 'Identifikasi',
    order: 1,
    collapsed: false,
    color: '#3B82F6'
  },
  {
    id: 'kegiatan',
    name: 'kegiatan',
    label: 'Kegiatan',
    order: 2,
    collapsed: false,
    color: '#10B981'
  },
  {
    id: 'komponen',
    name: 'komponen',
    label: 'Komponen',
    order: 3,
    collapsed: false,
    color: '#F59E0B'
  },
  {
    id: 'anggaran',
    name: 'anggaran',
    label: 'Anggaran',
    order: 4,
    collapsed: false,
    color: '#EF4444'
  },
  {
    id: 'realisasi',
    name: 'realisasi',
    label: 'Realisasi',
    order: 5,
    collapsed: false,
    color: '#8B5CF6'
  },
  {
    id: 'periode',
    name: 'periode',
    label: 'Periode',
    order: 6,
    collapsed: false,
    color: '#06B6D4'
  }
]

