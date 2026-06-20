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
    Baru: "b-penting",
    Diproses: "b-biasa",
    Ditindaklanjuti: "b-biasa",
    Selesai: "b-ok",
    Terkirim: "b-ok",
    Draft: "b-draft",
    Aktif: "b-ok",
    Nonaktif: "b-draft",
  };
  return <span className={"badge " + (map[s] || "b-biasa")}>{s}</span>;
}

function RowActions({ onView, onPrint, onDownload, onWhatsApp, onEdit, onDelete, viewTitle = "Baca", downloadTitle = "Unduh Dokumen", whatsappTitle = "Notifikasi WhatsApp" }) {
  return (
    <div className="row gap-2" style={{ justifyContent: "flex-end" }}>
      {onView && <button type="button" className="iconbtn" title={viewTitle} onClick={onView}><Icon name="eye" size={16} /></button>}
      {onPrint && <button type="button" className="iconbtn" title="Cetak" onClick={onPrint}><Icon name="print" size={16} /></button>}
      {onDownload && <button type="button" className="iconbtn" title={downloadTitle} onClick={onDownload}><Icon name="download" size={16} /></button>}
      {onWhatsApp && <button type="button" className="iconbtn" title={whatsappTitle} style={{ color: "var(--ok)" }} onClick={onWhatsApp}><Icon name="whatsapp" size={16} /></button>}
      {onEdit && <button type="button" className="iconbtn" title="Edit" onClick={onEdit}><Icon name="edit" size={16} /></button>}
      {onDelete && <button type="button" className="iconbtn danger" title="Hapus" onClick={onDelete}><Icon name="trash" size={16} /></button>}
    </div>
  );
}

