
import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const MessageService = {
  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId1},receiver_id.eq.${userId1}`)
      .or(`sender_id.eq.${userId2},receiver_id.eq.${userId2}`)
      .order('created_at');
    
    if (error) {
      console.error('Error fetching conversation:', error);
      return [];
    }
    
    return data || [];
  },
  
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error sending message:', error);
      return null;
    }
    
    return data;
  },
  
  async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);
    
    if (error) {
      console.error('Error marking message as read:', error);
    }
  },
  
  subscribeToMessages(callback: (message: Message) => void) {
    return supabase
      .channel('message-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  }
};
