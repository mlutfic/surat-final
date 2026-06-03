/* ============================================================
   SISTEM SURAT — Public landing, login, routing, roles, tweaks
   ============================================================ */

/* ---------- Navigation model ---------- */
const ROLES = ["User", "Admin", "Super Admin"];
const NAV = [
  { group: "Utama", items: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", roles: ROLES },
  ]},
  { group: "Persuratan", items: [
    { id: "rekap-masuk", label: "Rekap Surat Masuk", icon: "inbox", roles: ROLES, count: "148" },
    { id: "rekap-keluar", label: "Rekap Surat Keluar", icon: "send", roles: ROLES, count: "231" },
    { id: "form-masuk", label: "Surat Masuk / Permohonan", icon: "fileplus", roles: ROLES },
    { id: "form-keluar", label: "Surat Keluar", icon: "mail", roles: ROLES },
  ]},
  { group: "Profil & SDM", items: [
    { id: "profil", label: "Profil Kantor", icon: "building", roles: ROLES },
    { id: "struktur", label: "Struktur Organisasi", icon: "sitemap", roles: ROLES },
    { id: "pegawai", label: "Data Kepegawaian", icon: "idcard", roles: ["Admin", "Super Admin"] },
  ]},
  { group: "Layanan Publik", items: [
    { id: "pengaduan", label: "Layanan Pengaduan", icon: "megaphone", roles: ROLES, count: "3" },
    { id: "survei", label: "Survei Kepuasan", icon: "survey", roles: ROLES },
  ]},
  { group: "Administrasi", items: [
    { id: "akun", label: "Manajemen Akun", icon: "usercog", roles: ["Super Admin"] },
  ]},
];

const SCREENS = {
  dashboard: (p) => <Dashboard {...p} />,
  "rekap-masuk": (p) => <RekapSuratMasuk {...p} />,
  "rekap-keluar": (p) => <RekapSuratKeluar {...p} />,
  "form-masuk": (p) => <FormSuratMasuk {...p} />,
  "form-keluar": (p) => <FormSuratKeluar {...p} />,
  profil: () => <ProfilKantor />,
  struktur: () => <StrukturOrganisasi />,
  pegawai: () => <DataKepegawaian />,
  pengaduan: () => <LayananPengaduan />,
  survei: () => <SurveiKepuasan />,
  akun: () => <ManajemenAkun />,
};

const ROLE_META = {
  "User": { icon: "user", color: "var(--info)", bg: "var(--info-bg)", desc: "Operator persuratan — input & lihat surat" },
  "Admin": { icon: "usercog", color: "var(--navy-700)", bg: "var(--navy-100)", desc: "Kelola surat, pegawai & layanan publik" },
  "Super Admin": { icon: "shield", color: "var(--purple)", bg: "var(--purple-bg)", desc: "Akses penuh termasuk manajemen akun" },
};

const PUBLIC_SERVICES = [
  { icon: "inbox", title: "Pencatatan Surat Masuk", desc: "Registrasi surat & permohonan dengan nomor agenda otomatis.", badge: "Internal", tone: "internal" },
  { icon: "send", title: "Penerbitan Surat Keluar", desc: "Penyusunan, penomoran, dan penerbitan surat resmi.", badge: "Internal", tone: "internal" },
  { icon: "send", title: "Pengelolaan Disposisi", desc: "Penerusan surat ke tujuan disertai notifikasi WhatsApp.", badge: "Internal", tone: "internal" },
  { icon: "doc", title: "Arsip & Rekap Digital", desc: "Pencarian, filter, cetak, dan ekspor data surat.", badge: "Internal", tone: "internal" },
  { icon: "mail", title: "Layanan Pengaduan", desc: "Kanal aduan masyarakat tanpa perlu membuat akun.", badge: "Publik", tone: "public" },
  { icon: "star", title: "Survei Kepuasan (IKM)", desc: "Kuesioner 9 unsur, terekap otomatis menjadi indeks.", badge: "Publik", tone: "public" },
];