function PageHead({ crumb, title, sub, actions }) {
  return (
    <div className="page-head">
      {crumb && <div className="crumb">{crumb.map((item, index) => (
        <React.Fragment key={index}>{index > 0 && <Icon name="chevright" size={12} />}<span>{item}</span></React.Fragment>
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

function Dropzone({ file, onFileChange, onRemove, hint = "PDF, JPG, atau PNG - maksimal 5 MB" }) {
  const inputRef = useRef(null);
  const displayName = file?.name || file?.file_name || file || "";

  function chooseFile() {
    inputRef.current?.click();
  }

  return (
    <div className="dropzone" style={{ cursor: "pointer" }} onClick={chooseFile}>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        style={{ display: "none" }}
        onChange={(event) => {
          const nextFile = event.target.files?.[0] || null;
          if (nextFile) onFileChange?.(nextFile);
          event.target.value = "";
        }}
      />
      <div style={{ color: "var(--navy-600)", marginBottom: 8 }}><Icon name="upload" size={26} /></div>
      {displayName ? (
        <>
          <div className="row gap-2 center" style={{ justifyContent: "center", flexWrap: "wrap" }}>
            <Icon name="doc" size={16} />
            <span style={{ color: "var(--ink)", fontWeight: 600, fontSize: 13.5 }}>{displayName}</span>
          </div>
          <div className="row gap-2 center" style={{ justifyContent: "center", marginTop: 12 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={(event) => { event.stopPropagation(); chooseFile(); }}>
              Ganti File
            </button>
            {onRemove && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: "var(--hot)" }}
                onClick={async (event) => {
                  event.stopPropagation();
                  const confirmed = await AppApi.confirmDeletion("lampiran", displayName, "File yang dihapus harus diunggah ulang bila masih dibutuhkan.");
                  if (confirmed) onRemove();
                }}
              >
                Hapus File
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 13.5 }}>Tarik berkas ke sini atau <span style={{ color: "var(--navy-600)" }}>pilih berkas</span></div>
          <div className="hint" style={{ marginTop: 4 }}>{hint}</div>
        </>
      )}
    </div>
  );
}

function WaPreview({ lines }) {
  return (
    <div style={{ background: "oklch(0.95 0.04 155)", border: "1px solid oklch(0.85 0.06 155)", borderRadius: "var(--r)", padding: "14px 16px" }}>
      <div className="row gap-2 center" style={{ marginBottom: 8 }}>
        <span style={{ color: "var(--ok)" }}><Icon name="whatsapp" size={18} /></span>
        <span style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>Notifikasi WhatsApp</span>
        <span className="badge b-ok" style={{ marginLeft: "auto" }}>Otomatis</span>
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: "11px 13px", fontSize: 12.5, lineHeight: 1.6, color: "var(--ink-soft)", boxShadow: "var(--shadow-sm)" }}>
        {lines.map((line, index) => <div key={index}>{line}</div>)}
      </div>
    </div>
  );
}

function EmptyHint({ icon, children }) {
  return (
    <div className="col center" style={{ padding: "40px 20px", color: "var(--muted)", textAlign: "center", gap: 10 }}>
      <Icon name={icon} size={28} />
      <span style={{ fontSize: 13.5 }}>{children}</span>
    </div>
  );
}

function Pagination({ current = 1, total = 1, onPage }) {
  const pages = Array.from({ length: Math.min(total, 5) }, (_, index) => index + 1);
  return (
    <div className="row between center" style={{ padding: "13px 18px", borderTop: "1px solid var(--line)" }}>
      <span className="muted" style={{ fontSize: 12.5 }}>Halaman {current} dari {total}</span>
      <div className="pagination">
        <button type="button" className="pg-btn" disabled={current <= 1} onClick={() => onPage?.(current - 1)}>← Sebelumnya</button>
        {pages.map((page) => (
          <button type="button" key={page} className={"pg-btn " + (page === current ? "active" : "")} onClick={() => onPage?.(page)}>
            {page}
          </button>
        ))}
        {total > 5 && <span style={{ fontSize: 12.5, color: "var(--muted)", padding: "0 4px" }}>…</span>}
        <button type="button" className="pg-btn" disabled={current >= total} onClick={() => onPage?.(current + 1)}>Berikutnya →</button>
      </div>
    </div>
  );
}

function WaBanner({ label, hint, on = true, onChange }) {
  const [active, setActive] = useState(Boolean(on));

  useEffect(() => {
    setActive(Boolean(on));
  }, [on]);

  function toggle() {
    setActive((value) => {
      const next = !value;
      onChange?.(next);
      return next;
    });
  }

  return (
    <div className="wa-banner">
      <span style={{ color: "var(--ok)" }}><Icon name="whatsapp" size={20} /></span>
      <div className="grow">
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{label}</div>
        <div className="hint">{hint}</div>
      </div>
      <button type="button" className="wa-toggle" onClick={toggle} aria-label="Toggle WA notifikasi">
        <span className={"wa-toggle-track" + (active ? "" : " off")}></span>
        <span className={"wa-toggle-thumb" + (active ? "" : " off")}></span>
      </button>
    </div>
  );
}

function InlineNotice({ tone = "info", children }) {
  const tones = {
    ok: { bg: "var(--ok-bg)", border: "var(--ok)", color: "var(--ok)" },
    info: { bg: "var(--navy-50)", border: "var(--navy-100)", color: "var(--navy-700)" },
    warn: { bg: "oklch(0.98 0.03 92)", border: "var(--warn)", color: "oklch(0.45 0.09 78)" },
    danger: { bg: "oklch(0.97 0.03 24)", border: "var(--hot)", color: "oklch(0.52 0.16 24)" },
  };
  const style = tones[tone] || tones.info;
  return (
    <div style={{ padding: "12px 14px", borderRadius: "var(--r)", border: `1px solid ${style.border}`, background: style.bg, color: style.color, fontSize: 12.5, lineHeight: 1.65 }}>
      {children}
    </div>
  );
}

function ConfirmDialog({ open, title, message, itemLabel, description, confirmLabel = "Yes", cancelLabel = "No", tone = "danger", onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return undefined;
    function handleKeydown(event) {
      if (event.key === "Escape") onCancel?.();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="confirm-backdrop" onClick={() => onCancel?.()}>
      <div className={"confirm-dialog " + (tone === "danger" ? "is-danger" : "")} role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" onClick={(event) => event.stopPropagation()}>
        <div className="confirm-kicker">Konfirmasi Tindakan</div>
        <h3 id="confirm-dialog-title">{title || "Konfirmasi"}</h3>
        {message && <p className="confirm-message">{message}</p>}
        {itemLabel && <div className="confirm-target">{itemLabel}</div>}
        {description && <p className="confirm-description">{description}</p>}
        <div className="confirm-actions">
          <button type="button" className="btn btn-ghost" onClick={() => onCancel?.()}>{cancelLabel}</button>
          <button type="button" className="btn confirm-confirm-btn" onClick={() => onConfirm?.()}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function ChoiceDialog({ open, title, message, itemLabel, description, options, onSelect, onCancel }) {
  useEffect(() => {
    if (!open) return undefined;
    function handleKeydown(event) {
      if (event.key === "Escape") onCancel?.();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="confirm-backdrop" onClick={() => onCancel?.()}>
      <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="choice-dialog-title" onClick={(event) => event.stopPropagation()}>
        <div className="confirm-kicker" style={{ color: "var(--navy-700)" }}>Format Unduhan</div>
        <h3 id="choice-dialog-title">{title || "Pilih Format"}</h3>
        {message && <p className="confirm-message">{message}</p>}
        {itemLabel && <div className="confirm-target">{itemLabel}</div>}
        {description && <p className="confirm-description">{description}</p>}
        <div className="choice-options">
          {(options || []).map((option) => (
            <button key={option.value} type="button" className="choice-option" onClick={() => onSelect?.(option.value)}>
              <span className="choice-option-label">{option.label}</span>
              {option.description && <span className="choice-option-desc">{option.description}</span>}
            </button>
          ))}
        </div>
        <div className="confirm-actions">
          <button type="button" className="btn btn-ghost" onClick={() => onCancel?.()}>Batal</button>
        </div>
      </div>
    </div>
  );
}

function LoadingBlock({ label = "Memuat data..." }) {
  return (
    <div className="card card-pad" style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ width: 42, height: 42, borderRadius: "50%", border: "3px solid var(--line)", borderTopColor: "var(--navy-600)", margin: "0 auto 14px", animation: "spin 1s linear infinite" }} />
      <div style={{ fontWeight: 700, color: "var(--ink)" }}>{label}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

Object.assign(window, {
  Avatar,
  SifatBadge,
  StatusBadge,
  RowActions,
  PageHead,
  Field,
  Dropzone,
  WaPreview,
  EmptyHint,
  Pagination,
  WaBanner,
  InlineNotice,
  ConfirmDialog,
  ChoiceDialog,
  LoadingBlock,
});
