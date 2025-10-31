import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 12;

// Create a new admin user
// Note: This should only be used in development or admin setup scripts
export async function createAdminUser(username: string, password: string) {
  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        { 
          username,
          password_hash: passwordHash
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Verify admin credentials
export async function verifyAdminCredentials(username: string, password: string) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) {
      console.error('User not found or error fetching user:', error);
      return { valid: false, user: null };
    }

    const isMatch = await bcrypt.compare(password, data.password_hash);
    
    return {
      valid: isMatch,
      user: data
    };
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return { valid: false, user: null };
  }
}
