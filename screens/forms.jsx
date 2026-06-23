/* ============================================================
   Screens: Form Surat Masuk (Permohonan) & Form Surat Keluar
   ============================================================ */

function FormShell({ crumb, title, sub, back, go, children, side }) {
  return (
    <>
      <PageHead
        crumb={crumb}
        title={title}
        sub={sub}
        actions={
          <button type="button" className="btn btn-ghost" onClick={() => { AppApi.clearFormContext(); go(back); }}>
            <Icon name="arrowleft" size={15} />Kembali
          </button>
        }
      />
      <div className="form-grid">
        <div className="card card-pad">{children}</div>
        <div className="col gap-4">{side}</div>
      </div>
    </>
  );
}

function FormActions({ onSubmit, onSaveDraft, onPrint, onDelete, busy, canDelete }) {
  return (
    <div className="row gap-2 wrap" style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
      <button type="button" className="btn btn-primary" disabled={busy} onClick={onSubmit}><Icon name="send" size={15} />{busy ? "Menyimpan..." : "Kirim"}</button>
      <button type="button" className="btn btn-ghost" disabled={busy} onClick={onSaveDraft}><Icon name="doc" size={15} />Simpan Draft</button>
      <button type="button" className="btn btn-ghost" disabled={busy} onClick={onPrint}><Icon name="print" size={15} />Cetak</button>
      <div className="grow" />
      {canDelete && (
        <button type="button" className="btn btn-ghost" style={{ color: "var(--hot)" }} disabled={busy} onClick={onDelete}>
          <Icon name="trash" size={15} />Hapus
        </button>
      )}
    </div>
  );
}

const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };

function createIncomingForm(session, office) {
  return {
    id: "",
    agenda_no: "",
    service_type_id: "",
    letter_no: "",
    source_name: session?.role === "User" ? session.unit_name : "",
    target_unit: office?.internal_units?.[0] || "",
    letter_date: formatDateInput(new Date()),
    priority: "Penting",
    status: "Baru",
    sender_phone: "",
    subject: "",
    notes: "",
    notify_whatsapp: true,
    file_object: null,
    file_name: "",
    remove_existing_file: false,
  };
}

function createOutgoingForm(session, office) {
  return {
    id: "",
    agenda_no: "",
    letter_no: "",
    source_unit: session?.role === "User" ? session.unit_name : (office?.internal_units?.[0] || ""),
    destination_name: "",
    archive_classification: "",
    letter_date: formatDateInput(new Date()),
    priority: "Penting",
    status: "Terkirim",
    subject: "",
    notes: "",
    notify_whatsapp: true,
    file_object: null,
    file_name: "",
    remove_existing_file: false,
  };
}

function incomingRecordToForm(record) {
  return {
    id: record.id,
    agenda_no: record.agenda_no || "",
    service_type_id: record.service_type_id || "",
    letter_no: record.letter_no || "",
    source_name: record.source_name || "",
    target_unit: record.target_unit || "",
    letter_date: formatDateInput(record.letter_date),
    priority: record.priority || "Penting",
    status: record.status || "Baru",
    sender_phone: record.sender_phone || "",
    subject: record.subject || "",
    notes: record.notes || "",
    notify_whatsapp: Boolean(record.notify_whatsapp),
    file_object: null,
    file_name: record.file_name || "",
    remove_existing_file: false,
  };
}

function outgoingRecordToForm(record) {
  return {
    id: record.id,
    agenda_no: record.agenda_no || "",
    letter_no: record.letter_no || "",
    source_unit: record.source_unit || "",
    destination_name: record.destination_name || "",
    archive_classification: record.archive_classification || "",
    letter_date: formatDateInput(record.letter_date),
    priority: record.priority || "Penting",
    status: record.status || "Terkirim",
    subject: record.subject || "",
    notes: record.notes || "",
    notify_whatsapp: Boolean(record.notify_whatsapp),
    file_object: null,
    file_name: record.file_name || "",
    remove_existing_file: false,
  };
}

