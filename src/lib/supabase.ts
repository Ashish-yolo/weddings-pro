import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      weddings: {
        Row: {
          id: string
          user_id: string
          title: string
          bride_name: string | null
          groom_name: string | null
          wedding_date: string
          wedding_time: string | null
          venue: string | null
          address: string | null
          description: string | null
          photo_password: string
          public_url_slug: string
          is_active: boolean
          created_at: string
          updated_at: string
          cover_photo_url: string | null
          cover_photo_path: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          bride_name?: string | null
          groom_name?: string | null
          wedding_date: string
          wedding_time?: string | null
          venue?: string | null
          address?: string | null
          description?: string | null
          photo_password: string
          public_url_slug: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          cover_photo_url?: string | null
          cover_photo_path?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          bride_name?: string | null
          groom_name?: string | null
          wedding_date?: string
          wedding_time?: string | null
          venue?: string | null
          address?: string | null
          description?: string | null
          photo_password?: string
          public_url_slug?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          cover_photo_url?: string | null
          cover_photo_path?: string | null
        }
      }
      guests: {
        Row: {
          id: string
          wedding_id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          plus_one_count: number
          dietary_restrictions: string | null
          song_requests: string | null
          rsvp_status: 'pending' | 'accepted' | 'declined'
          attendance_intention: 'accepted' | 'declined'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          plus_one_count?: number
          dietary_restrictions?: string | null
          song_requests?: string | null
          rsvp_status?: 'pending' | 'accepted' | 'declined'
          attendance_intention?: 'accepted' | 'declined'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          plus_one_count?: number
          dietary_restrictions?: string | null
          song_requests?: string | null
          rsvp_status?: 'pending' | 'accepted' | 'declined'
          attendance_intention?: 'accepted' | 'declined'
          created_at?: string
          updated_at?: string
        }
      }
      plus_ones: {
        Row: {
          id: string
          guest_id: string
          first_name: string
          last_name: string
          dietary_restrictions: string | null
          song_requests: string | null
          created_at: string
        }
        Insert: {
          id?: string
          guest_id: string
          first_name: string
          last_name: string
          dietary_restrictions?: string | null
          song_requests?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          guest_id?: string
          first_name?: string
          last_name?: string
          dietary_restrictions?: string | null
          song_requests?: string | null
          created_at?: string
        }
      }
      love_story_events: {
        Row: {
          id: string
          wedding_id: string
          title: string
          description: string | null
          event_date: string | null
          icon: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          title: string
          description?: string | null
          event_date?: string | null
          icon?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          title?: string
          description?: string | null
          event_date?: string | null
          icon?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          wedding_id: string
          file_name: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          uploaded_by_guest: string | null
          uploaded_at: string
          approval_status: string | null
          photo_type: string | null
        }
        Insert: {
          id?: string
          wedding_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by_guest?: string | null
          uploaded_at?: string
          approval_status?: string | null
          photo_type?: string | null
        }
        Update: {
          id?: string
          wedding_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by_guest?: string | null
          uploaded_at?: string
          approval_status?: string | null
          photo_type?: string | null
        }
      }
    }
  }
}