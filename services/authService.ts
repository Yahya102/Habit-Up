
import { OnboardingAnswers, UserProfile } from "../types";

const LOCAL_STORAGE_KEY = 'ai_executive_brain_users';

function getLocalUsers() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  const users = data ? JSON.parse(data) : {};
  
  // Bootstrap with a demo account if it's the first time
  if (Object.keys(users).length === 0) {
    const demoEmail = 'demo@ai.com';
    users[demoEmail] = {
      uid: 'user_demo_123',
      name: 'Executive Demo',
      email: demoEmail,
      isSubscribed: true,
      tasks: [
        { id: '1', title: 'Review Quarterly Strategy', reason: 'High impact roadmap alignment', importance: 5, completed: false, timeOfDay: 'MORNING' },
        { id: '2', title: 'Brain Dump: New Product Vision', reason: 'Clear cognitive debt', importance: 4, completed: false, timeOfDay: 'AFTERNOON' }
      ]
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
  }
  
  return users;
}

function saveLocalUser(email: string, profile: any) {
  const users = getLocalUsers();
  users[email] = profile;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
}

export async function signUpUser(name: string, email: string, pass: string, onboardingData?: OnboardingAnswers): Promise<UserProfile> {
  await new Promise(r => setTimeout(r, 600));
  
  const users = getLocalUsers();
  if (users[email]) {
    throw new Error("An account with this email already exists.");
  }

  const uid = 'user_' + Math.random().toString(36).substr(2, 9);
  const profileData: UserProfile = {
    uid,
    name,
    email,
    isSubscribed: false,
    onboardingData,
    tasks: []
  };
  
  saveLocalUser(email, profileData);
  return profileData;
}

export async function loginUser(email: string, pass: string): Promise<UserProfile> {
  await new Promise(r => setTimeout(r, 600));

  const users = getLocalUsers();
  const found = users[email] as UserProfile;
  
  if (found) {
    return found;
  }
  
  throw new Error("No account found with this email. Please sign up.");
}

export async function updateUserProfile(email: string, data: Partial<UserProfile>) {
  const users = getLocalUsers();
  if (users[email]) {
    users[email] = { ...users[email], ...data };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
  }
}
