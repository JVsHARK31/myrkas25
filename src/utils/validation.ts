import { KertasKerjaPerubahan } from './csvParser';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown, data?: KertasKerjaPerubahan) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Comprehensive validation rules for all fields
export const kertasKerjaValidationRules: ValidationRules = {
  // Bidang Information
  kodeBidang: {
    required: true,
    minLength: 1,
    maxLength: 10,
    pattern: /^[0-9A-Z.]+$/,
  },
  namaBidang: {
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  
  // Standar Information
  kodeStandar: {
    maxLength: 10,
  },
  namaStandar: {
    maxLength: 255,
  },
  
  // New Fields
  bidangKegiatan: {
    required: true,
    maxLength: 50,
  },
  standarNasional: {
    required: true,
    maxLength: 50,
  },
  sumberDana: {
    required: true,
    maxLength: 50,
  },
  
  // Kegiatan Information
  idGiat: {
    maxLength: 20,
  },
  kodeGiat: {
    required: true,
    minLength: 5,
    maxLength: 50,
    pattern: /^[0-9.]+$/,
  },
  namaGiat: {
    required: true,
    minLength: 5,
    maxLength: 500,
  },
  subtitle: {
    maxLength: 1000,
  },
  
  // Dana Information
  kodeDana: {
    maxLength: 20,
    pattern: /^[0-9.]*$/,
  },
  namaDana: {
    maxLength: 255,
  },
  
  // Rekening Information
  kodeRekening: {
    required: true,
    minLength: 5,
    maxLength: 50,
    pattern: /^[0-9.]+$/,
  },
  namaRekening: {
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  
  // Rincian Information
  idRincian: {
    maxLength: 20,
  },
  idKomponen: {
    maxLength: 20,
  },
  kodeKomponen: {
    maxLength: 50,
  },
  namaKomponen: {
    maxLength: 255,
  },
  
  // Spesifikasi
  satuan: {
    maxLength: 50,
  },
  merk: {
    maxLength: 255,
  },
  spek: {
    maxLength: 1000,
  },
  pajak: {
    maxLength: 10,
    pattern: /^[0-9]+%?$/,
  },
  
  // Volume dan Harga
  volume: {
    min: 0,
    max: 999999999,
    custom: (value: unknown) => {
      const numValue = Number(value);
      if (numValue < 0) return 'Volume tidak boleh negatif';
      return null;
    },
  },
  hargaSatuan: {
    min: 0,
    max: 999999999999,
    custom: (value: unknown) => {
      const numValue = Number(value);
      if (numValue < 0) return 'Harga satuan tidak boleh negatif';
      return null;
    },
  },
  koefisien: {
    maxLength: 50,
  },
  
  // Volume Detail
  vol1: { min: 0, max: 999999999 },
  vol2: { min: 0, max: 999999999 },
  vol3: { min: 0, max: 999999999 },
  vol4: { min: 0, max: 999999999 },
  sat1: { maxLength: 50 },
  sat2: { maxLength: 50 },
  sat3: { maxLength: 50 },
  sat4: { maxLength: 50 },
  
  // Nilai Rincian
  nilaiRincianMurni: {
    min: 0,
    max: 999999999999,
  },
  nilaiRincian: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.volume && data.hargaSatuan) {
        const calculated = data.volume * data.hargaSatuan;
        if (Math.abs(value - calculated) > 1) {
          return 'Nilai rincian harus sesuai dengan volume × harga satuan';
        }
      }
      return null;
    },
  },
  subRincian: {
    maxLength: 255,
  },
  keteranganRincian: {
    maxLength: 1000,
  },
  keterangan: {
    maxLength: 1000,
  },
  
  // Anggaran Bulanan
  anggaranBulan1: { min: 0, max: 999999999999 },
  anggaranBulan2: { min: 0, max: 999999999999 },
  anggaranBulan3: { min: 0, max: 999999999999 },
  anggaranBulan4: { min: 0, max: 999999999999 },
  anggaranBulan5: { min: 0, max: 999999999999 },
  anggaranBulan6: { min: 0, max: 999999999999 },
  anggaranBulan7: { min: 0, max: 999999999999 },
  anggaranBulan8: { min: 0, max: 999999999999 },
  anggaranBulan9: { min: 0, max: 999999999999 },
  anggaranBulan10: { min: 0, max: 999999999999 },
  anggaranBulan11: { min: 0, max: 999999999999 },
  anggaranBulan12: { min: 0, max: 999999999999 },
  
  // Anggaran Triwulanan
  anggaranTw1: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data) {
        const calculated = (data.anggaranBulan1 || 0) + (data.anggaranBulan2 || 0) + (data.anggaranBulan3 || 0);
        if (Math.abs(value - calculated) > 1) {
          return 'TW 1 harus sama dengan jumlah Bulan 1-3';
        }
      }
      return null;
    },
  },
  anggaranTw2: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data) {
        const calculated = (data.anggaranBulan4 || 0) + (data.anggaranBulan5 || 0) + (data.anggaranBulan6 || 0);
        if (Math.abs(value - calculated) > 1) {
          return 'TW 2 harus sama dengan jumlah Bulan 4-6';
        }
      }
      return null;
    },
  },
  anggaranTw3: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data) {
        const calculated = (data.anggaranBulan7 || 0) + (data.anggaranBulan8 || 0) + (data.anggaranBulan9 || 0);
        if (Math.abs(value - calculated) > 1) {
          return 'TW 3 harus sama dengan jumlah Bulan 7-9';
        }
      }
      return null;
    },
  },
  anggaranTw4: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data) {
        const calculated = (data.anggaranBulan10 || 0) + (data.anggaranBulan11 || 0) + (data.anggaranBulan12 || 0);
        if (Math.abs(value - calculated) > 1) {
          return 'TW 4 harus sama dengan jumlah Bulan 10-12';
        }
      }
      return null;
    },
  },
  
  // Total AKB
  totalAkb: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data) {
        const calculated = (data.anggaranTw1 || 0) + (data.anggaranTw2 || 0) + (data.anggaranTw3 || 0) + (data.anggaranTw4 || 0);
        if (Math.abs(value - calculated) > 1) {
          return 'Total AKB harus sama dengan jumlah semua triwulan';
        }
      }
      return null;
    },
  },
  
  // Realisasi Bulanan
  realisasiBulan1: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan1 && value > data.anggaranBulan1) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  realisasiBulan2: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan2 && value > data.anggaranBulan2) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  realisasiBulan3: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan3 && value > data.anggaranBulan3) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  realisasiBulan4: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan4 && value > data.anggaranBulan4) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  realisasiBulan5: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan5 && value > data.anggaranBulan5) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  realisasiBulan6: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan6 && value > data.anggaranBulan6) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  realisasiBulan7: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan7 && value > data.anggaranBulan7) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  realisasiBulan8: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan8 && value > data.anggaranBulan8) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  realisasiBulan9: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan9 && value > data.anggaranBulan9) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  realisasiBulan10: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan10 && value > data.anggaranBulan10) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  realisasiBulan11: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan11 && value > data.anggaranBulan11) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  realisasiBulan12: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data && data.anggaranBulan12 && value > data.anggaranBulan12) {
        return 'Realisasi tidak boleh melebihi anggaran';
      }
      return null;
    },
  },
  
  // Realisasi Triwulanan
  realisasiTw1: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data) {
        const calculated = (data.realisasiBulan1 || 0) + (data.realisasiBulan2 || 0) + (data.realisasiBulan3 || 0);
        if (Math.abs(value - calculated) > 1) {
          return 'Realisasi TW 1 harus sama dengan jumlah realisasi Bulan 1-3';
        }
        if (data.anggaranTw1 && value > data.anggaranTw1) {
          return 'Realisasi TW 1 tidak boleh melebihi anggaran TW 1';
        }
      }
      return null;
    },
  },
  realisasiTw2: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data) {
        const calculated = (data.realisasiBulan4 || 0) + (data.realisasiBulan5 || 0) + (data.realisasiBulan6 || 0);
        if (Math.abs(value - calculated) > 1) {
          return 'Realisasi TW 2 harus sama dengan jumlah realisasi Bulan 4-6';
        }
        if (data.anggaranTw2 && value > data.anggaranTw2) {
          return 'Realisasi TW 2 tidak boleh melebihi anggaran TW 2';
        }
      }
      return null;
    },
  },
  realisasiTw3: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data) {
        const calculated = (data.realisasiBulan7 || 0) + (data.realisasiBulan8 || 0) + (data.realisasiBulan9 || 0);
        if (Math.abs(value - calculated) > 1) {
          return 'Realisasi TW 3 harus sama dengan jumlah realisasi Bulan 7-9';
        }
        if (data.anggaranTw3 && value > data.anggaranTw3) {
          return 'Realisasi TW 3 tidak boleh melebihi anggaran TW 3';
        }
      }
      return null;
    },
  },
  realisasiTw4: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data) {
        const calculated = (data.realisasiBulan10 || 0) + (data.realisasiBulan11 || 0) + (data.realisasiBulan12 || 0);
        if (Math.abs(value - calculated) > 1) {
          return 'Realisasi TW 4 harus sama dengan jumlah realisasi Bulan 10-12';
        }
        if (data.anggaranTw4 && value > data.anggaranTw4) {
          return 'Realisasi TW 4 tidak boleh melebihi anggaran TW 4';
        }
      }
      return null;
    },
  },
  
  // Total Realisasi
  totalRealisasi: {
    min: 0,
    max: 999999999999,
    custom: (value: number, data?: KertasKerjaPerubahan) => {
      if (data) {
        const calculated = (data.realisasiTw1 || 0) + (data.realisasiTw2 || 0) + (data.realisasiTw3 || 0) + (data.realisasiTw4 || 0);
        if (Math.abs(value - calculated) > 1) {
          return 'Total realisasi harus sama dengan jumlah semua triwulan realisasi';
        }
        if (data.totalAkb && value > data.totalAkb) {
          return 'Total realisasi tidak boleh melebihi total AKB';
        }
      }
      return null;
    },
  },
};

