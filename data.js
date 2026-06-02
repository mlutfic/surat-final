/* ============================================================
   SISTEM SURAT — Mock data (Bahasa Indonesia)
   ============================================================ */

const OFFICE = {
  nama: "Dinas Komunikasi & Informatika",
  pemda: "Pemerintah Kota Praja Mandala",
  alamat: "Jl. Merdeka Timur No. 17, Kel. Sukamaju, Kec. Praja Tengah, Kota Praja Mandala 41100",
  telp: "(0260) 555-1820",
  email: "diskominfo@prajamandala.go.id",
  web: "diskominfo.prajamandala.go.id",
  kepala: "Drs. H. Bambang Wijaya, M.Si.",
  nip: "19710512 199503 1 008",
  jam: "Senin–Jumat, 07.30–16.00 WIB",
  berdiri: "12 Agustus 2008",
};

const SIFAT = {
  Biasa:   "b-biasa",
  Penting: "b-penting",
  Segera:  "b-segera",
  Rahasia: "b-rahasia",
};

const JENIS_LAYANAN = [
  "Surat Keterangan Domisili", "Surat Izin Keramaian", "Surat Rekomendasi",
  "Surat Permohonan Data", "Surat Keterangan Usaha", "Surat Pengantar",
  "Permohonan Audiensi", "Surat Dispensasi",
];

const SURAT_MASUK = [
  { no: "SM-2026-0148", nomor: "005/421/BKD/VI/2026", tgl: "31 Mei 2026", asal: "Badan Kepegawaian Daerah", tujuan: "Sekretariat", perihal: "Undangan Rapat Koordinasi Kepegawaian", layanan: "Permohonan Audiensi", sifat: "Penting", status: "Baru", file: "und-rakor-bkd.pdf" },
  { no: "SM-2026-0147", nomor: "094/118/DPMPTSP/V/2026", tgl: "30 Mei 2026", asal: "DPMPTSP Kota Praja", tujuan: "Bidang Aplikasi", perihal: "Permohonan Integrasi Data Perizinan", layanan: "Surat Permohonan Data", sifat: "Segera", status: "Diproses", file: "permohonan-data-ptsp.pdf" },
  { no: "SM-2026-0146", nomor: "070/093/SETDA/V/2026", tgl: "29 Mei 2026", asal: "Sekretariat Daerah", tujuan: "Kepala Dinas", perihal: "Edaran Penyusunan LKPJ 2026", layanan: "Surat Pengantar", sifat: "Biasa", status: "Selesai", file: "edaran-lkpj.pdf" },
  { no: "SM-2026-0145", nomor: "451/067/MUI/V/2026", tgl: "28 Mei 2026", asal: "MUI Kota Praja", tujuan: "Sekretariat", perihal: "Permohonan Publikasi Jadwal Imsakiyah", layanan: "Surat Rekomendasi", sifat: "Biasa", status: "Selesai", file: "permohonan-mui.pdf" },
  { no: "SM-2026-0144", nomor: "800/210/INSP/V/2026", tgl: "27 Mei 2026", asal: "Inspektorat Daerah", tujuan: "Kepala Dinas", perihal: "Pemberitahuan Audit Reguler Semester I", layanan: "Surat Pengantar", sifat: "Rahasia", status: "Diproses", file: "audit-inspektorat.pdf" },
  { no: "SM-2026-0143", nomor: "005/388/DISDIK/V/2026", tgl: "26 Mei 2026", asal: "Dinas Pendidikan", tujuan: "Bidang Aplikasi", perihal: "Undangan Sosialisasi PPDB Online", layanan: "Permohonan Audiensi", sifat: "Penting", status: "Selesai", file: "sosialisasi-ppdb.pdf" },
  { no: "SM-2026-0142", nomor: "027/154/BPKAD/V/2026", tgl: "24 Mei 2026", asal: "BPKAD", tujuan: "Sub Bagian Keuangan", perihal: "Permohonan Data Realisasi Anggaran", layanan: "Surat Permohonan Data", sifat: "Segera", status: "Selesai", file: "data-anggaran.pdf" },
  { no: "SM-2026-0141", nomor: "145/072/KEC-PT/V/2026", tgl: "22 Mei 2026", asal: "Kecamatan Praja Tengah", tujuan: "Sekretariat", perihal: "Surat Keterangan Domisili Kantor", layanan: "Surat Keterangan Domisili", sifat: "Biasa", status: "Selesai", file: "domisili-kantor.pdf" },
];

