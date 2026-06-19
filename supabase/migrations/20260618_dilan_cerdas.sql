create extension if not exists pgcrypto;

create table if not exists public.office_profile (
  id uuid primary key default gen_random_uuid(),
  office_name text not null,
  government_name text not null,
  district_name text not null,
  app_name text not null,
  app_expansion text not null,
  app_tagline text not null,
  background_text text not null,
  concept_text text not null,
  address text not null,
  phone text not null,
  email text not null,
  website text not null default '-',
  whatsapp_notification text not null,
  head_name text not null,
  head_nip text not null,
  head_title text not null,
  head_rank text not null,
  service_hours text not null,
  legal_basis_established text not null,
  legal_references jsonb not null default '[]'::jsonb,
  goals jsonb not null default '[]'::jsonb,
  mechanisms jsonb not null default '[]'::jsonb,
  impact_points jsonb not null default '[]'::jsonb,
  flow_steps jsonb not null default '[]'::jsonb,
  internal_units jsonb not null default '[]'::jsonb,
  village_units jsonb not null default '[]'::jsonb,
  complaint_categories jsonb not null default '[]'::jsonb,
  logo_url text not null default 'assets/sarolangun-logo.jpeg',
  org_pdf_url text not null default 'assets/struktur-organisasi-kantor-camat-air-hitam-2026.pdf',
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.service_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  badge text not null,
  audience text not null check (audience in ('public', 'internal')),
  icon text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  username text not null unique,
  email text not null unique,
  role text not null check (role in ('Super Admin', 'User')),
  unit_name text not null,
  scope_village text,
  is_active boolean not null default true,
  password_hash text not null,
  last_login_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.app_sessions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  session_token text not null unique default encode(extensions.gen_random_bytes(32), 'hex'),
  created_at timestamptz not null default timezone('utc', now()),
  last_used_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz not null default timezone('utc', now()) + interval '30 days'
);

