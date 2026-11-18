// src/data/mockData.ts
import { 
  ChildProfile, 
  PregnancyProfile, 
  GrowthMeasurement, 
  HealthDiaryEntry, 
  Milestone, 
  MedicalDocument, 
  VaccinationItem, 
  FamilyMember, 
  ActivityLog,
  UserProfile
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_01',
  name: 'Анна Сабитова',
  email: 'anna.sabitova@example.com',
  role: 'mother',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
  accessLevel: 'owner'
};

export const INITIAL_CHILD: ChildProfile = {
  id: 'ch_01',
  name: 'Алиса',
  gender: 'female',
  birthDate: '2026-03-12', // 8 месяцев
  birthWeight: 3.250,
  birthHeight: 51,
  bloodType: 'A (II) Rh+',
  allergies: ['Нет установленных аллергий'],
  pediatricianName: 'Д-р Касымова Алия Сериковна',
  clinic: 'Центр педиатрии и семейного здоровья «Мейірім», г. Алматы',
  avatarUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=256'
};

export const INITIAL_PREGNANCY: PregnancyProfile = {
  id: 'preg_01',
  motherName: 'Анна Сабитова',
  dueDate: '2027-02-05',
  conceptionDate: '2026-05-01',
  currentWeek: 28,
  trimester: 3,
  babyFruitComparison: 'Баклажан 🍆',
  babyWeightEstimate: '1 100 г',
  babyLengthEstimate: '37.5 см',
  notes: 'Третий триместр. Плановый скрининг УЗИ назначен на 31-ю неделю. Глюкозотолерантный тест в норме.'
};

export const INITIAL_GROWTH_DATA: GrowthMeasurement[] = [
  { id: 'gm_0', date: '2026-03-12', ageMonths: 0, weight: 3.25, height: 51.0, headCircumference: 35.0, whoWeightPercentile: 50, whoHeightPercentile: 52, notes: 'Выписка из роддома' },
  { id: 'gm_1', date: '2026-04-12', ageMonths: 1, weight: 4.10, height: 54.2, headCircumference: 36.8, whoWeightPercentile: 48, whoHeightPercentile: 50, notes: 'Плановый осмотр 1 месяц' },
  { id: 'gm_2', date: '2026-05-12', ageMonths: 2, weight: 5.00, height: 57.5, headCircumference: 38.4, whoWeightPercentile: 51, whoHeightPercentile: 52, notes: 'Отличная прибавка на ГВ' },
  { id: 'gm_3', date: '2026-06-12', ageMonths: 3, weight: 5.80, height: 60.1, headCircumference: 39.8, whoWeightPercentile: 52, whoHeightPercentile: 53, notes: 'Держит голову уверенно' },
  { id: 'gm_4', date: '2026-07-12', ageMonths: 4, weight: 6.45, height: 62.5, headCircumference: 41.0, whoWeightPercentile: 50, whoHeightPercentile: 51, notes: 'Переворачивается со спинки на живот' },
  { id: 'gm_5', date: '2026-08-12', ageMonths: 5, weight: 7.05, height: 64.8, headCircumference: 42.1, whoWeightPercentile: 49, whoHeightPercentile: 50, notes: 'Начало пищевого интереса' },
  { id: 'gm_6', date: '2026-09-12', ageMonths: 6, weight: 7.60, height: 66.8, headCircumference: 43.0, whoWeightPercentile: 52, whoHeightPercentile: 52, notes: 'Введение прикорма (кабачок, брокколи)' },
  { id: 'gm_7', date: '2026-10-12', ageMonths: 7, weight: 8.10, height: 68.6, headCircumference: 43.8, whoWeightPercentile: 51, whoHeightPercentile: 51, notes: 'Ползает по-пластунски' },
  { id: 'gm_8', date: '2026-11-10', ageMonths: 8, weight: 8.55, height: 70.2, headCircumference: 44.5, whoWeightPercentile: 53, whoHeightPercentile: 53, notes: 'Садится самостоятельно, лепечет' },
];

