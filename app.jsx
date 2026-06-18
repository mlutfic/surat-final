/* ============================================================
   SISTEM SURAT — Public landing, login, routing, shell
   ============================================================ */

const NAV = [
  { group: "Utama", items: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", roles: ["User", "Super Admin"] },
    { id: "tentang-aplikasi", label: "Tentang Aplikasi", icon: "globe", roles: ["User", "Super Admin"] },
  ]},
  { group: "Persuratan", items: [
    { id: "rekap-masuk", label: "Rekap Surat Masuk", icon: "inbox", roles: ["User", "Super Admin"] },
    { id: "rekap-keluar", label: "Rekap Surat Keluar", icon: "send", roles: ["User", "Super Admin"] },
    { id: "form-masuk", label: "Surat Masuk / Permohonan", icon: "fileplus", roles: ["User", "Super Admin"] },
    { id: "form-keluar", label: "Surat Keluar", icon: "mail", roles: ["User", "Super Admin"] },
  ]},
  { group: "Profil & SDM", items: [
    { id: "profil", label: "Profil Kantor", icon: "building", roles: ["User", "Super Admin"] },
    { id: "struktur", label: "Struktur Organisasi", icon: "sitemap", roles: ["User", "Super Admin"] },
    { id: "pegawai", label: "Data Kepegawaian", icon: "idcard", roles: ["Super Admin"] },
  ]},
  { group: "Layanan Publik", items: [
    { id: "pengaduan", label: "Layanan Pengaduan", icon: "megaphone", roles: ["User", "Super Admin"] },
    { id: "survei", label: "Survei Kepuasan", icon: "survey", roles: ["User", "Super Admin"] },
  ]},
  { group: "Administrasi", items: [
    { id: "akun", label: "Manajemen Akun", icon: "usercog", roles: ["Super Admin"] },
  ]},
];

const SCREENS = {
  dashboard: (props) => <Dashboard {...props} />,
  "tentang-aplikasi": () => <TentangAplikasi />,
  "rekap-masuk": (props) => <RekapSuratMasuk {...props} />,
  "rekap-keluar": (props) => <RekapSuratKeluar {...props} />,
  "form-masuk": (props) => <FormSuratMasuk {...props} />,
  "form-keluar": (props) => <FormSuratKeluar {...props} />,
  profil: () => <ProfilKantor />,
  struktur: () => <StrukturOrganisasi />,
  pegawai: () => <DataKepegawaian />,
  pengaduan: () => <LayananPengaduan />,
  survei: () => <SurveiKepuasan />,
  akun: () => <ManajemenAkun />,
};

const DENSITY = {
  compact: { "--row-py": "8px", "--cell-px": "14px", "--card-pad": "18px" },
  regular: { "--row-py": "13px", "--cell-px": "18px", "--card-pad": "22px" },
  comfy: { "--row-py": "18px", "--cell-px": "22px", "--card-pad": "26px" },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "regular",
  "accent": "#b8842a"
}/*EDITMODE-END*/;

