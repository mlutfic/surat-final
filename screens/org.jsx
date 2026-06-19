/* ============================================================
   Screens: Profil Kantor, Struktur Organisasi,
            Data Kepegawaian, Manajemen Akun
   ============================================================ */

function officeProfileFormValue(office) {
  return {
    office_name: office.office_name || "",
    government_name: office.government_name || "",
    district_name: office.district_name || "",
    app_name: office.app_name || "",
    app_expansion: office.app_expansion || "",
    app_tagline: office.app_tagline || "",
    background_text: office.background_text || "",
    concept_text: office.concept_text || "",
    address: office.address || "",
    phone: office.phone || "",
    email: office.email || "",
    website: office.website || "-",
    whatsapp_notification: office.whatsapp_notification || "",
    head_name: office.head_name || "",
    head_nip: office.head_nip || "",
    head_title: office.head_title || "",
    head_rank: office.head_rank || "",
    service_hours: office.service_hours || "",
    legal_basis_established: office.legal_basis_established || "",
    legal_references_text: linesFromArray(office.legal_references),
    goals_text: linesFromArray(office.goals),
    mechanisms_text: linesFromArray(office.mechanisms),
    internal_units_text: linesFromArray(office.internal_units),
    village_units_text: linesFromArray(office.village_units),
    complaint_categories_text: linesFromArray(office.complaint_categories),
    logo_url: office.logo_url || "",
    org_pdf_url: office.org_pdf_url || "",
  };
}

