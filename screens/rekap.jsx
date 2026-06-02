/* ============================================================
   Screens: Rekap & Form — Surat Masuk / Surat Keluar
   ============================================================ */

function RekapToolbar({ onAdd, addLabel }) {
  const [active, setActive] = useState("Semua");
  return (
    <div className="toolbar">
      <div className="searchbar" style={{ maxWidth: 280, flex: "0 0 auto" }}>
        <Icon name="search" size={16} /><input placeholder="Cari nomor / perihal / asal…" />
      </div>
      {["Semua", "Biasa", "Penting", "Segera", "Rahasia"].map(f => (
        <button key={f} className={"chip " + (active === f ? "on" : "")} onClick={() => setActive(f)}>{f}</button>
      ))}
      <button className="chip"><Icon name="calendar" size={14} />Mei 2026</button>
      <div className="grow"></div>
      <button className="btn btn-ghost btn-sm"><Icon name="download" size={14} />Ekspor</button>
      <button className="btn btn-gold btn-sm" onClick={onAdd}><Icon name="plus" size={14} />{addLabel}</button>
    </div>
  );
}

function RekapSuratMasuk({ go }) {
  return (
    <>
      <PageHead crumb={["Persuratan", "Rekap Surat Masuk"]} title="Rekap Surat Masuk"
        sub="Arsip seluruh surat permohonan & surat masuk yang diterima" />
      <RekapToolbar addLabel="Catat Surat Masuk" onAdd={() => go("form-masuk")} />
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>
              <th>No. Agenda</th><th>Nomor Surat</th><th>Perihal</th><th>Asal → Tujuan</th>
              <th>Tanggal</th><th>Sifat</th><th>Status</th><th style={{ textAlign: "right" }}>Aksi</th>
            </tr></thead>
            <tbody>
              {SURAT_MASUK.map(s => (
                <tr key={s.no}>
                  <td className="tabnum td-strong">{s.no}</td>
                  <td className="tabnum" style={{ fontSize: 12.5 }}>{s.nomor}</td>
                  <td><div className="td-strong" style={{ maxWidth: 240 }}>{s.perihal}</div><div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{s.layanan}</div></td>
                  <td><div style={{ fontSize: 12.5 }}>{s.asal}</div><div className="muted row gap-2 center" style={{ fontSize: 11.5, marginTop: 2 }}><Icon name="chevright" size={11} />{s.tujuan}</div></td>
                  <td className="tabnum" style={{ whiteSpace: "nowrap" }}>{s.tgl}</td>
                  <td><SifatBadge s={s.sifat} /></td>
                  <td><StatusBadge s={s.status} /></td>
                  <td><RowActions wa /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row between center" style={{ padding: "14px 18px", borderTop: "1px solid var(--line)" }}>
          <span className="muted" style={{ fontSize: 12.5 }}>Menampilkan 1–8 dari 148 surat</span>
          <div className="row gap-2">
            <button className="btn btn-ghost btn-sm">Sebelumnya</button>
            <button className="btn btn-ghost btn-sm" style={{ background: "var(--navy-700)", color: "#fff", borderColor: "transparent" }}>1</button>
            <button className="btn btn-ghost btn-sm">2</button>
            <button className="btn btn-ghost btn-sm">3</button>
            <button className="btn btn-ghost btn-sm">Berikutnya</button>
          </div>
        </div>
      </div>
    </>
  );
}

function RekapSuratKeluar({ go }) {
  return (
    <>
      <PageHead crumb={["Persuratan", "Rekap Surat Keluar"]} title="Rekap Surat Keluar"
        sub="Arsip seluruh surat keluar yang diterbitkan instansi" />
      <RekapToolbar addLabel="Buat Surat Keluar" onAdd={() => go("form-keluar")} />
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>
              <th>No. Agenda</th><th>Nomor Surat</th><th>Perihal</th><th>Asal → Tujuan</th>
              <th>Tanggal</th><th>Sifat</th><th>Status</th><th style={{ textAlign: "right" }}>Aksi</th>
            </tr></thead>
            <tbody>
              {SURAT_KELUAR.map(s => (
                <tr key={s.no}>
                  <td className="tabnum td-strong">{s.no}</td>
                  <td className="tabnum" style={{ fontSize: 12.5 }}>{s.nomor}</td>
                  <td><div className="td-strong" style={{ maxWidth: 250 }}>{s.perihal}</div></td>
                  <td><div style={{ fontSize: 12.5 }}>{s.asal}</div><div className="muted row gap-2 center" style={{ fontSize: 11.5, marginTop: 2 }}><Icon name="chevright" size={11} />{s.tujuan}</div></td>
                  <td className="tabnum" style={{ whiteSpace: "nowrap" }}>{s.tgl}</td>
                  <td><SifatBadge s={s.sifat} /></td>
                  <td><StatusBadge s={s.status} /></td>
                  <td><RowActions wa /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row between center" style={{ padding: "14px 18px", borderTop: "1px solid var(--line)" }}>
          <span className="muted" style={{ fontSize: 12.5 }}>Menampilkan 1–7 dari 231 surat</span>
          <div className="row gap-2">
            <button className="btn btn-ghost btn-sm">Sebelumnya</button>
            <button className="btn btn-ghost btn-sm" style={{ background: "var(--navy-700)", color: "#fff", borderColor: "transparent" }}>1</button>
            <button className="btn btn-ghost btn-sm">2</button>
            <button className="btn btn-ghost btn-sm">Berikutnya</button>
          </div>
        </div>
      </div>
    </>
  );
}

window.RekapSuratMasuk = RekapSuratMasuk;
window.RekapSuratKeluar = RekapSuratKeluar;
