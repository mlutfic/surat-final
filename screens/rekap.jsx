/* ============================================================
   Screens: Rekap Surat Masuk & Rekap Surat Keluar
   ============================================================ */

function RekapToolbar({ addLabel, onAdd, onExport, search, onSearch, activeFilter, onFilterChange, dateLabel }) {
  return (
    <div className="toolbar">
      <div className="searchbar" style={{ maxWidth: 320, flex: "0 0 auto" }}>
        <Icon name="search" size={16} />
        <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Cari nomor / perihal / asal / tujuan..." />
      </div>
      {["Semua", ...PRIORITY_OPTIONS].map((filter) => (
        <button key={filter} type="button" className={"chip " + (activeFilter === filter ? "on" : "")} onClick={() => onFilterChange(filter)}>
          {filter}
        </button>
      ))}
      <button type="button" className="chip">
        <Icon name="calendar" size={14} />{dateLabel}
      </button>
      <div className="grow" />
      <button type="button" className="btn btn-ghost btn-sm" onClick={onExport}>
        <Icon name="download" size={14} />Ekspor
      </button>
      <button type="button" className="btn btn-gold btn-sm" onClick={onAdd}>
        <Icon name="plus" size={14} />{addLabel}
      </button>
    </div>
  );
}

function paginateRows(rows, page, perPage) {
  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const safePage = Math.min(page, totalPages);
  return {
    totalPages,
    pageRows: rows.slice((safePage - 1) * perPage, safePage * perPage),
    startIndex: (safePage - 1) * perPage,
    safePage,
  };
}

function sortRowsByCreatedAtDesc(rows) {
  return rows.slice().sort((left, right) => {
    const leftCreated = new Date(left.created_at || 0).getTime();
    const rightCreated = new Date(right.created_at || 0).getTime();
    if (leftCreated !== rightCreated) return rightCreated - leftCreated;

    const leftUpdated = new Date(left.updated_at || 0).getTime();
    const rightUpdated = new Date(right.updated_at || 0).getTime();
    if (leftUpdated !== rightUpdated) return rightUpdated - leftUpdated;

    return String(right.id || "").localeCompare(String(left.id || ""), "id-ID");
  });
}

function filterIncomingRows(rows, query, priority) {
  const keyword = String(query || "").trim().toLowerCase();
  return rows.filter((item) => {
    const matchesPriority = priority === "Semua" || item.priority === priority;
    const haystack = [item.agenda_no, item.agenda_db_no, item.letter_no, item.subject, item.source_name, item.target_unit, item.service_types?.name].join(" ").toLowerCase();
    const matchesQuery = !keyword || haystack.includes(keyword);
    return matchesPriority && matchesQuery;
  });
}

function filterOutgoingRows(rows, query, priority) {
  const keyword = String(query || "").trim().toLowerCase();
  return rows.filter((item) => {
    const matchesPriority = priority === "Semua" || item.priority === priority;
    const haystack = [item.agenda_no, item.agenda_db_no, item.letter_no, item.subject, item.source_unit, item.destination_name].join(" ").toLowerCase();
    const matchesQuery = !keyword || haystack.includes(keyword);
    return matchesPriority && matchesQuery;
  });
}

function RekapSuratMasuk({ go }) {
  const [page, setPage] = useState(1);
  const [priority, setPriority] = useState("Semua");
  const [query, setQuery] = useState("");
  const rows = sortRowsByCreatedAtDesc(AppSelectors.incomingLetters());
  const filtered = filterIncomingRows(rows, query, priority);
  const { totalPages, pageRows, startIndex, safePage } = paginateRows(filtered, page, 8);

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);

  return (
    <>
      <PageHead
        crumb={["Persuratan", "Rekap Surat Masuk"]}
        title="Rekap Surat Masuk"
        sub="Arsip seluruh surat permohonan dan surat masuk yang diterima"
      />
      <RekapToolbar
        addLabel="Catat Surat Masuk"
        onAdd={() => { AppApi.clearFormContext(); go("form-masuk"); }}
        onExport={() => AppApi.exportLetters("incoming")}
        search={query}
        onSearch={(value) => { setQuery(value); setPage(1); }}
        activeFilter={priority}
        onFilterChange={(value) => { setPriority(value); setPage(1); }}
        dateLabel={quarterLabel(rows[0]?.letter_date)}
      />
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>No. Agenda</th>
                <th>Nomor Surat</th>
                <th>Perihal</th>
                <th>Asal → Tujuan</th>
                <th>Tanggal</th>
                <th>Sifat</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((item, index) => {
                const displayAgendaNo = startIndex + index + 1;
                return (
                <tr key={item.id}>
                  <td className="tabnum td-strong">{displayAgendaNo}</td>
                  <td className="tabnum" style={{ fontSize: 12.5 }}>{item.letter_no}</td>
                  <td>
                    <div className="td-strong" style={{ maxWidth: 250 }}>{item.subject}</div>
                    <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{item.service_types?.name || "-"}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12.5 }}>{item.source_name}</div>
                    <div className="muted row gap-2 center" style={{ fontSize: 11.5, marginTop: 2 }}>
                      <Icon name="chevright" size={11} />{item.target_unit}
                    </div>
                  </td>
                  <td className="tabnum" style={{ whiteSpace: "nowrap" }}>{formatDateId(item.letter_date)}</td>
                  <td><SifatBadge s={item.priority} /></td>
                  <td><StatusBadge s={item.status} /></td>
                  <td>
                    <RowActions
                      onView={() => AppApi.previewLetter("incoming", item.id)}
                      onPrint={() => AppApi.printLetter("incoming", item.id)}
                      onDownload={() => AppApi.downloadLetter("incoming", item.id)}
                      onWhatsApp={() => AppApi.sendIncomingWhatsappNotification(item.id)}
                      whatsappTitle="Kirim / cek notifikasi WA otomatis"
                      onEdit={() => { AppApi.setFormContext("incoming", item.id); go("form-masuk"); }}
                      onDelete={async () => {
                        const confirmed = await AppApi.confirmDeletion("surat masuk", `${displayAgendaNo} · ${item.subject || item.letter_no || "-"}`, `Nomor surat: ${item.letter_no || "-"}`);
                        if (confirmed) AppApi.deleteIncomingLetter(item.id);
                      }}
                    />
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyHint icon="inbox">Tidak ada surat masuk yang sesuai filter.</EmptyHint>}
        </div>
        {filtered.length > 0 && <Pagination current={safePage} total={totalPages} onPage={setPage} />}
      </div>
    </>
  );
}

