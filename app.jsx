/* ============================================================
   SISTEM SURAT — Public landing, login, routing, roles, tweaks
   ============================================================ */

/* ---------- Navigation model ---------- */
const ROLES = ["User", "Admin", "Super Admin"];
const NAV = [
  { group: "Utama", items: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", roles: ROLES },
    { id: "tentang-aplikasi", label: "Tentang Aplikasi", icon: "globe", roles: ROLES },
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
  "tentang-aplikasi": () => <TentangAplikasi />,
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

const LOGO_SRC = "assets/sarolangun-logo.jpeg";

const ROLE_META = {
  "User": { icon: "user", color: "var(--info)", bg: "var(--info-bg)", desc: "Input dan cek surat" },
  "Admin": { icon: "usercog", color: "var(--navy-700)", bg: "var(--navy-100)", desc: "Surat, layanan, dan SDM" },
  "Super Admin": { icon: "shield", color: "var(--purple)", bg: "var(--purple-bg)", desc: "Akses penuh sistem" },
};

const PUBLIC_SERVICES = [
  { icon: "idcard", title: "Pengantar Perbaikan Data KTP", desc: "Untuk koreksi atau pembaruan data KTP.", badge: "Administrasi", tone: "public" },
  { icon: "users", title: "Pengantar Perbaikan Data KK", desc: "Untuk perbaikan data atau pemisahan KK.", badge: "Administrasi", tone: "public" },
  { icon: "megaphone", title: "Rekomendasi Izin Kegiatan", desc: "Untuk kegiatan atau keramaian masyarakat.", badge: "Rekomendasi", tone: "public" },
  { icon: "sitemap", title: "Rekomendasi PAW BPD", desc: "Untuk penggantian antar waktu BPD.", badge: "Pemerintahan", tone: "internal" },
  { icon: "building", title: "Rekomendasi Perangkat Desa", desc: "Untuk rotasi, pengisian, atau pelantikan perangkat desa.", badge: "Pemerintahan", tone: "internal" },
  { icon: "mail", title: "Rekomendasi Nikah", desc: "Untuk kebutuhan rekomendasi nikah.", badge: "Sosial", tone: "public" },
];

const PUBLIC_IMPACT = [
  { aspect: "Model pelayanan", before: "Manual dan bergantung pada dokumen fisik", after: "Pelayanan berbasis digital" },
  { aspect: "Proses administrasi", before: "Relatif lambat", after: "Lebih cepat dan terstruktur" },
  { aspect: "Arsip dokumen", before: "Konvensional dan tersebar", after: "Arsip digital terintegrasi" },
  { aspect: "Akses informasi layanan", before: "Terbatas", after: "Mudah diakses masyarakat" },
  { aspect: "Pengaduan masyarakat", before: "Belum terkelola optimal", after: "Terintegrasi dan responsif" },
  { aspect: "Monitoring pelayanan", before: "Belum maksimal", after: "Evaluasi lebih sistematis" },
  { aspect: "Koordinasi petugas", before: "Kurang efektif", after: "Lebih cepat dan efisien" },
];

const PUBLIC_STATS = [
  { value: "6", label: "Jenis layanan", icon: "doc" },
  { value: "Online", label: "Informasi layanan", icon: "globe" },
  { value: "IKM", label: "Survei kepuasan", icon: "survey" },
  { value: "Aduan", label: "Kanal warga", icon: "megaphone" },
];

const PUBLIC_FLOW = [
  { title: "Ajukan", desc: "Warga memilih layanan dan menyiapkan berkas." },
  { title: "Verifikasi", desc: "Petugas mengecek data dan kelengkapan." },
  { title: "Proses", desc: "Permohonan diteruskan ke unit terkait." },
  { title: "Terbit", desc: "Surat atau rekomendasi diterbitkan." },
  { title: "Arsip", desc: "Dokumen tersimpan sebagai arsip digital." },
  { title: "Evaluasi", desc: "Aduan dan IKM dipakai untuk perbaikan layanan." },
];

/* ---------- Login ---------- */
function Login({ onLogin, onPublic }) {
  const [role, setRole] = useState("Super Admin");
  return (
    <div className="login-wrap">
      <div className="login-form-side">
        <div className="login-card">
          <button type="button" className="login-back-link" onClick={() => onPublic?.()}>
            <Icon name="arrowleft" size={15} /> Landing Page
          </button>

          <div className="login-card-brand">
            <div className="login-brand-lockup login-brand-lockup-dark">
              <span className="login-brand-mark"><img src={LOGO_SRC} alt="" /></span>
              <span>
                <strong>{APP_INFO.nama}</strong>
                <small>{OFFICE.pemda}</small>
              </span>
            </div>
          </div>

          <h1 className="login-card-title">Masuk</h1>
          <p className="login-card-subtitle">Gunakan akun petugas yang terdaftar.</p>

          <div className="field" style={{ marginBottom: 14 }}>
            <label>Masuk sebagai</label>
            <div className="login-role-tabs">
              {ROLES.map(r => (
                <button type="button" key={r} className={role === r ? "sel" : ""} onClick={() => setRole(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Field label="Nama Pengguna">
            <div className="login-input-shell">
              <span><Icon name="user" size={16} /></span>
              <input className="input" defaultValue="fathurrahman" />
            </div>
          </Field>
          <div style={{ height: 14 }}></div>
          <Field label="Kata Sandi">
            <div className="login-input-shell">
              <span><Icon name="lock" size={16} /></span>
              <input className="input" type="password" defaultValue="password" />
            </div>
          </Field>

          <div className="login-meta-row">
            <label><input type="checkbox" defaultChecked />Ingat saya</label>
            <a>Lupa sandi?</a>
          </div>

          <button type="button" className="login-submit" onClick={() => onLogin(role)}>
            Masuk <Icon name="chevright" size={16} />
          </button>
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

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Count-up number that animates when scrolled into view */
function useCountUp(target, { decimals = 0, duration = 1500 } = {}) {
  const ref = useRef(null);
  const [val, setVal] = useState(prefersReducedMotion() ? target : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) { setVal(target); return; }
    let raf;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(target * eased);
          if (p < 1) raf = requestAnimationFrame(step);
          else setVal(target);
        };
        raf = requestAnimationFrame(step);
      });
    }, { threshold: 0.45 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, decimals, duration]);
  const text = decimals ? val.toFixed(decimals).replace(".", ",") : String(Math.round(val));
  return [ref, text];
}

/* Animated hero background — drifting orbs, panning grid, cursor spotlight, particles */
function PublicHeroBackground() {
  const particles = Array.from({ length: 22 });
  return (
    <div className="public-hero-bg" aria-hidden="true">
      <div className="hb-grid"></div>
      <div className="hb-orb hb-orb-1"></div>
      <div className="hb-orb hb-orb-2"></div>
      <div className="hb-orb hb-orb-3"></div>
      <div className="hb-orb hb-orb-4"></div>
      <div className="hb-beam"></div>
      <div className="hb-particles">
        {particles.map((_, i) => <span key={i} style={{ "--p": i }}></span>)}
      </div>
      <div className="hb-spot"></div>
    </div>
  );
}

function PublicAppPreview() {
  const [r1, v1] = useCountUp(148);
  const [r2, v2] = useCountUp(231);
  const [r3, v3] = useCountUp(87.4, { decimals: 1 });
  return (
    <div className="public-app-preview" aria-hidden="true">
      <div className="public-preview-window">
        <div className="public-preview-topbar">
          <span></span><span></span><span></span>
          <b>DILAN CERDAS</b>
        </div>
        <div className="public-preview-body">
          <aside className="public-preview-sidebar">
            <div className="public-preview-brand"></div>
            {["Dashboard", "Surat Masuk", "Layanan", "IKM"].map((item, index) => (
              <div key={item} className={"public-preview-nav " + (index === 0 ? "on" : "")}>{item}</div>
            ))}
          </aside>
          <main className="public-preview-main">
            <div className="public-preview-head">
              <div>
                <span>Ringkasan layanan</span>
                <strong>Kecamatan Air Hitam</strong>
              </div>
              <button>Surat Baru</button>
            </div>
            <div className="public-preview-cards">
              <div><b ref={r1} className="tabnum">{v1}</b><span>Surat Masuk</span></div>
              <div><b ref={r2} className="tabnum">{v2}</b><span>Surat Keluar</span></div>
              <div><b ref={r3} className="tabnum">{v3}</b><span>IKM</span></div>
            </div>
            <div className="public-preview-list">
              {["Pengantar perbaikan data KTP", "Rekomendasi izin kegiatan", "Rekomendasi nikah"].map((item, index) => (
                <div key={item}>
                  <span className="tabnum">0{index + 1}</span>
                  <p>{item}</p>
                  <em>{index === 0 ? "Baru" : "Diproses"}</em>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function PublicAboutSection() {
  return (
    <section className="public-section" id="tentang">
      <SectionIntro
        eyebrow="DESKRIPSI SINGKAT APLIKASI"
        title={`Tentang ${APP_INFO.nama}`}
        desc={APP_INFO.kepanjangan}
      />
      <div className="public-about-modern">
        <aside className="public-about-panel">
          <div className="public-about-panel-top">
            <span className="public-about-logo"><img src={LOGO_SRC} alt="" /></span>
            <span className="public-about-kicker">Kecamatan Air Hitam</span>
          </div>
          <h3>Transformasi layanan publik dalam satu kanal digital.</h3>
          <p>{APP_INFO.tagline}</p>
          <div className="public-about-metrics">
            <span><b>6</b> Jenis layanan</span>
            <span><b>SPBE</b> Selaras digital</span>
            <span><b>IKM</b> Terukur berkala</span>
          </div>
        </aside>

        <div className="public-about-content">
          <article className="public-story-card">
            <span className="public-story-index tabnum">01</span>
            <div>
              <h3>Latar Belakang</h3>
              <p>{APP_INFO.latar}</p>
            </div>
          </article>
          <article className="public-story-card">
            <span className="public-story-index tabnum">02</span>
            <div>
              <h3>Konsep Inovasi</h3>
              <p>{APP_INFO.konsep}</p>
            </div>
          </article>
          <article className="public-principle-panel">
            <div>
              <span className="public-story-index tabnum">03</span>
              <h3>Prinsip Layanan</h3>
            </div>
            <div className="public-principle-list">
              {["Cepat", "Responsif", "Dinamis", "Akuntabel", "Sistematis"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        </div>
      </div>
      <div className="public-purpose-shell">
        <div className="public-purpose-head">
          <div className="public-eyebrow">TUJUAN APLIKASI</div>
          <h3>Target perubahan pelayanan publik</h3>
        </div>
        <div className="public-purpose-list">
          {APP_INFO.tujuan.map((item, index) => (
            <div key={item} className="public-purpose-item">
              <span className="tabnum">{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PublicLegalSection() {
  return (
    <section className="public-section public-section-muted" id="dasar-hukum">
      <SectionIntro
        eyebrow="DASAR HUKUM"
        title="Landasan penyelenggaraan inovasi"
        desc="Mengacu pada aturan pelayanan publik, inovasi daerah, SPBE, dan perangkat daerah."
      />
      <div className="public-legal-layout">
        <aside className="public-legal-feature">
          <span className="tabnum">7</span>
          <h3>Regulasi utama</h3>
          <p>Pelayanan publik, pemerintahan daerah, inovasi daerah, SPBE, dan pembentukan Kecamatan Air Hitam.</p>
        </aside>
        <div className="public-legal-accordion">
          {APP_INFO.dasarHukum.map((item, index) => (
            <details key={item} className="public-legal-detail" open={index === 0}>
              <summary><span className="tabnum">{String(index + 1).padStart(2, "0")}</span>{item.split(" tentang ")[0]}</summary>
              <p>{item}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function PublicAdministrationSection() {
  return (
    <section className="public-section" id="administrasi">
      <SectionIntro
        eyebrow="ADMINISTRASI & MEKANISME"
        title="Alur administrasi yang terdigitalisasi"
        desc="Alur layanan dibuat jelas dari pengajuan sampai arsip."
      />
      <div className="public-flow">
        {PUBLIC_FLOW.map((item, index) => (
          <article key={item.title} className="public-flow-step">
            <span className="tabnum">{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PublicLanding({ onLogin, focusSection, onFocusHandled }) {
  const regionName = OFFICE.pemda.replace(/^Pemerintah\s+/i, "");
  const [navOpen, setNavOpen] = useState(false);
  const rootRef = useRef(null);

  function jumpTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setNavOpen(false);
  }

  useEffect(() => {
    if (!focusSection) return;
    requestAnimationFrame(() => {
      document.getElementById(focusSection)?.scrollIntoView({ behavior: "smooth", block: "start" });
      onFocusHandled?.();
    });
  }, [focusSection, onFocusHandled]);

  /* Scroll-reveal with stagger — respects reduced-motion */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const groups = [
      ".public-section-intro",
      ".public-about-panel", ".public-story-card", ".public-principle-panel",
      ".public-purpose-shell",
      ".public-legal-feature", ".public-legal-detail",
      ".public-flow-step",
      ".public-service-card",
      ".public-impact-step",
      ".public-panel",
      ".public-footer-grid > *",
    ];
    const seen = new Set();
    const els = [];
    groups.forEach((sel) => {
      root.querySelectorAll(sel).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        el.classList.add("reveal");
        els.push(el);
      });
    });
    // stagger index within each parent row
    els.forEach((el) => {
      const sibs = Array.from(el.parentElement ? el.parentElement.children : [el]).filter((c) => c.classList.contains("reveal"));
      el.style.setProperty("--rev-i", String(sibs.indexOf(el) % 6));
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -7% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Interactive hero — cursor spotlight, 3D preview tilt, scroll parallax */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = root.querySelector(".public-hero");
    const win = root.querySelector(".public-app-preview .public-preview-window");
    if (!hero) return;

    let raf = 0;
    let mx = 50, my = 40;
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 100;
      my = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const apply = () => {
      raf = 0;
      hero.style.setProperty("--mx", mx.toFixed(2) + "%");
      hero.style.setProperty("--my", my.toFixed(2) + "%");
      if (win) {
        const rx = ((50 - my) / 50) * 5;
        const ry = ((mx - 50) / 50) * 7;
        win.style.setProperty("--rx", rx.toFixed(2) + "deg");
        win.style.setProperty("--ry", ry.toFixed(2) + "deg");
      }
    };
    const onLeave = () => {
      if (win) { win.style.setProperty("--rx", "0deg"); win.style.setProperty("--ry", "0deg"); }
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    let sraf = 0;
    const onScroll = () => {
      if (sraf) return;
      sraf = requestAnimationFrame(() => {
        sraf = 0;
        const y = window.scrollY || 0;
        hero.style.setProperty("--sy", y + "px");
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sraf);
    };
  }, []);

  return (
    <div className="public-site" ref={rootRef}>
      <section className="public-hero" id="top">
        <PublicHeroBackground />
        <div className="public-hero-grain" aria-hidden="true"></div>
        <header className="public-nav-shell">
          <div className="public-nav">
            <a href="#top" className="public-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setNavOpen(false); }}>
              <span className="public-brand-mark"><img src={LOGO_SRC} alt="" /></span>
              <span>
                <strong>{APP_INFO.nama}</strong>
                <small>{regionName}</small>
              </span>
            </a>
            <button
              type="button"
              className="public-hamburger"
              aria-label={navOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              <Icon name={navOpen ? "close" : "menu"} size={20} />
            </button>
            <nav className={"public-nav-links" + (navOpen ? " nav-open" : "")}>
              <a href="#tentang" onClick={(e) => { e.preventDefault(); jumpTo("tentang"); }}>Tentang</a>
              <a href="#dasar-hukum" onClick={(e) => { e.preventDefault(); jumpTo("dasar-hukum"); }}>Dasar Hukum</a>
              <a href="#administrasi" onClick={(e) => { e.preventDefault(); jumpTo("administrasi"); }}>Administrasi</a>
              <a href="#layanan" onClick={(e) => { e.preventDefault(); jumpTo("layanan"); }}>Layanan</a>
              <a href="#dampak" onClick={(e) => { e.preventDefault(); jumpTo("dampak"); }}>Dampak</a>
              <a href="#pengaduan" onClick={(e) => { e.preventDefault(); jumpTo("pengaduan"); }}>Pengaduan</a>
              <button type="button" className="public-top-login" onClick={() => { setNavOpen(false); onLogin(); }}>
                Masuk Petugas <Icon name="chevright" size={14} />
              </button>
            </nav>
          </div>
        </header>

        <div className="public-hero-inner">
          <div className="public-hero-showcase">
            <div className="public-hero-copy">
              <div className="public-pill"><span></span>INOVASI PELAYANAN PUBLIK · IGA 2026</div>
              <h1 className="public-hero-title">
                <span>{APP_INFO.nama}</span>
                <span><em className="gold">Portal Layanan Digital</em></span>
                <span><em className="mint">Kecamatan Air Hitam.</em></span>
              </h1>
              <p className="public-hero-desc">
                Akses informasi layanan, pengaduan, dan survei kepuasan dalam satu kanal.
                Petugas juga dapat mengelola surat dan arsip dengan lebih tertib.
              </p>
              <div className="public-hero-actions">
                <button type="button" className="public-cta public-cta-gold" onClick={() => jumpTo("pengaduan")}>
                  <Icon name="mail" size={15} /> Sampaikan Pengaduan
                </button>
                <button type="button" className="public-cta public-cta-ghost" onClick={onLogin}>
                  <Icon name="lock" size={15} /> Masuk Petugas
                </button>
              </div>
            </div>
            <PublicAppPreview />
          </div>

          <div className="public-stat-row">
            {PUBLIC_STATS.map((stat) => (
              <article key={stat.label} className="public-stat-card">
                <span className="public-stat-icon"><Icon name={stat.icon} size={17} /></span>
                <div>
                  <div className="public-stat-value tabnum">{stat.value}</div>
                  <p>{stat.label}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="public-surface">
        <PublicAboutSection />
        <PublicLegalSection />
        <PublicAdministrationSection />

        <section className="public-section" id="layanan">
          <SectionIntro
            eyebrow="RUANG LINGKUP LAYANAN"
            title="Jenis layanan DILAN CERDAS"
            desc="Layanan surat pengantar dan rekomendasi di Kecamatan Air Hitam."
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
            title="Sebelum vs sesudah penerapan"
            desc="Perbandingan singkat sebelum dan setelah layanan dibuat digital."
          />
          <div className="public-impact-board">
            <aside className="public-impact-summary">
              <span className="public-impact-summary-kicker">Transformasi layanan</span>
              <h3>Dari proses manual menjadi layanan yang lebih terbuka.</h3>
              <p>Setiap aspek dibuat lebih mudah dipantau, lebih cepat diproses, dan lebih rapi untuk kebutuhan arsip kecamatan.</p>
              <div className="public-impact-summary-points" aria-hidden="true">
                <span>Manual</span>
                <i></i>
                <span>Digital</span>
              </div>
            </aside>
            <div className="public-impact-timeline">
              {PUBLIC_IMPACT.map((row, index) => (
                <article key={row.aspect} className="public-impact-step">
                  <div className="public-impact-aspect">
                    <span className="public-impact-index tabnum">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{row.aspect}</h3>
                  </div>
                  <div className="public-impact-compare">
                    <div className="public-impact-state before">
                      <span>Sebelum</span>
                      <p>{row.before}</p>
                    </div>
                    <div className="public-impact-arrow" aria-hidden="true">
                      <Icon name="chevright" size={15} />
                    </div>
                    <div className="public-impact-state after">
                      <span>Sesudah</span>
                      <p>{row.after}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="public-section" id="partisipasi">
          <SectionIntro
            eyebrow="PARTISIPASI MASYARAKAT"
            title="Sampaikan suara Anda"
            desc="Pengaduan dan survei bisa diisi tanpa akun."
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
                <span className="public-brand-mark"><img src={LOGO_SRC} alt="" /></span>
                <span>
                  <strong>{APP_INFO.nama}</strong>
                  <small>{regionName}</small>
                </span>
              </div>
              <p className="public-footer-copy">
                {APP_INFO.tagline} Dibuat untuk layanan yang lebih rapi, cepat, dan mudah dipantau.
              </p>
            </div>
            <div>
              <h4>Layanan</h4>
              <div className="public-footer-links">
                <a href="#pengaduan" onClick={(e) => { e.preventDefault(); jumpTo("pengaduan"); }}>Pengaduan Masyarakat</a>
                <a href="#survei-ikm" onClick={(e) => { e.preventDefault(); jumpTo("survei-ikm"); }}>Survei Kepuasan</a>
                <a href="#layanan" onClick={(e) => { e.preventDefault(); jumpTo("layanan"); }}>Informasi Layanan</a>
                <button type="button" className="public-footer-login" onClick={onLogin}>Masuk Petugas</button>
              </div>
            </div>
            <div>
              <h4>Kontak</h4>
              <div className="public-footer-meta">
                <span>{OFFICE.alamat}</span>
                <span>{OFFICE.email}</span>
                <span>{OFFICE.jam}</span>
                <span>{OFFICE.berdiri}</span>
              </div>
            </div>
          </div>
          <div className="public-footer-bottom">
            <span>© 2026 {OFFICE.nama}, {OFFICE.pemda}.</span>
            <span>Dikembangkan oleh <b>Inovtek Cipta Digital</b></span>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ---------- Sidebar ---------- */
function Sidebar({ role, screen, go, open, onClose }) {
  const me = { "User": "SITI AJRAH", "Admin": "ZULKARNAIN, S.E.", "Super Admin": "FATHURRAHMAN, S.STP" }[role];
  return (
    <>
      {open && <div className="scrim" onClick={onClose}></div>}
      <aside className={"sidebar " + (open ? "open" : "")}>
        <div className="brand">
          <div className="emblem"><img src={LOGO_SRC} alt="" /></div>
          <div className="col"><span className="bt">{APP_INFO.nama}</span><span className="bs">Kecamatan Air Hitam</span></div>
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

  useEffect(() => {
    function handlePopState() {
      if (window.location.hash === "#login" && !role) {
        setView("login");
        return;
      }
      if (!role) {
        setView("landing");
        setLandingSection(null);
        setSideOpen(false);
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [role]);

  function openLanding(section = null) {
    if (window.location.hash === "#login") {
      window.history.replaceState({ view: "landing" }, "", window.location.pathname + window.location.search);
    }
    setView("landing");
    setLandingSection(section);
    setSideOpen(false);
    window.scrollTo(0, 0);
  }

  function openLogin() {
    if (window.location.hash !== "#login") {
      window.history.pushState({ view: "login" }, "", "#login");
    }
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
  const titleMap = { Admin: "ZULKARNAIN, S.E.", User: "SITI AJRAH", "Super Admin": "FATHURRAHMAN, S.STP" };

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