export const WHO_STANDARDS_GIRLS = [
  { age: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2, height_p50: 49.1 },
  { age: 1, p3: 3.2, p15: 3.6, p50: 4.2, p85: 4.8, p97: 5.5, height_p50: 53.7 },
  { age: 2, p3: 3.9, p15: 4.5, p50: 5.1, p85: 5.8, p97: 6.6, height_p50: 57.1 },
  { age: 3, p3: 4.5, p15: 5.2, p50: 5.8, p85: 6.6, p97: 7.5, height_p50: 59.8 },
  { age: 4, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.3, p97: 8.2, height_p50: 62.1 },
  { age: 5, p3: 5.4, p15: 6.1, p50: 6.9, p85: 7.8, p97: 8.8, height_p50: 64.0 },
  { age: 6, p3: 5.7, p15: 6.5, p50: 7.3, p85: 8.2, p97: 9.3, height_p50: 65.7 },
  { age: 7, p3: 6.0, p15: 6.8, p50: 7.6, p85: 8.6, p97: 9.8, height_p50: 67.3 },
  { age: 8, p3: 6.3, p15: 7.0, p50: 7.9, p85: 9.0, p97: 10.2, height_p50: 68.7 },
  { age: 9, p3: 6.5, p15: 7.3, p50: 8.2, p85: 9.3, p97: 10.5, height_p50: 70.1 },
  { age: 10, p3: 6.7, p15: 7.5, p50: 8.5, p85: 9.6, p97: 10.9, height_p50: 71.5 },
  { age: 11, p3: 6.9, p15: 7.7, p50: 8.7, p85: 9.9, p97: 11.2, height_p50: 72.8 },
  { age: 12, p3: 7.0, p15: 7.9, p50: 8.9, p85: 10.1, p97: 11.5, height_p50: 74.0 },
];

export const INITIAL_DIARY_ENTRIES: HealthDiaryEntry[] = [
  {
    id: 'de_1',
    category: 'feeding',
    timestamp: '2026-11-11T08:30:00',
    loggedBy: 'Мама (Анна)',
    title: 'Завтрак: каша и пюре',
    details: 'Овсяная безмолочная каша 120г + яблочное пюре 30г. Аппетит отличный, запила водой.',
    value: 150,
    unit: 'г'
  },
  {
    id: 'de_2',
    category: 'sleep',
    timestamp: '2026-11-11T09:45:00',
    loggedBy: 'Мама (Анна)',
    title: 'Первый дневной сон',
    details: 'Уснула спокойно в кроватке с белым шумом. Проснулась в хорошем настроении.',
    value: 85,
    unit: 'мин'
  },
  {
    id: 'de_3',
    category: 'diaper',
    timestamp: '2026-11-11T11:20:00',
    loggedBy: 'Папа (Михаил)',
    title: 'Смена подгузника',
    details: 'Обычный стул, раздражений кожи нет, нанесён защитный крем с цинком.',
    value: 'Норма'
  },
  {
    id: 'de_4',
    category: 'temperature',
    timestamp: '2026-11-10T20:15:00',
    loggedBy: 'Мама (Анна)',
    title: 'Вечерний замер температуры',
    details: 'Измерение бесконтактным термометром перед сном. Спокойна.',
    value: 36.6,
    unit: '°C'
  },
  {
    id: 'de_5',
    category: 'medication',
    timestamp: '2026-11-11T09:00:00',
    loggedBy: 'Мама (Анна)',
    title: 'Витамин D3 (Аквадетрим)',
    details: 'Профилактическая доза 1000 МЕ (2 капли) во время утреннего кормления.',
    value: '1000 МЕ'
  },
  {
    id: 'de_6',
    category: 'mood',
    timestamp: '2026-11-10T16:00:00',
    loggedBy: 'Папа (Михаил)',
    title: 'Прогулка в парке',
    details: 'Активно разглядывала птиц и деревья, улыбалась прохожим, хорошее самочувствие.',
    value: 'Активная, веселая'
  }
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'ms_1',
    category: 'motor',
    title: 'Сидит уверенно без опоры',
    description: 'Малыш сохраняет равновесие сидя с прямой спиной, освобождая обе руки для игрушек.',
    ageRange: '6–8 месяцев',
    status: 'achieved',
    achievedDate: '2026-10-20',
    expertTip: 'Создавайте безопасное пространство на коврике с валиками или подушками вокруг.'
  },
  {
    id: 'ms_2',
    category: 'motor',
    title: 'Ползает на четвереньках',
    description: 'Перекрестное движение рук и ног (рука вперед, противоположное колено следом).',
    ageRange: '7–10 месяцев',
    status: 'in_progress',
    expertTip: 'Выкладывайте интересные игрушки чуть вне зоны прямой досягаемости.'
  },
  {
    id: 'ms_3',
    category: 'speech',
    title: 'Разнообразный лепет (ба-ба, ма-ма, та-та)',
    description: 'Повторение слогов с разной интонацией в диалоге со взрослым.',
    ageRange: '6–9 месяцев',
    status: 'achieved',
    achievedDate: '2026-10-05',
    expertTip: 'Повторяйте звуки малыша, делайте паузу и ждите его «ответа» — так формируется диалог.'
  },
  {
    id: 'ms_4',
    category: 'cognitive',
    title: 'Постоянство объекта («Ку-ку» и поиск)',
    description: 'Понимает, что спрятанный под платочком предмет продолжает существовать, и тянется снять ткань.',
    ageRange: '7–9 месяцев',
    status: 'achieved',
    achievedDate: '2026-10-28',
    expertTip: 'Играйте в прятки с любимой погремушкой под легкой пеленкой.'
  },
  {
    id: 'ms_5',
    category: 'social',
    title: 'Различает «своих» и «чужих»',
    description: 'Проявляет настороженность при появлении незнакомых взрослых, ищет взглядом маму или папу.',
    ageRange: '7–9 месяцев',
    status: 'achieved',
    achievedDate: '2026-09-30',
    expertTip: 'Это нормальный и важный этап здоровой привязанности — не настаивайте, чтобы ребенок шел на руки к незнакомцам.'
  },
  {
    id: 'ms_6',
    category: 'motor',
    title: 'Встает у опоры на ножки',
    description: 'Подтягивается руками за бортик кроватки или диван и выпрямляет ножки.',
    ageRange: '8–11 месяцев',
    status: 'in_progress',
    expertTip: 'Убедитесь, что мебель устойчива и углы закрыты защитными накладками.'
  },
  {
    id: 'ms_7',
    category: 'speech',
    title: 'Понимание простых слов («Где папа?», «Дай»)',
    description: 'Поворачивает голову в сторону называемого предмета или человека.',
    ageRange: '8–12 месяцев',
    status: 'in_progress',
    expertTip: 'Озвучивайте свои действия и называйте предметы простыми короткими фразами.'
  }
];

