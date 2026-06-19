(function () {
  const config = window.SUPABASE_CONFIG || {};
  const apiRoot = `${config.url}/rest/v1`;
  const sessionKey = config.sessionKey || "dilan-cerdas-session-v1";

  let bootPromise = null;
  let noticeTimer = null;
  let confirmResolver = null;

  const store = {
    ready: false,
    loading: false,
    error: null,
    notice: null,
    confirm: null,
    session: readSession(),
    formContext: null,
    data: emptyData(),
  };

  const listeners = new Set();

  function emptyData() {
    return {
      officeProfile: null,
      serviceTypes: [],
      accounts: [],
      employees: [],
      incomingLetters: [],
      outgoingLetters: [],
      complaints: [],
      surveyQuestions: [],
      surveySummary: { ikm: 0, mutu: "D", respondent_count: 0, latest_submission_at: null, period_label: quarterLabel() },
      surveyScores: [],
      publicCounts: { incoming: 0, outgoing: 0, complaints: 0 },
    };
  }

  function snapshot() {
    return {
      ready: store.ready,
      loading: store.loading,
      error: store.error,
      notice: store.notice,
      confirm: store.confirm ? { ...store.confirm } : null,
      session: store.session ? { ...store.session } : null,
      formContext: store.formContext ? { ...store.formContext } : null,
      data: {
        ...store.data,
        publicCounts: { ...store.data.publicCounts },
        serviceTypes: store.data.serviceTypes.slice(),
        accounts: store.data.accounts.slice(),
        employees: store.data.employees.slice(),
        incomingLetters: store.data.incomingLetters.slice(),
        outgoingLetters: store.data.outgoingLetters.slice(),
        complaints: store.data.complaints.slice(),
        surveyQuestions: store.data.surveyQuestions.slice(),
        surveyScores: store.data.surveyScores.slice(),
      },
    };
  }

  function emit() {
    const next = snapshot();
    listeners.forEach((listener) => listener(next));
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function useAppState() {
    const [state, setState] = useState(snapshot());
    useEffect(() => subscribe(setState), []);
    return state;
  }

  function readSession() {
    try {
      const raw = window.localStorage.getItem(sessionKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeSession(value) {
    if (value) window.localStorage.setItem(sessionKey, JSON.stringify(value));
    else window.localStorage.removeItem(sessionKey);
  }

  function setNotice(message, tone) {
    if (noticeTimer) window.clearTimeout(noticeTimer);
    store.notice = message ? { message, tone: tone || "ok" } : null;
    emit();
    if (message) {
      noticeTimer = window.setTimeout(() => {
        store.notice = null;
        emit();
      }, 4200);
    }
  }

  function requestConfirm(options) {
    if (confirmResolver) {
      confirmResolver(false);
      confirmResolver = null;
    }
    store.confirm = {
      title: options?.title || "Konfirmasi",
      message: options?.message || "Apakah Anda yakin ingin melanjutkan tindakan ini?",
      itemLabel: options?.itemLabel || "",
      description: options?.description || "",
      confirmLabel: options?.confirmLabel || "Yes",
      cancelLabel: options?.cancelLabel || "No",
      tone: options?.tone || "danger",
    };
    emit();
    return new Promise((resolve) => {
      confirmResolver = resolve;
    });
  }

  function settleConfirm(accepted) {
    store.confirm = null;
    emit();
    const resolve = confirmResolver;
    confirmResolver = null;
    resolve?.(Boolean(accepted));
  }

  function confirmDeletion(subjectLabel, itemLabel, description) {
    return requestConfirm({
      title: "Konfirmasi Hapus",
      message: `Apakah Anda ingin menghapus ${subjectLabel} ini?`,
      itemLabel: itemLabel || "-",
      description: description || "Data yang dihapus tidak dapat dikembalikan.",
      confirmLabel: "Yes",
      cancelLabel: "No",
      tone: "danger",
    });
  }

  async function request(path, options) {
    const response = await fetch(path, {
      method: options?.method || "GET",
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        ...options?.headers,
      },
      body: options?.body,
    });

    if (!response.ok) {
      let detail = "";
      try {
        const payload = await response.json();
        detail = payload?.message || payload?.error_description || payload?.hint || payload?.details || payload?.error || "";
      } catch (error) {
        detail = response.statusText || "Permintaan ke database gagal.";
      }
      throw new Error(detail || `Gagal memproses data (${response.status}).`);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  async function rpc(name, payload) {
    return request(`${apiRoot}/rpc/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
  }

  async function serverRequest(path, options) {
    const response = await fetch(path, {
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: options?.body,
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch (error) {
      payload = null;
    }

    if (!response.ok) {
      const detail = payload?.message || payload?.details?.notification?.errorMessage || response.statusText || "Permintaan ke server gagal.";
      throw new Error(detail || `Gagal memproses permintaan (${response.status}).`);
    }

    return payload;
  }

  function normalizeOfficeProfile(row) {
    if (!row) return null;
    return {
      ...row,
      legal_references: ensureArray(row.legal_references),
      goals: ensureArray(row.goals),
      mechanisms: ensureArray(row.mechanisms),
      impact_points: ensureObjectArray(row.impact_points),
      flow_steps: ensureObjectArray(row.flow_steps),
      internal_units: ensureArray(row.internal_units),
      village_units: ensureArray(row.village_units),
      complaint_categories: ensureArray(row.complaint_categories),
    };
  }

  function sortByDateDesc(rows, field) {
    return rows.slice().sort((left, right) => {
      const leftTime = new Date(left[field] || left.created_at || 0).getTime();
      const rightTime = new Date(right[field] || right.created_at || 0).getTime();
      if (leftTime !== rightTime) return rightTime - leftTime;
      const leftCreated = new Date(left.created_at || 0).getTime();
      const rightCreated = new Date(right.created_at || 0).getTime();
      if (leftCreated !== rightCreated) return rightCreated - leftCreated;
      return String(right.id || "").localeCompare(String(left.id || ""), "id-ID");
    });
  }

  function agendaOrdinal(index) {
    return String(index + 1).padStart(2, "0");
  }

  function decorateLetterCollection(rows) {
    const ordered = sortByDateDesc(rows, "created_at");
    const agendaMap = new Map(ordered.map((item, index) => [item.id, agendaOrdinal(index)]));
    return rows.map((item) => {
      const displayAgenda = agendaMap.get(item.id) || item.agenda_no || "-";
      return {
        ...item,
        agenda_db_no: item.agenda_no || "",
        agenda_display_no: displayAgenda,
        agenda_no: displayAgenda,
      };
    });
  }

  function decorateLetterRecord(kind, record) {
    if (!record) return null;
    const sourceRows = kind === "incoming" ? store.data.incomingLetters : store.data.outgoingLetters;
    const matched = decorateLetterCollection(sourceRows).find((item) => item.id === record.id);
    if (!matched) {
      return {
        ...record,
        agenda_db_no: record.agenda_no || "",
        agenda_display_no: record.agenda_no || "-",
      };
    }
    return {
      ...record,
      agenda_db_no: record.agenda_no || matched.agenda_db_no || "",
      agenda_display_no: matched.agenda_display_no || matched.agenda_no || "-",
      agenda_no: matched.agenda_no || record.agenda_no || "-",
    };
  }

  function scopeBySession(rows, session, kind) {
    if (!session || session.role === "Super Admin") return rows.slice();
    return rows.filter((row) => {
      const byVillage = session.scope_village && row.village_scope === session.scope_village;
      const bySource = row.source_name === session.unit_name || row.destination_name === session.unit_name || row.source_unit === session.unit_name;
      const byCreator = row.created_by_account_id === session.id;
      if (kind === "incoming") return byVillage || bySource || byCreator;
      if (kind === "outgoing") return byVillage || bySource || byCreator;
      return true;
    });
  }

  function assignPublicData(payload) {
    store.data.officeProfile = normalizeOfficeProfile(payload.officeProfile || null);
    store.data.serviceTypes = payload.serviceTypes || [];
    store.data.surveyQuestions = payload.surveyQuestions || [];
    store.data.surveySummary = payload.surveySummary || emptyData().surveySummary;
    store.data.surveyScores = payload.surveyScores || [];
    store.data.complaints = payload.complaints || [];
    store.data.publicCounts = payload.publicCounts || emptyData().publicCounts;
  }

  function assignPrivateData(payload) {
    store.data.accounts = payload.accounts || [];
    store.data.employees = payload.employees || [];
    store.data.incomingLetters = payload.incomingLetters || [];
    store.data.outgoingLetters = payload.outgoingLetters || [];
    if (payload.complaints) store.data.complaints = payload.complaints;
    if (payload.session) {
      store.session = {
        ...store.session,
        ...payload.session,
        token: store.session?.token,
      };
      writeSession(store.session);
    }
  }

  async function fetchPublicData() {
    return rpc("public_bootstrap");
  }

  async function fetchPrivateData() {
    if (!store.session?.token) return {};
    return rpc("private_bootstrap", { p_session_token: store.session.token });
  }

  async function bootstrap(force) {
    if (bootPromise && !force) return bootPromise;
    store.loading = true;
    store.error = null;
    emit();

    bootPromise = (async () => {
      try {
        const publicData = await fetchPublicData();
        assignPublicData(publicData || {});

        if (store.session?.token) {
          try {
            const privateData = await fetchPrivateData();
            assignPrivateData(privateData || {});
          } catch (error) {
            store.session = null;
            writeSession(null);
            store.data.accounts = [];
            store.data.employees = [];
            store.data.incomingLetters = [];
            store.data.outgoingLetters = [];
          }
        } else {
          store.data.accounts = [];
          store.data.employees = [];
          store.data.incomingLetters = [];
          store.data.outgoingLetters = [];
        }

        store.ready = true;
        store.loading = false;
        store.error = null;
        emit();
      } catch (error) {
        store.loading = false;
        store.error = error.message || "Tidak dapat memuat data aplikasi.";
        emit();
        throw error;
      } finally {
        bootPromise = null;
      }
    })();

    return bootPromise;
  }

  function sessionPayload(sessionData) {
    return {
      id: sessionData.id,
      full_name: sessionData.full_name,
      username: sessionData.username,
      email: sessionData.email,
      role: sessionData.role,
      unit_name: sessionData.unit_name,
      scope_village: sessionData.scope_village,
      is_active: sessionData.is_active,
      last_login_at: sessionData.last_login_at,
      token: sessionData.token,
    };
  }

  async function login(username, password) {
    const payload = await rpc("app_login", {
      p_username: String(username || "").trim(),
      p_password: String(password || ""),
    });
    if (!payload?.token) throw new Error("Username atau kata sandi tidak cocok.");
    store.session = sessionPayload(payload);
    writeSession(store.session);
    await bootstrap(true);
    setNotice(`Masuk sebagai ${payload.full_name}.`, "ok");
    return store.session;
  }

  async function logout() {
    const token = store.session?.token;
    store.session = null;
    store.formContext = null;
    writeSession(null);
    if (token) {
      try {
        await rpc("logout_session", { p_session_token: token });
      } catch (error) {
        /* ignore remote logout failure */
      }
    }
    emit();
    setNotice("Sesi login telah diakhiri.", "info");
  }

  function setFormContext(kind, recordId) {
    store.formContext = { kind, recordId };
    emit();
  }

  function clearFormContext() {
    store.formContext = null;
    emit();
  }

  function officeProfile() {
    return normalizeOfficeProfile(store.data.officeProfile);
  }

  function dashboardModel() {
    const incoming = scopeBySession(sortByDateDesc(decorateLetterCollection(store.data.incomingLetters), "created_at"), store.session, "incoming");
    const outgoing = scopeBySession(sortByDateDesc(decorateLetterCollection(store.data.outgoingLetters), "created_at"), store.session, "outgoing");
    const complaints = sortByDateDesc(store.data.complaints, "created_at");
    const byPriority = PRIORITY_OPTIONS.map((label) => ({
      label,
      count: incoming.filter((item) => item.priority === label).length,
      color: {
        Biasa: "var(--info)",
        Penting: "var(--warn)",
        Segera: "var(--hot)",
        Rahasia: "var(--purple)",
      }[label],
      cls: SIFAT[label] || "b-biasa",
    }));
    return {
      incoming,
      outgoing,
      complaints,
      recentIncoming: incoming.slice(0, 5),
      recentOutgoing: outgoing.slice(0, 5),
      stats: {
        incomingCount: incoming.length,
        outgoingCount: outgoing.length,
        pendingCount: incoming.filter((item) => item.status === "Baru" || item.status === "Diproses").length,
        complaintCount: complaints.length,
      },
      byPriority,
    };
  }

  function currentIdentity() {
    if (!store.session) return null;
    return store.data.accounts.find((item) => item.id === store.session.id) || store.session;
  }

  function serviceTypeName(record) {
    return record?.service_types?.name || store.data.serviceTypes.find((item) => item.id === record?.service_type_id)?.name || "-";
  }

  function resolveVillageScope(value) {
    const office = officeProfile();
    const villages = office?.village_units || [];
    const normalized = String(value || "").toLowerCase();
    return villages.find((item) => item.toLowerCase() === normalized) || null;
  }

  async function buildFilePayload(form) {
    if (form.file_object) {
      return {
        file_name: form.file_object.name,
        file_mime_type: form.file_object.type || "application/octet-stream",
        file_content_base64: await fileToBase64(form.file_object),
      };
    }
    if (form.remove_existing_file) {
      return {
        file_name: "",
        file_mime_type: "",
        file_content_base64: "",
      };
    }
    return {};
  }

  async function refreshAll() {
    await bootstrap(true);
  }

  async function saveOfficeProfile(form) {
    await rpc("save_office_profile", {
      p_session_token: store.session?.token,
      p_payload: {
        office_name: form.office_name,
        government_name: form.government_name,
        district_name: form.district_name,
        app_name: form.app_name,
        app_expansion: form.app_expansion,
        app_tagline: form.app_tagline,
        background_text: form.background_text,
        concept_text: form.concept_text,
        address: form.address,
        phone: form.phone,
        email: form.email,
        website: form.website || "-",
        whatsapp_notification: form.whatsapp_notification,
        head_name: form.head_name,
        head_nip: form.head_nip,
        head_title: form.head_title,
        head_rank: form.head_rank,
        service_hours: form.service_hours,
        legal_basis_established: form.legal_basis_established,
        legal_references: arrayFromLines(form.legal_references_text),
        goals: arrayFromLines(form.goals_text),
        mechanisms: arrayFromLines(form.mechanisms_text),
        internal_units: arrayFromLines(form.internal_units_text),
        village_units: arrayFromLines(form.village_units_text),
        complaint_categories: arrayFromLines(form.complaint_categories_text),
        logo_url: form.logo_url,
        org_pdf_url: form.org_pdf_url,
      },
    });
    await refreshAll();
    setNotice("Profil kantor berhasil diperbarui.", "ok");
  }

  async function saveEmployee(form) {
    await rpc("upsert_employee", {
      p_session_token: store.session?.token,
      p_payload: {
        id: form.id || null,
        full_name: form.full_name,
        nip: form.nip,
        position: form.position,
        grade: form.grade || "-",
        work_unit: form.work_unit,
        employment_status: form.employment_status,
      },
    });
    await refreshAll();
    setNotice(form.id ? "Data pegawai berhasil diperbarui." : "Pegawai baru berhasil ditambahkan.", "ok");
  }

  async function deleteEmployee(id) {
    await rpc("delete_employee", { p_session_token: store.session?.token, p_employee_id: id });
    await refreshAll();
    setNotice("Data pegawai berhasil dihapus.", "ok");
  }

  async function saveAccount(form) {
    await rpc("upsert_account", {
      p_session_token: store.session?.token,
      p_payload: {
        id: form.id || null,
        full_name: form.full_name,
        username: form.username,
        email: form.email,
        role: form.role,
        unit_name: form.unit_name,
        scope_village: form.scope_village || "",
        is_active: Boolean(form.is_active),
        password: form.password || "",
      },
    });
    await refreshAll();
    setNotice(form.id ? "Akun berhasil diperbarui." : "Akun baru berhasil ditambahkan.", "ok");
  }

  async function deleteAccount(id) {
    await rpc("delete_account", { p_session_token: store.session?.token, p_account_id: id });
    await refreshAll();
    setNotice("Akun berhasil dihapus.", "ok");
  }

  async function saveIncomingLetter(form) {
    const attachment = await buildFilePayload(form);
    const isNewRecord = !form.id;
    const record = await rpc("upsert_incoming_letter", {
      p_session_token: store.session?.token,
      p_payload: {
        id: form.id || null,
        letter_no: form.letter_no,
        letter_date: form.letter_date,
        service_type_id: form.service_type_id || "",
        subject: form.subject,
        source_name: form.source_name,
        target_unit: form.target_unit,
        priority: form.priority,
        status: form.status,
        village_scope: resolveVillageScope(form.source_name) || "",
        sender_phone: form.sender_phone || "",
        notify_whatsapp: Boolean(form.notify_whatsapp),
        notes: form.notes || "",
        ...attachment,
      },
    });
    let notificationResult = null;
    if (isNewRecord && Boolean(form.notify_whatsapp) && form.status !== "Draft" && record?.id) {
      try {
        notificationResult = await sendIncomingWhatsappNotification(record.id, { silent: true, rethrow: true });
      } catch (error) {
        notificationResult = { ok: false, message: error.message || "Notifikasi WhatsApp gagal dikirim." };
      }
    }
    clearFormContext();
    await refreshAll();
    if (!isNewRecord) {
      setNotice("Surat masuk berhasil diperbarui.", "ok");
      return { record, notificationResult };
    }
    if (notificationResult?.ok) {
      setNotice("Surat masuk berhasil disimpan dan notifikasi WhatsApp berhasil diteruskan ke gateway.", "ok");
      return { record, notificationResult };
    }
    if (notificationResult && notificationResult.ok === false) {
      setNotice(`Surat masuk berhasil disimpan, tetapi notifikasi WhatsApp gagal diproses. ${notificationResult.message}`, "warn");
      return { record, notificationResult };
    }
    setNotice("Surat masuk berhasil disimpan.", "ok");
    return { record, notificationResult };
  }

  async function saveOutgoingLetter(form) {
    const attachment = await buildFilePayload(form);
    await rpc("upsert_outgoing_letter", {
      p_session_token: store.session?.token,
      p_payload: {
        id: form.id || null,
        letter_no: form.letter_no,
        letter_date: form.letter_date,
        source_unit: form.source_unit,
        destination_name: form.destination_name,
        archive_classification: form.archive_classification || "",
        subject: form.subject,
        priority: form.priority,
        status: form.status,
        village_scope: resolveVillageScope(form.destination_name) || "",
        notify_whatsapp: Boolean(form.notify_whatsapp),
        notes: form.notes || "",
        ...attachment,
      },
    });
    clearFormContext();
    await refreshAll();
    setNotice(form.id ? "Surat keluar berhasil diperbarui." : "Surat keluar berhasil disimpan.", "ok");
  }

  async function deleteIncomingLetter(id) {
    await rpc("delete_incoming_letter", { p_session_token: store.session?.token, p_letter_id: id });
    await refreshAll();
    setNotice("Surat masuk berhasil dihapus.", "ok");
  }

  async function deleteOutgoingLetter(id) {
    await rpc("delete_outgoing_letter", { p_session_token: store.session?.token, p_letter_id: id });
    await refreshAll();
    setNotice("Surat keluar berhasil dihapus.", "ok");
  }

  async function saveComplaint(form, sourceChannel) {
    await rpc("create_complaint", {
      p_payload: {
        full_name: form.full_name,
        age: Number(form.age),
        phone: form.phone,
        address: form.address,
        category: form.category,
        message: form.message,
        source_channel: sourceChannel || "Publik",
      },
    });
    await refreshAll();
    setNotice("Pengaduan berhasil dikirim.", "ok");
  }

  async function updateComplaintStatus(id, status) {
    await rpc("update_complaint_status", {
      p_session_token: store.session?.token,
      p_complaint_id: id,
      p_status: status,
    });
    await refreshAll();
    setNotice("Status pengaduan berhasil diperbarui.", "ok");
  }

  async function submitSurvey(answers, sourceChannel, respondentName) {
    await rpc("submit_survey", {
      p_payload: {
        respondent_name: respondentName || "",
        source_channel: sourceChannel || "Publik",
        answers,
      },
    });
    await refreshAll();
    setNotice("Survei kepuasan berhasil dikirim.", "ok");
  }

  async function fetchIncomingLetter(id) {
    const record = await rpc("get_incoming_letter", { p_session_token: store.session?.token, p_letter_id: id });
    return decorateLetterRecord("incoming", record);
  }

  async function fetchOutgoingLetter(id) {
    const record = await rpc("get_outgoing_letter", { p_session_token: store.session?.token, p_letter_id: id });
    return decorateLetterRecord("outgoing", record);
  }

  function letterRecord(kind, id) {
    const collection = kind === "incoming"
      ? decorateLetterCollection(store.data.incomingLetters)
      : decorateLetterCollection(store.data.outgoingLetters);
    return collection.find((item) => item.id === id) || null;
  }

  function waMessageForLetter(kind, record) {
    const office = officeProfile();
    if (!record || !office) return "";
    if (kind === "incoming") {
      return [
        "📩 Update Surat Masuk",
        `No. Agenda: ${record.agenda_no || "-"}`,
        `Perihal: ${record.subject}`,
        `Status: ${record.status}`,
        `Unit Tujuan: ${record.target_unit}`,
        `WA Resmi Dokumen: ${office.whatsapp_notification}`,
      ].join("\n");
    }
    return [
      "📤 Update Surat Keluar",
      `No. Agenda: ${record.agenda_no || "-"}`,
      `Perihal: ${record.subject}`,
      `Status: ${record.status}`,
      `Tujuan: ${record.destination_name}`,
      `WA Resmi Dokumen: ${office.whatsapp_notification}`,
    ].join("\n");
  }

  function openWhatsapp(number, message) {
    const target = sanitizeWhatsappNumber(number);
    if (!target) return;
    window.open(`https://wa.me/${target}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  async function sendIncomingWhatsappNotification(letterId, options) {
    try {
      if (!store.session?.token) throw new Error("Sesi login tidak ditemukan.");
      const result = await serverRequest("/api/notifications/incoming-whatsapp", {
        method: "POST",
        body: JSON.stringify({
          sessionToken: store.session.token,
          letterId,
          force: Boolean(options?.force),
        }),
      });

      if (!options?.silent) {
        const tone = result?.status === "failed" ? "danger" : result?.status === "skipped" ? "warn" : (result?.alreadySent ? "info" : "ok");
        setNotice(result?.message || "Notifikasi WhatsApp berhasil diproses.", tone);
      }

      return result;
    } catch (error) {
      if (!options?.silent) setNotice(error.message || "Notifikasi WhatsApp gagal diproses.", "warn");
      if (options?.rethrow) throw error;
      return { ok: false, message: error.message || "Notifikasi WhatsApp gagal diproses." };
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildAttachmentPreview(record) {
    if (!record?.file_content_base64 || !record.file_mime_type) return "";
    const source = `data:${record.file_mime_type};base64,${record.file_content_base64}`;
    if (record.file_mime_type.includes("pdf")) {
      return `<iframe title="Dokumen" src="${source}" style="width:100%;min-height:620px;"></iframe>`;
    }
    if (record.file_mime_type.startsWith("image/")) {
      return `<img alt="Lampiran" src="${source}" />`;
    }
    return "";
  }

  function buildLetterSheet(kind, record) {
    const office = officeProfile();
    const label = kind === "incoming" ? "Surat Masuk" : "Surat Keluar";
    const meta = kind === "incoming"
      ? [
          ["No. Agenda", record.agenda_no],
          ["Nomor Surat", record.letter_no],
          ["Tanggal Surat", formatDateId(record.letter_date)],
          ["Jenis Layanan", serviceTypeName(record)],
          ["Asal Surat", record.source_name],
          ["Tujuan Surat", record.target_unit],
          ["Sifat", record.priority],
          ["Status", record.status],
          ["Nomor WA Pengirim", record.sender_phone || "-"],
        ]
      : [
          ["No. Agenda", record.agenda_no],
          ["Nomor Surat", record.letter_no],
          ["Tanggal Surat", formatDateId(record.letter_date)],
          ["Asal Surat", record.source_unit],
          ["Tujuan Surat", record.destination_name],
          ["Klasifikasi Arsip", record.archive_classification || "-"],
          ["Sifat", record.priority],
          ["Status", record.status],
        ];

    return `
      <div class="sheet">
        <div style="display:flex;justify-content:space-between;gap:24px;align-items:flex-start;">
          <div>
            <h1>${escapeHtml(label)}</h1>
            <p style="margin-top:10px;color:#475569;">${escapeHtml(office?.office_name || "DILAN CERDAS")} · ${escapeHtml(office?.government_name || "")}</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:12px;color:#64748b;">WhatsApp Notifikasi</div>
            <div style="font-weight:700;font-size:16px;">${escapeHtml(office?.whatsapp_notification || "-")}</div>
          </div>
        </div>
        <div class="meta">
          ${meta.map(([labelText, value]) => `<div class="label">${escapeHtml(labelText)}</div><div class="value">${escapeHtml(value || "-")}</div>`).join("")}
        </div>
        <div class="section">
          <h3 style="margin-bottom:10px;">Perihal</h3>
          <p>${escapeHtml(record.subject)}</p>
        </div>
        <div class="section">
          <h3 style="margin-bottom:10px;">Catatan</h3>
          <p>${escapeHtml(record.notes || "-")}</p>
        </div>
        ${record.file_name ? `<div class="section"><h3 style="margin-bottom:10px;">Lampiran</h3><p>${escapeHtml(record.file_name)}</p>${buildAttachmentPreview(record)}</div>` : ""}
        <div class="actions">
          <button onclick="window.print()">Cetak</button>
          <button class="ghost" onclick="window.close()">Tutup</button>
        </div>
      </div>
    `;
  }

  async function previewLetter(kind, id, printMode) {
    const title = `${kind === "incoming" ? "Surat Masuk" : "Surat Keluar"} ${id || ""}`;
    const popup = openWindowHtml(title, `
      <div class="sheet">
        <h1>Memuat dokumen...</h1>
        <p style="margin-top:12px;color:#475569;">Harap tunggu sebentar, data surat sedang disiapkan.</p>
      </div>
    `);
    if (!popup) {
      setNotice("Browser memblokir popup dokumen. Izinkan popup untuk situs ini lalu coba lagi.", "warn");
      return;
    }
    try {
      const record = kind === "incoming" ? await fetchIncomingLetter(id) : await fetchOutgoingLetter(id);
      if (!record) throw new Error("Dokumen tidak ditemukan.");
      const nextTitle = `${kind === "incoming" ? "Surat Masuk" : "Surat Keluar"} ${record.agenda_no || ""}`;
      const activePopup = openWindowHtml(nextTitle, buildLetterSheet(kind, record), popup);
      if (printMode && activePopup) window.setTimeout(() => activePopup.print(), 450);
    } catch (error) {
      if (popup && !popup.closed) {
        openWindowHtml(title, `
          <div class="sheet">
            <h1>Dokumen tidak dapat dimuat</h1>
            <p style="margin-top:12px;color:#475569;">${escapeHtml(error.message || "Terjadi kesalahan saat membuka dokumen.")}</p>
            <div class="actions">
              <button class="ghost" onclick="window.close()">Tutup</button>
            </div>
          </div>
        `, popup);
      }
      setNotice(error.message || "Gagal memuat dokumen.", "danger");
    }
  }

  async function downloadLetter(kind, id) {
    const record = kind === "incoming" ? await fetchIncomingLetter(id) : await fetchOutgoingLetter(id);
    if (!record) throw new Error("Dokumen tidak ditemukan.");
    if (record.file_content_base64 && record.file_name) {
      downloadBlob(record.file_name, base64ToBlob(record.file_content_base64, record.file_mime_type));
      setNotice(`Dokumen ${record.file_name} berhasil diunduh.`, "ok");
      return;
    }
    const fallbackName = `${kind === "incoming" ? "surat-masuk" : "surat-keluar"}-${record.agenda_no || "draft"}.html`;
    downloadBlob(fallbackName, new Blob([buildLetterSheet(kind, record)], { type: "text/html;charset=utf-8" }));
    setNotice("Ringkasan surat berhasil diunduh.", "ok");
  }

  function downloadDashboardReport() {
    const model = dashboardModel();
    exportCsv("dashboard-dilan-cerdas.csv", [
      ["Jenis", "Jumlah"],
      ["Surat Masuk", model.stats.incomingCount],
      ["Surat Keluar", model.stats.outgoingCount],
      ["Menunggu Diproses", model.stats.pendingCount],
      ["Pengaduan", model.stats.complaintCount],
      ["Nilai IKM", formatNumberId(store.data.surveySummary?.ikm || 0, 1)],
      ["Mutu", store.data.surveySummary?.mutu || "-"],
    ]);
    setNotice("Laporan dashboard berhasil diunduh.", "ok");
  }

  function exportLetters(kind) {
    const rows = kind === "incoming"
      ? scopeBySession(sortByDateDesc(decorateLetterCollection(store.data.incomingLetters), "created_at"), store.session, "incoming").map((item) => [
          item.agenda_no,
          item.letter_no,
          serviceTypeName(item),
          item.subject,
          item.source_name,
          item.target_unit,
          formatDateId(item.letter_date),
          item.priority,
          item.status,
        ])
      : scopeBySession(sortByDateDesc(decorateLetterCollection(store.data.outgoingLetters), "created_at"), store.session, "outgoing").map((item) => [
          item.agenda_no,
          item.letter_no,
          item.subject,
          item.source_unit,
          item.destination_name,
          formatDateId(item.letter_date),
          item.priority,
          item.status,
        ]);
    exportCsv(
      kind === "incoming" ? "rekap-surat-masuk.csv" : "rekap-surat-keluar.csv",
      [
        kind === "incoming"
          ? ["No. Agenda", "Nomor Surat", "Jenis Layanan", "Perihal", "Asal", "Tujuan", "Tanggal", "Sifat", "Status"]
          : ["No. Agenda", "Nomor Surat", "Perihal", "Asal", "Tujuan", "Tanggal", "Sifat", "Status"],
        ...rows,
      ]
    );
    setNotice(`Ekspor ${kind === "incoming" ? "surat masuk" : "surat keluar"} berhasil diunduh.`, "ok");
  }

  const selectors = {
    office: officeProfile,
    serviceTypes() {
      return store.data.serviceTypes.slice().sort((left, right) => left.sort_order - right.sort_order);
    },
    accounts() {
      return store.data.accounts.slice();
    },
    employees() {
      return store.data.employees.slice();
    },
    incomingLetters() {
      return scopeBySession(sortByDateDesc(decorateLetterCollection(store.data.incomingLetters), "created_at"), store.session, "incoming");
    },
    outgoingLetters() {
      return scopeBySession(sortByDateDesc(decorateLetterCollection(store.data.outgoingLetters), "created_at"), store.session, "outgoing");
    },
    complaints() {
      return sortByDateDesc(store.data.complaints, "created_at");
    },
    surveyQuestions() {
      return store.data.surveyQuestions.slice().sort((left, right) => left.sort_order - right.sort_order);
    },
    surveySummary() {
      return store.data.surveySummary || emptyData().surveySummary;
    },
    surveyScores() {
      return store.data.surveyScores.slice().sort((left, right) => left.sort_order - right.sort_order);
    },
    dashboard: dashboardModel,
    currentIdentity,
    publicCounts() {
      return { ...store.data.publicCounts };
    },
  };

  Object.assign(window, {
    useAppState,
    AppSelectors: selectors,
    AppApi: {
      bootstrap,
      refresh: () => bootstrap(true),
      login,
      logout,
      setFormContext,
      clearFormContext,
      saveOfficeProfile,
      saveEmployee,
      deleteEmployee,
      saveAccount,
      deleteAccount,
      saveIncomingLetter,
      saveOutgoingLetter,
      deleteIncomingLetter,
      deleteOutgoingLetter,
      saveComplaint,
      updateComplaintStatus,
      submitSurvey,
      previewLetter: (kind, id) => previewLetter(kind, id, false),
      printLetter: (kind, id) => previewLetter(kind, id, true),
      downloadLetter,
      downloadDashboardReport,
      exportLetters,
      requestConfirm,
      settleConfirm,
      confirmDeletion,
      openWhatsapp,
      sendIncomingWhatsappNotification,
      waMessageForLetter,
      letterRecord,
      fetchIncomingLetter,
      fetchOutgoingLetter,
      setNotice,
      getState: snapshot,
    },
  });
})();
