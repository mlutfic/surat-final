/* ============================================================
   Screens: Form Surat Masuk (Permohonan) & Form Surat Keluar
   ============================================================ */

function FormShell({ crumb, title, sub, back, go, children, side }) {
  return (
    <>
      <PageHead
        crumb={crumb}
        title={title}
        sub={sub}
        actions={
          <button className="btn btn-ghost" onClick={() => go(back)}>
            <Icon name="arrowleft" size={15} />Kembali
          </button>
        }
      />
      <div className="form-grid">
        <div className="card card-pad">{children}</div>
        <div className="col gap-4">{side}</div>
      </div>
    </>
  );
}

function FormActions() {
  return (
    <div className="row gap-2 wrap" style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
      <button className="btn btn-primary"><Icon name="send" size={15} />Kirim</button>
      <button className="btn btn-ghost"><Icon name="doc" size={15} />Simpan Draft</button>
      <button className="btn btn-ghost"><Icon name="print" size={15} />Cetak</button>
      <div className="grow" />
      <button className="btn btn-ghost" style={{ color: "var(--hot)" }}>
        <Icon name="trash" size={15} />Hapus
      </button>
    </div>
  );
}

const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };

function FormSuratMasuk({ go }) {
  return (
    <FormShell
      go={go} back="rekap-masuk"
      crumb={["Persuratan", "Surat Masuk", "Form"]}
      title="Surat Permohonan / Surat Masuk"
      sub="Catat surat masuk beserta lampiran dan disposisinya"
      side={
        <>
          <WaPreview lines={[
            <b key="t">📩 Surat Masuk Baru</b>,
            <span key="1">No. Agenda: <b>SM-2026-0149</b></span>,
            <span key="2">Perihal: Undangan Rapat Koordinasi</span>,
            <span key="3">Sifat: <b>Penting</b> · 31 Mei 2026</span>,
            <span key="4" style={{ color: "var(--muted)" }}>Diteruskan ke disposisi Camat Air Hitam.</span>,
          ]} />
          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Petunjuk Pengisian</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.85 }}>
              <li>Isi sesuai dokumen surat asli yang diterima.</li>
              <li>Nomor agenda dibuat otomatis oleh sistem.</li>
              <li>Notifikasi WhatsApp dikirim ke pejabat tujuan saat surat dikirim.</li>
            </ul>
          </div>
        </>
      }
    >
      <div className="eyebrow" style={{ marginBottom: 18 }}>Detail Surat</div>
      <div style={grid2}>
        <Field label="Jenis Layanan" req>
          <select className="select" defaultValue="Surat Pengantar Perbaikan Data KTP">
            {JENIS_LAYANAN.map(j => <option key={j}>{j}</option>)}
          </select>
        </Field>
        <Field label="Nomor Surat" req>
          <input className="input tabnum" defaultValue="470/148/KEC-AH/VI/2026" />
        </Field>
        <Field label="Asal Surat" req>
          <input className="input" defaultValue="Desa Jernih" placeholder="Instansi / pengirim" />
        </Field>
        <Field label="Tujuan Surat" req>
          <select className="select" defaultValue="Kasi Pelayanan Umum">
            <option>Camat Air Hitam</option>
            <option>Sekretariat Kecamatan</option>
            <option>Kasi Pelayanan Umum</option>
            <option>Kasi Pemerintahan</option>
            <option>Kasi PMD dan Kelurahan</option>
            <option>Kasi Kesejahteraan Sosial</option>
            <option>Kasi Trantib</option>
          </select>
        </Field>
        <Field label="Tanggal Surat" req>
          <input className="input tabnum" type="date" defaultValue="2026-05-31" />
        </Field>
        <Field label="Sifat Surat" req>
          <select className="select" defaultValue="Penting">
            <option>Biasa</option><option>Penting</option><option>Segera</option><option>Rahasia</option>
          </select>
        </Field>
        <Field label="Perihal Surat" req full>
          <textarea className="textarea" defaultValue="Permohonan surat pengantar perbaikan data KTP warga Desa Jernih" />
        </Field>
        <Field label="Dokumen Surat" req full hint="Lampirkan hasil pindai surat asli (PDF / JPG / PNG, maks. 5 MB).">
          <Dropzone file="und-rakor-bkd.pdf" />
        </Field>
      </div>
      <WaBanner
        label="Kirim notifikasi WhatsApp"
        hint="Pejabat tujuan menerima pemberitahuan otomatis."
        on={true}
      />
      <FormActions />
    </FormShell>
  );
}

function FormSuratKeluar({ go }) {
  return (
    <FormShell
      go={go} back="rekap-keluar"
      crumb={["Persuratan", "Surat Keluar", "Form"]}
      title="Buat Surat Keluar"
      sub="Susun dan terbitkan surat keluar instansi"
      side={
        <>
          <WaPreview lines={[
            <b key="t">📤 Surat Keluar Terkirim</b>,
            <span key="1">No. Agenda: <b>SK-2026-0232</b></span>,
            <span key="2">Tujuan: Seluruh Desa se-Kecamatan Air Hitam</span>,
            <span key="3">Sifat: <b>Penting</b> · 31 Mei 2026</span>,
          ]} />
          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Penomoran Otomatis</div>
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.75, margin: 0 }}>
              Nomor agenda <b className="tabnum">SK-2026-0232</b> akan ditetapkan saat surat dikirim.
              Format nomor surat mengikuti tata naskah dinas yang berlaku.
            </p>
          </div>
        </>
      }
    >
      <div className="eyebrow" style={{ marginBottom: 18 }}>Detail Surat</div>
      <div style={grid2}>
        <Field label="Asal Surat (Unit)" req>
          <select className="select" defaultValue="Kasi Pelayanan Umum">
            <option>Camat Air Hitam</option>
            <option>Sekretariat Kecamatan</option>
            <option>Kasi Pelayanan Umum</option>
            <option>Kasi Pemerintahan</option>
            <option>Kasi PMD dan Kelurahan</option>
            <option>Kasi Kesejahteraan Sosial</option>
            <option>Kasi Trantib</option>
          </select>
        </Field>
        <Field label="Tujuan Surat" req>
          <input className="input" defaultValue="Seluruh Desa se-Kecamatan Air Hitam" placeholder="Instansi / penerima" />
        </Field>
        <Field label="Nomor Surat" req>
          <input className="input tabnum" defaultValue="470/231/KEC-AH/VI/2026" />
        </Field>
        <Field label="Tanggal Surat" req>
          <input className="input tabnum" type="date" defaultValue="2026-05-31" />
        </Field>
        <Field label="Sifat Surat" req>
          <select className="select" defaultValue="Penting">
            <option>Biasa</option><option>Penting</option><option>Segera</option><option>Rahasia</option>
          </select>
        </Field>
        <Field label="Klasifikasi Arsip">
          <input className="input" defaultValue="005 — Undangan" />
        </Field>
        <Field label="Perihal Surat" req full>
          <textarea className="textarea" defaultValue="Sosialisasi penggunaan aplikasi DILAN CERDAS untuk layanan administrasi kecamatan" />
        </Field>
        <Field label="Dokumen Surat" req full hint="Unggah naskah final yang telah ditandatangani (PDF, maks. 5 MB).">
          <Dropzone file="edaran-migrasi-surel.pdf" />
        </Field>
      </div>
      <WaBanner
        label="Kirim notifikasi WhatsApp"
        hint="Penerima menerima tautan unduh surat otomatis."
        on={true}
      />
      <FormActions />
    </FormShell>
  );
}

window.FormSuratMasuk = FormSuratMasuk;
window.FormSuratKeluar = FormSuratKeluar;
