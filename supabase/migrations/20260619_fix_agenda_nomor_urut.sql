-- Ubah nomor agenda surat masuk dan surat keluar menjadi nomor urut sederhana:
-- surat masuk 01, 02, 03, ... dan surat keluar 01, 02, 03, ...

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

with numbered as (
  select
    id,
    lpad(row_number() over (order by letter_date asc, created_at asc, id asc)::text, 2, '0') as next_agenda_no
  from public.incoming_letters
)
update public.incoming_letters i
   set agenda_no = numbered.next_agenda_no,
       updated_at = timezone('utc', now())
  from numbered
 where i.id = numbered.id
   and i.agenda_no is distinct from numbered.next_agenda_no;

with numbered as (
  select
    id,
    lpad(row_number() over (order by letter_date asc, created_at asc, id asc)::text, 2, '0') as next_agenda_no
  from public.outgoing_letters
)
update public.outgoing_letters o
   set agenda_no = numbered.next_agenda_no,
       updated_at = timezone('utc', now())
  from numbered
 where o.id = numbered.id
   and o.agenda_no is distinct from numbered.next_agenda_no;

select setval(
  'public.incoming_agenda_seq',
  greatest((select count(*)::bigint from public.incoming_letters), 1),
  exists(select 1 from public.incoming_letters)
);

select setval(
  'public.outgoing_agenda_seq',
  greatest((select count(*)::bigint from public.outgoing_letters), 1),
  exists(select 1 from public.outgoing_letters)
);
