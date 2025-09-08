// supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root', // Service is available app-wide
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseServiceKey
    );
  }

  // Example: fetch all rows from a given table
  async getAllRows(tableName: string) {
    const { data, error } = await this.supabase.from(tableName).select('*');
    if (error) throw error;
    return data;
  }

  async countAllRows(tableName: string) {
    const { count } = await this.supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
    return count;
  }

  // Example: insert a row
  async insertRow(tableName: string, newRow: any) {
    const { data, error } = await this.supabase.from(tableName).insert([newRow]);
    if (error) throw error;
    return data;
  }

  // Example: sign up a user
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  // Add more methods (signIn, signOut, updates, etc.) as needed.
}
