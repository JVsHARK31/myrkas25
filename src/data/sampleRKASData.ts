import { KertasKerjaPerubahan } from '../utils/csvParser';

// Sample data based on user's provided examples
export const sampleRKASData: KertasKerjaPerubahan[] = [
  {
    id: '1',
    // Bidang Information
    kodeBidang: '01',
    namaBidang: 'Kurikulum',
    
    // Standar Information
    kodeStandar: '2',
    namaStandar: 'Pengembangan Standar Isi',
    
    // Kegiatan Information
    idGiat: '535613',
    kodeGiat: '01.3.02.01.2.001',
    namaGiat: '02.02. Pengembangan Perpustakaan',
    subtitle: '02.02.01. Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik',
    
    // Dana Information
    kodeDana: '3.02.01',
    namaDana: 'BOP Alokasi Dasar',
    
    // Rekening Information
    kodeRekening: '5.1.02.01.01.0012',
    namaRekening: 'Belanja Bahan-Bahan Lainnya',
    
    // Rincian Information
    idRincian: '8674237',
    idKomponen: '3662',
    kodeKomponen: '1.1.12.01.03.0009.00032',
    namaKomponen: 'Kaos',
    
    // Spesifikasi Barang
    satuan: 'Buah',
    merk: '',
    spek: 'Lengan Panjang',
    pajak: '12%',
    
    // Volume dan Harga
    volume: 4,
    hargaSatuan: 214245,
    koefisien: '4 Buah',
    
    // Volume Detail (VOL1-VOL4 dengan SAT1-SAT4)
    vol1: 4,
    sat1: 'Buah',
    vol2: 1,
    sat2: '',
    vol3: 1,
    sat3: '',
    vol4: 1,
    sat4: '',
    
    // Nilai Rincian
    nilaiRincianMurni: 959818,
    nilaiRincian: 959818,
    subRincian: '',
    keteranganRincian: '',
    keterangan: '',
    
    // Anggaran Bulanan (BULAN_1 - BULAN_12)
    anggaranBulan1: 102838,
    anggaranBulan2: 0,
    anggaranBulan3: 0,
    anggaranTw1: 102838,
    anggaranBulan4: 0,
    anggaranBulan5: 0,
    anggaranBulan6: 0,
    anggaranTw2: 0,
    anggaranBulan7: 0,
    anggaranBulan8: 959818,
    anggaranBulan9: 0,
    anggaranTw3: 959818,
    anggaranBulan10: 0,
    anggaranBulan11: 0,
    anggaranBulan12: 0,
    anggaranTw4: 0,
    totalAkb: 959818,
    
    // Realisasi Bulanan (BULAN_1 - BULAN_12)
    realisasiBulan1: 0,
    realisasiBulan2: 0,
    realisasiBulan3: 0,
    realisasiTw1: 0,
    realisasiBulan4: 0,
    realisasiBulan5: 0,
    realisasiBulan6: 0,
    realisasiTw2: 0,
    realisasiBulan7: 0,
    realisasiBulan8: 959818,
    realisasiBulan9: 0,
    realisasiTw3: 959818,
    realisasiBulan10: 0,
    realisasiBulan11: 0,
    realisasiBulan12: 0,
    realisasiTw4: 0,
    totalRealisasi: 959818,
    
    // Metadata
    status: 'Selesai',
    periodYear: 2024,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: '2',
    // Bidang Information
    kodeBidang: '01',
    namaBidang: 'Kurikulum',
    
    // Standar Information
    kodeStandar: '2',
    namaStandar: 'Pengembangan Standar Isi',
    
    // Kegiatan Information
    idGiat: '535613',
    kodeGiat: '01.3.02.01.2.001',
    namaGiat: '02.02. Pengembangan Perpustakaan',
    subtitle: '02.02.01. Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik',
    
    // Dana Information
    kodeDana: '3.02.01',
    namaDana: 'BOP Alokasi Dasar',
    
    // Rekening Information
    kodeRekening: '5.1.02.01.01.0012',
    namaRekening: 'Belanja Bahan-Bahan Lainnya',
    
    // Rincian Information
    idRincian: '8674233',
    idKomponen: '5918',
    kodeKomponen: '1.3.02.05.02.0005.00066',
    namaKomponen: 'Kain Bludru',
    
    // Spesifikasi Barang
    satuan: 'Roll',
    merk: '',
    spek: '',
    pajak: '12%',
    
    // Volume dan Harga
    volume: 1,
    hargaSatuan: 856123,
    koefisien: '1 Roll',
    
    // Volume Detail (VOL1-VOL4 dengan SAT1-SAT4)
    vol1: 1,
    sat1: 'Roll',
    vol2: 0,
    sat2: '',
    vol3: 0,
    sat3: '',
    vol4: 0,
    sat4: '',
    
    // Nilai Rincian
    nilaiRincianMurni: 958858,
    nilaiRincian: 958858,
    subRincian: '',
    keteranganRincian: '',
    keterangan: '',
    
    // Anggaran Bulanan (BULAN_1 - BULAN_12)
    anggaranBulan1: 0,
    anggaranBulan2: 0,
    anggaranBulan3: 0,
    anggaranTw1: 0,
    anggaranBulan4: 0,
    anggaranBulan5: 0,
    anggaranBulan6: 0,
    anggaranTw2: 0,
    anggaranBulan7: 0,
    anggaranBulan8: 958858,
    anggaranBulan9: 0,
    anggaranTw3: 958858,
    anggaranBulan10: 0,
    anggaranBulan11: 0,
    anggaranBulan12: 0,
    anggaranTw4: 0,
    totalAkb: 958858,
    
    // Realisasi Bulanan (BULAN_1 - BULAN_12)
    realisasiBulan1: 0,
    realisasiBulan2: 0,
    realisasiBulan3: 0,
    realisasiTw1: 0,
    realisasiBulan4: 0,
    realisasiBulan5: 0,
    realisasiBulan6: 0,
    realisasiTw2: 0,
    realisasiBulan7: 0,
    realisasiBulan8: 958858,
    realisasiBulan9: 0,
    realisasiTw3: 958858,
    realisasiBulan10: 0,
    realisasiBulan11: 0,
    realisasiBulan12: 0,
    realisasiTw4: 0,
    totalRealisasi: 958858,
    
    // Metadata
    status: 'Selesai',
    periodYear: 2024,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: '3',
    // Bidang Information
    kodeBidang: '02',
    namaBidang: 'Kesiswaan',
    
    // Standar Information
    kodeStandar: '3',
    namaStandar: 'Pengembangan Standar Proses',
    
    // Kegiatan Information
    idGiat: '535614',
    kodeGiat: '02.1.01.01.1.002',
    namaGiat: '01.01. Pengembangan Ekstrakurikuler',
    subtitle: '01.01.01. Kegiatan pengembangan bakat dan minat siswa melalui ekstrakurikuler',
    
    // Dana Information
    kodeDana: '3.02.02',
    namaDana: 'BOP Alokasi Kinerja',
    
    // Rekening Information
    kodeRekening: '5.1.02.01.01.0015',
    namaRekening: 'Belanja Alat Tulis Kantor',
    
    // Rincian Information
    idRincian: '8674240',
    idKomponen: '3665',
    kodeKomponen: '1.1.12.01.01.0001.00001',
    namaKomponen: 'Kertas A4',
    
    // Spesifikasi Barang
    satuan: 'Rim',
    merk: 'Sinar Dunia',
    spek: '80 gram, putih',
    pajak: '11%',
    
    // Volume dan Harga
    volume: 50,
    hargaSatuan: 45000,
    koefisien: '50 Rim',
    
    // Volume Detail (VOL1-VOL4 dengan SAT1-SAT4)
    vol1: 50,
    sat1: 'Rim',
    vol2: 1,
    sat2: '',
    vol3: 1,
    sat3: '',
    vol4: 1,
    sat4: '',
    
    // Nilai Rincian
    nilaiRincianMurni: 2250000,
    nilaiRincian: 2250000,
    subRincian: '',
    keteranganRincian: 'Untuk kebutuhan administrasi ekstrakurikuler',
    keterangan: 'Pembelian kertas untuk dokumentasi kegiatan',
    
    // Anggaran Bulanan (BULAN_1 - BULAN_12)
    anggaranBulan1: 750000,
    anggaranBulan2: 0,
    anggaranBulan3: 0,
    anggaranTw1: 750000,
    anggaranBulan4: 750000,
    anggaranBulan5: 0,
    anggaranBulan6: 0,
    anggaranTw2: 750000,
    anggaranBulan7: 0,
    anggaranBulan8: 0,
    anggaranBulan9: 750000,
    anggaranTw3: 750000,
    anggaranBulan10: 0,
    anggaranBulan11: 0,
    anggaranBulan12: 0,
    anggaranTw4: 0,
    totalAkb: 2250000,
    
    // Realisasi Bulanan (BULAN_1 - BULAN_12)
    realisasiBulan1: 750000,
    realisasiBulan2: 0,
    realisasiBulan3: 0,
    realisasiTw1: 750000,
    realisasiBulan4: 750000,
    realisasiBulan5: 0,
    realisasiBulan6: 0,
    realisasiTw2: 750000,
    realisasiBulan7: 0,
    realisasiBulan8: 0,
    realisasiBulan9: 0,
    realisasiTw3: 0,
    realisasiBulan10: 0,
    realisasiBulan11: 0,
    realisasiBulan12: 0,
    realisasiTw4: 0,
    totalRealisasi: 1500000,
    
    // Metadata
    status: 'Dalam Proses',
    periodYear: 2024,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: '4',
    // Bidang Information
    kodeBidang: '03',
    namaBidang: 'Sarana Prasarana',
    
    // Standar Information
    kodeStandar: '4',
    namaStandar: 'Pengembangan Standar Sarana',
    
    // Kegiatan Information
    idGiat: '535615',
    kodeGiat: '03.2.01.01.1.003',
    namaGiat: '03.01. Pemeliharaan Gedung',
    subtitle: '03.01.01. Kegiatan pemeliharaan rutin gedung sekolah',
    
    // Dana Information
    kodeDana: '3.02.03',
    namaDana: 'BOP Pemeliharaan',
    
    // Rekening Information
    kodeRekening: '5.1.02.02.01.0001',
    namaRekening: 'Belanja Bahan Bangunan',
    
    // Rincian Information
    idRincian: '8674250',
    idKomponen: '3670',
    kodeKomponen: '1.2.01.01.01.0001.00010',
    namaKomponen: 'Cat Tembok',
    
    // Spesifikasi Barang
    satuan: 'Kaleng',
    merk: 'Dulux',
    spek: '25 kg, warna putih',
    pajak: '11%',
    
    // Volume dan Harga
    volume: 20,
    hargaSatuan: 350000,
    koefisien: '20 Kaleng',
    
    // Volume Detail (VOL1-VOL4 dengan SAT1-SAT4)
    vol1: 20,
    sat1: 'Kaleng',
    vol2: 1,
    sat2: '',
    vol3: 1,
    sat3: '',
    vol4: 1,
    sat4: '',
    
    // Nilai Rincian
    nilaiRincianMurni: 7000000,
    nilaiRincian: 7000000,
    subRincian: '',
    keteranganRincian: 'Untuk pengecatan ulang gedung sekolah',
    keterangan: 'Pemeliharaan rutin gedung tahun 2024',
    
    // Anggaran Bulanan (BULAN_1 - BULAN_12)
    anggaranBulan1: 0,
    anggaranBulan2: 0,
    anggaranBulan3: 0,
    anggaranTw1: 0,
    anggaranBulan4: 0,
    anggaranBulan5: 0,
    anggaranBulan6: 7000000,
    anggaranTw2: 7000000,
    anggaranBulan7: 0,
    anggaranBulan8: 0,
    anggaranBulan9: 0,
    anggaranTw3: 0,
    anggaranBulan10: 0,
    anggaranBulan11: 0,
    anggaranBulan12: 0,
    anggaranTw4: 0,
    totalAkb: 7000000,
    
    // Realisasi Bulanan (BULAN_1 - BULAN_12)
    realisasiBulan1: 0,
    realisasiBulan2: 0,
    realisasiBulan3: 0,
    realisasiTw1: 0,
    realisasiBulan4: 0,
    realisasiBulan5: 0,
    realisasiBulan6: 0,
    realisasiTw2: 0,
    realisasiBulan7: 0,
    realisasiBulan8: 0,
    realisasiBulan9: 0,
    realisasiTw3: 0,
    realisasiBulan10: 0,
    realisasiBulan11: 0,
    realisasiBulan12: 0,
    realisasiTw4: 0,
    totalRealisasi: 0,
    
    // Metadata
    status: 'Belum Mulai',
    periodYear: 2024,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: '5',
    // Bidang Information
    kodeBidang: '04',
    namaBidang: 'Tenaga Pendidik',
    
    // Standar Information
    kodeStandar: '5',
    namaStandar: 'Pengembangan Standar PTK',
    
    // Kegiatan Information
    idGiat: '535616',
    kodeGiat: '04.1.01.01.1.004',
    namaGiat: '04.01. Pelatihan Guru',
    subtitle: '04.01.01. Kegiatan peningkatan kompetensi guru',
    
    // Dana Information
    kodeDana: '3.02.04',
    namaDana: 'BOP Pengembangan',
    
    // Rekening Information
    kodeRekening: '5.1.02.03.01.0001',
    namaRekening: 'Belanja Jasa Pelatihan',
    
    // Rincian Information
    idRincian: '8674260',
    idKomponen: '3675',
    kodeKomponen: '1.3.01.01.01.0001.00020',
    namaKomponen: 'Pelatihan Kurikulum Merdeka',
    
    // Spesifikasi Barang
    satuan: 'Orang',
    merk: '',
    spek: 'Pelatihan 3 hari',
    pajak: '0%',
    
    // Volume dan Harga
    volume: 25,
    hargaSatuan: 500000,
    koefisien: '25 Orang x 3 Hari',
    
    // Volume Detail (VOL1-VOL4 dengan SAT1-SAT4)
    vol1: 25,
    sat1: 'Orang',
    vol2: 3,
    sat2: 'Hari',
    vol3: 1,
    sat3: '',
    vol4: 1,
    sat4: '',
    
    // Nilai Rincian
    nilaiRincianMurni: 12500000,
    nilaiRincian: 12500000,
    subRincian: '',
    keteranganRincian: 'Pelatihan implementasi kurikulum merdeka',
    keterangan: 'Peningkatan kompetensi guru dalam kurikulum merdeka',
    
    // Anggaran Bulanan (BULAN_1 - BULAN_12)
    anggaranBulan1: 0,
    anggaranBulan2: 0,
    anggaranBulan3: 12500000,
    anggaranTw1: 12500000,
    anggaranBulan4: 0,
    anggaranBulan5: 0,
    anggaranBulan6: 0,
    anggaranTw2: 0,
    anggaranBulan7: 0,
    anggaranBulan8: 0,
    anggaranBulan9: 0,
    anggaranTw3: 0,
    anggaranBulan10: 0,
    anggaranBulan11: 0,
    anggaranBulan12: 0,
    anggaranTw4: 0,
    totalAkb: 12500000,
    
    // Realisasi Bulanan (BULAN_1 - BULAN_12)
    realisasiBulan1: 0,
    realisasiBulan2: 0,
    realisasiBulan3: 12500000,
    realisasiTw1: 12500000,
    realisasiBulan4: 0,
    realisasiBulan5: 0,
    realisasiBulan6: 0,
    realisasiTw2: 0,
    realisasiBulan7: 0,
    realisasiBulan8: 0,
    realisasiBulan9: 0,
    realisasiTw3: 0,
    realisasiBulan10: 0,
    realisasiBulan11: 0,
    realisasiBulan12: 0,
    realisasiTw4: 0,
    totalRealisasi: 12500000,
    
    // Metadata
    status: 'Selesai',
    periodYear: 2024,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System'
  }
];

