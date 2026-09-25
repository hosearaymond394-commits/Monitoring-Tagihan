export const VENDORS = [
  "PT ABC Indonesia",
  "PT XYZ Sejahtera",
  "PT Maju Bersama",
  "PT Sumber Makmur",
  "PT Indo Putra",
  "PT Karya Utama",
  "PT Global Mitra",
  "PT Sejahtera Abadi"
];

export const DSP_LIST = [
  "DSP Surabaya",
  "DSP Jakarta",
  "DSP Medan",
  "DSP Semarang",
  "DSP Makassar",
  "Plant Cilacap"
];

export const JENIS_LIST = [
  "Jasa Distribusi",
  "Sewa Kendaraan",
  "Maintenance Alat",
  "Pengadaan Barang",
  "Jasa Konsultasi"
];

export const DISTRIBUTION_PIC_LIST = [
  "Raymond Hosea",
  "Siti Aminah",
  "Budi Santoso",
  "Dewi Lestari",
  "Agus Wijaya"
];

export const FINANCE_PIC_LIST = [
  "Siti Aminah",
  "Budi Santoso",
  "Dewi Lestari"
];

export const CURRENT_USER = {
  name: "Raymond Hosea",
  role: "DISTRIBUTION" as const,
  roleLabel: "Distribution"
};

export const PAYMENT_TERMS = [
  { kode: "NET30", nama: "Net 30 Hari", hari: 30 },
  { kode: "NET45", nama: "Net 45 Hari", hari: 45 },
  { kode: "NET14", nama: "Net 14 Hari", hari: 14 },
  { kode: "COD", nama: "Cash on Delivery", hari: 0 }
];

export const STATUS_REFERENCE = [
  { kode: "SUB", nama: "SUBMITTED", desc: "Tagihan telah disubmit, menunggu verifikasi Finance" },
  { kode: "FIN", nama: "FINANCE PROCESS", desc: "Sedang diverifikasi & diproses oleh Finance" },
  { kode: "SAP", nama: "SAP POSTED", desc: "Invoice telah diposting ke sistem SAP" },
  { kode: "PAY", nama: "PAID", desc: "Pembayaran ke vendor telah selesai" },
  { kode: "RET", nama: "RETURN / REVISI", desc: "Dikembalikan ke Distribution untuk revisi" },
  { kode: "CLS", nama: "CLOSED", desc: "Tagihan dinyatakan selesai & ditutup" }
];
