create or replace function public.save_office_profile(p_session_token text, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor record;
  v_result jsonb;
  v_office_id uuid;
begin
  select * into v_actor from public.require_session(p_session_token) limit 1;
  if v_actor.role <> 'Super Admin' then
    raise exception 'Hanya Super Admin yang dapat mengubah profil kantor.';
  end if;

  v_office_id := coalesce(
    nullif(p_payload->>'id', '')::uuid,
    (select id from public.office_profile order by updated_at desc, id desc limit 1)
  );

  if v_office_id is null then
    raise exception 'Profil kantor tidak ditemukan.';
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
   where id = v_office_id
  returning row_to_json(office_profile)::jsonb into v_result;

  if v_result is null then
    raise exception 'Profil kantor tidak ditemukan atau gagal diperbarui.';
  end if;

  return v_result;
end;
$$;