create index if not exists app_sessions_account_idx on public.app_sessions (account_id);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  nip text not null unique,
  position text not null,
  grade text not null,
  work_unit text not null,
  employment_status text not null check (employment_status in ('PNS', 'PPPK', 'Honorer')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create sequence if not exists public.incoming_agenda_seq start 9;
create sequence if not exists public.outgoing_agenda_seq start 8;

create table if not exists public.incoming_letters (
  id uuid primary key default gen_random_uuid(),
  agenda_no text unique,
  letter_no text not null,
  letter_date date not null,
  service_type_id uuid references public.service_types(id),
  subject text not null,
  source_name text not null,
  target_unit text not null,
  priority text not null check (priority in ('Biasa', 'Penting', 'Segera', 'Rahasia')),
  status text not null default 'Draft' check (status in ('Draft', 'Baru', 'Diproses', 'Selesai')),
  village_scope text,
  sender_phone text,
  notify_whatsapp boolean not null default true,
  file_name text,
  file_mime_type text,
  file_content_base64 text,
  notes text,
  created_by_account_id uuid references public.accounts(id) on delete set null,
  updated_by_account_id uuid references public.accounts(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.outgoing_letters (
  id uuid primary key default gen_random_uuid(),
  agenda_no text unique,
  letter_no text not null,
  letter_date date not null,
  source_unit text not null,
  destination_name text not null,
  archive_classification text,
  subject text not null,
  priority text not null check (priority in ('Biasa', 'Penting', 'Segera', 'Rahasia')),
  status text not null default 'Draft' check (status in ('Draft', 'Terkirim')),
  village_scope text,
  notify_whatsapp boolean not null default true,
  file_name text,
  file_mime_type text,
  file_content_base64 text,
  notes text,
  created_by_account_id uuid references public.accounts(id) on delete set null,
  updated_by_account_id uuid references public.accounts(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  age integer not null check (age > 0),
  phone text not null,
  address text not null,
  category text not null,
  message text not null,
  status text not null default 'Baru' check (status in ('Baru', 'Ditindaklanjuti', 'Selesai')),
  response_note text,
  source_channel text not null default 'Publik',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists complaints_unique_seed_idx
on public.complaints (full_name, phone, created_at);

create table if not exists public.survey_questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.survey_submissions (
  id uuid primary key default gen_random_uuid(),
  respondent_name text,
  source_channel text not null default 'Publik',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.survey_answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.survey_submissions(id) on delete cascade,
  question_id uuid not null references public.survey_questions(id) on delete cascade,
  score smallint not null check (score between 1 and 4),
  created_at timestamptz not null default timezone('utc', now()),
  unique (submission_id, question_id)
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.assign_incoming_agenda_no()
returns trigger
language plpgsql
as $$
begin
  if new.agenda_no is null or btrim(new.agenda_no) = '' then
    new.agenda_no := lpad(nextval('public.incoming_agenda_seq')::text, 2, '0');
  end if;
  return new;
end;
$$;

create or replace function public.assign_outgoing_agenda_no()
returns trigger
language plpgsql
as $$
begin
  if new.agenda_no is null or btrim(new.agenda_no) = '' then
    new.agenda_no := lpad(nextval('public.outgoing_agenda_seq')::text, 2, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_touch_office_profile on public.office_profile;
create trigger trg_touch_office_profile before update on public.office_profile for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_service_types on public.service_types;
create trigger trg_touch_service_types before update on public.service_types for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_accounts on public.accounts;
create trigger trg_touch_accounts before update on public.accounts for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_employees on public.employees;
create trigger trg_touch_employees before update on public.employees for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_incoming_letters on public.incoming_letters;
create trigger trg_touch_incoming_letters before update on public.incoming_letters for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_outgoing_letters on public.outgoing_letters;
create trigger trg_touch_outgoing_letters before update on public.outgoing_letters for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_complaints on public.complaints;
create trigger trg_touch_complaints before update on public.complaints for each row execute function public.touch_updated_at();
drop trigger if exists trg_assign_incoming_agenda_no on public.incoming_letters;
create trigger trg_assign_incoming_agenda_no before insert on public.incoming_letters for each row execute function public.assign_incoming_agenda_no();
drop trigger if exists trg_assign_outgoing_agenda_no on public.outgoing_letters;
create trigger trg_assign_outgoing_agenda_no before insert on public.outgoing_letters for each row execute function public.assign_outgoing_agenda_no();

create or replace view public.survey_question_scores as
select
  q.id,
  q.question_text,
  q.sort_order,
  round(coalesce(avg(a.score), 0)::numeric, 2) as avg_score
from public.survey_questions q
left join public.survey_answers a on a.question_id = q.id
where q.is_active = true
group by q.id, q.question_text, q.sort_order
order by q.sort_order;

create or replace view public.survey_summary as
with answer_stats as (
  select
    coalesce(avg(a.score), 0)::numeric as avg_score,
    count(distinct a.submission_id) as respondent_count,
    max(s.created_at) as latest_submission_at
  from public.survey_answers a
  join public.survey_submissions s on s.id = a.submission_id
),
period_stats as (
  select
    coalesce(latest_submission_at, timezone('utc', now())) as latest_submission_at,
    avg_score,
    respondent_count
  from answer_stats
)
select
  round((avg_score / 4.0) * 100, 1) as ikm,
  case
    when round((avg_score / 4.0) * 100, 1) >= 88.31 then 'A'
    when round((avg_score / 4.0) * 100, 1) >= 76.61 then 'B'
    when round((avg_score / 4.0) * 100, 1) >= 65.00 then 'C'
    else 'D'
  end as mutu,
  respondent_count,
  latest_submission_at,
  concat(
    'Triwulan ',
    case extract(quarter from latest_submission_at)
      when 1 then 'I'
      when 2 then 'II'
      when 3 then 'III'
      else 'IV'
    end,
    ' ',
    extract(year from latest_submission_at)::int
  ) as period_label
from period_stats;

create or replace function public.require_session(p_session_token text)
returns table (
  account_id uuid,
  full_name text,
  username text,
  email text,
  role text,
  unit_name text,
  scope_village text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account record;
begin
  update public.app_sessions
     set last_used_at = timezone('utc', now())
   where session_token = p_session_token
     and expires_at > timezone('utc', now());

  if not found then
    raise exception 'Sesi tidak valid atau sudah berakhir.';
  end if;

  select
    a.id as account_id,
    a.full_name,
    a.username,
    a.email,
    a.role,
    a.unit_name,
    a.scope_village
  into v_account
  from public.app_sessions s
  join public.accounts a on a.id = s.account_id
  where s.session_token = p_session_token
    and s.expires_at > timezone('utc', now())
    and a.is_active = true
  limit 1;

  if v_account.account_id is null then
    raise exception 'Akun tidak aktif.';
  end if;

  return query
  select
    v_account.account_id,
    v_account.full_name,
    v_account.username,
    v_account.email,
    v_account.role,
    v_account.unit_name,
    v_account.scope_village;
end;
$$;

create or replace function public.public_bootstrap()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'officeProfile', coalesce((select to_jsonb(o) from public.office_profile o limit 1), '{}'::jsonb),
    'serviceTypes', coalesce((select jsonb_agg(to_jsonb(s) order by s.sort_order) from public.service_types s where s.is_active = true), '[]'::jsonb),
    'surveyQuestions', coalesce((select jsonb_agg(to_jsonb(q) order by q.sort_order) from public.survey_questions q where q.is_active = true), '[]'::jsonb),
    'surveySummary', coalesce((select to_jsonb(v) from public.survey_summary v limit 1), '{}'::jsonb),
    'surveyScores', coalesce((select jsonb_agg(to_jsonb(v) order by v.sort_order) from public.survey_question_scores v), '[]'::jsonb),
    'complaints', coalesce((
      select jsonb_agg(to_jsonb(c) order by c.created_at desc)
      from (
        select id, full_name, age, phone, address, category, message, status, source_channel, created_at, updated_at
        from public.complaints
        order by created_at desc
        limit 12
      ) c
    ), '[]'::jsonb),
    'publicCounts', jsonb_build_object(
      'incoming', (select count(*) from public.incoming_letters),
      'outgoing', (select count(*) from public.outgoing_letters),
      'complaints', (select count(*) from public.complaints)
    )
  );
$$;

create or replace function public.private_bootstrap(p_session_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
  v_accounts jsonb := '[]'::jsonb;
  v_employees jsonb := '[]'::jsonb;
  v_incoming jsonb;
  v_outgoing jsonb;
  v_complaints jsonb;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;

  if v_actor.role = 'Super Admin' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', a.id,
      'full_name', a.full_name,
      'username', a.username,
      'email', a.email,
      'role', a.role,
      'unit_name', a.unit_name,
      'scope_village', a.scope_village,
      'is_active', a.is_active,
      'last_login_at', a.last_login_at,
      'created_at', a.created_at,
      'updated_at', a.updated_at
    ) order by case when a.role = 'Super Admin' then 0 else 1 end, a.unit_name, a.full_name), '[]'::jsonb)
    into v_accounts
    from public.accounts a;

    select coalesce(jsonb_agg(to_jsonb(e) order by e.full_name), '[]'::jsonb)
    into v_employees
    from public.employees e;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id,
    'agenda_no', i.agenda_no,
    'letter_no', i.letter_no,
    'letter_date', i.letter_date,
    'service_type_id', i.service_type_id,
    'service_types', case when s.id is null then null else jsonb_build_object(
      'id', s.id,
      'name', s.name,
      'badge', s.badge,
      'audience', s.audience,
      'icon', s.icon,
      'description', s.description
    ) end,
    'subject', i.subject,
    'source_name', i.source_name,
    'target_unit', i.target_unit,
    'priority', i.priority,
    'status', i.status,
    'village_scope', i.village_scope,
    'sender_phone', i.sender_phone,
    'notify_whatsapp', i.notify_whatsapp,
    'file_name', i.file_name,
    'file_mime_type', i.file_mime_type,
    'notes', i.notes,
    'created_by_account_id', i.created_by_account_id,
    'updated_by_account_id', i.updated_by_account_id,
    'created_at', i.created_at,
    'updated_at', i.updated_at
  ) order by i.letter_date desc, i.created_at desc), '[]'::jsonb)
  into v_incoming
  from public.incoming_letters i
  left join public.service_types s on s.id = i.service_type_id
  where v_actor.role = 'Super Admin'
     or i.village_scope = v_actor.scope_village
     or i.source_name = v_actor.unit_name
     or i.created_by_account_id = v_actor.account_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id,
    'agenda_no', o.agenda_no,
    'letter_no', o.letter_no,
    'letter_date', o.letter_date,
    'source_unit', o.source_unit,
    'destination_name', o.destination_name,
    'archive_classification', o.archive_classification,
    'subject', o.subject,
    'priority', o.priority,
    'status', o.status,
    'village_scope', o.village_scope,
    'notify_whatsapp', o.notify_whatsapp,
    'file_name', o.file_name,
    'file_mime_type', o.file_mime_type,
    'notes', o.notes,
    'created_by_account_id', o.created_by_account_id,
    'updated_by_account_id', o.updated_by_account_id,
    'created_at', o.created_at,
    'updated_at', o.updated_at
  ) order by o.letter_date desc, o.created_at desc), '[]'::jsonb)
  into v_outgoing
  from public.outgoing_letters o
  where v_actor.role = 'Super Admin'
     or o.village_scope = v_actor.scope_village
     or o.source_unit = v_actor.unit_name
     or o.created_by_account_id = v_actor.account_id;

  select coalesce(jsonb_agg(to_jsonb(c) order by c.created_at desc), '[]'::jsonb)
  into v_complaints
  from (
    select id, full_name, age, phone, address, category, message, status, source_channel, created_at, updated_at
    from public.complaints
    order by created_at desc
    limit 20
  ) c;

  return jsonb_build_object(
    'session', jsonb_build_object(
      'id', v_actor.account_id,
      'full_name', v_actor.full_name,
      'username', v_actor.username,
      'email', v_actor.email,
      'role', v_actor.role,
      'unit_name', v_actor.unit_name,
      'scope_village', v_actor.scope_village
    ),
    'accounts', v_accounts,
    'employees', v_employees,
    'incomingLetters', v_incoming,
    'outgoingLetters', v_outgoing,
    'complaints', v_complaints
  );
end;
$$;

