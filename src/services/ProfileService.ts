
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  bio: string | null;
  status: string;
  last_online: string;
  created_at: string;
  updated_at: string;
}

export const ProfileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  },
  
  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('username');
    
    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
    
    return data || [];
  },
  
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  subscribeToProfileChanges(callback: (profile: Profile) => void) {
    return supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          callback(payload.new as Profile);
        }
      )
      .subscribe();
  }
};
