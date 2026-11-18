// src/types/index.ts

export type Role = 'mother' | 'father' | 'guardian' | 'pediatrician';

export type AccessLevel = 'owner' | 'editor' | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  accessLevel: AccessLevel;
}

export type ProfileMode = 'child' | 'pregnancy';

export interface ChildProfile {
  id: string;
  name: string;
  gender: 'female' | 'male';
  birthDate: string; // YYYY-MM-DD
  birthWeight: number; // in kg
  birthHeight: number; // in cm
  bloodType: string;
  allergies: string[];
  pediatricianName: string;
  clinic: string;
  avatarUrl?: string;
}

export interface PregnancyProfile {
  id: string;
  motherName: string;
  dueDate: string; // YYYY-MM-DD
  conceptionDate: string;
  currentWeek: number;
  trimester: 1 | 2 | 3;
  babyFruitComparison: string;
  babyWeightEstimate: string; // e.g. "1.1 кг"
  babyLengthEstimate: string; // e.g. "37 см"
  notes: string;
  lmpDate?: string;
  doctorName?: string;
  hospital?: string;
}

export interface GrowthMeasurement {
  id: string;
  date: string;
  ageMonths: number;
  weight: number; // kg
  height: number; // cm
  headCircumference: number; // cm
  whoWeightPercentile: number; // e.g. 50th
  whoHeightPercentile: number;
  notes?: string;
}

export type DiaryCategory = 'feeding' | 'sleep' | 'diaper' | 'temperature' | 'medication' | 'mood';

export interface HealthDiaryEntry {
  id: string;
  category: DiaryCategory;
  timestamp: string; // ISO
  loggedBy: string; // e.g. "Мама (Анна)"
  title: string;
  details: string;
  value?: string | number;
  unit?: string;
  icon?: string;
}

export type MilestoneCategory = 'motor' | 'speech' | 'social' | 'cognitive';
export type MilestoneStatus = 'achieved' | 'in_progress' | 'upcoming';

export interface Milestone {
  id: string;
  category: MilestoneCategory;
  title: string;
  description: string;
  ageRange: string; // e.g. "6-9 месяцев"
  status: MilestoneStatus;
  achievedDate?: string;
  expertTip: string;
}

export type TriageLevel = 'green' | 'yellow' | 'red';

export interface SymptomAssessment {
  id: string;
  date: string;
  childAge: string;
  symptoms: string[];
  temperature?: number;
  duration: string;
  triageLevel: TriageLevel;
  summary: string;
  observationAdvice: string[];
  whenToConsult: string;
  redFlagsNoticed: string[];
  emergencyInstructions?: string[];
}

export type DocumentCategory = 
  | 'lab_tests'      // Анализы
  | 'ultrasound'     // УЗИ
  | 'doctor_notes'   // Заключения врачей
  | 'vaccination'    // Вакцинация
  | 'prescriptions'  // Назначения
  | 'history';       // История обращений

export interface MedicalDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  date: string;
  doctorName: string;
  clinic: string;
  fileType: 'pdf' | 'jpg' | 'png';
  fileSize: string;
  status: 'verified' | 'processing' | 'pending';
  ocrExtractedText?: string;
  aiSummary?: string;
  keyFindings?: Array<{
    parameter: string;
    value: string;
    normalRange: string;
    isAbnormal: boolean;
    interpretation: string;
  }>;
  downloadUrl?: string;
}

export interface VaccinationItem {
  id: string;
  vaccineName: string;
  diseaseTarget: string;
  recommendedAge: string;
  ageInMonths: number;
  status: 'done' | 'planned' | 'overdue';
  appliedDate?: string;
  batchNumber?: string;
  clinic?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Мама' | 'Папа' | 'Бабушка' | 'Дедушка' | 'Няня' | 'Педиатр';
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  avatarUrl?: string;
  lastActive: string;
  joinedDate: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  category: 'measurement' | 'diary' | 'document' | 'symptom' | 'family';
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  structuredCard?: {
    indicatorName: string;
    meaning: string;         // 1. Что означает показатель?
    resultExplanation: string; // 2. Как понять результат?
    attentionPoints: string[]; // 3. На что обратить внимание?
    doctorQuestions: string[]; // 4. Что обсудить с врачом?
    sources: string[];
    isAlert?: boolean;
  };
  attachment?: {
    name: string;
    type: string;
    ocrPreview?: string;
  };
}