function RekapSuratKeluar({ go }) {
  const [page, setPage] = useState(1);
  const [priority, setPriority] = useState("Semua");
  const [query, setQuery] = useState("");
  const office = AppSelectors.office();
  const rows = sortRowsByCreatedAtDesc(AppSelectors.outgoingLetters());
  const filtered = filterOutgoingRows(rows, query, priority);
  const { totalPages, pageRows, startIndex, safePage } = paginateRows(filtered, page, 8);

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);

  return (
    <>
      <PageHead
        crumb={["Persuratan", "Rekap Surat Keluar"]}
        title="Rekap Surat Keluar"
        sub="Arsip seluruh surat keluar yang diterbitkan instansi"
      />
      <RekapToolbar
        addLabel="Buat Surat Keluar"
        onAdd={() => { AppApi.clearFormContext(); go("form-keluar"); }}
        onExport={() => AppApi.exportLetters("outgoing")}
        search={query}
        onSearch={(value) => { setQuery(value); setPage(1); }}
        activeFilter={priority}
        onFilterChange={(value) => { setPriority(value); setPage(1); }}
        dateLabel={quarterLabel(rows[0]?.letter_date)}
      />
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>No. Agenda</th>
                <th>Nomor Surat</th>
                <th>Perihal</th>
                <th>Asal → Tujuan</th>
                <th>Tanggal</th>
                <th>Sifat</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((item, index) => {
                const displayAgendaNo = startIndex + index + 1;
                return (
                <tr key={item.id}>
                  <td className="tabnum td-strong">{displayAgendaNo}</td>
                  <td className="tabnum" style={{ fontSize: 12.5 }}>{item.letter_no}</td>
                  <td><div className="td-strong" style={{ maxWidth: 250 }}>{item.subject}</div></td>
                  <td>
                    <div style={{ fontSize: 12.5 }}>{item.source_unit}</div>
                    <div className="muted row gap-2 center" style={{ fontSize: 11.5, marginTop: 2 }}>
                      <Icon name="chevright" size={11} />{item.destination_name}
                    </div>
                  </td>
                  <td className="tabnum" style={{ whiteSpace: "nowrap" }}>{formatDateId(item.letter_date)}</td>
                  <td><SifatBadge s={item.priority} /></td>
                  <td><StatusBadge s={item.status} /></td>
                  <td>
                    <RowActions
                      onView={() => AppApi.previewLetter("outgoing", item.id)}
                      onPrint={() => AppApi.printLetter("outgoing", item.id)}
                      onDownload={() => AppApi.downloadLetter("outgoing", item.id)}
                      onWhatsApp={() => AppApi.openWhatsapp((office && office.whatsapp_notification) || "", AppApi.waMessageForLetter("outgoing", item))}
                      whatsappTitle="Buka WhatsApp"
                      onEdit={() => { AppApi.setFormContext("outgoing", item.id); go("form-keluar"); }}
                      onDelete={async () => {
                        const confirmed = await AppApi.confirmDeletion("surat keluar", `${displayAgendaNo} · ${item.subject || item.letter_no || "-"}`, `Nomor surat: ${item.letter_no || "-"}`);
                        if (confirmed) AppApi.deleteOutgoingLetter(item.id);
                      }}
                    />
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyHint icon="send">Tidak ada surat keluar yang sesuai filter.</EmptyHint>}
        </div>
        {filtered.length > 0 && <Pagination current={safePage} total={totalPages} onPage={setPage} />}
      </div>
    </>
  );
}

Object.assign(window, { RekapSuratMasuk, RekapSuratKeluar });
