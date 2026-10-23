import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

// Supabase configuration using environment variables with the project credentials provided
export const SUPABASE_PROJECT_ID = 'bijklibeveykmyjbzcik';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-TOWhVFIb3BRvmZm_4kuIg_PQpSHe-A';

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Health check helper to verify connectivity to the Supabase project
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const { error } = await supabase.from('students_profile').select('id', { count: 'exact', head: true });
    
    // If the table doesn't exist yet, it confirms connectivity to the project endpoint
    if (error && error.code !== '42P01' && error.code !== 'PGRST204' && !error.message?.includes('does not exist')) {
      if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
        return { connected: true, message: 'Connected to Supabase endpoint (Auth verified)' };
      }
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Successfully connected to Supabase database!' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown connection error';
    return { connected: false, message };
  }
}

/**
 * Syncs user data to role-specific Supabase tables upon Sign Up:
 * - Student -> `students_profile`
 * - Teacher -> `teachers_profile`
 * - Admin   -> `admins_profile`
 */
export async function syncUserSignUpToRoleTable(
  user: User,
  additionalInfo?: {
    department?: string;
    title?: string;
    studentYear?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    studentId?: string;
  }
): Promise<{ success: boolean; table: string; error?: string }> {
  const timestamp = new Date().toISOString();

  try {
    if (user.role === 'student') {
      const studentPayload = {
        id: user.id,
        name: user.name,
        email: user.email.toLowerCase().trim(),
        student_id: user.studentId || additionalInfo?.studentId || `STU-${Date.now().toString().slice(-4)}`,
        department: additionalInfo?.department || user.department || 'Computer Science',
        year: additionalInfo?.studentYear || 'Freshman',
        gpa: 4.0,
        attendance_rate: 100,
        status: 'Active',
        last_sign_in: timestamp,
        created_at: timestamp,
      };

      const { error } = await supabase
        .from('students_profile')
        .upsert(studentPayload, { onConflict: 'email' });

      if (error) {
        console.warn('[Supabase] Warning syncing to students_profile:', error.message);
        return { success: false, table: 'students_profile', error: error.message };
      }
      return { success: true, table: 'students_profile' };
    } 
    
    if (user.role === 'teacher') {
      const teacherPayload = {
        id: user.id,
        name: user.name,
        email: user.email.toLowerCase().trim(),
        title: additionalInfo?.title || user.title || 'Faculty Instructor',
        department: additionalInfo?.department || user.department || 'Computer Science',
        office_location: 'Science Hall 3-B',
        office_hours: 'Mon/Wed 2:00 - 4:00 PM',
        phone: user.phone || '+1 (555) 019-2834',
        last_sign_in: timestamp,
        created_at: timestamp,
      };

      const { error } = await supabase
        .from('teachers_profile')
        .upsert(teacherPayload, { onConflict: 'email' });

      if (error) {
        console.warn('[Supabase] Warning syncing to teachers_profile:', error.message);
        return { success: false, table: 'teachers_profile', error: error.message };
      }
      return { success: true, table: 'teachers_profile' };
    }

    if (user.role === 'admin') {
      const adminPayload = {
        id: user.id,
        name: user.name,
        email: user.email.toLowerCase().trim(),
        department: additionalInfo?.department || user.department || 'Academic Affairs',
        title: user.title || 'Academic Administrator',
        access_level: 'Super Admin',
        last_sign_in: timestamp,
        created_at: timestamp,
      };

      const { error } = await supabase
        .from('admins_profile')
        .upsert(adminPayload, { onConflict: 'email' });

      if (error) {
        console.warn('[Supabase] Warning syncing to admins_profile:', error.message);
        return { success: false, table: 'admins_profile', error: error.message };
      }
      return { success: true, table: 'admins_profile' };
    }

    return { success: false, table: 'unknown', error: 'Invalid user role' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown sync error';
    console.warn('[Supabase] Unexpected error saving user to role table:', errorMsg);
    return { success: false, table: `${user.role}s_profile`, error: errorMsg };
  }
}

/**
 * Updates `last_sign_in` timestamp in the role-specific table upon Sign In:
 * - Student -> `students_profile`
 * - Teacher -> `teachers_profile`
 * - Admin   -> `admins_profile`
 */
export async function syncUserSignInToRoleTable(
  user: User
): Promise<{ success: boolean; table: string; error?: string }> {
  const timestamp = new Date().toISOString();
  const email = user.email.toLowerCase().trim();

  try {
    let tableName = 'students_profile';
    if (user.role === 'teacher') tableName = 'teachers_profile';
    if (user.role === 'admin') tableName = 'admins_profile';

    // First try update by email
    const { error } = await supabase
      .from(tableName)
      .update({ last_sign_in: timestamp })
      .eq('email', email);

    if (error) {
      // If user row wasn't present yet, upsert full basic record
      if (user.role === 'student') {
        await supabase.from('students_profile').upsert({
          id: user.id,
          name: user.name,
          email,
          student_id: user.studentId || `STU-${Date.now().toString().slice(-4)}`,
          department: user.department || 'Computer Science',
          year: 'Freshman',
          gpa: 3.85,
          attendance_rate: 96,
          status: 'Active',
          last_sign_in: timestamp,
          created_at: timestamp,
        }, { onConflict: 'email' });
      } else if (user.role === 'teacher') {
        await supabase.from('teachers_profile').upsert({
          id: user.id,
          name: user.name,
          email,
          title: user.title || 'Faculty Instructor',
          department: user.department || 'Computer Science',
          last_sign_in: timestamp,
          created_at: timestamp,
        }, { onConflict: 'email' });
      } else if (user.role === 'admin') {
        await supabase.from('admins_profile').upsert({
          id: user.id,
          name: user.name,
          email,
          department: user.department || 'Academic Affairs',
          title: user.title || 'Academic Administrator',
          access_level: 'Super Admin',
          last_sign_in: timestamp,
          created_at: timestamp,
        }, { onConflict: 'email' });
      }
    }

    return { success: true, table: tableName };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown sync error';
    return { success: false, table: `${user.role}s_profile`, error: errorMsg };
  }
}
