/* ============================================================
   Shared UI components
   ============================================================ */

function Avatar({ name, size = 36, className }) {
  return (
    <div className={"avatar " + (className || "")} style={{ width: size, height: size, background: avatarColor(name), fontSize: size * 0.36 }}>
      {initials(name)}
    </div>
  );
}

function SifatBadge({ s }) {
  return <span className={"badge " + (SIFAT[s] || "b-biasa")}><span className="dot"></span>{s}</span>;
}

function StatusBadge({ s }) {
  const map = {
    "Baru": "b-penting", "Diproses": "b-biasa", "Ditindaklanjuti": "b-biasa",
    "Selesai": "b-ok", "Terkirim": "b-ok", "Draft": "b-draft", "Aktif": "b-ok", "Nonaktif": "b-draft",
  };
  return <span className={"badge " + (map[s] || "b-biasa")}>{s}</span>;
}

/* Row action buttons: Baca, Cetak, Edit, Hapus, WA */
function RowActions({ wa }) {
  return (
    <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
      <button className="iconbtn" title="Baca"><Icon name="eye" size={16} /></button>
      <button className="iconbtn" title="Cetak"><Icon name="print" size={16} /></button>
      {wa && <button className="iconbtn" title="Notifikasi WhatsApp" style={{ color: "var(--ok)" }}><Icon name="whatsapp" size={16} /></button>}
      <button className="iconbtn" title="Edit"><Icon name="edit" size={16} /></button>
      <button className="iconbtn danger" title="Hapus"><Icon name="trash" size={16} /></button>
    </div>
  );
}

function PageHead({ crumb, title, sub, actions }) {
  return (
    <div className="page-head">
      {crumb && <div className="crumb">{crumb.map((c, i) => (
        <React.Fragment key={i}>{i > 0 && <Icon name="chevright" size={12} />}<span>{c}</span></React.Fragment>
      ))}</div>}
      <div className="row between center wrap gap-4">
        <div>
          <h1>{title}</h1>
          {sub && <p className="sub">{sub}</p>}
        </div>
        {actions}
      </div>
    </div>
  );
}

function Field({ label, req, hint, children, full }) {
  return (
    <div className="field" style={full ? { gridColumn: "1 / -1" } : undefined}>
      <label>{label}{req && <span className="req"> *</span>}</label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function Dropzone({ label = "Unggah Dokumen Surat", file }) {
  return (
    <div className="dropzone">
      <div style={{ color: "var(--navy-600)", marginBottom: 8 }}><Icon name="upload" size={26} /></div>
      {file
        ? <div className="row gap-2 center" style={{ justifyContent: "center" }}>
            <Icon name="doc" size={16} /><span style={{ color: "var(--ink)", fontWeight: 600, fontSize: 13.5 }}>{file}</span>
          </div>
        : <><div style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 13.5 }}>Tarik berkas ke sini atau <span style={{ color: "var(--navy-600)" }}>pilih berkas</span></div>
           <div className="hint" style={{ marginTop: 4 }}>PDF, JPG, atau PNG — maksimal 5 MB</div></>}
    </div>
  );
}

/* WhatsApp notification preview card */
function WaPreview({ lines }) {
  return (
    <div style={{ background: "oklch(0.95 0.04 155)", border: "1px solid oklch(0.85 0.06 155)", borderRadius: "var(--r)", padding: "14px 16px" }}>
      <div className="row gap-2 center" style={{ marginBottom: 8 }}>
        <span style={{ color: "var(--ok)" }}><Icon name="whatsapp" size={18} /></span>
        <span style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>Notifikasi WhatsApp</span>
        <span className="badge b-ok" style={{ marginLeft: "auto" }}>Otomatis</span>
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: "11px 13px", fontSize: 12.5, lineHeight: 1.6, color: "var(--ink-soft)", boxShadow: "var(--shadow-sm)" }}>
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}

function EmptyHint({ icon, children }) {
  return (
    <div className="col center" style={{ padding: "40px 20px", color: "var(--muted)", textAlign: "center", gap: 10 }}>
      <Icon name={icon} size={28} /><span style={{ fontSize: 13.5 }}>{children}</span>
    </div>
  );
}

Object.assign(window, { Avatar, SifatBadge, StatusBadge, RowActions, PageHead, Field, Dropzone, WaPreview, EmptyHint });
