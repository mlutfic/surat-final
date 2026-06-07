/* ============================================================
   SISTEM SURAT — Mock data (Bahasa Indonesia)
   ============================================================ */

const OFFICE = {
  nama: "Pemerintah Kecamatan Air Hitam",
  pemda: "Kabupaten Sarolangun",
  alamat: "Padang Lalang, Desa Jernih, Kecamatan Air Hitam, Kabupaten Sarolangun, Provinsi Jambi",
  telp: "-",
  email: "kantorcamatairhitam@gmail.com",
  web: "-",
  kepala: "FATHURRAHMAN, S.STP",
  nip: "198609102004121002",
  jabatanKepala: "Camat Air Hitam",
  pangkatKepala: "Pembina (IV/a)",
  jam: "Senin-Kamis, 07.30-16.45 WIB; Jumat, 07.30-11.30 WIB",
  berdiri: "Peraturan Daerah Kabupaten Sarolangun Nomor 04 Tahun 2004",
};

const APP_INFO = {
  nama: "DILAN CERDAS",
  kepanjangan: "Digitalisasi Layanan yang Cepat, Responsif, Dinamis, Akuntabel, dan Sistematis",
  tagline: "Layanan digital Kecamatan Air Hitam untuk warga dan petugas.",
  latar:
    "Sebagian layanan masih dicatat manual dan sulit dipantau. DILAN CERDAS dibuat agar warga lebih mudah mengurus layanan, sementara petugas dapat bekerja lebih rapi.",
  konsep:
    "Satu aplikasi untuk informasi layanan, permohonan surat, pengaduan, survei kepuasan, dan arsip digital kecamatan.",
  tujuan: [
    "Mempercepat layanan administrasi kecamatan.",
    "Membuat alur kerja lebih jelas dan mudah dipantau.",
    "Memudahkan warga memperoleh informasi layanan.",
    "Merapikan pencatatan dan arsip dokumen.",
    "Menyediakan kanal pengaduan masyarakat.",
    "Mendukung evaluasi layanan melalui survei IKM.",
    "Membantu petugas bekerja lebih tertib dan responsif.",
  ],
  dasarHukum: [
    "Undang-Undang Nomor 25 Tahun 2009 tentang Pelayanan Publik.",
    "Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah.",
    "Peraturan Pemerintah Nomor 38 Tahun 2017 tentang Inovasi Daerah.",
    "Peraturan Presiden Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE).",
    "Peraturan Menteri Dalam Negeri Nomor 104 Tahun 2018 tentang Penilaian dan Pemberian Penghargaan dan/atau Insentif Inovasi Daerah.",
    "Peraturan Daerah Kabupaten Sarolangun Nomor 04 Tahun 2004 tentang Pembentukan Kecamatan Air Hitam.",
    "Peraturan Daerah Kabupaten Sarolangun Nomor 6 Tahun 2025 tentang Perubahan Keempat atas Peraturan Daerah Kabupaten Sarolangun Nomor 5 Tahun 2016 tentang Pembentukan dan Susunan Perangkat Daerah.",
  ],
  mekanisme: [
    "Digitalisasi administrasi pelayanan.",
    "Penggunaan aplikasi atau media layanan online.",
    "Penyediaan layanan informasi terpadu.",
    "Sistem pengarsipan digital.",
    "Monitoring dan evaluasi pelayanan secara berkala.",
    "Penyediaan kanal pengaduan dan konsultasi masyarakat.",
    "Peningkatan kapasitas SDM pengelola layanan.",
  ],
};

const SIFAT = {
  Biasa:   "b-biasa",
  Penting: "b-penting",
  Segera:  "b-segera",
  Rahasia: "b-rahasia",
};

const JENIS_LAYANAN = [
  "Surat Pengantar Perbaikan Data KTP",
  "Surat Pengantar Perbaikan Data KK / Pemisahan KK",
  "Surat Rekomendasi Izin Kegiatan / Keramaian",
  "Surat Rekomendasi Penggantian Antar Waktu BPD",
  "Surat Rekomendasi Rotasi / Pemberhentian / Pengisian / Pelantikan Perangkat Desa",
  "Surat Rekomendasi Nikah",
];

