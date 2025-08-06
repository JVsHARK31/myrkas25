// Dropdown options for new fields

export const BIDANG_KEGIATAN_OPTIONS = [
  { value: 'kurikulum', label: 'Kurikulum' },
  { value: 'kesiswaan', label: 'Kesiswaan' },
  { value: 'sarana_prasarana', label: 'Sarana Prasarana' },
  { value: 'pendidik_tenaga', label: 'Pendidik & Tenaga' },
  { value: 'pembiayaan', label: 'Pembiayaan' },
  { value: 'budaya_sekolah', label: 'Budaya Sekolah' },
  { value: 'kemitraan', label: 'Kemitraan' },
  { value: 'evaluasi', label: 'Evaluasi' }
];

export const STANDAR_NASIONAL_OPTIONS = [
  { value: 'standar_kompetensi_lulusan', label: 'Standar Kompetensi Lulusan' },
  { value: 'standar_isi', label: 'Standar Isi' },
  { value: 'standar_proses', label: 'Standar Proses' },
  { value: 'standar_penilaian', label: 'Standar Penilaian' },
  { value: 'standar_pendidik_tenaga', label: 'Standar Pendidik dan Tenaga Kependidikan' },
  { value: 'standar_sarana_prasarana', label: 'Standar Sarana dan Prasarana' },
  { value: 'standar_pengelolaan', label: 'Standar Pengelolaan' },
  { value: 'standar_pembiayaan', label: 'Standar Pembiayaan' }
];

export const SUMBER_DANA_OPTIONS = [
  { value: 'bos_reguler', label: 'BOS Reguler' },
  { value: 'bos_kinerja', label: 'BOS Kinerja' },
  { value: 'apbd_provinsi', label: 'APBD Provinsi' },
  { value: 'apbd_kabupaten_kota', label: 'APBD Kabupaten/Kota' },
  { value: 'bantuan_pemerintah_pusat', label: 'Bantuan Pemerintah Pusat' },
  { value: 'bantuan_pemerintah_daerah', label: 'Bantuan Pemerintah Daerah' },
  { value: 'swadaya_gotong_royong', label: 'Swadaya/Gotong Royong' },
  { value: 'hibah_sumbangan', label: 'Hibah/Sumbangan' },
  { value: 'usaha_mandiri', label: 'Usaha Mandiri' }
];

// Helper functions
export const getBidangKegiatanLabel = (value: string): string => {
  const option = BIDANG_KEGIATAN_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
};

export const getStandarNasionalLabel = (value: string): string => {
  const option = STANDAR_NASIONAL_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
};

export const getSumberDanaLabel = (value: string): string => {
  const option = SUMBER_DANA_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
};