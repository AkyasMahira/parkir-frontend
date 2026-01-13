export interface AreaParkir {
  id_area: number;
  nama_area: string;
  kapasitas: number;
  terisi: number;
}

export interface Tarif {
  id_tarif: number;
  jenis_kendaraan: string;
  tarif_per_jam: number;
}

export interface Transaksi {
  id_transaksi: number;
  plat_nomor: string;
  jenis_kendaraan: string;
  waktu_masuk: string;
  waktu_keluar?: string;
  durasi_jam?: number;
  biaya_total?: number;
  status: "masuk" | "keluar";
  area: AreaParkir; // Relasi Backend
  user?: any;
}