const SURAT_MASUK = [
  { no: "SM-2026-0148", nomor: "470/148/KEC-AH/VI/2026", tgl: "31 Mei 2026", asal: "Desa Jernih", tujuan: "Kasi Pelayanan Umum", perihal: "Permohonan pengantar perbaikan data KTP", layanan: "Surat Pengantar Perbaikan Data KTP", sifat: "Penting", status: "Baru", file: "pengantar-ktp-jernih.pdf" },
  { no: "SM-2026-0147", nomor: "471/147/KEC-AH/V/2026", tgl: "30 Mei 2026", asal: "Desa Lubuk Kepayang", tujuan: "Kasi Pelayanan Umum", perihal: "Permohonan perbaikan data Kartu Keluarga", layanan: "Surat Pengantar Perbaikan Data KK / Pemisahan KK", sifat: "Segera", status: "Diproses", file: "perbaikan-kk.pdf" },
  { no: "SM-2026-0146", nomor: "300/146/KEC-AH/V/2026", tgl: "29 Mei 2026", asal: "Panitia Kegiatan Desa Baru", tujuan: "Kasi Trantib", perihal: "Rekomendasi izin kegiatan masyarakat", layanan: "Surat Rekomendasi Izin Kegiatan / Keramaian", sifat: "Biasa", status: "Selesai", file: "izin-keramaian.pdf" },
  { no: "SM-2026-0145", nomor: "140/145/KEC-AH/V/2026", tgl: "28 Mei 2026", asal: "BPD Desa Semurung", tujuan: "Kasi Pemerintahan", perihal: "Pengajuan rekomendasi PAW BPD", layanan: "Surat Rekomendasi Penggantian Antar Waktu BPD", sifat: "Biasa", status: "Selesai", file: "rekom-paw-bpd.pdf" },
  { no: "SM-2026-0144", nomor: "141/144/KEC-AH/V/2026", tgl: "27 Mei 2026", asal: "Pemerintah Desa Bukit Suban", tujuan: "Kasi PMD dan Kelurahan", perihal: "Permohonan rekomendasi pelantikan perangkat desa", layanan: "Surat Rekomendasi Rotasi / Pemberhentian / Pengisian / Pelantikan Perangkat Desa", sifat: "Rahasia", status: "Diproses", file: "perangkat-desa.pdf" },
  { no: "SM-2026-0143", nomor: "474/143/KEC-AH/V/2026", tgl: "26 Mei 2026", asal: "Desa Pematang Kabau", tujuan: "Kasi Kesejahteraan Sosial", perihal: "Permohonan rekomendasi nikah", layanan: "Surat Rekomendasi Nikah", sifat: "Penting", status: "Selesai", file: "rekom-nikah.pdf" },
  { no: "SM-2026-0142", nomor: "470/142/KEC-AH/V/2026", tgl: "24 Mei 2026", asal: "Desa Mentawak Baru", tujuan: "Sekretariat", perihal: "Permohonan informasi alur layanan DILAN CERDAS", layanan: "Surat Pengantar Perbaikan Data KTP", sifat: "Segera", status: "Selesai", file: "permohonan-info.pdf" },
  { no: "SM-2026-0141", nomor: "005/141/KEC-AH/V/2026", tgl: "22 Mei 2026", asal: "Pemerintah Kabupaten Sarolangun", tujuan: "Camat Air Hitam", perihal: "Undangan koordinasi inovasi pelayanan publik", layanan: "Surat Rekomendasi Izin Kegiatan / Keramaian", sifat: "Biasa", status: "Selesai", file: "undangan-koordinasi.pdf" },
];

const SURAT_KELUAR = [
  { no: "SK-2026-0231", nomor: "470/231/KEC-AH/VI/2026", tgl: "31 Mei 2026", asal: "Kasi Pelayanan Umum", tujuan: "Desa Jernih", perihal: "Surat pengantar perbaikan data KTP", sifat: "Penting", status: "Terkirim", file: "pengantar-ktp.pdf" },
  { no: "SK-2026-0230", nomor: "471/230/KEC-AH/V/2026", tgl: "30 Mei 2026", asal: "Kasi Pelayanan Umum", tujuan: "Dinas Dukcapil Kabupaten Sarolangun", perihal: "Pengantar perbaikan data Kartu Keluarga", sifat: "Biasa", status: "Terkirim", file: "pengantar-kk.pdf" },
  { no: "SK-2026-0229", nomor: "300/229/KEC-AH/V/2026", tgl: "29 Mei 2026", asal: "Kasi Trantib", tujuan: "Panitia Kegiatan Desa Baru", perihal: "Rekomendasi izin kegiatan/keramaian", sifat: "Segera", status: "Terkirim", file: "rekom-keramaian.pdf" },
  { no: "SK-2026-0228", nomor: "140/228/KEC-AH/V/2026", tgl: "27 Mei 2026", asal: "Kasi Pemerintahan", tujuan: "BPD Desa Semurung", perihal: "Rekomendasi penggantian antar waktu BPD", sifat: "Rahasia", status: "Draft", file: "rekom-paw-bpd.pdf" },
  { no: "SK-2026-0227", nomor: "141/227/KEC-AH/V/2026", tgl: "26 Mei 2026", asal: "Kasi PMD dan Kelurahan", tujuan: "Kepala Desa Bukit Suban", perihal: "Rekomendasi pelantikan perangkat desa", sifat: "Penting", status: "Terkirim", file: "rekom-perangkat-desa.pdf" },
  { no: "SK-2026-0226", nomor: "474/226/KEC-AH/V/2026", tgl: "23 Mei 2026", asal: "Kasi Kesejahteraan Sosial", tujuan: "KUA Kecamatan Air Hitam", perihal: "Rekomendasi nikah", sifat: "Biasa", status: "Terkirim", file: "rekom-nikah.pdf" },
  { no: "SK-2026-0225", nomor: "005/225/KEC-AH/V/2026", tgl: "21 Mei 2026", asal: "Sekretariat Kecamatan", tujuan: "Seluruh Desa se-Kecamatan Air Hitam", perihal: "Sosialisasi penggunaan DILAN CERDAS", sifat: "Penting", status: "Terkirim", file: "sosialisasi-dilan-cerdas.pdf" },
];

