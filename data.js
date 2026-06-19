/* ============================================================
   SISTEM SURAT — Shared constants and utilities
   ============================================================ */

const SIFAT = {
  Biasa: "b-biasa",
  Penting: "b-penting",
  Segera: "b-segera",
  Rahasia: "b-rahasia",
};

const PRIORITY_OPTIONS = ["Biasa", "Penting", "Segera", "Rahasia"];
const INCOMING_STATUS_OPTIONS = ["Draft", "Baru", "Diproses", "Selesai"];
const OUTGOING_STATUS_OPTIONS = ["Draft", "Terkirim"];
const COMPLAINT_STATUS_OPTIONS = ["Baru", "Ditindaklanjuti", "Selesai"];
const EMPLOYMENT_STATUS_OPTIONS = ["PNS", "PPPK", "Honorer"];
const ACCOUNT_ROLE_OPTIONS = ["Super Admin", "User"];

const AVATAR_COLORS = ["#3056a8", "#1f7a55", "#9a6b1e", "#7a3e8f", "#1f6f8f", "#9a3344"];

function avatarColor(source) {
  const text = String(source || "AA");
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = text.charCodeAt(index) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name) {
  const value = String(name || "")
    .replace(/[^A-Za-z. ]/g, "")
    .split(" ")
    .filter((part) => part.length > 1 && part[0] === part[0].toUpperCase())
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return value || String(name || "AA").slice(0, 2).toUpperCase();
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function sanitizeWhatsappNumber(value) {
  const digits = digitsOnly(value);
  if (!digits) return "";
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return digits;
}

function formatDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateId(value, options) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(
    "id-ID",
    options || { day: "2-digit", month: "long", year: "numeric" }
  ).format(date);
}

function formatDateTimeId(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatNumberId(value, digits) {
  const numeric = Number(value || 0);
  return numeric.toLocaleString("id-ID", digits ? {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  } : undefined);
}

function quarterLabel(dateValue) {
  const date = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(date.getTime())) return "-";
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  const roman = ["I", "II", "III", "IV"][quarter - 1];
  return `Triwulan ${roman} ${date.getFullYear()}`;
}

function arrayFromLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function linesFromArray(items) {
  return Array.isArray(items) ? items.join("\n") : "";
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    return Array.isArray(JSON.parse(value)) ? JSON.parse(value) : [];
  } catch (error) {
    return [];
  }
}

function ensureObjectArray(value) {
  return ensureArray(value).filter((item) => item && typeof item === "object");
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",").pop() : result;
      resolve(base64 || null);
    };
    reader.onerror = () => reject(reader.error || new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}

function base64ToBlob(base64, mimeType) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType || "application/octet-stream" });
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function exportCsv(filename, rows) {
  const lines = rows.map((row) =>
    row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
  );
  downloadBlob(filename, new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }));
}

function openWindowHtml(title, bodyHtml, existingPopup) {
  const popup = existingPopup && !existingPopup.closed
    ? existingPopup
    : window.open("", "_blank", "noopener,noreferrer,width=980,height=760");
  if (!popup) return null;
  popup.document.open();
  popup.document.write(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: "Plus Jakarta Sans", Arial, sans-serif; margin: 0; padding: 32px; color: #1f2937; background: #f8fafc; }
    .sheet { max-width: 960px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 18px; padding: 28px 30px; box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08); }
    h1, h2, h3, p { margin: 0; }
    .meta { display: grid; grid-template-columns: 220px 1fr; gap: 10px 18px; margin-top: 22px; font-size: 14px; }
    .label { color: #64748b; font-weight: 600; }
    .value { color: #0f172a; }
    .section { margin-top: 24px; }
    .section p { line-height: 1.75; }
    .actions { margin-top: 26px; display: flex; gap: 10px; }
    button { border: none; border-radius: 999px; padding: 10px 16px; background: #1d4ed8; color: #fff; font: inherit; cursor: pointer; }
    .ghost { background: #e2e8f0; color: #0f172a; }
    iframe, img { max-width: 100%; margin-top: 18px; border-radius: 12px; border: 1px solid #e5e7eb; }
    @media print {
      body { background: #fff; padding: 0; }
      .sheet { box-shadow: none; border: none; max-width: 100%; border-radius: 0; }
      .actions { display: none; }
    }
  </style>
</head>
<body>${bodyHtml}</body>
</html>`);
  popup.document.close();
  return popup;
}

Object.assign(window, {
  SIFAT,
  PRIORITY_OPTIONS,
  INCOMING_STATUS_OPTIONS,
  OUTGOING_STATUS_OPTIONS,
  COMPLAINT_STATUS_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  ACCOUNT_ROLE_OPTIONS,
  avatarColor,
  initials,
  digitsOnly,
  sanitizeWhatsappNumber,
  formatDateInput,
  formatDateId,
  formatDateTimeId,
  formatNumberId,
  quarterLabel,
  arrayFromLines,
  linesFromArray,
  ensureArray,
  ensureObjectArray,
  fileToBase64,
  base64ToBlob,
  downloadBlob,
  exportCsv,
  openWindowHtml,
});