function FormSuratMasuk({ go }) {
  const state = useAppState();
  const session = state.session;
  const office = AppSelectors.office();
  const services = AppSelectors.serviceTypes();
  const allIncoming = AppSelectors.incomingLetters();
  const context = state.formContext;
  const editingRecordId = context?.kind === "incoming" ? context.recordId || "" : "";
  const editingRecord = editingRecordId ? AppApi.letterRecord("incoming", editingRecordId) : null;
  const [form, setForm] = useState(() => createIncomingForm(session, office));
  const [busy, setBusy] = useState(false);
  const isVillageUser = session?.role === "User";
  const officeSyncKey = state.data.officeProfile?.updated_at || state.data.officeProfile?.office_name || "";

  useEffect(() => {
    if (!office) return;
    if (editingRecordId) {
      const record = AppApi.letterRecord("incoming", editingRecordId);
      if (record) setForm(incomingRecordToForm(record));
      return;
    }
    setForm(createIncomingForm(session, office));
  }, [editingRecordId, officeSyncKey, session?.id]);

  if (!office) return <LoadingBlock label="Memuat form surat masuk..." />;

  function patch(next) {
    setForm((value) => ({ ...value, ...next }));
  }

  async function submitWithStatus(status) {
    setBusy(true);
    try {
      await AppApi.saveIncomingLetter({ ...form, status });
      go("rekap-masuk");
    } catch (error) {
      AppApi.setNotice(error.message || "Gagal menyimpan surat masuk.", "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormShell
      go={go}
      back="rekap-masuk"
      crumb={["Persuratan", "Surat Masuk", editingRecord ? "Edit" : "Form"]}
      title={editingRecord ? "Edit Surat Masuk" : "Surat Permohonan / Surat Masuk"}
      sub="Catat surat masuk beserta lampiran dan disposisinya"
      side={
        <>
          <WaPreview lines={[
            <b key="title">📩 Surat Masuk</b>,
            <span key="agenda">No. Agenda: <b>{form.agenda_no || "Isi manual"}</b></span>,
            <span key="subject">Perihal: {form.subject || "-"}</span>,
            <span key="meta">Sifat: <b>{form.priority}</b> · {formatDateId(form.letter_date)}</span>,
            <span key="wa">WA resmi dokumen: <b>{office.whatsapp_notification}</b></span>,
            <span key="dest" style={{ color: "var(--muted)" }}>Disposisi tujuan: {form.target_unit || "-"}</span>,
          ]} />
          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Petunjuk Pengisian</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.85 }}>
              <li>Nomor agenda surat masuk diisi manual sebagai nomor urut tanpa huruf atau prefix, misalnya 0155.</li>
              <li>Operator desa hanya dapat mencatat surat dari unit desanya sendiri agar alur lebih konsisten.</li>
              <li>Notifikasi WhatsApp otomatis hanya dikirim untuk surat masuk baru yang langsung disimpan, bukan draft atau edit data lama.</li>
              <li>Unduh dan cetak akan aktif penuh setelah surat tersimpan.</li>
            </ul>
          </div>
        </>
      }
    >
      <div className="eyebrow" style={{ marginBottom: 18 }}>Detail Surat</div>
      <div style={grid2}>
        <Field label="Nomor Agenda" req hint="Isi manual nomor urut tanpa huruf atau prefix.">
          <input
            className="input tabnum"
            value={form.agenda_no}
            onChange={(event) => patch({ agenda_no: event.target.value })}
            placeholder="Contoh: 0155"
            inputMode="numeric"
          />
        </Field>
        <Field label="Jenis Layanan" req>
          <select className="select" value={form.service_type_id} onChange={(event) => patch({ service_type_id: event.target.value })}>
            <option value="">Pilih layanan</option>
            {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
          </select>
        </Field>
        <Field label="Nomor Surat" req>
          <input className="input tabnum" value={form.letter_no} onChange={(event) => patch({ letter_no: event.target.value })} />
        </Field>
        <Field label="Asal Surat" req>
          <input className="input" value={form.source_name} onChange={(event) => patch({ source_name: event.target.value })} disabled={isVillageUser} placeholder="Instansi / pengirim" />
        </Field>
        <Field label="Tujuan Surat" req>
          <select className="select" value={form.target_unit} onChange={(event) => patch({ target_unit: event.target.value })}>
            {office.internal_units.map((unit) => <option key={unit}>{unit}</option>)}
          </select>
        </Field>
        <Field label="Tanggal Surat" req>
          <input className="input tabnum" type="date" value={form.letter_date} onChange={(event) => patch({ letter_date: event.target.value })} />
        </Field>
        <Field label="Sifat Surat" req>
          <select className="select" value={form.priority} onChange={(event) => patch({ priority: event.target.value })}>
            {PRIORITY_OPTIONS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Status Surat" req>
          <select className="select" value={form.status} onChange={(event) => patch({ status: event.target.value })}>
            {INCOMING_STATUS_OPTIONS.filter((item) => item !== "Draft").map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Nomor WhatsApp Pengirim">
          <input className="input tabnum" value={form.sender_phone} onChange={(event) => patch({ sender_phone: event.target.value })} placeholder="08xx-xxxx-xxxx" />
        </Field>
        <Field label="Perihal Surat" req full>
          <textarea className="textarea" value={form.subject} onChange={(event) => patch({ subject: event.target.value })} />
        </Field>
        <Field label="Catatan Internal" full>
          <textarea className="textarea" value={form.notes} onChange={(event) => patch({ notes: event.target.value })} placeholder="Catatan verifikasi, disposisi, atau tindak lanjut." />
        </Field>
        <Field label="Dokumen Surat" full hint="Lampirkan PDF / JPG / PNG. File akan tersimpan di Supabase database.">
          <Dropzone
            file={form.file_object || form.file_name}
            onFileChange={(file) => patch({ file_object: file, file_name: file.name, remove_existing_file: false })}
            onRemove={() => patch({ file_object: null, file_name: "", remove_existing_file: true })}
          />
        </Field>
      </div>
      <WaBanner
        label="Kirim notifikasi WhatsApp"
        hint={`Ringkasan surat masuk baru dikirim otomatis ke ${office.whatsapp_notification}. Draft dan edit data lama tidak mengirim ulang.`}
        on={form.notify_whatsapp}
        onChange={(value) => patch({ notify_whatsapp: value })}
      />
      <FormActions
        busy={busy}
        canDelete={Boolean(form.id)}
        onSubmit={() => submitWithStatus(form.status || "Baru")}
        onSaveDraft={() => submitWithStatus("Draft")}
        onPrint={() => {
          if (form.id) AppApi.printLetter("incoming", form.id);
          else AppApi.setNotice("Simpan surat masuk terlebih dahulu sebelum dicetak.", "warn");
        }}
        onDelete={async () => {
          if (!form.id) return;
          const confirmed = await AppApi.confirmDeletion("surat masuk", `${form.agenda_no || "-"} · ${form.subject || form.letter_no || "-"}`, `Nomor surat: ${form.letter_no || "-"}`);
          if (!confirmed) return;
          setBusy(true);
          AppApi.deleteIncomingLetter(form.id).then(() => go("rekap-masuk")).finally(() => setBusy(false));
        }}
      />
      {!allIncoming.length && <div style={{ marginTop: 18 }}><InlineNotice tone="info">Database surat masuk masih kosong. Surat pertama yang Anda simpan akan langsung menjadi sumber data utama rekap dan dashboard.</InlineNotice></div>}
    </FormShell>
  );
}

function FormSuratKeluar({ go }) {
  const state = useAppState();
  const session = state.session;
  const office = AppSelectors.office();
  const context = state.formContext;
  const editingRecordId = context?.kind === "outgoing" ? context.recordId || "" : "";
  const editingRecord = editingRecordId ? AppApi.letterRecord("outgoing", editingRecordId) : null;
  const [form, setForm] = useState(() => createOutgoingForm(session, office));
  const [busy, setBusy] = useState(false);
  const isVillageUser = session?.role === "User";
  const officeSyncKey = state.data.officeProfile?.updated_at || state.data.officeProfile?.office_name || "";

  useEffect(() => {
    if (!office) return;
    if (editingRecordId) {
      const record = AppApi.letterRecord("outgoing", editingRecordId);
      if (record) setForm(outgoingRecordToForm(record));
      return;
    }
    setForm(createOutgoingForm(session, office));
  }, [editingRecordId, officeSyncKey, session?.id]);

  if (!office) return <LoadingBlock label="Memuat form surat keluar..." />;

  function patch(next) {
    setForm((value) => ({ ...value, ...next }));
  }

  async function submitWithStatus(status) {
    setBusy(true);
    try {
      await AppApi.saveOutgoingLetter({ ...form, status });
      go("rekap-keluar");
    } catch (error) {
      AppApi.setNotice(error.message || "Gagal menyimpan surat keluar.", "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormShell
      go={go}
      back="rekap-keluar"
      crumb={["Persuratan", "Surat Keluar", editingRecord ? "Edit" : "Form"]}
      title={editingRecord ? "Edit Surat Keluar" : "Buat Surat Keluar"}
      sub="Susun dan terbitkan surat keluar instansi"
      side={
        <>
          <WaPreview lines={[
            <b key="title">📤 Surat Keluar</b>,
            <span key="agenda">No. Agenda: <b>{form.agenda_no || "Isi manual"}</b></span>,
            <span key="dest">Tujuan: {form.destination_name || "-"}</span>,
            <span key="meta">Sifat: <b>{form.priority}</b> · {formatDateId(form.letter_date)}</span>,
            <span key="wa">WA resmi dokumen: <b>{office.whatsapp_notification}</b></span>,
          ]} />
          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Nomor Agenda Manual</div>
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.75, margin: 0 }}>
              Isi nomor agenda surat keluar manual sebagai nomor urut tanpa huruf atau prefix, misalnya 0233.
            </p>
          </div>
        </>
      }
    >
      <div className="eyebrow" style={{ marginBottom: 18 }}>Detail Surat</div>
      <div style={grid2}>
        <Field label="Nomor Agenda" req hint="Isi manual nomor urut tanpa huruf atau prefix.">
          <input
            className="input tabnum"
            value={form.agenda_no}
            onChange={(event) => patch({ agenda_no: event.target.value })}
            placeholder="Contoh: 0233"
            inputMode="numeric"
          />
        </Field>
        <Field label="Asal Surat (Unit)" req>
          {isVillageUser ? (
            <input className="input" value={form.source_unit} readOnly />
          ) : (
            <select className="select" value={form.source_unit} onChange={(event) => patch({ source_unit: event.target.value })}>
              {office.internal_units.map((unit) => <option key={unit}>{unit}</option>)}
            </select>
          )}
        </Field>
        <Field label="Tujuan Surat" req>
          <input className="input" value={form.destination_name} onChange={(event) => patch({ destination_name: event.target.value })} placeholder="Instansi / penerima" />
        </Field>
        <Field label="Nomor Surat" req>
          <input className="input tabnum" value={form.letter_no} onChange={(event) => patch({ letter_no: event.target.value })} />
        </Field>
        <Field label="Tanggal Surat" req>
          <input className="input tabnum" type="date" value={form.letter_date} onChange={(event) => patch({ letter_date: event.target.value })} />
        </Field>
        <Field label="Sifat Surat" req>
          <select className="select" value={form.priority} onChange={(event) => patch({ priority: event.target.value })}>
            {PRIORITY_OPTIONS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Status Surat" req>
          <select className="select" value={form.status} onChange={(event) => patch({ status: event.target.value })}>
            {OUTGOING_STATUS_OPTIONS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Klasifikasi Arsip">
          <input className="input" value={form.archive_classification} onChange={(event) => patch({ archive_classification: event.target.value })} placeholder="Contoh: 005 - Undangan" />
        </Field>
        <Field label="Perihal Surat" req full>
          <textarea className="textarea" value={form.subject} onChange={(event) => patch({ subject: event.target.value })} />
        </Field>
        <Field label="Catatan Internal" full>
          <textarea className="textarea" value={form.notes} onChange={(event) => patch({ notes: event.target.value })} placeholder="Catatan distribusi, paraf, atau tindak lanjut." />
        </Field>
        <Field label="Dokumen Surat" full hint="Unggah naskah final. File akan tersimpan di Supabase database.">
          <Dropzone
            file={form.file_object || form.file_name}
            onFileChange={(file) => patch({ file_object: file, file_name: file.name, remove_existing_file: false })}
            onRemove={() => patch({ file_object: null, file_name: "", remove_existing_file: true })}
          />
        </Field>
      </div>
      <WaBanner
        label="Kirim notifikasi WhatsApp"
        hint={`Pemberitahuan surat terbit diteruskan melalui WA resmi ${office.whatsapp_notification}.`}
        on={form.notify_whatsapp}
        onChange={(value) => patch({ notify_whatsapp: value })}
      />
      <FormActions
        busy={busy}
        canDelete={Boolean(form.id)}
        onSubmit={() => submitWithStatus(form.status || "Terkirim")}
        onSaveDraft={() => submitWithStatus("Draft")}
        onPrint={() => {
          if (form.id) AppApi.printLetter("outgoing", form.id);
          else AppApi.setNotice("Simpan surat keluar terlebih dahulu sebelum dicetak.", "warn");
        }}
        onDelete={async () => {
          if (!form.id) return;
          const confirmed = await AppApi.confirmDeletion("surat keluar", `${form.agenda_no || "-"} · ${form.subject || form.letter_no || "-"}`, `Nomor surat: ${form.letter_no || "-"}`);
          if (!confirmed) return;
          setBusy(true);
          AppApi.deleteOutgoingLetter(form.id).then(() => go("rekap-keluar")).finally(() => setBusy(false));
        }}
      />
    </FormShell>
  );
}

Object.assign(window, { FormSuratMasuk, FormSuratKeluar });
