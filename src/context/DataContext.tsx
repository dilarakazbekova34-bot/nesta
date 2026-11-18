// src/context/DataContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ChildProfile, 
  PregnancyProfile, 
  GrowthMeasurement, 
  HealthDiaryEntry, 
  Milestone, 
  MilestoneStatus,
  MedicalDocument, 
  VaccinationItem, 
  FamilyMember, 
  ActivityLog,
  AiChatMessage,
  SymptomAssessment
} from '../types';
import { 
  INITIAL_CHILD, 
  INITIAL_PREGNANCY, 
  INITIAL_GROWTH_DATA, 
  INITIAL_DIARY_ENTRIES, 
  INITIAL_MILESTONES, 
  INITIAL_DOCUMENTS, 
  INITIAL_VACCINATIONS, 
  INITIAL_FAMILY_MEMBERS, 
  INITIAL_ACTIVITY_LOGS 
} from '../data/mockData';
import { analyzeMedicalQuery } from '../services/aiMedicalEngine';
import { useAuth } from './AuthContext';

interface DataContextType {
  child: ChildProfile;
  pregnancy: PregnancyProfile;
  updateChild: (updated: Partial<ChildProfile>) => void;
  updatePregnancy: (updated: Partial<PregnancyProfile>) => void;
  
  growthData: GrowthMeasurement[];
  addMeasurement: (measurement: Omit<GrowthMeasurement, 'id' | 'whoWeightPercentile' | 'whoHeightPercentile'>) => void;

  diaryEntries: HealthDiaryEntry[];
  addDiaryEntry: (entry: Omit<HealthDiaryEntry, 'id' | 'timestamp' | 'loggedBy'>) => void;
  deleteDiaryEntry: (id: string) => void;

  milestones: Milestone[];
  toggleMilestoneStatus: (id: string) => void;

  documents: MedicalDocument[];
  addDocument: (doc: Omit<MedicalDocument, 'id' | 'status'>) => void;
  deleteDocument: (id: string) => void;

  vaccinations: VaccinationItem[];
  toggleVaccinationStatus: (id: string) => void;

  familyMembers: FamilyMember[];
  inviteMember: (email: string, name: string, relationship: FamilyMember['relationship'], role: FamilyMember['role']) => void;
  updateMemberRole: (id: string, newRole: FamilyMember['role']) => void;
  removeMember: (id: string) => void;

  activityLogs: ActivityLog[];
  logActivity: (action: string, category: ActivityLog['category']) => void;

  symptomAssessments: SymptomAssessment[];
  saveAssessment: (assessment: Omit<SymptomAssessment, 'id' | 'date'>) => void;

  aiMessages: AiChatMessage[];
  isAiTyping: boolean;
  sendAiMessage: (text: string, attachedFile?: { name: string; type: string; content?: string }) => void;
  clearAiChat: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [child, setChild] = useState<ChildProfile>(() => {
    const saved = localStorage.getItem('nesta_child');
    return saved ? JSON.parse(saved) : INITIAL_CHILD;
  });

  const [pregnancy, setPregnancy] = useState<PregnancyProfile>(() => {
    const saved = localStorage.getItem('nesta_pregnancy');
    return saved ? JSON.parse(saved) : INITIAL_PREGNANCY;
  });

  const [growthData, setGrowthData] = useState<GrowthMeasurement[]>(() => {
    const saved = localStorage.getItem('nesta_growth');
    return saved ? JSON.parse(saved) : INITIAL_GROWTH_DATA;
  });

  const [diaryEntries, setDiaryEntries] = useState<HealthDiaryEntry[]>(() => {
    const saved = localStorage.getItem('nesta_diary');
    return saved ? JSON.parse(saved) : INITIAL_DIARY_ENTRIES;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('nesta_milestones');
    return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
  });

