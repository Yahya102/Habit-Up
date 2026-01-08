
import { OnboardingAnswers, UserProfile, Diagnosis } from "../types";
import { supabase } from "./supabaseClient";

/**
 * Syncs the user profile to the Supabase 'profiles' table.
 */
export async function syncUserProfile(profile: UserProfile) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: profile.uid,
      name: profile.name,
      email: profile.email,
      is_subscribed: profile.isSubscribed,
      onboarding_data: {
        ...profile.onboardingData,
        saved_diagnosis: profile.diagnosis // Persist diagnosis inside the JSONB column
      },
      tasks: profile.tasks
    })
    .select()
    .single();

  if (error) {
    console.error("Error syncing profile:", error);
    throw error;
  }
  return data;
}

export async function signUpUser(name: string, email: string, pass: string, onboardingData?: OnboardingAnswers): Promise<UserProfile> {
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

  await syncUserProfile(profile);
  return profile;
}

export async function loginUser(email: string, pass: string): Promise<UserProfile> {
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
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
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
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