// Validation functions
export function validateField(fieldName: string, value: unknown, data?: KertasKerjaPerubahan): string | null {
  const rule = kertasKerjaValidationRules[fieldName];
  if (!rule) return null;

  // Required validation
  if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${getFieldLabel(fieldName)} wajib diisi`;
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  // String validations
  if (typeof value === 'string') {
    if (rule.minLength && value.length < rule.minLength) {
      return `${getFieldLabel(fieldName)} minimal ${rule.minLength} karakter`;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${getFieldLabel(fieldName)} maksimal ${rule.maxLength} karakter`;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return `${getFieldLabel(fieldName)} format tidak valid`;
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rule.min !== undefined && value < rule.min) {
      return `${getFieldLabel(fieldName)} minimal ${rule.min}`;
    }
    if (rule.max !== undefined && value > rule.max) {
      return `${getFieldLabel(fieldName)} maksimal ${rule.max}`;
    }
  }

  // Custom validation
  if (rule.custom) {
    const customError = rule.custom(value, data);
    if (customError) {
      return customError;
    }
  }

  return null;
}

export function validateForm(data: KertasKerjaPerubahan): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate all fields
  Object.keys(kertasKerjaValidationRules).forEach(fieldName => {
    const value = (data as Record<string, unknown>)[fieldName];
    const error = validateField(fieldName, value, data);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
}

export function getFieldLabel(fieldName: string): string {
  const labels: { [key: string]: string } = {
    kodeBidang: 'Kode Bidang',
    namaBidang: 'Nama Bidang',
    kodeStandar: 'Kode Standar',
    namaStandar: 'Nama Standar',
    bidangKegiatan: 'Bidang Kegiatan',
    standarNasional: 'Standar Nasional',
    sumberDana: 'Sumber Dana',
    idGiat: 'ID Kegiatan',
    kodeGiat: 'Kode Kegiatan',
    namaGiat: 'Nama Kegiatan',
    subtitle: 'Subtitle',
    kodeDana: 'Kode Dana',
    namaDana: 'Nama Dana',
    kodeRekening: 'Kode Rekening',
    namaRekening: 'Nama Rekening',
    idRincian: 'ID Rincian',
    idKomponen: 'ID Komponen',
    kodeKomponen: 'Kode Komponen',
    namaKomponen: 'Nama Komponen',
    satuan: 'Satuan',
    merk: 'Merk',
    spek: 'Spesifikasi',
    pajak: 'Pajak',
    volume: 'Volume',
    hargaSatuan: 'Harga Satuan',
    koefisien: 'Koefisien',
    vol1: 'Volume 1',
    sat1: 'Satuan 1',
    vol2: 'Volume 2',
    sat2: 'Satuan 2',
    vol3: 'Volume 3',
    sat3: 'Satuan 3',
    vol4: 'Volume 4',
    sat4: 'Satuan 4',
    nilaiRincianMurni: 'Nilai Rincian Murni',
    nilaiRincian: 'Nilai Rincian',
    subRincian: 'Sub Rincian',
    keteranganRincian: 'Keterangan Rincian',
    keterangan: 'Keterangan',
    anggaranBulan1: 'Anggaran Bulan 1',
    anggaranBulan2: 'Anggaran Bulan 2',
    anggaranBulan3: 'Anggaran Bulan 3',
    anggaranBulan4: 'Anggaran Bulan 4',
    anggaranBulan5: 'Anggaran Bulan 5',
    anggaranBulan6: 'Anggaran Bulan 6',
    anggaranBulan7: 'Anggaran Bulan 7',
    anggaranBulan8: 'Anggaran Bulan 8',
    anggaranBulan9: 'Anggaran Bulan 9',
    anggaranBulan10: 'Anggaran Bulan 10',
    anggaranBulan11: 'Anggaran Bulan 11',
    anggaranBulan12: 'Anggaran Bulan 12',
    anggaranTw1: 'Anggaran TW 1',
    anggaranTw2: 'Anggaran TW 2',
    anggaranTw3: 'Anggaran TW 3',
    anggaranTw4: 'Anggaran TW 4',
    totalAkb: 'Total AKB',
    realisasiBulan1: 'Realisasi Bulan 1',
    realisasiBulan2: 'Realisasi Bulan 2',
    realisasiBulan3: 'Realisasi Bulan 3',
    realisasiBulan4: 'Realisasi Bulan 4',
    realisasiBulan5: 'Realisasi Bulan 5',
    realisasiBulan6: 'Realisasi Bulan 6',
    realisasiBulan7: 'Realisasi Bulan 7',
    realisasiBulan8: 'Realisasi Bulan 8',
    realisasiBulan9: 'Realisasi Bulan 9',
    realisasiBulan10: 'Realisasi Bulan 10',
    realisasiBulan11: 'Realisasi Bulan 11',
    realisasiBulan12: 'Realisasi Bulan 12',
    realisasiTw1: 'Realisasi TW 1',
    realisasiTw2: 'Realisasi TW 2',
    realisasiTw3: 'Realisasi TW 3',
    realisasiTw4: 'Realisasi TW 4',
    totalRealisasi: 'Total Realisasi',
  };

  return labels[fieldName] || fieldName;
}

// Auto-calculation functions
export function autoCalculateFields(data: Partial<KertasKerjaPerubahan>): Partial<KertasKerjaPerubahan> {
  const result = { ...data };

  // Calculate nilai rincian from volume and harga satuan
  if (result.volume && result.hargaSatuan) {
    result.nilaiRincian = result.volume * result.hargaSatuan;
  }

  // Calculate quarterly totals from monthly values
  result.anggaranTw1 = (result.anggaranBulan1 || 0) + (result.anggaranBulan2 || 0) + (result.anggaranBulan3 || 0);
  result.anggaranTw2 = (result.anggaranBulan4 || 0) + (result.anggaranBulan5 || 0) + (result.anggaranBulan6 || 0);
  result.anggaranTw3 = (result.anggaranBulan7 || 0) + (result.anggaranBulan8 || 0) + (result.anggaranBulan9 || 0);
  result.anggaranTw4 = (result.anggaranBulan10 || 0) + (result.anggaranBulan11 || 0) + (result.anggaranBulan12 || 0);

  result.realisasiTw1 = (result.realisasiBulan1 || 0) + (result.realisasiBulan2 || 0) + (result.realisasiBulan3 || 0);
  result.realisasiTw2 = (result.realisasiBulan4 || 0) + (result.realisasiBulan5 || 0) + (result.realisasiBulan6 || 0);
  result.realisasiTw3 = (result.realisasiBulan7 || 0) + (result.realisasiBulan8 || 0) + (result.realisasiBulan9 || 0);
  result.realisasiTw4 = (result.realisasiBulan10 || 0) + (result.realisasiBulan11 || 0) + (result.realisasiBulan12 || 0);

  // Calculate total AKB and total realisasi
  result.totalAkb = (result.anggaranTw1 || 0) + (result.anggaranTw2 || 0) + (result.anggaranTw3 || 0) + (result.anggaranTw4 || 0);
  result.totalRealisasi = (result.realisasiTw1 || 0) + (result.realisasiTw2 || 0) + (result.realisasiTw3 || 0) + (result.realisasiTw4 || 0);

  return result;
}

// Utility functions
export function formatValidationError(error: string): string {
  return error;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function getFirstError(errors: ValidationErrors): string | null {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
}

export function clearValidationErrors(): ValidationErrors {
  return {};
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
}

export function parseFormattedNumber(value: string): number {
  if (!value || value.trim() === '') return 0;
  // Remove dots and replace commas with dots for decimal
  const cleaned = value.replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}