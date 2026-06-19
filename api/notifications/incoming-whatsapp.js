const SUPABASE_URL = (process.env.SUPABASE_URL || "https://edduykzmwjbfdvxemfae.supabase.co").replace(/\/+$/, "");
const SUPABASE_API_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "sb_publishable_u6U_U4CsHUn26oNB5-PVZg_G8b3mFbl";
const WHATSAPP_PROVIDER = String(process.env.WHATSAPP_PROVIDER || "fonnte").trim().toLowerCase();

class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details || null;
  }
}

class ProviderError extends Error {
  constructor(message, providerResponse, statusCode) {
    super(message);
    this.name = "ProviderError";
    this.providerResponse = providerResponse || null;
    this.statusCode = statusCode || 502;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end(JSON.stringify({ ok: false, message: "Method tidak diizinkan." }));
    return;
  }

  try {
    ensureServerConfig();

    const body = await readJsonBody(req);
    const sessionToken = String(body?.sessionToken || "").trim();
    const letterId = String(body?.letterId || "").trim();
    const force = Boolean(body?.force);

    if (!sessionToken) throw new HttpError(401, "Sesi aplikasi tidak ditemukan.");
    if (!letterId) throw new HttpError(400, "ID surat masuk wajib dikirim.");

    const actor = await requireSession(sessionToken);
    const letter = await getIncomingLetter(sessionToken, letterId);
    const office = await getOfficeProfile();
    const targetNumber = normalizeWhatsappNumber(office?.whatsapp_notification);
    const provider = WHATSAPP_PROVIDER;
    const existingLog = await getNotificationLog(letter.id);
    const requestContext = {
      agenda_no: letter.agenda_no || "",
      letter_no: letter.letter_no || "",
      letter_date: letter.letter_date || "",
      source_name: letter.source_name || "",
      target_unit: letter.target_unit || "",
      subject: letter.subject || "",
      force,
    };

    if (!letter.notify_whatsapp) {
      const log = await saveNotificationLog({
        event_type: "incoming_created",
        incoming_letter_id: letter.id,
        notification_channel: "whatsapp",
        target_number: targetNumber || "",
        provider,
        status: "skipped",
        attempt_count: existingLog?.attempt_count || 0,
        provider_message_id: null,
        provider_request_id: null,
        error_message: "Notifikasi WhatsApp dimatikan pada data surat.",
        provider_response: existingLog?.provider_response || null,
        request_context: requestContext,
        requested_by_account_id: actor.account_id,
      });
      respond(res, 200, {
        ok: true,
        status: "skipped",
        message: "Notifikasi WhatsApp dimatikan pada surat ini.",
        notification: summarizeLog(log),
      });
      return;
    }

    if (letter.status === "Draft") {
      const log = await saveNotificationLog({
        event_type: "incoming_created",
        incoming_letter_id: letter.id,
        notification_channel: "whatsapp",
        target_number: targetNumber || "",
        provider,
        status: "skipped",
        attempt_count: existingLog?.attempt_count || 0,
        provider_message_id: null,
        provider_request_id: null,
        error_message: "Draft tidak mengirim notifikasi WhatsApp.",
        provider_response: existingLog?.provider_response || null,
        request_context: requestContext,
        requested_by_account_id: actor.account_id,
      });
      respond(res, 200, {
        ok: true,
        status: "skipped",
        message: "Draft tidak mengirim notifikasi WhatsApp.",
        notification: summarizeLog(log),
      });
      return;
    }

    if (!targetNumber) {
      const log = await saveNotificationLog({
        event_type: "incoming_created",
        incoming_letter_id: letter.id,
        notification_channel: "whatsapp",
        target_number: "",
        provider,
        status: "failed",
        attempt_count: (existingLog?.attempt_count || 0) + 1,
        provider_message_id: null,
        provider_request_id: null,
        last_attempt_at: nowIso(),
        error_message: "Nomor WhatsApp resmi kantor belum diatur atau tidak valid.",
        provider_response: existingLog?.provider_response || null,
        request_context: requestContext,
        requested_by_account_id: actor.account_id,
      });
      throw new HttpError(422, "Nomor WhatsApp resmi kantor belum diatur atau tidak valid.", {
        notification: summarizeLog(log),
      });
    }

    if (existingLog && existingLog.status === "queued" && !force) {
      respond(res, 200, {
        ok: true,
        status: "queued",
        alreadySent: true,
        message: "Notifikasi WhatsApp untuk surat ini sudah pernah diteruskan ke gateway.",
        notification: summarizeLog(existingLog),
      });
      return;
    }

    const attemptCount = (existingLog?.attempt_count || 0) + 1;
    const queuedAt = nowIso();
    await saveNotificationLog({
      event_type: "incoming_created",
      incoming_letter_id: letter.id,
      notification_channel: "whatsapp",
      target_number: targetNumber,
      provider,
      status: "pending",
      attempt_count: attemptCount,
      provider_message_id: null,
      provider_request_id: null,
      last_attempt_at: queuedAt,
      queued_at: existingLog?.queued_at || queuedAt,
      error_message: null,
      provider_response: null,
      request_context: requestContext,
      requested_by_account_id: actor.account_id,
    });

    const message = buildIncomingWhatsappMessage(letter, office);

    try {
      const delivery = await sendWhatsappMessage({
        provider,
        targetNumber,
        message,
        office,
        letter,
      });

      const log = await saveNotificationLog({
        event_type: "incoming_created",
        incoming_letter_id: letter.id,
        notification_channel: "whatsapp",
        target_number: targetNumber,
        provider,
        status: delivery.status,
        attempt_count: attemptCount,
        provider_message_id: delivery.providerMessageId || null,
        provider_request_id: delivery.providerRequestId || null,
        error_message: null,
        provider_response: delivery.providerResponse || null,
        request_context: requestContext,
        requested_by_account_id: actor.account_id,
        queued_at: queuedAt,
        last_attempt_at: nowIso(),
      });

      respond(res, 200, {
        ok: true,
        status: delivery.status,
        message: "Notifikasi WhatsApp berhasil diteruskan ke gateway.",
        notification: summarizeLog(log),
      });
    } catch (error) {
      const log = await saveNotificationLog({
        event_type: "incoming_created",
        incoming_letter_id: letter.id,
        notification_channel: "whatsapp",
        target_number: targetNumber,
        provider,
        status: "failed",
        attempt_count: attemptCount,
        provider_message_id: null,
        provider_request_id: null,
        error_message: error.message || "Pengiriman WhatsApp gagal.",
        provider_response: error.providerResponse || null,
        request_context: requestContext,
        requested_by_account_id: actor.account_id,
        queued_at: queuedAt,
        last_attempt_at: nowIso(),
      });

      throw new HttpError(error.statusCode || 502, error.message || "Pengiriman WhatsApp gagal.", {
        notification: summarizeLog(log),
      });
    }
  } catch (error) {
    respond(res, error.statusCode || 500, {
      ok: false,
      message: error.message || "Terjadi kesalahan pada notifikasi WhatsApp.",
      details: error.details || null,
    });
  }
};