const PUBLIC_IMPACT = [
  { aspect: "Waktu pencatatan per surat", before: "± 15 menit", after: "± 2 menit" },
  { aspect: "Waktu disposisi ke tujuan", before: "1–3 hari", after: "< 1 jam (notifikasi WA)" },
  { aspect: "Penelusuran arsip lama", before: "Menit-jam (manual)", after: "< 10 detik (pencarian)" },
  { aspect: "Surat hilang / tercecer", before: "Terjadi berkala", after: "0% (terarsip digital)" },
  { aspect: "Tindak lanjut pengaduan", before: "Tidak terlacak", after: "Maks. 3 hari kerja" },
  { aspect: "Pengukuran kepuasan", before: "Tidak rutin", after: "Otomatis — IKM 87,4" },
  { aspect: "Penggunaan kertas & ATK", before: "Tinggi", after: "Berkurang signifikan" },
];

const PUBLIC_STATS = [
  { value: "12", label: "Modul terpadu dalam satu sistem" },
  { value: "87,4", label: "Indeks Kepuasan Masyarakat — Sangat Baik" },
  { value: "<1 jam", label: "Waktu disposisi via notifikasi WhatsApp" },
  { value: "0%", label: "Surat hilang — 100% terarsip digital" },
];

/* ---------- Login ---------- */
function Login({ onLogin, onPublic }) {
  const [role, setRole] = useState("Super Admin");
  return (
    <div className="login-wrap">
      <div className="login-side">
        <div className="login-grid-lines"></div>
        <div className="deco"></div>
        <div style={{ position: "relative" }}>
          <div className="row gap-3 center">
            <div className="brand" style={{ padding: 0 }}>
              <div className="emblem"><Icon name="mail" size={22} style={{ color: "#fff" }} /></div>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>SISTEM SURAT</div>
              <div style={{ fontSize: 11.5, color: "oklch(0.72 0.03 256)" }}>e-Persuratan Terpadu</div>
            </div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div className="eyebrow" style={{ color: "var(--gold-400)" }}>Aplikasi Surat Masuk & Surat Keluar</div>
          <h1 style={{ color: "#fff", fontSize: 34, lineHeight: 1.15, marginTop: 14, letterSpacing: "-0.02em" }}>
            Tata kelola persuratan yang rapi, cepat, dan transparan.
          </h1>
          <p style={{ color: "oklch(0.78 0.02 256)", fontSize: 14.5, lineHeight: 1.65, marginTop: 16, maxWidth: 420 }}>
            Catat surat masuk & keluar, kelola disposisi, layani pengaduan masyarakat, dan ukur kepuasan layanan dalam satu sistem.
          </p>
          <div className="row gap-4 wrap" style={{ marginTop: 28 }}>
            {[["inbox", "Surat Masuk"], ["send", "Surat Keluar"], ["megaphone", "Pengaduan"], ["survey", "Survei IKM"]].map(([ic, t]) => (
              <div key={t} className="row gap-2 center" style={{ color: "oklch(0.82 0.02 256)", fontSize: 13, fontWeight: 500 }}>
                <span style={{ color: "var(--gold-400)" }}><Icon name={ic} size={16} /></span>{t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", color: "oklch(0.6 0.03 256)", fontSize: 11.5 }}>
          © 2026 {OFFICE.pemda} · {OFFICE.nama}
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-card">
          <div className="brand" style={{ padding: 0, marginBottom: 22 }}>
            <div className="emblem"><Icon name="mail" size={22} style={{ color: "#fff" }} /></div>
            <div className="col"><span className="bt" style={{ color: "var(--ink)" }}>SISTEM SURAT</span><span className="bs" style={{ color: "var(--muted)" }}>{OFFICE.pemda}</span></div>
          </div>
          <h2 style={{ fontSize: 22 }}>Masuk ke Akun Anda</h2>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 5, marginBottom: 20 }}>Pilih peran lalu masuk untuk melanjutkan.</p>

          <div className="field" style={{ marginBottom: 14 }}>
            <label>Masuk sebagai</label>
            <div className="role-pick">
              {ROLES.map(r => {
                const m = ROLE_META[r];
                return (
                  <button type="button" key={r} className={"role-opt " + (role === r ? "sel" : "")} onClick={() => setRole(r)}>
                    <span className="ri" style={{ background: m.bg, color: m.color }}><Icon name={m.icon} size={20} /></span>
                    <span style={{ flex: 1 }}><span className="rt">{r}</span><span className="rd" style={{ display: "block" }}>{m.desc}</span></span>
                    <span className="rcheck"><Icon name="check" size={18} /></span>
                  </button>
                );
              })}
            </div>
          </div>

          <Field label="Nama Pengguna"><div className="row" style={{ position: "relative" }}><span style={{ position: "absolute", left: 12, top: 12, color: "var(--faint)" }}><Icon name="user" size={16} /></span><input className="input" style={{ paddingLeft: 38 }} defaultValue="bambang.wijaya" /></div></Field>
          <div style={{ height: 14 }}></div>
          <Field label="Kata Sandi"><div className="row" style={{ position: "relative" }}><span style={{ position: "absolute", left: 12, top: 12, color: "var(--faint)" }}><Icon name="lock" size={16} /></span><input className="input" style={{ paddingLeft: 38 }} type="password" defaultValue="password" /></div></Field>

          <div className="row between center" style={{ margin: "16px 0 18px" }}>
            <label className="row gap-2 center" style={{ fontSize: 12.5, color: "var(--ink-soft)", cursor: "pointer" }}><input type="checkbox" defaultChecked />Ingat saya</label>
            <a style={{ fontSize: 12.5, color: "var(--navy-600)", fontWeight: 600 }}>Lupa sandi?</a>
          </div>

          <button type="button" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }} onClick={() => onLogin(role)}>
            Masuk sebagai {role}<Icon name="chevright" size={16} />
          </button>
          <p className="muted" style={{ fontSize: 11.5, textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
            Bukan pegawai?{" "}
            <button type="button" className="login-inline-link" onClick={() => onPublic?.("pengaduan")}>Ajukan pengaduan</button>
            {" "}atau{" "}
            <button type="button" className="login-inline-link" onClick={() => onPublic?.("survei-ikm")}>isi survei kepuasan</button>
            {" "}tanpa masuk.
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionIntro({ eyebrow, title, desc }) {
  return (
    <div className="public-section-intro">
      <div className="public-eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  );
}

function PublicComplaintCard() {
  return (
    <div id="pengaduan" className="public-panel">
      <div className="public-panel-head">
        <span className="public-panel-icon public-panel-icon-blue"><Icon name="mail" size={18} /></span>
        <div>
          <h3>Layanan Pengaduan</h3>
          <p>Tindak lanjut maksimal 3 hari kerja & terpantau.</p>
        </div>
      </div>
      <div className="public-form-stack">
        <div className="field">
          <label>Nama Pelapor</label>
          <input className="input public-input" placeholder="Nama lengkap Anda" />
        </div>
        <div className="field">
          <label>Nomor WhatsApp / Telepon</label>
          <input className="input public-input tabnum" placeholder="08x-xxxx-xxxx" />
        </div>
        <div className="field">
          <label>Kategori Aduan</label>
          <select className="select public-input">
            <option>Pelayanan Administrasi</option>
            <option>Tindak Lanjut Surat</option>
            <option>Akses Informasi</option>
            <option>Lainnya</option>
          </select>
        </div>
        <div className="field">
          <label>Isi Pengaduan</label>
          <textarea className="textarea public-input public-textarea" placeholder="Ceritakan keluhan atau aspirasi Anda..."></textarea>
        </div>
      </div>
      <button type="button" className="public-submit public-submit-green">Kirim Pengaduan <Icon name="chevright" size={15} /></button>
    </div>
  );
}

function PublicSurveyCard() {
  const questions = SURVEI_UNSUR.slice(0, 5);
  const [answers, setAnswers] = useState(Array(questions.length).fill(0));

  function selectAnswer(index, value) {
    const next = answers.slice();
    next[index] = value;
    setAnswers(next);
  }

  return (
    <div id="survei-ikm" className="public-panel">
      <div className="public-panel-head">
        <span className="public-panel-icon public-panel-icon-green"><Icon name="star" size={18} /></span>
        <div>
          <h3>Survei Kepuasan (IKM)</h3>
          <p>9 unsur penilaian · skala 1 (Tidak Baik) – 4 (Sangat Baik).</p>
        </div>
      </div>
      <div className="public-survey-stack">
        {questions.map((question, index) => (
          <div key={question} className="public-survey-row">
            <div className="public-survey-label">{index + 1}. {question}</div>
            <div className="public-survey-scale">
              {[1, 2, 3, 4].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={"public-scale-opt " + (answers[index] === value ? "on" : "")}
                  onClick={() => selectAnswer(index, value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="public-survey-note">+ 4 unsur lainnya dinilai otomatis dalam sistem lengkap.</div>
      <button type="button" className="public-submit public-submit-green">Kirim Penilaian <Icon name="star" size={15} /></button>
    </div>
  );
}

function PublicLanding({ onLogin, focusSection, onFocusHandled }) {
  const regionName = OFFICE.pemda.replace(/^Pemerintah\s+/i, "");

  function jumpTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    if (!focusSection) return;
    requestAnimationFrame(() => {
      document.getElementById(focusSection)?.scrollIntoView({ behavior: "smooth", block: "start" });
      onFocusHandled?.();
    });
  }, [focusSection, onFocusHandled]);

  return (
    <div className="public-site">
      <section className="public-hero" id="top">
        <header className="public-nav-shell">
          <div className="public-nav">
            <a href="#top" className="public-brand">
              <span className="public-brand-mark">PM</span>
              <span>
                <strong>e-Persuratan</strong>
                <small>{regionName}</small>
              </span>
            </a>
            <nav className="public-nav-links">
              <a href="#layanan" onClick={(e) => { e.preventDefault(); jumpTo("layanan"); }}>Layanan</a>
              <a href="#dampak" onClick={(e) => { e.preventDefault(); jumpTo("dampak"); }}>Dampak</a>
              <a href="#pengaduan" onClick={(e) => { e.preventDefault(); jumpTo("pengaduan"); }}>Pengaduan</a>
              <a href="#survei-ikm" onClick={(e) => { e.preventDefault(); jumpTo("survei-ikm"); }}>Survei IKM</a>
              <button type="button" className="public-top-login" onClick={onLogin}>
                Masuk Petugas <Icon name="chevright" size={14} />
              </button>
            </nav>
          </div>
        </header>

        <div className="public-hero-inner">
          <div className="public-hero-copy">
            <div className="public-pill"><span></span>INOVASI PELAYANAN PUBLIK · IGA 2026</div>
            <h1 className="public-hero-title">
              <span>Persuratan Digital</span>
              <span>yang <em className="gold">Cepat,</em></span>
              <span><em className="gold gold-soft">Transparan &amp;</em></span>
              <span><em className="mint">Partisipatif.</em></span>
            </h1>
            <p className="public-hero-desc">
              Satu platform e-Persuratan terpadu yang menyatukan pencatatan surat, disposisi,
              pengaduan masyarakat, dan pengukuran kepuasan layanan — dengan notifikasi WhatsApp
              otomatis pada setiap proses penting.
            </p>
            <div className="public-hero-actions">
              <button type="button" className="public-cta public-cta-gold" onClick={() => jumpTo("pengaduan")}>
                <Icon name="mail" size={15} /> Sampaikan Pengaduan
              </button>
              <button type="button" className="public-cta public-cta-ghost" onClick={onLogin}>
                <Icon name="lock" size={15} /> Login Petugas
              </button>
            </div>
            <div className="public-chip-row">
              <span className="public-chip"><span className="blue"></span>12 Modul Terpadu</span>
              <span className="public-chip"><span className="gold"></span>3 Peran Pengguna</span>
              <span className="public-chip"><span className="green"></span>Tanpa Login untuk Publik</span>
            </div>
          </div>

          <div className="public-stat-row">
            {PUBLIC_STATS.map((stat) => (
              <article key={stat.label} className="public-stat-card">
                <div className="public-stat-glow"></div>
                <div className="public-stat-value tabnum">{stat.value}</div>
                <p>{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="public-surface">
        <section className="public-section" id="layanan">
          <SectionIntro
            eyebrow="RUANG LINGKUP LAYANAN"
            title="Satu pintu untuk tata kelola & layanan publik"
            desc="Layanan internal aparatur dan layanan publik masyarakat dipersatukan dalam alur yang sama — saling terhubung, terdokumentasi, dan terukur."
          />
          <div className="public-service-grid">
            {PUBLIC_SERVICES.map((service) => (
              <article key={service.title} className="public-service-card">
                <div className="public-service-top">
                  <span className={"public-service-icon " + (service.tone === "public" ? "public" : "internal")}>
                    <Icon name={service.icon} size={19} />
                  </span>
                  <span className={"public-service-badge " + (service.tone === "public" ? "public" : "internal")}>
                    {service.badge.toUpperCase()}
                  </span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-section public-section-muted" id="dampak">
          <SectionIntro
            eyebrow="DAMPAK & MANFAAT"
            title="Sebelum vs Sesudah penerapan"
            desc="Perubahan yang dapat dibuktikan dengan angka — inti dari penilaian inovasi pemerintahan."
          />
          <div className="public-impact-shell">
            <table className="public-impact-table">
              <thead>
                <tr>
                  <th>Aspek</th>
                  <th>Sebelum (Manual)</th>
                  <th>Sesudah (Sistem)</th>
                </tr>
              </thead>
              <tbody>
                {PUBLIC_IMPACT.map((row) => (
                  <tr key={row.aspect}>
                    <td>{row.aspect}</td>
                    <td className="before">{row.before}</td>
                    <td className="after">{row.after} <span className="public-inline-arrow">↗</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="public-section" id="partisipasi">
          <SectionIntro
            eyebrow="PARTISIPASI MASYARAKAT"
            title="Sampaikan suara Anda"
            desc="Tanpa perlu membuat akun. Pengaduan langsung masuk ke dashboard petugas, dan kepuasan Anda kami ukur secara berkala."
          />
          <div className="public-participation-grid">
            <PublicComplaintCard />
            <PublicSurveyCard />
          </div>
        </section>

        <footer className="public-footer">
          <div className="public-footer-grid">
            <div>
              <div className="public-brand public-footer-brand">
                <span className="public-brand-mark">PM</span>
                <span>
                  <strong>e-Persuratan</strong>
                  <small>{regionName}</small>
                </span>
              </div>
              <p className="public-footer-copy">
                Sistem Surat Masuk & Surat Keluar terpadu — mendukung Sistem Pemerintahan
                Berbasis Elektronik (SPBE) dan reformasi birokrasi.
              </p>
            </div>
            <div>
              <h4>Layanan</h4>
              <div className="public-footer-links">
                <a href="#pengaduan" onClick={(e) => { e.preventDefault(); jumpTo("pengaduan"); }}>Pengaduan Masyarakat</a>
                <a href="#survei-ikm" onClick={(e) => { e.preventDefault(); jumpTo("survei-ikm"); }}>Survei Kepuasan</a>
                <a href="#layanan" onClick={(e) => { e.preventDefault(); jumpTo("layanan"); }}>Informasi Layanan</a>
                <button type="button" className="public-footer-login" onClick={onLogin}>Login Petugas</button>
              </div>
            </div>
            <div>
              <h4>Kontak</h4>
              <div className="public-footer-meta">
                <span>Jl. Inovasi No. [--], {regionName}</span>
                <span>(0xx) xxx-xxxx</span>
                <span>persuratan@prajamandala.go.id</span>
                <span>Senin–Jumat · 08.00–16.00</span>
              </div>
            </div>
          </div>
          <div className="public-footer-bottom">
            <span>© 2026 {OFFICE.pemda} (contoh). Seluruh data placeholder — sesuaikan sebelum diajukan.</span>
            <span>Dikembangkan oleh <b>Inovtek Cipta Digital</b></span>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ---------- Sidebar ---------- */
function Sidebar({ role, screen, go, open, onClose }) {
  const me = { "User": "Andi Saputra", "Admin": "Ir. Retno Kusumawati", "Super Admin": "Drs. H. Bambang Wijaya" }[role];
  return (
    <>
      {open && <div className="scrim" onClick={onClose}></div>}
      <aside className={"sidebar " + (open ? "open" : "")}>
        <div className="brand">
          <div className="emblem"><Icon name="mail" size={22} style={{ color: "#fff" }} /></div>
          <div className="col"><span className="bt">SISTEM SURAT</span><span className="bs">e-Persuratan Terpadu</span></div>
        </div>
        <nav className="nav">
          {NAV.map(grp => {
            const items = grp.items.filter(it => it.roles.includes(role));
            if (!items.length) return null;
            return (
              <div key={grp.group}>
                <div className="nav-group-label">{grp.group}</div>
                {items.map(it => (
                  <a key={it.id} className={"nav-item " + (screen === it.id ? "active" : "")} onClick={() => { go(it.id); onClose(); }}>
                    <Icon name={it.icon} size={18} />{it.label}
                    {it.count && <span className="nav-count tabnum">{it.count}</span>}
                  </a>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="side-foot">
          <div className="side-user">
            <Avatar name={me} size={36} />
            <div className="col grow" style={{ minWidth: 0 }}>
              <span className="nm" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{me}</span>
              <span className="rl">{role}</span>
            </div>
            <button type="button" className="iconbtn" style={{ color: "oklch(0.7 0.03 256)" }} title="Keluar" onClick={() => go("__logout")}><Icon name="logout" size={17} /></button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------- App ---------- */
const DENSITY = {
  compact:  { "--row-py": "8px",  "--cell-px": "14px", "--card-pad": "18px" },
  regular:  { "--row-py": "13px", "--cell-px": "18px", "--card-pad": "22px" },
  comfy:    { "--row-py": "18px", "--cell-px": "22px", "--card-pad": "26px" },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "regular",
  "accent": "#b8842a"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [role, setRole] = useState(null);
  const [screen, setScreen] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [view, setView] = useState("landing");
  const [landingSection, setLandingSection] = useState(null);

  useEffect(() => {
    const d = DENSITY[t.density] || DENSITY.regular;
    for (const k in d) document.documentElement.style.setProperty(k, d[k]);
  }, [t.density]);

  useEffect(() => {
    if (t.accent) {
      document.documentElement.style.setProperty("--gold-500", t.accent);
    }
  }, [t.accent]);

  function openLanding(section = null) {
    setView("landing");
    setLandingSection(section);
    setSideOpen(false);
    window.scrollTo(0, 0);
  }

  function openLogin() {
    setView("login");
    setLandingSection(null);
    setSideOpen(false);
    window.scrollTo(0, 0);
  }

  function go(id) {
    if (id === "__logout") {
      setRole(null);
      setScreen("dashboard");
      openLanding();
      return;
    }
    setScreen(id);
    document.querySelector(".main")?.scrollTo({ top: 0 });
  }

  if (!role) {
    if (view === "login") {
      return (
        <Login
          onLogin={(r) => {
            setRole(r);
            setScreen("dashboard");
            setView("app");
            setSideOpen(false);
            window.scrollTo(0, 0);
          }}
          onPublic={(section) => openLanding(section)}
        />
      );
    }
    return (
      <PublicLanding
        onLogin={openLogin}
        focusSection={landingSection}
        onFocusHandled={() => setLandingSection(null)}
      />
    );
  }

  const allowed = NAV.flatMap(g => g.items).find(it => it.id === screen && it.roles.includes(role));
  const activeScreen = allowed ? screen : "dashboard";
  const titleMap = { Admin: "Ir. Retno Kusumawati", User: "Andi Saputra", "Super Admin": "Drs. H. Bambang Wijaya" };

  return (
    <div className="app">
      <Sidebar role={role} screen={activeScreen} go={(id) => { if (id === "__logout") return go(id); setScreen(NAV.flatMap(g => g.items).find(it => it.id === id && it.roles.includes(role)) ? id : "dashboard"); }} open={sideOpen} onClose={() => setSideOpen(false)} />
      <div className="main">
        <header className="topbar">
          <button type="button" className="iconbtn menu-toggle" onClick={() => setSideOpen(true)}><Icon name="menu" size={20} /></button>
          <div className="searchbar"><Icon name="search" size={16} /><input placeholder="Cari surat, pegawai, nomor agenda…" /></div>
          <div className="grow"></div>
          <div className="role-switch" title="Tinjau tampilan tiap peran">
            {ROLES.map(r => <button type="button" key={r} className={role === r ? "on" : ""} onClick={() => setRole(r)}>{r}</button>)}
          </div>
          <button type="button" className="iconbtn" style={{ position: "relative" }} title="Notifikasi">
            <Icon name="bell" size={19} />
            <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: "var(--hot)", border: "1.5px solid #fff" }}></span>
          </button>
          <Avatar name={titleMap[role]} size={34} />
        </header>
        <div className="content">
          {SCREENS[activeScreen]({ go, role })}
        </div>
      </div>
      <TweakDock t={t} setTweak={setTweak} />
    </div>
  );
}

function TweakDock({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Tabel" />
      <TweakRadio label="Kepadatan" value={t.density} options={["compact", "regular", "comfy"]} onChange={(v) => setTweak("density", v)} />
      <TweakSection label="Tema" />
      <TweakColor label="Warna Aksen" value={t.accent} options={["#b8842a", "#c2410c", "#0e7490", "#7c3aed"]} onChange={(v) => setTweak("accent", v)} />
    </TweaksPanel>
  );
}

if (!window.__PRINT__) {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}
