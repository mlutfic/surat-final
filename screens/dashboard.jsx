/* ============================================================
   Screen: Dashboard
   ============================================================ */
function StatCard({ icon, tone, value, label, trend, up }) {
  const tones = {
    navy: ["var(--navy-100)", "var(--navy-700)"],
    gold: ["var(--gold-100)", "var(--gold-600)"],
    ok: ["var(--ok-bg)", "var(--ok)"],
    info: ["var(--info-bg)", "var(--info)"],
  };
  const [bg, fg] = tones[tone];
  return (
    <div className="stat">
      <div className="si" style={{ background: bg, color: fg }}><Icon name={icon} size={20} /></div>
      <div className="sv tabnum">{value}</div>
      <div className="sl">{label}</div>
      {trend && <div className={"strend " + (up ? "up" : "down")}><Icon name={up ? "trendup" : "chart"} size={13} />{trend}</div>}
    </div>
  );
}

function Dashboard({ role }) {
  return (
    <>
      <PageHead
        crumb={["Beranda", "Dashboard"]}
        title={`Selamat datang kembali`}
        sub={`Ringkasan persuratan ${OFFICE.nama} — per 31 Mei 2026`}
        actions={
          <div className="row gap-2">
            <button className="btn btn-ghost"><Icon name="download" size={15} />Unduh Laporan</button>
            <button className="btn btn-primary"><Icon name="plus" size={15} />Surat Baru</button>
          </div>
        }
      />

      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <StatCard icon="inbox" tone="navy" value="148" label="Surat Masuk (2026)" trend="+12% bln ini" up />
        <StatCard icon="send" tone="gold" value="231" label="Surat Keluar (2026)" trend="+8% bln ini" up />
        <StatCard icon="clock" tone="info" value="6" label="Menunggu Diproses" />
        <StatCard icon="megaphone" tone="ok" value="14" label="Pengaduan Masuk" trend="3 baru" up />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 20, alignItems: "start" }} className="dash-grid">
        {/* Recent surat masuk */}
        <div className="card">
          <div className="card-pad" style={{ paddingBottom: 6 }}>
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <div>
                <h3>Surat Masuk Terbaru</h3>
                <div className="sl">5 surat terakhir diterima</div>
              </div>
              <button className="btn btn-soft btn-sm">Lihat Semua<Icon name="chevright" size={14} /></button>
            </div>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Nomor / Perihal</th><th>Asal</th><th>Sifat</th><th>Status</th></tr></thead>
              <tbody>
                {SURAT_MASUK.slice(0, 5).map(s => (
                  <tr key={s.no}>
                    <td><div className="td-strong">{s.perihal}</div><div className="muted tabnum" style={{ fontSize: 12, marginTop: 2 }}>{s.nomor}</div></td>
                    <td>{s.asal}</td>
                    <td><SifatBadge s={s.sifat} /></td>
                    <td><StatusBadge s={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="col gap-4">
          {/* Sifat distribution */}
          <div className="card card-pad">
            <div className="sec-head"><h3>Disposisi per Sifat</h3></div>
            {[["Biasa", 86, "b-biasa", "var(--info)"], ["Penting", 41, "b-penting", "var(--warn)"], ["Segera", 16, "b-segera", "var(--hot)"], ["Rahasia", 5, "b-rahasia", "var(--purple)"]].map(([k, v, c, col]) => (
              <div key={k} style={{ marginBottom: 13 }}>
                <div className="row between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>{k}</span>
                  <span className="tabnum muted" style={{ fontSize: 12.5, fontWeight: 700 }}>{v}</span>
                </div>
                <div className="progress-track"><div style={{ height: "100%", width: (v / 86 * 100) + "%", background: col, borderRadius: 100 }}></div></div>
              </div>
            ))}
          </div>

          {/* IKM */}
          <div className="card card-pad" style={{ background: "var(--navy-900)", borderColor: "transparent", color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "oklch(0.62 0.12 75 / 0.25)" }}></div>
            <div className="eyebrow" style={{ color: "var(--gold-400)" }}>Survei Kepuasan</div>
            <div className="row center gap-3" style={{ marginTop: 12 }}>
              <div className="tabnum" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>87,4</div>
              <div><div style={{ fontSize: 13, color: "oklch(0.8 0.02 256)" }}>Nilai IKM</div><span className="badge b-ok" style={{ marginTop: 4 }}>Mutu A — Sangat Baik</span></div>
            </div>
            <div style={{ fontSize: 12, color: "oklch(0.72 0.03 256)", marginTop: 12 }}>1.248 responden · Triwulan I 2026</div>
          </div>
        </div>
      </div>
    </>
  );
}

window.Dashboard = Dashboard;
