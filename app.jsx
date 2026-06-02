/* ============================================================
   SISTEM SURAT — App shell, login, routing, roles, tweaks
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

/* ---------- Login ---------- */
function Login({ onLogin }) {
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
                  <button key={r} className={"role-opt " + (role === r ? "sel" : "")} onClick={() => setRole(r)}>
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

          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }} onClick={() => onLogin(role)}>
            Masuk sebagai {role}<Icon name="chevright" size={16} />
          </button>
          <p className="muted" style={{ fontSize: 11.5, textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
            Bukan pegawai? <a style={{ color: "var(--navy-600)", fontWeight: 600 }}>Ajukan pengaduan</a> atau <a style={{ color: "var(--navy-600)", fontWeight: 600 }}>isi survei kepuasan</a> tanpa masuk.
          </p>
        </div>
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
            <button className="iconbtn" style={{ color: "oklch(0.7 0.03 256)" }} title="Keluar" onClick={() => go("__logout")}><Icon name="logout" size={17} /></button>
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

  useEffect(() => {
    const d = DENSITY[t.density] || DENSITY.regular;
    for (const k in d) document.documentElement.style.setProperty(k, d[k]);
  }, [t.density]);

  useEffect(() => {
    if (t.accent) {
      // shift gold accent hue/chroma toward chosen color is complex; just set the 500/600 swatches
      document.documentElement.style.setProperty("--gold-500", t.accent);
    }
  }, [t.accent]);

  function go(id) {
    if (id === "__logout") { setRole(null); setScreen("dashboard"); return; }
    setScreen(id);
    document.querySelector(".main")?.scrollTo({ top: 0 });
  }

  if (!role) return <><Login onLogin={(r) => { setRole(r); setScreen("dashboard"); }} /><TweakDock t={t} setTweak={setTweak} /></>;

  // ensure current screen is allowed for role
  const allowed = NAV.flatMap(g => g.items).find(it => it.id === screen && it.roles.includes(role));
  const activeScreen = allowed ? screen : "dashboard";
  const titleMap = { Admin: "Ir. Retno Kusumawati", User: "Andi Saputra", "Super Admin": "Drs. H. Bambang Wijaya" };

  return (
    <div className="app">
      <Sidebar role={role} screen={activeScreen} go={(id) => { if (id === "__logout") return go(id); setScreen(NAV.flatMap(g => g.items).find(it => it.id === id && it.roles.includes(role)) ? id : "dashboard"); }} open={sideOpen} onClose={() => setSideOpen(false)} />
      <div className="main">
        <header className="topbar">
          <button className="iconbtn menu-toggle" onClick={() => setSideOpen(true)}><Icon name="menu" size={20} /></button>
          <div className="searchbar"><Icon name="search" size={16} /><input placeholder="Cari surat, pegawai, nomor agenda…" /></div>
          <div className="grow"></div>
          <div className="role-switch" title="Tinjau tampilan tiap peran">
            {ROLES.map(r => <button key={r} className={role === r ? "on" : ""} onClick={() => setRole(r)}>{r}</button>)}
          </div>
          <button className="iconbtn" style={{ position: "relative" }} title="Notifikasi">
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