const PEGAWAI = [
  { nama: "FATHURRAHMAN, S.STP", nip: "198609102004121002", jabatan: "Camat Air Hitam", gol: "IV/a", unit: "Pimpinan", status: "PNS" },
  { nama: "ZULKARNAIN, S.E.", nip: "197304052007011025", jabatan: "Sekretaris Kecamatan Air Hitam", gol: "III/d", unit: "Sekretariat", status: "PNS" },
  { nama: "JIMMI KELLY, S.E.", nip: "197806192008011001", jabatan: "Kasubbag Umum & Kepegawaian", gol: "III/b", unit: "Subbag Umum & Kepegawaian", status: "PNS" },
  { nama: "USMAN KHOLIQ, S.E.", nip: "197505042009011010", jabatan: "Kasubbag Keuangan, Aset dan Program", gol: "III/b", unit: "Subbag Keuangan, Aset dan Program", status: "PNS" },
  { nama: "DEDI SANTOSO, S.AP", nip: "198308072012121003", jabatan: "Kasi Pemerintahan", gol: "III/c", unit: "Seksi Pemerintahan", status: "PNS" },
  { nama: "IBNU SYATIR, S.Pd", nip: "198503292011011006", jabatan: "Kasi PMD dan Kelurahan", gol: "III/d", unit: "Seksi PMD dan Kelurahan", status: "PNS" },
  { nama: "MUALIMIN, A.Md.Kep", nip: "197605271996031002", jabatan: "Kasi Kesejahteraan Sosial", gol: "III/c", unit: "Seksi Kesejahteraan Sosial", status: "PNS" },
  { nama: "Ir. MUHAMMAD SYAFA'AT, S.P., M.E., IPM", nip: "197712162006041008", jabatan: "Kasi Pelayanan Umum", gol: "III/d", unit: "Seksi Pelayanan Umum", status: "PNS" },
  { nama: "SA'ARANI, S.Pd", nip: "198211102008011002", jabatan: "Staf", gol: "-", unit: "Subbag Umum & Kepegawaian", status: "PNS" },
  { nama: "MISWATI", nip: "198704302025212025", jabatan: "Staf", gol: "-", unit: "Subbag Umum & Kepegawaian", status: "PNS" },
  { nama: "FITRI ANDANI", nip: "199909092025212014", jabatan: "Staf", gol: "-", unit: "Subbag Umum & Kepegawaian", status: "PNS" },
  { nama: "AYU LESTARI", nip: "199309162025212018", jabatan: "Staf", gol: "-", unit: "Subbag Umum & Kepegawaian", status: "PNS" },
  { nama: "NASODIN, S.IP", nip: "19951162025051005", jabatan: "Staf", gol: "-", unit: "Subbag Keuangan, Aset dan Program", status: "PNS" },
  { nama: "BUSTARI", nip: "199306232025221001", jabatan: "Staf", gol: "-", unit: "Subbag Keuangan, Aset dan Program", status: "PNS" },
  { nama: "AHMAD ZIADI", nip: "198805262025211090", jabatan: "Staf", gol: "-", unit: "Subbag Keuangan, Aset dan Program", status: "PNS" },
  { nama: "DAFIT HAYATULLOH AS, A.Md.Kom", nip: "199604262025051001", jabatan: "Staf", gol: "-", unit: "Seksi Pemerintahan", status: "PNS" },
  { nama: "MUJITO", nip: "197112042009061001", jabatan: "Staf", gol: "-", unit: "Seksi Pemerintahan", status: "PNS" },
  { nama: "HASIM", nip: "198510202025211021", jabatan: "Staf", gol: "-", unit: "Seksi Pemerintahan", status: "PNS" },
  { nama: "IDAM KHOLID, S.Pd", nip: "198604152025211018", jabatan: "Staf", gol: "-", unit: "Seksi Pemerintahan", status: "PNS" },
  { nama: "ABDUL AZIZ", nip: "197211012010011009", jabatan: "Staf", gol: "-", unit: "Seksi PMD dan Kelurahan", status: "PNS" },
  { nama: "PUJIATI, S.E.", nip: "198703092025212012", jabatan: "Staf", gol: "-", unit: "Seksi PMD dan Kelurahan", status: "PNS" },
  { nama: "AHMAD NURYADIN", nip: "198305082025211022", jabatan: "Staf", gol: "-", unit: "Seksi PMD dan Kelurahan", status: "PNS" },
  { nama: "AHMAD DAIROBI", nip: "199003262025211045", jabatan: "Staf", gol: "-", unit: "Seksi PMD dan Kelurahan", status: "PNS" },
  { nama: "HERMANTO", nip: "197202092009061001", jabatan: "Staf", gol: "-", unit: "Seksi Kesejahteraan Sosial", status: "PNS" },
  { nama: "EDWAR EFENDI", nip: "1984101092008011001", jabatan: "Staf", gol: "-", unit: "Seksi Kesejahteraan Sosial", status: "PNS" },
  { nama: "AKLIMA, S.Sos", nip: "198705062025212026", jabatan: "Staf", gol: "-", unit: "Seksi Kesejahteraan Sosial", status: "PNS" },
  { nama: "SITI AJRAH", nip: "198210092009012006", jabatan: "Staf", gol: "-", unit: "Seksi Pelayanan Umum", status: "PNS" },
  { nama: "PAHRUL. AB", nip: "197704122012121001", jabatan: "Staf", gol: "-", unit: "Seksi Pelayanan Umum", status: "PNS" },
  { nama: "SAIJUL", nip: "198009012025211015", jabatan: "Staf", gol: "-", unit: "Seksi Pelayanan Umum", status: "PNS" },
  { nama: "BENNI KUSNADI", nip: "198508012025211018", jabatan: "Staf", gol: "-", unit: "Seksi Pelayanan Umum", status: "PNS" },
];

