-- Menyelaraskan data ASN Kantor Camat Air Hitam berdasarkan revisi klien:
-- PNS dan PPPK dipisahkan ulang, disertai koreksi nama/NIP yang jelas salah.

with official_employees (full_name, nip, position, grade, work_unit, employment_status, match_name, match_nips) as (
  values
    ('FATHURRAHMAN, S.STP', '198609102004121002', 'Camat Air Hitam', 'IV/a', 'Pimpinan', 'PNS', 'fathurrahmansstp', array['198609102004121002']),
    ('ZULKARNAIN, S.E.', '197304052007011025', 'Sekcam Air Hitam', 'III/d', 'Sekretariat', 'PNS', 'zulkarnainse', array['197304052007011025']),
    ('Ir. MUHAMMAD SYAFA''AT, S.P., M.E., IPM, ACPE, ASEAN Eng.', '197712162006041008', 'Kasi Pelayanan Umum', 'III/d', 'Seksi Pelayanan Umum', 'PNS', 'irmuhammadsyafaatspmeipmacpeaseaneng', array['197712162006041008']),
    ('MUALIMIN, A.Md.Kep', '197605271996031002', 'Kasi Kesejahteraan Sosial', 'III/c', 'Seksi Kesejahteraan Sosial', 'PNS', 'mualiminamdkep', array['197605271996031002']),
    ('DEDI SANTOSO, S.AP.', '198308072012121003', 'Kasi Pemerintahan', 'III/c', 'Seksi Pemerintahan', 'PNS', 'dedisantososap', array['198308072012121003']),
    ('IBNU SYATIR, S.Pd', '198503292011011006', 'Kasi PMDK', 'III/d', 'Seksi PMDK', 'PNS', 'ibnusyatirspd', array['198503292011011006']),
    ('USMAN KHOLIQ, S.E.', '197505042009011010', 'Kasubbag Keuangan, Aset dan Program', 'III/b', 'Subbag Keuangan, Aset dan Program', 'PNS', 'usmankholiqse', array['197505042009011010']),
    ('JIMMI KELLY, S.E.', '197806192008011001', 'Kasubbag Umum dan Kepegawaian', 'III/b', 'Subbag Umum dan Kepegawaian', 'PNS', 'jimmikellyse', array['197806192008011001']),
    ('SA''ARANI', '198211102008011002', 'Staf', '-', 'Subbag Umum dan Kepegawaian', 'PNS', 'saarani', array['198211102008011002']),
    ('EDWAR EFENDI', '1984101092008011001', 'Staf', '-', 'Seksi Kesejahteraan Sosial', 'PNS', 'edwarefendi', array['1984101092008011001']),
    ('SITI AJRAH', '198210092009012006', 'Staf', '-', 'Seksi Pelayanan Umum', 'PNS', 'sitiajrah', array['198210092009012006']),
    ('NASODIN, S.IP', '199511162025051005', 'Staf', '-', 'Subbag Keuangan, Aset dan Program', 'PNS', 'nasodinsip', array['199511162025051005', '19951162025051005']),
    ('HERMANTO', '197202092009061001', 'Staf', '-', 'Seksi Kesejahteraan Sosial', 'PNS', 'hermanto', array['197202092009061001']),
    ('DAPIT HAYATULLOH, A.Md.Kom', '199604262025051001', 'Staf', '-', 'Seksi Pemerintahan', 'PNS', 'dapithayatullohamdkom', array['199604262025051001']),
    ('MUJITO', '197112042009061001', 'Staf', '-', 'Seksi Pemerintahan', 'PNS', 'mujito', array['197112042009061001']),
    ('ABDUL AZIZ', '197211012010011009', 'Staf', '-', 'Seksi PMDK', 'PNS', 'abdulaziz', array['197211012010011009']),
    ('PAHRUL. AB', '197704122012121001', 'Staf', '-', 'Seksi Pelayanan Umum', 'PNS', 'pahrulab', array['197704122012121001']),
    ('AKLIMA, S.Sos', '198705062025212026', 'Staf', '-', 'Seksi Kesejahteraan Sosial', 'PPPK', 'aklimassos', array['198705062025212026']),
    ('PUJIATI, S.E.', '198703092025212012', 'Staf', '-', 'Seksi PMDK', 'PPPK', 'pujiatise', array['198703092025212012']),
    ('SAIJUL', '198009012025211015', 'Staf', '-', 'Seksi Pelayanan Umum', 'PPPK', 'saijul', array['198009012025211015']),
    ('IDAM KHOLID', '198604152025211018', 'Staf', '-', 'Seksi Pemerintahan', 'PPPK', 'idamkholid', array['198604152025211018']),
    ('HASIM', '198510202025211021', 'Staf', '-', 'Seksi Pemerintahan', 'PPPK', 'hasim', array['198510202025211021']),
    ('BENI KUSNADI', '198508012025211018', 'Staf', '-', 'Seksi Pelayanan Umum', 'PPPK', 'benikusnadi', array['198508012025211018']),
    ('AHMAD NURYADIN', '198305082025211022', 'Staf', '-', 'Seksi PMDK', 'PPPK', 'ahmadnuryadin', array['198305082025211022']),
    ('MISWATI', '198704302025212025', 'Staf', '-', 'Subbag Umum dan Kepegawaian', 'PPPK', 'miswati', array['198704302025212025']),
    ('BUSTARI', '199306232025221001', 'Staf', '-', 'Subbag Keuangan, Aset dan Program', 'PPPK', 'bustari', array['199306232025221001']),
    ('FITRI ANDANI', '199909092025212014', 'Staf', '-', 'Subbag Umum dan Kepegawaian', 'PPPK', 'fitriandani', array['199909092025212014']),
    ('AYU LESTARI', '199309162025212018', 'Staf', '-', 'Subbag Umum dan Kepegawaian', 'PPPK', 'ayulestari', array['199309162025212018']),
    ('AHMAD ZIADI', '198802262025211090', 'Staf', '-', 'Subbag Keuangan, Aset dan Program', 'PPPK', 'ahmadziadi', array['198802262025211090', '198805262025211090']),
    ('AHMAD DAIROBI', '199003262025211045', 'Staf', '-', 'Seksi PMDK', 'PPPK', 'ahmaddairobi', array['199003262025211045'])
),
updated as (
  update public.employees e
     set full_name = o.full_name,
         nip = o.nip,
         position = o.position,
         grade = o.grade,
         work_unit = o.work_unit,
         employment_status = o.employment_status,
         updated_at = timezone('utc', now())
    from official_employees o
   where e.nip = any(o.match_nips)
      or regexp_replace(lower(coalesce(e.full_name, '')), '[^a-z0-9]+', '', 'g') = o.match_name
  returning e.id
)
insert into public.employees (full_name, nip, position, grade, work_unit, employment_status)
select
  o.full_name,
  o.nip,
  o.position,
  o.grade,
  o.work_unit,
  o.employment_status
from official_employees o
where not exists (
  select 1
  from public.employees e
  where e.nip = o.nip
     or regexp_replace(lower(coalesce(e.full_name, '')), '[^a-z0-9]+', '', 'g') = o.match_name
);
