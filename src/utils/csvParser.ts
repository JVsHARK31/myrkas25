export interface KertasKerjaPerubahan {
  kodeBidang: string;
  namaBidang: string;
  kodeStandar: string;
  namaStandar: string;
  idGiat: string;
  kodeGiat: string;
  namaGiat: string;
  subtitle: string;
  kodeDana: string;
  namaDana: string;
  kodeRekening: string;
  namaRekening: string;
  idRincian: string;
  idKomponen: string;
  kodeKomponen: string;
  namaKomponen: string;
  satuan: string;
  merk: string;
  spek: string;
  pajak: string;
  volume: number;
  hargaSatuan: number;
  koefisien: number;
  vol1: number;
  sat1: string;
  vol2: number;
  sat2: string;
  vol3: number;
  sat3: string;
  vol4: number;
  sat4: string;
  nilaiRincianMurni: number;
  nilaiRincian: number;
  subRincian: string;
  keteranganRincian: string;
  keterangan: string;
  // Anggaran Kas Belanja (AKB) per bulan
  akbBulan1: number;
  akbBulan2: number;
  akbBulan3: number;
  akbTw1: number;
  akbBulan4: number;
  akbBulan5: number;
  akbBulan6: number;
  akbTw2: number;
  akbBulan7: number;
  akbBulan8: number;
  akbBulan9: number;
  akbTw3: number;
  akbBulan10: number;
  akbBulan11: number;
  akbBulan12: number;
  akbTw4: number;
  totalAkb: number;
  // Realisasi per bulan
  realisasiBulan1: number;
  realisasiBulan2: number;
  realisasiBulan3: number;
  realisasiTw1: number;
  realisasiBulan4: number;
  realisasiBulan5: number;
  realisasiBulan6: number;
  realisasiTw2: number;
  realisasiBulan7: number;
  realisasiBulan8: number;
  realisasiBulan9: number;
  realisasiTw3: number;
  realisasiBulan10: number;
  realisasiBulan11: number;
  realisasiBulan12: number;
  realisasiTw4: number;
  totalRealisasi: number;
  // Data tambahan
  namaPenyedia: string;
  noPesanan: string;
  tanggal: string;
  noNegosiasi: string;
  tanggalNegosiasi: string;
}

