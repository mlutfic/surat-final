/* ============================================================
   Screen: Dashboard & Tentang Aplikasi
   ============================================================ */
function StatCard({ icon, tone, value, label, trend, up }) {
  const tones = {
    navy: ["var(--navy-100)", "var(--navy-700)"],
    gold: ["var(--gold-100)", "var(--gold-600)"],
    ok:   ["var(--ok-bg)",   "var(--ok)"],
    info: ["var(--info-bg)", "var(--info)"],
  };
  const [bg, fg] = tones[tone] || tones.navy;
  return (
    <div className="stat">
      <div className="si" style={{ background: bg, color: fg }}>
        <Icon name={icon} size={20} />
      </div>
      <div className="sv tabnum">{value}</div>
      <div className="sl">{label}</div>
      {trend && (
        <div className={"strend " + (up ? "up" : "down")}>
          <Icon name={up ? "trendup" : "chart"} size={13} />{trend}
        </div>
      )}
    </div>
  );
}

const SIFAT_BARS = [
  { label: "Biasa",   count: 86, color: "var(--info)",   cls: "b-biasa"   },
  { label: "Penting", count: 41, color: "var(--warn)",   cls: "b-penting" },
  { label: "Segera",  count: 16, color: "var(--hot)",    cls: "b-segera"  },
  { label: "Rahasia", count: 5,  color: "var(--purple)", cls: "b-rahasia" },
];

