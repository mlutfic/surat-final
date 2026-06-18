/* ============================================================
   Screens: Layanan Pengaduan & Survei Kepuasan Masyarakat
   ============================================================ */

function ComplaintCardItem({ item, canManage }) {
  return (
    <div style={{ paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid var(--line-soft)" }}>
      <div className="row between center" style={{ marginBottom: 6 }}>
        <div className="row gap-2 center">
          <Avatar name={item.full_name} size={28} />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>{item.full_name}</span>
        </div>
        {canManage ? (
          <select className="select" style={{ width: 150, minWidth: 150, fontSize: 12 }} value={item.status} onChange={(event) => AppApi.updateComplaintStatus(item.id, event.target.value)}>
            {COMPLAINT_STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
          </select>
        ) : (
          <StatusBadge s={item.status} />
        )}
      </div>
      <div className="muted" style={{ fontSize: 11.5, marginBottom: 6 }}>{item.category} · {formatDateId(item.created_at)}</div>
      <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>{item.message}</p>
    </div>
  );
}

function LayananPengaduan() {
  const state = useAppState();
  const office = AppSelectors.office();
  const complaints = AppSelectors.complaints();
  const session = state.session;
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    phone: "",
    address: "",
    category: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (office?.complaint_categories?.length && !form.category) {
      setForm((value) => ({ ...value, category: office.complaint_categories[0] }));
    }
  }, [office?.complaint_categories?.length]);

  if (!office) return <LoadingBlock label="Memuat layanan pengaduan..." />;

  async function submit() {
    setBusy(true);
    try {
      await AppApi.saveComplaint(form, session ? "Operator" : "Publik");
      setForm({
        full_name: "",
        age: "",
        phone: "",
        address: "",
        category: office.complaint_categories[0] || "",
        message: "",
      });
    } catch (error) {
      AppApi.setNotice(error.message || "Gagal mengirim pengaduan.", "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHead
        crumb={["Layanan Publik", "Pengaduan"]}
        title="Layanan Pengaduan"
        sub="Sampaikan saran, kritik, atau masukan untuk perbaikan pelayanan"
      />
      <div className="form-grid">
        <div className="card card-pad">
          <div className="eyebrow" style={{ marginBottom: 18 }}>Formulir Pengaduan</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Nama Lengkap" req>
              <input className="input" value={form.full_name} onChange={(event) => setForm((value) => ({ ...value, full_name: event.target.value }))} placeholder="Nama Anda" />
            </Field>
            <Field label="Umur" req>
              <input className="input tabnum" type="number" value={form.age} onChange={(event) => setForm((value) => ({ ...value, age: event.target.value }))} placeholder="Contoh: 35" />
            </Field>
            <Field label="Nomor Handphone" req hint="Untuk konfirmasi tindak lanjut via WhatsApp.">
              <input className="input tabnum" value={form.phone} onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))} placeholder="08xx-xxxx-xxxx" />
            </Field>
            <Field label="Kategori Aduan" req>
              <select className="select" value={form.category} onChange={(event) => setForm((value) => ({ ...value, category: event.target.value }))}>
                {(office.complaint_categories || []).map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Alamat Rumah" req full>
              <input className="input" value={form.address} onChange={(event) => setForm((value) => ({ ...value, address: event.target.value }))} placeholder="Alamat domisili" />
            </Field>
            <Field label="Saran / Kritik / Masukan" req full hint="Sampaikan secara jelas dan santun.">
              <textarea className="textarea" style={{ minHeight: 130 }} value={form.message} onChange={(event) => setForm((value) => ({ ...value, message: event.target.value }))} placeholder="Tuliskan saran, kritik, atau masukan Anda…" />
            </Field>
          </div>
          <div className="row gap-2" style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
            <button type="button" className="btn btn-primary" disabled={busy} onClick={submit}><Icon name="send" size={15} />{busy ? "Mengirim..." : "Kirim Pengaduan"}</button>
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => setForm({ full_name: "", age: "", phone: "", address: "", category: office.complaint_categories[0] || "", message: "" })}>Bersihkan</button>
          </div>
        </div>

        <div className="col gap-4">
          <div className="card card-pad" style={{ background: "var(--navy-50)", borderColor: "var(--navy-100)" }}>
            <div className="row gap-3 center" style={{ marginBottom: 10 }}>
              <span style={{ color: "var(--navy-600)" }}><Icon name="shield" size={20} /></span>
              <h3 style={{ fontSize: 15 }}>Privasi Terjaga</h3>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.75 }}>
              Data pribadi digunakan hanya untuk menindaklanjuti pengaduan. Status tindak lanjut dapat diperbarui langsung oleh kantor camat dari layar yang sama.
            </p>
          </div>

          <div className="card card-pad">
            <div className="sec-head" style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 15 }}>Pengaduan Terbaru</h3>
              <span className="badge b-penting">{complaints.filter((item) => item.status === "Baru").length} baru</span>
            </div>
            <div className="col" style={{ gap: 0 }}>
              {complaints.slice(0, 8).map((item, index) => (
                <div key={item.id} style={{ borderBottom: index < Math.min(complaints.length, 8) - 1 ? "1px solid var(--line-soft)" : "none" }}>
                  <ComplaintCardItem item={item} canManage={session?.role === "Super Admin"} />
                </div>
              ))}
              {complaints.length === 0 && <EmptyHint icon="megaphone">Belum ada pengaduan yang masuk.</EmptyHint>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SurveiKepuasan() {
  const questions = AppSelectors.surveyQuestions();
  const summary = AppSelectors.surveySummary();
  const scores = AppSelectors.surveyScores();
  const [answers, setAnswers] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setAnswers(Array(questions.length).fill(-1));
  }, [questions.length]);

  function pick(questionIndex, optionIndex) {
    setAnswers((current) => {
      const next = current.slice();
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  const answered = answers.filter((value) => value >= 0).length;
  const progress = questions.length ? Math.round((answered / questions.length) * 100) : 0;

  async function submit() {
    setBusy(true);
    try {
      await AppApi.submitSurvey(
        questions.map((question, index) => ({
          question_id: question.id,
          score: answers[index] + 1,
        })),
        "Operator"
      );
      setAnswers(Array(questions.length).fill(-1));
    } catch (error) {
      AppApi.setNotice(error.message || "Gagal mengirim survei.", "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHead
        crumb={["Layanan Publik", "Survei Kepuasan"]}
        title="Survei Kepuasan Masyarakat"
        sub="Penilaian mutu pelayanan berdasarkan unsur Indeks Kepuasan Masyarakat (IKM)"
      />
      <div className="form-grid">
        <div className="card card-pad">
          <div className="row between center" style={{ marginBottom: 10 }}>
            <div className="eyebrow">Kuesioner Penilaian</div>
            <span className="muted" style={{ fontSize: 12 }}>{answered} / {questions.length} unsur</span>
          </div>
          <div className="progress-track" style={{ marginBottom: 26 }}>
            <div className="progress-fill" style={{ width: progress + "%" }} />
          </div>
          <div className="col gap-5">
            {questions.map((question, index) => (
              <div key={question.id}>
                <div className="row gap-3 center" style={{ marginBottom: 11 }}>
                  <span className="tabnum" style={{ width: 26, height: 26, borderRadius: 8, background: answers[index] >= 0 ? "var(--ok-bg)" : "var(--navy-100)", color: answers[index] >= 0 ? "var(--ok)" : "var(--navy-700)", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{index + 1}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{question.question_text}</span>
                </div>
                <div className="likert">
                  {[
                    ["😞", "Tidak Baik"],
                    ["😐", "Kurang Baik"],
                    ["🙂", "Baik"],
                    ["😄", "Sangat Baik"],
                  ].map((option, optionIndex) => (
                    <button type="button" key={optionIndex} className={"likert-opt " + (answers[index] === optionIndex ? "on" : "")} onClick={() => pick(index, optionIndex)}>
                      <div className="le">{option[0]}</div>
                      <div className="ll">{option[1]}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="row gap-2" style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
            <button type="button" className="btn btn-primary" disabled={answered < questions.length || busy} onClick={submit}>
              <Icon name="check" size={15} />{busy ? "Mengirim..." : "Kirim Penilaian"}
            </button>
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => setAnswers(Array(questions.length).fill(-1))}>
              Reset
            </button>
          </div>
        </div>

        <div className="col gap-4">
          <div className="card card-pad" style={{ background: "var(--navy-900)", color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: "50%", background: "oklch(0.62 0.12 75 / 0.20)" }} />
            <div style={{ position: "absolute", left: -20, bottom: -20, width: 90, height: 90, borderRadius: "50%", background: "oklch(0.40 0.09 245 / 0.15)" }} />
            <div className="eyebrow" style={{ color: "var(--gold-400)", position: "relative" }}>Hasil IKM {summary.period_label || quarterLabel(summary.latest_submission_at)}</div>
            <div className="row center gap-4" style={{ marginTop: 16, position: "relative" }}>
              <div>
                <div className="tabnum" style={{ fontSize: 50, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
                  {formatNumberId(summary.ikm || 0, 1).replace(".", ",")}
                </div>
                <div style={{ fontSize: 12, color: "oklch(0.72 0.03 256)", marginTop: 4 }}>
                  {(summary.respondent_count || 0).toLocaleString("id-ID")} responden
                </div>
              </div>
              <div className="col gap-2" style={{ alignItems: "flex-start" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--gold-500)", color: "var(--navy-900)", display: "grid", placeItems: "center", fontSize: 26, fontWeight: 800 }}>
                  {summary.mutu || "-"}
                </div>
                <span className="badge b-ok" style={{ fontSize: 11 }}>Mutu Pelayanan</span>
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 16 }}>Skor per Unsur</div>
            {scores.map((score) => (
              <div key={score.id} style={{ marginBottom: 13 }}>
                <div className="row between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--ink-soft)", maxWidth: 180, lineHeight: 1.4 }}>{score.question_text}</span>
                  <span className="tabnum" style={{ fontSize: 12, fontWeight: 700, color: "var(--navy-700)", flexShrink: 0, marginLeft: 8 }}>
                    {formatNumberId(score.avg_score || 0, 2).replace(".", ",")}
                  </span>
                </div>
                <div className="progress-track">
                  <div style={{ height: "100%", width: `${((score.avg_score || 0) / 4) * 100}%`, background: "var(--navy-600)", borderRadius: 100 }} />
                </div>
              </div>
            ))}
            {!scores.length && <EmptyHint icon="survey">Belum ada skor survei yang tersimpan.</EmptyHint>}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { LayananPengaduan, SurveiKepuasan });
