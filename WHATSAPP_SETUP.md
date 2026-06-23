# Setup Notifikasi WhatsApp Otomatis

Fitur ini mengirim notifikasi WhatsApp otomatis hanya saat surat masuk baru berhasil disimpan dan statusnya bukan `Draft`.

## 1. Jalankan migrasi Supabase

Jalankan file berikut ke database Supabase:

- `supabase/migrations/20260619_add_whatsapp_notification_logs.sql`
- `supabase/migrations/20260619_set_temp_whatsapp_notification.sql`

Jika Anda juga menerapkan perubahan branch terbaru untuk agenda manual surat, jalankan juga:

- `supabase/migrations/20260623_make_agenda_manual.sql`
- `supabase/migrations/20260623_normalize_manual_agenda_validation.sql`

Tabel ini dipakai untuk:

- mencegah notifikasi dobel untuk surat yang sama
- menyimpan hasil kirim `queued`, `failed`, atau `skipped`
- mendukung kirim ulang dari rekap surat masuk

Catatan untuk migrasi agenda otomatis:

- migrasi agenda terbaru akan mengurutkan ulang nomor agenda surat masuk dan surat keluar menjadi `1, 2, 3, 4, ...` berdasarkan urutan input data (`created_at`, lalu `id`)
- setelah itu surat baru akan mendapat nomor agenda berikutnya secara otomatis dari database

## 2. Atur environment variable di Vercel

Salin nilai dari `.env.vercel.example`, lalu isi di Project Settings -> Environment Variables:

- `FONNTE_TOKEN`
- `WHATSAPP_PROVIDER=fonnte`

Opsional:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Provider default di kode adalah `fonnte`. Untuk proyek ini `SUPABASE_ANON_KEY` sudah cukup karena endpoint server memanfaatkan RPC Supabase yang memang sudah dipublikasikan untuk aplikasi, dan bila tidak diisi backend akan memakai nilai publishable key yang sama dengan frontend.

## 3. Pastikan nomor tujuan WA resmi terisi

Nomor tujuan diambil dari field:

- `Profil Kantor -> WA Notifikasi Dokumen`

Nomor boleh diisi format `08...` atau `628...`.
Untuk sementara repo ini sudah saya siapkan agar nomor target diarahkan ke `081367236229` lewat migrasi update di atas.

## 4. Deploy ulang ke Vercel

Endpoint backend yang dipakai frontend ada di:

- `/api/notifications/incoming-whatsapp`

Setelah environment variable diisi, lakukan redeploy agar fungsi serverless aktif dengan konfigurasi terbaru.

## 5. Cara uji

1. Login sebagai operator.
2. Buka `Surat Masuk / Permohonan`.
3. Pastikan toggle `Kirim notifikasi WhatsApp` aktif.
4. Simpan surat baru dengan status selain `Draft`.
5. Cek nomor WA resmi yang ada di profil kantor.

Jika berhasil, aplikasi akan menampilkan pesan bahwa notifikasi WhatsApp berhasil diteruskan ke gateway.

## Catatan operasional

- Edit surat lama tidak mengirim ulang otomatis.
- Simpan draft tidak mengirim notifikasi.
- Tombol WhatsApp di `Rekap Surat Masuk` sekarang dipakai untuk kirim/coba lagi notifikasi otomatis.
- Jika gateway gagal, surat tetap tersimpan dan operator akan mendapat peringatan di aplikasi.