export const INITIAL_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'doc_1',
    title: 'Общий анализ крови (ОАК) развернутый',
    category: 'lab_tests',
    date: '2026-11-05',
    doctorName: 'Д-р Касымова А.С.',
    clinic: 'КДЛ «Олимп», г. Алматы',
    fileType: 'pdf',
    fileSize: '1.4 МБ',
    status: 'verified',
    ocrExtractedText: `КДЛ ОЛИМП. Пациент: Сабитова Алиса, 8 мес.
Гемоглобин (Hb): 118 г/л [Реф: 105 - 135]
Эритроциты (RBC): 4.2 x10^12/л [Реф: 3.7 - 4.9]
Лейкоциты (WBC): 7.8 x10^9/л [Реф: 6.0 - 14.0]
Тромбоциты (PLT): 310 x10^9/л [Реф: 200 - 450]
Нейтрофилы сегментоядерные: 28% [Реф: 20 - 40]
Лимфоциты: 62% [Реф: 50 - 70]
СОЭ (по Вестергрену): 4 мм/ч [Реф: 2 - 10]
Ферритин: 38 мкг/л [Реф: 25 - 120]`,
    aiSummary: 'Все основные показатели развернутого клинического анализа крови находятся в границах возрастной нормы для ребенка 8 месяцев. Признаков анемии или воспалительного процесса нет.',
    keyFindings: [
      { parameter: 'Гемоглобин', value: '118 г/л', normalRange: '105 – 135 г/л', isAbnormal: false, interpretation: 'В норме. Анемия исключена.' },
      { parameter: 'Лейкоциты', value: '7.8 × 10⁹/л', normalRange: '6.0 – 14.0 × 10⁹/л', isAbnormal: false, interpretation: 'В норме. Признаков инфекции нет.' },
      { parameter: 'Ферритин (запас железа)', value: '38 мкг/л', normalRange: '25 – 120 мкг/л', isAbnormal: false, interpretation: 'Достаточный тканевый запас железа.' },
      { parameter: 'Лимфоциты', value: '62%', normalRange: '50 – 70%', isAbnormal: false, interpretation: 'Физиологический детский лимфоцитоз (норма для 8 месяцев).' }
    ]
  },
  {
    id: 'doc_2',
    title: 'УЗИ тазобедренных суставов',
    category: 'ultrasound',
    date: '2026-06-15',
    doctorName: 'Д-р Омаров Е.К. (Врач УЗД)',
    clinic: 'Детский диагностический центр',
    fileType: 'pdf',
    fileSize: '2.8 МБ',
    status: 'verified',
    ocrExtractedText: `УЗИ тазобедренных суставов по Графу.
Возраст: 3 месяца.
Правый сустав: угол альфа 64°, угол бета 48°. Ядро окостенения визуализируется.
Левый сустав: угол альфа 63°, угол бета 49°. Ядро окостенения визуализируется.
Заключение: Тип 1А по Графу с обеих сторон (зрелые тазобедренные суставы, признаков дисплазии нет).`,
    aiSummary: 'Зрелые сформированные суставы (тип 1А). Дисплазия тазобедренных суставов полностью исключена.',
    keyFindings: [
      { parameter: 'Тип по Графу', value: 'Тип 1А (обе стороны)', normalRange: 'Тип 1А/1Б', isAbnormal: false, interpretation: 'Идеальное созревание вертлужных впадин.' }
    ]
  },
  {
    id: 'doc_3',
    title: 'Плановый осмотр невролога (6 месяцев)',
    category: 'doctor_notes',
    date: '2026-09-14',
    doctorName: 'Д-р Ибраева Ж.М. (Детский невролог)',
    clinic: 'Клиника «Мейірім»',
    fileType: 'pdf',
    fileSize: '950 КБ',
    status: 'verified',
    aiSummary: 'Нервно-психическое развитие полностью соответствует возрасту. Тонус мышц симметричный, сухожильные рефлексы живые, патологических знаков нет. Рекомендована гимнастика и плавание.',
    keyFindings: [
      { parameter: 'Мышечный тонус', value: 'Дистонии нет', normalRange: 'Нормотония', isAbnormal: false, interpretation: 'Симметричный физиологический тонус.' }
    ]
  },
  {
    id: 'doc_4',
    title: 'Вакцинальный сертификат (Форма 063/у)',
    category: 'vaccination',
    date: '2026-10-18',
    doctorName: 'Кабинет иммунопрофилактики',
    clinic: 'Городская поликлиника №4',
    fileType: 'pdf',
    fileSize: '1.9 МБ',
    status: 'verified',
    aiSummary: 'Вакцинация проводится строго по Национальному календарю прививок РК + рекомендованные международные вакцины (РотаТек, Превенар). Осложнений не зафиксировано.'
  }
];