export class CSVParser {
  private static parseNumber(value: string): number {
    if (!value || value.trim() === '' || value.trim() === '-') {
      return 0;
    }
    // Remove dots and replace commas with dots for decimal
    const cleaned = value.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  private static parseString(value: string): string {
    return value ? value.trim() : '';
  }

  static parseCSV(csvContent: string): KertasKerjaPerubahan[] {
    const lines = csvContent.split('\n');
    const data: KertasKerjaPerubahan[] = [];
    
    // Skip header lines (first 3 lines are headers/summary)
    const dataLines = lines.slice(3).filter(line => line.trim() && !line.startsWith(';;;;;'));
    
    for (const line of dataLines) {
      const columns = line.split(';');
      
      // Skip if not enough columns or empty line
      if (columns.length < 70) continue;
      
      try {
        const item: KertasKerjaPerubahan = {
          kodeBidang: this.parseString(columns[0]),
          namaBidang: this.parseString(columns[1]),
          kodeStandar: this.parseString(columns[2]),
          namaStandar: this.parseString(columns[3]),
          idGiat: this.parseString(columns[4]),
          kodeGiat: this.parseString(columns[5]),
          namaGiat: this.parseString(columns[6]),
          subtitle: this.parseString(columns[7]),
          kodeDana: this.parseString(columns[8]),
          namaDana: this.parseString(columns[9]),
          kodeRekening: this.parseString(columns[10]),
          namaRekening: this.parseString(columns[11]),
          idRincian: this.parseString(columns[12]),
          idKomponen: this.parseString(columns[13]),
          kodeKomponen: this.parseString(columns[14]),
          namaKomponen: this.parseString(columns[15]),
          satuan: this.parseString(columns[16]),
          merk: this.parseString(columns[17]),
          spek: this.parseString(columns[18]),
          pajak: this.parseString(columns[19]),
          volume: this.parseNumber(columns[20]),
          hargaSatuan: this.parseNumber(columns[21]),
          koefisien: this.parseNumber(columns[22]),
          vol1: this.parseNumber(columns[23]),
          sat1: this.parseString(columns[24]),
          vol2: this.parseNumber(columns[25]),
          sat2: this.parseString(columns[26]),
          vol3: this.parseNumber(columns[27]),
          sat3: this.parseString(columns[28]),
          vol4: this.parseNumber(columns[29]),
          sat4: this.parseString(columns[30]),
          nilaiRincianMurni: this.parseNumber(columns[31]),
          nilaiRincian: this.parseNumber(columns[32]),
          subRincian: this.parseString(columns[33]),
          keteranganRincian: this.parseString(columns[34]),
          keterangan: this.parseString(columns[35]),
          // AKB columns (36-52)
          akbBulan1: this.parseNumber(columns[36]),
          akbBulan2: this.parseNumber(columns[37]),
          akbBulan3: this.parseNumber(columns[38]),
          akbTw1: this.parseNumber(columns[39]),
          akbBulan4: this.parseNumber(columns[40]),
          akbBulan5: this.parseNumber(columns[41]),
          akbBulan6: this.parseNumber(columns[42]),
          akbTw2: this.parseNumber(columns[43]),
          akbBulan7: this.parseNumber(columns[44]),
          akbBulan8: this.parseNumber(columns[45]),
          akbBulan9: this.parseNumber(columns[46]),
          akbTw3: this.parseNumber(columns[47]),
          akbBulan10: this.parseNumber(columns[48]),
          akbBulan11: this.parseNumber(columns[49]),
          akbBulan12: this.parseNumber(columns[50]),
          akbTw4: this.parseNumber(columns[51]),
          totalAkb: this.parseNumber(columns[52]),
          // Realisasi columns (53-69)
          realisasiBulan1: this.parseNumber(columns[53]),
          realisasiBulan2: this.parseNumber(columns[54]),
          realisasiBulan3: this.parseNumber(columns[55]),
          realisasiTw1: this.parseNumber(columns[56]),
          realisasiBulan4: this.parseNumber(columns[57]),
          realisasiBulan5: this.parseNumber(columns[58]),
          realisasiBulan6: this.parseNumber(columns[59]),
          realisasiTw2: this.parseNumber(columns[60]),
          realisasiBulan7: this.parseNumber(columns[61]),
          realisasiBulan8: this.parseNumber(columns[62]),
          realisasiBulan9: this.parseNumber(columns[63]),
          realisasiTw3: this.parseNumber(columns[64]),
          realisasiBulan10: this.parseNumber(columns[65]),
          realisasiBulan11: this.parseNumber(columns[66]),
          realisasiBulan12: this.parseNumber(columns[67]),
          realisasiTw4: this.parseNumber(columns[68]),
          totalRealisasi: this.parseNumber(columns[69]),
          // Additional data
          namaPenyedia: this.parseString(columns[70] || ''),
          noPesanan: this.parseString(columns[71] || ''),
          tanggal: this.parseString(columns[72] || ''),
          noNegosiasi: this.parseString(columns[73] || ''),
          tanggalNegosiasi: this.parseString(columns[74] || '')
        };
        
        data.push(item);
      } catch (error) {
        console.warn('Error parsing line:', line, error);
      }
    }
    
    return data;
  }

  static async loadCSVFromFile(file: File): Promise<KertasKerjaPerubahan[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = this.parseCSV(content);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file, 'utf-8');
    });
  }

  static async loadCSVFromPath(path: string): Promise<KertasKerjaPerubahan[]> {
    try {
      const response = await fetch(path);
      const content = await response.text();
      return this.parseCSV(content);
    } catch (error) {
      console.error('Error loading CSV from path:', error);
      return [];
    }
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static calculatePercentage(realisasi: number, anggaran: number): number {
    if (anggaran === 0) return 0;
    return (realisasi / anggaran) * 100;
  }

  static getSummaryByBidang(data: KertasKerjaPerubahan[]) {
    const summary = new Map<string, {
      namaBidang: string;
      totalAnggaran: number;
      totalRealisasi: number;
      persentase: number;
      jumlahItem: number;
    }>();

    data.forEach(item => {
      const key = item.kodeBidang;
      const existing = summary.get(key) || {
        namaBidang: item.namaBidang,
        totalAnggaran: 0,
        totalRealisasi: 0,
        persentase: 0,
        jumlahItem: 0
      };

      existing.totalAnggaran += item.totalAkb;
      existing.totalRealisasi += item.totalRealisasi;
      existing.jumlahItem += 1;
      existing.persentase = this.calculatePercentage(existing.totalRealisasi, existing.totalAnggaran);

      summary.set(key, existing);
    });

    return Array.from(summary.values());
  }
}