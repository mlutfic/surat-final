/* ============================================================
   SISTEM SURAT — Print renderer (database-backed)
   ============================================================ */

const PRINT_ORDER = [
  { id: "dashboard", label: "Dashboard", group: "Utama" },
  { id: "tentang-aplikasi", label: "Tentang Aplikasi", group: "Utama" },
  { id: "rekap-masuk", label: "Rekap Surat Masuk", group: "Persuratan" },
  { id: "rekap-keluar", label: "Rekap Surat Keluar", group: "Persuratan" },
  { id: "profil", label: "Profil Kantor", group: "Profil & SDM" },
  { id: "struktur", label: "Struktur Organisasi", group: "Profil & SDM" },
  { id: "pegawai", label: "Data Kepegawaian", group: "Profil & SDM" },
  { id: "pengaduan", label: "Layanan Pengaduan", group: "Layanan Publik" },
  { id: "survei", label: "Survei Kepuasan", group: "Layanan Publik" },
  { id: "akun", label: "Manajemen Akun", group: "Administrasi" },
];

const noop = () => {};

function PrintHeader() {
  const office = AppSelectors.office();
  return (
    <div className="print-cover">
      <div className="row gap-3 center">
        <div className="emblem" style={{ width: 56, height: 56, overflow: "hidden" }}><img src={office?.logo_url || "assets/sarolangun-logo.jpeg"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em", color: "#fff" }}>{office?.app_name || "DILAN CERDAS"}</div>
          <div style={{ fontSize: 13, color: "oklch(0.78 0.02 256)" }}>{office?.app_expansion || ""}</div>
        </div>
      </div>
      <div className="print-cover-foot">
        <div>{office?.office_name || ""} · {office?.government_name || ""}</div>
        <div>Dokumentasi Antarmuka · Data dari Supabase · {formatDateId(new Date())}</div>
      </div>
    </div>
  );
}

function PrintScreenPage({ item, role }) {
  return (
    <section className="print-page">
      <div className="modbar"><span className="modgroup">{item.group}</span><span className="modname">{item.label}</span></div>
      <div className="content print-content">
        {SCREENS[item.id]({ go: noop, role })}
      </div>
    </section>
  );
}

function PrintApp() {
  const state = useAppState();

  useEffect(() => {
    AppApi.bootstrap().catch(() => null);
  }, []);

  useEffect(() => {
    if (!state.ready || !state.session) return;
    const fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    fonts.then(() => setTimeout(() => window.print(), 700));
  }, [state.ready, state.session?.id]);

  if (!state.ready || state.loading) {
    return <LoadingBlock label="Menyiapkan dokumen cetak..." />;
  }

  if (!state.session) {
    return (
      <div className="print-root" style={{ padding: 36 }}>
        <InlineNotice tone="warn">Halaman cetak membutuhkan sesi login aktif. Masuk ke aplikasi terlebih dahulu, lalu buka kembali menu cetak.</InlineNotice>
      </div>
    );
  }

  return (
    <div className="print-root">
      <PrintHeader />
      {PRINT_ORDER.filter((item) => {
        const screen = NAV.flatMap((group) => group.items).find((nav) => nav.id === item.id);
        return !screen || screen.roles.includes(state.session.role);
      }).map((item) => <PrintScreenPage key={item.id} item={item} role={state.session.role} />)}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PrintApp />);