export const INITIAL_VACCINATIONS: VaccinationItem[] = [
  { id: 'vac_1', vaccineName: 'БЦЖ (туберкулез)', diseaseTarget: 'Туберкулез', recommendedAge: 'В первые 1–4 дня', ageInMonths: 0, status: 'done', appliedDate: '2026-03-14', clinic: 'Городской перинатальный центр' },
  { id: 'vac_2', vaccineName: 'ВГВ-1 (Гепатит В)', diseaseTarget: 'Вирусный гепатит В', recommendedAge: 'В первые 12 часов', ageInMonths: 0, status: 'done', appliedDate: '2026-03-13', clinic: 'Городской перинатальный центр' },
  { id: 'vac_3', vaccineName: 'Гексаксим / Пентаксим (1-я доза)', diseaseTarget: 'Дифтерия, столбняк, коклюш, полиомиелит, гемофильная палочка', recommendedAge: '2 месяца', ageInMonths: 2, status: 'done', appliedDate: '2026-05-18', clinic: 'Клиника Мейірім' },
  { id: 'vac_4', vaccineName: 'Превенар 13 (1-я доза)', diseaseTarget: 'Пневмококковая инфекция', recommendedAge: '2 месяца', ageInMonths: 2, status: 'done', appliedDate: '2026-05-18', clinic: 'Клиника Мейірім' },
  { id: 'vac_5', vaccineName: 'РотаТек (1-я доза)', diseaseTarget: 'Ротавирусный гастроэнтерит', recommendedAge: '2 месяца', ageInMonths: 2, status: 'done', appliedDate: '2026-05-18', clinic: 'Клиника Мейірім' },
  { id: 'vac_6', vaccineName: 'Гексаксим / Пентаксим (2-я доза)', diseaseTarget: 'АКДС + ИПВ + ХИБ', recommendedAge: '3 месяца', ageInMonths: 3, status: 'done', appliedDate: '2026-06-20', clinic: 'Клиника Мейірім' },
  { id: 'vac_7', vaccineName: 'Гексаксим / Пентаксим (3-я доза)', diseaseTarget: 'АКДС + ИПВ + ХИБ', recommendedAge: '4.5 месяца', ageInMonths: 4.5, status: 'done', appliedDate: '2026-08-05', clinic: 'Клиника Мейірім' },
  { id: 'vac_8', vaccineName: 'Превенар 13 (2-я доза)', diseaseTarget: 'Пневмококковая инфекция', recommendedAge: '4.5 месяца', ageInMonths: 4.5, status: 'done', appliedDate: '2026-08-05', clinic: 'Клиника Мейірім' },
  { id: 'vac_9', vaccineName: 'КПК (Приорикс / М-М-Р II)', diseaseTarget: 'Корь, краснуха, эпидемический паротит', recommendedAge: '12 месяцев', ageInMonths: 12, status: 'planned', appliedDate: 'Запланировано на март 2027' }
];

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fm_1',
    name: 'Анна Сабитова',
    relationship: 'Мама',
    email: 'anna.sabitova@example.com',
    role: 'owner',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    lastActive: 'Сейчас в сети',
    joinedDate: '2026-03-01'
  },
  {
    id: 'fm_2',
    name: 'Михаил Сабитов',
    relationship: 'Папа',
    email: 'mikhail.sabitov@example.com',
    role: 'editor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    lastActive: '15 минут назад',
    joinedDate: '2026-03-01'
  },
  {
    id: 'fm_3',
    name: 'Елена Николаевна',
    relationship: 'Бабушка',
    email: 'elena.nik@example.com',
    role: 'viewer',
    avatarUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=256',
    lastActive: 'Вчера, 18:20',
    joinedDate: '2026-04-10'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'act_1', userId: 'fm_1', userName: 'Анна (Мама)', action: 'Добавила запись в дневник: Завтрак (каша 150г)', timestamp: '11 ноября 2026, 08:32', category: 'diary' },
  { id: 'act_2', userId: 'fm_2', userName: 'Михаил (Папа)', action: 'Внёс замер веса: 8.55 кг (8-й месяц)', timestamp: '10 ноября 2026, 19:40', category: 'measurement' },
  { id: 'act_3', userId: 'fm_1', userName: 'Анна (Мама)', action: 'Загрузила документ: ОАК развернутый (КДЛ Олимп)', timestamp: '5 ноября 2026, 14:15', category: 'document' },
  { id: 'act_4', userId: 'fm_1', userName: 'Анна (Мама)', action: 'Проверила симптом: Температура 37.1 после прорезывания зуба (Зеленый уровень)', timestamp: '2 ноября 2026, 11:05', category: 'symptom' },
  { id: 'act_5', userId: 'fm_1', userName: 'Анна (Мама)', action: 'Отметила навык: Постоянство объекта («Ку-ку»)', timestamp: '28 октября 2026, 16:50', category: 'diary' },
  { id: 'act_6', userId: 'fm_2', userName: 'Михаил (Папа)', action: 'Подтвердил получение напоминания: Приём витамина D3', timestamp: '28 октября 2026, 09:10', category: 'family' }
];

export const SAMPLE_AI_QUESTIONS = [
  'Расшифруй общий анализ крови ребенка 8 месяцев',
  'Что означает показатель ферритина 38 мкг/л?',
  'У малыша режутся зубки: температура 37.4, что делать?',
  'Как понять нормы прибавки веса по ВОЗ в 8 месяцев?',
  'Какие вопросы задать педиатру перед вакцинацией КПК?'
];
