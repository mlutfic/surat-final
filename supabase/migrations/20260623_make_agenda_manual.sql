-- Nomor agenda surat masuk dan surat keluar diisi manual oleh operator.
-- Trigger auto-number dimatikan agar format lama tidak muncul lagi.

drop trigger if exists trg_assign_incoming_agenda_no on public.incoming_letters;
drop trigger if exists trg_assign_outgoing_agenda_no on public.outgoing_letters;

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
  v_agenda_no text;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;

  v_source_name := p_payload->>'source_name';
  v_target_unit := p_payload->>'target_unit';
  v_agenda_no := nullif(btrim(p_payload->>'agenda_no'), '');

  if v_actor.role <> 'Super Admin' and v_source_name <> v_actor.unit_name then
    raise exception 'Operator desa hanya boleh menginput surat dari unit desanya sendiri.';
  end if;

  if v_agenda_no is null then
    raise exception 'Nomor agenda surat masuk wajib diisi manual.';
  end if;

  if v_agenda_no !~ '^[0-9]+$' then
    raise exception 'Nomor agenda surat masuk harus berupa nomor urut angka tanpa huruf atau prefix.';
  end if;

  if nullif(p_payload->>'id', '') is null then
    begin
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
        file_name,
        file_mime_type,
        file_content_base64,
        notes,
        created_by_account_id,
        updated_by_account_id
      )
      values (
        v_agenda_no,
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
    exception
      when unique_violation then
        raise exception 'Nomor agenda surat masuk sudah digunakan.';
    end;
  else
    begin
      update public.incoming_letters
         set agenda_no = v_agenda_no,
             letter_no = p_payload->>'letter_no',
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
    exception
      when unique_violation then
        raise exception 'Nomor agenda surat masuk sudah digunakan.';
    end;
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
  v_agenda_no text;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;

  v_source_unit := p_payload->>'source_unit';
  v_agenda_no := nullif(btrim(p_payload->>'agenda_no'), '');

  if v_actor.role <> 'Super Admin' and v_source_unit <> v_actor.unit_name then
    raise exception 'Operator desa hanya boleh membuat surat keluar dari unit desanya sendiri.';
  end if;

  if v_agenda_no is null then
    raise exception 'Nomor agenda surat keluar wajib diisi manual.';
  end if;

  if v_agenda_no !~ '^[0-9]+$' then
    raise exception 'Nomor agenda surat keluar harus berupa nomor urut angka tanpa huruf atau prefix.';
  end if;

  if nullif(p_payload->>'id', '') is null then
    begin
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
        file_name,
        file_mime_type,
        file_content_base64,
        notes,
        created_by_account_id,
        updated_by_account_id
      )
      values (
        v_agenda_no,
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
    exception
      when unique_violation then
        raise exception 'Nomor agenda surat keluar sudah digunakan.';
    end;
  else
    begin
      update public.outgoing_letters
         set agenda_no = v_agenda_no,
             letter_no = p_payload->>'letter_no',
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
    exception
      when unique_violation then
        raise exception 'Nomor agenda surat keluar sudah digunakan.';
    end;
  end if;

  if v_letter.id is null then
    raise exception 'Surat keluar tidak dapat disimpan.';
  end if;

  return public.get_outgoing_letter(p_session_token, v_letter.id);
end;
$$;
