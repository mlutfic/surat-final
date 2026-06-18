/* ============================================================
   Screen: Dashboard & Tentang Aplikasi
   ============================================================ */

function StatCard({ icon, tone, value, label, trend }) {
  const tones = {
    navy: ["var(--navy-100)", "var(--navy-700)"],
    gold: ["var(--gold-100)", "var(--gold-600)"],
    ok: ["var(--ok-bg)", "var(--ok)"],
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
      {trend && <div className="strend up"><Icon name="trendup" size={13} />{trend}</div>}
    </div>
  );
}

function Dashboard({ go }) {
  const state = useAppState();
  const office = AppSelectors.office();
  const dashboard = AppSelectors.dashboard();
  const survey = AppSelectors.surveySummary();
  const maxBar = Math.max(1, ...dashboard.byPriority.map((item) => item.count));
  const latestDate = dashboard.recentIncoming[0]?.letter_date || dashboard.recentOutgoing[0]?.letter_date || new Date().toISOString();

  if (!office) return <LoadingBlock label="Memuat dashboard..." />;

  return (
    <>
      <PageHead
        crumb={["Beranda", "Dashboard"]}
        title="Selamat datang kembali"
        sub={`Ringkasan persuratan ${office.office_name} - per ${formatDateId(latestDate)}`}
        actions={
          <div className="row gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => AppApi.downloadDashboardReport()}>
              <Icon name="download" size={15} />Unduh Laporan
            </button>
            <button type="button" className="btn btn-primary" onClick={() => go("form-masuk")}>
              <Icon name="plus" size={15} />Surat Baru
            </button>
          </div>
        }
      />

      <div className="stat-grid" style={{ marginBottom: 22 }}>
        <StatCard icon="inbox" tone="navy" value={formatNumberId(dashboard.stats.incomingCount)} label="Surat Masuk" />
        <StatCard icon="send" tone="gold" value={formatNumberId(dashboard.stats.outgoingCount)} label="Surat Keluar" />
        <StatCard icon="clock" tone="info" value={formatNumberId(dashboard.stats.pendingCount)} label="Menunggu Diproses" />
        <StatCard icon="megaphone" tone="ok" value={formatNumberId(dashboard.stats.complaintCount)} label="Pengaduan" trend={`${survey.respondent_count || 0} responden IKM`} />
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-pad" style={{ paddingBottom: 6 }}>
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <div>
                <h3>Surat Masuk Terbaru</h3>
                <div className="sl">{dashboard.recentIncoming.length} surat terakhir diterima</div>
              </div>
              <button type="button" className="btn btn-soft btn-sm" onClick={() => go("rekap-masuk")}>
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
                {dashboard.recentIncoming.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="td-strong">{item.subject}</div>
                      <div className="muted tabnum" style={{ fontSize: 12, marginTop: 2 }}>{item.letter_no}</div>
                    </td>
                    <td>{item.source_name}</td>
                    <td><SifatBadge s={item.priority} /></td>
                    <td><StatusBadge s={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dashboard.recentIncoming.length === 0 && <EmptyHint icon="inbox">Belum ada surat masuk yang dapat ditampilkan.</EmptyHint>}
          </div>
        </div>

        <div className="col gap-4">
          <div className="card card-pad">
            <div className="sec-head" style={{ marginBottom: 16 }}>
              <h3>Distribusi Sifat Surat</h3>
              <span className="muted" style={{ fontSize: 12 }}>Total {dashboard.stats.incomingCount}</span>
            </div>
            {dashboard.byPriority.map(({ label, count, color }) => (
              <div key={label} className="sifat-bar">
                <span className="sifat-bar-label">{label}</span>
                <div className="sifat-bar-track">
                  <div className="sifat-bar-fill" style={{ width: `${(count / maxBar) * 100}%`, background: color }} />
                </div>
                <span className="sifat-bar-count tabnum">{count}</span>
              </div>
            ))}
          </div>

          <div className="card card-pad" style={{ background: "var(--navy-900)", borderColor: "transparent", color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -28, top: -28, width: 130, height: 130, borderRadius: "50%", background: "oklch(0.62 0.12 75 / 0.20)" }} />
            <div style={{ position: "absolute", left: -20, bottom: -20, width: 90, height: 90, borderRadius: "50%", background: "oklch(0.40 0.09 245 / 0.18)" }} />
            <div className="eyebrow" style={{ color: "var(--gold-400)", position: "relative" }}>Survei Kepuasan</div>
            <div className="row center gap-3" style={{ marginTop: 14, position: "relative" }}>
              <div>
                <div className="tabnum" style={{ fontSize: 46, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>{formatNumberId(survey.ikm || 0, 1).replace(".", ",")}</div>
                <div style={{ fontSize: 11.5, color: "oklch(0.72 0.03 256)", marginTop: 3 }}>Nilai IKM</div>
              </div>
              <div className="col" style={{ gap: 6 }}>
                <span className="badge b-ok">Mutu {survey.mutu || "-"}</span>
                <span style={{ fontSize: 12, color: "oklch(0.82 0.02 256)", fontWeight: 600 }}>{survey.period_label || quarterLabel()}</span>
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: "oklch(0.65 0.025 256)", marginTop: 12, position: "relative" }}>
              {(survey.respondent_count || 0).toLocaleString("id-ID")} responden
            </div>
          </div>

          <div className="card card-pad">
            <div className="sec-head" style={{ marginBottom: 14 }}>
              <h3>Akses Cepat</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["fileplus", "Surat Masuk", "form-masuk"],
                ["mail", "Surat Keluar", "form-keluar"],
                ["megaphone", "Pengaduan", "pengaduan"],
                ["survey", "Survei IKM", "survei"],
              ].map(([icon, label, screen]) => (
                <button key={label} type="button" className="btn btn-ghost" style={{ justifyContent: "flex-start", gap: 9, padding: "9px 12px", fontSize: 13 }} onClick={() => go(screen)}>
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

function TentangAplikasi() {
  const office = AppSelectors.office();
  const serviceTypes = AppSelectors.serviceTypes();

  if (!office) return <LoadingBlock label="Memuat profil aplikasi..." />;

  return (
    <>
      <PageHead
        crumb={["Beranda", "Tentang Aplikasi"]}
        title={`Tentang ${office.app_name}`}
        sub={office.app_expansion}
        actions={
          <button type="button" className="btn btn-ghost" onClick={() => window.open("./print", "_blank", "noopener,noreferrer")}>
            <Icon name="print" size={15} />Cetak Ringkasan
          </button>
        }
      />

      <div className="card card-pad" style={{ marginBottom: 22 }}>
        <div className="row gap-4 wrap" style={{ alignItems: "flex-start" }}>
          <div style={{ width: 76, height: 76, borderRadius: 20, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", flexShrink: 0 }}>
            <img src={office.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div className="grow" style={{ minWidth: 240 }}>
            <div className="eyebrow">Deskripsi Singkat Aplikasi</div>
            <h2 style={{ marginTop: 8, fontSize: 22 }}>{office.app_name}</h2>
            <p style={{ marginTop: 10, color: "var(--ink-soft)", lineHeight: 1.75, maxWidth: 820 }}>{office.concept_text}</p>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="col gap-4">
          <section className="card card-pad">
            <div className="sec-head"><h3>Latar Belakang</h3></div>
            <p style={{ color: "var(--ink-soft)", lineHeight: 1.8 }}>{office.background_text}</p>
          </section>

          <section className="card card-pad">
            <div className="sec-head"><h3>Dasar Hukum</h3></div>
            <div className="col" style={{ gap: 0 }}>
              {office.legal_references.map((item, index) => (
                <div key={item} className="row gap-3" style={{ alignItems: "flex-start", padding: "10px 0", borderBottom: index === office.legal_references.length - 1 ? "none" : "1px solid var(--line-soft)" }}>
                  <span className="badge b-biasa tabnum" style={{ flexShrink: 0, marginTop: 1 }}>{index + 1}</span>
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
                  {office.impact_points.map((row) => (
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
              {office.goals.map((item, index) => (
                <div key={item} className="row gap-3" style={{ alignItems: "flex-start" }}>
                  <span className="badge b-ok tabnum" style={{ flexShrink: 0 }}>{String(index + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card card-pad">
            <div className="sec-head"><h3>Jenis Layanan</h3></div>
            <div className="col gap-2">
              {serviceTypes.map((service) => (
                <div key={service.id} className="row gap-3" style={{ alignItems: "flex-start", padding: "11px 13px", borderRadius: "var(--r)", background: "var(--surface-2)", border: "1px solid var(--line-soft)" }}>
                  <span style={{ color: "var(--navy-600)", flexShrink: 0, marginTop: 1 }}>
                    <Icon name={service.icon} size={16} />
                  </span>
                  <div>
                    <div className="td-strong">{service.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 2 }}>{service.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card card-pad">
            <div className="sec-head"><h3>Mekanisme</h3></div>
            <div className="col" style={{ gap: 10 }}>
              {office.mechanisms.map((item, index) => (
                <div key={item} className="row gap-3" style={{ alignItems: "flex-start" }}>
                  <span className="badge b-draft tabnum" style={{ flexShrink: 0 }}>{index + 1}</span>
                  <span style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Dashboard, TentangAplikasi });
