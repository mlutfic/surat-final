/* ============================================================
   Screens: Layanan Pengaduan & Survei Kepuasan Masyarakat
   ============================================================ */

function LayananPengaduan() {
  return (
    <>
      <PageHead crumb={["Layanan Publik", "Pengaduan"]} title="Layanan Pengaduan"
        sub="Sampaikan saran, kritik, atau masukan untuk perbaikan pelayanan" />
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, alignItems: "start" }} className="form-grid">
        <div className="card card-pad">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Formulir Pengaduan</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Nama Lengkap" req><input className="input" placeholder="Nama Anda" /></Field>
            <Field label="Umur" req><input className="input tabnum" type="number" placeholder="Contoh: 35" /></Field>
            <Field label="Nomor Handphone" req hint="Untuk konfirmasi tindak lanjut via WhatsApp."><input className="input tabnum" placeholder="08xx-xxxx-xxxx" /></Field>
            <Field label="Alamat Rumah" req><input className="input" placeholder="Alamat domisili" /></Field>
            <Field label="Saran / Kritik / Masukan" req full hint="Sampaikan secara jelas dan santun.">
              <textarea className="textarea" style={{ minHeight: 130 }} placeholder="Tuliskan saran, kritik, atau masukan Anda…"></textarea>
            </Field>
          </div>
          <div className="row gap-2" style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <button className="btn btn-primary"><Icon name="send" size={15} />Kirim Pengaduan</button>
            <button className="btn btn-ghost">Bersihkan</button>
          </div>
        </div>
        <div className="col gap-4">
          <div className="card card-pad" style={{ background: "var(--navy-50)", borderColor: "var(--navy-100)" }}>
            <div className="row gap-3 center" style={{ marginBottom: 8 }}>
              <span style={{ color: "var(--navy-600)" }}><Icon name="shield" size={20} /></span>
              <h3 style={{ fontSize: 15 }}>Privasi Terjaga</h3>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              Data pribadi Anda hanya digunakan untuk menindaklanjuti pengaduan dan tidak dipublikasikan. Setiap masukan akan ditanggapi maksimal 3 hari kerja.
            </p>
          </div>
          <div className="card card-pad">
            <div className="sec-head"><h3 style={{ fontSize: 15 }}>Pengaduan Terbaru</h3><span className="badge b-penting">3 baru</span></div>
            <div className="col gap-3">
              {PENGADUAN.map(p => (
                <div key={p.nama} style={{ paddingBottom: 12, borderBottom: "1px solid var(--line-soft)" }}>
                  <div className="row between center" style={{ marginBottom: 5 }}>
                    <div className="row gap-2 center"><Avatar name={p.nama} size={26} /><span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>{p.nama}</span></div>
                    <StatusBadge s={p.status} />
                  </div>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.55 }}>{p.pesan}</p>
                  <div className="muted tabnum" style={{ fontSize: 11, marginTop: 5 }}>{p.tgl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SurveiKepuasan() {
  const opts = [["😞", "Tidak Baik"], ["😐", "Kurang Baik"], ["🙂", "Baik"], ["😄", "Sangat Baik"]];
  const preset = [2, 3, 3, 2, 3, 3, 3, 2, 3];
  return (
    <>
      <PageHead crumb={["Layanan Publik", "Survei Kepuasan"]} title="Survei Kepuasan Masyarakat"
        sub="Penilaian mutu pelayanan berdasarkan 9 unsur Indeks Kepuasan Masyarakat (IKM)" />
      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 20, alignItems: "start" }} className="form-grid">
        <div className="card card-pad">
          <div className="row between center" style={{ marginBottom: 18 }}>
            <div className="eyebrow">Kuesioner Penilaian</div>
            <span className="muted" style={{ fontSize: 12 }}>9 dari 9 unsur</span>
          </div>
          <div className="progress-track" style={{ marginBottom: 24 }}><div className="progress-fill" style={{ width: "100%" }}></div></div>
          <div className="col gap-4">
            {SURVEI_UNSUR.map((u, i) => (
              <div key={u}>
                <div className="row gap-3 center" style={{ marginBottom: 10 }}>
                  <span className="tabnum" style={{ width: 24, height: 24, borderRadius: 7, background: "var(--navy-100)", color: "var(--navy-700)", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{u}</span>
                </div>
                <div className="likert">
                  {opts.map((o, j) => (
                    <div key={j} className={"likert-opt " + (preset[i] === j ? "on" : "")}>
                      <div className="le">{o[0]}</div><div className="ll">{o[1]}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="row gap-2" style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <button className="btn btn-primary"><Icon name="check" size={15} />Kirim Penilaian</button>
            <button className="btn btn-ghost">Reset</button>
          </div>
        </div>
        <div className="col gap-4">
          <div className="card card-pad" style={{ background: "var(--navy-900)", color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -30, top: -30, width: 130, height: 130, borderRadius: "50%", background: "oklch(0.62 0.12 75 / 0.22)" }}></div>
            <div className="eyebrow" style={{ color: "var(--gold-400)" }}>Hasil IKM {SURVEI_HASIL.periode}</div>
            <div className="row center gap-3" style={{ marginTop: 14 }}>
              <div className="tabnum" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>{String(SURVEI_HASIL.ikm).replace(".", ",")}</div>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--gold-500)", color: "var(--navy-900)", display: "grid", placeItems: "center", fontSize: 26, fontWeight: 800 }}>{SURVEI_HASIL.mutu}</div>
            </div>
            <div style={{ fontSize: 13, color: "oklch(0.82 0.02 256)", marginTop: 12 }}>Mutu Pelayanan <b style={{ color: "#fff" }}>Sangat Baik</b></div>
            <div style={{ fontSize: 12, color: "oklch(0.7 0.03 256)", marginTop: 4 }}>{SURVEI_HASIL.responden.toLocaleString("id-ID")} responden terkumpul</div>
          </div>
          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Skor per Unsur</div>
            {SURVEI_UNSUR.slice(0, 5).map((u, i) => {
              const sc = [3.42, 3.61, 3.28, 3.55, 3.49][i];
              return (
                <div key={u} style={{ marginBottom: 12 }}>
                  <div className="row between" style={{ marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "var(--ink-soft)", maxWidth: 180 }}>{u}</span>
                    <span className="tabnum" style={{ fontSize: 12, fontWeight: 700, color: "var(--navy-700)" }}>{String(sc).replace(".", ",")}</span>
                  </div>
                  <div className="progress-track"><div style={{ height: "100%", width: (sc / 4 * 100) + "%", background: "var(--navy-600)", borderRadius: 100 }}></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { LayananPengaduan, SurveiKepuasan });
