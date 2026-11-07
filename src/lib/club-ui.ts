import { supabase } from '@/lib/supabase';
export type ClubMember={id:string;name:string;club_role:string;photo_url:string|null;sort_order:number;is_active:boolean};
export type SocialLink={id:string;platform:string|null;url:string;is_active:boolean};
// One signed-URL request for all portraits instead of one per member.
export async function fetchMembers(): Promise<ClubMember[]> {
  const { data, error } = await supabase
    .from('club_members')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  const members = (data ?? []) as ClubMember[];

  const paths = members
    .map((m) => m.photo_url)
    .filter((url): url is string => Boolean(url) && !url!.startsWith('https://'));
  if (!paths.length) return members;

  const { data: signed, error: signError } = await supabase.storage
    .from('member-portraits')
    .createSignedUrls(paths, 3600);
  const urlByPath = new Map<string, string>();
  if (!signError) {
    for (const item of signed ?? []) {
      if (item.path && item.signedUrl) urlByPath.set(item.path, item.signedUrl);
    }
  }

  return members.map((m) => {
    if (!m.photo_url || m.photo_url.startsWith('https://')) return m;
    return { ...m, photo_url: urlByPath.get(m.photo_url) ?? null };
  });
}

export async function fetchSocialLinks():Promise<SocialLink[]> {const {data,error}=await supabase.from('external_links').select('id,platform,url,is_active').in('platform',['linkedin','instagram','telegram']).eq('is_active',true);if(error)throw error;return data??[];}
