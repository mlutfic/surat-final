-- Pastikan nomor agenda mengikuti urutan input data.
-- Surat yang diinput paling baru harus mendapat nomor agenda paling akhir.

with numbered as (
  select
    id,
    lpad(row_number() over (order by created_at asc, id asc)::text, 2, '0') as next_agenda_no
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
    lpad(row_number() over (order by created_at asc, id asc)::text, 2, '0') as next_agenda_no
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
  greatest((select coalesce(max(agenda_no::bigint), 0) from public.incoming_letters), 1),
  exists(select 1 from public.incoming_letters)
);

select setval(
  'public.outgoing_agenda_seq',
  greatest((select coalesce(max(agenda_no::bigint), 0) from public.outgoing_letters), 1),
  exists(select 1 from public.outgoing_letters)
);
