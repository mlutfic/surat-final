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
  ) order by i.created_at desc, i.updated_at desc, i.id desc), '[]'::jsonb)
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
  ) order by o.created_at desc, o.updated_at desc, o.id desc), '[]'::jsonb)
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
