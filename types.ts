
export type AppState = 'WELCOME' | 'ONBOARDING' | 'WHY_DIFFERENT' | 'AUTH' | 'SOLUTION_REVEAL' | 'DIAGNOSIS' | 'PAYWALL' | 'MAIN';

export type Tab = 'TODAY' | 'BRAIN_DUMP' | 'PLAN' | 'INSIGHTS';

export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface OnboardingAnswers {
  lifeFeeling: string;
  frustration: string;
  areasOfFocus: string[];
  routineLevel: ExperienceLevel;
  commonPlaces: string[]; 
  freeTimeSlots: string[];
  weekdayReality: string;
  focusBreakers: string[];
  overwhelmedBehavior: string;
  previousTools: string[];
  failureImpact: string;
  motivationStyle: string;
  successDefinition: string;
  initialBrainDump: string;
}

export interface Task {
  id: string;
  title: string;
  reason: string;
  importance: number;
  completed: boolean;
  timeOfDay?: 'MORNING' | 'AFTERNOON' | 'EVENING';
  isHabit?: boolean;
  habitFormula?: string;
  startTime?: string;
  endTime?: string;
  dueDate?: string;
}

export interface Diagnosis {
  insights: string[];
  reflection: string;
  identityName: string;
  suggestedHabits: Partial<Task>[];
  patterns: {
    behavioral: string;
    emotional: string;
    blocker: string;
    strength: string;
  };
}

export interface UserProfile {
  uid: string;
  name: string;
  email?: string;
  isSubscribed: boolean;
  onboardingData?: OnboardingAnswers;
  diagnosis?: Diagnosis;
  tasks: Task[];
}
