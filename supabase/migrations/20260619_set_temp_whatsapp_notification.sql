update public.office_profile
   set whatsapp_notification = '081932473871',
       updated_at = timezone('utc', now())
 where coalesce(whatsapp_notification, '') is distinct from '081932473871';
