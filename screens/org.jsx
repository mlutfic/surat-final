/* ============================================================
   Screens: Profil Kantor, Struktur Organisasi,
            Data Kepegawaian, Manajemen Akun
   ============================================================ */

function ProfilKantor() {
  const info = [
    ["Nama Instansi", OFFICE.nama], ["Pemerintah Daerah", OFFICE.pemda],
    ["Kepala Dinas", OFFICE.kepala], ["NIP", OFFICE.nip],
    ["Alamat", OFFICE.alamat], ["Telepon", OFFICE.telp],
    ["Surel Resmi", OFFICE.email], ["Situs Web", OFFICE.web],
    ["Jam Pelayanan", OFFICE.jam], ["Tanggal Berdiri", OFFICE.berdiri],
  ];
  return (
    <>
      <PageHead crumb={["Pengaturan", "Profil Kantor"]} title="Profil Kantor"
        sub="Identitas dan informasi resmi instansi"
        actions={<button className="btn btn-primary"><Icon name="edit" size={15} />Edit Profil</button>} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: 20, alignItems: "start" }} className="form-grid">
        <div className="card card-pad col center" style={{ textAlign: "center", gap: 4 }}>
          <div style={{ width: 92, height: 92, borderRadius: 24, background: "linear-gradient(150deg, var(--gold-400), var(--gold-600))", display: "grid", placeItems: "center", boxShadow: "var(--shadow)", marginBottom: 14 }}>
            <Icon name="building" size={42} style={{ color: "#fff" }} />
          </div>
          <h3 style={{ fontSize: 17 }}>{OFFICE.nama}</h3>
          <div className="muted" style={{ fontSize: 13 }}>{OFFICE.pemda}</div>
          <div className="row gap-2 center" style={{ marginTop: 8 }}>
            <span className="badge b-ok"><Icon name="shield" size={12} />Terverifikasi</span>
            <span className="badge b-biasa"><Icon name="globe" size={12} />Publik</span>
          </div>
          <div style={{ borderTop: "1px solid var(--line)", width: "100%", margin: "18px 0 4px" }}></div>
          <div className="col gap-3" style={{ width: "100%", textAlign: "left" }}>
            {[["mappin", OFFICE.alamat], ["phone", OFFICE.telp], ["mail", OFFICE.email]].map(([ic, t]) => (
              <div key={ic} className="row gap-3" style={{ alignItems: "flex-start" }}>
                <span style={{ color: "var(--navy-500)", flexShrink: 0, marginTop: 1 }}><Icon name={ic} size={16} /></span>
                <span style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-pad">
          <div className="eyebrow" style={{ marginBottom: 6 }}>Informasi Umum</div>
          {info.map(([k, v]) => (
            <div className="info-row" key={k}><div className="ik">{k}</div><div className="iv">{v}</div></div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- Struktur Organisasi ---------- */
function OrgNode({ name, role, head }) {
  return (
    <div className={"org-node " + (head ? "head" : "")}>
      <div className="on">{name}</div>
      <div className="op">{role}</div>
    </div>
  );
}

function StrukturOrganisasi() {
  const bidang = [
    { name: "Ir. Retno Kusumawati", role: "Sekretaris" },
    { name: "Ahmad Fauzi, S.Kom.", role: "Kabid Aplikasi & Informatika" },
    { name: "Dewi Anggraini, S.E.", role: "Kabid Statistik & Persandian" },
    { name: "Hendra Gunawan, S.T.", role: "Kabid Informasi & Komunikasi Publik" },
  ];
  return (
    <>
      <PageHead crumb={["Profil", "Struktur Organisasi"]} title="Struktur Organisasi"
        sub={`Bagan organisasi ${OFFICE.nama}`}
        actions={<button className="btn btn-ghost"><Icon name="print" size={15} />Cetak Bagan</button>} />
      <div className="card card-pad" style={{ overflowX: "auto" }}>
        <div className="org" style={{ minWidth: 760, padding: "10px 0 4px" }}>
          <OrgNode head name={OFFICE.kepala} role="Kepala Dinas" />
          <div className="org-connector"></div>
          <div style={{ width: "75%", height: 2, background: "var(--line)" }}></div>
          <div className="org-row" style={{ marginTop: 0 }}>
            {bidang.map((b, i) => (
              <div key={i} className="col center">
                <div className="org-connector"></div>
                <OrgNode name={b.name} role={b.role} />
                <div className="org-connector"></div>
                <div className="col gap-2" style={{ alignItems: "stretch", width: 170 }}>
                  {(i === 0
                    ? ["Sub Bag. Umum", "Sub Bag. Keuangan"]
                    : ["Seksi A", "Seksi B"]).map(s => (
                    <div key={s} style={{ border: "1px dashed var(--line)", borderRadius: 8, padding: "8px 10px", fontSize: 11.5, color: "var(--muted)", textAlign: "center", background: "var(--surface-2)" }}>{s}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Data Kepegawaian ---------- */
function DataKepegawaian() {
  return (
    <>
      <PageHead crumb={["Profil", "Data Kepegawaian"]} title="Data Kepegawaian"
        sub={`${PEGAWAI.length} pegawai terdaftar`}
        actions={<button className="btn btn-primary"><Icon name="plus" size={15} />Tambah Pegawai</button>} />
      <div className="toolbar">
        <div className="searchbar" style={{ maxWidth: 280, flex: "0 0 auto" }}><Icon name="search" size={16} /><input placeholder="Cari nama / NIP / jabatan…" /></div>
        {["Semua", "PNS", "PPPK", "Honorer"].map((f, i) => <button key={f} className={"chip " + (i === 0 ? "on" : "")}>{f}</button>)}
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Nama / Jabatan</th><th>NIP</th><th>Gol.</th><th>Unit Kerja</th><th>Status</th><th style={{ textAlign: "right" }}>Aksi</th></tr></thead>
            <tbody>
              {PEGAWAI.map(p => (
                <tr key={p.nama}>
                  <td><div className="row gap-3 center"><Avatar name={p.nama} size={36} /><div><div className="td-strong">{p.nama}</div><div className="muted" style={{ fontSize: 12, marginTop: 1 }}>{p.jabatan}</div></div></div></td>
                  <td className="tabnum" style={{ fontSize: 12.5 }}>{p.nip}</td>
                  <td className="tabnum">{p.gol}</td>
                  <td>{p.unit}</td>
                  <td><span className={"badge " + (p.status === "PNS" ? "b-ok" : p.status === "PPPK" ? "b-biasa" : "b-draft")}>{p.status}</span></td>
                  <td><div className="row gap-2" style={{ justifyContent: "flex-end" }}>
                    <button className="iconbtn" title="Lihat"><Icon name="eye" size={16} /></button>
                    <button className="iconbtn" title="Edit"><Icon name="edit" size={16} /></button>
                    <button className="iconbtn danger" title="Hapus"><Icon name="trash" size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ---------- Manajemen Akun (Super Admin) ---------- */
function ManajemenAkun() {
  return (
    <>
      <PageHead crumb={["Pengaturan", "Manajemen Akun"]} title="Edit Manajemen Akun"
        sub="Kelola akun pengguna, peran, dan hak akses sistem"
        actions={<button className="btn btn-primary"><Icon name="plus" size={15} />Tambah Akun</button>} />
      <div className="stat-grid" style={{ marginBottom: 20, gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="stat"><div className="si" style={{ background: "var(--purple-bg)", color: "var(--purple)" }}><Icon name="shield" size={20} /></div><div className="sv">1</div><div className="sl">Super Admin</div></div>
        <div className="stat"><div className="si" style={{ background: "var(--navy-100)", color: "var(--navy-700)" }}><Icon name="usercog" size={20} /></div><div className="sv">3</div><div className="sl">Admin</div></div>
        <div className="stat"><div className="si" style={{ background: "var(--info-bg)", color: "var(--info)" }}><Icon name="user" size={20} /></div><div className="sv">2</div><div className="sl">User</div></div>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Pengguna</th><th>Nama Pengguna</th><th>Unit</th><th>Peran</th><th>Status</th><th>Akses Terakhir</th><th style={{ textAlign: "right" }}>Aksi</th></tr></thead>
            <tbody>
              {AKUN.map(a => (
                <tr key={a.user}>
                  <td><div className="row gap-3 center"><Avatar name={a.nama} size={36} /><div><div className="td-strong">{a.nama}</div><div className="muted" style={{ fontSize: 12, marginTop: 1 }}>{a.email}</div></div></div></td>
                  <td className="tabnum" style={{ fontSize: 12.5 }}>@{a.user}</td>
                  <td>{a.unit}</td>
                  <td><span className={"badge " + (a.role === "Super Admin" ? "b-rahasia" : a.role === "Admin" ? "b-biasa" : "b-draft")}>{a.role === "Super Admin" && <Icon name="shield" size={11} />}{a.role}</span></td>
                  <td><span className={"badge " + (a.aktif ? "b-ok" : "b-draft")}><span className="dot"></span>{a.aktif ? "Aktif" : "Nonaktif"}</span></td>
                  <td className="tabnum muted" style={{ fontSize: 12 }}>{a.last}</td>
                  <td><div className="row gap-2" style={{ justifyContent: "flex-end" }}>
                    <button className="iconbtn" title="Atur Hak Akses"><Icon name="settings" size={16} /></button>
                    <button className="iconbtn" title="Edit"><Icon name="edit" size={16} /></button>
                    <button className="iconbtn danger" title="Hapus"><Icon name="trash" size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { ProfilKantor, StrukturOrganisasi, DataKepegawaian, ManajemenAkun });
