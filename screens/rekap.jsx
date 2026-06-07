/* ============================================================
   Screens: Rekap Surat Masuk & Rekap Surat Keluar
   ============================================================ */

function RekapToolbar({ onAdd, addLabel }) {
  const [active, setActive] = useState("Semua");
  return (
    <div className="toolbar">
      <div className="searchbar" style={{ maxWidth: 280, flex: "0 0 auto" }}>
        <Icon name="search" size={16} />
        <input placeholder="Cari nomor / perihal / asal…" />
      </div>
      {["Semua", "Biasa", "Penting", "Segera", "Rahasia"].map(f => (
        <button key={f} className={"chip " + (active === f ? "on" : "")} onClick={() => setActive(f)}>
          {f}
        </button>
      ))}
      <button className="chip">
        <Icon name="calendar" size={14} />Mei 2026
      </button>
      <div className="grow" />
      <button className="btn btn-ghost btn-sm">
        <Icon name="download" size={14} />Ekspor
      </button>
      <button className="btn btn-gold btn-sm" onClick={onAdd}>
        <Icon name="plus" size={14} />{addLabel}
      </button>
    </div>
  );
}

function RekapSuratMasuk({ go }) {
  const [page, setPage] = useState(1);
  const totalRows = SURAT_MASUK.length;
  const perPage = 8;
  const totalPages = Math.ceil(148 / perPage);

  return (
    <>
      <PageHead
        crumb={["Persuratan", "Rekap Surat Masuk"]}
        title="Rekap Surat Masuk"
        sub="Arsip seluruh surat permohonan & surat masuk yang diterima"
      />
      <RekapToolbar addLabel="Catat Surat Masuk" onAdd={() => go("form-masuk")} />
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>No. Agenda</th>
                <th>Nomor Surat</th>
                <th>Perihal</th>
                <th>Asal → Tujuan</th>
                <th>Tanggal</th>
                <th>Sifat</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {SURAT_MASUK.map(s => (
                <tr key={s.no}>
                  <td className="tabnum td-strong">{s.no}</td>
                  <td className="tabnum" style={{ fontSize: 12.5 }}>{s.nomor}</td>
                  <td>
                    <div className="td-strong" style={{ maxWidth: 240 }}>{s.perihal}</div>
                    <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{s.layanan}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12.5 }}>{s.asal}</div>
                    <div className="muted row gap-2 center" style={{ fontSize: 11.5, marginTop: 2 }}>
                      <Icon name="chevright" size={11} />{s.tujuan}
                    </div>
                  </td>
                  <td className="tabnum" style={{ whiteSpace: "nowrap" }}>{s.tgl}</td>
                  <td><SifatBadge s={s.sifat} /></td>
                  <td><StatusBadge s={s.status} /></td>
                  <td><RowActions wa /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={totalPages} onPage={setPage} />
      </div>
    </>
  );
}

function RekapSuratKeluar({ go }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(231 / 7);

  return (
    <>
      <PageHead
        crumb={["Persuratan", "Rekap Surat Keluar"]}
        title="Rekap Surat Keluar"
        sub="Arsip seluruh surat keluar yang diterbitkan instansi"
      />
      <RekapToolbar addLabel="Buat Surat Keluar" onAdd={() => go("form-keluar")} />
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>No. Agenda</th>
                <th>Nomor Surat</th>
                <th>Perihal</th>
                <th>Asal → Tujuan</th>
                <th>Tanggal</th>
                <th>Sifat</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {SURAT_KELUAR.map(s => (
                <tr key={s.no}>
                  <td className="tabnum td-strong">{s.no}</td>
                  <td className="tabnum" style={{ fontSize: 12.5 }}>{s.nomor}</td>
                  <td>
                    <div className="td-strong" style={{ maxWidth: 250 }}>{s.perihal}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12.5 }}>{s.asal}</div>
                    <div className="muted row gap-2 center" style={{ fontSize: 11.5, marginTop: 2 }}>
                      <Icon name="chevright" size={11} />{s.tujuan}
                    </div>
                  </td>
                  <td className="tabnum" style={{ whiteSpace: "nowrap" }}>{s.tgl}</td>
                  <td><SifatBadge s={s.sifat} /></td>
                  <td><StatusBadge s={s.status} /></td>
                  <td><RowActions wa /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={totalPages} onPage={setPage} />
      </div>
    </>
  );
}

window.RekapSuratMasuk = RekapSuratMasuk;
window.RekapSuratKeluar = RekapSuratKeluar;
