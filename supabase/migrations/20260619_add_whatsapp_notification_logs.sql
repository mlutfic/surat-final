create table if not exists public.whatsapp_notification_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('incoming_created')),
  incoming_letter_id uuid not null references public.incoming_letters(id) on delete cascade,
  notification_channel text not null default 'whatsapp',
  target_number text not null,
  provider text not null,
  status text not null default 'pending' check (status in ('pending', 'queued', 'failed', 'skipped')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  provider_message_id text,
  provider_request_id text,
  error_message text,
  provider_response jsonb,
  request_context jsonb not null default '{}'::jsonb,
  requested_by_account_id uuid references public.accounts(id) on delete set null,
  queued_at timestamptz,
  last_attempt_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (event_type, incoming_letter_id)
);

create index if not exists whatsapp_notification_logs_letter_idx
on public.whatsapp_notification_logs (incoming_letter_id, event_type);

create index if not exists whatsapp_notification_logs_status_idx
on public.whatsapp_notification_logs (status, updated_at desc);

drop trigger if exists trg_touch_whatsapp_notification_logs on public.whatsapp_notification_logs;
create trigger trg_touch_whatsapp_notification_logs
before update on public.whatsapp_notification_logs
for each row execute function public.touch_updated_at();
