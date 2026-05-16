import { createServerClient } from "@/lib/supabase/server";

export type UserRole = 'user' | 'moderator' | 'admin' | 'superadmin';

export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return 'user';
  }

  return data.role as UserRole;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin' || role === 'superadmin';
}