// Function to generate additional sample data
export const generateSampleData = (count: number = 10): KertasKerjaPerubahan[] => {
  const bidangOptions = [
    { kode: '01', nama: 'Kurikulum' },
    { kode: '02', nama: 'Kesiswaan' },
    { kode: '03', nama: 'Sarana Prasarana' },
    { kode: '04', nama: 'Tenaga Pendidik' },
    { kode: '05', nama: 'Pembiayaan' }
  ];
  
  const komponenOptions = [
    'Alat Tulis Kantor', 'Kertas A4', 'Tinta Printer', 'Buku Tulis',
    'Papan Tulis', 'Spidol', 'Penghapus', 'Penggaris',
    'Cat Tembok', 'Kuas', 'Paku', 'Sekrup',
    'Komputer', 'Printer', 'Proyektor', 'Speaker'
  ];
  
  const satuanOptions = ['Buah', 'Rim', 'Kaleng', 'Meter', 'Kg', 'Liter', 'Set', 'Unit'];
  
  const generatedData: KertasKerjaPerubahan[] = [];
  
  for (let i = 0; i < count; i++) {
    const bidang = bidangOptions[Math.floor(Math.random() * bidangOptions.length)];
    const komponen = komponenOptions[Math.floor(Math.random() * komponenOptions.length)];
    const satuan = satuanOptions[Math.floor(Math.random() * satuanOptions.length)];
    const volume = Math.floor(Math.random() * 100) + 1;
    const harga = Math.floor(Math.random() * 1000000) + 10000;
    const nilai = volume * harga;
    
    // Random distribution across months
    const monthlyValues = Array(12).fill(0);
    const randomMonth = Math.floor(Math.random() * 12);
    monthlyValues[randomMonth] = nilai;
    
    const item: KertasKerjaPerubahan = {
      id: `generated-${i + 1}`,
      kodeBidang: bidang.kode,
      namaBidang: bidang.nama,
      kodeStandar: String(Math.floor(Math.random() * 5) + 1),
      namaStandar: `Pengembangan Standar ${bidang.nama}`,
      idGiat: String(535600 + i),
      kodeGiat: `${bidang.kode}.${Math.floor(Math.random() * 9) + 1}.01.01.1.${String(i + 1).padStart(3, '0')}`,
      namaGiat: `Kegiatan ${komponen}`,
      subtitle: `Pengadaan ${komponen} untuk ${bidang.nama}`,
      kodeDana: `3.02.${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}`,
      namaDana: 'BOP Alokasi Dasar',
      kodeRekening: `5.1.02.01.01.${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
      namaRekening: `Belanja ${komponen}`,
      idRincian: String(8674200 + i),
      idKomponen: String(3600 + i),
      kodeKomponen: `1.${Math.floor(Math.random() * 9) + 1}.${String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')}.01.01.${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}.${String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0')}`,
      namaKomponen: komponen,
      satuan: satuan,
      merk: Math.random() > 0.5 ? 'Brand ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) : '',
      spek: Math.random() > 0.5 ? 'Spesifikasi standar' : '',
      pajak: Math.random() > 0.5 ? '11%' : '12%',
      volume: volume,
      hargaSatuan: harga,
      koefisien: `${volume} ${satuan}`,
      vol1: volume,
      sat1: satuan,
      vol2: 1,
      sat2: '',
      vol3: 1,
      sat3: '',
      vol4: 1,
      sat4: '',
      nilaiRincianMurni: nilai,
      nilaiRincian: nilai,
      subRincian: '',
      keteranganRincian: `Pengadaan ${komponen}`,
      keterangan: `Untuk kebutuhan ${bidang.nama}`,
      
      // Anggaran bulanan
      anggaranBulan1: monthlyValues[0],
      anggaranBulan2: monthlyValues[1],
      anggaranBulan3: monthlyValues[2],
      anggaranTw1: monthlyValues[0] + monthlyValues[1] + monthlyValues[2],
      anggaranBulan4: monthlyValues[3],
      anggaranBulan5: monthlyValues[4],
      anggaranBulan6: monthlyValues[5],
      anggaranTw2: monthlyValues[3] + monthlyValues[4] + monthlyValues[5],
      anggaranBulan7: monthlyValues[6],
      anggaranBulan8: monthlyValues[7],
      anggaranBulan9: monthlyValues[8],
      anggaranTw3: monthlyValues[6] + monthlyValues[7] + monthlyValues[8],
      anggaranBulan10: monthlyValues[9],
      anggaranBulan11: monthlyValues[10],
      anggaranBulan12: monthlyValues[11],
      anggaranTw4: monthlyValues[9] + monthlyValues[10] + monthlyValues[11],
      totalAkb: nilai,
      
      // Realisasi (random percentage of anggaran)
      realisasiBulan1: Math.floor(monthlyValues[0] * (Math.random() * 0.8 + 0.2)),
      realisasiBulan2: Math.floor(monthlyValues[1] * (Math.random() * 0.8 + 0.2)),
      realisasiBulan3: Math.floor(monthlyValues[2] * (Math.random() * 0.8 + 0.2)),
      realisasiTw1: 0, // Will be calculated
      realisasiBulan4: Math.floor(monthlyValues[3] * (Math.random() * 0.8 + 0.2)),
      realisasiBulan5: Math.floor(monthlyValues[4] * (Math.random() * 0.8 + 0.2)),
      realisasiBulan6: Math.floor(monthlyValues[5] * (Math.random() * 0.8 + 0.2)),
      realisasiTw2: 0, // Will be calculated
      realisasiBulan7: Math.floor(monthlyValues[6] * (Math.random() * 0.8 + 0.2)),
      realisasiBulan8: Math.floor(monthlyValues[7] * (Math.random() * 0.8 + 0.2)),
      realisasiBulan9: Math.floor(monthlyValues[8] * (Math.random() * 0.8 + 0.2)),
      realisasiTw3: 0, // Will be calculated
      realisasiBulan10: Math.floor(monthlyValues[9] * (Math.random() * 0.8 + 0.2)),
      realisasiBulan11: Math.floor(monthlyValues[10] * (Math.random() * 0.8 + 0.2)),
      realisasiBulan12: Math.floor(monthlyValues[11] * (Math.random() * 0.8 + 0.2)),
      realisasiTw4: 0, // Will be calculated
      totalRealisasi: 0, // Will be calculated
      
      status: Math.random() > 0.7 ? 'Selesai' : Math.random() > 0.4 ? 'Dalam Proses' : 'Belum Mulai',
      periodYear: 2024,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'System',
      updatedBy: 'System'
    };
    
    // Calculate quarterly and total realisasi
    item.realisasiTw1 = (item.realisasiBulan1 || 0) + (item.realisasiBulan2 || 0) + (item.realisasiBulan3 || 0);
    item.realisasiTw2 = (item.realisasiBulan4 || 0) + (item.realisasiBulan5 || 0) + (item.realisasiBulan6 || 0);
    item.realisasiTw3 = (item.realisasiBulan7 || 0) + (item.realisasiBulan8 || 0) + (item.realisasiBulan9 || 0);
    item.realisasiTw4 = (item.realisasiBulan10 || 0) + (item.realisasiBulan11 || 0) + (item.realisasiBulan12 || 0);
    item.totalRealisasi = item.realisasiTw1 + item.realisasiTw2 + item.realisasiTw3 + item.realisasiTw4;
    
    generatedData.push(item);
  }
  
  return generatedData;
};

// Export combined data
export const getAllSampleData = (): KertasKerjaPerubahan[] => {
  return [...sampleRKASData, ...generateSampleData(15)];
};