function Login({ onSuccess, onPublic }) {
  const office = AppSelectors.office();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const whatsappTarget = office?.whatsapp_notification || "-";

  async function submit() {
    setBusy(true);
    setError("");
    try {
      await AppApi.login(username, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Gagal masuk.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-form-side">
        <div className="login-stage">
          <section className="login-aside">
            <div className="login-aside-panel">
              <div className="login-aside-top">
                <div className="login-brand-lockup">
                  <span className="login-brand-mark"><img src={office?.logo_url || "assets/sarolangun-logo.jpeg"} alt="" /></span>
                  <span>
                    <strong>{office?.app_name || "DILAN CERDAS"}</strong>
                    <small>{office?.district_name || "Kecamatan Air Hitam"}</small>
                  </span>
                </div>
                <div className="login-aside-badge">
                  <span className="login-aside-badge-dot"></span>
                  Data Live Supabase
                </div>
              </div>

              <div className="login-aside-copy">
                <p className="login-aside-kicker">Portal Operator Persuratan</p>
                <h1 className="login-aside-title">Pusat kendali surat dan layanan Kecamatan Air Hitam.</h1>
                <p className="login-aside-desc">
                  Operator desa dan kantor camat bekerja pada database yang sama, dengan alur dokumen yang saling terhubung.
                </p>
              </div>

              <div className="login-aside-points">
                <div className="login-aside-point">
                  <span className="login-aside-icon"><Icon name="inbox" size={18} /></span>
                  <div>
                    <strong>Surat Masuk & Keluar</strong>
                    <p>Agenda, status proses, cetak, dan unduh dokumen dalam satu alur.</p>
                  </div>
                </div>
                <div className="login-aside-point">
                  <span className="login-aside-icon"><Icon name="shield" size={18} /></span>
                  <div>
                    <strong>Akses berbasis akun unit kerja</strong>
                    <p>Hak akses dibedakan antara operator desa dan kantor camat.</p>
                  </div>
                </div>
                <div className="login-aside-point">
                  <span className="login-aside-icon"><Icon name="whatsapp" size={18} /></span>
                  <div>
                    <strong>Notifikasi WhatsApp terpusat</strong>
                    <p>Seluruh notifikasi dokumen diarahkan ke nomor resmi {whatsappTarget}.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="login-panel">
            <div className="login-card">
              <button type="button" className="login-back-link" onClick={() => onPublic?.()}>
                <Icon name="arrowleft" size={15} /> Landing Page
              </button>

              <div className="login-card-brand">
                <div className="login-brand-lockup login-brand-lockup-dark">
                  <span className="login-brand-mark"><img src={office?.logo_url || "assets/sarolangun-logo.jpeg"} alt="" /></span>
                  <span>
                    <strong>{office?.app_name || "DILAN CERDAS"}</strong>
                    <small>{office?.district_name || "Kecamatan Air Hitam"}</small>
                  </span>
                </div>
              </div>

              <div className="login-card-head">
                <p className="login-card-kicker">Akses Operator</p>
                <h1 className="login-card-title">Masuk</h1>
                <p className="login-card-subtitle">Masukkan akun operator desa atau akun kantor camat yang sudah tersimpan di database.</p>
              </div>

              <div className="login-field-stack">
                <Field label="Nama Pengguna">
                  <div className="login-input-shell">
                    <span><Icon name="user" size={16} /></span>
                    <input className="input" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Contoh: desa.jernih" onKeyDown={(event) => { if (event.key === "Enter") submit(); }} />
                  </div>
                </Field>
                <Field label="Kata Sandi">
                  <div className="login-input-shell">
                    <span><Icon name="lock" size={16} /></span>
                    <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" onKeyDown={(event) => { if (event.key === "Enter") submit(); }} />
                  </div>
                </Field>
              </div>

              <div className="login-info-strip">
                <Icon name="whatsapp" size={15} />
                <span>Notifikasi dokumen terhubung ke WhatsApp resmi <b>{whatsappTarget}</b>.</span>
              </div>

              {error && <div style={{ marginTop: 14 }}><InlineNotice tone="danger">{error}</InlineNotice></div>}

              <button type="button" className="login-submit" disabled={busy} onClick={submit}>
                {busy ? "Memproses..." : "Masuk"} <Icon name="chevright" size={16} />
              </button>
            </div>
          </section>
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
        {particles.map((_, index) => <span key={index} style={{ "--p": index }}></span>)}
      </div>
      <div className="hb-spot"></div>
    </div>
  );
}

function PublicAppPreview() {
  const counts = AppSelectors.publicCounts();
  const summary = AppSelectors.surveySummary();
  const office = AppSelectors.office();
  return (
    <div className="public-app-preview" aria-hidden="true">
      <div className="public-preview-window">
        <div className="public-preview-topbar">
          <span></span><span></span><span></span>
          <b>{office?.app_name || "DILAN CERDAS"}</b>
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
                <strong>{office?.district_name || "Kecamatan Air Hitam"}</strong>
              </div>
              <button>Live DB</button>
            </div>
            <div className="public-preview-cards">
              <div><b className="tabnum">{counts.incoming}</b><span>Surat Masuk</span></div>
              <div><b className="tabnum">{counts.outgoing}</b><span>Surat Keluar</span></div>
              <div><b className="tabnum">{formatNumberId(summary.ikm || 0, 1)}</b><span>IKM</span></div>
            </div>
            <div className="public-preview-list">
              {AppSelectors.serviceTypes().slice(0, 3).map((item, index) => (
                <div key={item.id}>
                  <span className="tabnum">0{index + 1}</span>
                  <p>{item.name}</p>
                  <em>{item.badge}</em>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function PublicComplaintCard() {
  const office = AppSelectors.office();
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    phone: "",
    address: "",
    category: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (office?.complaint_categories?.length && !form.category) {
      setForm((value) => ({ ...value, category: office.complaint_categories[0] }));
    }
  }, [office?.complaint_categories?.length]);

  async function submit() {
    setBusy(true);
    try {
      await AppApi.saveComplaint(form, "Publik");
      setForm({
        full_name: "",
        age: "",
        phone: "",
        address: "",
        category: office?.complaint_categories?.[0] || "",
        message: "",
      });
    } catch (error) {
      AppApi.setNotice(error.message || "Gagal mengirim pengaduan publik.", "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div id="pengaduan" className="public-panel">
      <div className="public-panel-head">
        <span className="public-panel-icon public-panel-icon-blue"><Icon name="mail" size={18} /></span>
        <div>
          <h3>Layanan Pengaduan</h3>
          <p>Tindak lanjut dapat dipantau langsung dari dashboard pengelola.</p>
        </div>
      </div>
      <div className="public-form-stack">
        <div className="field">
          <label>Nama Pelapor</label>
          <input className="input public-input" value={form.full_name} onChange={(event) => setForm((value) => ({ ...value, full_name: event.target.value }))} placeholder="Nama lengkap Anda" />
        </div>
        <div className="field">
          <label>Umur</label>
          <input className="input public-input tabnum" type="number" value={form.age} onChange={(event) => setForm((value) => ({ ...value, age: event.target.value }))} placeholder="Usia" />
        </div>
        <div className="field">
          <label>Nomor WhatsApp / Telepon</label>
          <input className="input public-input tabnum" value={form.phone} onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))} placeholder="08x-xxxx-xxxx" />
        </div>
        <div className="field">
          <label>Kategori Aduan</label>
          <select className="select public-input" value={form.category} onChange={(event) => setForm((value) => ({ ...value, category: event.target.value }))}>
            {(office?.complaint_categories || []).map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Alamat</label>
          <input className="input public-input" value={form.address} onChange={(event) => setForm((value) => ({ ...value, address: event.target.value }))} placeholder="Alamat domisili" />
        </div>
        <div className="field">
          <label>Isi Pengaduan</label>
          <textarea className="textarea public-input public-textarea" value={form.message} onChange={(event) => setForm((value) => ({ ...value, message: event.target.value }))} placeholder="Ceritakan keluhan atau aspirasi Anda..."></textarea>
        </div>
      </div>
      <button type="button" className="public-submit public-submit-green" disabled={busy} onClick={submit}>
        {busy ? "Mengirim..." : "Kirim Pengaduan"} <Icon name="chevright" size={15} />
      </button>
    </div>
  );
}

function PublicSurveyCard() {
  const questions = AppSelectors.surveyQuestions();
  const [answers, setAnswers] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setAnswers(Array(questions.length).fill(-1));
  }, [questions.length]);

  function selectAnswer(index, value) {
    setAnswers((current) => {
      const next = current.slice();
      next[index] = value;
      return next;
    });
  }

  async function submit() {
    setBusy(true);
    try {
      await AppApi.submitSurvey(
        questions.map((question, index) => ({ question_id: question.id, score: answers[index] + 1 })),
        "Publik"
      );
      setAnswers(Array(questions.length).fill(-1));
    } catch (error) {
      AppApi.setNotice(error.message || "Gagal mengirim survei publik.", "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div id="survei-ikm" className="public-panel">
      <div className="public-panel-head">
        <span className="public-panel-icon public-panel-icon-green"><Icon name="star" size={18} /></span>
        <div>
          <h3>Survei Kepuasan (IKM)</h3>
          <p>{questions.length} unsur penilaian · skala 1 sampai 4.</p>
        </div>
      </div>
      <div className="public-survey-stack">
        {questions.map((question, index) => (
          <div key={question.id} className="public-survey-row">
            <div className="public-survey-label">{index + 1}. {question.question_text}</div>
            <div className="public-survey-scale">
              {[1, 2, 3, 4].map((value) => (
                <button type="button" key={value} className={"public-scale-opt " + (answers[index] === value - 1 ? "on" : "")} onClick={() => selectAnswer(index, value - 1)}>
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="public-submit public-submit-green" disabled={busy || answers.some((value) => value < 0)} onClick={submit}>
        {busy ? "Mengirim..." : "Kirim Penilaian"} <Icon name="star" size={15} />
      </button>
    </div>
  );
}

function PublicLanding({ onLogin }) {
  const office = AppSelectors.office();
  const services = AppSelectors.serviceTypes();
  const counts = AppSelectors.publicCounts();
  const survey = AppSelectors.surveySummary();
  const complaints = AppSelectors.complaints();

  if (!office) return <LoadingBlock label="Memuat portal publik..." />;

  return (
    <div className="public-site">
      <section className="public-hero" id="top">
        <PublicHeroBackground />
        <div className="public-hero-grain" aria-hidden="true"></div>
        <header className="public-nav-shell">
          <div className="public-nav">
            <a href="#top" className="public-brand">
              <span className="public-brand-mark"><img src={office.logo_url} alt="" /></span>
              <span>
                <strong>{office.app_name}</strong>
                <small>{office.district_name}</small>
              </span>
            </a>
            <nav className="public-nav-links">
              <a href="#tentang">Tentang</a>
              <a href="#dasar-hukum">Dasar Hukum</a>
              <a href="#administrasi">Administrasi</a>
              <a href="#layanan">Layanan</a>
              <a href="#partisipasi">Partisipasi</a>
              <button type="button" className="public-top-login" onClick={onLogin}>
                Masuk Petugas <Icon name="chevright" size={14} />
              </button>
            </nav>
          </div>
        </header>

        <div className="public-hero-inner">
          <div className="public-hero-showcase">
            <div className="public-hero-copy">
              <h1 className="public-hero-title">
                <span>{office.app_name}</span>
                <span><em className="gold">Portal Layanan Digital</em></span>
                <span><em className="mint">{office.district_name}.</em></span>
              </h1>
              <p className="public-hero-desc">
                {office.app_tagline} Seluruh angka, layanan, dan modul pada halaman ini dibaca langsung dari Supabase, bukan lagi dari data dummy.
              </p>
              <div className="public-hero-actions">
                <button type="button" className="public-cta public-cta-gold" onClick={() => document.getElementById("pengaduan")?.scrollIntoView({ behavior: "smooth" })}>
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
            {[
              { value: services.length, label: "Jenis layanan", icon: "doc" },
              { value: counts.incoming, label: "Surat masuk", icon: "inbox" },
              { value: formatNumberId(survey.ikm || 0, 1), label: "Nilai IKM", icon: "survey" },
              { value: complaints.filter((item) => item.status === "Baru").length, label: "Aduan baru", icon: "megaphone" },
            ].map((stat) => (
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
        <section className="public-section" id="tentang">
          <SectionIntro eyebrow="DESKRIPSI SINGKAT APLIKASI" title={`Tentang ${office.app_name}`} desc={office.app_expansion} />
          <div className="public-about-modern">
            <aside className="public-about-panel">
              <div className="public-about-panel-top">
                <span className="public-about-logo"><img src={office.logo_url} alt="" /></span>
                <span className="public-about-kicker">{office.district_name}</span>
              </div>
              <h3>Transformasi layanan publik dalam satu kanal digital.</h3>
              <p>{office.app_tagline}</p>
              <div className="public-about-metrics">
                <span><b>{services.length}</b> Jenis layanan</span>
                <span><b>Live</b> Database</span>
                <span><b>{survey.mutu}</b> Mutu IKM</span>
              </div>
            </aside>
            <div className="public-about-content">
              <article className="public-story-card">
                <span className="public-story-index tabnum">01</span>
                <div>
                  <h3>Latar Belakang</h3>
                  <p>{office.background_text}</p>
                </div>
              </article>
              <article className="public-story-card">
                <span className="public-story-index tabnum">02</span>
                <div>
                  <h3>Konsep Inovasi</h3>
                  <p>{office.concept_text}</p>
                </div>
              </article>
              <article className="public-principle-panel">
                <div>
                  <span className="public-story-index tabnum">03</span>
                  <h3>Tujuan Layanan</h3>
                </div>
                <div className="public-principle-list">
                  {office.goals.slice(0, 5).map((item) => <span key={item}>{item}</span>)}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="public-section public-section-muted" id="dasar-hukum">
          <SectionIntro eyebrow="DASAR HUKUM" title="Landasan penyelenggaraan inovasi" desc="Mengacu pada aturan pelayanan publik, inovasi daerah, SPBE, dan perangkat daerah." />
          <div className="public-legal-layout">
            <aside className="public-legal-feature">
              <span className="tabnum">{office.legal_references.length}</span>
              <h3>Regulasi utama</h3>
              <p>Seluruh daftar dasar hukum dikelola dari basis data dan dapat diperbarui dari modul profil kantor.</p>
            </aside>
            <div className="public-legal-accordion">
              {office.legal_references.map((item, index) => (
                <details key={item} className="public-legal-detail" open={index === 0}>
                  <summary><span className="tabnum">{String(index + 1).padStart(2, "0")}</span>{item.split(" tentang ")[0]}</summary>
                  <p>{item}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="public-section" id="administrasi">
          <SectionIntro eyebrow="ADMINISTRASI & MEKANISME" title="Alur administrasi yang terdigitalisasi" desc="Alur layanan dibuat jelas dari pengajuan sampai arsip." />
          <div className="public-flow">
            {office.flow_steps.map((item, index) => (
              <article key={item.title} className="public-flow-step">
                <span className="tabnum">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-section" id="layanan">
          <SectionIntro eyebrow="RUANG LINGKUP LAYANAN" title="Jenis layanan DILAN CERDAS" desc="Layanan surat pengantar dan rekomendasi di Kecamatan Air Hitam." />
          <div className="public-service-grid">
            {services.map((service) => (
              <article key={service.id} className="public-service-card">
                <div className="public-service-top">
                  <span className={"public-service-icon " + (service.audience === "public" ? "public" : "internal")}>
                    <Icon name={service.icon} size={19} />
                  </span>
                  <span className={"public-service-badge " + (service.audience === "public" ? "public" : "internal")}>
                    {service.badge.toUpperCase()}
                  </span>
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-section public-section-muted" id="dampak">
          <SectionIntro eyebrow="DAMPAK & MANFAAT" title="Sebelum vs sesudah penerapan" desc="Perbandingan singkat sebelum dan setelah layanan dibuat digital." />
          <div className="public-impact-board">
            <aside className="public-impact-summary">
              <span className="public-impact-summary-kicker">Transformasi layanan</span>
              <h3>Dari proses manual menjadi layanan yang lebih terbuka.</h3>
              <p>Setiap aspek dibuat lebih mudah dipantau, lebih cepat diproses, dan lebih rapi untuk kebutuhan arsip kecamatan.</p>
              <div className="public-impact-summary-points" aria-hidden="true">
                <span>Manual</span><i></i><span>Digital</span>
              </div>
            </aside>
            <div className="public-impact-timeline">
              {office.impact_points.map((row, index) => (
                <article key={row.aspect} className="public-impact-step">
                  <div className="public-impact-aspect">
                    <span className="public-impact-index tabnum">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{row.aspect}</h3>
                  </div>
                  <div className="public-impact-compare">
                    <div className="public-impact-state before"><span>Sebelum</span><p>{row.before}</p></div>
                    <div className="public-impact-arrow" aria-hidden="true"><Icon name="chevright" size={15} /></div>
                    <div className="public-impact-state after"><span>Sesudah</span><p>{row.after}</p></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="public-section" id="partisipasi">
          <SectionIntro eyebrow="PARTISIPASI MASYARAKAT" title="Sampaikan suara Anda" desc="Pengaduan dan survei publik tersimpan langsung ke database yang sama dengan dashboard pengelola." />
          <div className="public-participation-grid">
            <PublicComplaintCard />
            <PublicSurveyCard />
          </div>
        </section>

        <footer className="public-footer">
          <div className="public-footer-grid">
            <div>
              <div className="public-brand public-footer-brand">
                <span className="public-brand-mark"><img src={office.logo_url} alt="" /></span>
                <span>
                  <strong>{office.app_name}</strong>
                  <small>{office.district_name}</small>
                </span>
              </div>
              <p className="public-footer-copy">{office.app_tagline}</p>
            </div>
            <div>
              <h4>Layanan</h4>
              <div className="public-footer-links">
                <a href="#pengaduan">Pengaduan Masyarakat</a>
                <a href="#survei-ikm">Survei Kepuasan</a>
                <a href="#layanan">Informasi Layanan</a>
                <button type="button" className="public-footer-login" onClick={onLogin}>Masuk Petugas</button>
              </div>
            </div>
            <div>
              <h4>Kontak</h4>
              <div className="public-footer-meta">
                <span>{office.address}</span>
                <span>{office.email}</span>
                <span>{office.service_hours}</span>
                <span>{office.legal_basis_established}</span>
              </div>
            </div>
          </div>
          <div className="public-footer-bottom">
            <span>© 2026 {office.office_name}, {office.government_name}.</span>
            <span>Dikembangkan oleh <b>Inovtek Cipta Digital</b></span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Sidebar({ session, screen, go, open, onClose }) {
  const identity = AppSelectors.currentIdentity();
  const incomingCount = AppSelectors.incomingLetters().length;
  const outgoingCount = AppSelectors.outgoingLetters().length;
  const complaintCount = AppSelectors.complaints().filter((item) => item.status === "Baru").length;
  const counts = {
    "rekap-masuk": incomingCount,
    "rekap-keluar": outgoingCount,
    pengaduan: complaintCount,
  };
  const office = AppSelectors.office();

  return (
    <>
      {open && <div className="scrim" onClick={onClose}></div>}
      <aside className={"sidebar " + (open ? "open" : "")}>
        <div className="brand">
          <div className="emblem"><img src={office?.logo_url || "assets/sarolangun-logo.jpeg"} alt="" /></div>
          <div className="col"><span className="bt">{office?.app_name || "DILAN CERDAS"}</span><span className="bs">{office?.district_name || "Kecamatan Air Hitam"}</span></div>
        </div>
        <nav className="nav">
          {NAV.map((group) => {
            const items = group.items.filter((item) => item.roles.includes(session.role));
            if (!items.length) return null;
            return (
              <div key={group.group}>
                <div className="nav-group-label">{group.group}</div>
                {items.map((item) => (
                  <a key={item.id} className={"nav-item " + (screen === item.id ? "active" : "")} onClick={() => { go(item.id); onClose(); }}>
                    <Icon name={item.icon} size={18} />{item.label}
                    {counts[item.id] ? <span className="nav-count tabnum">{counts[item.id]}</span> : null}
                  </a>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="side-foot">
          <div className="side-user">
            <Avatar name={identity?.full_name || session.full_name} size={36} />
            <div className="col grow" style={{ minWidth: 0 }}>
              <span className="nm" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{identity?.full_name || session.full_name}</span>
              <span className="rl">{identity?.unit_name || session.unit_name}</span>
            </div>
            <button type="button" className="iconbtn" style={{ color: "oklch(0.7 0.03 256)" }} title="Keluar" onClick={() => go("__logout")}><Icon name="logout" size={17} /></button>
          </div>
        </div>
      </aside>
    </>
  );
}

function AppNoticeBar({ notice, error }) {
  if (!notice && !error) return null;
  return (
    <div style={{ padding: "16px 24px 0" }}>
      {notice && <InlineNotice tone={notice.tone === "danger" ? "danger" : notice.tone === "warn" ? "warn" : notice.tone === "info" ? "info" : "ok"}>{notice.message}</InlineNotice>}
      {error && <div style={{ marginTop: notice ? 12 : 0 }}><InlineNotice tone="danger">{error}</InlineNotice></div>}
    </div>
  );
}

function App() {
  const state = useAppState();
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [view, setView] = useState(window.location.hash === "#login" ? "login" : "landing");

  useEffect(() => {
    AppApi.bootstrap().catch(() => null);
  }, []);

  useEffect(() => {
    const density = DENSITY[tweaks.density] || DENSITY.regular;
    for (const key in density) document.documentElement.style.setProperty(key, density[key]);
  }, [tweaks.density]);

  useEffect(() => {
    if (tweaks.accent) document.documentElement.style.setProperty("--gold-500", tweaks.accent);
  }, [tweaks.accent]);

  useEffect(() => {
    if (state.session) setView("app");
  }, [state.session?.id]);

  useEffect(() => {
    function handlePopState() {
      if (window.location.hash === "#login" && !state.session) {
        setView("login");
      } else if (!state.session) {
        setView("landing");
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [state.session]);

  function openLanding() {
    if (window.location.hash === "#login") {
      window.history.replaceState({ view: "landing" }, "", window.location.pathname + window.location.search);
    }
    setView("landing");
    window.scrollTo(0, 0);
  }

  function openLogin() {
    if (window.location.hash !== "#login") {
      window.history.pushState({ view: "login" }, "", "#login");
    }
    setView("login");
    window.scrollTo(0, 0);
  }

  function go(id) {
    if (id === "__logout") {
      AppApi.logout();
      setScreen("dashboard");
      openLanding();
      return;
    }
    setScreen(id);
    document.querySelector(".main")?.scrollTo({ top: 0 });
  }

  if (!state.ready && state.loading) {
    return <LoadingBlock label="Menghubungkan aplikasi ke Supabase..." />;
  }

  if (!state.session) {
    if (view === "login") {
      return <Login onSuccess={() => setView("app")} onPublic={openLanding} />;
    }
    return <PublicLanding onLogin={openLogin} />;
  }

  const allowed = NAV.flatMap((group) => group.items).find((item) => item.id === screen && item.roles.includes(state.session.role));
  const activeScreen = allowed ? screen : "dashboard";
  const identity = AppSelectors.currentIdentity();

  return (
    <div className="app">
      <Sidebar session={state.session} screen={activeScreen} go={go} open={sideOpen} onClose={() => setSideOpen(false)} />
      <div className="main">
        <header className="topbar">
          <button type="button" className="iconbtn menu-toggle" onClick={() => setSideOpen(true)}><Icon name="menu" size={20} /></button>
          <div className="searchbar"><Icon name="search" size={16} /><input readOnly value={`Akun aktif: ${identity?.full_name || state.session.full_name}`} /></div>
          <div className="grow"></div>
          <span className={"badge " + (state.session.role === "Super Admin" ? "b-rahasia" : "b-draft")}>{state.session.role}</span>
          <button type="button" className="iconbtn" title="Cetak Portal" onClick={() => window.open("./print", "_blank", "noopener,noreferrer")}>
            <Icon name="print" size={19} />
          </button>
          <Avatar name={identity?.full_name || state.session.full_name} size={34} />
        </header>
        <AppNoticeBar notice={state.notice} error={state.error} />
        <div className="content">
          {SCREENS[activeScreen]({ go, role: state.session.role })}
        </div>
      </div>
      <TweakDock tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

function TweakDock({ tweaks, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Tabel" />
      <TweakRadio label="Kepadatan" value={tweaks.density} options={["compact", "regular", "comfy"]} onChange={(value) => setTweak("density", value)} />
      <TweakSection label="Tema" />
      <TweakColor label="Warna Aksen" value={tweaks.accent} options={["#b8842a", "#c2410c", "#0e7490", "#7c3aed"]} onChange={(value) => setTweak("accent", value)} />
    </TweaksPanel>
  );
}

if (!window.__PRINT__) {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}
