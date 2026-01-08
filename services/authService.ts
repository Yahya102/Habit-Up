
import { OnboardingAnswers, UserProfile, Diagnosis } from "../types";
import { supabase } from "./supabaseClient";

/**
 * Extracts a human-readable message from Supabase/Postgrest error objects.
 */
function getErrorMessage(error: any): string {
  if (!error) return "Unknown error occurred";
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error_description) return error.error_description;
  if (error.code === '23505') return "Account already exists.";
  return JSON.stringify(error);
}

/**
 * Syncs the user profile to the Supabase 'profiles' table.
 */
export async function syncUserProfile(profile: UserProfile) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.uid,
        name: profile.name,
        email: profile.email,
        is_subscribed: profile.isSubscribed,
        onboarding_data: {
          ...(profile.onboardingData || {}),
          saved_diagnosis: profile.diagnosis 
        },
        tasks: profile.tasks
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    const msg = getErrorMessage(err);
    console.error("syncUserProfile error:", msg);
    throw new Error(msg);
  }
}

export async function signUpUser(name: string, email: string, pass: string, onboardingData?: OnboardingAnswers): Promise<UserProfile> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Sign up failed - no user returned.");

    const profile: UserProfile = {
      uid: authData.user.id,
      name,
      email,
      isSubscribed: false,
      onboardingData,
      tasks: []
    };

    // The database trigger creates the row automatically.
    // We only attempt to sync onboarding data if the session is immediately active.
    if (authData.session) {
      try {
        await syncUserProfile(profile);
      } catch (syncErr) {
        console.warn("Initial sync skipped, will retry on main screen:", syncErr);
      }
    }

    return profile;
  } catch (err) {
    const msg = getErrorMessage(err);
    console.error("signUpUser error:", msg);
    throw new Error(msg);
  }
}

export async function loginUser(email: string, pass: string): Promise<UserProfile> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Login failed - no user returned.");

    const { data: profileRow, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    const onboardingObj = profileRow?.onboarding_data || {};
    
    return {
      uid: authData.user.id,
      name: profileRow?.name || authData.user.user_metadata?.full_name || 'User',
      email: authData.user.email,
      isSubscribed: profileRow?.is_subscribed || false,
      onboardingData: onboardingObj,
      diagnosis: onboardingObj.saved_diagnosis,
      tasks: profileRow?.tasks || []
    };
  } catch (err) {
    const msg = getErrorMessage(err);
    console.error("loginUser error:", msg);
    throw new Error(msg);
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const updatePayload: any = {
      name: data.name,
      is_subscribed: data.isSubscribed,
      tasks: data.tasks
    };

    if (data.onboardingData || data.diagnosis) {
      updatePayload.onboarding_data = {
        ...(data.onboardingData || {}),
        saved_diagnosis: data.diagnosis
      };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', uid);

    if (error) throw error;
  } catch (err) {
    const msg = getErrorMessage(err);
    console.error("updateUserProfile error:", msg);
    throw new Error(msg);
  }
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(getErrorMessage(error));
}