function Dashboard({ role }) {
  const [page, setPage] = useState(1);
  const maxBar = Math.max(...SIFAT_BARS.map(b => b.count));

  return (
    <>
      <PageHead
        crumb={["Beranda", "Dashboard"]}
        title="Selamat datang kembali"
        sub={`Ringkasan persuratan ${OFFICE.nama} — per 31 Mei 2026`}
        actions={
          <div className="row gap-2">
            <button className="btn btn-ghost">
              <Icon name="download" size={15} />Unduh Laporan
            </button>
            <button className="btn btn-primary">
              <Icon name="plus" size={15} />Surat Baru
            </button>
          </div>
        }
      />

      <div className="stat-grid" style={{ marginBottom: 22 }}>
        <StatCard icon="inbox"    tone="navy" value="148" label="Surat Masuk (2026)"  trend="+12% bln ini" up />
        <StatCard icon="send"     tone="gold" value="231" label="Surat Keluar (2026)" trend="+8% bln ini"  up />
        <StatCard icon="clock"    tone="info" value="6"   label="Menunggu Diproses" />
        <StatCard icon="megaphone" tone="ok"  value="14"  label="Pengaduan Masuk"     trend="3 baru" up />
      </div>

      <div className="dash-grid">
        {/* ── Recent surat masuk ── */}
        <div className="card">
          <div className="card-pad" style={{ paddingBottom: 6 }}>
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <div>
                <h3>Surat Masuk Terbaru</h3>
                <div className="sl">5 surat terakhir diterima</div>
              </div>
              <button className="btn btn-soft btn-sm">
                Lihat Semua <Icon name="chevright" size={14} />
              </button>
            </div>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Nomor / Perihal</th>
                  <th>Asal</th>
                  <th>Sifat</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {SURAT_MASUK.slice(0, 5).map(s => (
                  <tr key={s.no}>
                    <td>
                      <div className="td-strong">{s.perihal}</div>
                      <div className="muted tabnum" style={{ fontSize: 12, marginTop: 2 }}>{s.nomor}</div>
                    </td>
                    <td>{s.asal}</td>
                    <td><SifatBadge s={s.sifat} /></td>
                    <td><StatusBadge s={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="col gap-4">

          {/* Sifat distribution */}
          <div className="card card-pad">
            <div className="sec-head" style={{ marginBottom: 16 }}>
              <h3>Disposisi per Sifat</h3>
              <span className="muted" style={{ fontSize: 12 }}>Total 148</span>
            </div>
            {SIFAT_BARS.map(({ label, count, color, cls }) => (
              <div key={label} className="sifat-bar">
                <span className="sifat-bar-label">{label}</span>
                <div className="sifat-bar-track">
                  <div className="sifat-bar-fill" style={{ width: (count / maxBar * 100) + "%", background: color }} />
                </div>
                <span className="sifat-bar-count tabnum">{count}</span>
              </div>
            ))}
          </div>

          {/* IKM Score */}
          <div className="card card-pad" style={{ background: "var(--navy-900)", borderColor: "transparent", color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -28, top: -28, width: 130, height: 130, borderRadius: "50%", background: "oklch(0.62 0.12 75 / 0.20)" }} />
            <div style={{ position: "absolute", left: -20, bottom: -20, width: 90, height: 90, borderRadius: "50%", background: "oklch(0.40 0.09 245 / 0.18)" }} />
            <div className="eyebrow" style={{ color: "var(--gold-400)", position: "relative" }}>Survei Kepuasan</div>
            <div className="row center gap-3" style={{ marginTop: 14, position: "relative" }}>
              <div>
                <div className="tabnum" style={{ fontSize: 46, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>87,4</div>
                <div style={{ fontSize: 11.5, color: "oklch(0.72 0.03 256)", marginTop: 3 }}>Nilai IKM</div>
              </div>
              <div className="col" style={{ gap: 6 }}>
                <span className="badge b-ok">Mutu A</span>
                <span style={{ fontSize: 12, color: "oklch(0.82 0.02 256)", fontWeight: 600 }}>Sangat Baik</span>
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: "oklch(0.65 0.025 256)", marginTop: 12, position: "relative" }}>
              1.248 responden · Triwulan I 2026
            </div>
          </div>

          {/* Quick links */}
          <div className="card card-pad">
            <div className="sec-head" style={{ marginBottom: 14 }}>
              <h3>Akses Cepat</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["fileplus", "Surat Masuk",  "form-masuk"],
                ["mail",     "Surat Keluar", "form-keluar"],
                ["megaphone","Pengaduan",    "pengaduan"],
                ["survey",   "Survei IKM",   "survei"],
              ].map(([icon, label]) => (
                <button key={label} className="btn btn-ghost" style={{ justifyContent: "flex-start", gap: 9, padding: "9px 12px", fontSize: 13 }}>
                  <span style={{ color: "var(--navy-600)" }}><Icon name={icon} size={16} /></span>
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

/* ---- Tentang Aplikasi ---- */
function TentangAplikasi() {
  return (
    <>
      <PageHead
        crumb={["Beranda", "Tentang Aplikasi"]}
        title={`Tentang ${APP_INFO.nama}`}
        sub={APP_INFO.kepanjangan}
        actions={
          <button className="btn btn-ghost">
            <Icon name="print" size={15} />Cetak Ringkasan
          </button>
        }
      />

      {/* Header card */}
      <div className="card card-pad" style={{ marginBottom: 22 }}>
        <div className="row gap-4 wrap" style={{ alignItems: "flex-start" }}>
          <div style={{ width: 76, height: 76, borderRadius: 20, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", flexShrink: 0 }}>
            <img src="assets/sarolangun-logo.jpeg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div className="grow" style={{ minWidth: 240 }}>
            <div className="eyebrow">Deskripsi Singkat Aplikasi</div>
            <h2 style={{ marginTop: 8, fontSize: 22 }}>{APP_INFO.nama}</h2>
            <p style={{ marginTop: 10, color: "var(--ink-soft)", lineHeight: 1.75, maxWidth: 820 }}>{APP_INFO.konsep}</p>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="col gap-4">
          <section className="card card-pad">
            <div className="sec-head"><h3>Latar Belakang</h3></div>
            <p style={{ color: "var(--ink-soft)", lineHeight: 1.8 }}>{APP_INFO.latar}</p>
          </section>

          <section className="card card-pad">
            <div className="sec-head"><h3>Dasar Hukum</h3></div>
            <div className="col" style={{ gap: 0 }}>
              {APP_INFO.dasarHukum.map((item, i) => (
                <div key={item} className="row gap-3" style={{ alignItems: "flex-start", padding: "10px 0", borderBottom: i === APP_INFO.dasarHukum.length - 1 ? "none" : "1px solid var(--line-soft)" }}>
                  <span className="badge b-biasa tabnum" style={{ flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                  <span style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65 }}>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="card-pad" style={{ paddingBottom: 6 }}>
              <div className="sec-head" style={{ marginBottom: 0 }}><h3>Dampak Penerapan</h3></div>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr><th>Aspek</th><th>Sebelum</th><th>Sesudah</th></tr>
                </thead>
                <tbody>
                  {PUBLIC_IMPACT.map(row => (
                    <tr key={row.aspect}>
                      <td className="td-strong">{row.aspect}</td>
                      <td style={{ color: "var(--muted)" }}>{row.before}</td>
                      <td style={{ color: "var(--ok)", fontWeight: 700 }}>{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="col gap-4">
          <section className="card card-pad">
            <div className="sec-head"><h3>Tujuan</h3></div>
            <div className="col" style={{ gap: 10 }}>
              {APP_INFO.tujuan.map((item, i) => (
                <div key={item} className="row gap-3" style={{ alignItems: "flex-start" }}>
                  <span className="badge b-ok tabnum" style={{ flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card card-pad">
            <div className="sec-head"><h3>Jenis Layanan</h3></div>
            <div className="col gap-2">
              {PUBLIC_SERVICES.map(svc => (
                <div key={svc.title} className="row gap-3" style={{ alignItems: "flex-start", padding: "11px 13px", borderRadius: "var(--r)", background: "var(--surface-2)", border: "1px solid var(--line-soft)" }}>
                  <span style={{ color: "var(--navy-600)", flexShrink: 0, marginTop: 1 }}>
                    <Icon name={svc.icon} size={17} />
                  </span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>{svc.title}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55, marginTop: 3 }}>{svc.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

window.Dashboard = Dashboard;
window.TentangAplikasi = TentangAplikasi;