function ProfilKantor() {
  const office = AppSelectors.office();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(() => office ? officeProfileFormValue(office) : {});

  useEffect(() => {
    if (office) setForm(officeProfileFormValue(office));
  }, [office?.id, office?.updated_at]);

  if (!office) return <LoadingBlock label="Memuat profil kantor..." />;

  const info = [
    ["Nama Instansi", office.office_name],
    ["Pemerintah Daerah", office.government_name],
    [office.head_title, office.head_name],
    ["Pangkat / Golongan", office.head_rank],
    ["NIP", office.head_nip],
    ["Alamat", office.address],
    ["Email Kantor", office.email],
    ["WhatsApp Notifikasi Dokumen", office.whatsapp_notification],
    ["Jam Pelayanan", office.service_hours],
    ["Dasar Pembentukan", office.legal_basis_established],
  ];

  async function save() {
    setBusy(true);
    try {
      await AppApi.saveOfficeProfile(form);
      setEditing(false);
    } catch (error) {
      AppApi.setNotice(error.message || "Gagal memperbarui profil kantor.", "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHead
        crumb={["Pengaturan", "Profil Kantor"]}
        title="Profil Kantor"
        sub="Identitas dan informasi resmi instansi"
        actions={
          <div className="row gap-2">
            {editing && (
              <button type="button" className="btn btn-ghost" onClick={() => { setEditing(false); setForm(officeProfileFormValue(office)); }}>
                Batal
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={() => (editing ? save() : setEditing(true))} disabled={busy}>
              <Icon name={editing ? "check" : "edit"} size={15} />{editing ? (busy ? "Menyimpan..." : "Simpan Profil") : "Edit Profil"}
            </button>
          </div>
        }
      />

      {editing && (
        <div className="card card-pad" style={{ marginBottom: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Form Profil Kantor</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Nama Instansi" req><input className="input" value={form.office_name} onChange={(event) => setForm((value) => ({ ...value, office_name: event.target.value }))} /></Field>
            <Field label="Pemerintah Daerah" req><input className="input" value={form.government_name} onChange={(event) => setForm((value) => ({ ...value, government_name: event.target.value }))} /></Field>
            <Field label="Nama Aplikasi" req><input className="input" value={form.app_name} onChange={(event) => setForm((value) => ({ ...value, app_name: event.target.value }))} /></Field>
            <Field label="Wilayah" req><input className="input" value={form.district_name} onChange={(event) => setForm((value) => ({ ...value, district_name: event.target.value }))} /></Field>
            <Field label="Kepanjangan Aplikasi" req full><input className="input" value={form.app_expansion} onChange={(event) => setForm((value) => ({ ...value, app_expansion: event.target.value }))} /></Field>
            <Field label="Tagline" req full><input className="input" value={form.app_tagline} onChange={(event) => setForm((value) => ({ ...value, app_tagline: event.target.value }))} /></Field>
            <Field label="Alamat" req full><textarea className="textarea" value={form.address} onChange={(event) => setForm((value) => ({ ...value, address: event.target.value }))} /></Field>
            <Field label="Telepon / WA" req><input className="input tabnum" value={form.phone} onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))} /></Field>
            <Field label="WA Notifikasi Dokumen" req><input className="input tabnum" value={form.whatsapp_notification} onChange={(event) => setForm((value) => ({ ...value, whatsapp_notification: event.target.value }))} /></Field>
            <Field label="Email" req><input className="input" value={form.email} onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))} /></Field>
            <Field label="Website"><input className="input" value={form.website} onChange={(event) => setForm((value) => ({ ...value, website: event.target.value }))} /></Field>
            <Field label="Jam Pelayanan" req><input className="input" value={form.service_hours} onChange={(event) => setForm((value) => ({ ...value, service_hours: event.target.value }))} /></Field>
            <Field label="Nama Pimpinan" req><input className="input" value={form.head_name} onChange={(event) => setForm((value) => ({ ...value, head_name: event.target.value }))} /></Field>
            <Field label="Jabatan Pimpinan" req><input className="input" value={form.head_title} onChange={(event) => setForm((value) => ({ ...value, head_title: event.target.value }))} /></Field>
            <Field label="NIP" req><input className="input tabnum" value={form.head_nip} onChange={(event) => setForm((value) => ({ ...value, head_nip: event.target.value }))} /></Field>
            <Field label="Pangkat / Golongan" req><input className="input" value={form.head_rank} onChange={(event) => setForm((value) => ({ ...value, head_rank: event.target.value }))} /></Field>
            <Field label="Dasar Pembentukan" req full><input className="input" value={form.legal_basis_established} onChange={(event) => setForm((value) => ({ ...value, legal_basis_established: event.target.value }))} /></Field>
            <Field label="Latar Belakang" req full><textarea className="textarea" value={form.background_text} onChange={(event) => setForm((value) => ({ ...value, background_text: event.target.value }))} /></Field>
            <Field label="Konsep Aplikasi" req full><textarea className="textarea" value={form.concept_text} onChange={(event) => setForm((value) => ({ ...value, concept_text: event.target.value }))} /></Field>
            <Field label="Dasar Hukum (1 baris per item)" full><textarea className="textarea" value={form.legal_references_text} onChange={(event) => setForm((value) => ({ ...value, legal_references_text: event.target.value }))} /></Field>
            <Field label="Tujuan (1 baris per item)" full><textarea className="textarea" value={form.goals_text} onChange={(event) => setForm((value) => ({ ...value, goals_text: event.target.value }))} /></Field>
            <Field label="Mekanisme (1 baris per item)" full><textarea className="textarea" value={form.mechanisms_text} onChange={(event) => setForm((value) => ({ ...value, mechanisms_text: event.target.value }))} /></Field>
            <Field label="Unit Internal (1 baris per item)" full><textarea className="textarea" value={form.internal_units_text} onChange={(event) => setForm((value) => ({ ...value, internal_units_text: event.target.value }))} /></Field>
            <Field label="Daftar Desa (1 baris per item)" full><textarea className="textarea" value={form.village_units_text} onChange={(event) => setForm((value) => ({ ...value, village_units_text: event.target.value }))} /></Field>
            <Field label="Kategori Pengaduan (1 baris per item)" full><textarea className="textarea" value={form.complaint_categories_text} onChange={(event) => setForm((value) => ({ ...value, complaint_categories_text: event.target.value }))} /></Field>
            <Field label="URL Logo" full><input className="input" value={form.logo_url} onChange={(event) => setForm((value) => ({ ...value, logo_url: event.target.value }))} /></Field>
            <Field label="URL PDF Struktur Organisasi" full><input className="input" value={form.org_pdf_url} onChange={(event) => setForm((value) => ({ ...value, org_pdf_url: event.target.value }))} /></Field>
          </div>
        </div>
      )}

      <div className="form-grid">
        <div style={{ order: 2 }}>
          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 10 }}>Informasi Umum</div>
            {info.map(([label, value]) => (
              <div className="info-row" key={label}>
                <div className="ik">{label}</div>
                <div className="iv">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col gap-4" style={{ order: 1 }}>
          <div className="card card-pad" style={{ textAlign: "center" }}>
            <div className="profil-logo" style={{ margin: "0 auto 14px" }}>
              <img src={office.logo_url} alt="" />
            </div>
            <h3 style={{ fontSize: 16 }}>{office.app_name}</h3>
            <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>{office.district_name}</div>
            <div className="row gap-2 center" style={{ marginTop: 10, justifyContent: "center" }}>
              <span className="badge b-ok"><Icon name="shield" size={12} />Terverifikasi</span>
              <span className="badge b-biasa"><Icon name="globe" size={12} />Publik</span>
            </div>
            <div className="profil-divider" />
            <div className="col" style={{ gap: 10, textAlign: "left" }}>
              {[["mappin", office.address], ["mail", office.email], ["phone", `WA dokumen: ${office.whatsapp_notification}`], ["calendar", office.service_hours]].map(([icon, text]) => (
                <div key={icon} className="profil-contact-row">
                  <span style={{ color: "var(--navy-500)", flexShrink: 0, marginTop: 1 }}>
                    <Icon name={icon} size={15} />
                  </span>
                  <span style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StrukturOrganisasi() {
  const office = AppSelectors.office();
  if (!office) return <LoadingBlock label="Memuat struktur organisasi..." />;

  return (
    <>
      <PageHead
        crumb={["Profil", "Struktur Organisasi"]}
        title="Struktur Organisasi"
        sub={`Dokumen struktur organisasi ${office.district_name}`}
        actions={
          <a className="btn btn-primary" href={office.org_pdf_url} target="_blank" rel="noreferrer">
            <Icon name="download" size={15} />Buka PDF
          </a>
        }
      />
      <div className="card org-pdf-shell">
        <div className="org-pdf-toolbar">
          <div>
            <h3>Struktur Organisasi {office.office_name}</h3>
            <p>Dokumen ditampilkan dari sumber data resmi yang tersimpan pada profil kantor.</p>
          </div>
          <a className="btn btn-ghost" href={office.org_pdf_url} target="_blank" rel="noreferrer">
            <Icon name="eye" size={15} />Lihat penuh
          </a>
        </div>
        <iframe className="org-pdf-frame" title="Struktur Organisasi" src={office.org_pdf_url}></iframe>
        <div className="org-pdf-fallback">Jika PDF tidak tampil, buka dokumen melalui tombol <b>Lihat penuh</b>.</div>
      </div>
    </>
  );
}

function EmployeeEditor({ form, setForm, onSave, onCancel, busy }) {
  return (
    <div className="card card-pad" style={{ marginBottom: 20 }}>
      <div className="eyebrow" style={{ marginBottom: 18 }}>{form.id ? "Edit Pegawai" : "Tambah Pegawai"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Nama Lengkap" req><input className="input" value={form.full_name} onChange={(event) => setForm((value) => ({ ...value, full_name: event.target.value }))} /></Field>
        <Field label="NIP" req><input className="input tabnum" value={form.nip} onChange={(event) => setForm((value) => ({ ...value, nip: event.target.value }))} /></Field>
        <Field label="Jabatan" req><input className="input" value={form.position} onChange={(event) => setForm((value) => ({ ...value, position: event.target.value }))} /></Field>
        <Field label="Golongan"><input className="input" value={form.grade} onChange={(event) => setForm((value) => ({ ...value, grade: event.target.value }))} /></Field>
        <Field label="Unit Kerja" req><input className="input" value={form.work_unit} onChange={(event) => setForm((value) => ({ ...value, work_unit: event.target.value }))} /></Field>
        <Field label="Status" req>
          <select className="select" value={form.employment_status} onChange={(event) => setForm((value) => ({ ...value, employment_status: event.target.value }))}>
            {EMPLOYMENT_STATUS_OPTIONS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
      </div>
      <div className="row gap-2" style={{ marginTop: 20 }}>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={onSave}><Icon name="check" size={15} />{busy ? "Menyimpan..." : "Simpan Pegawai"}</button>
        <button type="button" className="btn btn-ghost" disabled={busy} onClick={onCancel}>Batal</button>
      </div>
    </div>
  );
}

const EMPLOYEE_POSITION_ORDER = {
  "camat air hitam": 0,
  "sekcam air hitam": 1,
  "sekretaris kecamatan air hitam": 1,
  "kasi pelayanan umum": 2,
  "kasi kesejahteraan sosial": 3,
  "kasi pemerintahan": 4,
  "kasi pmdk": 5,
  "kasi pmd dan kelurahan": 5,
  "kasubbag keuangan, aset dan program": 6,
  "kasubbag umum dan kepegawaian": 7,
  "kasubbag umum & kepegawaian": 7,
  "staf": 8,
};

function employeeStatusBadgeClass(status) {
  if (status === "PNS") return "b-ok";
  if (status === "PPPK") return "b-biasa";
  return "b-draft";
}

function employeeStatusLabel(status) {
  if (status === "PNS") return "Pegawai Negeri Sipil (PNS)";
  if (status === "PPPK") return "Pegawai Pemerintah dengan Perjanjian Kerja (PPPK)";
  return "Tenaga Honorer";
}

function sortEmployees(left, right) {
  const leftPosition = String(left.position || "").trim().toLowerCase();
  const rightPosition = String(right.position || "").trim().toLowerCase();
  const leftRank = EMPLOYEE_POSITION_ORDER[leftPosition] ?? 99;
  const rightRank = EMPLOYEE_POSITION_ORDER[rightPosition] ?? 99;
  if (leftRank !== rightRank) return leftRank - rightRank;

  const unitCompare = String(left.work_unit || "").localeCompare(String(right.work_unit || ""), "id-ID");
  if (unitCompare !== 0) return unitCompare;

  return String(left.full_name || "").localeCompare(String(right.full_name || ""), "id-ID");
}

function EmployeeTableSection({ status, items, onEdit, onDelete }) {
  return (
    <div className="card" style={{ marginTop: 18 }}>
      <div className="card-pad" style={{ paddingBottom: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>{status}</div>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17 }}>{employeeStatusLabel(status)}</h3>
            <p className="muted" style={{ margin: "6px 0 0", fontSize: 12.5 }}>
              {items.length} pegawai tercatat pada kelompok {status}.
            </p>
          </div>
          <span className={"badge " + employeeStatusBadgeClass(status)}>{status}</span>
        </div>
      </div>
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
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="row gap-3 center">
                    <Avatar name={item.full_name} size={36} />
                    <div>
                      <div className="td-strong">{item.full_name}</div>
                      <div className="muted" style={{ fontSize: 12, marginTop: 1 }}>{item.position}</div>
                    </div>
                  </div>
                </td>
                <td className="tabnum" style={{ fontSize: 12.5 }}>{item.nip}</td>
                <td className="tabnum">{item.grade}</td>
                <td>{item.work_unit}</td>
                <td>
                  <span className={"badge " + employeeStatusBadgeClass(item.employment_status)}>
                    {item.employment_status}
                  </span>
                </td>
                <td>
                  <RowActions
                    onView={() => AppApi.setNotice(`Pegawai: ${item.full_name} · ${item.position}`, "info")}
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <EmptyHint icon="users">Tidak ada pegawai pada kelompok {status}.</EmptyHint>}
    </div>
  );
}

function DataKepegawaian() {
  const [filter, setFilter] = useState("Semua");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    id: "",
    full_name: "",
    nip: "",
    position: "",
    grade: "-",
    work_unit: "",
    employment_status: "PNS",
  });
  const [editing, setEditing] = useState(false);
  const employees = AppSelectors.employees();

  const counts = employees.reduce((carry, item) => {
    carry[item.employment_status] = (carry[item.employment_status] || 0) + 1;
    return carry;
  }, {});

  const searched = employees.filter((item) => {
    const keyword = query.trim().toLowerCase();
    const haystack = [item.full_name, item.nip, item.position, item.work_unit].join(" ").toLowerCase();
    return !keyword || haystack.includes(keyword);
  }).slice().sort(sortEmployees);

  const visibleStatuses = filter === "Semua"
    ? EMPLOYMENT_STATUS_OPTIONS.filter((status) => searched.some((item) => item.employment_status === status))
    : [filter];

  const grouped = visibleStatuses.map((status) => ({
    status,
    items: searched.filter((item) => item.employment_status === status),
  }));

  const visibleCount = grouped.reduce((sum, section) => sum + section.items.length, 0);

  async function save() {
    setBusy(true);
    try {
      await AppApi.saveEmployee(form);
      setEditing(false);
      setForm({ id: "", full_name: "", nip: "", position: "", grade: "-", work_unit: "", employment_status: "PNS" });
    } catch (error) {
      AppApi.setNotice(error.message || "Gagal menyimpan pegawai.", "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHead
        crumb={["Profil", "Data Kepegawaian"]}
        title="Data Kepegawaian"
        sub={`${employees.length} pegawai terdaftar · ${counts.PNS || 0} PNS · ${counts.PPPK || 0} PPPK`}
        actions={
          <button type="button" className="btn btn-primary" onClick={() => { setEditing(true); setForm({ id: "", full_name: "", nip: "", position: "", grade: "-", work_unit: "", employment_status: "PNS" }); }}>
            <Icon name="plus" size={15} />Tambah Pegawai
          </button>
        }
      />
      {editing && <EmployeeEditor form={form} setForm={setForm} busy={busy} onSave={save} onCancel={() => setEditing(false)} />}
      <div className="stat-grid" style={{ marginBottom: 18, gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat">
          <div className="si" style={{ background: "var(--info-bg)", color: "var(--info)" }}><Icon name="users" size={20} /></div>
          <div className="sv">{employees.length}</div><div className="sl">Total Pegawai</div>
        </div>
        <div className="stat">
          <div className="si" style={{ background: "var(--ok-bg)", color: "var(--ok)" }}><Icon name="shield" size={20} /></div>
          <div className="sv">{counts.PNS || 0}</div><div className="sl">PNS</div>
        </div>
        <div className="stat">
          <div className="si" style={{ background: "var(--warn-bg)", color: "var(--warn)" }}><Icon name="idcard" size={20} /></div>
          <div className="sv">{counts.PPPK || 0}</div><div className="sl">PPPK</div>
        </div>
      </div>
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Pemisahan Status ASN</div>
        <p className="muted" style={{ margin: 0, fontSize: 12.5, lineHeight: 1.7 }}>
          Data pegawai kini dipisahkan per kelompok status kepegawaian agar verifikasi daftar PNS dan PPPK lebih mudah mengikuti data resmi Kantor Camat Air Hitam.
        </p>
      </div>
      <div className="toolbar">
        <div className="searchbar" style={{ maxWidth: 280, flex: "0 0 auto" }}>
          <Icon name="search" size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama / NIP / jabatan…" />
        </div>
        {["Semua", ...EMPLOYMENT_STATUS_OPTIONS].map((item) => (
          <button key={item} type="button" className={"chip " + (filter === item ? "on" : "")} onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>
      {grouped.map((section) => (
        <EmployeeTableSection
          key={section.status}
          status={section.status}
          items={section.items}
          onEdit={(item) => { setEditing(true); setForm({ ...item }); }}
          onDelete={(item) => {
            if (window.confirm(`Hapus data pegawai ${item.full_name}?`)) AppApi.deleteEmployee(item.id);
          }}
        />
      ))}
      {visibleCount === 0 && grouped.length === 0 && <EmptyHint icon="users">Tidak ada pegawai dengan filter yang dipilih.</EmptyHint>}
    </>
  );
}

function AccountEditor({ form, setForm, onSave, onCancel, busy, office }) {
  const villageOptions = office?.village_units || [];

  return (
    <div className="card card-pad" style={{ marginBottom: 20 }}>
      <div className="eyebrow" style={{ marginBottom: 18 }}>{form.id ? "Edit Akun" : "Tambah Akun"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Nama Pengguna" req><input className="input" value={form.full_name} onChange={(event) => setForm((value) => ({ ...value, full_name: event.target.value }))} /></Field>
        <Field label="Username" req><input className="input" value={form.username} onChange={(event) => setForm((value) => ({ ...value, username: event.target.value }))} /></Field>
        <Field label="Email" req><input className="input" value={form.email} onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))} /></Field>
        <Field label="Role" req>
          <select className="select" value={form.role} onChange={(event) => setForm((value) => ({ ...value, role: event.target.value, scope_village: event.target.value === "User" ? value.scope_village : "" }))}>
            {ACCOUNT_ROLE_OPTIONS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Unit" req><input className="input" value={form.unit_name} onChange={(event) => setForm((value) => ({ ...value, unit_name: event.target.value }))} /></Field>
        <Field label="Scope Desa">
          <select className="select" value={form.scope_village || ""} onChange={(event) => setForm((value) => ({ ...value, scope_village: event.target.value }))}>
            <option value="">Tidak dibatasi</option>
            {villageOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
        <Field label={form.id ? "Reset Password Baru (opsional)" : "Password Awal"}>
          <input className="input" type="password" value={form.password} onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))} placeholder={form.id ? "Kosongkan bila tidak berubah" : "Contoh: AirHitam2026!"} />
        </Field>
        <Field label="Status">
          <select className="select" value={String(form.is_active)} onChange={(event) => setForm((value) => ({ ...value, is_active: event.target.value === "true" }))}>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
        </Field>
      </div>
      <div className="row gap-2" style={{ marginTop: 20 }}>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={onSave}><Icon name="check" size={15} />{busy ? "Menyimpan..." : "Simpan Akun"}</button>
        <button type="button" className="btn btn-ghost" disabled={busy} onClick={onCancel}>Batal</button>
      </div>
    </div>
  );
}

function ManajemenAkun() {
  const office = AppSelectors.office();
  const accounts = AppSelectors.accounts();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    role: "User",
    unit_name: "",
    scope_village: "",
    is_active: true,
    password: "",
  });

  if (!office) return <LoadingBlock label="Memuat manajemen akun..." />;

  const roleCounts = accounts.reduce((carry, item) => {
    carry[item.role] = (carry[item.role] || 0) + 1;
    return carry;
  }, {});
  const activeCount = accounts.filter((item) => item.is_active).length;

  async function save() {
    setBusy(true);
    try {
      await AppApi.saveAccount(form);
      setEditing(false);
      setForm({ id: "", full_name: "", username: "", email: "", role: "User", unit_name: "", scope_village: "", is_active: true, password: "" });
    } catch (error) {
      AppApi.setNotice(error.message || "Gagal menyimpan akun.", "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHead
        crumb={["Pengaturan", "Manajemen Akun"]}
        title="Manajemen Akun"
        sub={`${accounts.length} akun terdaftar: 9 desa dan 1 kantor camat`}
        actions={
          <button type="button" className="btn btn-primary" onClick={() => { setEditing(true); setForm({ id: "", full_name: "", username: "", email: "", role: "User", unit_name: "", scope_village: "", is_active: true, password: "AirHitam2026!" }); }}>
            <Icon name="plus" size={15} />Tambah Akun
          </button>
        }
      />
      {editing && <AccountEditor form={form} setForm={setForm} office={office} busy={busy} onSave={save} onCancel={() => setEditing(false)} />}
      <div className="stat-grid" style={{ marginBottom: 20, gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat">
          <div className="si" style={{ background: "var(--purple-bg)", color: "var(--purple)" }}><Icon name="shield" size={20} /></div>
          <div className="sv">{roleCounts["Super Admin"] || 0}</div><div className="sl">Super Admin</div>
        </div>
        <div className="stat">
          <div className="si" style={{ background: "var(--info-bg)", color: "var(--info)" }}><Icon name="user" size={20} /></div>
          <div className="sv">{roleCounts["User"] || 0}</div><div className="sl">User Desa</div>
        </div>
        <div className="stat">
          <div className="si" style={{ background: "var(--ok-bg)", color: "var(--ok)" }}><Icon name="check" size={20} /></div>
          <div className="sv">{activeCount}</div><div className="sl">Akun Aktif</div>
        </div>
      </div>
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Business Rule Aktif</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.85 }}>
          <li>Total akun aktif ditetapkan 10 user: 9 operator desa dan 1 operator kantor camat.</li>
          <li>Akun desa disusun berbasis unit kerja agar pergantian operator tidak mengubah struktur akses.</li>
          <li>Operator desa hanya menginput dan memantau dokumen milik desanya, sedangkan kantor camat memverifikasi seluruh dokumen.</li>
          <li>Notifikasi dokumen otomatis dipusatkan ke WhatsApp resmi kecamatan: <b>{office.whatsapp_notification}</b>.</li>
        </ul>
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
              {accounts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="row gap-3 center">
                      <Avatar name={item.full_name} size={36} />
                      <div>
                        <div className="td-strong">{item.full_name}</div>
                        <div className="muted" style={{ fontSize: 12, marginTop: 1 }}>{item.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="tabnum" style={{ fontSize: 12.5 }}>@{item.username}</td>
                  <td>{item.unit_name}</td>
                  <td>
                    <span className={"badge " + (item.role === "Super Admin" ? "b-rahasia" : "b-draft")}>
                      {item.role === "Super Admin" && <Icon name="shield" size={11} />}{item.role}
                    </span>
                  </td>
                  <td>
                    <span className={"badge " + (item.is_active ? "b-ok" : "b-draft")}>
                      <span className="dot" />{item.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="tabnum muted" style={{ fontSize: 12 }}>{item.last_login_at ? formatDateTimeId(item.last_login_at) : "-"}</td>
                  <td>
                    <RowActions
                      onView={() => AppApi.setNotice(`Akun ${item.username} · ${item.unit_name}`, "info")}
                      onEdit={() => {
                        setEditing(true);
                        setForm({
                          id: item.id,
                          full_name: item.full_name,
                          username: item.username,
                          email: item.email,
                          role: item.role,
                          unit_name: item.unit_name,
                          scope_village: item.scope_village || "",
                          is_active: Boolean(item.is_active),
                          password: "",
                        });
                      }}
                      onDelete={() => {
                        if (window.confirm(`Hapus akun @${item.username}?`)) AppApi.deleteAccount(item.id);
                      }}
                    />
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
