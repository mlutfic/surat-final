/* ============================================================
   SISTEM SURAT — Print renderer (stacks every screen, paged)
   ============================================================ */

const PRINT_ORDER = [
  { id: "dashboard", label: "Dashboard", group: "Utama" },
  { id: "rekap-masuk", label: "Rekap Surat Masuk", group: "Persuratan" },
  { id: "rekap-keluar", label: "Rekap Surat Keluar", group: "Persuratan" },
  { id: "form-masuk", label: "Surat Masuk / Permohonan", group: "Persuratan" },
  { id: "form-keluar", label: "Surat Keluar", group: "Persuratan" },
  { id: "profil", label: "Profil Kantor", group: "Profil & SDM" },
  { id: "struktur", label: "Struktur Organisasi", group: "Profil & SDM" },
  { id: "pegawai", label: "Data Kepegawaian", group: "Profil & SDM" },
  { id: "pengaduan", label: "Layanan Pengaduan", group: "Layanan Publik" },
  { id: "survei", label: "Survei Kepuasan", group: "Layanan Publik" },
  { id: "akun", label: "Manajemen Akun", group: "Administrasi" },
];

const noop = () => {};

function PrintHeader() {
  return (
    <div className="print-cover">
      <div className="row gap-3 center">
        <div className="emblem" style={{ width: 56, height: 56 }}><Icon name="mail" size={28} style={{ color: "#fff" }} /></div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em", color: "#fff" }}>SISTEM SURAT</div>
          <div style={{ fontSize: 13, color: "oklch(0.78 0.02 256)" }}>Aplikasi Surat Masuk & Surat Keluar — e-Persuratan Terpadu</div>
        </div>
      </div>
      <div className="print-cover-foot">
        <div>{OFFICE.nama} · {OFFICE.pemda}</div>
        <div>Dokumentasi Antarmuka · 11 Modul · Per 31 Mei 2026</div>
      </div>
    </div>
  );
}

function PrintLoginPage() {
  return (
    <section className="print-page">
      <div className="modbar"><span className="modgroup">Autentikasi</span><span className="modname">Halaman Login</span></div>
      <div className="login-static">
        <Login onLogin={noop} />
      </div>
    </section>
  );
}

function PrintScreenPage({ item }) {
  return (
    <section className="print-page">
      <div className="modbar"><span className="modgroup">{item.group}</span><span className="modname">{item.label}</span></div>
      <div className="content print-content">
        {SCREENS[item.id]({ go: noop, role: "Super Admin" })}
      </div>
    </section>
  );
}

function PrintApp() {
  return (
    <div className="print-root">
      <PrintHeader />
      <PrintLoginPage />
      {PRINT_ORDER.map(it => <PrintScreenPage key={it.id} item={it} />)}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PrintApp />);

/* auto-print once fonts + render settle */
(function () {
  function ready() {
    const fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    fonts.then(() => setTimeout(() => window.print(), 600));
  }
  if (document.readyState === "complete") ready();
  else window.addEventListener("load", ready);
})();