const SURAT_KELUAR = [
  { no: "SK-2026-0231", nomor: "005/512/DKI/VI/2026", tgl: "31 Mei 2026", asal: "Bidang Aplikasi", tujuan: "Seluruh OPD Kota Praja", perihal: "Edaran Migrasi Surel Resmi @prajamandala.go.id", sifat: "Penting", status: "Terkirim", file: "edaran-migrasi-surel.pdf" },
  { no: "SK-2026-0230", nomor: "005/509/DKI/V/2026", tgl: "30 Mei 2026", asal: "Kepala Dinas", tujuan: "Sekretariat Daerah", perihal: "Laporan Bulanan Layanan Informasi Publik", sifat: "Biasa", status: "Terkirim", file: "laporan-pid.pdf" },
  { no: "SK-2026-0229", nomor: "094/507/DKI/V/2026", tgl: "29 Mei 2026", asal: "Bidang Statistik", tujuan: "BPS Kota Praja", perihal: "Permohonan Validasi Data Sektoral 2026", sifat: "Segera", status: "Terkirim", file: "validasi-data.pdf" },
  { no: "SK-2026-0228", nomor: "005/498/DKI/V/2026", tgl: "27 Mei 2026", asal: "Sekretariat", tujuan: "Inspektorat Daerah", perihal: "Tanggapan atas Pemberitahuan Audit Reguler", sifat: "Rahasia", status: "Draft", file: "tanggapan-audit.pdf" },
  { no: "SK-2026-0227", nomor: "027/495/DKI/V/2026", tgl: "26 Mei 2026", asal: "Sub Bagian Keuangan", tujuan: "BPKAD", perihal: "Pengajuan Revisi Anggaran Kas Triwulan II", sifat: "Penting", status: "Terkirim", file: "revisi-anggaran.pdf" },
  { no: "SK-2026-0226", nomor: "800/489/DKI/V/2026", tgl: "23 Mei 2026", asal: "Sub Bagian Umum", tujuan: "BKD Kota Praja", perihal: "Usulan Mutasi dan Kenaikan Pangkat ASN", sifat: "Biasa", status: "Terkirim", file: "usulan-mutasi.pdf" },
  { no: "SK-2026-0225", nomor: "005/480/DKI/V/2026", tgl: "21 Mei 2026", asal: "Bidang Aplikasi", tujuan: "Dinas Pendidikan", perihal: "Kesiapan Infrastruktur PPDB Online 2026", sifat: "Penting", status: "Terkirim", file: "kesiapan-ppdb.pdf" },
];

const PEGAWAI = [
  { nama: "Drs. H. Bambang Wijaya, M.Si.", nip: "19710512 199503 1 008", jabatan: "Kepala Dinas", gol: "IV/c", unit: "Pimpinan", status: "PNS" },
  { nama: "Ir. Retno Kusumawati, M.T.", nip: "19740822 200012 2 003", jabatan: "Sekretaris Dinas", gol: "IV/b", unit: "Sekretariat", status: "PNS" },
  { nama: "Ahmad Fauzi, S.Kom., M.Kom.", nip: "19820317 200604 1 012", jabatan: "Kepala Bidang Aplikasi & Informatika", gol: "IV/a", unit: "Bidang Aplikasi", status: "PNS" },
  { nama: "Dewi Anggraini, S.E.", nip: "19850905 200901 2 015", jabatan: "Kepala Bidang Statistik & Persandian", gol: "III/d", unit: "Bidang Statistik", status: "PNS" },
  { nama: "Hendra Gunawan, S.T.", nip: "19880214 201101 1 009", jabatan: "Kepala Bidang Informasi & Komunikasi Publik", gol: "III/d", unit: "Bidang IKP", status: "PNS" },
  { nama: "Siti Nurhaliza, S.I.Kom.", nip: "19910630 201503 2 006", jabatan: "Analis Media & Komunikasi", gol: "III/b", unit: "Bidang IKP", status: "PNS" },
  { nama: "Rizky Pratama, A.Md.", nip: "19930411 201803 1 004", jabatan: "Pranata Komputer", gol: "II/d", unit: "Bidang Aplikasi", status: "PNS" },
  { nama: "Maya Lestari, S.Sos.", nip: "—", jabatan: "Pengelola Arsip Persuratan", gol: "—", unit: "Sekretariat", status: "PPPK" },
  { nama: "Andi Saputra", nip: "—", jabatan: "Operator Persuratan", gol: "—", unit: "Sekretariat", status: "Honorer" },
];

