update public.office_profile
   set whatsapp_notification = '081367236229',
       updated_at = timezone('utc', now())
 where coalesce(whatsapp_notification, '') is distinct from '081367236229';