function ensureServerConfig() {
  if (!SUPABASE_URL || !SUPABASE_API_KEY) {
    throw new HttpError(500, "Konfigurasi server Supabase belum lengkap.");
  }
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new HttpError(400, "Payload JSON tidak valid.");
  }
}

function nowIso() {
  return new Date().toISOString();
}

function respond(res, statusCode, payload) {
  res.status(statusCode).end(JSON.stringify(payload));
}

function buildIncomingWhatsappMessage(letter, office) {
  return [
    "Pemberitahuan Surat Masuk Baru",
    "",
    `Nomor agenda: ${letter.agenda_no || "-"}`,
    `Nomor surat: ${letter.letter_no || "-"}`,
    `Tanggal surat: ${formatDateId(letter.letter_date)}`,
    `Asal surat: ${letter.source_name || "-"}`,
    `Tujuan/disposisi: ${letter.target_unit || "-"}`,
    `Perihal: ${letter.subject || "-"}`,
    "",
    `${office?.office_name || "DILAN CERDAS"}`
  ].join("\n");
}

function normalizeWhatsappNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

function formatDateId(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

async function supabaseRequest(path, options) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: options?.method || "GET",
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`,
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    body: options?.body,
  });

  const text = await response.text();
  const payload = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const detail = payload?.message || payload?.hint || payload?.details || payload?.error || response.statusText;
    throw new HttpError(response.status, detail || "Permintaan ke Supabase gagal.", payload);
  }

  return payload;
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return { raw: value };
  }
}

async function requireSession(sessionToken) {
  const rows = await supabaseRequest("/rest/v1/rpc/require_session", {
    method: "POST",
    body: JSON.stringify({ p_session_token: sessionToken }),
  });

  if (!Array.isArray(rows) || !rows[0]?.account_id) {
    throw new HttpError(401, "Sesi aplikasi tidak valid atau sudah berakhir.");
  }

  return rows[0];
}

async function getIncomingLetter(sessionToken, letterId) {
  return supabaseRequest("/rest/v1/rpc/get_incoming_letter", {
    method: "POST",
    body: JSON.stringify({
      p_session_token: sessionToken,
      p_letter_id: letterId,
    }),
  });
}

async function getOfficeProfile() {
  const payload = await supabaseRequest("/rest/v1/rpc/public_bootstrap", {
    method: "POST",
  });
  return payload?.officeProfile || null;
}

async function getNotificationLog(letterId) {
  try {
    const params = new URLSearchParams({
      select: "*",
      event_type: "eq.incoming_created",
      incoming_letter_id: `eq.${letterId}`,
      limit: "1",
    });
    const rows = await supabaseRequest(`/rest/v1/whatsapp_notification_logs?${params.toString()}`);
    return Array.isArray(rows) ? rows[0] || null : null;
  } catch (error) {
    return null;
  }
}

async function saveNotificationLog(log) {
  try {
    const rows = await supabaseRequest("/rest/v1/whatsapp_notification_logs?on_conflict=event_type,incoming_letter_id", {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(log),
    });

    return Array.isArray(rows) ? rows[0] || null : null;
  } catch (error) {
    return null;
  }
}

function summarizeLog(log) {
  if (!log) return null;
  return {
    id: log.id,
    status: log.status,
    provider: log.provider,
    targetNumber: log.target_number,
    attemptCount: log.attempt_count,
    errorMessage: log.error_message,
    queuedAt: log.queued_at,
    lastAttemptAt: log.last_attempt_at,
    updatedAt: log.updated_at,
  };
}

async function sendWhatsappMessage({ provider, targetNumber, message, office, letter }) {
  if (provider === "fonnte") {
    return sendViaFonnte({ targetNumber, message });
  }

  if (provider === "generic") {
    return sendViaGenericWebhook({ targetNumber, message, office, letter });
  }

  throw new ProviderError(`Provider WhatsApp "${provider}" belum didukung.`);
}

async function sendViaFonnte({ targetNumber, message }) {
  const token = String(process.env.FONNTE_TOKEN || "").trim();
  if (!token) throw new ProviderError("FONNTE_TOKEN belum diatur pada server.");

  const body = new URLSearchParams();
  body.set("target", targetNumber);
  body.set("message", message);
  body.set("countryCode", "0");
  body.set("typing", "false");
  body.set("preview", "false");
  body.set("connectOnly", "false");

  const response = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const text = await response.text();
  const payload = text ? safeJsonParse(text) : null;
  const accepted = Boolean(payload?.status ?? payload?.Status);

  if (!response.ok || !accepted) {
    const reason = payload?.reason || payload?.detail || "Gateway WhatsApp menolak pengiriman.";
    throw new ProviderError(reason, payload, response.status || 502);
  }

  return {
    status: "queued",
    providerMessageId: Array.isArray(payload?.id) ? payload.id.join(",") : (payload?.id ? String(payload.id) : null),
    providerRequestId: payload?.requestid ? String(payload.requestid) : null,
    providerResponse: payload,
  };
}

async function sendViaGenericWebhook({ targetNumber, message, office, letter }) {
  const url = String(process.env.WHATSAPP_GENERIC_URL || "").trim();
  const token = String(process.env.WHATSAPP_GENERIC_TOKEN || "").trim();
  const headerName = String(process.env.WHATSAPP_GENERIC_AUTH_HEADER || "Authorization").trim();
  const tokenPrefix = String(process.env.WHATSAPP_GENERIC_TOKEN_PREFIX || "Bearer").trim();

  if (!url) throw new ProviderError("WHATSAPP_GENERIC_URL belum diatur pada server.");

  const headers = { "Content-Type": "application/json" };
  if (token) headers[headerName] = tokenPrefix ? `${tokenPrefix} ${token}`.trim() : token;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      target: targetNumber,
      message,
      eventType: "incoming_created",
      letter: {
        id: letter.id,
        agenda_no: letter.agenda_no,
        letter_no: letter.letter_no,
        letter_date: letter.letter_date,
        source_name: letter.source_name,
        target_unit: letter.target_unit,
        subject: letter.subject,
      },
      office: {
        office_name: office?.office_name || "",
        district_name: office?.district_name || "",
        whatsapp_notification: office?.whatsapp_notification || "",
      },
    }),
  });

  const text = await response.text();
  const payload = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    throw new ProviderError(payload?.message || payload?.error || "Webhook WhatsApp mengembalikan status gagal.", payload, response.status || 502);
  }

  return {
    status: "queued",
    providerMessageId: payload?.messageId ? String(payload.messageId) : null,
    providerRequestId: payload?.requestId ? String(payload.requestId) : null,
    providerResponse: payload,
  };
}
