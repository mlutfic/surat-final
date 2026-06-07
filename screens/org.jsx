/* ============================================================
   Screens: Profil Kantor, Struktur Organisasi,
            Data Kepegawaian, Manajemen Akun
   ============================================================ */

/* ---------- Profil Kantor ---------- */
function ProfilKantor() {
  const info = [
    ["Nama Instansi",      OFFICE.nama],
    ["Pemerintah Daerah",  OFFICE.pemda],
    [OFFICE.jabatanKepala, OFFICE.kepala],
    ["Pangkat / Golongan", OFFICE.pangkatKepala],
    ["NIP",                OFFICE.nip],
    ["Alamat",             OFFICE.alamat],
    ["Email Kantor",       OFFICE.email],
    ["Jam Pelayanan",      OFFICE.jam],
    ["Dasar Pembentukan",  OFFICE.berdiri],
  ];

  return (
    <>
      <PageHead
        crumb={["Pengaturan", "Profil Kantor"]}
        title="Profil Kantor"
        sub="Identitas dan informasi resmi instansi"
        actions={
          <button className="btn btn-primary">
            <Icon name="edit" size={15} />Edit Profil
          </button>
        }
      />
      <div className="form-grid">
        {/* Identity card */}
        <div style={{ order: 2 }}>
          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 10 }}>Informasi Umum</div>
            {info.map(([k, v]) => (
              <div className="info-row" key={k}>
                <div className="ik">{k}</div>
                <div className="iv">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logo + kontak */}
        <div className="col gap-4" style={{ order: 1 }}>
          <div className="card card-pad" style={{ textAlign: "center" }}>
            <div className="profil-logo" style={{ margin: "0 auto 14px" }}>
              <img src="assets/sarolangun-logo.jpeg" alt="" />
            </div>
            <h3 style={{ fontSize: 16 }}>{APP_INFO.nama}</h3>
            <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>{OFFICE.pemda}</div>
            <div className="row gap-2 center" style={{ marginTop: 10, justifyContent: "center" }}>
              <span className="badge b-ok"><Icon name="shield" size={12} />Terverifikasi</span>
              <span className="badge b-biasa"><Icon name="globe" size={12} />Publik</span>
            </div>
            <div className="profil-divider" />
            <div className="col" style={{ gap: 10, textAlign: "left" }}>
              {[["mappin", OFFICE.alamat], ["mail", OFFICE.email], ["calendar", OFFICE.jam]].map(([ic, t]) => (
                <div key={ic} className="profil-contact-row">
                  <span style={{ color: "var(--navy-500)", flexShrink: 0, marginTop: 1 }}>
                    <Icon name={ic} size={15} />
                  </span>
                  <span style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
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
  const sekretariat = [
    { name: "JIMMI KELLY, S.E.",    role: "Kasubbag Umum & Kepegawaian",            staff: ["SA'ARANI, S.Pd", "MISWATI", "FITRI ANDANI", "AYU LESTARI"] },
    { name: "USMAN KHOLIQ, S.E.",   role: "Kasubbag Keuangan, Aset dan Program",    staff: ["NASODIN, S.IP", "BUSTARI", "AHMAD ZIADI"] },
  ];
  const seksi = [
    { name: "DEDI SANTOSO, S.AP",                       role: "Kasi Pemerintahan",           staff: ["DAFIT HAYATULLOH AS, A.Md.Kom", "MUJITO", "HASIM", "IDAM KHOLID, S.Pd"] },
    { name: "Belum tercantum",                          role: "Kasi Trantib",                staff: [] },
    { name: "IBNU SYATIR, S.Pd",                        role: "Kasi PMD dan Kelurahan",       staff: ["ABDUL AZIZ", "PUJIATI, S.E.", "AHMAD NURYADIN", "AHMAD DAIROBI"] },
    { name: "MUALIMIN, A.Md.Kep",                       role: "Kasi Kesejahteraan Sosial",   staff: ["HERMANTO", "EDWAR EFENDI", "AKLIMA, S.Sos"] },
    { name: "Ir. MUHAMMAD SYAFA'AT, S.P., M.E., IPM",  role: "Kasi Pelayanan Umum",         staff: ["SITI AJRAH", "PAHRUL. AB", "SAIJUL", "BENNI KUSNADI"] },
  ];

  return (
    <>
      <PageHead
        crumb={["Profil", "Struktur Organisasi"]}
        title="Struktur Organisasi"
        sub={`Bagan organisasi dan tata kerja ${OFFICE.nama}`}
        actions={
          <button className="btn btn-ghost">
            <Icon name="print" size={15} />Cetak Bagan
          </button>
        }
      />
      <div className="card card-pad" style={{ overflowX: "auto" }}>
        <div className="org" style={{ minWidth: 1020, padding: "12px 0 8px" }}>

          {/* Camat */}
          <OrgNode head name={OFFICE.kepala} role={`${OFFICE.jabatanKepala} · ${OFFICE.pangkatKepala}`} />
          <div className="org-connector" />

          {/* Level 2: Fungsional + Sekretaris */}
          <div className="org-row" style={{ alignItems: "flex-start" }}>
            <div className="col center">
              <OrgNode name="Kelompok Jabatan Fungsional" role="Fungsional" />
            </div>
            <div className="col center">
              <OrgNode name="ZULKARNAIN, S.E." role="Sekretaris Kecamatan Air Hitam · III/d" />
              <div className="org-connector" />
              <div className="org-row">
                {sekretariat.map(b => (
                  <div key={b.role} className="col center">
                    <OrgNode name={b.name} role={b.role} />
                    <div className="org-connector" />
                    <div className="col gap-2" style={{ alignItems: "stretch", width: 210 }}>
                      {b.staff.map(s => (
                        <div key={s} className="org-staff-box">{s}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="org-connector" />
          <div style={{ width: "88%", height: 2, background: "var(--line)" }} />

          {/* Level 3: Seksi-seksi */}
          <div className="org-row" style={{ alignItems: "flex-start" }}>
            {seksi.map(b => (
              <div key={b.role} className="col center">
                <div className="org-connector" />
                <OrgNode name={b.name} role={b.role} />
                <div className="org-connector" />
                <div className="col gap-2" style={{ alignItems: "stretch", width: 180 }}>
                  {(b.staff.length ? b.staff : ["Data staf belum tercantum"]).map(s => (
                    <div key={s} className="org-staff-box" style={!b.staff.length ? { color: "var(--faint)", fontStyle: "italic" } : {}}>{s}</div>
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
  const [filter, setFilter] = useState("Semua");
  const filtered = filter === "Semua" ? PEGAWAI : PEGAWAI.filter(p => p.status === filter);

  return (
    <>
      <PageHead
        crumb={["Profil", "Data Kepegawaian"]}
        title="Data Kepegawaian"
        sub={`${PEGAWAI.length} pegawai terdaftar`}
        actions={
          <button className="btn btn-primary">
            <Icon name="plus" size={15} />Tambah Pegawai
          </button>
        }
      />
      <div className="toolbar">
        <div className="searchbar" style={{ maxWidth: 280, flex: "0 0 auto" }}>
          <Icon name="search" size={16} />
          <input placeholder="Cari nama / NIP / jabatan…" />
        </div>
        {["Semua", "PNS", "PPPK", "Honorer"].map(f => (
          <button key={f} className={"chip " + (filter === f ? "on" : "")} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Nama / Jabatan</th>
                <th>NIP</th>
                <th>Gol.</th>
                <th>Unit Kerja</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.nama}>
                  <td>
                    <div className="row gap-3 center">
                      <Avatar name={p.nama} size={36} />
                      <div>
                        <div className="td-strong">{p.nama}</div>
                        <div className="muted" style={{ fontSize: 12, marginTop: 1 }}>{p.jabatan}</div>
                      </div>
                    </div>
                  </td>
                  <td className="tabnum" style={{ fontSize: 12.5 }}>{p.nip}</td>
                  <td className="tabnum">{p.gol}</td>
                  <td>{p.unit}</td>
                  <td>
                    <span className={"badge " + (p.status === "PNS" ? "b-ok" : p.status === "PPPK" ? "b-biasa" : "b-draft")}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
                      <button className="iconbtn" title="Lihat"><Icon name="eye" size={16} /></button>
                      <button className="iconbtn" title="Edit"><Icon name="edit" size={16} /></button>
                      <button className="iconbtn danger" title="Hapus"><Icon name="trash" size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <EmptyHint icon="users">Tidak ada pegawai dengan status "{filter}"</EmptyHint>
        )}
      </div>
    </>
  );
}

/* ---------- Manajemen Akun ---------- */
function ManajemenAkun() {
  return (
    <>
      <PageHead
        crumb={["Pengaturan", "Manajemen Akun"]}
        title="Manajemen Akun"
        sub="Kelola akun pengguna, peran, dan hak akses sistem"
        actions={
          <button className="btn btn-primary">
            <Icon name="plus" size={15} />Tambah Akun
          </button>
        }
      />
      <div className="stat-grid" style={{ marginBottom: 20, gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat">
          <div className="si" style={{ background: "var(--purple-bg)", color: "var(--purple)" }}><Icon name="shield" size={20} /></div>
          <div className="sv">1</div><div className="sl">Super Admin</div>
        </div>
        <div className="stat">
          <div className="si" style={{ background: "var(--navy-100)", color: "var(--navy-700)" }}><Icon name="usercog" size={20} /></div>
          <div className="sv">3</div><div className="sl">Admin</div>
        </div>
        <div className="stat">
          <div className="si" style={{ background: "var(--info-bg)", color: "var(--info)" }}><Icon name="user" size={20} /></div>
          <div className="sv">2</div><div className="sl">User</div>
        </div>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Username</th>
                <th>Unit</th>
                <th>Peran</th>
                <th>Status</th>
                <th>Akses Terakhir</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {AKUN.map(a => (
                <tr key={a.user}>
                  <td>
                    <div className="row gap-3 center">
                      <Avatar name={a.nama} size={36} />
                      <div>
                        <div className="td-strong">{a.nama}</div>
                        <div className="muted" style={{ fontSize: 12, marginTop: 1 }}>{a.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="tabnum" style={{ fontSize: 12.5 }}>@{a.user}</td>
                  <td>{a.unit}</td>
                  <td>
                    <span className={"badge " + (a.role === "Super Admin" ? "b-rahasia" : a.role === "Admin" ? "b-biasa" : "b-draft")}>
                      {a.role === "Super Admin" && <Icon name="shield" size={11} />}{a.role}
                    </span>
                  </td>
                  <td>
                    <span className={"badge " + (a.aktif ? "b-ok" : "b-draft")}>
                      <span className="dot" />{a.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="tabnum muted" style={{ fontSize: 12 }}>{a.last}</td>
                  <td>
                    <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
                      <button className="iconbtn" title="Atur Hak Akses"><Icon name="settings" size={16} /></button>
                      <button className="iconbtn" title="Edit"><Icon name="edit" size={16} /></button>
                      <button className="iconbtn danger" title="Hapus"><Icon name="trash" size={16} /></button>
                    </div>
                  </td>
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