const AKUN = [
  { nama: "Drs. H. Bambang Wijaya", user: "bambang.wijaya", email: "kadis@prajamandala.go.id", role: "Super Admin", unit: "Pimpinan", aktif: true, last: "31 Mei 2026, 08:14" },
  { nama: "Ir. Retno Kusumawati", user: "retno.k", email: "sekretaris@prajamandala.go.id", role: "Admin", unit: "Sekretariat", aktif: true, last: "31 Mei 2026, 07:52" },
  { nama: "Maya Lestari", user: "maya.arsip", email: "arsip@prajamandala.go.id", role: "Admin", unit: "Sekretariat", aktif: true, last: "31 Mei 2026, 09:03" },
  { nama: "Andi Saputra", user: "andi.ops", email: "operator@prajamandala.go.id", role: "User", unit: "Sekretariat", aktif: true, last: "30 Mei 2026, 16:41" },
  { nama: "Rizky Pratama", user: "rizky.it", email: "rizky@prajamandala.go.id", role: "Admin", unit: "Bidang Aplikasi", aktif: true, last: "31 Mei 2026, 08:30" },
  { nama: "Siti Nurhaliza", user: "siti.ikp", email: "siti@prajamandala.go.id", role: "User", unit: "Bidang IKP", aktif: false, last: "18 Mei 2026, 14:22" },
];

const PENGADUAN = [
  { nama: "Joko Susilo", umur: 41, hp: "0812-3344-5566", alamat: "Perum Griya Asri Blok C2, Kel. Sukamaju", pesan: "Mohon layanan informasi publik melalui website dipercepat, balasan permohonan data saya sudah 2 minggu belum ada kabar.", tgl: "30 Mei 2026", status: "Baru" },
  { nama: "Ratna Sari", umur: 29, hp: "0857-8899-1122", alamat: "Jl. Cempaka No. 8, Kel. Praja Indah", pesan: "Terima kasih, pelayanan pembuatan surat keterangan domisili sangat cepat dan petugasnya ramah.", tgl: "28 Mei 2026", status: "Selesai" },
  { nama: "Bagus Hermawan", umur: 35, hp: "0813-2211-7788", alamat: "Jl. Diponegoro No. 45, Kec. Praja Tengah", pesan: "Saran: tambahkan fitur pelacakan status surat secara online agar masyarakat tidak perlu datang ke kantor.", tgl: "26 Mei 2026", status: "Ditindaklanjuti" },
];

const SURVEI_UNSUR = [
  "Persyaratan pelayanan",
  "Prosedur & kemudahan",
  "Kecepatan waktu pelayanan",
  "Kewajaran biaya / tarif",
  "Kesesuaian hasil layanan",
  "Kompetensi petugas",
  "Kesopanan & keramahan",
  "Sarana & prasarana",
  "Penanganan pengaduan",
];

const SURVEI_HASIL = { ikm: 87.4, mutu: "A", responden: 1248, periode: "Triwulan I 2026" };

const AVATAR_COLORS = ["#3056a8", "#1f7a55", "#9a6b1e", "#7a3e8f", "#1f6f8f", "#9a3344"];
function avatarColor(s){ let h=0; for(let i=0;i<s.length;i++) h=s.charCodeAt(i)+((h<<5)-h); return AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length]; }
function initials(n){ return n.replace(/[^A-Za-z. ]/g,"").split(" ").filter(w=>w.length>1&&w[0]===w[0].toUpperCase()).slice(0,2).map(w=>w[0]).join("").toUpperCase()||n.slice(0,2).toUpperCase(); }

Object.assign(window, { OFFICE, SIFAT, JENIS_LAYANAN, SURAT_MASUK, SURAT_KELUAR, PEGAWAI, AKUN, PENGADUAN, SURVEI_UNSUR, SURVEI_HASIL, avatarColor, initials });