  const [documents, setDocuments] = useState<MedicalDocument[]>(() => {
    const saved = localStorage.getItem('nesta_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [vaccinations, setVaccinations] = useState<VaccinationItem[]>(() => {
    const saved = localStorage.getItem('nesta_vaccinations');
    return saved ? JSON.parse(saved) : INITIAL_VACCINATIONS;
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('nesta_family');
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('nesta_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [symptomAssessments, setSymptomAssessments] = useState<SymptomAssessment[]>(() => {
    const saved = localStorage.getItem('nesta_symptoms');
    return saved ? JSON.parse(saved) : [];
  });

  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>(() => {
    return [
      {
        id: 'msg_welcome',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `Здравствуйте, ${user?.name || 'Анна'}! Я медицинский AI-ассистент NESTA. 

Я помогу:
• Расшифровать результаты анализов и УЗИ простым и понятным языком
• Объяснить медицинские термины и лабораторные референсы
• Сформулировать четкие вопросы для обсуждения с лечащим врачом
• Подсказать доказательные клинические рекомендации ВОЗ и Союза педиатров

Вы можете задать вопрос или прикрепить скан/фото документа для анализа. Чем я могу помочь сегодня?`
      }
    ];
  });

  const [isAiTyping, setIsAiTyping] = useState(false);

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('nesta_child', JSON.stringify(child)); }, [child]);
  useEffect(() => { localStorage.setItem('nesta_pregnancy', JSON.stringify(pregnancy)); }, [pregnancy]);
  useEffect(() => { localStorage.setItem('nesta_growth', JSON.stringify(growthData)); }, [growthData]);
  useEffect(() => { localStorage.setItem('nesta_diary', JSON.stringify(diaryEntries)); }, [diaryEntries]);
  useEffect(() => { localStorage.setItem('nesta_milestones', JSON.stringify(milestones)); }, [milestones]);
  useEffect(() => { localStorage.setItem('nesta_docs', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('nesta_vaccinations', JSON.stringify(vaccinations)); }, [vaccinations]);
  useEffect(() => { localStorage.setItem('nesta_family', JSON.stringify(familyMembers)); }, [familyMembers]);
  useEffect(() => { localStorage.setItem('nesta_logs', JSON.stringify(activityLogs)); }, [activityLogs]);
  useEffect(() => { localStorage.setItem('nesta_symptoms', JSON.stringify(symptomAssessments)); }, [symptomAssessments]);

  const logActivity = (action: string, category: ActivityLog['category']) => {
    const newLog: ActivityLog = {
      id: 'act_' + Date.now(),
      userId: user?.id || 'usr_01',
      userName: `${user?.name || 'Пользователь'} (${user?.role === 'father' ? 'Папа' : 'Мама'})`,
      action,
      timestamp: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      category
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const updateChild = (updated: Partial<ChildProfile>) => {
    setChild(prev => ({ ...prev, ...updated }));
    logActivity('Обновлен профиль ребенка', 'family');
  };

  const updatePregnancy = (updated: Partial<PregnancyProfile>) => {
    setPregnancy(prev => ({ ...prev, ...updated }));
    logActivity('Обновлены данные беременности', 'family');
  };

  const addMeasurement = (m: Omit<GrowthMeasurement, 'id' | 'whoWeightPercentile' | 'whoHeightPercentile'>) => {
    const newEntry: GrowthMeasurement = {
      ...m,
      id: 'gm_' + Date.now(),
      whoWeightPercentile: 51,
      whoHeightPercentile: 52
    };
    setGrowthData(prev => [...prev, newEntry]);
    logActivity(`Внесено новое измерение: вес ${m.weight} кг, рост ${m.height} см`, 'measurement');
  };

  const addDiaryEntry = (entry: Omit<HealthDiaryEntry, 'id' | 'timestamp' | 'loggedBy'>) => {
    const newEntry: HealthDiaryEntry = {
      ...entry,
      id: 'de_' + Date.now(),
      timestamp: new Date().toISOString(),
      loggedBy: `${user?.name || 'Анна'} (${user?.role === 'father' ? 'Папа' : 'Мама'})`
    };
    setDiaryEntries(prev => [newEntry, ...prev]);
    logActivity(`Запись в дневник: ${entry.title}`, 'diary');
  };

  const deleteDiaryEntry = (id: string) => {
    setDiaryEntries(prev => prev.filter(e => e.id !== id));
  };

  const toggleMilestoneStatus = (id: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus: MilestoneStatus = m.status === 'achieved' ? 'in_progress' : 'achieved';
        const updated = {
          ...m,
          status: nextStatus,
          achievedDate: nextStatus === 'achieved' ? new Date().toISOString().split('T')[0] : undefined
        };
        logActivity(`${nextStatus === 'achieved' ? 'Достигнут' : 'Изменен'} навык: ${m.title}`, 'diary');
        return updated;
      }
      return m;
    }));
  };

  const addDocument = (doc: Omit<MedicalDocument, 'id' | 'status'>) => {
    const newDoc: MedicalDocument = {
      ...doc,
      id: 'doc_' + Date.now(),
      status: 'verified'
    };
    setDocuments(prev => [newDoc, ...prev]);
    logActivity(`Загружен медицинский документ: ${doc.title}`, 'document');
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const toggleVaccinationStatus = (id: string) => {
    setVaccinations(prev => prev.map(v => {
      if (v.id === id) {
        const isDone = v.status === 'done';
        const nextStatus = isDone ? 'planned' : 'done';
        logActivity(`Изменен статус вакцины ${v.vaccineName} на ${nextStatus === 'done' ? 'выполнена' : 'запланирована'}`, 'document');
        return {
          ...v,
          status: nextStatus,
          appliedDate: nextStatus === 'done' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return v;
    }));
  };

  const inviteMember = (email: string, name: string, relationship: FamilyMember['relationship'], role: FamilyMember['role']) => {
    const newMember: FamilyMember = {
      id: 'fm_' + Date.now(),
      name,
      email,
      relationship,
      role,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Только что приглашен(а)',
      avatarUrl: relationship === 'Папа' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    };
    setFamilyMembers(prev => [...prev, newMember]);
    logActivity(`Отправлено приглашение для ${name} (${relationship}) с ролью ${role}`, 'family');
  };

  const updateMemberRole = (id: string, newRole: FamilyMember['role']) => {
    setFamilyMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    logActivity(`Обновлены права доступа для участника семьи`, 'family');
  };

  const removeMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
    logActivity(`Участник удален из семейного доступа`, 'family');
  };

  const saveAssessment = (assessment: Omit<SymptomAssessment, 'id' | 'date'>) => {
    const newAssessment: SymptomAssessment = {
      ...assessment,
      id: 'symp_' + Date.now(),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
    };
    setSymptomAssessments(prev => [newAssessment, ...prev]);
    logActivity(`Проверка симптомов: уровень ${assessment.triageLevel.toUpperCase()}`, 'symptom');
  };

  const sendAiMessage = (text: string, attachedFile?: { name: string; type: string; content?: string }) => {
    const userMsg: AiChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text,
      attachment: attachedFile ? {
        name: attachedFile.name,
        type: attachedFile.type,
        ocrPreview: attachedFile.content
      } : undefined
    };

    setAiMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);

    setTimeout(() => {
      const structuredAnalysis = analyzeMedicalQuery(text, attachedFile?.name);
      const assistantMsg: AiChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `Я проанализировал ваш запрос по медицинским базам и клиническим руководствам. Ниже представлена структурированная расшифровка:`,
        structuredCard: structuredAnalysis
      };
      setAiMessages(prev => [...prev, assistantMsg]);
      setIsAiTyping(false);
    }, 1000);
  };

  const clearAiChat = () => {
    setAiMessages([
      {
        id: 'msg_welcome_' + Date.now(),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `Чат очищен. Я готов ответить на любые новые вопросы о здоровье мамы и малыша.`
      }
    ]);
  };

  return (
    <DataContext.Provider value={{
      child,
      pregnancy,
      updateChild,
      updatePregnancy,
      growthData,
      addMeasurement,
      diaryEntries,
      addDiaryEntry,
      deleteDiaryEntry,
      milestones,
      toggleMilestoneStatus,
      documents,
      addDocument,
      deleteDocument,
      vaccinations,
      toggleVaccinationStatus,
      familyMembers,
      inviteMember,
      updateMemberRole,
      removeMember,
      activityLogs,
      logActivity,
      symptomAssessments,
      saveAssessment,
      aiMessages,
      isAiTyping,
      sendAiMessage,
      clearAiChat
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