const AKUN = [
  { nama: "FATHURRAHMAN, S.STP", user: "fathurrahman", email: OFFICE.email, role: "Super Admin", unit: "Pimpinan", aktif: true, last: "31 Mei 2026, 08:14" },
  { nama: "ZULKARNAIN, S.E.", user: "zulkarnain", email: OFFICE.email, role: "Admin", unit: "Sekretariat", aktif: true, last: "31 Mei 2026, 07:52" },
  { nama: "JIMMI KELLY, S.E.", user: "jimmi.kelly", email: OFFICE.email, role: "Admin", unit: "Subbag Umum & Kepegawaian", aktif: true, last: "31 Mei 2026, 09:03" },
  { nama: "SITI AJRAH", user: "siti.ajrah", email: OFFICE.email, role: "User", unit: "Seksi Pelayanan Umum", aktif: true, last: "30 Mei 2026, 16:41" },
  { nama: "DEDI SANTOSO, S.AP", user: "dedi.santoso", email: OFFICE.email, role: "Admin", unit: "Seksi Pemerintahan", aktif: true, last: "31 Mei 2026, 08:30" },
  { nama: "BENNI KUSNADI", user: "benni.kusnadi", email: OFFICE.email, role: "User", unit: "Seksi Pelayanan Umum", aktif: false, last: "18 Mei 2026, 14:22" },
];

const PENGADUAN = [
  { nama: "Joko Susilo", umur: 41, hp: "0812-3344-5566", alamat: "Desa Jernih, Kecamatan Air Hitam", pesan: "Mohon informasi status surat pengantar perbaikan data KTP yang sudah diajukan melalui desa.", tgl: "30 Mei 2026", status: "Baru" },
  { nama: "Ratna Sari", umur: 29, hp: "0857-8899-1122", alamat: "Desa Lubuk Kepayang, Kecamatan Air Hitam", pesan: "Terima kasih, proses rekomendasi nikah lebih jelas dan petugasnya ramah.", tgl: "28 Mei 2026", status: "Selesai" },
  { nama: "Bagus Hermawan", umur: 35, hp: "0813-2211-7788", alamat: "Desa Bukit Suban, Kecamatan Air Hitam", pesan: "Saran: tambahkan pelacakan status surat agar masyarakat tidak perlu datang berulang ke kantor kecamatan.", tgl: "26 Mei 2026", status: "Ditindaklanjuti" },
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

Object.assign(window, { OFFICE, APP_INFO, SIFAT, JENIS_LAYANAN, SURAT_MASUK, SURAT_KELUAR, PEGAWAI, AKUN, PENGADUAN, SURVEI_UNSUR, SURVEI_HASIL, avatarColor, initials });