create or replace function public.app_login(p_username text, p_password text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account record;
  v_session record;
begin
  delete from public.app_sessions where expires_at <= timezone('utc', now());

  select *
  into v_account
  from public.accounts a
  where lower(a.username) = lower(trim(coalesce(p_username, '')))
    and a.is_active = true
    and a.password_hash = extensions.crypt(coalesce(p_password, ''), a.password_hash)
  limit 1;

  if v_account.id is null then
    raise exception 'Username atau kata sandi tidak cocok.';
  end if;

  update public.accounts
     set last_login_at = timezone('utc', now()),
         updated_at = timezone('utc', now())
   where id = v_account.id
  returning * into v_account;

  insert into public.app_sessions (account_id)
  values (v_account.id)
  returning * into v_session;

  return jsonb_build_object(
    'id', v_account.id,
    'full_name', v_account.full_name,
    'username', v_account.username,
    'email', v_account.email,
    'role', v_account.role,
    'unit_name', v_account.unit_name,
    'scope_village', v_account.scope_village,
    'is_active', v_account.is_active,
    'last_login_at', v_account.last_login_at,
    'token', v_session.session_token
  );
end;
$$;

create or replace function public.logout_session(p_session_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.app_sessions where session_token = p_session_token;
end;
$$;

create or replace function public.save_office_profile(p_session_token text, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
  v_result jsonb;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;
  if v_actor.role <> 'Super Admin' then
    raise exception 'Hanya Super Admin yang dapat mengubah profil kantor.';
  end if;

  update public.office_profile
     set office_name = p_payload->>'office_name',
         government_name = p_payload->>'government_name',
         district_name = p_payload->>'district_name',
         app_name = p_payload->>'app_name',
         app_expansion = p_payload->>'app_expansion',
         app_tagline = p_payload->>'app_tagline',
         background_text = p_payload->>'background_text',
         concept_text = p_payload->>'concept_text',
         address = p_payload->>'address',
         phone = p_payload->>'phone',
         email = p_payload->>'email',
         website = coalesce(p_payload->>'website', '-'),
         whatsapp_notification = p_payload->>'whatsapp_notification',
         head_name = p_payload->>'head_name',
         head_nip = p_payload->>'head_nip',
         head_title = p_payload->>'head_title',
         head_rank = p_payload->>'head_rank',
         service_hours = p_payload->>'service_hours',
         legal_basis_established = p_payload->>'legal_basis_established',
         legal_references = coalesce(p_payload->'legal_references', '[]'::jsonb),
         goals = coalesce(p_payload->'goals', '[]'::jsonb),
         mechanisms = coalesce(p_payload->'mechanisms', '[]'::jsonb),
         internal_units = coalesce(p_payload->'internal_units', '[]'::jsonb),
         village_units = coalesce(p_payload->'village_units', '[]'::jsonb),
         complaint_categories = coalesce(p_payload->'complaint_categories', '[]'::jsonb),
         logo_url = coalesce(p_payload->>'logo_url', logo_url),
         org_pdf_url = coalesce(p_payload->>'org_pdf_url', org_pdf_url)
  returning row_to_json(office_profile)::jsonb into v_result;

  return v_result;
end;
$$;

create or replace function public.upsert_employee(p_session_token text, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
  v_employee public.employees;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;
  if v_actor.role <> 'Super Admin' then
    raise exception 'Hanya Super Admin yang dapat mengelola data pegawai.';
  end if;

  if nullif(p_payload->>'id', '') is null then
    insert into public.employees (full_name, nip, position, grade, work_unit, employment_status)
    values (
      p_payload->>'full_name',
      p_payload->>'nip',
      p_payload->>'position',
      coalesce(p_payload->>'grade', '-'),
      p_payload->>'work_unit',
      p_payload->>'employment_status'
    )
    returning * into v_employee;
  else
    update public.employees
       set full_name = p_payload->>'full_name',
           nip = p_payload->>'nip',
           position = p_payload->>'position',
           grade = coalesce(p_payload->>'grade', '-'),
           work_unit = p_payload->>'work_unit',
           employment_status = p_payload->>'employment_status'
     where id = (p_payload->>'id')::uuid
     returning * into v_employee;
  end if;

  return to_jsonb(v_employee);
end;
$$;

create or replace function public.delete_employee(p_session_token text, p_employee_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;
  if v_actor.role <> 'Super Admin' then
    raise exception 'Hanya Super Admin yang dapat menghapus data pegawai.';
  end if;

  delete from public.employees where id = p_employee_id;
end;
$$;

create or replace function public.upsert_account(p_session_token text, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
  v_account public.accounts;
  v_password text;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;
  if v_actor.role <> 'Super Admin' then
    raise exception 'Hanya Super Admin yang dapat mengelola akun.';
  end if;

  v_password := nullif(coalesce(p_payload->>'password', ''), '');

  if nullif(p_payload->>'id', '') is null then
    insert into public.accounts (
      full_name,
      username,
      email,
      role,
      unit_name,
      scope_village,
      is_active,
      password_hash
    )
    values (
      p_payload->>'full_name',
      lower(p_payload->>'username'),
      lower(p_payload->>'email'),
      p_payload->>'role',
      p_payload->>'unit_name',
      nullif(p_payload->>'scope_village', ''),
      coalesce((p_payload->>'is_active')::boolean, true),
      extensions.crypt(coalesce(v_password, 'AirHitam2026!'), extensions.gen_salt('bf'))
    )
    returning * into v_account;
  else
    update public.accounts
       set full_name = p_payload->>'full_name',
           username = lower(p_payload->>'username'),
           email = lower(p_payload->>'email'),
           role = p_payload->>'role',
           unit_name = p_payload->>'unit_name',
           scope_village = nullif(p_payload->>'scope_village', ''),
           is_active = coalesce((p_payload->>'is_active')::boolean, true),
           password_hash = case
             when v_password is null then password_hash
             else extensions.crypt(v_password, extensions.gen_salt('bf'))
           end
     where id = (p_payload->>'id')::uuid
     returning * into v_account;
  end if;

  return jsonb_build_object(
    'id', v_account.id,
    'full_name', v_account.full_name,
    'username', v_account.username,
    'email', v_account.email,
    'role', v_account.role,
    'unit_name', v_account.unit_name,
    'scope_village', v_account.scope_village,
    'is_active', v_account.is_active,
    'last_login_at', v_account.last_login_at,
    'created_at', v_account.created_at,
    'updated_at', v_account.updated_at
  );
end;
$$;

create or replace function public.delete_account(p_session_token text, p_account_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;
  if v_actor.role <> 'Super Admin' then
    raise exception 'Hanya Super Admin yang dapat menghapus akun.';
  end if;

  delete from public.accounts where id = p_account_id;
end;
$$;

create or replace function public.get_incoming_letter(p_session_token text, p_letter_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
  v_result jsonb;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;

  select jsonb_build_object(
    'id', i.id,
    'agenda_no', i.agenda_no,
    'letter_no', i.letter_no,
    'letter_date', i.letter_date,
    'service_type_id', i.service_type_id,
    'service_types', case when s.id is null then null else jsonb_build_object(
      'id', s.id,
      'name', s.name,
      'badge', s.badge,
      'audience', s.audience,
      'icon', s.icon,
      'description', s.description
    ) end,
    'subject', i.subject,
    'source_name', i.source_name,
    'target_unit', i.target_unit,
    'priority', i.priority,
    'status', i.status,
    'village_scope', i.village_scope,
    'sender_phone', i.sender_phone,
    'notify_whatsapp', i.notify_whatsapp,
    'file_name', i.file_name,
    'file_mime_type', i.file_mime_type,
    'file_content_base64', i.file_content_base64,
    'notes', i.notes,
    'created_by_account_id', i.created_by_account_id,
    'updated_by_account_id', i.updated_by_account_id,
    'created_at', i.created_at,
    'updated_at', i.updated_at
  )
  into v_result
  from public.incoming_letters i
  left join public.service_types s on s.id = i.service_type_id
  where i.id = p_letter_id
    and (
      v_actor.role = 'Super Admin'
      or i.village_scope = v_actor.scope_village
      or i.source_name = v_actor.unit_name
      or i.created_by_account_id = v_actor.account_id
    );

  if v_result is null then
    raise exception 'Surat masuk tidak ditemukan atau tidak dapat diakses.';
  end if;

  return v_result;
end;
$$;

create or replace function public.get_outgoing_letter(p_session_token text, p_letter_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
  v_result jsonb;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;

  select jsonb_build_object(
    'id', o.id,
    'agenda_no', o.agenda_no,
    'letter_no', o.letter_no,
    'letter_date', o.letter_date,
    'source_unit', o.source_unit,
    'destination_name', o.destination_name,
    'archive_classification', o.archive_classification,
    'subject', o.subject,
    'priority', o.priority,
    'status', o.status,
    'village_scope', o.village_scope,
    'notify_whatsapp', o.notify_whatsapp,
    'file_name', o.file_name,
    'file_mime_type', o.file_mime_type,
    'file_content_base64', o.file_content_base64,
    'notes', o.notes,
    'created_by_account_id', o.created_by_account_id,
    'updated_by_account_id', o.updated_by_account_id,
    'created_at', o.created_at,
    'updated_at', o.updated_at
  )
  into v_result
  from public.outgoing_letters o
  where o.id = p_letter_id
    and (
      v_actor.role = 'Super Admin'
      or o.village_scope = v_actor.scope_village
      or o.source_unit = v_actor.unit_name
      or o.created_by_account_id = v_actor.account_id
    );

  if v_result is null then
    raise exception 'Surat keluar tidak ditemukan atau tidak dapat diakses.';
  end if;

  return v_result;
end;
$$;

create or replace function public.upsert_incoming_letter(p_session_token text, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
  v_letter public.incoming_letters;
  v_source_name text;
  v_target_unit text;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;

  v_source_name := p_payload->>'source_name';
  v_target_unit := p_payload->>'target_unit';

  if v_actor.role <> 'Super Admin' and v_source_name <> v_actor.unit_name then
    raise exception 'Operator desa hanya boleh menginput surat dari unit desanya sendiri.';
  end if;

  if nullif(p_payload->>'id', '') is null then
    insert into public.incoming_letters (
      letter_no,
      letter_date,
      service_type_id,
      subject,
      source_name,
      target_unit,
      priority,
      status,
      village_scope,
      sender_phone,
      notify_whatsapp,
      file_name,
      file_mime_type,
      file_content_base64,
      notes,
      created_by_account_id,
      updated_by_account_id
    )
    values (
      p_payload->>'letter_no',
      (p_payload->>'letter_date')::date,
      nullif(p_payload->>'service_type_id', '')::uuid,
      p_payload->>'subject',
      v_source_name,
      v_target_unit,
      p_payload->>'priority',
      p_payload->>'status',
      nullif(p_payload->>'village_scope', ''),
      nullif(p_payload->>'sender_phone', ''),
      coalesce((p_payload->>'notify_whatsapp')::boolean, true),
      nullif(p_payload->>'file_name', ''),
      nullif(p_payload->>'file_mime_type', ''),
      nullif(p_payload->>'file_content_base64', ''),
      nullif(p_payload->>'notes', ''),
      v_actor.account_id,
      v_actor.account_id
    )
    returning * into v_letter;
  else
    update public.incoming_letters
       set letter_no = p_payload->>'letter_no',
           letter_date = (p_payload->>'letter_date')::date,
           service_type_id = nullif(p_payload->>'service_type_id', '')::uuid,
           subject = p_payload->>'subject',
           source_name = v_source_name,
           target_unit = v_target_unit,
           priority = p_payload->>'priority',
           status = p_payload->>'status',
           village_scope = nullif(p_payload->>'village_scope', ''),
           sender_phone = nullif(p_payload->>'sender_phone', ''),
           notify_whatsapp = coalesce((p_payload->>'notify_whatsapp')::boolean, true),
           file_name = case when p_payload ? 'file_name' then nullif(p_payload->>'file_name', '') else file_name end,
           file_mime_type = case when p_payload ? 'file_mime_type' then nullif(p_payload->>'file_mime_type', '') else file_mime_type end,
           file_content_base64 = case when p_payload ? 'file_content_base64' then nullif(p_payload->>'file_content_base64', '') else file_content_base64 end,
           notes = nullif(p_payload->>'notes', ''),
           updated_by_account_id = v_actor.account_id
     where id = (p_payload->>'id')::uuid
       and (
         v_actor.role = 'Super Admin'
         or village_scope = v_actor.scope_village
         or source_name = v_actor.unit_name
         or created_by_account_id = v_actor.account_id
       )
     returning * into v_letter;
  end if;

  if v_letter.id is null then
    raise exception 'Surat masuk tidak dapat disimpan.';
  end if;

  return public.get_incoming_letter(p_session_token, v_letter.id);
end;
$$;

create or replace function public.upsert_outgoing_letter(p_session_token text, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
  v_letter public.outgoing_letters;
  v_source_unit text;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;

  v_source_unit := p_payload->>'source_unit';
  if v_actor.role <> 'Super Admin' and v_source_unit <> v_actor.unit_name then
    raise exception 'Operator desa hanya boleh membuat surat keluar dari unit desanya sendiri.';
  end if;

  if nullif(p_payload->>'id', '') is null then
    insert into public.outgoing_letters (
      letter_no,
      letter_date,
      source_unit,
      destination_name,
      archive_classification,
      subject,
      priority,
      status,
      village_scope,
      notify_whatsapp,
      file_name,
      file_mime_type,
      file_content_base64,
      notes,
      created_by_account_id,
      updated_by_account_id
    )
    values (
      p_payload->>'letter_no',
      (p_payload->>'letter_date')::date,
      v_source_unit,
      p_payload->>'destination_name',
      nullif(p_payload->>'archive_classification', ''),
      p_payload->>'subject',
      p_payload->>'priority',
      p_payload->>'status',
      nullif(p_payload->>'village_scope', ''),
      coalesce((p_payload->>'notify_whatsapp')::boolean, true),
      nullif(p_payload->>'file_name', ''),
      nullif(p_payload->>'file_mime_type', ''),
      nullif(p_payload->>'file_content_base64', ''),
      nullif(p_payload->>'notes', ''),
      v_actor.account_id,
      v_actor.account_id
    )
    returning * into v_letter;
  else
    update public.outgoing_letters
       set letter_no = p_payload->>'letter_no',
           letter_date = (p_payload->>'letter_date')::date,
           source_unit = v_source_unit,
           destination_name = p_payload->>'destination_name',
           archive_classification = nullif(p_payload->>'archive_classification', ''),
           subject = p_payload->>'subject',
           priority = p_payload->>'priority',
           status = p_payload->>'status',
           village_scope = nullif(p_payload->>'village_scope', ''),
           notify_whatsapp = coalesce((p_payload->>'notify_whatsapp')::boolean, true),
           file_name = case when p_payload ? 'file_name' then nullif(p_payload->>'file_name', '') else file_name end,
           file_mime_type = case when p_payload ? 'file_mime_type' then nullif(p_payload->>'file_mime_type', '') else file_mime_type end,
           file_content_base64 = case when p_payload ? 'file_content_base64' then nullif(p_payload->>'file_content_base64', '') else file_content_base64 end,
           notes = nullif(p_payload->>'notes', ''),
           updated_by_account_id = v_actor.account_id
     where id = (p_payload->>'id')::uuid
       and (
         v_actor.role = 'Super Admin'
         or village_scope = v_actor.scope_village
         or source_unit = v_actor.unit_name
         or created_by_account_id = v_actor.account_id
       )
     returning * into v_letter;
  end if;

  if v_letter.id is null then
    raise exception 'Surat keluar tidak dapat disimpan.';
  end if;

  return public.get_outgoing_letter(p_session_token, v_letter.id);
end;
$$;

create or replace function public.delete_incoming_letter(p_session_token text, p_letter_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;
  delete from public.incoming_letters
   where id = p_letter_id
     and (
       v_actor.role = 'Super Admin'
       or village_scope = v_actor.scope_village
       or source_name = v_actor.unit_name
       or created_by_account_id = v_actor.account_id
     );
end;
$$;

create or replace function public.delete_outgoing_letter(p_session_token text, p_letter_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;
  delete from public.outgoing_letters
   where id = p_letter_id
     and (
       v_actor.role = 'Super Admin'
       or village_scope = v_actor.scope_village
       or source_unit = v_actor.unit_name
       or created_by_account_id = v_actor.account_id
     );
end;
$$;

create or replace function public.create_complaint(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result public.complaints;
begin
  insert into public.complaints (full_name, age, phone, address, category, message, status, source_channel)
  values (
    p_payload->>'full_name',
    (p_payload->>'age')::integer,
    p_payload->>'phone',
    p_payload->>'address',
    p_payload->>'category',
    p_payload->>'message',
    'Baru',
    coalesce(p_payload->>'source_channel', 'Publik')
  )
  returning * into v_result;

  return to_jsonb(v_result);
end;
$$;

create or replace function public.update_complaint_status(p_session_token text, p_complaint_id uuid, p_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
  v_result public.complaints;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;
  if v_actor.role <> 'Super Admin' then
    raise exception 'Hanya Super Admin yang dapat mengubah status pengaduan.';
  end if;

  update public.complaints
     set status = p_status
   where id = p_complaint_id
   returning * into v_result;

  return to_jsonb(v_result);
end;
$$;

create or replace function public.submit_survey(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_submission_id uuid;
  v_answer jsonb;
begin
  insert into public.survey_submissions (respondent_name, source_channel)
  values (
    nullif(p_payload->>'respondent_name', ''),
    coalesce(p_payload->>'source_channel', 'Publik')
  )
  returning id into v_submission_id;

  for v_answer in
    select value from jsonb_array_elements(coalesce(p_payload->'answers', '[]'::jsonb))
  loop
    insert into public.survey_answers (submission_id, question_id, score)
    values (
      v_submission_id,
      (v_answer->>'question_id')::uuid,
      (v_answer->>'score')::smallint
    );
  end loop;

  return coalesce((select to_jsonb(v) from public.survey_summary v limit 1), '{}'::jsonb);
end;
$$;

grant execute on function public.require_session(text) to anon, authenticated;
grant execute on function public.public_bootstrap() to anon, authenticated;
grant execute on function public.private_bootstrap(text) to anon, authenticated;
grant execute on function public.app_login(text, text) to anon, authenticated;
grant execute on function public.logout_session(text) to anon, authenticated;
grant execute on function public.save_office_profile(text, jsonb) to anon, authenticated;
grant execute on function public.upsert_employee(text, jsonb) to anon, authenticated;
grant execute on function public.delete_employee(text, uuid) to anon, authenticated;
grant execute on function public.upsert_account(text, jsonb) to anon, authenticated;
grant execute on function public.delete_account(text, uuid) to anon, authenticated;
grant execute on function public.get_incoming_letter(text, uuid) to anon, authenticated;
grant execute on function public.get_outgoing_letter(text, uuid) to anon, authenticated;
grant execute on function public.upsert_incoming_letter(text, jsonb) to anon, authenticated;
grant execute on function public.upsert_outgoing_letter(text, jsonb) to anon, authenticated;
grant execute on function public.delete_incoming_letter(text, uuid) to anon, authenticated;
grant execute on function public.delete_outgoing_letter(text, uuid) to anon, authenticated;
grant execute on function public.create_complaint(jsonb) to anon, authenticated;
grant execute on function public.update_complaint_status(text, uuid, text) to anon, authenticated;
grant execute on function public.submit_survey(jsonb) to anon, authenticated;

insert into public.office_profile (
  id,
  office_name,
  government_name,
  district_name,
  app_name,
  app_expansion,
  app_tagline,
  background_text,
  concept_text,
  address,
  phone,
  email,
  website,
  whatsapp_notification,
  head_name,
  head_nip,
  head_title,
  head_rank,
  service_hours,
  legal_basis_established,
  legal_references,
  goals,
  mechanisms,
  impact_points,
  flow_steps,
  internal_units,
  village_units,
  complaint_categories,
  logo_url,
  org_pdf_url
) values (
  '1b9ea562-2c74-4d34-b6c8-93c2d8b8c7d0',
  'Pemerintah Kecamatan Air Hitam',
  'Kabupaten Sarolangun',
  'Kecamatan Air Hitam',
  'DILAN CERDAS',
  'Digitalisasi Layanan yang Cepat, Responsif, Dinamis, Akuntabel, dan Sistematis',
  'Layanan digital Kecamatan Air Hitam untuk warga dan petugas.',
  'Sebagian layanan administrasi kecamatan masih dicatat manual, sulit dipantau, dan membuat tindak lanjut dokumen berjalan lambat. DILAN CERDAS disusun agar warga dan operator desa memiliki satu jalur layanan yang lebih rapi dan mudah diawasi.',
  'Satu aplikasi untuk informasi layanan, surat masuk, surat keluar, pengaduan, survei kepuasan, dan arsip digital kecamatan.',
  'Padang Lalang, Desa Jernih, Kecamatan Air Hitam, Kabupaten Sarolangun, Provinsi Jambi',
  '0823 2487 4997',
  'kantorcamatairhitam@gmail.com',
  '-',
  '0823 2487 4997',
  'FATHURRAHMAN, S.STP',
  '198609102004121002',
  'Camat Air Hitam',
  'Pembina (IV/a)',
  'Senin-Kamis, 07.30-16.45 WIB; Jumat, 07.30-11.30 WIB',
  'Peraturan Daerah Kabupaten Sarolangun Nomor 04 Tahun 2004',
  '[
    "Undang-Undang Nomor 25 Tahun 2009 tentang Pelayanan Publik.",
    "Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah.",
    "Peraturan Pemerintah Nomor 38 Tahun 2017 tentang Inovasi Daerah.",
    "Peraturan Presiden Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE).",
    "Peraturan Menteri Dalam Negeri Nomor 104 Tahun 2018 tentang Penilaian dan Pemberian Penghargaan dan/atau Insentif Inovasi Daerah.",
    "Peraturan Daerah Kabupaten Sarolangun Nomor 04 Tahun 2004 tentang Pembentukan Kecamatan Air Hitam.",
    "Peraturan Daerah Kabupaten Sarolangun Nomor 6 Tahun 2025 tentang Perubahan Keempat atas Peraturan Daerah Kabupaten Sarolangun Nomor 5 Tahun 2016 tentang Pembentukan dan Susunan Perangkat Daerah."
  ]'::jsonb,
  '[
    "Mempercepat layanan administrasi kecamatan.",
    "Membuat alur kerja lebih jelas dan mudah dipantau.",
    "Memudahkan warga memperoleh informasi layanan.",
    "Merapikan pencatatan dan arsip dokumen.",
    "Menyediakan kanal pengaduan masyarakat.",
    "Mendukung evaluasi layanan melalui survei IKM.",
    "Membantu petugas bekerja lebih tertib dan responsif."
  ]'::jsonb,
  '[
    "Digitalisasi administrasi pelayanan.",
    "Penggunaan aplikasi atau media layanan online.",
    "Penyediaan layanan informasi terpadu.",
    "Sistem pengarsipan digital.",
    "Monitoring dan evaluasi pelayanan secara berkala.",
    "Penyediaan kanal pengaduan dan konsultasi masyarakat.",
    "Peningkatan kapasitas SDM pengelola layanan."
  ]'::jsonb,
  '[
    {"aspect":"Model pelayanan","before":"Manual dan bergantung pada dokumen fisik","after":"Pelayanan berbasis digital"},
    {"aspect":"Proses administrasi","before":"Relatif lambat","after":"Lebih cepat dan terstruktur"},
    {"aspect":"Arsip dokumen","before":"Konvensional dan tersebar","after":"Arsip digital terintegrasi"},
    {"aspect":"Akses informasi layanan","before":"Terbatas","after":"Mudah diakses masyarakat"},
    {"aspect":"Pengaduan masyarakat","before":"Belum terkelola optimal","after":"Terintegrasi dan responsif"},
    {"aspect":"Monitoring pelayanan","before":"Belum maksimal","after":"Evaluasi lebih sistematis"},
    {"aspect":"Koordinasi petugas","before":"Kurang efektif","after":"Lebih cepat dan efisien"}
  ]'::jsonb,
  '[
    {"title":"Ajukan","desc":"Warga atau operator desa mengajukan layanan dan melampirkan dokumen."},
    {"title":"Verifikasi","desc":"Petugas memeriksa kelengkapan dan menentukan disposisi."},
    {"title":"Proses","desc":"Surat diteruskan ke unit kerja terkait untuk ditindaklanjuti."},
    {"title":"Terbit","desc":"Surat atau rekomendasi diterbitkan setelah proses selesai."},
    {"title":"Arsip","desc":"Dokumen dan riwayat layanan tersimpan sebagai arsip digital."},
    {"title":"Evaluasi","desc":"Pengaduan dan survei dipakai untuk perbaikan layanan."}
  ]'::jsonb,
  '[
    "Camat Air Hitam",
    "Sekretariat Kecamatan",
    "Kasi Pelayanan Umum",
    "Kasi Pemerintahan",
    "Kasi PMD dan Kelurahan",
    "Kasi Kesejahteraan Sosial",
    "Kasi Trantib"
  ]'::jsonb,
  '[
    "Desa Lubuk Kepayang",
    "Desa Baru",
    "Desa Semurung",
    "Desa Jernih",
    "Desa Lubuk Jering",
    "Desa Pematang Kabau",
    "Desa Bukit Suban",
    "Desa Mentawak Baru",
    "Desa Mentawak Ulu"
  ]'::jsonb,
  '[
    "Pelayanan Administrasi",
    "Tindak Lanjut Surat",
    "Akses Informasi",
    "Lainnya"
  ]'::jsonb,
  'assets/sarolangun-logo.jpeg',
  'assets/struktur-organisasi-kantor-camat-air-hitam-2026.pdf'
) on conflict (id) do update
set
  office_name = excluded.office_name,
  government_name = excluded.government_name,
  district_name = excluded.district_name,
  app_name = excluded.app_name,
  app_expansion = excluded.app_expansion,
  app_tagline = excluded.app_tagline,
  background_text = excluded.background_text,
  concept_text = excluded.concept_text,
  address = excluded.address,
  phone = excluded.phone,
  email = excluded.email,
  website = excluded.website,
  whatsapp_notification = excluded.whatsapp_notification,
  head_name = excluded.head_name,
  head_nip = excluded.head_nip,
  head_title = excluded.head_title,
  head_rank = excluded.head_rank,
  service_hours = excluded.service_hours,
  legal_basis_established = excluded.legal_basis_established,
  legal_references = excluded.legal_references,
  goals = excluded.goals,
  mechanisms = excluded.mechanisms,
  impact_points = excluded.impact_points,
  flow_steps = excluded.flow_steps,
  internal_units = excluded.internal_units,
  village_units = excluded.village_units,
  complaint_categories = excluded.complaint_categories,
  logo_url = excluded.logo_url,
  org_pdf_url = excluded.org_pdf_url,
  updated_at = timezone('utc', now());

insert into public.service_types (name, description, badge, audience, icon, sort_order)
values
  ('Surat Pengantar Perbaikan Data KTP', 'Untuk koreksi atau pembaruan data KTP.', 'Administrasi', 'public', 'idcard', 1),
  ('Surat Pengantar Perbaikan Data KK / Pemisahan KK', 'Untuk perbaikan data atau pemisahan KK.', 'Administrasi', 'public', 'users', 2),
  ('Surat Rekomendasi Izin Kegiatan / Keramaian', 'Untuk kegiatan atau keramaian masyarakat.', 'Rekomendasi', 'public', 'megaphone', 3),
  ('Surat Rekomendasi Penggantian Antar Waktu BPD', 'Untuk penggantian antar waktu BPD.', 'Pemerintahan', 'internal', 'sitemap', 4),
  ('Surat Rekomendasi Rotasi / Pemberhentian / Pengisian / Pelantikan Perangkat Desa', 'Untuk rotasi, pengisian, atau pelantikan perangkat desa.', 'Pemerintahan', 'internal', 'building', 5),
  ('Surat Rekomendasi Nikah', 'Untuk kebutuhan rekomendasi nikah.', 'Sosial', 'public', 'mail', 6),
  ('Lainnya', 'Untuk permohonan lain yang belum masuk kategori layanan utama.', 'Fleksibel', 'public', 'fileplus', 7)
on conflict (name) do update
set
  description = excluded.description,
  badge = excluded.badge,
  audience = excluded.audience,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc', now());

insert into public.accounts (id, full_name, username, email, role, unit_name, scope_village, is_active, password_hash)
values
  ('f63db293-88d1-4f65-bc2f-68ee8be6ef42', 'Operator Kantor Camat Air Hitam', 'kec.airhitam', 'kantorcamatairhitam@gmail.com', 'Super Admin', 'Kantor Camat Air Hitam', null, true, extensions.crypt('AirHitam2026!', extensions.gen_salt('bf'))),
  ('0f4b373d-7225-4b97-a7dd-15c0a73f2dc0', 'Operator Desa Lubuk Kepayang', 'desa.lubuk.kepayang', 'operator.lubukkepayang@airhitam.id', 'User', 'Desa Lubuk Kepayang', 'Desa Lubuk Kepayang', true, extensions.crypt('AirHitam2026!', extensions.gen_salt('bf'))),
  ('8a65500e-c493-49e9-ac17-e31a98c470ba', 'Operator Desa Baru', 'desa.baru', 'operator.desabaru@airhitam.id', 'User', 'Desa Baru', 'Desa Baru', true, extensions.crypt('AirHitam2026!', extensions.gen_salt('bf'))),
  ('9d7eae0a-1964-4fc4-b9ad-5a547934eec8', 'Operator Desa Semurung', 'desa.semurung', 'operator.semurung@airhitam.id', 'User', 'Desa Semurung', 'Desa Semurung', true, extensions.crypt('AirHitam2026!', extensions.gen_salt('bf'))),
  ('ca6b7fb0-6065-4dbc-89dd-cd60ecba6d78', 'Operator Desa Jernih', 'desa.jernih', 'operator.jernih@airhitam.id', 'User', 'Desa Jernih', 'Desa Jernih', true, extensions.crypt('AirHitam2026!', extensions.gen_salt('bf'))),
  ('f2efcb06-2eb8-4448-a334-31893108f76a', 'Operator Desa Lubuk Jering', 'desa.lubuk.jering', 'operator.lubukjering@airhitam.id', 'User', 'Desa Lubuk Jering', 'Desa Lubuk Jering', true, extensions.crypt('AirHitam2026!', extensions.gen_salt('bf'))),
  ('598418f7-dd15-46c6-b12a-33b3749d6f4b', 'Operator Desa Pematang Kabau', 'desa.pematang.kabau', 'operator.pematangkabau@airhitam.id', 'User', 'Desa Pematang Kabau', 'Desa Pematang Kabau', true, extensions.crypt('AirHitam2026!', extensions.gen_salt('bf'))),
  ('8561fe99-f4c2-4dda-af54-98bc2fdab7ce', 'Operator Desa Bukit Suban', 'desa.bukit.suban', 'operator.bukitsuban@airhitam.id', 'User', 'Desa Bukit Suban', 'Desa Bukit Suban', true, extensions.crypt('AirHitam2026!', extensions.gen_salt('bf'))),
  ('56be00dd-4714-42bc-95c1-0270d5e2bad5', 'Operator Desa Mentawak Baru', 'desa.mentawak.baru', 'operator.mentawakbaru@airhitam.id', 'User', 'Desa Mentawak Baru', 'Desa Mentawak Baru', true, extensions.crypt('AirHitam2026!', extensions.gen_salt('bf'))),
  ('f413ab4a-b604-4427-a0a8-ebdb8b5d5b39', 'Operator Desa Mentawak Ulu', 'desa.mentawak.ulu', 'operator.mentawakulu@airhitam.id', 'User', 'Desa Mentawak Ulu', 'Desa Mentawak Ulu', true, extensions.crypt('AirHitam2026!', extensions.gen_salt('bf')))
on conflict (username) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role,
  unit_name = excluded.unit_name,
  scope_village = excluded.scope_village,
  is_active = excluded.is_active,
  updated_at = timezone('utc', now());

insert into public.employees (full_name, nip, position, grade, work_unit, employment_status)
values
  ('FATHURRAHMAN, S.STP', '198609102004121002', 'Camat Air Hitam', 'IV/a', 'Pimpinan', 'PNS'),
  ('ZULKARNAIN, S.E.', '197304052007011025', 'Sekcam Air Hitam', 'III/d', 'Sekretariat', 'PNS'),
  ('Ir. MUHAMMAD SYAFA''AT, S.P., M.E., IPM, ACPE, ASEAN Eng.', '197712162006041008', 'Kasi Pelayanan Umum', 'III/d', 'Seksi Pelayanan Umum', 'PNS'),
  ('MUALIMIN, A.Md.Kep', '197605271996031002', 'Kasi Kesejahteraan Sosial', 'III/c', 'Seksi Kesejahteraan Sosial', 'PNS'),
  ('DEDI SANTOSO, S.AP.', '198308072012121003', 'Kasi Pemerintahan', 'III/c', 'Seksi Pemerintahan', 'PNS'),
  ('IBNU SYATIR, S.Pd', '198503292011011006', 'Kasi PMDK', 'III/d', 'Seksi PMDK', 'PNS'),
  ('USMAN KHOLIQ, S.E.', '197505042009011010', 'Kasubbag Keuangan, Aset dan Program', 'III/b', 'Subbag Keuangan, Aset dan Program', 'PNS'),
  ('JIMMI KELLY, S.E.', '197806192008011001', 'Kasubbag Umum dan Kepegawaian', 'III/b', 'Subbag Umum dan Kepegawaian', 'PNS'),
  ('SA''ARANI', '198211102008011002', 'Staf', '-', 'Subbag Umum dan Kepegawaian', 'PNS'),
  ('EDWAR EFENDI', '1984101092008011001', 'Staf', '-', 'Seksi Kesejahteraan Sosial', 'PNS'),
  ('SITI AJRAH', '198210092009012006', 'Staf', '-', 'Seksi Pelayanan Umum', 'PNS'),
  ('NASODIN, S.IP', '199511162025051005', 'Staf', '-', 'Subbag Keuangan, Aset dan Program', 'PNS'),
  ('HERMANTO', '197202092009061001', 'Staf', '-', 'Seksi Kesejahteraan Sosial', 'PNS'),
  ('DAPIT HAYATULLOH, A.Md.Kom', '199604262025051001', 'Staf', '-', 'Seksi Pemerintahan', 'PNS'),
  ('MUJITO', '197112042009061001', 'Staf', '-', 'Seksi Pemerintahan', 'PNS'),
  ('ABDUL AZIZ', '197211012010011009', 'Staf', '-', 'Seksi PMDK', 'PNS'),
  ('PAHRUL. AB', '197704122012121001', 'Staf', '-', 'Seksi Pelayanan Umum', 'PNS'),
  ('AKLIMA, S.Sos', '198705062025212026', 'Staf', '-', 'Seksi Kesejahteraan Sosial', 'PPPK'),
  ('PUJIATI, S.E.', '198703092025212012', 'Staf', '-', 'Seksi PMDK', 'PPPK'),
  ('SAIJUL', '198009012025211015', 'Staf', '-', 'Seksi Pelayanan Umum', 'PPPK'),
  ('IDAM KHOLID', '198604152025211018', 'Staf', '-', 'Seksi Pemerintahan', 'PPPK'),
  ('HASIM', '198510202025211021', 'Staf', '-', 'Seksi Pemerintahan', 'PPPK'),
  ('BENI KUSNADI', '198508012025211018', 'Staf', '-', 'Seksi Pelayanan Umum', 'PPPK'),
  ('AHMAD NURYADIN', '198305082025211022', 'Staf', '-', 'Seksi PMDK', 'PPPK'),
  ('MISWATI', '198704302025212025', 'Staf', '-', 'Subbag Umum dan Kepegawaian', 'PPPK'),
  ('BUSTARI', '199306232025221001', 'Staf', '-', 'Subbag Keuangan, Aset dan Program', 'PPPK'),
  ('FITRI ANDANI', '199909092025212014', 'Staf', '-', 'Subbag Umum dan Kepegawaian', 'PPPK'),
  ('AYU LESTARI', '199309162025212018', 'Staf', '-', 'Subbag Umum dan Kepegawaian', 'PPPK'),
  ('AHMAD ZIADI', '198802262025211090', 'Staf', '-', 'Subbag Keuangan, Aset dan Program', 'PPPK'),
  ('AHMAD DAIROBI', '199003262025211045', 'Staf', '-', 'Seksi PMDK', 'PPPK')
on conflict (nip) do update
set
  full_name = excluded.full_name,
  position = excluded.position,
  grade = excluded.grade,
  work_unit = excluded.work_unit,
  employment_status = excluded.employment_status,
  updated_at = timezone('utc', now());

with svc as (
  select id, name from public.service_types
)
insert into public.incoming_letters (
  agenda_no,
  letter_no,
  letter_date,
  service_type_id,
  subject,
  source_name,
  target_unit,
  priority,
  status,
  village_scope,
  sender_phone,
  notify_whatsapp,
  notes,
  created_by_account_id
)
values
  ('08', '470/148/KEC-AH/VI/2026', '2026-05-31', (select id from svc where name = 'Surat Pengantar Perbaikan Data KTP'), 'Permohonan surat pengantar perbaikan data KTP warga Desa Jernih', 'Desa Jernih', 'Kasi Pelayanan Umum', 'Penting', 'Baru', 'Desa Jernih', '0821-1100-2211', true, 'Masuk melalui operator desa.', 'ca6b7fb0-6065-4dbc-89dd-cd60ecba6d78'),
  ('07', '471/147/KEC-AH/V/2026', '2026-05-30', (select id from svc where name = 'Surat Pengantar Perbaikan Data KK / Pemisahan KK'), 'Permohonan perbaikan data Kartu Keluarga', 'Desa Lubuk Kepayang', 'Kasi Pelayanan Umum', 'Segera', 'Diproses', 'Desa Lubuk Kepayang', '0821-8800-1102', true, 'Dokumen masih diverifikasi.', '0f4b373d-7225-4b97-a7dd-15c0a73f2dc0'),
  ('06', '300/146/KEC-AH/V/2026', '2026-05-29', (select id from svc where name = 'Surat Rekomendasi Izin Kegiatan / Keramaian'), 'Permohonan rekomendasi izin kegiatan masyarakat', 'Panitia Kegiatan Desa Baru', 'Kasi Trantib', 'Biasa', 'Selesai', 'Desa Baru', '0823-7766-4455', true, 'Sudah diterbitkan surat rekomendasi.', '8a65500e-c493-49e9-ac17-e31a98c470ba'),
  ('05', '140/145/KEC-AH/V/2026', '2026-05-28', (select id from svc where name = 'Surat Rekomendasi Penggantian Antar Waktu BPD'), 'Pengajuan rekomendasi PAW BPD', 'BPD Desa Semurung', 'Kasi Pemerintahan', 'Biasa', 'Selesai', 'Desa Semurung', '0822-2233-1144', true, 'Lengkap dan sesuai.', '9d7eae0a-1964-4fc4-b9ad-5a547934eec8'),
  ('04', '141/144/KEC-AH/V/2026', '2026-05-27', (select id from svc where name = 'Surat Rekomendasi Rotasi / Pemberhentian / Pengisian / Pelantikan Perangkat Desa'), 'Permohonan rekomendasi pelantikan perangkat desa', 'Pemerintah Desa Bukit Suban', 'Kasi PMD dan Kelurahan', 'Rahasia', 'Diproses', 'Desa Bukit Suban', '0813-9900-2121', true, 'Menunggu paraf pimpinan.', '8561fe99-f4c2-4dda-af54-98bc2fdab7ce'),
  ('03', '474/143/KEC-AH/V/2026', '2026-05-26', (select id from svc where name = 'Surat Rekomendasi Nikah'), 'Permohonan rekomendasi nikah', 'Desa Pematang Kabau', 'Kasi Kesejahteraan Sosial', 'Penting', 'Selesai', 'Desa Pematang Kabau', '0812-9922-1188', true, 'Sudah disampaikan ke KUA.', '598418f7-dd15-46c6-b12a-33b3749d6f4b'),
  ('02', '470/142/KEC-AH/V/2026', '2026-05-24', (select id from svc where name = 'Lainnya'), 'Permohonan informasi alur layanan DILAN CERDAS', 'Desa Mentawak Baru', 'Sekretariat Kecamatan', 'Segera', 'Selesai', 'Desa Mentawak Baru', '0821-5412-0011', true, 'Telah dijawab melalui WA resmi.', '56be00dd-4714-42bc-95c1-0270d5e2bad5'),
  ('01', '005/141/KEC-AH/V/2026', '2026-05-22', (select id from svc where name = 'Lainnya'), 'Undangan koordinasi inovasi pelayanan publik', 'Pemerintah Kabupaten Sarolangun', 'Camat Air Hitam', 'Biasa', 'Selesai', null, '0811-7000-2244', true, 'Arsip pimpinan.', 'f63db293-88d1-4f65-bc2f-68ee8be6ef42')
on conflict (agenda_no) do update
set
  letter_no = excluded.letter_no,
  letter_date = excluded.letter_date,
  service_type_id = excluded.service_type_id,
  subject = excluded.subject,
  source_name = excluded.source_name,
  target_unit = excluded.target_unit,
  priority = excluded.priority,
  status = excluded.status,
  village_scope = excluded.village_scope,
  sender_phone = excluded.sender_phone,
  notify_whatsapp = excluded.notify_whatsapp,
  notes = excluded.notes,
  created_by_account_id = excluded.created_by_account_id,
  updated_at = timezone('utc', now());

insert into public.outgoing_letters (
  agenda_no,
  letter_no,
  letter_date,
  source_unit,
  destination_name,
  archive_classification,
  subject,
  priority,
  status,
  village_scope,
  notify_whatsapp,
  notes,
  created_by_account_id
)
values
  ('07', '470/231/KEC-AH/VI/2026', '2026-05-31', 'Kasi Pelayanan Umum', 'Desa Jernih', '470 - Administrasi Kependudukan', 'Surat pengantar perbaikan data KTP', 'Penting', 'Terkirim', 'Desa Jernih', true, 'Dikirim ke desa asal.', 'f63db293-88d1-4f65-bc2f-68ee8be6ef42'),
  ('06', '471/230/KEC-AH/V/2026', '2026-05-30', 'Kasi Pelayanan Umum', 'Dinas Dukcapil Kabupaten Sarolangun', '471 - Kependudukan', 'Pengantar perbaikan data Kartu Keluarga', 'Biasa', 'Terkirim', 'Desa Lubuk Kepayang', true, 'Teruskan ke Dukcapil.', 'f63db293-88d1-4f65-bc2f-68ee8be6ef42'),
  ('05', '300/229/KEC-AH/V/2026', '2026-05-29', 'Kasi Trantib', 'Panitia Kegiatan Desa Baru', '300 - Ketertiban', 'Rekomendasi izin kegiatan/keramaian', 'Segera', 'Terkirim', 'Desa Baru', true, 'Ditandatangani Camat.', 'f63db293-88d1-4f65-bc2f-68ee8be6ef42'),
  ('04', '140/228/KEC-AH/V/2026', '2026-05-27', 'Kasi Pemerintahan', 'BPD Desa Semurung', '140 - Pemerintahan Desa', 'Rekomendasi penggantian antar waktu BPD', 'Rahasia', 'Draft', 'Desa Semurung', true, 'Masih menunggu finalisasi.', 'f63db293-88d1-4f65-bc2f-68ee8be6ef42'),
  ('03', '141/227/KEC-AH/V/2026', '2026-05-26', 'Kasi PMD dan Kelurahan', 'Kepala Desa Bukit Suban', '141 - Perangkat Desa', 'Rekomendasi pelantikan perangkat desa', 'Penting', 'Terkirim', 'Desa Bukit Suban', true, 'Dikirim ke desa.', 'f63db293-88d1-4f65-bc2f-68ee8be6ef42'),
  ('02', '474/226/KEC-AH/V/2026', '2026-05-23', 'Kasi Kesejahteraan Sosial', 'KUA Kecamatan Air Hitam', '474 - Sosial', 'Rekomendasi nikah', 'Biasa', 'Terkirim', 'Desa Pematang Kabau', true, 'Sudah lengkap.', 'f63db293-88d1-4f65-bc2f-68ee8be6ef42'),
  ('01', '005/225/KEC-AH/V/2026', '2026-05-21', 'Sekretariat Kecamatan', 'Seluruh Desa se-Kecamatan Air Hitam', '005 - Undangan', 'Sosialisasi penggunaan DILAN CERDAS', 'Penting', 'Terkirim', null, true, 'Edaran umum kecamatan.', 'f63db293-88d1-4f65-bc2f-68ee8be6ef42')
on conflict (agenda_no) do update
set
  letter_no = excluded.letter_no,
  letter_date = excluded.letter_date,
  source_unit = excluded.source_unit,
  destination_name = excluded.destination_name,
  archive_classification = excluded.archive_classification,
  subject = excluded.subject,
  priority = excluded.priority,
  status = excluded.status,
  village_scope = excluded.village_scope,
  notify_whatsapp = excluded.notify_whatsapp,
  notes = excluded.notes,
  created_by_account_id = excluded.created_by_account_id,
  updated_at = timezone('utc', now());

insert into public.complaints (full_name, age, phone, address, category, message, status, source_channel, created_at)
values
  ('Joko Susilo', 41, '0812-3344-5566', 'Desa Jernih, Kecamatan Air Hitam', 'Tindak Lanjut Surat', 'Mohon informasi status surat pengantar perbaikan data KTP yang sudah diajukan melalui desa.', 'Baru', 'Publik', '2026-05-30T08:00:00+00'),
  ('Ratna Sari', 29, '0857-8899-1122', 'Desa Lubuk Kepayang, Kecamatan Air Hitam', 'Pelayanan Administrasi', 'Terima kasih, proses rekomendasi nikah lebih jelas dan petugasnya ramah.', 'Selesai', 'Publik', '2026-05-28T08:00:00+00'),
  ('Bagus Hermawan', 35, '0813-2211-7788', 'Desa Bukit Suban, Kecamatan Air Hitam', 'Akses Informasi', 'Saran: tambahkan pelacakan status surat agar masyarakat tidak perlu datang berulang ke kantor kecamatan.', 'Ditindaklanjuti', 'Publik', '2026-05-26T08:00:00+00')
on conflict (full_name, phone, created_at) do nothing;

insert into public.survey_questions (question_text, sort_order)
values
  ('Persyaratan pelayanan', 1),
  ('Prosedur & kemudahan', 2),
  ('Kecepatan waktu pelayanan', 3),
  ('Kewajaran biaya / tarif', 4),
  ('Kesesuaian hasil layanan', 5),
  ('Kompetensi petugas', 6),
  ('Kesopanan & keramahan', 7),
  ('Sarana & prasarana', 8),
  ('Penanganan pengaduan', 9)
on conflict (question_text) do update
set sort_order = excluded.sort_order;

with respondents as (
  select
    ('00000000-0000-0000-0000-' || lpad(gs::text, 12, '0'))::uuid as submission_id,
    gs as seq_no,
    timezone('utc', now()) - make_interval(days => 30 - gs) as submitted_at
  from generate_series(1, 24) as gs
)
insert into public.survey_submissions (id, respondent_name, source_channel, created_at)
select
  submission_id,
  concat('Responden ', lpad(seq_no::text, 2, '0')),
  'Publik',
  submitted_at
from respondents
on conflict (id) do update
set created_at = excluded.created_at;

with respondents as (
  select
    ('00000000-0000-0000-0000-' || lpad(gs::text, 12, '0'))::uuid as submission_id,
    gs as seq_no,
    timezone('utc', now()) - make_interval(days => 30 - gs) as submitted_at
  from generate_series(1, 24) as gs
)
insert into public.survey_answers (submission_id, question_id, score, created_at)
select
  r.submission_id,
  q.id,
  case ((r.seq_no + q.sort_order) % 4)
    when 0 then 4
    when 1 then 3
    when 2 then 4
    else 3
  end as score,
  r.submitted_at
from respondents r
cross join public.survey_questions q
on conflict (submission_id, question_id) do update
set score = excluded.score,
    created_at = excluded.created_at;
